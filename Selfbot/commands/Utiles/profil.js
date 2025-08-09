const { Client, Message } = require("legend.js");

module.exports = {
    name: "profil",
    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args
     */
    run: async (client, message, args) => {
        const user = message.mentions.users.first() || client.users.get(args[0]) || client.user;
        const profil = await user.fetchProfile().catch(() => false);
        
        message.edit(client.language(
            `***__› Stealy - Profil__*** <a:star:1345073135095123978>

            > ***Avatar*** : ${profil.avatar ? `[Avatar](${profil.avatarURL})` : "`Aucune`"}
            > ***Bannière*** : ${profil.banner ? `[Bannière](${profil.bannerURL})` : "\`Aucune\`"}
            > ***Decoration Avatar*** : ${user.avatarDecoration ? `[Decoration](${user.avatarDecorationURL})` : "`Aucune`"}
            > ***Clan*** : \`${user.clan.tag || "Aucun"}\`
            > ***Pronoms*** : \`${user.pronouns || "Aucun"}\`
            > ***Pseudo*** : \`${user.global_name || "Aucun"}\`
            > ***A propos*** : ${profil?.bio ?? "Aucun"}
            > ***Couleur Primaire :*** \`#${profil?.themeColors ? profil.themeColors.map(r => r == 0 ? "000000" : r).join('\`\n> ***Couleur Secondaire :*** \`#') : `000000\`\n> ***Couleur Secondaire :*** \`#000000`}\``.replaceAll('  ', ''),

            `***__› Stealy - Profil__*** <a:star:1345073135095123978>

            > ***Avatar*** : ${profil.avatar ? `[Avatar](${profil.avatarURL})` : "`None`"} 
            > ***Banner*** : ${profil.banner ? `[Banner](${profil.bannerURL})` : "`None`"}
            > ***Avatar Decoration*** : ${user.avatarDecoration ? `[Decoration](${user.avatarDecorationURL})` : "`None`"}
            > ***Clan*** : \`${user.clan.tag || "None"}\`
            > ***Pronouns*** : \`${user.pronouns || "None"}\`
            > ***Username*** : \`${user.global_name || "None"}\`
            > ***About Me*** : ${profil?.bio ?? "None"}
            > ***Primary Color :*** \`#${profil?.themeColors ? profil.themeColors.map(r => r == 0 ? "000000" : r).join('\`\n> ***Accent Color :*** \`#') : `000000\`\n> ***Accent Color :*** \`#000000`}\``.replaceAll('  ', '')
        ));
    }
}