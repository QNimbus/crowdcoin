// Node imports
const path = require('path');
const fs = require('fs-extra');

// Third party imports
const solc = require('solc');

// Constants
const contractName = 'Campaign';
const buildPath = path.resolve(__dirname, 'build');
const campaignPath = path.resolve(__dirname, 'contracts', `${contractName}.sol`);
const source = fs.readFileSync(campaignPath, 'utf8');

// Empty 'build' folder if it exists
fs.removeSync(buildPath);
fs.ensureDirSync(buildPath);

const compilerInput = JSON.stringify({
  language: 'Solidity',
  sources: { [`${contractName}.sol`]: { content: source } },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*']
      }
    }
  }
});

const compilerOutput = JSON.parse(solc.compile(compilerInput)).contracts[`${contractName}.sol`];

// Output json for all contracts in Campaign.sol file
for (let contract in compilerOutput) {
  const { abi: interface, evm: { bytecode: { object: bytecode } } } = compilerOutput[contract];

  fs.outputJSONSync(
    path.resolve(buildPath, `${contract}.json`),
    { interface, bytecode });
}