// truffle-config.js
const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config();

module.exports = {
  networks: {
    base_testnet: {
      provider: () =>
        new HDWalletProvider(process.env.PRIVATE_KEY, 'https://goerli.base.org'),
      network_id: 84531, // Base Goerli testnet network ID
      gas: 5000000,
      gasPrice: 1000000000,
    },
  },
  compilers: {
    solc: {
      version: '0.8.0', // Solidity version
    },
  },
};
