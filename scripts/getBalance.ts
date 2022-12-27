import { ethers } from "hardhat";
require('dotenv').config("../.env");

const TOKEN_ETH = require("../artifacts/contracts/TokenEth.sol/TokenEth.json");
const TOKEN_BSC = require("../artifacts/contracts/TokenBsc.sol/TokenBsc.json");
const BRIDGE_ETH = require("../artifacts/contracts/BridgeEth.sol/BridgeEth.json");
const BRIDGE_BSC = require("../artifacts/contracts/BridgeBsc.sol/BridgeBsc.json");

export async function getBalance() {
  // providers 
  const providerEth = new ethers.providers.AlchemyProvider("goerli", process.env.ALCHEMY_API_KEY);
  const providerBsc = new ethers.providers.JsonRpcProvider(process.env.BSC_URL);
  const ADMIN_ADDR = process.env.CHAIN_ADDR;

  // Tokens
  const tokenEth = new ethers.Contract(`${process.env.TOKENETH_ADDR}`, TOKEN_ETH.abi, providerEth);
  const tokenBsc = new ethers.Contract(`${process.env.TOKENBSC_ADDR}`, TOKEN_BSC.abi, providerBsc); 

  console.log(`ETH bal: `, ethers.utils.formatUnits(await tokenEth.balanceOf(ADMIN_ADDR)));
  console.log(`BSC bal: `, ethers.utils.formatUnits(await tokenBsc.balanceOf(ADMIN_ADDR))); 
}

getBalance().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});