import Web3 from "web3";

let provider;

// Are we client-side -AND- running MetaMask? (browser)
if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  window.ethereum.request({ method: "eth_requestAccounts" });
  provider = window.ethereum;
}
// We are server-side -OR- user is not running MetaMask
else {
  // We are on the server *OR* the user is not running metamask
  provider = new Web3.providers.HttpProvider(
    'https://rinkeby.infura.io/v3/964b24ae1ff84435bbf60ff03ddc2843'
  );
}

const web3 = new Web3(provider);

export default web3;

/**
 * 
// You should only attempt to request the user's accounts in response to user
// interaction, such as a button click.
// Otherwise, you popup-spam the user like it's 1999.
// If you fail to retrieve the user's account(s), you should encourage the user
// to initiate the attempt.
document.getElementById('connectButton', connect);

// While you are awaiting the call to eth_requestAccounts, you should disable
// any buttons the user can click to initiate the request.
// MetaMask will reject any additional requests while the first is still
// pending.
function connect() {
  ethereum
    .request({ method: 'eth_requestAccounts' })
    .then(handleAccountsChanged)
    .catch((err) => {
      if (err.code === 4001) {
        // EIP-1193 userRejectedRequest error
        // If this happens, the user rejected the connection request.
        console.log('Please connect to MetaMask.');
      } else {
        console.error(err);
      }
    });
}

 */