
const solana = require('@solana/web3.js');
import Accounts from './Accounts';
import Actions from './Actions';

module.exports.onRpcRequest = async ({origin, request})  => {

  const accounts = new Accounts(wallet);
  const walletPair = await accounts.generateAccount(2);
  const connection = new solana.Connection(solana.clusterApiUrl('testnet'));

  const actions = new Actions(wallet, walletPair, connection);

  
  
  switch (request.method) {
    case 'transfer':
      return await actions.transfer(request.params.to, request.params.amount);
    case 'getAddress':
      console.log("here");
      console.log(walletPair)
      return new solana.PublicKey(walletPair.publicKey).toString();
    case 'getBalance':
      return await connection.getBalance(walletPair.publicKey);
    case 'getAccountInfo':
      return JSON.stringify(await connection.getAccountInfo(walletPair.publicKey));
    default:
      throw new Error('Method not found.');
  }
};
