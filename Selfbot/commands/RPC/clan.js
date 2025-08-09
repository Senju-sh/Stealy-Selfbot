const { Client, Message } = require('legend.js');

module.exports = {
    name: "clan",
    premium: true,
    /**
     * @param {Client} client
     * @param {Message} message
    */
    run: async (client, message, args) => {
        switch(args[0]){
            default:
                if (!args[0]) 
                    return message.edit(client.language(
                        `***__› Stealy - CLAN__*** <a:star:1345073135095123978>
                        
                        \`${client.db.prefix}clan\` › *Affiche le menu de commandes clan.*
                        \`${client.db.prefix}clan <clan_name>\` › *Modifie votre clan actuel.*
                        
                        \`${client.db.prefix}clan on\` › *Active le multi clan.*
                        \`${client.db.prefix}clan off\` › *Désactive le multi clan.*

                        \`${client.db.prefix}clan add <clan_name>\` › *Ajoute un clan au multi clan.*
                        \`${client.db.prefix}clan del <clan_name>\` › *Retire un clan du multi clan.*
                        
                        \`${client.db.prefix}clan multi list\` › *Affiche la liste des multi clans.*
                        \`${client.db.prefix}clan list\` › *Affiche la la liste de vos clans.*`.replaceAll('  ', ''),
                        
                        `***__› Stealy - CLAN__*** <a:star:1345073135095123978>
                        
                        \`${client.db.prefix}clan\` › *Display the clan's menu.*
                        \`${client.db.prefix}clan <clan_name>\` › *Edit your clan tag.*
                        
                        \`${client.db.prefix}clan on\` › *Enable the multi clan.*
                        \`${client.db.prefix}clan off\` › *Disable the multi clan.*

                        \`${client.db.prefix}clan add <clan_name>\` › *Add a tag to your multi clan.*
                        \`${client.db.prefix}clan del <clan_name>\` › *Remove a tag from your multi clan.*
                        
                        \`${client.db.prefix}clan multi list\` › *Display the list of your multi clan.*
                        \`${client.db.prefix}clan list\` › *Display all your available tags.*`.replaceAll('  ', '')
                    ))
                    
                
                const clan = client.guilds.get(args[0]) || client.guilds.find(g => g.profile && g.profile.tag.toLowerCase().includes(args[0].toLowerCase()));
                
                if (!clan) 
                    return message.edit(client.language(
                        `*Veuillez spécifier un serveur valide.*`,
                        `*Please specify a valid guild.*`
                    ));

                if (!clan.features.includes('GUILD_TAGS'))
                    return message.edit(client.language(
                        `*Le serveur \`${clan.name}\` n'a pas de tag.*`,
                        `*The guild \`${clan.name}\` does not have a tag.*`
                    ));

                await fetch('https://discord.com/api/v10/users/@me/clan', {
                    method: "PUT",
                    headers: { authorization: client.token, 'Content-Type': 'application/json' },
                    body: JSON.stringify({ identity_guild_id: clan.id, identity_enabled: true }),
                });

                message.edit(client.language(
                    `*Votre clan a été modifié avec succès en \`${clan.name}\`.*`,
                    `*Your clan has been successfully changed to \`${clan.name}\`.*`
                ));
                break;
                
            case "on":
                if (client.db.clan.multi) 
                    return message.edit(client.language(
                        `*Le multi clan est déjà activé.*`,
                        `*Multi clan is already enabled.*`
                    ));

                client.db.clan.multi = true;
                client.save();
                message.edit(client.language(
                    `*Le multi clan a été activé.*`,
                    `*Multi clan has been enabled.*`
                ));
                break;

            case "off":
                if (!client.db.clan.multi) 
                    return message.edit(client.language(
                        `*Le multi clan est déjà désactivé.*`,
                        `*Multi clan is already disabled.*`
                    ));

                client.db.clan.multi = false;
                client.save();
                message.edit(client.language(
                    `*Le multi clan a été désactivé.*`,
                    `*Multi clan has been disabled.*`
                ));
                break;

            case "add":
                const addClan = client.guilds.get(args[1]) || client.guilds.find(g => g.profile && g.profile.tag.toLowerCase() === args[1].toLowerCase());
                if (!addClan) 
                    return message.edit(client.language(
                        `*Veuillez spécifier un serveur valide.*`,
                        `*Please specify a valid guild.*`
                    ));

                if (!addClan.features.includes('GUILD_TAGS'))
                    return message.edit(client.language(
                        `*Le serveur \`${addClan.name}\` n'a pas de tag.*`,
                        `*The guild \`${addClan.name}\` does not have a tag.*`
                    ));

                if (client.db.clan.guilds.includes(addClan.id))
                    return message.edit(client.language(
                        `*Le serveur \`${addClan.name}\` est déjà dans votre multi clan.*`,
                        `*The guild \`${addClan.name}\` is already in your multi clan.*`
                    ));

                client.db.clan.guilds.push(addClan.id);
                client.save();
                message.edit(client.language(
                    `*Le serveur \`${addClan.name}\` a été ajouté à votre multi clan avec succès.*`,
                    `*The guild \`${addClan.name}\` has been successfully added to your multi clan.*`
                ));
                break;

            case "del":
                const delClan = client.guilds.get(args[1]) || client.guilds.find(g => g.profile && g.profile.tag.toLowerCase() === args[1].toLowerCase());
                if (!delClan) 
                    return message.edit(client.language(
                        `*Veuillez spécifier un serveur valide.*`,
                        `*Please specify a valid guild.*`
                    ));

                if (!client.db.clan.guilds.includes(delClan.id))
                    return message.edit(client.language(
                        `*Le serveur \`${delClan.name}\` n'est pas dans votre multi clan.*`,
                        `*The guild \`${delClan.name}\` is not in your multi clan.*`
                    ));

                client.db.clan.guilds = client.db.clan.guilds.filter(id => id !== delClan.id);
                client.save();
                message.edit(client.language(
                    `*Le serveur \`${delClan.name}\` a été retiré de votre multi clan avec succès.*`,
                    `*The guild \`${delClan.name}\` has been successfully removed from your multi clan.*`
                ));
                break;

            case "multi":
                if (args[1] !== 'list') return;
                
                if (!client.db.clan.guilds || client.db.clan.guilds.length === 0) 
                    return message.edit(client.language(
                        `*Vous n'avez pas de multi clan actif.*`,
                        `*You have no active multi clan.*`
                    ));

                const multiList = client.db.clan.guilds.length ?  client.db.clan.guilds.map(id => {
                    const guild = client.guilds.get(id);
                    return guild ? `- \`${guild.name}\` - \`${guild.profile?.tag ?? client.language('Tag Inconnu', 'Unknown Tag')}\`` : `- \`${client.language("Serveur Introuvable", "Unknown Guild")}\``;
                }).join('\n') : client.language('Aucun serveur', 'No guild');

                client.send(message, client.language(
                    `*Voici la liste de vos multi clans :*\n${multiList}`,
                    `*Here is the list of your multi clans :*\n${multiList}`
                ));
                break;

            case "list":
                const allClans = client.guilds.filter(g => g.features.includes('GUILD_TAGS')).map(g => {
                    return `- \`${g.name}\` - \`${g.profile?.tag ?? client.language('Tag Inconnu', 'Unknown Tag')}\``;
                }).join('\n');

                if (!allClans) 
                    return message.edit(client.language(
                        `*Aucun clan disponible.*`,
                        `*No clan available.*`
                    ));

                client.send(message, client.language(
                    `*Voici la liste de tous les clans disponibles :*\n${allClans}`,
                    `*Here is the list of all available clans :*\n${allClans}`
                ));
                break;
        }
    }
};