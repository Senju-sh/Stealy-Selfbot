const { Client, Message } = require("legend.js");

module.exports = {
    name: "url",
    premium: true,
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string} args
    */
    run: async (client, message, args) => {


        if (!client.db.mfa_key) 
            return message.edit(client.language(
                `*Veuillez d'abord configurer votre mot de passe/clé A2F avec la commande \`${client.db.prefix}setmfa\`.*`, 
                `*Please configure first your password/mfa key with the command \`${client.db.prefix}setmfa\`.*`
            ));

        switch(args[0]){
            case "claim":
            if (!args[1]) 
                return message.edit(client.language(
                    `*Veuillez entrer une vanity valide.*`,
                    `*Please enter a valid vanity.*`
                ));

                const payload = `{"code":"${args[1]}"}`;
                const request =
                    `PATCH /api/v9/guilds/${message.guild.id}/vanity-url HTTP/1.1\r\n` +
                    `Host: canary.discord.com\r\n` +
                    `Accept: */*\r\n` +
                    `X-Super-Properties: eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiRmlyZWZveCIsImRldmljZSI6IiIsInN5c3RlbV9sb2NhbGUiOiJlbi1VUyIsImhhc19jbGllbnRfbW9kcyI6ZmFsc2UsImJyb3dzZXJfdXNlcl9hZ2VudCI6Ik1vemlsbGEvNS4wIChXaW5kb3dzIE5UIDEwLjA7IFdpbjY0OyB4NjQ7IHJ2OjEzMy4wKSBHZWNrby8yMDEwMDEwMSBGaXJlZm94LzEzMy4wIiwiYnJvd3Nlcl92ZXJzaW9uIjoiMTMzLjAiLCJvc192ZXJzaW9uIjoiMTAiLCJyZWZlcnJlciI6IiIsInJlZmVycmluZ19kb21haW4iOiIiLCJyZWZlcnJlcl9jdXJyZW50IjoiIiwicmVmZXJyaW5nX2RvbWFpbl9jdXJyZW50IjoiIiwicmVsZWFzZV9jaGFubmVsIjoic3RhYmxlIiwiY2xpZW50X2J1aWxkX251bWJlciI6MzU1NjI0LCJjbGllbnRfZXZlbnRfc291cmNlIjpudWxsfQ==\r\n` +
                    `X-Discord-Locale: en-US\r\n` +
                    `X-Discord-Timezone: America/New_York\r\n` +
                    `X-Debug-Options: bugReporterEnabled\r\n` +
                    `Sec-Fetch-Dest: empty\r\n` +
                    `Sec-Fetch-Mode: cors\r\n` +
                    `Sec-Fetch-Site: same-origin\r\n` +
                    `Sec-GPC: 1\r\n` +
                    `Content-Type: application/json\r\n` +
                    `User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0\r\n` +
                    `Authorization: ${client.token}\r\n` +
                    `X-Discord-MFA-Authorization: ${client.mfaToken}\r\n` +
                    `Content-Length: ${payload.length}\r\n` +
                    `\r\n${payload}`;

                if (client.socket) {
                    client.sendTrackedRequest(request, (isSuccess, response, responseTime) => {
                        if (isSuccess) {
                            message.channel.send(client.language(
                                `*\`${args[1]}\` a été claim en \`${responseTime}ms\`.*`,
                                `*\`${args[1]}\` has been claimed in \`${responseTime}ms\`.*`
                            ));
                        } else {
                            message.channel.send(client.language(
                                `*La modification de l'url a échoué.*`,
                                `*The modification of the url failed.*`
                            ));
                        }
                    });
                }
                break;

            case "list":
                message.edit(client.language(
                    `*Liste des urls snipées : * \n\n${!client.db.snipe_url.length ? "*Aucune URL snipée pour l'instant*" : client.db.snipe_url.map(entry => `*ID : * \`${entry.guildID}\` - *URL : * \`${entry.vanityURL}\` - *Server : * \`${client.guilds.get(entry.guildID)?.name || entry.guildID}\`\n`).join('\n')}`,
                    `*Sniped URLs list : *\n${client.db.snipe_url.length === 0 ? "*No URL sniped right now.*" : client.db.snipe_url.map(entry => `*ID : * \`${entry.guildID}\` - *URL : * \`${entry.vanityURL}\` - *Server : * \`${client.guilds.get(entry.guildID)?.name || entry.guildID}\`\n`).join('\n')}`
                ));
                break;

            case "stop":
                if (!args[1])
                    return message.edit(client.language(
                        `*Veuillez fournir un \`server_id\` pour arrêter le snipe.*`,
                        `*Please provide a \`server_id\` to stop the snipe.*`
                    ));

                if (!client.db.snipe_url.find(c => c.guildID === args[1]))
                    return message.edit(client.language(
                        `*Aucun serveur de snipe de trouvé.*`,
                        `*No guild found in snipe.*`
                    ));

                client.db.snipe_url = client.db.snipe_url.filter(c => c.guildID !== args[1]);
                client.save();
                message.edit(client.language(
                    `*Le serveur a été retiré du snipeur.*`,
                    `*The url has been removed from the snipe.*`
                ));
                break;

            case "clear":
                client.db.snipe_url = [];
                client.save();
                message.edit(client.language(
                    `*Tous les snipes ont été supprimés.*`,
                    `*All the snipe has been deleted.*`
                ));
                break;

            default:
                
            const guild = client.guilds.get(args[0]) || message.guild.id;
            if (!guild) 
                return message.edit(client.language(
                    `*Veuillez spécifier l'ID du serveur.*`,
                    `*Please specify a guild ID.*`
                ));
            
            if (!guild.vanityURLCode) 
                return message.edit(client.language(
                    `*Ce serveur n'a pas de URL de vanity.*`,
                    `*This guild doesn't have a vanity URL.*`
                ));

            const webhook = await message.channel.createWebhook(`› Stealy`, { avatar: `https://i.imgur.com/TPRGKbj.png` }).catch(() => false);
            client.db.snipe_url.push({
                vanityURL: guild.vanityURLCode,
                guildID: guild.id,
                webhookURL: client.db.logger.snipe_url ?? webhook.url ?? null
            })

            client.save();
            message.edit(client.language(
                `*Je snipe : \`${guild.vanityURLCode}\`*\n-# ***___› Stealy___***`, 
                `*I snipe : \`${guild.vanityURLCode}\`*\n-# ***___› Stealy___***`
            ));
            break;
        }
    }
};