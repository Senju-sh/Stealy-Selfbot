const { Client, Message } = require("legend.js");

module.exports = {
    name: "ghostping",
    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args
     */
    run: async (client, message, args) => {
        const user = message.mentions.users.first() || client.users.get(args[0]);
        if (!user) 
            return message.edit(client.language(
                "*Veuillez me donner un utilisateur à ghostping.*",
                "*Please specify a user to ghost ping.*"
            ))

        return message.delete();
    }
}