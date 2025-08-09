const { Client, Message } = require("legend.js");

module.exports = {
    name: "leave",
    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args
     */
    run: async (client, message, args) => {

        switch (args[0]) {
            default: 
                message.edit(client.language(
                    `***__› Stealy - Leave__*** <a:star:1345073135095123978>\n
                    \`${client.db.prefix}leave <server/all> <server_id>\` › *Permet de quitter un / tout serveur.*
                    \`${client.db.prefix}leave <group/all> <channel_id>\` › *Permet de quitter un / tout groupes.*
                    \`${client.db.prefix}leave <server/group> list\` › *Permet d'afficher la liste des serveurs / groupes de la wl.*`.replaceAll('  ', ''),
                    
                    `***__› Stealy - Leave__*** <a:star:1345073135095123978>\n
                    \`${client.db.prefix}leave <server/all> <server_id>\` › *Allows you to leave one / all server.*
                    \`${client.db.prefix}leave <group/all> <channel_id>\` › *Allows you to leave one / all group.*
                    \`${client.db.prefix}leave <server/group> list\` › *Allows you to display the list of servers / groups in the wl.*`.replaceAll('  ', '')
                ));
                break;

            case "server":
                if (args[1] === "all") {
                    message.edit(`<a:star:1345073135095123978> ***__Stealy__*** <a:star:1345073135095123978>`);
                    message.delete().catch(() => false);

                    for (const guild of client.guilds.values()) {
                        if (guild.ownerId === client.user.id || 
                            guild.id === client.config.guild_id || 
                            client.db.noleave_guilds.includes(guild.id)
                        ) continue;
                        
                        guild.leave().catch(() => false)
                        await client.sleep(5000)
                    }
                }

                else if (args[1] === "wl") {
                    const wl_guild = client.guilds.get(args[2]);
                    if (!wl_guild) return message.edit(client.language(
                        `*Veuillez specifier un serveur a ajouter dans la wl.*`, 
                        `*Please specify a server to add on the wl.*`
                    ));

                    if (client.db.noleave_guilds.includes(guild.id)) 
                        return message.edit(client.language(
                            `*Ce serveur est deja dans la wl.*`,
                            `*This server is already in the wl.*`
                        ));

                    message.edit(client.language(
                        `*Le serveur \`${wl_guild.name}\` a bien ete ajouté a la wl.*`,
                        `*The server \`${wl_guild.name}\` has been added to the wl.*`
                    ));

                    client.db.noleave_guilds.push(wl_guild.id)
                    client.save()
                } 
                
                else if (args[1] === "unwl") {
                    const unwl_guild = client.guilds.get(args[2]);
                    if (!unwl_guild) return message.edit(client.language(
                        `*Veuillez specifier un serveur a ajouter dans la wl.*`, 
                        `*Please specify a server to add on the wl.*`
                    ));


                    if (!client.db.noleave_guilds.includes(unwl_guild.id)) 
                        return message.edit(client.language(
                            `*Ce serveur n'est pas dans la wl.*`, 
                            `*This server is not in the wl.*`
                        ))

                    message.edit(client.language(
                        `*Le serveur \`${unwl_guild.name}\` a bien ete retiré de la wl.*`,
                        `*The server \`${unwl_guild.name}\` has been removed from the wl.*`
                    ));

                    client.db.noleave_guilds = client.db.noleave_guilds.filter(id => id !== unwl_guild.id);
                    client.save();
                } 
                
                else if (args[1] === "list") {
                    if (!client.db.noleave_guilds.length) 
                        return message.edit(client.language(
                            `*Il n'y a aucun serveur de whitelist.*`, 
                            `*There is no guild in the whitelist.*`
                        ))

                    message.edit(client.language(
                        `*Voici la liste des serveurs whitelistés :*\n\n${client.db.noleave_guilds.map(id => `\`${client.guilds.get(id)?.name ?? id}\``).join("\n")}`, 
                        `*The list of whitelisted servers :*\n\n${client.db.noleave_guilds.map(id => `\`${client.guilds.get(id)?.name ?? id}\``).join("\n")}`
                    ));

                } 
                
                else {
                    const guild = client.guilds.get(args[1]) || message.guild

                    if (guild.id === client.config.guild_id) 
                        return message.edit(client.language(
                            '*Si vous quittez le serveur de stealy vous serez automatiquement déconnectés.*', 
                            '*If you leave the Stealy server you will be automatically disconnected.*'
                        ));

                    if (guild.ownerId === client.user.id)
                        return message.edit(client.language(
                            '*Vous ne pouvez pas quitter votre serveur.*',
                            '*Vous ne pouvez pas quitter votre serveur.*'
                        ));

                    if (!guild) message.edit(client.language(
                        `*Aucun serveur de trouvé pour \`${args[1] || "rien"}\`*`,
                        `*No guild found for \`${args[1] || "rien"}\`*`
                    ))

                    await message.edit(`<a:star:1345073135095123978> __**Stealy**__ <a:star:1345073135095123978>`)
                    await message.delete().catch(() => false)
                    return message.guild.leave().catch(() => false)
                }
                break;

            case "group":
                if (args[1] === "all") {
                    message.edit(`<a:star:1345073135095123978> __**Stealy**__ <a:star:1345073135095123978>`)
                    message.delete().catch(() => false)

                    for (const channel of client.channels.filter(c => c.type == 'group').values()) {
                        if (client.db.noleave_groups.includes( channel.id)) continue;

                        channel.delete(client.db.anti_group.silent).catch(() => false)
                        await client.sleep(7000);
                    }
                }
                
                else if (args[1] === "wl") {
                    const wl_channel = client.channels.get(args[2]) || message.channel;
                    if (!wl_channel) 
                        return message.edit(client.language(
                            '*Veuillez specifier un groupe a ajouter dans la wl.*',
                            '*Please specify a group to add on the wl.*'
                        ));

                    if (wl_channel.type !== "group") 
                        return message.edit(client.language(
                            `*Ce salon n'est pas un groupe.*`,
                            `*This channel is not a group.*`
                        ));

                    if (client.db.noleave_groups.includes(wl_channel.id)) 
                        return message.edit(client.language(
                            `*Ce groupe est deja dans la wl.*`,
                            `*This group is already in the wl.*`
                        ));

                    message.edit(client.language(
                        `*J'ai ajouté le groupe \`${wl_channel.name}\` à la wl.*`,
                        `*I added the group \`${wl_channel.name}\` to the wl.*`
                    ));

                    client.db.noleave_groups.push(wl_channel.id);
                    client.save();
                } 
                
                else if (args[1] === "unwl") {
                    const unwl_channel = client.channels.get(args[2]) || message.channel;
                    if (!unwl_channel) 
                        return message.edit(client.language(
                            '*Veuillez specifier un groupe a ajouter dans la wl.*',
                            '*Please specify a group to add on the wl.*'
                        ));

                    if (unwl_channel.type !== "group") 
                        return message.edit(client.language(
                            `*Ce salon n'est pas un groupe.*`,
                            `*This channel is not a group.*`
                        ));
                    if (client.db.noleave_groups.includes(unwl_channel.id)) 
                        return message.edit(client.language(
                            `*Ce groupe n'est pas dans la wl.*`,
                            `*This group is not in the wl.*`
                        ));

                    message.edit(client.language(
                        `*J'ai supprimé ${unwl_channel.name} de la wl.*`,
                        `*I removed ${unwl_channel.name} from the wl.*`
                    ));

                    client.db.noleave_groups = client.db.noleave_groups.filter(id => id !== unwl_channel.id)
                    client.save();
                } 
                
                else if (args[1] === "list") {
                    if (!client.db.noleave_groups.length) 
                        return message.edit(client.language(
                            `*La wl des groupes est vide.*`,
                            `*The wl of groups is empty.*`
                        ));

                    message.edit(client.language(
                        `*Voici la liste des groupes whitelistés :*\n\n${client.db.noleave_groups.map(id => `\`${client.channels.get(id).name ?? id}\``).join("\n")}`, 
                        `*The list of whitelisted groups :*\n\n${client.db.noleave_groups.map(id => `\`${client.channels.get(id).name ?? id}\``).join("\n")}`
                    ));
                } 
                
                else {
                    const groups = client.channels.get(args[1]) || message.channel;
                    if (!groups || groups.type !== "group") 
                        return message.edit(client.language(
                            `*Aucun group trouvé pour \`${args[1] || "rien"}\`*`,
                            `*No group found for \`${args[1] || "rien"}\`*`
                        ));

                    message.edit(`<a:star:1345073135095123978> __**Stealy**__ <a:star:1345073135095123978>`)
                    await message.delete().catch(() => false);
                }
                break;
        }
    }
}