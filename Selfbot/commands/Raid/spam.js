const { Client, Message } = require('legend.js');

module.exports = {
    name: "spam",
    owner: true,
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args 
    */
    run: async (client, message, args) => {
        message.delete().catch(() => false)

        if (!args[0] || isNaN(parseInt(args[0]) || args[0] > 50)) 
            return message.channel.send(client.language(
                "*Veuillez me donner un nombre de messages inferieur a 50 à envoyer.*",
                "*Please specify an amount of messages lower than 50 to send.*"
            )).catch(() => false)
        
        if (!args[1]) 
            return message.channel.send(client.language(
                "*Veuillez me donner un message à envoyer.*",
                "*Please specify a message to send.*"
            )).catch(() => false);
 
        for (let i = 0; i < parseInt(args[0]); i++) {
            await message.channel.send(args.slice(1).join(" ")).catch(() => false);
            await client.sleep(1000);
        }
    },
};
