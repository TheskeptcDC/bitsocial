import MenuBar from './components/MenuBar';
import React, { useState, useEffect } from 'react';
import './App.css'; // Assuming this exists for any custom styles.
import PostsPage from './pages/PostsPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import NewPostForm from './components/NewPostForm';

// Post component moved to components/Post.jsx

// This is the main application component.
export default function App() {
  const [showSignup, setShowSignup] = useState(false);
  const [signupError, setSignupError] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const handleLogin = async (username, password) => {
    // Call backend login API
    try {
      const response = await fetch('http://localhost:3000/account/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: username, password })
      });
      if (!response.ok) throw new Error('Invalid credentials');
      setLoggedIn(true);
    } catch (err) {
      alert('Login failed: ' + err.message);
    }
  };

  const handleSignup = async (name, password, pubkey) => {
    // Call backend signup API
    try {
      const response = await fetch('http://localhost:3000/account/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: name, password, publicKey: pubkey })
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Signup failed');
      }
      setShowSignup(false);
      setSignupError('');
      alert('Account created! You can now log in.');
    } catch (err) {
      setSignupError(err.message);
    }
  };
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState('home');
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [followRequiredPostId, setFollowRequiredPostId] = useState(null); // Tracks the ID of the post that needs a follow.
  const [following, setFollowing] = useState(false); // New state to track if we are following.

  // Fetch posts from the backend on component mount.
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/posts');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      setError('Failed to fetch posts.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handles submitting a new post to the backend.
  const handleNewPostSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      });
      if (!response.ok) {
        throw new Error('Failed to create post');
      }
      setNewPost({ title: '', content: '' });
      fetchPosts(); // Refresh posts to show the new one.
    } catch (err) {
      console.error('Error creating post:', err);
    }
  };

  // Handles the "like" action, sending a satoshi to the post's creator.
  const handleLike = async (postId, creatorPublicKey) => {
    try {
      // Reset the follow required state on a new attempt.
      setFollowRequiredPostId(null);
      const response = await fetch(`http://localhost:3000/sats/${postId}`, { method: 'POST' });
      
      // Check for the 403 Forbidden error specifically.
      if (response.status === 403) {
        setFollowRequiredPostId(postId); // Set the ID of the post that needs a follow.
        console.log('Follow required to like this post.');
        return; // Exit the function to prevent further processing.
      }
      
      if (!response.ok) {
        throw new Error('Failed to send satoshi.');
      }
      
      console.log(`Successfully liked post ${postId}`);
      fetchPosts(); // Refresh posts to show the updated satoshi count.
    } catch (err) {
      setError(`Failed to like post: ${err.message}`);
      console.error(err);
    }
  };

  // Handles the "follow" action, opening a channel.
  const handleFollow = async (creatorPublicKey) => {
    try {
      const response = await fetch(`http://localhost:3000/follow/${creatorPublicKey}`, { method: 'POST' });
      if (!response.ok) {
        throw new Error('Failed to follow creator.');
      }
      
      const result = await response.json();
      console.log(result.message);
      
      // Assume success and update the UI to show we are now following.
      setFollowing(true);
      setFollowRequiredPostId(null); // Reset the follow required state.
      
      // Optionally, you might want to wait for a while before letting the user "like"
      // to give the channel time to be confirmed.
    } catch (err) {
      setError(`Failed to follow creator: ${err.message}`);
      console.error(err);
    }
  };

  if (loading) return <div className="text-center py-8 text-gray-400">Loading posts...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <div className="bg-gray-900 min-h-screen p-8 font-sans text-white">
      {loggedIn ? (
        <>
          <MenuBar setPage={setPage} />
          <div className="container mx-auto max-w-3xl">
            {page === 'home' ? (
              <HomePage
                newPost={newPost}
                setNewPost={setNewPost}
                handleNewPostSubmit={handleNewPostSubmit}
              />
            ) : null}
            {page === 'posts' ? (
              <PostsPage
                posts={posts}
                onLike={handleLike}
                onFollow={handleFollow}
                followRequiredPostId={followRequiredPostId}
                following={following}
              />
            ) : null}
          </div>
        </>
      ) : showSignup ? (
        <>
          <SignupPage onSignup={handleSignup} />
          {signupError && <div className="signup-error" style={{ textAlign: 'center' }}>{signupError}</div>}
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <button className="login-button" onClick={() => setShowSignup(false)}>Back to Login</button>
          </div>
        </>
      ) : (
        <>
          <LoginPage onLogin={handleLogin} />
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <button className="signup-button" onClick={() => setShowSignup(true)}>Create Account</button>
          </div>
        </>
      )}
    </div>
  );
}
