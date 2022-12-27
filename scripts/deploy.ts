import { ethers } from "hardhat";
require('dotenv').config("../.env");
import {transferEthBsc} from "./transfer_eth_bsc";

async function deploy() {
  // providers 
  const providerEth = new ethers.providers.AlchemyProvider("goerli", process.env.ALCHEMY_API_KEY);
  const walletEth = new ethers.Wallet(`${process.env.PRIVATE_KEY}`, providerEth);
  const walletSignerEth = walletEth.connect(providerEth);

  const providerBsc = new ethers.providers.JsonRpcProvider(process.env.BSC_URL);
  const walletBsc = new ethers.Wallet(`${process.env.PRIVATE_KEY}`, providerBsc);
  const walletSignerBsc = walletBsc.connect(providerBsc);

  // tokens
  const TokenEth = await ethers.getContractFactory("TokenEth");
  const tokenEth = await TokenEth.connect(walletSignerEth).deploy();
  await tokenEth.deployed();
  
  const TokenBsc = await ethers.getContractFactory("TokenBsc");
  const tokenBsc = await TokenBsc.connect(walletSignerBsc).deploy();
  await tokenBsc.deployed();

  // bridges
  const BridgeEth = await ethers.getContractFactory("BridgeEth");
  const bridgeEth = await BridgeEth.connect(walletSignerEth).deploy(tokenEth.address);
  await bridgeEth.deployed();

  const BridgeBsc = await ethers.getContractFactory("BridgeBsc");
  const bridgeBsc = await BridgeBsc.connect(walletSignerBsc).deploy(tokenBsc.address);
  await bridgeBsc.deployed();

  await tokenEth.connect(walletSignerEth).mint(walletSignerEth.address, ethers.utils.parseEther("100"));

  // Transfering admin rights to EthBridgeContract
  await tokenEth.connect(walletSignerEth).updateAdmin(bridgeEth.address);

  // Transfering admin rights to BscBridgeContract
  await tokenBsc.connect(walletSignerBsc).updateAdmin(bridgeBsc.address);

  console.log("EthToken was successfully deployed to: ", tokenEth.address);
  console.log("BscToken was successfully deployed to: ", tokenBsc.address);
  console.log("Eth bridge was successfully deployed to: ", bridgeEth.address);
  console.log("Bsc bridge was successfully deployed to: ", bridgeBsc.address); 
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
deploy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
