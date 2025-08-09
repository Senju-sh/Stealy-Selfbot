const { Client, Message } = require("legend.js");

module.exports = {
    name: "dm",
    
    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args
     */
    run: async (client, message, args) => {
        if (!client.db.dm) client.db.dm = { wl: [] };

        switch (args[0]) {
            default: 
                message.edit(client.language(
                    `***__› Stealy - Dm__*** <a:star:1345073135095123978>

                    \`${client.db.prefix}dm lock\` › *Permet de lock vos dms que personne puisse vous dm sauf vos amis.*
                    \`${client.db.prefix}dm unlock\` › *Permet de unlock vos dms que tout le monde puisse vous dm.*

                    \`${client.db.prefix}dm <wl/unwl> <server_id>\` › *Ajoute/Retire un serveur a la wl.*
                    \`${client.db.prefix}dm list\` › *Affiche les serveurs wl.*`.replaceAll('  ', ''),
        
                    `***__› Stealy - Dm__*** <a:star:1345073135095123978>

                    \`${client.db.prefix}dm lock\` › *Allows you to lock your dms so only your friends can dm you.*
                    \`${client.db.prefix}dm unlock\` › *Allows you to unlock your dms so everyone can dm you.*

                    \`${client.db.prefix}dm <wl/unwl> <server_id>\` › *Add/Remove a server to the wl.*
                    \`${client.db.prefix}dm list\` › *Displays the servers wl.*`.replaceAll('  ', '')
                ));
                break;

                case "lock":
                    message.edit(client.language(
                        `Je vais vérouiller vos dm pour \`${client.guilds.size}\` serveurs.`,
                        `I will lock your dm for \`${client.guilds.size}\` servers.`
                    ));
                
                    
                    for (const guild of client.guilds.values()) {
                        if (guild.id === client.config.guild_id || client.db.nolock_dm.includes(guild.id)) continue;
                        await guild.allowDMs(false).catch(() => false);
                        await new Promise(resolve => setTimeout(resolve, 2000));
                    }
                    break;
                
                case "unlock":
                    message.edit(client.language(
                        `Je vais unlock vos dm pour \`${client.guilds.size}\` serveurs.`,
                        `I will unlock your dm for \`${client.guilds.size}\` servers.`
                    ));

                    for (const guild of client.guilds.values()) {
                        if (guild.id === client.config.guild_id || client.db.nolock_dm.includes(guild.id)) continue;
                        await guild.allowDMs(true).catch(() => false);
                        await new Promise(resolve => setTimeout(resolve, 2000));
                    }
                    break;                


            case "wl":
                const whitelist_guild = client.guilds.get(args[1]);

                if (!whitelist_guild) 
                    return message.edit(client.language(
                        `*Le serveur \`${args[1]}\` introuvable.*`,
                        `*Server not found for \`${args[1]}\`.*`
                    ));

                if (whitelist_guild.id === client.config.guild_id || client.db.nolock_dm.includes(whitelist_guild.id)) 
                    return message.edit(client.language(
                        `*Le serveur ${whitelist_guild.name} est deja dans la wl.*`, 
                        `*The server ${whitelist_guild.name} is already in the wl.*`
                    ));

                client.db.nolock_dm.push(whitelist_guild.id);
                client.save();

                message.edit(client.language(
                    `*Le serveur ${whitelist_guild.name} a bien ete ajouté a la wl.*`, 
                    `*The server ${whitelist_guild.name} has been added to the wl.*`
                ));
                break;

            case "unwl":
                const unwhitelist_guild = client.guilds.get(args[1]);

                if (!unwhitelist_guild) 
                    return message.edit(client.language(
                        `*Serveur \`${args[1]}\` introuvable.*`, 
                        `*Server not found for \`${args[1]}\`.*`
                    ));

                if (unwhitelist_guild.id === client.config.guild_id || !client.db.nolock_dm.includes(unwhitelist_guild.id)) return message.edit(client.language(`*Le serveur ${fdp2.name} n'est pas dans la wl.*`, `*The server ${fdp2.name} is not in the wl.*`));

                client.db.nolock_dm = client.db.nolock_dm.filter(o => o !== unwhitelist_guild.id);
                client.save();

                message.edit(client.language(
                    `*Le serveur ${unwhitelist_guild.name} a bien été retiré de la wl.*`,
                    `*The server ${unwhitelist_guild.name} has been removed from the wl.*`
                ));
                break;

            case "list":
                if (!client.db.dm.wl.length) 
                    return message.edit(client.language(
                        `*Aucun utilisateur dans la wl.*`,
                        `*No users in the wl.*`
                    ));

                message.edit(client.language(
                    `*Liste des serveurs dans la wl :\n\n${client.db.dm.wl.map(o => `${client.guilds.get(o).name} › \`${o}\``).join("\n")}.*`, 
                    `*List of servers in the wl :\n\n${client.db.dm.wl.map(o => `${client.guilds.get(o).name} › \`${o}\``).join("\n")}.*`
                ));
                break;
        }
    }
}