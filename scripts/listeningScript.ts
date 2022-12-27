import { ethers } from "hardhat";
import { token } from "../typechain-types/@openzeppelin/contracts";
require('dotenv').config("../.env");

const TOKEN_ETH = require("../artifacts/contracts/TokenEth.sol/TokenEth.json");
const TOKEN_BSC = require("../artifacts/contracts/TokenBsc.sol/TokenBsc.json");
const BRIDGE_ETH = require("../artifacts/contracts/BridgeEth.sol/BridgeEth.json");
const BRIDGE_BSC = require("../artifacts/contracts/BridgeBsc.sol/BridgeBsc.json");

import {getBalance} from "./getBalance";

async function listen() {
    const providerEth = new ethers.providers.WebSocketProvider(`wss://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_WEB_SOCKET}`);
    const walletEth = new ethers.Wallet(`${process.env.PRIVATE_KEY}`, providerEth);
    const walletSignerEth = walletEth.connect(providerEth);
  
    const providerBsc = new ethers.providers.JsonRpcProvider(process.env.BSC_URL);
    const walletBsc = new ethers.Wallet(`${process.env.PRIVATE_KEY}`, providerBsc);
    const walletSignerBsc = walletBsc.connect(providerBsc);
  
    // Tokens
    const tokenEth = new ethers.Contract(`${process.env.TOKENETH_ADDR}`, TOKEN_ETH.abi, providerEth);
    const tokenBsc = new ethers.Contract(`${process.env.TOKENBSC_ADDR}`, TOKEN_BSC.abi, providerBsc); 
  
    // Bridges
    const bridgeEth = new ethers.Contract(`${process.env.TOKENETH_BRIDGE_ADDR}`, BRIDGE_ETH.abi, providerEth);
    const bridgeBsc = new ethers.Contract(`${process.env.TOKENBSC_BRIDGE_ADDR}`, BRIDGE_BSC.abi,  providerBsc);
    
    console.log("Listening to the ETH-BSC bridge...");

    bridgeEth.on("Send", async(from, to, amount, date, nonce) => {
      console.log(`Sending tokens to BSC chain to ${to}`);
      const tx = await bridgeBsc.connect(walletSignerBsc).mint(to, amount, nonce);
      await tx.wait();
      console.log(`Transfered ${ethers.utils.formatUnits(amount)} from ${from} to ${to} nonce ${nonce}  ETH->BSC`);
      getBalance();
    });

    bridgeBsc.on("Send", async(from, to, amount, date, nonce) => {
      console.log(`Sending tokens to ETH chain to ${to}`);
      const tx = await bridgeEth.connect(walletSignerEth).mint(to, amount, nonce);
      await tx.wait();
      console.log(`Transfered ${ethers.utils.formatUnits(amount)} from ${from} to ${to} nonce ${nonce} BSC->ETH`);
      getBalance();
    });
}

listen().catch(error => {
  console.error(error);
  process.exit(1);
});;