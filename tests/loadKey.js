const { Keypair, Account } = require("@solana/web3.js");


async function loadKey( accounts) {
   
let x1=new Account().secretKey.buffer;
//console.log("ddd ",x1)
    const map = new Map();

const values = Array.from(map.values());

    let market=[];
    new Account().secretKey.forEach(ele=>{
        market.push(ele)
    })
    let requestQueue=[];
    new Account().secretKey.forEach(ele=>{
        requestQueue.push(ele)
    })
    let eventQueue=[];
    new Account().secretKey.forEach(ele=>{
        eventQueue.push(ele)
    })
    let bids=[];
    new Account().secretKey.forEach(ele=>{
        bids.push(ele)
    })
    let asks=[];
    new Account().secretKey.forEach(ele=>{
        asks.push(ele)
    })
    let baseVault=[];
    new Account().secretKey.forEach(ele=>{
        baseVault.push(ele)
    })
    let quoteVault=[];
    new Account().secretKey.forEach(ele=>{
        quoteVault.push(ele)
    })
    
    let item={
        mintA:accounts[0][0],
        mintB:accounts[1][0],
        marketMakerTokenA:accounts[0][2],
        marketMakerTokenB:accounts[1][2],
        market,
        requestQueue,
        requestQueue,
        bids,
        asks,
        baseVault,
        quoteVault
    }
 
return item;
}

module.exports = {
    loadKey
};