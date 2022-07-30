import Utils from "./utils";
const solana = require('@solana/web3.js');
export default class Actions{
    constructor(wallet, walletPair, connection){
        this.wallet = wallet;
        this.walletPair = walletPair;
        this.connection = connection;
        this.utils = new Utils(wallet);
    }

    async transfer(to, amount){
      const confirm = await this.utils.sendConfirmation("transfer?", "This will spend solana", "Do you wish to send "+amount+" solana to "+to+"?");
      if(!confirm){
        throw({message:"user Rejected Request"})  
      }
      let transaction = new solana.Transaction();
      let toPubkey = new solana.PublicKey(to);
      
      transaction.add(
        solana.SystemProgram.transfer({
          fromPubkey: this.walletPair.publicKey,
          toPubkey: toPubkey,
          lamports: Number(amount),
        })
      );
      let output = "";
      try{
        output = await solana.sendAndConfirmTransaction(this.connection, transaction, [this.walletPair]);
      }
      catch(err){
        await this.utils.notify("transaction failed");
        throw(err);
      }
      await this.utils.notify("transaction successful");
      console.log(output)
      return output;
    }
}