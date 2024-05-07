const {
  createPublicClient,
  createTestClient,
  createWalletClient,
  http,
  formatTransactionRequest,
} = require("viem");

// this is overriden - to clean up
const anvil = {
  id: 1337,
  rpcUrls: {
    // These rpc urls are automatically used in the transports.
    default: {
      // Note how we append the worker id to the local rpc urls.
      http: [`http://127.0.0.1:8545/1`],
      webSocket: [`ws://127.0.0.1:8545/1`],
    },
    public: {
      // Note how we append the worker id to the local rpc urls.
      http: [`http://127.0.0.1:8545/1`],
      webSocket: [`ws://127.0.0.1:8545/1`],
    },
  },
}

function createAnvilClients(instance) {
  const publicClient = createPublicClient({
    chain: anvil,
    transport: http(`http://${instance.host}:${instance.port}`),
  }).extend(client => ({
    async traceCall(args) {
      return client.request({
        method: 'debug_traceCall',
        params: [formatTransactionRequest(args), 'latest', {}]
      })
    }
  }));

  // the above extends capabilities to support traceCall method
  // which can be used later on like this

  const testClient = createTestClient({
    chain: anvil,
    mode: "anvil",
    transport: http(`http://${instance.host}:${instance.port}`),
  });

  const walletClient = createWalletClient({
    chain: anvil,
    transport: http(`http://${instance.host}:${instance.port}`),
  });

  return { publicClient, testClient, walletClient };
}

module.exports = { createAnvilClients };