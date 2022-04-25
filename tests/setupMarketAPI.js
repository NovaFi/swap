const assert = require("assert");
const anchor = require("@project-serum/anchor");
const BN = anchor.BN;
const OpenOrders = require("@project-serum/serum").OpenOrders;
const TOKEN_PROGRAM_ID = require("@solana/spl-token").TOKEN_PROGRAM_ID;
const serumCmn = require("@project-serum/common");

const { Market } = require("@project-serum/serum");
const { PublicKey } = require("@solana/web3.js");
const utils = require("./utils");

async function setupMarket(){

// Configure the client to use the local cluster.
 process.env.ANCHOR_PROVIDER_URL = "http://localhost:8899"
 process.env.ANCHOR_WALLET = "/Users/karima/.config/solana/id.json" 
anchor.setProvider(anchor.Provider.env());

// Swap program client.
const program = anchor.workspace.SerumSwap;

let ORDERBOOK_ENV = await utils.setupTwoMarkets({
    provider: program.provider,
  });

  return ORDERBOOK_ENV;
}

module.exports = {
    setupMarket
};