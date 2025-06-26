const Web3 = require('web3');

const providerURL = process.env.WEB3_PROVIDER || 'http://localhost:8545';
const web3 = new Web3(providerURL);

module.exports = web3;
