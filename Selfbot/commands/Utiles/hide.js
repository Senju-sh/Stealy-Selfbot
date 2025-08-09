const { Client, Message } = require("legend.js");

module.exports = {
    name: "hide",
    permission: "MANAGE_CHANNELS",
    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args
     */
    run: async (client, message, args) => {
        const role = message.mentions.roles.first() || message.guild.roles.get(args[1]) || message.guild.roles.find(r => r.name.toLowerCase() === args[1]?.toLowerCase());
        const channel = message.mentions.channels.first() || message.guild.channels.get(args[2]) || message.channel;

        if (!["on", "off"].includes(args[0])) 
            return message.edit(client.language(
                `*Format invalide : \`${client.db.prefix}hide <on/off> <role>\`*`,
                `*Invalid format : \`${client.db.prefix}hide <on/off> <role>\`*`
            ));

        switch (args[0]) {
            case "on":
                channel.overwritePermissions(role ? role.id : message.guild.id, { VIEW_CHANNEL: false });
                message.edit(client.language(
                    `*Le salon \`${salon.name}\` est maintenant caché pour \`${role ? role.name : 'tout le monde'}\`.*`, 
                    `*The channel \`${salon.name}\` is now hidden for \`${role ? role.name : 'everyone'}\`.*`
                ));
                break;
            
            case "off":
                channel.overwritePermissions(role ? role.id : message.guild.id, { VIEW_CHANNEL: null });
                message.edit(client.language(
                    `*Le salon \`${salon.name}\` est maintenant visible pour \`${role ? role.name : 'tout le monde'}\`.*`,
                    `*The channel \`${salon.name}\` is now visible for \`${role ? role.name : 'tout le monde'}\`.*`
                ));
                break;
        }
    }
}
