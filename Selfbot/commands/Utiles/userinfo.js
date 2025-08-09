const { Client, Message } = require("legend.js");

module.exports = {
    name: "userinfo",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {

        let user = message.mentions.users.first() || client.users.get(args[0]) || await client.fetchUser(args[0] ?? client.user.id).catch(() => false);
        if (!user || !args[0]) user = client.user;
        
        message.edit(client.language(
            `***__› Stealy - User Info__*** <a:star:1345073135095123978>

            > ***Tag : [\`@${user.username}\` ](<https://discord.com/users/${user.id}>) ***
            > ***User ID : [\`${user.id}\` ](<https://discord.com/users/${user.id}>) ***

            > ***Date de création : <t:${Math.round(user.createdTimestamp / 1000)}> <t:${Math.round(user.createdTimestamp / 1000)}:R> ***
            > ***Jours depuis la création : [ \`${Math.floor((Date.now() - user.createdAt) / 1000 / 60 / 60 / 24)}\` ](<https://discord.gg/stealy>) ***

            > ***${user.avatar ? `[\`Lien de l'Avatar\` ](https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp?size=4096)` : "\`Pas de photo de profile\`"} ***
            > ***${user.banner ? `[\`Lien de la Bannière\` ](https://cdn.discordapp.com/banners/${user.id}/${user.banner}.gif?size=4096)` : "\`Pas de bannière\`"} ***`.replaceAll('  ', ''),

            `***__› Stealy - User Info__*** <a:star:1345073135095123978>

            > ***Tag : [\`${user.username}\` ](<https://discord.com/users/${user.id}>) ***
            > ***User ID : [\`${user.id}\` ](<https://discord.com/users/${user.id}>) ***

            > ***Creation date : <t:${Math.round(user.createdTimestamp / 1000)}> <t:${Math.round(user.createdTimestamp / 1000)}:R> ***
            > ***Days since the creation : [ \`${Math.floor((Date.now() - user.createdAt) / 1000 / 60 / 60 / 24)}\`  ](<https://discord.gg/stealy>) ***

            > ***${user.avatar ? `[ \`Link of the Avatar\` ](https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp?size=4096)` : "\`No pfp\`"} ***
            > ***${user.banner ? `[ \`Link of the Banner\` ](https://cdn.discordapp.com/banners/${user.id}/${user.banner}.gif?size=4096)` : "\`No banner\`"} ***`.replaceAll('  ', '')
        ));
    }
}