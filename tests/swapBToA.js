const assert = require("assert");
const anchor = require("@project-serum/anchor");
const BN = anchor.BN;
const OpenOrders = require("@project-serum/serum").OpenOrders;
const TOKEN_PROGRAM_ID = require("@solana/spl-token").TOKEN_PROGRAM_ID;
const serumCmn = require("@project-serum/common");

const { Market } = require("@project-serum/serum");
const { PublicKey } = require("@solana/web3.js");
const utils = require("./utils");

async function swapBtoA(ORDERBOOK_ENV,program){


const marketA = ORDERBOOK_ENV.marketA;
//const marketB = ORDERBOOK_ENV.marketB;

const [vaultSignerA] = await utils.getVaultOwnerAndNonce(
  marketA._decoded.ownAddress
);

const marketAVaultSigner = vaultSignerA;
console.log("vaultSignerA ",vaultSignerA.toBase58())
// marketBVaultSigner = vaultSignerB;
// Open orders accounts on the two markets for the provider.
const openOrdersA = anchor.web3.Keypair.generate();
console.log("openOrdersA.publicKey ",openOrdersA.publicKey.toBase58())
const SWAP_USDC_A_ACCOUNTS = {
  market: {
    market: marketA._decoded.ownAddress,
    requestQueue: marketA._decoded.requestQueue,
    eventQueue: marketA._decoded.eventQueue,
    bids: marketA._decoded.bids,
    asks: marketA._decoded.asks,
    coinVault: marketA._decoded.baseVault,
    pcVault: marketA._decoded.quoteVault,
    vaultSigner: marketAVaultSigner,
    // User params.
    openOrders: openOrdersA.publicKey,
    orderPayerTokenAccount: ORDERBOOK_ENV.godUsdc,
    coinWallet: ORDERBOOK_ENV.godA,
  },
  pcWallet: ORDERBOOK_ENV.godUsdc,
  authority: program.provider.wallet.publicKey,
  dexProgram: utils.DEX_PID,
  tokenProgram: TOKEN_PROGRAM_ID,
  rent: anchor.web3.SYSVAR_RENT_PUBKEY,
};
const SWAP_A_USDC_ACCOUNTS = {
  ...SWAP_USDC_A_ACCOUNTS,
  market: {
    ...SWAP_USDC_A_ACCOUNTS.market,
    orderPayerTokenAccount: ORDERBOOK_ENV.godA,
  },
};

 // Swap exactly enough USDC to get 1.2 A tokens (best offer price is 6.041 USDC).
 let tx;
 const [tokenAChange, usdcChange] = await withBalanceChange(
    program.provider,
    [ORDERBOOK_ENV.godA,ORDERBOOK_ENV.godUsdc],
  
   async () => {
     tx= await program.rpc.swap(Side.Bid, new BN(1000000), new BN(1.0), {
        accounts: SWAP_USDC_A_ACCOUNTS,
        instructions: [
          // First order to this market so one must create the open orders account.
          await OpenOrders.makeCreateAccountTransaction(
            program.provider.connection,
            marketA._decoded.ownAddress,
            program.provider.wallet.publicKey,
            openOrdersA.publicKey,
            utils.DEX_PID
          ),
         
        ],
        signers: [openOrdersA], 
      });
     
    }

  ); 
  console.log("swap B to A tx ",tx)
  return SWAP_A_USDC_ACCOUNTS;
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
    swapBtoA,
};