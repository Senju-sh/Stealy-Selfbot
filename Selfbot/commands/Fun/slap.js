const { Client, Message } = require("legend.js")

module.exports = {
    name: "slap",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        const user = message.mentions.users.first() || client.users.get(args[0]) || message.author;      
        const response = await fetch(`https://nekos.life/api/v2/img/slap`).then(r => r.json()).catch(() => null);
        
        if (response && response.url)
            message.edit(client.language(
                `*[${client.user.username} met une claque à ${user.username}](${response.url}) *`,
                `*[${client.user.username} slaps ${user.username}](${response.url}) *`))
            
        else
            message.edit(client.language(
                `Erreur lors de la génération de l'image`,
                `Error generating the image`
            ));
    }
};