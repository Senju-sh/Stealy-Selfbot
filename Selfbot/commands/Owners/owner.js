module.exports = {
    name: "owner",
    owner: true,
    run: async (client, message, args) => {
        message.edit(client.language(`***__› Stealy - Owner__*** <a:star:1345073135095123978>
${client.replace(client.db.desc) || "-# *La guerre ne détermine pas qui est bon ou ce qui est mauvais.*"}

\`${client.db.prefix}addtoken <token>\` › *Ajouter un token.*
\`${client.db.prefix}multispoof\` › *Affiche le menu multispoof.*

\`${client.db.prefix}raid\` › *Affiche le panel raid.*
\`${client.db.prefix}viplist\` › *Affiche les noms de commandes vip.*`.replaceAll('  ', ''),

`***__› Stealy - Owner__*** <a:star:1345073135095123978>
${client.replace(client.db.desc) || "-# *War does not determine who is good or who is bad.*"}

\`${client.db.prefix}addtoken <token>\` › *Connect a token.*
\`${client.db.prefix}multispoof\` › *Display the multispoof panel.*

\`${client.db.prefix}raid\` › *Display all the raid commands.*
\`${client.db.prefix}viplist\` › *Show you every VIP commands.*`.replaceAll('  ', '')))
    }
}