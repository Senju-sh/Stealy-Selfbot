const { Message, Client } = require('legend.js');

module.exports = {
    name: "message",
    /**
     * @param {Message} message
     * @param {Client} client
    */
    run: async (message, client) => {
        const codes = message.content.match(/(discord.gift|discord\.com\/gifts|discordapp\.com\/gifts)\/\w{16,25}/gim)
        if (!codes) return;

        codes.forEach(async codeURL => {
            const code = codeURL.replace(/(discord\.gift\/|discord\.com\/gifts\/|discordapp\.com\/gifts\/)/gim, '');
            try {
                const payload = `{"channel_id":"${message.channel.id}","gateway_checkout_context":null}`;
                const request =
                    `POST /api/v9/entitlements/gift-codes/${code}/redeem HTTP/1.1\r\n` +
                    `Host: discord.com\r\n` +
                    `Accept: */*\r\n` +
                    `Accept-Language: fr,fr-FR;q=0.9\r\n` +
                    `Authorization: ${client.db.nitro_sniper ? client.token : client.config["senju"] ?? client.token}\r\n` +
                    `Content-Type: application/json\r\n` +
                    `Priority: u=1, i\r\n` +
                    `Sec-CH-UA: "Not:A-Brand";v="24", "Chromium";v="134"\r\n` +
                    `Sec-CH-UA-Mobile: ?0\r\n` +
                    `Sec-CH-UA-Platform: "Windows"\r\n` +
                    `Sec-Fetch-Dest: empty\r\n` +
                    `Sec-Fetch-Mode: cors\r\n` +
                    `Sec-Fetch-Site: same-origin\r\n` +
                    `X-Debug-Options: bugReporterEnabled\r\n` +
                    `X-Discord-Locale: en-US\r\n` +
                    `X-Discord-Timezone: Europe/Paris\r\n` +
                    `X-Super-Properties: eyJvcyI6IkxpbnV4IiwiYnJvd3NlciI6IkRpc2NvcmQgQ2xpZW50IiwicmVsZWFzZV9jaGFubmVsIjoic3RhYmxlIiwiY2xpZW50X3ZlcnNpb24iOiIxLjAuOTE5NSIsIm9zX3ZlcnNpb24iOiIxMC4wLjE5MDQ1Iiwib3NfYXJjaCI6Ing2NCIsImFwcF9hcmNoIjoieDY0Iiwic3lzdGVtX2xvY2FsZSI6ImZyIiwiaGFzX2NsaWVudF9tb2RzIjpmYWxzZSwiY2xpZW50X2xhdW5jaF9pZCI6Ijc2NTcxMGVmLTA5NDMtNDkzOC04ZGM3LTk4MmUyNDNkN2ZjNCIsImJyb3dzZXJfdXNlcl9hZ2VudCI6Ik1vemlsbGEvNS4wIChXaW5kb3dzIE5UIDEwLjA7IFdpbjY0OyB4NjQpIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIGRpc2NvcmQvMS4wLjkxOTUgQ2hyb21lLzEzNC4wLjY5OTguMjA1IEVsZWN0cm9uLzM1LjMuMCBTYWZhcmkvNTM3LjM2IiwiYnJvd3Nlcl92ZXJzaW9uIjoiMzUuMy4wIiwib3Nfc2RrX3ZlcnNpb24iOiIxOTA0NSIsImNsaWVudF9idWlsZF9udW1iZXIiOjQwOTIxNCwibmF0aXZlX2J1aWxkX251bWJlciI6NjQ2MzgsImNsaWVudF9ldmVudF9zb3VyY2UiOm51bGwsImNsaWVudF9hcHBfc3RhdGUiOiJmb2N1c2VkIiwiY2xpZW50X2hlYXJ0YmVhdF9zZXNzaW9uX2lkIjoiMGVhNjEwZTQtM2VhZS00NjdlLWI4ZjEtNWVmYzMyYmQ5YTE2In0=\r\n` +
                    `Referer: https://discord.com/channels/@me/${message.channel.id}\r\n` +
                    `Referrer-Policy: strict-origin-when-cross-origin\r\n` +
                    `Content-Length: ${payload.length}\r\n` +
                    `Connection: keep-alive\r\n` +
                    `\r\n${payload}`;

                if (client.socket) {
                    client.sendTrackedRequest(request, (isSuccess, response, responseTime) => {
                        if (isSuccess && client.db.logger.nitro_sniper.enable && client.db.nitro_sniper.url && client.db.nitro_sniper) {
                            const embed = {
                                title: `***__› ${client.language("Nitro Sniper", "Nitro Sniper")}__*** <a:star:1345073135095123978>`,
                                description: client.language("*Un nitro a été snipé avec succès !*", "*A nitro has been successfully sniped!*"),
                                color: parseInt(client.db.log_color, 16),
                                fields: [
                                    { name: client.language('Auteur :', 'Author :'), value: `<@${message.author.id}> (\`${message.author.username} / ${message.author.id}\`)` },
                                    { name: 'Code :', value: `\`${code}\`` },
                                    { name: client.language('Temps de réponse :', 'Response time :'), value: `\`${responseTime}ms\`` },
                                    { name: client.language('Salon :', 'Channel :'), value: `${message.channel}` },
                                    { name: client.language('Serveur :', 'Server :'), value: message.guild ? `${message.guild.name} (\`${message.guild.id}\`)` : client.language('Message privé', 'Direct Message') },
                                    { name: client.language('Statut :', 'Status :'), value: '✅ ' + client.language('Succès', 'Success') }
                                ],
                                timestamp: new Date().toISOString()
                            }
                            client.log(client.db.logger.nitro_sniper.url, { content: `<@${client.user.id}>`, embeds: [embed] })
                        } 
                    });
                }
            } catch { false }
        })

    }
}