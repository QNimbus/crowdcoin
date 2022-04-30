
// Local imports
import web3 from '#ethereum/web3';
import CampaignFactory from '#ethereum/build/CampaignFactory.json';

const instance = new web3.eth.Contract(
  CampaignFactory.interface,
  '0x1E2Adcd4188C7d64B2c7F5031C0769Ae03baeECB');

export default instance;