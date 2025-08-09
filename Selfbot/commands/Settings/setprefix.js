const { Client, Message } = require('legend.js');

module.exports = {
    name: "setprefix",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string} args
    */
    run: async (client, message, args) => {

        if (!args[0]) 
            return message.edit(client.language(
                "*Vous devez me donner un prefix.*",
                "*You must give me a prefix.*"
            ));

        if (args.length > 5)
            return message.edit(client.language(
                `*Votre prefix ne peut pas dépasser les 5 caractères.*`,
                `* Your prefix cannot be above 5 caracters.*`
            ));

        if (typeof args[0] !== "string")
            return message.edit(client.language(
                `*Votre prefix doit être un texte.*`,
                `*Your prefix must be a text.*`
            ));

        message.edit(client.language(
            `*Ton prefix est maintenant \`${args[0]}\`.*`,
            `*Your prefix is now \`${args[0]}\`.*`
        ));

        client.db.prefix = args[0];
        client.save();
    }
}
