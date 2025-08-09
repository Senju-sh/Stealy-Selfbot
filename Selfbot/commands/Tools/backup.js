const backup = require('../../../Structures/packages/legend-backup');
const discord = require("legend.js");
const path = require('node:path');
const fs = require("node:fs");
const d = {}

module.exports = {
    name: "backup",
    /**
     * @param {discord.Client} client
     * @param {discord.Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {   
        backup.setStorageFolder(path.join(__dirname, `../../../Structures/backups/${client.user.id}/serveurs`));
        
        if (!fs.existsSync(`./Structures/backups/${client.user.id}/roles`)) {
            fs.mkdirSync(`./Structures/backups/${client.user.id}/roles`, { recursive: true });
        }
        if (!fs.existsSync(`./Structures/backups/${client.user.id}/stickers`)) {
            fs.mkdirSync(`./Structures/backups/${client.user.id}/stickers`, { recursive: true });
        }

        if (!args[0]) 
            return message.edit(client.language(
                `***__› Stealy__*** <a:star:1345073135095123978>

                \`${client.db.prefix}backup c <id serveur>\` › *Création de la backup du serveur voulu.*
                \`${client.db.prefix}backup load <id backup>\` › *Charge la backup voulu sur le serveur ou vous êtes.*

                \`${client.db.prefix}backup template <id serveur>\` › *Récupère un modèle serveur.*
                \`${client.db.prefix}backup template <on/off>\` › *Permet d’activer / desactiver pour recevoir dans un salon la template automatiquement après le load d’une backup.*

                \`${client.db.prefix}backup info <id backup>\` › *Vous donne les infos sur la backup.*
                \`${client.db.prefix}backup emoji <id serveur>\` › *Création de la backup emojis du serveur voulu.*

                \`${client.db.prefix}backup roles <id serveur>\` › *Création de la backup des rôles du serveur voulu.*
                \`${client.db.prefix}backup stickers <id serveur>\` › *Création de la backup des stickers du serveur voulu.*

                \`${client.db.prefix}backup delete <id backup>\` › *Supprime la backup voulue.*
                \`${client.db.prefix}backup list\` › *Affiche la liste de vos backups.*

                \`${client.db.prefix}backup clear\` › *Clear toutes vos backups de serveurs.*
                \`${client.db.prefix}backup clearall\` › *Supprime toutes vos backups.*`.replaceAll('  ', ''),
                `***__› Stealy__*** <a:star:1345073135095123978>

                \`${client.db.prefix}backup c <id serveur>\` › *Create the backup of the desired server.*
                \`${client.db.prefix}backup load <id backup>\` › *Charge the backup you want on the server or you are on.*

                \`${client.db.prefix}backup info <id backup>\` › *Displays information about the backup.*
                \`${client.db.prefix}backup emoji <id serveur>\` › *Create the backup emojis of the desired server.*

                \`${client.db.prefix}backup delete <id backup>\` › *Delete the backup you want.*
                \`${client.db.prefix}backup list\` › *Displays the list of your backups.*
                
                \`${client.db.prefix}backup clear\` › *Clear all your guilds backups.*
                \`${client.db.prefix}backup clearall\` › *Clear all your backups.*`.replaceAll('  ', '')
            ))

    else if (args[0].toLowerCase() === "template"){
        if (args[1] == 'on'){
            if (client.db.auto_templates)
                return message.edit(client.language(
                    `*Les templates automatiques sont déjà activés.*`,
                    `*The auto templates are already enable.*`
                ))

            client.db.auto_templates = true;
            client.save();

            return message.edit(client.language(
                `*Les templates automatiques sont maintenant activés.*`,
                `*The auto templates are now enabled.*`
            ))
        }

        else if (args[1] == 'off'){ 
            if (!client.db.auto_templates)
                return message.edit(client.language(
                    `*Les templates automatiques sont déjà désactivés.*`,
                    `*The auto templates are already disable.*`
                )) 

            client.db.auto_templates = false;
            client.save(); 

            return message.edit(client.language(
                `*Les templates automatiques sont maintenant désactivés.*`,
                `*The auto templates are now disabled.*`
            ))
        }

        else {
            const guild = client.guilds.get(args[1]) ?? message.guild;
            if (!guild) return message.edit(client.language(`*Veuillez utiliser cette commande sur un serveur.*`, `*Please use this command on a guild.*`))
            if (!message.guild.me.permissions.has("MANAGE_GUILD")) return message.edit(client.language(`*Vous n'avez pas la permission nécessaire pour executer cette commande.*`, `*You did not get the required permission to execute this command.*`));

            guild.createTemplate({ name: guild.name, description: "Cette template a été faite à l'aide de Stealy" })
                .then((res) => message.edit(client.language(`*Le template du serveur [${guild.name}](https://discord.new/${res.code}) a été créé.*`, `*The template of the guild [${guild.name}](https://discord.new/${res.code}) was created.*`)))
                .catch(err => message.edit(client.language(`*Une erreur est survenue lors de la création du template.*`, `*An error occurred while creating the template.*`)))
        }
    }
        

    else if (args[0] === "create" || args[0] === "c"){
        const guild = client.guilds.get(args[1]) || message.guild
        if (!guild) return message.edit(client.language(`*Veuillez utiliser cette commande sur un serveur.*`, `*Please use this command on a guild.*`))
        
        const backupID = makeid(8)
        await message.edit(client.language(`*La backup du serveur ${guild.name} est en cours de création...*`, `*The backup of the guild ${guild.name} is under creation..*`), client.language(`*La backup du serveur ${guild.name} est en cours de création avec l'ID \`${backupID}\`.*`, `*The backup of the guild ${guild.name} is under creation with the ID \`${backupID}\`.*`))

        const backupData = await backup.create(guild, { backupID, maxMessagesPerChannel: 0, doNotBackup: ['emojis', 'bans'], saveImages: 'base64' })
        message.edit(client.language(`*La backup du serveur ${guild.name} a été crée.*\n*\`${client.db.prefix}backup load ${backupData.id}\` *`, `*The backup of the guild ${guild.name} is done.*\n*\`${client.db.prefix}backup load ${backupData.id}\` *`))
    }

    else if (args[0] === "emoji"){
        const guild = client.guilds.get(args[1]) || message.guild
        if (!guild) return message.edit(client.language(`*Veuillez utiliser cette commande dans un serveur*`,`*Please use this command in a server.*`))

        const backupid = makeid(8)
        const er = new Array()
        
        guild.emojis.forEach(e => er.push(`"${e.toString()}"`))
        
        const data = {
            emojis: er,
            name: guild.name,
            id: guild.id,
            code: backupid,
            size: guild.emojis.size,
            createdTimestamp: Date.now()
        }
        
        fs.writeFileSync(`./Structures/backups/${client.user.id}/emojis/${backupid}.json`, JSON.stringify(data, null, 4))            
        message.edit(client.language(`*Création de la backup des emotes terminée.*\n*\`${client.db.prefix}backup load ${backupid}\` *`,`*Backup of emojis completed.*\n*\`${client.db.prefix}backup load ${backupid}\`*`))
    }

    else if (args[0] === "roles"){
        const guild = client.guilds.get(args[1]) || message.guild
        if (!guild) return message.edit(client.language(`*Veuillez utiliser cette commande dans un serveur*`,`*Please use this command in a server.*`))

            
        await message.edit(client.language(`*La backup des rôles du serveur ${guild.name} est en cours de création...*`, `*The backup of the roles of guild ${guild.name} is under creation..*`))

        const backupid = makeid(8)        
        const rolesData = []
        
        guild.roles.forEach(role => {
            if (role.id !== guild.id) {
                rolesData.push({
                    name: role.name,
                    color: role.color,
                    hoist: role.hoist,
                    position: role.position,
                    permissions: role.permissions,
                    mentionable: role.mentionable,
                    managed: role.managed
                })
            }
        })
        
        const data = {
            roles: rolesData,
            name: guild.name,
            id: guild.id,
            code: backupid,
            size: rolesData.length,
            createdTimestamp: Date.now()
        }
        
        fs.writeFileSync(`./Structures/backups/${client.user.id}/roles/${backupid}.json`, JSON.stringify(data, null, 4))            
        message.edit(client.language(`*Création de la backup des rôles terminée.*\n*\`${client.db.prefix}backup load ${backupid}\` *`,`*Backup of roles completed.*\n*\`${client.db.prefix}backup load ${backupid}\`*`))
    }

    else if (args[0] === "stickers"){
        const guild = client.guilds.get(args[1]) || message.guild
        if (!guild) return message.edit(client.language(`*Veuillez utiliser cette commande dans un serveur*`,`*Please use this command in a server.*`))

        const backupid = makeid(8)
        const stickersData = []
        
        guild.stickers.forEach(sticker => {
            stickersData.push({
                name: sticker.name,
                description: sticker.description,
                tags: sticker.tags,
                url: sticker.url,
                format: sticker.format
            })
        })
        
        const data = {
            stickers: stickersData,
            name: guild.name,
            id: guild.id,
            code: backupid,
            size: stickersData.length,
            createdTimestamp: Date.now()
        }
        
        fs.writeFileSync(`./Structures/backups/${client.user.id}/stickers/${backupid}.json`, JSON.stringify(data, null, 4))            
        message.edit(client.language(`*Création de la backup des stickers terminée.*\n*\`${client.db.prefix}backup load ${backupid}\` *`,`*Backup of stickers completed.*\n*\`${client.db.prefix}backup load ${backupid}\`*`))
    }

    else if (args[0] === "load"){
        if (fs.existsSync(`./Structures/backups/${client.user.id}/emojis/${args[1]}.json`)){
            if (!message.guild) return message.edit(client.language(`*Veuillez refaire cette commande dans un serveur.*`,`*Please execute this command within a server.*`))
            if (!message.guild.me.permissions.has("MANAGE_EMOJIS_AND_STICKERS")) return message.edit(client.language(`*Vous n'avez pas les permissions nécessaire pour executer cette commande*`,`*You do not have the necessary permissions to execute this command.*`))
            
            try {
                const emojiBackupPath = require.resolve(`../../../Structures/backups/${client.user.id}/emojis/${args[1]}.json`);
                delete require.cache[emojiBackupPath];
                
                const data = JSON.parse(fs.readFileSync(`./Structures/backups/${client.user.id}/emojis/${args[1]}.json`, 'utf-8'));
                message.edit(client.language(`*Chargement de : \`${data.size}\` emotes !*`,`*Load of : \`${data.size}\` emotes !*`))
                    
                for (const emote of data.emojis.map(r => r)){
                    try {
                        let emoji = discord.Util.parseEmoji(emote);
                        if (emoji?.id) {
                            await message.guild.createEmoji(`https://cdn.discordapp.com/emojis/${emoji?.id}.${emoji.animated ? 'gif' : 'png'}`, emoji.name);
                            await new Promise(r => setTimeout(r, 200));
                        }
                    } catch (error) {
                        console.log(`Error creating emoji ${emoji?.name}:`, error.message);
                    }
                }
                
                message.edit(client.language(`*Emojis chargés avec succès !*`, `*Emojis loaded successfully!*`));
            } catch (error) {
                console.log('Emoji backup load error:', error);
                message.edit(client.language(`*Erreur lors du chargement des emojis: ${error.message}*`, `*Error loading emojis: ${error.message}*`));
            }
        }

        else if (fs.existsSync(`./Structures/backups/${client.user.id}/roles/${args[1]}.json`)){
            if (!message.guild) return message.edit(client.language(`*Veuillez refaire cette commande dans un serveur.*`,`*Please execute this command within a server.*`))
            if (!message.guild.me.permissions.has("MANAGE_ROLES")) return message.edit(client.language(`*Vous n'avez pas les permissions nécessaire pour executer cette commande*`,`*You do not have the necessary permissions to execute this command.*`))
            
            try {
                const rolesBackupPath = require.resolve(`../../../Structures/backups/${client.user.id}/roles/${args[1]}.json`);
                delete require.cache[rolesBackupPath];
                
                const data = JSON.parse(fs.readFileSync(`./Structures/backups/${client.user.id}/roles/${args[1]}.json`, 'utf-8'));
                message.edit(client.language(`*Chargement de : \`${data.size}\` rôles !*`,`*Load of : \`${data.size}\` roles !*`))
                    
                for (const role of message.guild.roles.values()){
                    try {
                        if (role.id !== message.guild.id && (message.guild.ownerID == client.user.id || !role.managed && role.position < message.guild.me.highestRole)) {
                            await role.delete();
                            await new Promise(r => setTimeout(r, 300));
                        }
                    } catch { false }
                }

                for (const roleData of data.roles){
                    try {
                        await message.guild.createRole({
                            name: roleData.name,
                            color: roleData.color,
                            hoist: roleData.hoist,
                            permissions: roleData.permissions,
                            mentionable: roleData.mentionable
                        });
                        await new Promise(r => setTimeout(r, 300));
                    } catch (error) {
                        console.log(`Error creating role ${roleData.name}:`, error.message);
                    }
                }
                
                message.edit(client.language(`*Rôles chargés avec succès !*`, `*Roles loaded successfully!*`));
            } catch (error) {
                console.log('Roles backup load error:', error);
                message.edit(client.language(`*Erreur lors du chargement des rôles: ${error.message}*`, `*Error loading roles: ${error.message}*`));
            }
        }

        else if (fs.existsSync(`./Structures/backups/${client.user.id}/stickers/${args[1]}.json`)){
    if (!message.guild) return message.edit(client.language(`*Veuillez refaire cette commande dans un serveur.*`,`*Please execute this command within a server.*`))
    if (!message.guild.me.permissions.has("MANAGE_EMOJIS_AND_STICKERS")) return message.edit(client.language(`*Vous n'avez pas les permissions nécessaire pour executer cette commande*`,`*You do not have the necessary permissions to execute this command.*`))
    
    try {
        const stickersBackupPath = require.resolve(`../../../Structures/backups/${client.user.id}/stickers/${args[1]}.json`);
        delete require.cache[stickersBackupPath];

        const data = JSON.parse(fs.readFileSync(`./Structures/backups/${client.user.id}/stickers/${args[1]}.json`, 'utf-8'));
            
        message.edit(client.language(`*Chargement de : \`${data.size}\` stickers !*`,`*Load of : \`${data.size}\` stickers !*`))
            
        for (const stickerData of data.stickers){
            try {
                const imageResponse = await fetch(stickerData.url);
                if (!imageResponse.ok) continue;
                
                const imageBuffer = await imageResponse.arrayBuffer();
                
                let fileName = 'sticker.png';
                let mimeType = 'image/png';
                
                const contentType = imageResponse.headers.get('content-type');
                if (contentType) {
                    if (contentType.includes('gif')) {
                        fileName = 'sticker.gif';
                        mimeType = 'image/gif';
                    } else if (contentType.includes('webp')) {
                        fileName = 'sticker.webp';
                        mimeType = 'image/webp';
                    } else if (contentType.includes('apng')) {
                        fileName = 'sticker.png';
                        mimeType = 'image/apng';
                    }
                } else if (stickerData.url.includes('.gif')) {
                    fileName = 'sticker.gif';
                    mimeType = 'image/gif';
                } else if (stickerData.url.includes('.webp')) {
                    fileName = 'sticker.webp';
                    mimeType = 'image/webp';
                }
                
                const imageBlob = new Blob([imageBuffer], { type: mimeType });
                
                const formData = new FormData();
                formData.append('name', stickerData.name);
                formData.append('description', stickerData.description || ' ');
                formData.append('tags', stickerData.tags);
                formData.append('file', imageBlob, fileName);
                
                const response = await fetch(`https://discord.com/api/v10/guilds/${message.guild.id}/stickers`, {
                    method: 'POST',
                    headers: { 'Authorization': client.token },
                    body: formData
                });

                if (!response.ok) {
                    const errorData = await response.text();
                    throw new Error(`HTTP error! status: ${response.status} - ${errorData}`);
                }

                await new Promise(r => setTimeout(r, 500));
            } catch (error) {
                console.log(`Error creating sticker ${stickerData.name}:`, error.message);
            }
        }

        message.edit(client.language(`*Stickers chargés avec succès !*`, `*Stickers loaded successfully!*`));
    } catch (error) {
        console.log('Stickers backup load error:', error);
        message.edit(client.language(`*Erreur lors du chargement des stickers: ${error.message}*`, `*Error loading stickers: ${error.message}*`));
    }
}

        else if (fs.existsSync(`./Structures/backups/${client.user.id}/serveurs/${args[1]}.json`)){
            if (!message.guild) return message.edit(client.language(`*Veuillez utiliser cette commande sur un serveur.*`, `*Please use this command on a guild.*`))
            if (!message.guild.me.permissions.has("ADMINISTRATOR")) return message.edit(client.language(`*Vous n'avez pas la permission nécessaire pour executer cette commande.*`, `*You didn't got the required permission to execute this command.*`))
    
            const cooldownKey = `${client.user.id}_${message.guild.id}`;
            if (d[cooldownKey] && !client.config.owners.includes(message.author.id)) return message.edit(client.language(`*Veuillez utiliser la commande dans <t:${Math.round(d[cooldownKey] / 1000)}:R>.*`, `*Please use this command util <t:${Math.round(d[cooldownKey] / 1000)}:R>.*`))

            d[cooldownKey] = Date.now() + 1000 * 60 * 10;
            setTimeout(() => delete d[cooldownKey], 1000 * 60 * 10);

            await message.edit(client.language(`*Chargement de la backup en cours...*`, `*Loading backup...*`));

            try {
                const backupPath = require.resolve(`../../../Structures/backups/${client.user.id}/serveurs/${args[1]}.json`);
                delete require.cache[backupPath];
                
                for (const role of message.guild.roles.values()){
                    try {
                        if (role.id !== message.guild.id && (message.guild.ownerID == client.user.id || !role.managed && role.position < message.guild.me.highestRole)) {
                            await role.delete();
                            await new Promise(r => setTimeout(r, 300));
                        }
                    } catch { false }
                }

                let loadSuccess = false;
                let retryCount = 0;
                const maxRetries = 2;
                
                while (!loadSuccess && retryCount <= maxRetries) {
                    try {
                        const community = await backup.fetch(args[1]).then(r => r.data.community)
                        if (community && !message.guild.features.includes("COMMUNITY")) 
                            message.guild.setCommunity(true);
                        
                        await backup.load(args[1], message.guild);
                        loadSuccess = true;

                        await message.edit(client.language(`*Backup chargée avec succès !*`, `*Backup loaded successfully!*`));
                        if (client.db.auto_templates && client.db.logger.templates) message.guild.createTemplate({ name: message.guild.name, description: client.language("Cette backup a été faite par Stealy", "This backup has been created by Stealy Stealy") })
                            .then((res) => client.log(client.db.logger.templates, { content: `https://discord.new/${res.code}` }))
                            .catch(() => false);

                    } catch (err) {
                        retryCount++;
                        
                        if (retryCount <= maxRetries) {
                            await message.edit(client.language(
                                `*Erreur lors du chargement, nouvelle tentative (${retryCount}/${maxRetries})...*`, 
                                `*Loading error, retrying (${retryCount}/${maxRetries})...*`
                            ));
                            await new Promise(r => setTimeout(r, 2000));
                        } else {
                            await message.edit(client.language(
                                `*Erreur lors du chargement de la backup après ${maxRetries} tentatives: ${err}*`, 
                                `*Error loading backup after ${maxRetries} attempts: ${err}*`
                            ));
                        }
                    }
                }
            } catch (error) {
                console.log('Backup process error:', error);
                await message.edit(client.language(`*Erreur lors du processus de backup: ${error.message}*`, `*Error during backup process: ${error.message}*`));
                delete d[cooldownKey];
            }
        }
        else return message.edit(client.language(`*Aucun id de backup trouvé pour \`${args[1] || "rien"}\`.*`, `*No backup id found for \`${args[1] || "rien"}\`.*`))
    }

    else if (args[0] === "info"){
        if (fs.existsSync(`./Structures/backups/${client.user.id}/serveurs/${args[1]}.json`)){
            try {
                const serverBackupPath = require.resolve(`../../../Structures/backups/${client.user.id}/serveurs/${args[1]}.json`);
                delete require.cache[serverBackupPath];
            } catch {}
            const backupData = JSON.parse(fs.readFileSync(`./Structures/backups/${client.user.id}/serveurs/${args[1]}.json`, 'utf-8'));

            const communityInfo = backupData.community ? 
                `> \`Communauté\` › *${backupData.community.enabled ? 'Activée' : 'Désactivée'}*
> \`Canal Système\` › *${backupData.community.systemChannelID ? 'Configuré' : 'Aucun'}*
> \`Canal Règles\` › *${backupData.community.rulesChannelID ? 'Configuré' : 'Aucun'}*
> \`Canal Annonces\` › *${backupData.community.publicUpdatesChannelID ? 'Configuré' : 'Aucun'}*
> \`Canal Alertes\` › *${backupData.community.safetyAlertsChannelID ? 'Configuré' : 'Aucun'}*` : '';

            message.edit(client.language(`***__› Stealy - Backup__*** <a:star:1345073135095123978>

> \`Serveur\` › *${backupData.name}*
> \`Serveur ID\` › *${backupData?.id}*
> \`Icon du Serveur\` › *${backupData.icon ?? `[\`Lien de l'image\`](${backupData.iconURL})` ?? `\`Aucune\``} *
> \`Bannière du serveur\` › *${backupData.banner ?? `[\`Lien de l'image\`](${backupData.bannerURL})` ?? `\`Aucune\``} *
> \`Bannière d'Invitation\`
-# ➜ ***${backupData.splash ?? backupData.splashURL ?? 'Aucune'} ***
${communityInfo}
> \`Taille du fichier\`
-# ➜ ***${Number((backupData.size / 1024).toFixed(2))}kb***
> \`Créé\`
-# ➜ ***<t:${Math.round(backupData.createdTimestamp / 1000)}:R>***`.replaceAll("      ", ""),
    
    `<:star:1262311834019696682> __**Stealy - Backup**__ <:star:1262311834019696682>

> \`Server\`
-# ➜ ***${backupData.name}***
> \`Server ID\`
-# ➜ ***${backupData?.id}***
> \`Server's Icon\`
-# ➜ ***${backupData.icon ?? backupData.iconURL ?? "Nothing"} ***
> \`Server's Banner\`
-# ➜ ***${backupData.banner ?? backupData.bannerURL ?? "Nothing"} ***
> \`Server's Splash\`
-# ➜ ***${backupData.splash ?? backupData.splashURL ?? 'Nothing'} ***
${backupData.community ? 
    `> \`Community\` › *${backupData.community.enabled ? 'Enabled' : 'Disabled'}*
> \`System Channel\` › *${backupData.community.systemChannelID ? 'Configured' : 'None'}*
> \`Rules Channel\` › *${backupData.community.rulesChannelID ? 'Configured' : 'None'}*
> \`Updates Channel\` › *${backupData.community.publicUpdatesChannelID ? 'Configured' : 'None'}*
> \`Safety Channel\` › *${backupData.community.safetyAlertsChannelID ? 'Configured' : 'None'}*` : ''}
> \`File Size\`
-# ➜ ***${Number((backupData.size / 1024).toFixed(2))}kb***
> \`Created\`
-# ➜ ***<t:${Math.round(backupData.createdTimestamp / 1000)}:R>***`))
        }
        else if (fs.existsSync(`./Structures/backups/${client.user.id}/emojis/${args[1]}.json`)){
            try {
                const emojiBackupPath = require.resolve(`../../../Structures/backups/${client.user.id}/emojis/${args[1]}.json`);
                delete require.cache[emojiBackupPath];
            } catch {}
            const backupData = JSON.parse(fs.readFileSync(`./Structures/backups/${client.user.id}/emojis/${args[1]}.json`, 'utf-8'));
            const size = fs.statSync(`./Structures/backups/${client.user.id}/emojis/${args[1]}.json`)

            message.edit(client.language(`<:star:1262311834019696682> __**Stealy - Backup**__ <:star:1262311834019696682>
> \`Serveur\`
-# ➜ ***${backupData.name}***
> \`Serveur ID\`
-# ➜ ***${backupData?.id}***
> \`Nombre d'emojis\`
-# ➜ ***${backupData.size}***
> \`Taille du fichier\`
-# ➜ ***${Number((size / 1024).toFixed(2))}kb***
> \`Créé\`
-# ➜ ***<t:${Math.round(backupData.createdTimestamp / 1000)}:R>***`.replaceAll("      ", ""),
                    
                    `<:star:1262311834019696682> __**Stealy - Backup**__ <:star:1262311834019696682>
> \`Server\`
-# ➜ ***${backupData.name}***
> \`Server ID\`
-# ➜ ***${backupData?.id}***
> \`Emoji's Size\`
-# ➜ ***${backupData.size}***
> \`File Size\`
-# ➜ ***${Number((size / 1024).toFixed(2))}kb***
> \`Created\`
-# ➜ ***<t:${Math.round(backupData.createdTimestamp / 1000)}:R>***`))                
        }
        else if (fs.existsSync(`./Structures/backups/${client.user.id}/roles/${args[1]}.json`)){
            try {
                const rolesBackupPath = require.resolve(`../../../Structures/backups/${client.user.id}/roles/${args[1]}.json`);
                delete require.cache[rolesBackupPath];
            } catch {}
            const backupData = JSON.parse(fs.readFileSync(`./Structures/backups/${client.user.id}/roles/${args[1]}.json`, 'utf-8'));
            const size = fs.statSync(`./Structures/backups/${client.user.id}/roles/${args[1]}.json`)

            message.edit(client.language(`<:star:1262311834019696682> __**Stealy - Backup**__ <:star:1262311834019696682>
> \`Serveur\`
-# ➜ ***${backupData.name}***
> \`Serveur ID\`
-# ➜ ***${backupData?.id}***
> \`Nombre de rôles\`
-# ➜ ***${backupData.size}***
> \`Taille du fichier\`
-# ➜ ***${Number((size / 1024).toFixed(2))}kb***
> \`Créé\`
-# ➜ ***<t:${Math.round(backupData.createdTimestamp / 1000)}:R>***`.replaceAll("      ", ""),
                    
                    `<:star:1262311834019696682> __**Stealy - Backup**__ <:star:1262311834019696682>
> \`Server\`
-# ➜ ***${backupData.name}***
> \`Server ID\`
-# ➜ ***${backupData?.id}***
> \`Roles Size\`
-# ➜ ***${backupData.size}***
> \`File Size\`
-# ➜ ***${Number((size / 1024).toFixed(2))}kb***
> \`Created\`
-# ➜ ***<t:${Math.round(backupData.createdTimestamp / 1000)}:R>***`))                
        }
        else if (fs.existsSync(`./Structures/backups/${client.user.id}/stickers/${args[1]}.json`)){
            try {
                const stickersBackupPath = require.resolve(`../../../Structures/backups/${client.user.id}/stickers/${args[1]}.json`);
                delete require.cache[stickersBackupPath];
            } catch {}
            const backupData = JSON.parse(fs.readFileSync(`./Structures/backups/${client.user.id}/stickers/${args[1]}.json`, 'utf-8'));
            const size = fs.statSync(`./Structures/backups/${client.user.id}/stickers/${args[1]}.json`)

            message.edit(client.language(`<:star:1262311834019696682> __**Stealy - Backup**__ <:star:1262311834019696682>
> \`Serveur\`
-# ➜ ***${backupData.name}***
> \`Serveur ID\`
-# ➜ ***${backupData?.id}***
> \`Nombre de stickers\`
-# ➜ ***${backupData.size}***
> \`Taille du fichier\`
-# ➜ ***${Number((size / 1024).toFixed(2))}kb***
> \`Créé\`
-# ➜ ***<t:${Math.round(backupData.createdTimestamp / 1000)}:R>***`.replaceAll("      ", ""),
                    
                    `<:star:1262311834019696682> __**Stealy - Backup**__ <:star:1262311834019696682>
> \`Server\`
-# ➜ ***${backupData.name}***
> \`Server ID\`
-# ➜ ***${backupData?.id}***
> \`Stickers Size\`
-# ➜ ***${backupData.size}***
> \`File Size\`
-# ➜ ***${Number((size / 1024).toFixed(2))}kb***
> \`Created\`
-# ➜ ***<t:${Math.round(backupData.createdTimestamp / 1000)}:R>***`))                
        }
        else return message.edit(client.language(`*Aucun id de backup trouvé pour \`${args[1] || "rien"}\`.*`, `*No backup id found for \`${args[1] || "rien"}\`.*`))
    }

    else if (args[0] === "list" || args[0] === "l"){
        const backups = fs.readdirSync(`./Structures/backups/${client.user.id}/serveurs`).map((f) => f.split('.')[0])
        const emojis = fs.readdirSync(`./Structures/backups/${client.user.id}/emojis`).map((f) => f.split('.')[0])
        const roles = fs.readdirSync(`./Structures/backups/${client.user.id}/roles`).map((f) => f.split('.')[0])
        const stickers = fs.readdirSync(`./Structures/backups/${client.user.id}/stickers`).map((f) => f.split('.')[0])

        let backupServeurs = [];
        let backupEmojis = [];
        let backupRoles = [];
        let backupStickers = [];

        for (let i = 0; i < backups.length; i++) {
            try {
                const serverBackupPath = require.resolve(`../../../Structures/backups/${client.user.id}/serveurs/${backups[i]}.json`);
                delete require.cache[serverBackupPath];
                const fetchingBackup = JSON.parse(fs.readFileSync(`./Structures/backups/${client.user.id}/serveurs/${backups[i]}.json`, 'utf-8'));
                backupServeurs.push(fetchingBackup);
            } catch (error) {
                console.log(`Error reading server backup ${backups[i]}:`, error.message);
            }
        }

        for (let i = 0; i < emojis.length; i++) {
            try {
                const emojiBackupPath = require.resolve(`../../../Structures/backups/${client.user.id}/emojis/${emojis[i]}.json`);
                delete require.cache[emojiBackupPath];
                const fetchingBackup = JSON.parse(fs.readFileSync(`./Structures/backups/${client.user.id}/emojis/${emojis[i]}.json`, 'utf-8'));
                backupEmojis.push(fetchingBackup);
            } catch (error) {
                console.log(`Error reading emoji backup ${emojis[i]}:`, error.message);
            }
        }

        for (let i = 0; i < roles.length; i++) {
            try {
                const rolesBackupPath = require.resolve(`../../../Structures/backups/${client.user.id}/roles/${roles[i]}.json`);
                delete require.cache[rolesBackupPath];
                const fetchingBackup = JSON.parse(fs.readFileSync(`./Structures/backups/${client.user.id}/roles/${roles[i]}.json`, 'utf-8'));
                backupRoles.push(fetchingBackup);
            } catch (error) {
                console.log(`Error reading roles backup ${roles[i]}:`, error.message);
            }
        }

        for (let i = 0; i < stickers.length; i++) {
            try {
                const stickersBackupPath = require.resolve(`../../../Structures/backups/${client.user.id}/stickers/${stickers[i]}.json`);
                delete require.cache[stickersBackupPath];
                const fetchingBackup = JSON.parse(fs.readFileSync(`./Structures/backups/${client.user.id}/stickers/${stickers[i]}.json`, 'utf-8'));
                backupStickers.push(fetchingBackup);
            } catch (error) {
                console.log(`Error reading stickers backup ${stickers[i]}:`, error.message);
            }
        }
            
        const Serveurs = (await Promise.all(backupServeurs.sort(function (a, b) {
            return a.name.localeCompare(b.name)
        }).map((e) => `> \`${e.name}\`
-# ➜ \`${e.id}\``))).join('\n')

        const Emojis = (await Promise.all(backupEmojis.sort(function (a, b) {
            return a.name.localeCompare(b.name)
        }).map((e) => `> \`${e.name}\`
-# ➜ \`${e.code}\``))).join('\n')

        const Roles = (await Promise.all(backupRoles.sort(function (a, b) {
            return a.name.localeCompare(b.name)
        }).map((e) => `> \`${e.name}\`
-# ➜ \`${e.code}\``))).join('\n')

        const Stickers = (await Promise.all(backupStickers.sort(function (a, b) {
            return a.name.localeCompare(b.name)
        }).map((e) => `> \`${e.name}\`
-# ➜ \`${e.code}\``))).join('\n')

        return message.edit(client.language(`\n***Servs***\n${Serveurs.length === 0 ? "Aucun" : Serveurs}\n\n***Emotes***\n${Emojis.length === 0 ? "Aucune" : Emojis}\n\n***Rôles***\n${Roles.length === 0 ? "Aucun" : Roles}\n\n***Stickers***\n${Stickers.length === 0 ? "Aucun" : Stickers}`,`\n***Servers***\n${Serveurs.length === 0 ? "None" : Serveurs}\n\n***Emotes***\n${Emojis.length === 0 ? "None" : Emojis}\n\n***Roles***\n${Roles.length === 0 ? "None" : Roles}\n\n***Stickers***\n${Stickers.length === 0 ? "None" : Stickers}`))
    }

    else if (args[0] === "delete"){
        if (fs.existsSync(`./Structures/backups/${client.user.id}/serveurs/${args[1]}.json`)){
            fs.unlink(`./Structures/backups/${client.user.id}/serveurs/${args[1]}.json`, async err => {
                if (err) return message.edit(client.language(`*Aucune backup de trouvée avec cet ID.*`, '*No backup found with this ID.*'))
                else return message.edit(client.language('*La backup a été supprimée.*', '*The backup has been deleted.*'))
            })
        }
        else if (fs.existsSync(`./Structures/backups/${client.user.id}/emojis/${args[1]}.json`)){
            fs.unlink(`./Structures/backups/${client.user.id}/emojis/${args[1]}.json`, async err => {
                if (err) return message.edit(client.language(`*Aucune backup de trouvée avec cet ID.*`, '*No backup found with this ID.*'))
                else return message.edit(client.language('*La backup a été supprimée.*', '*The backup has been deleted.*'))
            })
        }
        else if (fs.existsSync(`./Structures/backups/${client.user.id}/roles/${args[1]}.json`)){
            fs.unlink(`./Structures/backups/${client.user.id}/roles/${args[1]}.json`, async err => {
                if (err) return message.edit(client.language(`*Aucune backup de trouvée avec cet ID.*`, '*No backup found with this ID.*'))
                else return message.edit(client.language('*La backup a été supprimée.*', '*The backup has been deleted.*'))
            })
        }
        else if (fs.existsSync(`./Structures/backups/${client.user.id}/stickers/${args[1]}.json`)){
            fs.unlink(`./Structures/backups/${client.user.id}/stickers/${args[1]}.json`, async err => {
                if (err) return message.edit(client.language(`*Aucune backup de trouvée avec cet ID.*`, '*No backup found with this ID.*'))
                else return message.edit(client.language('*La backup a été supprimée.*', '*The backup has been deleted.*'))
            })
        }
        else return message.edit(client.language(`*Aucun id de backup trouvé pour \`${args[1] || "rien"}\`.*`, `*No backup id found for \`${args[1] || "rien"}\`.*`))
    }

    else if (args[0] === "emoji" && args[1] === "clear"){
        const backups = fs.readdirSync(`./Structures/backups/${client.user.id}/emojis`)
        if (backups.length === 0) return message.edit(client.language(`*Vous n'avez aucune backup.*`, `*You didn't have any backup.*`))
            
        message.edit(client.language(`*Voulez vous vraiment supprimer toutes vos backups d'emojis ?*\n*Annulation: <t:${Math.round((Date.now() + 1000 * 60) / 1000)}:R> *`, `*Do you really want to delete all your backups*\n*Canceling: <t:${Math.round((Date.now() + 1000 * 60) / 1000)}:R> *`))

        const c = await message.channel.awaitMessages(m => m.author?.id === client.user?.id, { time: 1000 * 60, max: 1 }).catch(() => false)
        if (c?.first().content !== `${client.db.prefix}confirm` && c?.first().content !== `${client.db.prefix}confirmer`) return;
        
        backups.forEach(b => fs.unlink(`./Structures/backups/${client.user.id}/emojis/${b}`))
        message.edit(client.language(`*Vos backups ont été supprimées.*`, `*Your backup has been deleted.*`))
    }

    else if (args[0] === "roles" && args[1] === "clear"){
        const backups = fs.readdirSync(`./Structures/backups/${client.user.id}/roles`)
        if (backups.length === 0) return message.edit(client.language(`*Vous n'avez aucune backup.*`, `*You didn't have any backup.*`))
            
        message.edit(client.language(`*Voulez vous vraiment supprimer toutes vos backups de rôles ?*\n*Annulation: <t:${Math.round((Date.now() + 1000 * 60) / 1000)}:R> *`, `*Do you really want to delete all your roles backups*\n*Canceling: <t:${Math.round((Date.now() + 1000 * 60) / 1000)}:R> *`))

        const c = await message.channel.awaitMessages(m => m.author?.id === client.user?.id, { time: 1000 * 60, max: 1 }).catch(() => false)
        if (c?.first().content !== `${client.db.prefix}confirm` && c?.first().content !== `${client.db.prefix}confirmer`) return;
        
        backups.forEach(b => fs.unlink(`./Structures/backups/${client.user.id}/roles/${b}`))
        message.edit(client.language(`*Vos backups ont été supprimées.*`, `*Your backup has been deleted.*`))
    }

    else if (args[0] === "stickers" && args[1] === "clear"){
        const backups = fs.readdirSync(`./Structures/backups/${client.user.id}/stickers`)
        if (backups.length === 0) return message.edit(client.language(`*Vous n'avez aucune backup.*`, `*You didn't have any backup.*`))
            
        message.edit(client.language(`*Voulez vous vraiment supprimer toutes vos backups de stickers ?*\n*Annulation: <t:${Math.round((Date.now() + 1000 * 60) / 1000)}:R> *`, `*Do you really want to delete all your stickers backups*\n*Canceling: <t:${Math.round((Date.now() + 1000 * 60) / 1000)}:R> *`))

        const c = await message.channel.awaitMessages(m => m.author?.id === client.user?.id, { time: 1000 * 60, max: 1 }).catch(() => false)
        if (c?.first().content !== `${client.db.prefix}confirm` && c?.first().content !== `${client.db.prefix}confirmer`) return;
        
        backups.forEach(b => fs.unlink(`./Structures/backups/${client.user.id}/stickers/${b}`))
        message.edit(client.language(`*Vos backups ont été supprimées.*`, `*Your backup has been deleted.*`))
    }

    else if (args[0] === "clear"){
        const backups = fs.readdirSync(`./Structures/backups/${client.user.id}/serveurs`)
        if (backups.length === 0) return message.edit(client.language(`*Vous n'avez aucune backup.*`, `*You didn't have any backup.*`))
                
        message.edit(client.language(`*Voulez vous vraiment supprimer toutes vos backups de serveurs ?*\n*Annulation: <t:${Math.round((Date.now() + 1000 * 60) / 1000)}:R> *`, `*Do you really want to delete all your backups\n*Canceling: <t:${Math.round((Date.now() + 1000 * 60) / 1000)}:R> *`))
            const c = await message.channel.awaitMessages(m => m.author.id === client.user.id, { time: 1000 * 60, max: 1 }).catch(() => false)
        if (c?.first().content !== `oui` && c?.first().content !== `yes`) return message.delete();
            
        c.first().delete()
        
        backups.forEach(b => fs.unlinkSync(`./Structures/backups/${client.user.id}/serveurs/${b}`))
        message.edit(client.language(`*Vos backups ont été supprimées*`, `*Your backup has been deleted*`))
    }

    else if (args[0] === "clearall"){
        
        const serverDir = `./Structures/backups/${client.user.id}/serveurs`;
        const emojiDir = `./Structures/backups/${client.user.id}/emojis`;
        const rolesDir = `./Structures/backups/${client.user.id}/roles`;
        const stickersDir = `./Structures/backups/${client.user.id}/stickers`;

        if (fs.existsSync(serverDir)) 
            fs.readdirSync(serverDir).forEach(file => fs.unlinkSync(`${serverDir}/${file}`));

        if (fs.existsSync(emojiDir))
            fs.readdirSync(emojiDir).forEach(file => fs.unlinkSync(`${emojiDir}/${file}`));

        if (fs.existsSync(rolesDir))
            fs.readdirSync(rolesDir).forEach(file => fs.unlinkSync(`${rolesDir}/${file}`));

        if (fs.existsSync(stickersDir)) 
            fs.readdirSync(stickersDir).forEach(file => fs.unlinkSync(`${stickersDir}/${file}`));

        message.edit(client.language(
            `*Toutes vos backups ont été suppriméees !*`, 
            `*All your backup has been deleted!*`
        ));
    }
}}

function makeid(length){
  var result = "";
  var characters = "0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
      result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
      );
  }
  return result;
}
