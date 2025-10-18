import { resolver } from '@forge/agents';

// Define a simple resolver for testing connectivity
resolver.define('testConnection', async () => {
  return {
    status: 'success',
    message: 'Forge Agent backend is connected and responding!'
  };
});