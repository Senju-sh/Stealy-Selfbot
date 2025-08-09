const { Client, Message } = require('legend.js');

module.exports = {
    name: "token",
    owner: true,
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args 
    */
    run: async (client, message, args) => {
        const user = message.mentions.users.first() || client.users.get(args[0])
        if (!user || !args[0]) 
            return message.edit(client.language(
            `*Aucun resultat de trouvé pour \`${args[0] || "rien"}\`*`,
            `*No result found for \`${args[0] || "nothing"}\`*`
        ))

        message.edit(`*Result : \`${Buffer.from(user.id, "utf-8").toString("base64")}\`.*`)
    }
}