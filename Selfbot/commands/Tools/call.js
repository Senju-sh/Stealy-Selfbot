const types = [ "default", "dm", "group" ]
const { Client, Message } = require("legend.js")

module.exports = {
    name: "call",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string} args
    */
    run: async (client, message, args) => {
        
        if (args[0] === "stop"){
            if (!client.connexion) 
                return message.edit(client.language(
                    `*Vous n'avez aucun appel vocal en cours.*`,
                    `*You dont have a voice call.*`
                ));
            
            client.connexion.disconnect();
            client.connexion = null;

            return message.edit(client.language(
                `*Tu as quitté ton appel.*`,
                `*You left your voice channel.*`
            ));
        }   
        
        let channel;
        const user = message.mentions.users.first() || client.users.get(args[0]);
        channel = message.mentions.channels.first() || client.channels.get(args[0]) || message.channel;

        if (!channel && user) channel = user.dmChannel;
        if (!channel || !args[0]) 
            return message.edit(client.language(
                `*Aucun salon de trouvé pour \`${args[0] || "rien"}\`.*`,
                `*No channel found for \`${args[0] || "nothing"}\`.*`
            ));

        if (!types.includes(channel.type))
            return message.edit(client.language(
                "*Veuillez me donner un salon vocale.*",
                "*Please give me a voice channel.*"
            ));

        client.voc(channel.id);
        message.edit(client.language(
            `*${client.user} est actuellement connecté dans ${channel}.*`,
            `*${client.user} is now connected on ${channel}.*`
        ));
    }
}