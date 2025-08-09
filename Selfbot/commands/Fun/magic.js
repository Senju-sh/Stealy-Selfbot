const { Client, Message } = require("legend.js")

module.exports = {
    name: "magic",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        const user = message.mentions.users.first() || client.users.get(args[0]) || message.author;
        
        message.edit(client.language(
            `*Veuillez patienter pendant que je rend l'image magique.*`,
            `*Please wait while the image is being magic.*`
        ));
        
                    
        const response = await fetch(`https://nekobot.xyz/api/imagegen?type=magik&image=${encodeURIComponent(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=4096`)}`).then(r => r.json()).catch(() => null);
        
        if (response && response.message)
            message.edit(client.language(
                `*[${client.user.username} tu es magique ${user.username}](${response.message}) *`,
                `*[${client.user.username} you're magic ${user.username}](${response.messagee}) *`))
            
        else
            message.edit(client.language(
                `Erreur lors de la génération de l'image`,
                `Error generating the image`
            ));
    }
};