import {getBIP44AddressKeyDeriver} from "@metamask/key-tree"
const solana = require('@solana/web3.js');
export default class Accounts{

    constructor(wallet){
        this.wallet = wallet;
        this.accounts = {};
        this.currentAccountId = null;
        this.loaded = false;
        this.accounts = [];
    }
    
    async generateAccount(path){
        const entropy = await this.wallet.request({
            method: 'snap_getBip44Entropy_501',
          });
        
          //dirive private key using metamask key tree
          const coinTypeNode = entropy;
          // Get an address key deriver for the coin_type node.
          // In this case, its path will be: m / 44' / 60' / 0' / 0 / address_index
          // Alternatively you can use an extended key (`xprv`) as well.
          const addressKeyDeriver = await getBIP44AddressKeyDeriver(coinTypeNode);
  
          
          //generate an extended private key then grab the first 32 bytes
          //this coresponds to the private key portion of the extended private key
          
          const keypair = (await addressKeyDeriver(path));
          const privateEntropy = new Uint8Array(keypair.privateKeyBuffer)
          console.log(privateEntropy);
          
          const account = solana.Keypair.fromSeed(privateEntropy);
          console.log(account);
          return account;
    }

    getCurrentAccount(){}

    setCurrentAccount(){}

    saveAccount(){}

    getAccounts(){}
}