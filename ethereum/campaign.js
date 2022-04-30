
// Local imports
import web3 from '#ethereum/web3';
import Campaign from '#ethereum/build/Campaign.json';

export const getCampaign = (address) => {
  return new web3.eth.Contract(
    Campaign.interface,
    address);
};