const MnemonicWalletSubprovider = require('@0x/subproviders').MnemonicWalletSubprovider;
const RPCSubprovider = require('web3-provider-engine/subproviders/rpc.js');
const Web3ProviderEngine = require('web3-provider-engine');

const secret = require('./secret.js')

const mnemonicWalletSubprovider = new MnemonicWalletSubprovider({
  mnemonic: secret.default.MNEMONIC,
});

class ProviderEngine {
  /**
   * Constructs a new provider engine base on the provider string.
   * @param {String} provider_string - rpcUrl
   */
  constructor(provider_string) {
    var infuraRpcSubprovider = new RPCSubprovider({
      rpcUrl: provider_string//"https://mainnet.infura.io/v3/" + INFURA_KEY
    });
    this.providerEngine = new Web3ProviderEngine();
    this.providerEngine.addProvider(mnemonicWalletSubprovider);
    this.providerEngine.addProvider(infuraRpcSubprovider);
  }

  /**
   * Stops the provider engine's block polling. And creates a new one based on the new provider string.
   * @param {String} provider_string - rpcUrl
   */
  reset(provider_string) {
    this.stop();
    var infuraRpcSubprovider = new RPCSubprovider({
      rpcUrl: provider_string//"https://mainnet.infura.io/v3/" + INFURA_KEY
    });
    this.providerEngine = new Web3ProviderEngine();
    this.providerEngine.addProvider(mnemonicWalletSubprovider);
    this.providerEngine.addProvider(infuraRpcSubprovider);
    this.start();
  }

  /**
   * Start the provider engine's block polling.
   */
  start() {
    this.providerEngine.start();
  }

  /**
   * Stop the provider engine's block polling.
   */
  stop() {
    this.providerEngine.stop();
  }
}
module.exports = ProviderEngine;