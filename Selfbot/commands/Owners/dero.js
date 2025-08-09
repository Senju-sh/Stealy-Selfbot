const { Client, Message } = require("legend.js");

module.exports = {
    name: "dero",
    permission: "MANAGE_ROLES",
    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args
     */
    async run(client, message, args) {
        const role = message.mentions.roles.first() || message.guild.roles.get(args[0]);
        if (!role) 
            return message.edit(client.language(
            `*Je n'ai pas trouvé le rôle \`${args[0] || "rien"}\`.*`,
            `*I couldn't find the role \`${args[0] || "nothing"}\`.*`
        ));

        message.guild.channels.forEach(async (channel) => {
            channel.overwritePermissions(role.id, {
                VIEW_CHANNEL: true,
                SEND_MESSAGES: true,
                CONNECT: true,
                SPEAK: true
            })
        });

        message.edit(client.language(`*J'ai fais toutes les dérogations pour le role \`${role.name}\`.*`, `*I did all the derogations for the role \`${role.name}\`.*`));
    }
};
