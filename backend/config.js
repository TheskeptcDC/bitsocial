// config.js - Centralized configuration for the Sats-Social backend.

// This file stores all sensitive and environment-specific data.
// It is recommended to use environment variables for these values in a production environment.

// -----------------------------------------------------------
// 1. LND NODE CONFIGURATIONS
// -----------------------------------------------------------
// IMPORTANT: Replace the placeholders below with the actual connection details
// from your Polar LND nodes. You can find these in the "Connect" tab
// for each node in the Polar application.

// This configuration is for the LND node that will be receiving the "likes" (the creator).
const creatorLndConfig = {
    // The IP address and port of your creator LND node, e.g., '127.0.0.1:10001'
    lnd_grpc_url: '127.0.0.1:10001',
    // The TLS certificate, copied as a base64 encoded string.
    lnd_cert: 'LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUNQakNDQWVTZ0F3SUJBZ0lSQU5RTTlYc0FpeDhVckNNcmJGQXZhSGt3Q2dZSUtvWkl6ajBFQXdJd01URWYKTUIwR0ExVUVDaE1XYkc1a0lHRjFkRzluWlc1bGNtRjBaV1FnWTJWeWRERU9NQXdHQTFVRUF4TUZZV3hwWTJVdwpIaGNOTWpVd09EQTNNakl6TXpVeVdoY05Nall4TURBeU1qSXpNelV5V2pBeE1SOHdIUVlEVlFRS0V4WnNibVFnCllYVjBiMmRsYm1WeVlYUmxaQ0JqWlhKME1RNHdEQVlEVlFRREV3VmhiR2xqWlRCWk1CTUdCeXFHU000OUFnRUcKQ0NxR1NNNDlBd0VIQTBJQUJId1AxZENreGRNZmloU292eDRRd3I0VE1sMWxXajFkelczZXh1NlphbmlJM2o3TAoydFJBQWRoVVV4SDA4d2g1NjcvTnMwSzYybDNwOUlNWUdVYzlpaGVqZ2R3d2dka3dEZ1lEVlIwUEFRSC9CQVFECkFnS2tNQk1HQTFVZEpRUU1NQW9HQ0NzR0FRVUZCd01CTUE4R0ExVWRFd0VCL3dRRk1BTUJBZjh3SFFZRFZSME8KQkJZRUZGQ2FaQllyQTZqSHE1WnJMOEhQWmJFbjBNQ1FNSUdCQmdOVkhSRUVlakI0Z2dWaGJHbGpaWUlKYkc5agpZV3hvYjNOMGdnVmhiR2xqWllJT2NHOXNZWEl0YmpNdFlXeHBZMldDRkdodmMzUXVaRzlqYTJWeUxtbHVkR1Z5CmJtRnNnZ1IxYm1sNGdncDFibWw0Y0dGamEyVjBnZ2RpZFdaamIyNXVod1IvQUFBQmh4QUFBQUFBQUFBQUFBQUEKQUFBQUFBQUJod1NzRWdBRU1Bb0dDQ3FHU000OUJBTUNBMGdBTUVVQ0lFbVc0QjRKSlBrV1l4eE1lUzdZYnVDQgo4cHdaSDExMld4YTJRVnVDbzZlUUFpRUFpaTdtOUJTTjZmazN2OFozdVhTa1k1bWF1R1AvQlZHdG9WM3RIdTJGClc0dz0KLS0tLS1FTkQgQ0VSVElGSUNBVEUtLS0tLQo=',
    // The admin.macaroon, copied as a base64 encoded string.
    lnd_macaroon: 'AgEDbG5kAvgBAwoQQ019r+hmcd3f120XMj3TNBIBMBoWCgdhZGRyZXNzEgRyZWFkEgV3cml0ZRoTCgRpbmZvEgRyZWFkEgV3cml0ZRoXCghpbnZvaWNlcxIEcmVhZBIFd3JpdGUaIQoIbWFjYXJvb24SCGdlbmVyYXRlEgRyZWFkEgV3cml0ZRoWCgdtZXNzYWdlEgRyZWFkEgV3cml0ZRoXCghvZmZjaGFpbhIEcmVhZBIFd3JpdGUaFgoHb25jaGFpbhIEcmVhZBIFd3JpdGUaFAoFcGVlcnMSBHJlYWQSBXdyaXRlGhgKBnNpZ25lchIIZ2VuZXJhdGUSBHJlYWQAAAYgBIRxTx9ulxr4blm7XzfMQlvueASyiMtacxQuh8a1LOw=',
};

// This configuration is for the LND node that will be sending the "likes" (the liker).
const likerLndConfig = {
    // The IP address and port of your liker LND node, e.g., '127.0.0.1:10002'
    lnd_grpc_url: '127.0.0.1:10003',
    // The TLS certificate, copied as a base64 encoded string.
    lnd_cert: 'LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUNQakNDQWVPZ0F3SUJBZ0lRSFozeHlZbm5VSWhiUzB2Q2FoZ3V6akFLQmdncWhrak9QUVFEQWpBeE1SOHcKSFFZRFZRUUtFeFpzYm1RZ1lYVjBiMmRsYm1WeVlYUmxaQ0JqWlhKME1RNHdEQVlEVlFRREV3VmpZWEp2YkRBZQpGdzB5TlRBNE1EY3lNak16TlRKYUZ3MHlOakV3TURJeU1qTXpOVEphTURFeEh6QWRCZ05WQkFvVEZteHVaQ0JoCmRYUnZaMlZ1WlhKaGRHVmtJR05sY25ReERqQU1CZ05WQkFNVEJXTmhjbTlzTUZrd0V3WUhLb1pJemowQ0FRWUkKS29aSXpqMERBUWNEUWdBRWhHdk9UMnErNzk1dXptaGdMLzh5Vjhtdm1XQUk0eVJpdVROQTRvNnVIMFZNcHJlUwpacFVCWExnVUE4ZExxN29FR0d6T1E4eEVTVFh5NjlHQVIyUnRPcU9CM0RDQjJUQU9CZ05WSFE4QkFmOEVCQU1DCkFxUXdFd1lEVlIwbEJBd3dDZ1lJS3dZQkJRVUhBd0V3RHdZRFZSMFRBUUgvQkFVd0F3RUIvekFkQmdOVkhRNEUKRmdRVVdIVTBtUS9BbFJnRUY3N2dCTXVTUzVMSDA3TXdnWUVHQTFVZEVRUjZNSGlDQldOaGNtOXNnZ2xzYjJOaApiR2h2YzNTQ0JXTmhjbTlzZ2c1d2IyeGhjaTF1TXkxallYSnZiSUlVYUc5emRDNWtiMk5yWlhJdWFXNTBaWEp1CllXeUNCSFZ1YVhpQ0NuVnVhWGh3WVdOclpYU0NCMkoxWm1OdmJtNkhCSDhBQUFHSEVBQUFBQUFBQUFBQUFBQUEKQUFBQUFBR0hCS3dTQUFZd0NnWUlLb1pJemowRUF3SURTUUF3UmdJaEFLV2dHTlhxOHdyd2ZFemRmdXhyNFRlNApPbEVMWldzWU9BTzZYenlDcVVJa0FpRUF2dTBWREt0WGRmQXNCblJWaXJ2MDRRaEViK0NSaTZJQjVYcjIxYlJmCjRjaz0KLS0tLS1FTkQgQ0VSVElGSUNBVEUtLS0tLQo=',
    // The admin.macaroon, copied as a base64 encoded string.
    lnd_macaroon: 'AgEDbG5kAvgBAwoQBn6DOIxEPVz1zeeXC5avBRIBMBoWCgdhZGRyZXNzEgRyZWFkEgV3cml0ZRoTCgRpbmZvEgRyZWFkEgV3cml0ZRoXCghpbnZvaWNlcxIEcmVhZBIFd3JpdGUaIQoIbWFjYXJvb24SCGdlbmVyYXRlEgRyZWFkEgV3cml0ZRoWCgdtZXNzYWdlEgRyZWFkEgV3cml0ZRoXCghvZmZjaGFpbhIEcmVhZBIFd3JpdGUaFgoHb25jaGFpbhIEcmVhZBIFd3JpdGUaFAoFcGVlcnMSBHJlYWQSBXdyaXRlGhgKBnNpZ25lchIIZ2VuZXJhdGUSBHJlYWQAAAYgh9symIv5wwlZXdsKMBmvKenHDmpwWs9j1hBGtk/vKBU=',
};

// -----------------------------------------------------------
// 2. EXPORT CONFIGURATIONS
// -----------------------------------------------------------
// Export both configurations so they can be easily imported by other modules.
module.exports = {
    creatorLndConfig,
    likerLndConfig,
};
