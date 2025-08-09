const { Client, Message } = require("legend.js")

module.exports = {
    name: "deepfry",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        const user = message.mentions.users.first() || client.users.get(args[0]) || message.author;
        
        message.edit(client.language(
            `*Veuillez patienter pendant que je mets l'image aux couleurs de discord.*`,
            `*Please wait while the image is being rendered with discord colors.*`
        ));
        
                    
        const response = await fetch(`https://nekobot.xyz/api/imagegen?type=deepfry&image=${encodeURIComponent(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=4096`)}`).then(r => r.json()).catch(() => null);
        if (response && response.message)
            message.edit(client.language(
                `*[${user.username} est frit](${response.message}) *`,
                `*[${user.username} is deepfried](${response.message}) *`
            ));

            
        else
            message.edit(client.language(
                `Erreur lors de la génération de l'image`,
                `Error generating the image`
            ));
    }
};
