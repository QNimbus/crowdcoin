// Third party imports
const Web3 = require('web3');
const HDWalletProvider = require('@truffle/hdwallet-provider');

// Local imports
const { interface, bytecode } = require('./build/CampaignFactory.json');

// Local constants
const ACCOUNT_MNEMONIC = 'camera million rely elder sphere tide later fan father connect onion glare';
const RINKEBY_TEST_NETWORK = 'https://rinkeby.infura.io/v3/964b24ae1ff84435bbf60ff03ddc2843';
const GASLIMIT = 2 * (10 ** 6);
const provider = new HDWalletProvider(ACCOUNT_MNEMONIC, RINKEBY_TEST_NETWORK);
const web3 = new Web3(provider);

const deploy = async () => {
  try {
    const [managerAccount] = await web3.eth.getAccounts();

    console.log(`Attempting to deploy from account: ${managerAccount}`);

    // Use one of those accounts to deploy contract
    const result = await new web3.eth.Contract(interface) // Load contract interface
      .deploy({ data: bytecode })                         // Creates transaction object
      .send({ from: managerAccount, gas: GASLIMIT });     // Send transaction to the network

    console.log(`Contract deployed to: ${result.options.address}`);

  } catch (err) {
    console.error(err);
  } finally {
    provider.engine.stop();
  }

}

deploy();
