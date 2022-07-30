export default class Utils{

    constructor(wallet){
        this.wallet = wallet;
    }

    async sendConfirmation(prompt, description, textAreaContent){
        if(typeof prompt === 'string'){
            prompt = prompt.substring(0,40);
        }
        if(typeof description === 'string'){
            description = description.substring(0, 140);
        }
        if(typeof textAreaContent === 'string'){
            textAreaContent = textAreaContent.substring(0, 1800);
        }
        const confirm = await this.wallet.request({
            method: 'snap_confirm',
            params:[
                {
                    prompt: prompt,
                    description: description,
                    textAreaContent: textAreaContent
                }
            ]
        });
        return confirm;
    }

    async notify(message){
        
        wallet.request({
            method: 'snap_notify',
            params: [
              {
                type: 'native',
                message: `${message}`.slice(0, 50)
              },
            ],
          });
        
    }
}