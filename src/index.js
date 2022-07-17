const {
  Keypair, 
  fromSecretKey,
  Transaction, 
  SystemProgram, 
  LAMPORTS_PER_SOL, 
  sendAndConfirmTransaction, 
  clusterApiUrl, 
  Connection,
  PublicKey
} = require("@solana/web3.js");
wallet.registerRpcMessageHandler(async (originString, requestObject) => {
  const secretKey = Uint8Array.from([
    48, 139, 148,  40, 183, 142,  18,  20, 177,  78,  26,
   228, 157, 189,  81,  75,  68, 157, 223, 202,  41,  47,
   143,  46, 223, 155, 127,  59, 152,  68, 115, 176,  52,
    91, 210, 114, 241, 131,  92, 122, 116, 133,  85, 163,
    33, 254, 194,  54, 218, 149, 255, 211, 116, 198,  68,
   216,  42, 223, 190, 225,  40, 123, 131,  55
  ])
  const walletPair = Keypair.fromSecretKey(secretKey);
  let connection = new Connection(clusterApiUrl('testnet'));
  switch (requestObject.method) {
    case 'sendSol':
      

      let transaction = new Transaction();
      let toPubkey = new PublicKey(requestObject.params.to);
      
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: walletPair.publicKey,
          toPubkey: toPubkey,
          lamports: LAMPORTS_PER_SOL * requestObject.params.amount,
        })
      );
      return await sendAndConfirmTransaction(connection, transaction, [walletPair]);
    case 'getAddress':
      return new PublicKey(walletPair.publicKey).toString();
    case 'getBalance':
      return await connection.getBalance(walletPair.publicKey);
    case 'getTransactions':
      26
    default:
      throw new Error('Method not found.');
  }
});
