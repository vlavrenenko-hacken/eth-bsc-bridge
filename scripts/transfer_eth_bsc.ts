import { ethers } from "hardhat";
import { token } from "../typechain-types/@openzeppelin/contracts";
require('dotenv').config("../.env");

const BRIDGE_ETH = require("../artifacts/contracts/BridgeEth.sol/BridgeEth.json");

export async function transferEthBsc() {
  // provider
  const providerEth = new ethers.providers.AlchemyProvider("goerli", process.env.ALCHEMY_API_KEY);
  const walletEth = new ethers.Wallet(`${process.env.PRIVATE_KEY}`, providerEth);
  const walletSignerEth = walletEth.connect(providerEth);

  // Bridges
  const bridgeEth = new ethers.Contract(`${process.env.TOKENETH_BRIDGE_ADDR}`, BRIDGE_ETH.abi, providerEth);
  
  // Transfering 1 token
  const tx = await bridgeEth.connect(walletSignerEth).burn(process.env.CHAIN_ADDR, ethers.utils.parseEther("1")); 
  await tx.wait();
}

transferEthBsc().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });