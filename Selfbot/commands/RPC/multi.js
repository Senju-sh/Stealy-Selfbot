const ms = require('ms');
const { RichPresence, Util } = require("legend.js");
const custom_types = [ "love", "think", "question", "excited", "recommend", "leave" ];
const types = ["playing", "listening", "watching", "competing", "streaming"]
const platformes = ["ps5", "ps4", "xbox", "desktop", "samsung", "ios"]

module.exports = {
    name: "multi",
    premium: true,
    run: async (client, message, args) => {

        if (!args[0]) return message.edit(client.language(`***___› Stealy - Multi___***  <a:star:1345073135095123978>

\`${client.db.prefix}multi args\` › *Affiche les arguments du multi*  

\`${client.db.prefix}multi start\` › *Permet de lancer le multi*  
\`${client.db.prefix}multi stop\` › *Permet d'arrêter le multi*  

\`${client.db.prefix}multi rpc add\` › *Permet de créer une RPC*  
\`${client.db.prefix}multi rpc edit <ID> <field> <value>\` › *Permet d'éditer une RPC précise*  
\`${client.db.prefix}multi rpc remove <ID>\` › *Retire un RPC précis*  
\`${client.db.prefix}multi rpc list\` › *Affiche la liste des RPC*  
\`${client.db.prefix}multi rpc <ID> <on/off>\` › *Permet de gérer un RPC*  

\`${client.db.prefix}multi status add <emoji> <text>\` › *Permet d’ajouter un status*  
\`${client.db.prefix}multi status edit <ID> <field> <value>\` › *Permet d'éditer un status précis*  
\`${client.db.prefix}multi status remove <ID>\` › *Retire un status précis*  
\`${client.db.prefix}multi status list\` › *Affiche la liste des statuses*  

\`${client.db.prefix}multi presence add\` › *Ajoute une presence*  
\`${client.db.prefix}multi presence edit <ID> <type>\` › *Modifie la presence du status*
\`${client.db.prefix}multi remove <ID>\` › *Supprime unee presence*
\`${client.db.prefix}multi presence list\` › *Affiche les presences du status*

\`${client.db.prefix}multi interval <seconds>\` › *Change l'intervalle du changement d'activité*  

\`${client.db.prefix}multi clear\` › *Permet de supprimer tout votre multi*`,
`***___› Stealy - Multi___***  <a:star:1345073135095123978>

\`${client.db.prefix}multi args\` › *Displays the arguments of the multi*  

\`${client.db.prefix}multi start\` › *Start the multi*  
\`${client.db.prefix}multi stop\` › *Stop the multi*  

\`${client.db.prefix}multi rpc add\` › *Create a RPC*  
\`${client.db.prefix}multi rpc edit <ID> <field> <value>\` › *Edit a RPC*  
\`${client.db.prefix}multi rpc remove <ID>\` › *Remove a RPC*  
\`${client.db.prefix}multi rpc list\` › *Displays the list of RPC*  
\`${client.db.prefix}multi rpc <ID> <on/off>\` › *Manage a RPC*  

\`${client.db.prefix}multi status add <emoji> <text>\` › *Add a status*  
\`${client.db.prefix}multi status edit <ID> <field> <value>\` › *Edit a status*
\`${client.db.prefix}multi status remove <ID>\` › *Remove a status*  
\`${client.db.prefix}multi status list\` › *Displays the list of statuses*  

\`${client.db.prefix}multi presence add\` › *Add a presence*  
\`${client.db.prefix}multi presence edit <ID> <type>\` › *Edits the presence of the status*
\`${client.db.prefix}multi remove <ID>\` › *Remove a presence*
\`${client.db.prefix}multi presence list\` › *Displays thee list of presences*

\`${client.db.prefix}multi interval <seconds>\` › *Change the interval of activity change*  

\`${client.db.prefix}multi clear\` › *Delete all your multi*`));

        switch (args[0]) {
            case "args":
                message.edit(client.language(`***___› Stealy - Multi Arguments___***  <a:star:1345073135095123978>

\`{servers}\` › *Nombre de serveurs.*

\`{users}\` › *Nombre d'utilisateurs.*

\`{friends}\` › *Nombre d'amis.*

\`{date}\` › *Date & heure actuelle.*

\`{time}\` › *L'heure actuelle.*

\`{messages}\` › *Nombre de messages.*

\`{messagesdeleted}\` › *Nombre de messages supprimés.*

\`{blocked}\` › *Nombre de bloqués.*

\`{ram}\` › *Utilisation ram actuelle.*

\`{ping}\` › *Latence actuelle.*

\`{totalsniped}\` › *Nombre d'url snipe.*

\`{randomquotes}\` › *Citations aléatoires.*

\`{psyquotes}\` › *Citations sur la psycologie.*

\`{islamquotes}\` › *Citations sur l'islam.*

\`{manipulationquotes}\` › *Citations sur la manipulation.*

\`{christquotes}\` › *Citations sur le christianisme.*

\`{warquotes}\` › *Citations sur la guerre.*

\`{enemyquotes}\` › *Citations sur les ennemis.*

\`{lifequotes}\` › *Citations sur la vie.*

\`{moneyquotes}\` › *Citations sur l'argent.*

\`{deathquotes}\` › *Citations sur la mort.*

\`{businessquotes}\` › *Citations sur le business.*

\`{artquotes}\` › *Citations sur l'art.*

\`{fearquotes}\` › *Citations sur la peur.*

\`{knowledgequotes}\` › *Citations sur la connaissance.*

\`{sexquotes}\` › *Citations sur le sexe.*

\`{treasonquotes}\` › *Citations sur la trahison.*`,
`***___› Stealy - Multi Arguments___***  <a:star:1345073135095123978>

\`{servers}\` › *Number of servers.*  

\`{users}\` › *Number of users.*  

\`{friends}\` › *Number of friends.*  

\`{date}\` › *Current date & time.*  

\`{time}\` › *Current time.*  

\`{messages}\` › *Number of messages.*  

\`{messagesdeleted}\` › *Number of deleted messages.*  

\`{blocked}\` › *Number of blocked users.*  

\`{ram}\` › *Current RAM usage.*

\`{ping}\` › *Current latency.*

\`{totalsniped}\` › *Number of sniped URLs.*  

\`{randomquotes}\` › *Random quotes.*  

\`{psyquotes}\` › *Quotes about psychology.*  

\`{islamquotes}\` › *Quotes about Islam.*  

\`{manipulationquotes}\` › *Quotes about manipulation.*  

\`{christquotes}\` › *Quotes about Christianity.*  

\`{warquotes}\` › *Quotes about war.*  

\`{enemyquotes}\` › *Quotes about enemies.*  

\`{lifequotes}\` › *Quotes about life.*  

\`{moneyquotes}\` › *Quotes about money.*  

\`{deathquotes}\` › *Quotes about death.*  

\`{businessquotes}\` › *Quotes about business.*  

\`{artquotes}\` › *Quotes about art.* 

\`{fearquotes}\` › *Quotes about fear.*  

\`{knowledgequotes}\` › *Quotes about knowledge.*  

\`{sexquotes}\` › *Quotes about sex.*

\`{treasonquotes}\` › *Quotes about treason*`,))
                break

            case "start":
                if (client.db.multi.status) return message.edit(client.language(`*Le multi est déjà activé*`, `*The multi is already activated*`))
                message.edit(client.language(`*Le multi a été activé*`, `*The multi has been activated*`))
                client.db.multi.status = true
                client.save();
                client.multiRPC();
                break

            case "stop":
                if (!client.db.multi.status) return message.edit(client.language(`*Le multi n'est pas activé*`, `*The multi is not activated*`))
                message.edit(client.language(`*Le multi a été désactivé*`, `*The multi has been disabled*`))
                client.db.multi.status = false
                client.save();
                client.multiRPC();
                break

            case "interval":
                if (args[1] && isNaN(parseInt(args[1])) || args[1] && parseInt(args[1]) < 15) return message.edit(client.language(`*Veuillez entrer un temps en seconde supperieur à 12*`, `Please enter a time in seconds higher than 12`))

                client.db.multi.interval = parseInt(args[1]) ?? 15
                client.save()

                await message.edit(client.language(`*Le temps est maintenant de \`${args[1] || "12"}\` secondes*`, `The time is now \`${args[1] || "12"}\` seconds`))
                break

            case "clear":
                client.db.multi.rpc = []
                client.db.multi.type = []
                client.db.multi.presence = []
                client.save()
                await message.edit(client.language(`*Le multi a été supprimé*`, `The multi has been deleted`))
                break

            case 'presence':
                switch(args[1]){
                    case "add":
                        client.db.multi.type.push({ status: client.db.status });
                        client.save()
                        await message.edit(client.language(`*La présence ${client.db.multi.type.length - 1} a été crée vous pouvez commencer à le modifier*`, `The presencee has been created with the ID ${client.db.multi.type.length - 1} you can now edit it`));
                        break

                    case "remove":
                        if (!client.db.multi.type[args[2]]) return message.edit(client.language(`*Aucun ID de presence existant pour ${args[2]}*`, `No presence found with the ID ${args[2]}`))

                        client.db.multi.type = client.db.multi.type.filter(o => o !== client.db.multi.type[args[2]])
                        client.save()

                        await message.edit(client.language(`*Le presence a été supprimé. ID: ${args[2]}*`, `Le presence a été supprimé. ID: ${args[2]}`))
                        break

                    case "list":
                        if (!client.db.multi.type.length) 
                            return message.edit(client.language(`*Aucun presence n'est enregistré*`, `No presence saved in the multi`))

                        client.send(message, 
                            client.db.multi.type.map(
                                (r, i) => `> ***ID: \`${i}\`***\n> *Status :* \`${r.status ?? client.db.status}\`\n`
                                .replaceAll('  ', '')).join('\n'))
                        break

                    case "edit":
                        if (!client.db.multi.type[args[2]]) 
                            return message.edit(client.language(`*Aucun ID de presence existant pour ${args[2]}*`, `No presence found with the ID ${args[2]}`))
                        
                        if (!args[3] || !['online', 'idle', 'dnd'].includes(args[3]))
                            return message.edit(client.language(`*Veuillez choisir un status entre \`online\`, \`idle\` et \`dnd\`*`, `Please choose a status between \`online\`, \`idle\` and \`dnd\``))

                        client.db.multi.type[args[2]].status = args[3].toLowerCase();
                        client.save();

                        message.edit(client.language(`*Le status de la présence a été modifié en \`${args[3]}\`*`, `The status of the presence has been changed to \`${args[3]}\``));
                        break;
                }
                break;

            case "rpc":
                switch (args[1]) {
                    case "add":
                        client.db.multi.rpc.push({ status: true, name: client.db.rpc.name, type: client.db.rpc.type, application_id: "1317907021085020251", url: client.db.twitch })
                        client.save()
                        await message.edit(client.language(`*Le RPC a été crée avec l'ID ${client.db.multi.rpc.length - 1} vous pouvez commencer à le modifier*`, `The RPC has been created with the ID ${client.db.multi.rpc.length - 1} you can now edit it`))
                        break

                    case "remove":
                        if (!client.db.multi.rpc[args[2]]) return message.edit(client.language(`*Aucun ID de RPC existant pour ${args[2]}*`, `No RPC found with the ID ${args[2]}`))

                        client.db.multi.rpc = client.db.multi.rpc.filter(o => o !== client.db.multi.rpc[args[2]])
                        client.save()

                        await message.edit(client.language(`*Le RPC a été supprimé. ID: ${args[2]}*`, `Le RPC a été supprimé. ID: ${args[2]}`))
                        break

                    case "list":
                        if (!client.db.multi.rpc.length) 
                            return message.edit(client.language(`*Aucun RPC n'est enregistré*`, `No RPC saved in the multi`))

                        client.send(message, 
                            client.db.multi.rpc.map((r, i) => client.language(`> ***ID: \`${i}\`***
                                > *Activé :* \`${r.status ? "Oui" : "Non"}\`
                                > *Nom :* \`${r.name}\`
                                > *Type :* \`${r.type}\`
                                > *State :* \`${r.state || "x"}\`
                                > *Détails :* \`${r.details || "x"}\`
                                > *App ID :* \`${r.application_id || "x"}\`
                                > *Petite Image :* \`${r.assets?.small_image || "x"}\`
                                > *Texte Petite Image :* \`${r.assets?.small_text || "x"}\`
                                > *Grande Image :* \`${r.assets?.large_image || "x"}\`
                                > *Texte Grande Image :* \`${r.assets?.large_text || "x"}\`\n`.replaceAll('  ', ''),
                                   
                                
                                `***ID: \`${i}\`***
                                
                                > *Enabled :* \`${r.status ? "Yes" : "No"}\`
                                > *Name :* \`${r.name}\`
                                > *Type :* \`${r.type}\`
                                > *State :* \`${r.state || "x"}\`
                                > *Détails :* \`${r.details || "x"}\`
                                > *App ID :* \`${r.application_id || "x"}\
                                > *Small Image :* \`${r.assets?.small_image || "x"}\`
                                > *Text Small Image :* \`${r.assets?.small_text || "x"}\`
                                > *Large Image :* \`${r.assets?.large_image || "x"}\`
                                > *Texte Large Image :* \`${r.assets?.large_text || "x"}\`\n`.replaceAll('  ', ''))
                            ).join('\n'))
                        break

                    case "edit":
                        if (!client.db.multi.rpc[args[2]]) return message.edit(client.language(`*Aucun ID de RPC existant pour ${args[2]}*`, `No RPC found with the ID ${args[2]}`))

                        switch (args[3]) {
                            case "off":
                                message.edit(client.language(`*Le RPC a été désactivé*`, `*The RPC has been disabled*`))
                                client.db.multi.rpc[args[2]].status = false;
                                client.save()
                                break

                            case "on":
                                message.edit(client.language(`*Le RPC a été activé*`, `*The RPC has been enabled*`))
                                client.db.multi.rpc[args[2]].status = true
                                client.save()
                                break

                            case "name":
                                client.db.multi.rpc[args[2]].name = args[4] ? args.slice(4).join(' ') : "ㅤ"
                                client.save()
                                message.edit(client.language(`*Le nom a été modifié*`, `*The name has beed edited*`))
                                break

                            case "spotify":
                                if (args[4] === "on"){
                                    if (client.db.multi.rpc[args[2]].spotify) return message.edit(client.language('*Le multi spotify est déjà activé sur ce RPC.*', '*The multi spotify is already enable on this RPC.*'))

                                    client.db.multi.rpc[args[2]].spotify = true

                                    client.db.multi.rpc[args[2]].id = 'spotify:1'
                                    client.db.multi.rpc[args[2]].party = { id: `spotify:${client.user.id}` }
                                    client.db.multi.rpc[args[2]].type = 2
                                    client.db.multi.rpc[args[2]].flags = 48
                                    client.db.multi.rpc[args[2]].name = 'Spotify'
                                    client.db.multi.rpc[args[2]].syncId = "1J03Vp93ybKIxfzYI4YJtL"
                                    client.db.multi.rpc[args[2]].timestamps = { start: Date.now(), end: Date.now() }
                                    client.db.multi.rpc[args[2]].metadata = { context_uri: null, artist_ids: [] };
                                    client.db.multi.rpc[args[2]].metadata.album_id = '2M2Ae2SvZe3fmzUtlVOV5Z'

                                    client.save()
                                    message.edit(client.language("Votre RPC sera un RPC Spotify", "Your RPC will be a spotify RPC"))
                                }
                                else {
                                    if (!client.db.multi.rpc[args[2]].spotify) return message.edit(client.language('*Le multi spotify est déjà désactivé sur ce RPC.*', '*The multi spotify is already disable on this RPC.*'))

                                    delete client.db.multi.rpc[args[2]].spotify
                                    delete client.db.multi.rpc[args[2]].id
                                    delete client.db.multi.rpc[args[2]].party
                                    client.db.multi.rpc[args[2]].type = 0
                                    client.db.multi.rpc[args[2]].name = "ㅤ"
                                    delete client.db.multi.rpc[args[2]].flags
                                    delete client.db.multi.rpc[args[2]].syncId
                                    delete client.db.multi.rpc[args[2]].timestamps
                                    delete client.db.multi.rpc[args[2]].metadata

                                    client.save()
                                    message.edit(client.language("Votre RPC sera un RPC  par défaut", "Your RPC will be a default RPC"))
                                }
                                break;

                            case 'timestamp':
                                if (!args[4]){
                                    client.db.multi.rpc[args[2]].spotifyminutes = null;
                                    client.db.multi.rpc[args[2]].spotifyseconde = null;
                                    
                                    client.save();
                                    client.rpc();
                
                                    return message.edit(client.language('*Le temps de votre RPC a été supprimé.*', '*The timestamp of your RPC has been deleted.*'));
                                }
                                
                                if (!args[4].includes(':') || 
                                    isNaN(args[4].split(':')[0]) || 
                                    isNaN(args[4].split(':')[1]) ||
                                    args[4].split(':')[0].length !== 2 ||
                                    args[4].split(':')[1].length !== 2) 
                                    return message.edit(client.language('*Veuillez respecter ce format: \`13:37\`.*', '*Please respect this format: \`13:37\`.*'));
                                
                                client.db.multi.rpc[args[2]].spotifyminutes = args[4].split(':')[0];
                                client.db.multi.rpc[args[2]].spotifyseconde = args[4].split(':')[1];
                
                                client.save();
                                message.edit(client.language("*Le temps a été modifié.*", "*The timestamp has been edited.*"))
                                break;                

                            case "party":
                                if (!args[4]) {
                                    delete client.db.multi.rpc[args[2]].party
                                    client.save();
                                    message.edit(client.language("La party du RPC a été supprimée", "The party of the RPC has been deleted"));

                                }
                                else {
                                    if (!args[4].includes("/")) return message.edit(client.language(`Veuillez utiliser la commande de cette manière: \`${client.db.prefix}rpc party 3/5\``, `Please use the command this way: \`${client.db.prefix}rpc party 3/5\``));
                                    if (isNaN(parseInt(args[4].split("/")[0]))) return message.edit("Veuillez mettre un chiffre avant le /");
                                    if (isNaN(parseInt(args[4].split("/")[1]))) return message.edit("Veuillez mettre un chiffre après le /");
                                    client.db.multi.rpc[args[2]].party = { size: [parseInt(args[4].split("/")[0]), parseInt(args[4].split("/")[1])] }
                                    client.save();
                                    message.edit(client.language("La party du RPC a été modifiée", "The party of the RPC has been edited"));
                                }
                                break

                            case "platform":
                                if (!args[4] || !platformes.includes(args[4])) return message.edit(client.language(`Veuillez choisir une platforme entre ${platformes.map(r => `\`${r}\``.join(', '))}`, `Please choose a platform between ${platformes.map(r => `\`${r}\``.join(', '))}`))
                                else {
                                    client.db.multi.rpc[args[2]].platform = args[4]
                                    client.save()
                                    message.edit(client.language(`La plateforme du RPC a été modifiée vous êtes maintenant sur \`${args[4]}\``, `The platform of the RPC has been edited and you are now on \`${args[4]}\``));
                                }
                                break

                            case 'details':
                                if (!args[4]) {
                                    delete client.db.multi.rpc[args[2]].details;
                                    client.save();
                                    message.edit(client.language("Les détails du RPC ont été supprimés", "The details of the RPC have been deleted"));
                                }
                                else {
                                    client.db.multi.rpc[args[2]].details = args.slice(4).join(' ');
                                    client.save();
                                    message.edit(client.language("Les détails du RPC ont été modifiés", "The details of the RPC have been edited"));
                                }
                                break

                            case "state":
                                if (!args[4]) {
                                    delete client.db.multi.rpc[args[2]].state
                                    client.save();
                                    message.edit(client.language("Le statut du RPC a été supprimé", "The state of the RPC has been deleted"));
                                }
                                else {
                                    client.db.multi.rpc[args[2]].state = args.slice(4).join(' ')
                                    client.save();
                                    message.edit(client.language("Le statut du RPC a été modifié", "The state of the RPC has been edited"));
                                }
                                break

                            case "type":
                                if (!args[4] || !types.includes(args[4])) return message.edit(client.language("Veuillez choisir un type entre `playing`, `watching`, `listening`, `competing` et `streaming`", "Please choose a type between `playing`, `watching`, `listening`, `competing` et `streaming`"))

                                client.db.multi.rpc[args[2]].type = args[4].toUpperCase()
                                client.save()
                                message.edit(client.language("Le type de RPC a été modifié", "The type of the RPC has been edited"))
                                break

                            case "largeimage":
                                if (!args[4]) {
                                    if (client.db.multi.rpc[args[2]].assets?.['large_image']) delete client.db.multi.rpc[args[2]].assets['large_image'];
                                    if (client.db.multi.rpc[args[2]].assets?.['large_text']) delete client.db.multi.rpc[args[2]].assets['large_text'];
                                    if (Object.keys(client.db.multi.rpc[args[2]].assets || {}).length == 0) delete client.db.multi.rpc[args[2]].assets;

                                    client.save();
                                    message.edit(client.language("La grande image du RPC a été supprimée", "The large image of the RPC has been deleted"));
                                }
                                else {
                                    const imageURL = args[4].replace("http://", "https://");
                                    const getExtendURL = await RichPresence.getExternal(client, client.db.rpc.application_id ?? "1352297034669101117", imageURL);

                                    if (Array.isArray(getExtendURL) && getExtendURL.length > 0 && getExtendURL[0].external_asset_path) {
                                        if (!client.db.multi.rpc[args[2]].assets) client.db.multi.rpc[args[2]].assets = {};
                                        client.db.multi.rpc[args[2]].assets.large_image = `mp:${getExtendURL[0].external_asset_path}`;
                                        args[5] ? client.db.multi.rpc[args[2]].assets["large_text"] = args.slice(5).join(' ') : delete client.db.multi.rpc[args[2]].assets.large_text;

                                        client.save();
                                        message.edit(client.language("La grande image du RPC a été modifiée", "The large image of the RPC has been edited"));

                                    } else message.edit(client.language("Erreur lors de l'obtention de l'URL étendue", "Error obtaining the extended URL"));
                                }
                                break

                            case "smallimage":
                                if (!args[4]) {
                                    if (client.db.multi.rpc[args[2]].assets?.['small_image']) delete client.db.multi.rpc[args[2]].assets['small_image'];
                                    if (client.db.multi.rpc[args[2]].assets?.['small_text']) delete client.db.multi.rpc[args[2]].assets['small_text'];
                                    if (Object.keys(client.db.multi.rpc[args[2]].assets || {}).length == 0) delete client.db.multi.rpc[args[2]].assets;
                                    client.save();
                                    message.edit(client.language("La petite image du RPC a été supprimée", "The small image of the RPC has been deleted"));
                                }

                                else {
                                    const imageURL = args[4].replace("http://", "https://");
                                    const getExtendURL = await RichPresence.getExternal(client, client.db.rpc.application_id ?? "1352297034669101117", imageURL);

                                    if (Array.isArray(getExtendURL) && getExtendURL.length > 0 && getExtendURL[0].external_asset_path) {
                                        if (!client.db.multi.rpc[args[2]].assets) client.db.multi.rpc[args[2]].assets = {};
                                        client.db.multi.rpc[args[2]].assets["small_image"] = `mp:${getExtendURL[0].external_asset_path}`;
                                        args[5] ? client.db.multi.rpc[args[2]].assets["small_text"] = args.slice(5).join(' ') : delete client.db.multi.rpc[args[2]].assets.small_text;
                                        client.save();
                                        message.edit(client.language("La petite image du RPC a été modifiée", "The small image of the RPC has been edited"));

                                    } else message.edit(client.language("Erreur lors de l'obtention de l'URL étendue", "Error obtaining the extended URL"));
                                }
                                break

                            case "button":
                                if (!args[4]) {
                                    if (client.db.multi.rpc[args[2]].metadata?.['button_urls']) client.db.multi.rpc[args[2]].metadata.button_urls[0] = null;
                                    if (client.db.multi.rpc[args[2]].metadata && !client.db.multi.rpc[args[2]].metadata.button_urls.filter(a => typeof a == 'string').length) delete client.db.multi.rpc[args[2]].metadata;
                                    if (client.db.multi.rpc[args[2]].buttons && client.db.multi.rpc[args[2]].buttons.length == 1) client.db.multi.rpc[args[2]].buttons.splice(0, 1);
                                    if (client.db.multi.rpc[args[2]].buttons && client.db.multi.rpc[args[2]].buttons.length == 2) client.db.multi.rpc[args[2]].buttons[0] = null;
                                    if (client.db.multi.rpc[args[2]].buttons && !client.db.multi.rpc[args[2]].buttons.filter(a => typeof a == 'string').length) delete client.db.multi.rpc[args[2]].buttons;

                                    client.save();
                                    message.edit(client.language("Le bouton du RPC a été supprimé", "The button of the RPC has been deleted"));

                                }
                                else {
                                    if (!args[4].startsWith("http") || !args[5]) return message.edit(client.language("Veuillez entrer un lien et texte valide", "Enter a valid link and text"));

                                    if (!client.db.multi.rpc[args[2]].buttons) client.db.multi.rpc[args[2]].buttons = [args.slice(5).join(' ')];
                                    else client.db.multi.rpc[args[2]].buttons[0] = args.slice(5).join(' ');
                                    if (!client.db.multi.rpc[args[2]].metadata) client.db.multi.rpc[args[2]].metadata = {};
                                    if (!client.db.multi.rpc[args[2]].metadata['button_urls']) client.db.multi.rpc[args[2]].metadata['button_urls'] = [args[4]];
                                    else client.db.multi.rpc[args[2]].metadata['button_urls'][0] = args[4];

                                    client.save();
                                    await message.edit(client.language("Le bouton du RPC a été modifié", "The button of the RPC has been edited"));
                                }
                                break

                            case "button2":
                                if (!args[4]) {
                                    delete client.db.multi.rpc[args[2]].buttons[1]
                                    delete client.db.multi.rpc[args[2]].metadata[1]
                                    if (client.db.multi.rpc[args[2]].metadata?.['button_urls']) client.db.multi.rpc[args[2]].metadata.button_urls.splice(1, 1);
                                    if (client.db.multi.rpc[args[2]].metadata && !client.db.multi.rpc[args[2]].metadata.button_urls.filter(a => typeof a == 'string').length) delete client.db.multi.rpc[args[2]].metadata;
                                    if (client.db.multi.rpc[args[2]].buttons) client.db.multi.rpc[args[2]].buttons.splice(1, 1);
                                    if (client.db.multi.rpc[args[2]].buttons && !client.db.multi.rpc[args[2]].buttons.filter(a => typeof a == 'string').length) delete client.db.multi.rpc[args[2]].buttons;

                                    client.save();
                                    message.edit(client.language("Le bouton2 du RPC a été supprimé", "The button2 of the RPC has been deleted"));
                                }
                                else {
                                    if (!args[4].startsWith("http") || !args[5]) return message.edit(client.language("Veuillez entrer un lien et texte valide", "Enter a valid link and text"));
                                    
                                    
                                    if (!client.db.multi.rpc[args[2]].buttons) client.db.multi.rpc[args[2]].buttons = [null, args.slice(5).join(' ')];
                                    else client.db.multi.rpc[args[2]].buttons[1] = args.slice(5).join(' ');
                                    if (!client.db.multi.rpc[args[2]].metadata) client.db.multi.rpc[args[2]].metadata = {};
                                    if (!client.db.multi.rpc[args[2]].metadata['button_urls']) client.db.multi.rpc[args[2]].metadata['button_urls'] = [null, args[4]];
                                    else client.db.multi.rpc[args[2]].metadata['button_urls'][1] = args[4];
                                    
                                    
                                    client.save();
                                    await message.edit(client.language("Le bouton2 du RPC a été modifié", "The button2 of the RPC has been edited"));
                                }
                                break
                        }
                }
                break

            case "status":
                switch (args[1]) {
                    case "add":
                        await message.edit(client.language(`*Le status a été crée avec l'ID ${client.db.multi.presence.length} vous pouvez commencer à le modifier*`, `The status has been created with the ID ${client.db.multi.presence.length} you can now edit it`))
                        
                        if (!args[2]) {
                            client.db.multi.presence.push({ status: true });
                            client.save()
                        }
                        else if (/\p{Extended_Pictographic}/ug.test(emoji.name) || emoji.id) {
                            const emoji = Util.parseEmoji(args[2])

                            client.db.multi.presence.push({ status: true, details: client.db.custom.details ?? null, emoji: { animated: emoji.animated, name: emoji.name, id: emoji.id }, state: args.slice(3).join(' ') ?? null })
                            client.save()
                        }
                        else {
                            client.db.multi.presence.push({ status: true, details: client.db.custom.details ?? null, state: args.slice(2).join(' ') })
                            client.save()
                        }
                        break

                    case "edit":
                        if (!client.db.multi.presence[args[2]]) return message.edit(client.language(`*Aucun ID de status existant pour ${args[2]}*`, `No status found with the ID ${args[2]}`))

                        if (args[3] === "on") {
                            client.db.multi.presence[args[2]].status = true
                            client.save()
                            message.edit(client.language("Le status a été activé", "The status has been enabled"))
                        }
                        else if (args[3] === "off") {
                            client.db.multi.presence[args[2]].status = false
                            client.save()
                            message.edit(client.language("Le status a été désactivé", "The status has been disabled"))
                        }
                        if (args[3] === "emoji") {
                            if (!args[4]) {
                                delete client.db.multi.presence[args[2]].emoji
                                client.save()
                                message.edit(client.language("L'emoji a été supprimé du status", "The emoji of the state has been deleted"))
                            }
                            else {
                                const emoji = Util.parseEmoji(args[4])

                                client.db.multi.presence[args[2]].emoji = { animated: emoji.animated, name: emoji.name, id: emoji.id }
                                client.save()
                                message.edit(client.language("L'emoji a été modifié", "The emoji has been updated"))
                            }
                        }
                        else if (args[3] === "content") {
                            if (!args[4]) {
                                delete client.db.multi.presence[args[2]].state
                                client.save()
                                await message.edit(client.language("Le texte a été supprimé du status", "The text of the state has been deleted"))
                            }
                            else {
                                client.db.multi.presence[args[2]].state = args.slice(4).join(' ')
                                client.save()
                                message.edit(client.language("Le texte a été modifié", "The text of the state has been updated"))
                            }
                        }
                        else if (args[3] == 'type') {
                            if (!types.includes(args[4]))
                                return message.edit(client.language(
                                    `*Veuillez entrer l'un de ses types de status: ${types.map((t,i)=>`\`${t}\``).join(', ')}`, 
                                    `*Please enter one of these status types: ${types.map((t,i)=>`\`${t}\``).join(', ')}`
                                ));

                            client.db.multi.presence[args[2]].details = args[4] == "leave" ? null : args[4];

                            client.save();
                            client.multiRPC();

                            message.edit(client.language(
                                `*Le type de status a été changé en \`${args[4] == "leave" ? 'rien' : args[4]}\`.*`, 
                                `*The status type has been changed to \`${args[4] == "leave" ? 'nothing' : args[4]}\`.*`
                            ));   
                        }
                        break

                        case "list":
                            if (!client.db.multi.presence.length) 
                                return message.edit(client.language(`*Aucun status n'est enregistré*`, `No status saved in the multi`))
    
                            client.send(message, 
                                client.db.multi.presence.map((r, i) => client.language(`> ***ID: \`${i}\`***
                                    > *Activé :* \`${r.status ? "Oui" : "Non"}\`
                                    > *Texte :* \`${r.state || "Rien"}\`
                                    > *Type  :* \`${r.details || "Aucun"}\`
                                    > *Emoji :* ${r.emoji ? r.emoji.animated ? `<a:${r.emoji.name}:${r.emoji.id}>` : r.emoji.id ? `<:${r.emoji.name}:${r.emoji.id}>` : `:${r.emoji.name}:` : "`Rien`"}\n`.replaceAll('  ', ''), 
                                    
                                    `***ID: \`${i}\`***
                                    > *Enabled :* \`${r.status ? "Yes" : "No"}\`
                                    > *Text :* \`${r.state || "Nothing"}\`
                                    > *Type :* \`${r.details || "Nothing"}\`
                                    > *Emote :* ${r.emoji ? r.emoji.animated ? `<a:${r.emoji.name}:${r.emoji.id}>` : r.emoji.id ? `<:${r.emoji.name}:${r.emoji.id}>` : `:${r.emoji.name}:` : "`Nothing`"}\n`.replaceAll('  ', ''))).join('\n')
                            )
                            break


                    case "remove":
                        if (!client.db.multi.presence[args[2]]) return message.edit(client.language(`*Aucun ID de status existant pour ${args[2]}*`, `No status found with the ID ${args[2]}`))

                        client.db.multi.presence = client.db.multi.presence.filter(o => o !== client.db.multi.presence[args[2]])
                        client.save()

                        await message.edit(client.language(`*Le status a été supprimé. ID: ${args[2]}*`, `Le status a été supprimé. ID: ${args[2]}`))
                        if (client.db.multi.rpc.length === 0 && client.db.multi.presence.length === 0)
                        break

                }
                break
        }
    }
}

function estEmojiDiscord(emoji) {
    if (emoji?.startsWith('<') && emoji?.endsWith('>')) {
        if (emoji.includes(':')) {
            const isAnimated = emoji.includes('<a:');
            const parts = emoji.split(':');
            if (parts.length === 3) {
                const id = parseInt(parts[2]);
                if (!isNaN(id)) {
                    return true;
                }
            }
        } else {
            const length = emoji.length;
            if (length === 1 || length === 2) {
                return true;
            }
        }
    }
    return false;
}

function diviser(array) {
    let result = [];
    for (let i = 0; i < array.length; i += 3) {
        result.push(array.slice(i, i + 3));
    }
    return result;
}