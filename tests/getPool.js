
async function getPool(account,pool){

    let x;
   for(let i=0;i<pool.length;i++){
    console.log("pool[i].mintA ",pool[i].mintA)
    console.log("account[0][0] ",account[0][0])
    console.log("pool[i].mintB ",pool[i].mintB)
    console.log("account[1][0] ",account[1][0])
    console.log("************************************")
       if(pool[i].mintA==account[0][0] && pool[i].mintB==account[1][0] ){
          // console.log("iff ",pool[i])
           x=pool[i]
       }
   }
   return x;
   // console.log("filter pool ",item)
}
module.exports = {
        getPool
};