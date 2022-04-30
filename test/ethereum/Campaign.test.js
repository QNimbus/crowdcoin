// Node imports
const assert = require('assert');

// Third party imports
const Web3 = require('web3');
const ganache = require('ganache-cli');

// Local imports
const compiledCampaign = require('../../ethereum/build/Campaign.json');
const compiledCampaignFactory = require('../../ethereum/build/CampaignFactory.json');

// Local constants
const GASLIMIT = 2 * (10 ** 6);
const minimumContribution = 100;

const provider = ganache.provider({ gasLimit: GASLIMIT + 1 });
const web3 = new Web3(provider);

let accounts;
let campaignManager;
let approvers;
let factory;
let campaign;
let campaignAddress;

beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts();
  [campaignManager, ...approvers] = accounts;

  // // Use one of those accounts to deploy contract
  let { interface, bytecode } = compiledCampaignFactory;

  factory = await new web3.eth.Contract(interface)    // Load contract interface
    .deploy({ data: bytecode })                       // Creates transaction object
    .send({ from: campaignManager, gas: GASLIMIT });  // Send transaction to the network

  // Create campaign contract
  await factory.methods.createCampaign(minimumContribution).send({
    from: campaignManager, gas: GASLIMIT
  });

  // Retrieve newly created campaign address
  [campaignAddress] = await factory.methods.getDeployedCampaigns().call()

  // Retrieve newly created campaign
  campaign = await new web3.eth.Contract(compiledCampaign.interface, campaignAddress);
});

describe('Campaigns', () => {
  it('deploys a factory and a campaign contact', () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it('marks caller as the campaign manager', async () => {
    const manager = await campaign.methods.manager().call();

    assert.equal(manager, campaignManager);
  });

  it('allows people to contribute money and marks them as approvers', async () => {
    let [contributor] = approvers;

    await campaign.methods.contribute().send({
      from: contributor,
      value: minimumContribution + 1,
    });

    const isContributor = await campaign.methods.approvers(contributor).call();

    assert(isContributor);
  });

  it('requires a minimum contribution', async () => {
    let [contributor] = approvers;

    try {
      await campaign.methods.contribute().send({
        from: contributor,
        value: minimumContribution - 1,
      });

      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it('allows a manager to make a payment request', async () => {
    let paymentRequestDescription = 'Buy batteries';

    await campaign.methods.createRequest(paymentRequestDescription, 100, accounts[1])
      .send({
        from: campaignManager,
        gas: GASLIMIT
      });

    const { description } = await campaign.methods.requests(0).call();

    assert.equal(paymentRequestDescription, description);
  });

  it('processes requests', async () => {
    let paymentRequestDescription = 'Buy batteries';
    let requestAmount = 5.0;
    let balanceStart = await web3.eth.getBalance(accounts[1]);
    balanceStart = parseFloat(web3.utils.fromWei(balanceStart, 'ether'));

    // Contribute to campaing
    await campaign.methods.contribute().send({
      from: campaignManager,
      value: web3.utils.toWei('10', 'ether')
    });

    // Create campaign request
    await campaign.methods.createRequest(
      paymentRequestDescription,
      web3.utils.toWei(requestAmount.toString(), 'ether'),
      accounts[1]).send({
        from: campaignManager,
        gas: GASLIMIT
      });

    // Vote for campaign request
    await campaign.methods.approveRequest(0).send({
      from: campaignManager,
      gas: GASLIMIT
    });

    // Finalize request
    await campaign.methods.finalizeRequest(0).send({
      from: campaignManager,
      gas: GASLIMIT
    });

    // Calculate account balance after request has been finalized
    let balanceEnd = await web3.eth.getBalance(accounts[1]);
    balanceEnd = parseFloat(web3.utils.fromWei(balanceEnd, 'ether'));

    // Assert money has been transfered
    assert(Math.abs(balanceEnd - balanceStart - requestAmount) == 0);
  })
});