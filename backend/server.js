// server.js - Backend for Sats-Social, handling posts and Lightning payments.

// This version of the server now uses a persistent JSON file for user data
// and includes endpoints for user login and account creation.

// First, you need to install the necessary packages.
// Open your terminal and run:
// npm install express ln-service cors crypto

// -----------------------------------------------------------
// 1. IMPORT DEPENDENCIES AND CUSTOM MODULES
// -----------------------------------------------------------
const express = require('express');
const { createInvoice, pay, openChannel } = require('ln-service');
const cors = require('cors'); // Import the CORS middleware
const crypto = require('crypto'); // Import crypto for generating unique IDs
const fs = require('fs').promises; // Use the promises version of fs for async/await
const path = require('path');
const { lndCreator, lndLiker, creatorPublicKey } = require('./lnd');


// -----------------------------------------------------------
// 2. FILE-BASED "DATABASE" SETUP
// -----------------------------------------------------------
const USERS_FILE = path.join(__dirname, 'users.json');

// Helper function to read the user data from the JSON file
const readUsersFile = async () => {
    try {
        const data = await fs.readFile(USERS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // If the file doesn't exist, return a new empty object.
        if (error.code === 'ENOENT') {
            console.warn('users.json file not found, creating a new one.');
            return {};
        }
        console.error('Error reading users file:', error);
        return {};
    }
};

// Helper function to write the user data to the JSON file
const writeUsersFile = async (data) => {
    try {
        await fs.writeFile(USERS_FILE, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error('Error writing users file:', error);
    }
};


// -----------------------------------------------------------
// 3. IN-MEMORY DATA
// -----------------------------------------------------------
let users = {};
const userBalances = {};
const followers = {};
const posts = [
    {
        id: 1,
        title: 'Welcome to Sats-Social!',
        content: 'This is the first post on our new platform.',
        sats_received: 0,
        creatorPublicKey: creatorPublicKey,
    },
];

// Initialize database on server startup
(async () => {
    users = await readUsersFile();
    console.log('User database loaded successfully.');
})();


// -----------------------------------------------------------
// 4. EXPRESS APPLICATION SETUP
// -----------------------------------------------------------
const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// A simple middleware for logging requests
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// -----------------------------------------------------------
// 5. API ROUTES
// -----------------------------------------------------------

// POST /account/create - Register a new user with a pre-created node.
app.post('/account/create', async (req, res) => {
    const { userId, publicKey, password } = req.body;
    if (!userId || !publicKey || !password) {
        return res.status(400).json({ error: 'userId, publicKey, and password are required.' });
    }

    if (users[userId]) {
        return res.status(409).json({ error: 'User ID already exists.' });
    }

    // In a real app, you would hash the password. For this example, we'll store it as plain text.
    users[userId] = { publicKey, password };
    await writeUsersFile(users);

    console.log(`New account created: ${userId}`);
    return res.status(201).json({ message: 'Account created successfully.', userId });
});


// POST /account/login - Log in a user.
app.post('/account/login', async (req, res) => {
    const { userId, password } = req.body;
    const user = users[userId];

    if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Invalid userId or password.' });
    }

    // In a real app, you would issue a JWT token here.
    return res.status(200).json({ message: 'Login successful.', publicKey: user.publicKey });
});


// GET /posts - Get all posts with their satoshi counts
app.get('/posts', (req, res) => {
    return res.status(200).json(posts);
});

// POST /posts - Create a new post
app.post('/posts', (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required.' });
    }
    const newPost = {
        id: posts.length + 1,
        title,
        content,
        sats_received: 0,
        creatorPublicKey: creatorPublicKey,
    };
    posts.push(newPost);
    return res.status(201).json(newPost);
});

// POST /follow/:creatorId - A liker follows a creator by opening a channel.
app.post('/follow/:creatorPublicKey', async (req, res) => {
    const { creatorPublicKey } = req.params;
    
    // In a real app, the liker's public key would come from the user's session
    // or authentication token. For this example, it remains hardcoded.
    const likerPublicKey = '0334860b2964177d54407b71569ce4599a1f59266f851726a798f79f8260f84a4a';

    // Check if the liker is already following the creator
    if (followers[likerPublicKey] && followers[likerPublicKey].includes(creatorPublicKey)) {
        return res.status(200).json({ message: 'Already following this creator.' });
    }

    try {
        const channelDetails = await openChannel({
            lnd: lndLiker,
            local_tokens: 20000,
            partner_public_key: creatorPublicKey,
            is_private: true,
        });
        
        if (!followers[likerPublicKey]) {
            followers[likerPublicKey] = [];
        }
        followers[likerPublicKey].push(creatorPublicKey);
        
        console.log('Channel opened successfully:', channelDetails);

        return res.status(200).json({
            message: `Successfully followed and opened a channel to ${creatorPublicKey}`,
            channel: channelDetails,
        });

    } catch (error) {
        console.error('Failed to open channel:', error);
        return res.status(500).json({ error: 'Failed to open channel.' });
    }
});


// POST /sats/:postId - Send 1 satoshi to a post's creator
app.post('/sats/:postId', async (req, res) => {
    const { postId } = req.params;
    const post = posts.find(p => p.id === parseInt(postId));
    
    if (!post) {
        return res.status(404).json({ error: 'Post not found.' });
    }
    
    // In a real app, the liker's public key would come from the user's session.
    const likerPublicKey = '0334860b2964177d54407b71569ce4599a1f59266f851726a798f79f8260f84a4a';
    const followedCreators = followers[likerPublicKey] || [];
    if (!followedCreators.includes(post.creatorPublicKey)) {
        return res.status(403).json({ error: 'You must follow the creator of this post to send a satoshi.' });
    }

    const amountMsat = 1000;

    try {
        const invoice = await createInvoice({
            lnd: lndCreator,
            mtokens: amountMsat.toString(),
            description: `Satoshi tip for post ID ${postId}`,
        });
        
        console.log(`Invoice created: ${invoice.request}`);

        const paymentResult = await pay({
            lnd: lndLiker,
            request: invoice.request,
        });

        console.log('Payment successful:', paymentResult);

        post.sats_received += 1;
        userBalances[creatorPublicKey] = (userBalances[creatorPublicKey] || 0) + 1;
        
        console.log(`Post ID ${postId} has received a new satoshi. Total sats: ${post.sats_received}`);

        return res.status(200).json({
            message: 'Satoshi sent successfully!',
            post_id: post.id,
            total_sats: post.sats_received,
        });

    } catch (error) {
        console.error('Failed to send satoshi:', error);
        return res.status(500).json({ error: 'Failed to send satoshi.' });
    }
});

// -----------------------------------------------------------
// 6. START THE SERVER
// -----------------------------------------------------------
app.listen(PORT, () => {
    console.log(`Sats-Social backend listening on port ${PORT}`);
});
