const { Client, Message } = require("legend.js");

module.exports = {
    name: "banner",
    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     */
    run: async (client, message, args) => {
        const user = message.mentions.users.first() || client.users.get(args[0]) || message.author;
        const profile = await user.fetchProfile().catch(() => null);

        if (!profile.banner) 
            return message.edit(client.language(
                `***[ \`@${user.username}\` ](<https://discord.gg/stealy>)ne possède pas de bannière.***`, 
                `<a:star:1345073135095123978> **__Stealy__** <a:star:1345073135095123978>\n***[ \`@${user.username}\` ](<https://discord.gg/stealy>)has no banner.***`
            ));

        message.edit(client.language(
            `***Bannière de [ \`${user.username}\` ](https://cdn.discordapp.com/banners/${user.id}/${profile.banner}.${profile.banner.startsWith("a_") ? "gif" : "png"}?size=4096) ***`,
            `***Banner of [ \`${user.username}\` ](https://cdn.discordapp.com/banners/${user.id}/${profile.banner}.${profile.banner.startsWith("a_") ? "gif" : "png"}?size=4096) ***`
        ));
    }
}