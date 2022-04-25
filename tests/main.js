const { setupMarket } = require("./setupMarketAPI");
const { swapAtoB } = require("./swapAToB");
const { swapBtoA } = require("./swapBToA");
const anchor = require("@project-serum/anchor");
const { PublicKey } = require("@solana/web3.js");

async function main(){
    // Configure the client to use the local cluster.
    process.env.ANCHOR_PROVIDER_URL = "http://localhost:8899"
    process.env.ANCHOR_WALLET = "../../owner" 
    anchor.setProvider(anchor.Provider.env());

    // Swap program client.
    const program = anchor.workspace.SerumSwap;
    // lead and create market 

    let tokens =
    [
    ["5Nm6Xgd5QWuWj1o1GASo38FzsWcX3ioHrLyHqJkpFJhJ", "DCCPZdVV7BCwxChNqDdkd2SFbQ2hJP2CbMWxUg7qys8H"],
    ["8diZPJpnfPm2A82frDpGzYR4KeUNvgYuyAuqCpFJxMsi", "FinJNM9L1gmfwdkvEzDcXGLGCxeyUSvdYbrCzScwCiyw"],
    ["9uaetUexhEBtqhGdszpm82gvpCDsjPRCKP8iXrzW1JLH", "G8Bi1neVveCD3MfuiWkZCHSykys74FHmHyMwLGmQRph"],
    ["CbNnyMCgUxrrMidGYbD6eKfdJXP9U7ntsYVN2FbM9L73", "9FPMVMEc2j8CihUvdKLFx7kQHkkXnMEpiCjhuLB6Q5vG"],
    ["Dfe8TbWvRgEsZb4TYdRAS6TeH62zEunB3wgAa7yLcYZn", "Agw3Qt5KQKaW5VsD797bYm5Mh1arRckPK54R2zawkhia"],
    ["EcjCh2FPxDcJNxgesWHdthXDo6fUUtKjTysxRhmA9MZN", "28RjecFzynm6zSbJCpiDp7oGwSEZZarmw4JtMmFnJZ42"],
    ["Hyn7zDaApyfinKSJz1NN3i5knP9GZuqNGmYCcitPWbHW", "3k3UT9nGfzLrBYmrBskU71ZSZTdhK7hS2ptBD5cpshYy"]];

let array = [ 0 , 1 , 2, 3,4 ,5,6];  

    var result = tokens.flatMap(
        (v, i) => tokens.slice(i+1).map( w => [v , w] )
    ).forEach(
        async a => {
            
            let ORDERBOOK_ENV= await setupMarket(program , a);
   // swap B to A
        const SWAP_A_USDC_ACCOUNTS=await swapBtoA(ORDERBOOK_ENV,program);
   // swap A to B
             await swapAtoB(ORDERBOOK_ENV,SWAP_A_USDC_ACCOUNTS,program);
        }
    )
   
}
main();