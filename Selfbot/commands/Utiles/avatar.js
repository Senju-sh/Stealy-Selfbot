const { Client, Message } = require('legend.js');

module.exports = {
    name: "avatar",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args 
    */
    run: async (client, message, args) => {

        const user = message.mentions.users.first() || client.users.get(args[0]) || message.author;
        return message.edit(client.language(
            `***Avatar de : [\`@${user.username}\`](https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar.startsWith("a_") ? "gif" : "png"}?size=4096)***`,
            `***Avatar of : [\`@${user.username}\`](https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar.startsWith("a_") ? "gif" : "png"}?size=4096)***`
        ));
    },
}