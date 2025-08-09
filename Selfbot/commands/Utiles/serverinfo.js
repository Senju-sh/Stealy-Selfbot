const { Client, Message } = require("legend.js")

module.exports = {
    name: "serverinfo",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        const guild = client.guilds.get(args[0]) || message.guild
        
        if (!guild) 
            return message.edit(client.language(
                `Aucun serveur n'a été trouvé`,
                `No guilds has been found`
            ));
        

        message.edit(client.language(
            `***__› Stealy - Server Info__*** <a:star:1345073135095123978>

            > ***Nom :*** [\`${guild.name}\`](<https://discord.gg/stealy>)
            > ***ID :*** [\`${guild.id}\`](<https://discord.gg/stealy>)
            > ***Propriétaire :*** <@${guild.ownerID}>
            > ***ID du propriétaire :*** [\`${guild.ownerID}\`](<https://discord.gg/stealy>)
            > ***Salons :*** [\`${guild.channels.size}\`](<https://discord.gg/stealy>)
            > ***Rôles :*** [\`${guild.roles.size}\`](<https://discord.gg/stealy>)
            > ***Membres :*** [\`${guild.memberCount}\`](<https://discord.gg/stealy>)
            > ***Date de création :*** <t:${Math.round(guild.createdTimestamp / 1000)}> <t:${Math.round(guild.createdTimestamp / 1000)}:R> 
            > ***Jours depuis la création :*** [\`${Math.floor(Date.now() - guild.createdAt.getTime() / 1000 / 60 / 60 / 24)}\`](<https://discord.gg/stealy>)
            > ***Sur le serveur depuis :*** <t:${Math.round(guild.me.joinedTimestamp / 1000)}> <t:${Math.round(guild.me.joinedTimestamp / 1000)}:R>
            > ***Bannière du serveur :*** ${guild.banner ? `[\`Lien de la banniere\`](https://cdn.discordapp.com/banners/${guild.id}/${guild.banner}.webp?size=4096)` : "[`Pas de bannière`](<https://discord.gg/stealy>)"}
            > ***Photo du serveur :*** ${guild.icon ? `[\`Lien de l'icon\`](https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp?size=4096)` : "[`Pas d'icon`](<https://discord.gg/stealy>)"}
            > ***Bannière d'invitation :*** ${guild.splash ? `[\`Lien de la banniere d'invitation\`](https://cdn.discordapp.com/splashes/${guild.id}/${guild.splash}.png?size=4096)` : "[`Pas de bannière`](<https://discord.gg/stealy>)"}`.replaceAll('  ', ''),

            `***__› Stealy - Server Info__*** <a:star:1345073135095123978>

            > ***Name :*** [\`${guild.name}\`](<https://discord.gg/stealy>)
            > ***ID :*** [\`${guild.id}\`](<https://discord.gg/stealy>)
            > ***Founder :*** <@${guild.ownerId}>
            > ***Founder ID :*** [\`${guild.ownerId}\`](<https://discord.gg/stealy>)
            > ***Channels :*** [\`${guild.channels.size}\`](<https://discord.gg/stealy>)
            > ***Roles :*** [\`${guild.roles.size}\`](<https://discord.gg/stealy>)
            > ***Members :*** [\`${guild.memberCount}\`](<https://discord.gg/stealy>)
            > ***Creation date :*** <t:${Math.round(guild.createdTimestamp / 1000)}> <t:${Math.round(guild.createdTimestamp / 1000)}:R> 
            > ***Days since the creation :*** [\`${Math.floor(Date.now() - guild.createdAt.getTime() / 1000 / 60 / 60 / 24)}\`](<https://discord.gg/stealy>)
            > ***In the server from :*** <t:${Math.round(guild.me.joinedTimestamp / 1000)}> <t:${Math.round(guild.me.joinedTimestamp / 1000)}:R>
            > ***Server Banner :*** ${guild.banner ? `[\`Lien de la banniere\`](https://cdn.discordapp.com/banners/${guild.id}/${guild.banner}.webp?size=4096)` : "[`Pas de bannière`](<https://discord.gg/stealy>)"}
            > ***Server Icon :*** ${guild.icon ? `[\`Lien de l'icon\`](https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp?size=4096)` : "[`Pas d'icon`](<https://discord.gg/stealy>)"}
            > ***Server Splash :*** ${guild.splash ? `[\`Lien de la banniere d'invitation\`](https://cdn.discordapp.com/splashes/${guild.id}/${guild.splash}.png?size=4096)` : "[`Pas de bannière`](<https://discord.gg/stealy>)"}`.replaceAll('  ', '')
        ))
    }
}