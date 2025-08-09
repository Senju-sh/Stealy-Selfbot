const { Client, Message } = require('legend.js');

module.exports = {
    name: "twitchurl",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string} args
    */
    run: async (client, message, args) => {
        if (!args[0])
            return message.edit(client.language(
                "*Veuillez me donner un pseudo twitch.*",
                "*Please give me a twitch nickname.*"
            ));

        client.db.twitch = `https://twitch.tv/${args[0]}`;
        client.save();
        message.edit(client.language(
            `*Votre pseudo twitch a été changé \`${args[0]}\`.*`, 
            `*Your nickname twitch has been changed \`${args[0]}\`.*`
        ));
    }
}