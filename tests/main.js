const { setupMarket } = require("./setupMarketAPI");
const { swapAtoB } = require("./swapAToB");
const { swapBtoA } = require("./swapBToA");
const anchor = require("@project-serum/anchor");
const { PublicKey } = require("@solana/web3.js");
const { loadKey } = require("./loadKey");
const { getPool } = require("./getPool");

async function main(){
    // Configure the client to use the local cluster.
    process.env.ANCHOR_PROVIDER_URL = "http://localhost:8899"
    process.env.ANCHOR_WALLET = "../../owner" 
    anchor.setProvider(anchor.Provider.env());
    const idl=require('./serum_swap.json') 
    // Address of the deployed program.
    const programId = new anchor.web3.PublicKey("CxXDXjGBJ6RwMKKLqkd9KCAR5yfswNd8iXcQPmFFeDvU");

    // Generate the program client from IDL.
    const program = new anchor.Program(idl, programId);
    // Swap program client.
   // const program = anchor.workspace.SerumSwap;
    // lead and create market 

    let tokens =
    [//mint, splu(owner =owner), marketmakerMint[i](owner =marketMaker)
    ["5Nm6Xgd5QWuWj1o1GASo38FzsWcX3ioHrLyHqJkpFJhJ", "B9De1gsTXS4qeE52zeFyurtcMwzKbgYmma9T3ndzNtpm","5gNEW5xPQQzW5TfxUURs6RZ2oicxuLmhwmpXvBtuRa8q"],
    ["8diZPJpnfPm2A82frDpGzYR4KeUNvgYuyAuqCpFJxMsi", "DiGpa4HDKSLuNNDBbAG8wrfhDYHyJ3UDuMXyHibb5Vcz","5R5aJSNEcFLWDrwrJvXwugCsRDW7yY9cQZZwvSGuxJU1"],
    ["9uaetUexhEBtqhGdszpm82gvpCDsjPRCKP8iXrzW1JLH", "7aQufWydQHBFzY66HTc76ig9YTzCdy2NneeHVrXi29a2","9FPr228yQbpJU3xVuLXL6yVQgAcNfz34SpH8vkgp4KxF"],
    ["CbNnyMCgUxrrMidGYbD6eKfdJXP9U7ntsYVN2FbM9L73", "36RoBFxrarrxiPBGTivxFMPr3MjpBYNh2QGiVgy3ouo4","Cgv75askwAFd8fMrE4BZvDSspCDwdXPHH9EDaLhZK6qv"],
    ["Dfe8TbWvRgEsZb4TYdRAS6TeH62zEunB3wgAa7yLcYZn", "AzCehwFKFjSf2mS2x62Z3Pg95b9eZ7vcb6gYwUnBUbaN","GqyScLsJwcy5Q8GjDsAKRpcShVwK542uiQ8vmyX8se9s"],
    ["EcjCh2FPxDcJNxgesWHdthXDo6fUUtKjTysxRhmA9MZN", "Dur7eZYUixw5bZUpUK3i4uFYXgVTY7f7pCTekXjGd5L5","C9Jj1utRrkgy52fcZPzTRZc3pBU4WA1zNhMYz6dbJcWA"],
    ["Hyn7zDaApyfinKSJz1NN3i5knP9GZuqNGmYCcitPWbHW", "EEt3KceS4vzNCtmdSzhbDyX4k1s9u71p9enZPW3TFJps","EYDfaXHK6Kg6GJeCCPyNnjE3EpKKQ8DY41a88k8YzXzh"]];

    var fs = require('fs');
let allPool=[];
let json;
    var result =await  tokens.flatMap(
        (v, i) => tokens.slice(i+1).map( w => [v , w] )
    ).forEach(
        async a => {
         /*    console.log(a)
            
            let item=await loadKey(a);
            allPool.push(item)

return;   */

        let filePool = fs.readFileSync('poolConfig.json');
        let pool = JSON.parse(filePool);
       // console.log(pool[0].market);
        let PoolM=await getPool(a,pool);
        //console.log("PoolM ",PoolM)

        let ORDERBOOK_ENV= await setupMarket(program , a,PoolM);
//console.log("ORDERBOOK_ENV ",ORDERBOOK_ENV);

        // swap B to A
        const SWAP_A_USDC_ACCOUNTS=await swapBtoA(ORDERBOOK_ENV,program);
       
        // swap A to B
        await swapAtoB(ORDERBOOK_ENV,SWAP_A_USDC_ACCOUNTS,program);
        
        }  
    )
     /* json = JSON.stringify(allPool)
    fs.writeFile('poolConfig.json', json, function (err) {
        if (err) throw err;
        //console.log('File is created successfully.');
        });  */
  /*   let rawdata = fs.readFileSync('newfile.json');
        let student = JSON.parse(rawdata);
console.log(student[0].market); */
}


main();

