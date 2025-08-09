// lnd.js - LND gRPC client setup.

// This module initializes and exports the LND gRPC clients
// for both the creator and liker nodes, as well as the
// creator's public key to avoid a separate API call.

// -----------------------------------------------------------
// 1. IMPORT DEPENDENCIES AND CONFIGURATION
// -----------------------------------------------------------
const { authenticatedLndGrpc } = require('ln-service');
const { creatorLndConfig, likerLndConfig } = require('./config');

// -----------------------------------------------------------
// 2. INITIALIZE LND CLIENTS
// -----------------------------------------------------------
// Use the ln-service library to create a gRPC client for each node.
let lndCreator;
let lndLiker;
let creatorPublicKey;

try {
    // We get both the LND client and the public key directly from this call.
    const { lnd, node_key } = authenticatedLndGrpc({
        socket: creatorLndConfig.lnd_grpc_url,
        cert: creatorLndConfig.lnd_cert,
        macaroon: creatorLndConfig.lnd_macaroon,
    });
    lndCreator = lnd;
    creatorPublicKey = '025f8468a329fe3d956709f6e6b4d2f326ebf157a6e770c62e10885cd0f6d62b9b';//node_key;
    //check if creatorPublicKey is valid
    if (!creatorPublicKey) {
        throw new Error('Failed to retrieve creator public key.');
    }

    // Connect to the liker's LND node.
    lndLiker = authenticatedLndGrpc({
        socket: likerLndConfig.lnd_grpc_url,
        cert: likerLndConfig.lnd_cert,
        macaroon: likerLndConfig.lnd_macaroon,
    }).lnd;
    
    console.log('Successfully connected to LND nodes.');

} catch (error) {
    console.error('Failed to connect to LND nodes. Please check your credentials in config.js.', error);
    // If the connection fails, it's a critical error, so we exit the application.
    process.exit(1); 
}

// -----------------------------------------------------------
// 3. EXPORT CLIENTS AND PUBLIC KEY
// -----------------------------------------------------------
// Export the initialized clients and the creator's public key.
module.exports = {
    lndCreator,
    lndLiker,
    creatorPublicKey,
};
