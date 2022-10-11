
const solana = require('@solana/web3.js');
import Accounts from './Accounts';
import Actions from './Actions';

module.exports.onRpcRequest = async ({origin, request})  => {
  console.log(origin);
  const accounts = new Accounts(wallet);
  const walletPair = await accounts.getCurrentAccount();
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
    case 'getAssets':
      return "getAssets not yet supported"
    case 'getTransactions':
      return 'getTransactions not yet supported'
    case 'getAccounts':
      return await accounts.getAccounts().Accounts;
    case 'getAccountInfo':
      return JSON.stringify(await connection.getAccountInfo(walletPair.publicKey));
    default:
      throw new Error('Method not found.');
  }
};
