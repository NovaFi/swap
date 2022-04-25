const { setupMarket } = require("./setupMarketAPI");
const { swapAtoB } = require("./swapAToB");
const { swapBtoA } = require("./swapBToA");
const anchor = require("@project-serum/anchor");

async function main(){
    // Configure the client to use the local cluster.
    process.env.ANCHOR_PROVIDER_URL = "http://localhost:8899"
    process.env.ANCHOR_WALLET = "../../owner" 
    anchor.setProvider(anchor.Provider.env());

    // Swap program client.
    const program = anchor.workspace.SerumSwap;
    // lead and create market 
   let ORDERBOOK_ENV= await setupMarket(program);
   // swap B to A
   const SWAP_A_USDC_ACCOUNTS=await swapBtoA(ORDERBOOK_ENV,program);
   // swap A to B
    await swapAtoB(ORDERBOOK_ENV,SWAP_A_USDC_ACCOUNTS,program);
}
main();