import { ethers } from "hardhat";
import { token } from "../typechain-types/@openzeppelin/contracts";
require('dotenv').config("../.env");

const BRIDGE_BSC = require("../artifacts/contracts/BridgeBsc.sol/BridgeBsc.json");

export async function transferBscEth() {
  // provider
  const providerBsc = new ethers.providers.JsonRpcProvider(process.env.BSC_URL);
  const walletBsc = new ethers.Wallet(`${process.env.PRIVATE_KEY}`, providerBsc);
  const walletSignerBsc = walletBsc.connect(providerBsc);

  // Bridge
  const bridgeBsc = new ethers.Contract(`${process.env.TOKENBSC_BRIDGE_ADDR}`, BRIDGE_BSC.abi,  providerBsc);

  // Transfering 1 token
  const tx = await bridgeBsc.connect(walletSignerBsc).burn(process.env.CHAIN_ADDR, ethers.utils.parseEther("1"));  
  await tx.wait();
}

transferBscEth().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });