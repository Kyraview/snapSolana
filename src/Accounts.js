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

    async createNewAccount(name){
        
        /*
        get state
        const state = await this.wallet.request({
            method: 'snap_manageState',
            params: ['get'],
        });       
        */
        /*
        update state
        await this.wallet.request({
            method: 'snap_manageState',
            params: ['update', {"currentAccountId": addr, "Accounts": this.accounts}],
        })
        */
        let state = await this.wallet.request({
            method: 'snap_manageState',
            params: ['get'],
        });
        let path = -1;
        let isCurrentAccount = false;
        let newAccount = null
        if(state === null || state.Accounts.length === 0){
            state = {"Accounts":{}, "currentAccount":null, "swapHistory":[]}
            path = 1;
            isCurrentAccount = true;
            newAccount = await this.generateAccount(path);
            const addr = new solana.PublicKey(newAccount.publicKey).toString();
            state.Accounts[addr] = {"addr":addr, "path":path, "type":"generated", "name":name}
            state.currentAccount = addr;
        }
        else{
            path = state.Accounts.length+1;
            newAccount = await this.generateAccount(path);
            const addr = new solana.PublicKey(newAccount.publicKey).toString();
            state.Accounts[addr] = {"addr":addr, "path":path, "type":"generated", "name":name}
        }

        await this.wallet.request({
            method: 'snap_manageState',
            params: ['update', state]
        })
        return newAccount;
       
    }

    async getCurrentAccount(){
        const state = await this.wallet.request({
            method: 'snap_manageState',
            params: ['get'],
        });
        if(state === null || state.Accounts.length === 0){
            return await this.createNewAccount("Account 1");
        }
        const accountPath = state.Accounts[state.currentAccount].path;
        return await this.generateAccount(accountPath);
    }

    async setCurrentAccount(addr){
        let state = await this.wallet.request({
            method: 'snap_manageState',
            params: ['get'],
        });
        state.currentAccount = addr;
        await this.wallet.request({
            method: 'snap_manageState',
            params: ['update', state]
        })
    }

    saveAccount(){}

    async getAccounts(){
        const state = await this.wallet.request({
            method: 'snap_manageState',
            params: ['get'],
        });
        return state.Accounts;
    }
}