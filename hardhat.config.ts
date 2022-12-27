import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require('dotenv').config("./.env");


const config: HardhatUserConfig = {
  networks: {
    hardhat: {},
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [`${process.env.PRIVATE_KEY}`],
    },
    testnet: {
      url: 'https://data-seed-prebsc-1-s1.binance.org:8545', // bsc testnet
      accounts: [`${process.env.PRIVATE_KEY}`],
    },
  },
  solidity:{ 
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
},
etherscan: {
  apiKey: process.env.ETHERSCAN_API_KEY, // Your Etherscan API key
},
};

export default config;
