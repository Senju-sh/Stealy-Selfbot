const { Client, Message } = require('legend.js');

module.exports = {
    name: "nitrosniper",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string} args
    */
    run: async (client, message, args) => {
        
        switch(args[0]){
            default: 
                return message.edit(client.language(
                    `*Veuillez écrire \`on\` ou \`off\` après la commande.*`,
                    `*Write \`on\` or \`off\` after the command.*`
                ));

            case "on":
                client.db.nitrosniper = true;
                client.save();
                message.edit(client.language(
                    "*Le nitro sniper a été activé.*", 
                    "*The nitro snipe has been activated.*"
                ));
                break

            case "off":
                client.db.nitrosniper = false;
                client.save();
                message.edit(client.language(
                    "*Le nitro sniper a été désactivé.*",
                    "*The nitro snipe has been desactivated.*"
                ));
                break
        }
    }
}