// Boilerplate utils to bootstrap an orderbook for testing on a localnet.
// not super relevant to the point of the example, though may be useful to
// include into your own workspace for testing.
//
// TODO: Modernize all these apis. This is all quite clunky.

const Token = require("@solana/spl-token").Token;
const TOKEN_PROGRAM_ID = require("@solana/spl-token").TOKEN_PROGRAM_ID;
const TokenInstructions = require("@project-serum/serum").TokenInstructions;
const Market = require("@project-serum/serum").Market;
const DexInstructions = require("@project-serum/serum").DexInstructions;
const web3 = require("@project-serum/anchor").web3;
const Connection = web3.Connection;
const BN = require("@project-serum/anchor").BN;
const serumCmn = require("@project-serum/common");
const Account = web3.Account;
const Transaction = web3.Transaction;
const PublicKey = web3.PublicKey;
const SystemProgram = web3.SystemProgram;
const DEX_PID = new PublicKey("7RA6GmbCYRBB66QfuDa1peHAE2fWDbeR7Vr2sGmNtGFC");

async function setupTwoMarkets({ provider  } , accounts,PoolM) {
  // Setup mints with initial tokens owned by the provider.
  const decimals = 6;
  console.log(accounts[0][0]);
   const MINT_A = new PublicKey(accounts[0][0]);
   
   const GOD_A = new PublicKey(accounts[0][1]);
/*   const MINT_A =new PublicKey("9cEBYHKxBK8CtF4kzvwdkTDSbQP9qRQbN6QqQRoTACNu"); 
   const GOD_A =new PublicKey("HaZeMWeS6h5KTE5RRxRLAbZ9EVtwk5Z7ULVRi7bxF3Ji"); */
  console.log("MINT_A :",MINT_A.toBase58()," GOD_A :",GOD_A.toBase58())
  const MINT_B = new PublicKey(accounts[1][0]);
   
  const GOD_B = new PublicKey(accounts[1][1]);
/*   const MINT_B =new PublicKey("8PCRGRkyoVkbs9gWwj7kwynnnJadsULMq5YDEbbnkdZZ"); 
  const GOD_B=new PublicKey("2nTNd69UFyapN5wBrEAE8Dh4hEcv9TYARkD4YGwmEY25"); */
  console.log("MINT_B :",MINT_B.toBase58()," GOD_B :",GOD_B.toBase58())
/*   const [USDC, GOD_USDC] = await serumCmn.createMintAndVault(
    provider,
    new BN(1000000000000000),
    undefined,
    decimals
  );   */
    const USDC =new PublicKey(accounts[1][0]); 
  const GOD_USDC =new PublicKey(accounts[1][1]);   
  //console.log("USDC :",USDC.toBase58()," GOD_USDC :",GOD_USDC.toBase58())
  // Create a funded account to act as market maker.
  const amount = 100000 * 10 ** decimals;
  const marketMaker = await fundAccount({
    provider,
    mints: [
      { god: GOD_A, mint: MINT_A, amount, decimals },
      { god: GOD_USDC, mint: USDC, amount, decimals },
    ],
    accounts
  });

  // Setup A/USDC and B/USDC markets with resting orders.
  const asks = [
    [6.041, 7.8],
    [6.051, 72.3],
    [6.055, 5.4],
    [6.067, 15.7],
    [6.077, 390.0],
    [6.09, 24.0],
    [6.11, 36.3],
    [6.133, 300.0],
    [6.167, 687.8],
  ];
  const bids = [
    [6.004, 8.5],
    [6.995, 12.9],
    [6.987, 6.2],
    [6.978, 15.3],
    [6.965, 82.8],
    [6.961, 25.4],
  ];
/* console.log("MINT_A"+MINT_A)
console.log("MINT_A"+USDC)
console.log(" marketMaker.tokens[MINT_A.toString()]"+ marketMaker.tokens[MINT_A.toString()])
console.log(" marketMaker.tokens[USDC.toString()]"+ marketMaker.tokens[USDC.toString()])
 */
  MARKET_A_USDC = await setupMarket({
    baseMint: MINT_A,
    quoteMint: USDC,
    marketMaker: {
      account: marketMaker.account,
      baseToken: marketMaker.tokens[MINT_A.toString()],
      quoteToken: marketMaker.tokens[USDC.toString()],
    },
    bids,
    asks,
    provider,
    PoolM
  });
 /*  MARKET_B_USDC = await setupMarket({
    baseMint: MINT_B,
    quoteMint: USDC,
    marketMaker: {
      account: marketMaker.account,
      baseToken: marketMaker.tokens[MINT_B.toString()],
      quoteToken: marketMaker.tokens[USDC.toString()],
    },
    bids,
    asks,
    provider,
  }); */

  return {
    marketA: MARKET_A_USDC,
   // marketB: MARKET_B_USDC,
    marketMaker,
    mintA: MINT_A,
    mintB: MINT_B,
    usdc: USDC,
    godA: GOD_A,
    godB: GOD_B,
    godUsdc: GOD_USDC,
  };
}

// Creates everything needed for an orderbook to be running
//
// * Mints for both the base and quote currencies.
// * Lists the market.
// * Provides resting orders on the market.
//
// Returns a client that can be used to interact with the market
// (and some other data, e.g., the mints and market maker account).
/* async function initOrderbook({ provider, bids, asks }) {
  if (!bids || !asks) {
     asks = [
      [6.041, 7.8],
      [6.051, 72.3],
      [6.055, 5.4],
      [6.067, 15.7],
      [6.077, 390.0],
      [6.09, 24.0],
      [6.11, 36.3],
      [6.133, 300.0],
      [6.167, 687.8],
    ];
     bids = [
      [6.004, 8.5],
      [6.995, 12.9],
      [6.987, 6.2],
      [6.978, 15.3],
      [6.965, 82.8],
      [6.961, 25.4],
    ];
  }
  // Create base and quote currency mints.
  const decimals = 6;
  const [MINT_A, GOD_A] = await serumCmn.createMintAndVault(
    provider,
    new BN(1000000000000000),
    undefined,
    decimals
  );
  const [USDC, GOD_USDC] = await serumCmn.createMintAndVault(
    provider,
    new BN(1000000000000000),
    undefined,
    decimals
  );

  // Create a funded account to act as market maker.
  const amount = 1000000000000000;
  console.log(amount)
  const marketMaker = await fundAccount({
    provider,
    mints: [
      { god: GOD_A, mint: MINT_A, amount, decimals },
      { god: GOD_USDC, mint: USDC, amount, decimals },
    ],
 
  });

  marketClient = await setupMarket({
    baseMint: MINT_A,
    quoteMint: USDC,
    marketMaker: {
      account: marketMaker.account,
      baseToken: marketMaker.tokens[MINT_A.toString()],
      quoteToken: marketMaker.tokens[USDC.toString()],
    },
    bids,
    asks,
    provider,
  });

  return {
    marketClient,
    baseMint: MINT_A,
    quoteMint: USDC,
    marketMaker,
  };
} */

async function fundAccount({ provider, mints,accounts }) {
  const MARKET_MAKER = new Account([245,11,125,26,254,4,61,25,26,1,199,155,76,74,153,190,189,227,61,79,168,126,236,57,123,13,23,168,199,8,250,37,146,246,133,162,237,90,197,223,86,250,117,247,2,38,173,224,232,224,40,168,67,138,21,112,215,95,29,119,188,125,19,199]);
  console.log("MARKET_MAKER ",MARKET_MAKER.publicKey.toBase58())
  const marketMaker = {
    tokens: {},
    account: MARKET_MAKER,
  };

  marketMaker.tokens[accounts[0][0]] = accounts[0][2];
    marketMaker.tokens[accounts[1][0]] = accounts[1][2];
/*
  // Transfer SPL tokens to the market maker.
  for (let k = 0; k < mints.length; k += 1) {
    
    const { mint, god, amount, decimals } = mints[k];
    let MINT_A = mint;
    let GOD_A = god;
    // Setup token accounts owned by the market maker.
    const mintAClient = new Token(
      provider.connection,
      MINT_A,
      TOKEN_PROGRAM_ID,
      provider.wallet.payer // node only
    );
    const marketMakerTokenA = await mintAClient.createAccount(
      MARKET_MAKER.publicKey
    );
console.log(" marketMakerTokenA ",marketMakerTokenA.toBase58()," MINT_A :",MINT_A.toBase58())
    await provider.send(
      (() => {
        const tx = new Transaction();
        tx.add(
          Token.createTransferCheckedInstruction(
            TOKEN_PROGRAM_ID,
            GOD_A,
            MINT_A,
            marketMakerTokenA,
            provider.wallet.publicKey,
            [],
            amount,
            decimals
          )
        );
        return tx;
      })()
    );

    marketMaker.tokens[mint.toString()] = marketMakerTokenA;
  }*/

  return marketMaker;
}

async function setupMarket({
  provider,
  marketMaker,
  baseMint,
  quoteMint,
  bids,
  asks,
  PoolM
}) {
   const marketAPublicKey = await listMarket({
    connection: provider.connection,
    wallet: provider.wallet,
    baseMint: baseMint,
    quoteMint: quoteMint,
    baseLotSize: 100000,
    quoteLotSize: 100,
    dexProgramId: DEX_PID,
    feeRateBps: 0,
    PoolM
  }); 
  console.log("baseMint :"+baseMint)
  console.log("marketAPublicKey :"+marketAPublicKey.toBase58())
  console.log("quoteMint :"+quoteMint)
  const MARKET_A_USDC = await Market.load(
    provider.connection,
    marketAPublicKey,
    //new PublicKey("Arq83PN47ZCKUi2E3dfNw2yE9vkcGqSasZW4NhXE9LxS"),
    { commitment: "recent" },
    DEX_PID
  );
  console.log("MARKET_A_USDC :"+MARKET_A_USDC.publicKey.toBase58())
  console.log(" marketMaker.baseToken ", marketMaker.baseToken," marketMaker.account :",marketMaker.account.publicKey.toBase58())
  for (let k = 0; k < asks.length; k += 1) {
    let ask = asks[k];
    const {
      transaction,
      signers,
    } = await MARKET_A_USDC.makePlaceOrderTransaction(provider.connection, {
      owner: marketMaker.account,
      payer: new PublicKey(marketMaker.baseToken),
      side: "sell",
      price: ask[0],
      size: ask[1],
      orderType: "postOnly",
      clientId: undefined,
      openOrdersAddressKey: undefined,
      openOrdersAccount: undefined,
      feeDiscountPubkey: null,
      selfTradeBehavior: "abortTransaction",
    });
    await provider.send(transaction, signers.concat(marketMaker.account));
  }
console.log("marketMaker.quoteToken  ",marketMaker.quoteToken)
  for (let k = 0; k < bids.length; k += 1) {
    let bid = bids[k];
    const {
      transaction,
      signers,
    } = await MARKET_A_USDC.makePlaceOrderTransaction(provider.connection, {
      owner: marketMaker.account,
      payer: new PublicKey(marketMaker.quoteToken),
      side: "buy",
      price: bid[0],
      size: bid[1],
      orderType: "postOnly",
      clientId: undefined,
      openOrdersAddressKey: undefined,
      openOrdersAccount: undefined,
      feeDiscountPubkey: null,
      selfTradeBehavior: "abortTransaction",
    });
    await provider.send(transaction, signers.concat(marketMaker.account));
  }

  return MARKET_A_USDC;
}

async function listMarket({
  connection,
  wallet,
  baseMint,
  quoteMint,
  baseLotSize,
  quoteLotSize,
  dexProgramId,
  feeRateBps,
  PoolM
}) {
  const market = new Account(PoolM.market);
  const requestQueue = new Account(PoolM.requestQueue);
  const eventQueue = new Account(PoolM.eventQueue);
  const bids = new Account(PoolM.bids);
  const asks = new Account(PoolM.asks);
  const baseVault = new Account(PoolM.baseVault);
  const quoteVault = new Account(PoolM.quoteVault);
  const quoteDustThreshold = new BN(100);

  const [vaultOwner, vaultSignerNonce] = await getVaultOwnerAndNonce(
    market.publicKey,
    dexProgramId
  );

console.log("baseVault ",baseVault.publicKey.toBase58())
console.log("quoteVault ",quoteVault.publicKey.toBase58())
  const tx1 = new Transaction();
  tx1.add(
     SystemProgram.createAccount({
      fromPubkey: wallet.publicKey,
      newAccountPubkey: baseVault.publicKey,
      lamports: await connection.getMinimumBalanceForRentExemption(165),
      space: 165,
      programId: TOKEN_PROGRAM_ID,
    }), 
    SystemProgram.createAccount({
      fromPubkey: wallet.publicKey,
      newAccountPubkey: quoteVault.publicKey,
      lamports: await connection.getMinimumBalanceForRentExemption(165),
      space: 165,
      programId: TOKEN_PROGRAM_ID,
    }), 
    TokenInstructions.initializeAccount({
      account: baseVault.publicKey,
      mint: baseMint,
      owner: vaultOwner,
    }), 
      TokenInstructions.initializeAccount({
      account: quoteVault.publicKey,
      mint: quoteMint,
      owner: vaultOwner,
    })  
  );

  const tx2 = new Transaction();
  tx2.add(
    SystemProgram.createAccount({
      fromPubkey: wallet.publicKey,
      newAccountPubkey: market.publicKey,
      lamports: await connection.getMinimumBalanceForRentExemption(
        Market.getLayout(dexProgramId).span
      ),
      space: Market.getLayout(dexProgramId).span,
      programId: dexProgramId,
    }),
    SystemProgram.createAccount({
      fromPubkey: wallet.publicKey,
      newAccountPubkey: requestQueue.publicKey,
      lamports: await connection.getMinimumBalanceForRentExemption(5120 + 12),
      space: 5120 + 12,
      programId: dexProgramId,
    }),
    SystemProgram.createAccount({
      fromPubkey: wallet.publicKey,
      newAccountPubkey: eventQueue.publicKey,
      lamports: await connection.getMinimumBalanceForRentExemption(262144 + 12),
      space: 262144 + 12,
      programId: dexProgramId,
    }),
    SystemProgram.createAccount({
      fromPubkey: wallet.publicKey,
      newAccountPubkey: bids.publicKey,
      lamports: await connection.getMinimumBalanceForRentExemption(65536 + 12),
      space: 65536 + 12,
      programId: dexProgramId,
    }),
    SystemProgram.createAccount({
      fromPubkey: wallet.publicKey,
      newAccountPubkey: asks.publicKey,
      lamports: await connection.getMinimumBalanceForRentExemption(65536 + 12),
      space: 65536 + 12,
      programId: dexProgramId,
    }),
    DexInstructions.initializeMarket({
      market: market.publicKey,
      requestQueue: requestQueue.publicKey,
      eventQueue: eventQueue.publicKey,
      bids: bids.publicKey,
      asks: asks.publicKey,
      baseVault: baseVault.publicKey,
      quoteVault: quoteVault.publicKey,
      baseMint,
      quoteMint,
      baseLotSize: new BN(baseLotSize),
      quoteLotSize: new BN(quoteLotSize),
      feeRateBps,
      vaultSignerNonce,
      quoteDustThreshold,
      programId: dexProgramId,
    })
  );

  const signedTransactions = await signTransactions({
    transactionsAndSigners: [
      { transaction: tx1, signers: [baseVault,quoteVault ] },
       {
        transaction: tx2,
        signers: [market, requestQueue, eventQueue, bids, asks],
      },  
    ],
    wallet,
    connection,
  });

  for (let signedTransaction of signedTransactions) {
    let tx =await sendAndConfirmRawTransaction(
      connection,
      signedTransaction.serialize()
    );
 
  }

  const acc = await connection.getAccountInfo(market.publicKey);

  return market.publicKey;
}

async function signTransactions({
  transactionsAndSigners,
  wallet,
  connection,
}) {
  const blockhash = (await connection.getRecentBlockhash("max")).blockhash;
  transactionsAndSigners.forEach(({ transaction, signers = [] }) => {
    transaction.recentBlockhash = blockhash;
    transaction.setSigners(
      wallet.publicKey,
      ...signers.map((s) => s.publicKey)
    );
    if (signers?.length > 0) {
      transaction.partialSign(...signers);
    }
  });
  return await wallet.signAllTransactions(
    transactionsAndSigners.map(({ transaction }) => transaction)
  );
}

async function sendAndConfirmRawTransaction(
  connection,
  raw,
  commitment = "recent"
) {
  
  let tx = await connection.sendRawTransaction(raw, {
    skipPreflight: true,
  });
  console.log("tx ",tx)
  return await connection.confirmTransaction(tx, commitment);
}

async function getVaultOwnerAndNonce(marketPublicKey, dexProgramId = DEX_PID) {
  const nonce = new BN(0);
  while (nonce.toNumber() < 255) {
    try {
      const vaultOwner = await PublicKey.createProgramAddress(
        [marketPublicKey.toBuffer(), nonce.toArrayLike(Buffer, "le", 8)],
        dexProgramId
      );
      return [vaultOwner, nonce];
    } catch (e) {
      nonce.iaddn(1);
    }
  }
  throw new Error("Unable to find nonce");
}

module.exports = {
  fundAccount,
  setupMarket,
  //initOrderbook,
  setupTwoMarkets,
  DEX_PID,
  getVaultOwnerAndNonce,
};
