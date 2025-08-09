const { Client, Message } = require("legend.js")

module.exports = {
    name: "saveprofil",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        const user = message.mentions.users.first() || client.users.get(args[0]) || client.user;

        if (!client.db.logger.profiles.url) 
            return message.edit(client.language(
                "*Veuillez d'abord mettre en place vos logs de saveprofil.*",
                "*Please set up your saveprofil logs first.*"
            ));


        if (!client.db.logger.profiles.enable) 
            return message.edit(client.language(
                "*Vos logs de profiles ne sont pas activés.*",
                "*Your profils logs are not enabled.*"
            ));


        message.edit(client.language(
            `*Le profil de \`${user.global_name ?? user.username}\` a été sauvegardés dans vos logs.*`,
            `*The profile of \`${user.global_name ?? user.username}\` has been saved to your logs.*`
        ));

        const profil = await user.fetchProfile().catch(() => false);
        const status = profil.user.presence.activities.filter(c => c.type == 4);

        const avatarURL = await client.upload(user.avatarURL);
        const bannerURL = await client.upload(profil.bannerURL);

        const embed = {
            title: client.language(`› **Profil de ${user.username}**`, `› **Profile of ${user.username}**`),
            color: parseInt(client.db.log_color, 16),
            footer: { text: user.username, icon_url: avatarURL },
            timestamp: new Date().toISOString(),
            fields: [
                { name: `***${client.language("Nom d'affichage", 'Displayed Name')}***`, value: `\`${user.global_name ?? user.username}\`` },
                { name: '***Status***', value: `${status?.length == 0 ? "<:no:1319225868895260705>" : `${status[0].emoji ?? ''} ${status[0].state}`}` },
                { name: `***${client.language('À propos', 'About me')}***`, value: `${profil?.bio ?? "<:no:1319225868895260705>"}` },
                { name: `***${client.language('Pronoms', 'Pronouns')}***`, value: `${profil.pronouns !== '' ? profil.pronouns : "<:no:1319225868895260705>"}` },
                { name: `***${client.language('Couleurs', 'Colors')}***`, value: `${profil?.themeColors ? profil.themeColors.map(r => r == 0 ? `\`#000000\`` : `\`#${r}\``).join('\n') : `\`#000000\`\n\`#000000\``}` }
            ]
        }

        if (avatarURL) embed.thumbnail = { url: avatarURL };
        if (bannerURL) embed.image = { url: bannerURL };

        client.log(client.db.logger.profiles.url, { embeds: [embed] })
    }
}