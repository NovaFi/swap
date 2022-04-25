const { setupMarket } = require("./setupMarketAPI");
const { swapAtoB } = require("./swapAToB");
const { swapBtoA } = require("./swapBToA");


async function main(){

    // lead and create market 
   let ORDERBOOK_ENV= await setupMarket();
   // swap B to A
   const SWAP_A_USDC_ACCOUNTS=await swapBtoA(ORDERBOOK_ENV);
   // swap A to B
    await swapAtoB(ORDERBOOK_ENV,SWAP_A_USDC_ACCOUNTS);
}
main();