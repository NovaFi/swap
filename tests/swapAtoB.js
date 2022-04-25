const assert = require("assert");
const anchor = require("@project-serum/anchor");
const BN = anchor.BN;
const OpenOrders = require("@project-serum/serum").OpenOrders;
const TOKEN_PROGRAM_ID = require("@solana/spl-token").TOKEN_PROGRAM_ID;
const serumCmn = require("@project-serum/common");

const { Market } = require("@project-serum/serum");
const { PublicKey } = require("@solana/web3.js");
const utils = require("./utils");

async function swapAtoB(ORDERBOOK_ENV,SWAP_A_USDC_ACCOUNTS){

// Configure the client to use the local cluster.
 process.env.ANCHOR_PROVIDER_URL = "http://localhost:8899"
 process.env.ANCHOR_WALLET = "/Users/karima/.config/solana/id.json" 
anchor.setProvider(anchor.Provider.env());

// Swap program client.
const program = anchor.workspace.SerumSwap;
const marketA = ORDERBOOK_ENV.marketA;
    // Swap out A tokens for USDC.
    const swapAmount = 1.1;
    const bestBidPrice = 1.004;
    const amountToFill = swapAmount * bestBidPrice;
    let tx;
  const [tokenAChange, usdcChange] = await withBalanceChange(
      program.provider,
      [ORDERBOOK_ENV.godA,ORDERBOOK_ENV.godUsdc],
      async () => {
       tx= await program.rpc.swap(
          Side.Ask,
          new BN(1000000),
          {
            rate: new BN(1),
            fromDecimals: 6,
            toDecimals: 6,
            strict: false,
          },
          {
            accounts: SWAP_A_USDC_ACCOUNTS,
          }
        );
      }
    ); 

    console.log("swap A to B tx ",tx)
}
// Side rust enum used for the program's RPC API.
const Side = {
    Bid: { bid: {} },
    Ask: { ask: {} },
  };
   
  // Executes a closure. Returning the change in balances from before and after
  // its execution.
  async function withBalanceChange(provider, addrs, fn) {
    const beforeBalances = [];
    for (let k = 0; k < addrs.length; k += 1) {
      beforeBalances.push(
        (await serumCmn.getTokenAccount(provider, addrs[k])).amount
      );
    }
  
    await fn();
  
    const afterBalances = [];
    for (let k = 0; k < addrs.length; k += 1) {
      afterBalances.push(
        (await serumCmn.getTokenAccount(provider, addrs[k])).amount
      );
    }
  
    const deltas = [];
    for (let k = 0; k < addrs.length; k += 1) {
      deltas.push(
        (afterBalances[k].toNumber() - beforeBalances[k].toNumber()) / 10 ** 6
      );
    }
    return deltas;
  }
module.exports = {
    swapAtoB
};