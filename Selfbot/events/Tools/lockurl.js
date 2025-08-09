const { Guild, Client } = require("legend.js");
const { performance } = require('perf_hooks')
module.exports = {
    name: "guildUpdate",
    /**
     * @param {Guild} oldGuild
     * @param {Guild} newGuild
     * @param {Client} client
     */
    run: async (oldGuild, newGuild, client) => {
        const entry = client.db.lock_url.find(entry => oldGuild.id === entry.guildID);
        if (!entry || newGuild.vanityURLCode === entry.vanityURL) return;

        try {
            const payload = `{"code":"${entry.vanityURL}"}`;
            const request = 
                `PATCH /api/v9/guilds/${oldGuild.id}/vanity-url HTTP/1.1\r\n` +
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
                    if (isSuccess && client.db.logger.lock_url.enable && client.db.logger.lock_url.url) {
                        const embed = {
                            title: `***__› Stealy - LOCK URL__*** <a:star:1345073135095123978>`,
                            description: client.language("*Une URL personnalisée a été verrouillée avec succès !*", "*A custom URL has been successfully locked!*"),
                            color: parseInt(client.db.log_color, 16),
                            fields: [
                                { name: client.language('URL verrouillée :', 'Locked URL :'), value: `\`${entry.vanityURL}\`` },
                                { name: client.language('Serveur :', 'Server :'), value: `${newGuild.name} (\`${newGuild.id}\`)` },
                                { name: client.language('Temps de réponse :', 'Response time :'), value: `\`${responseTime}ms\`` },
                            ],
                            timestamp: new Date().toISOString()
                        }
                        client.log(client.db.logger.lock_url.url, { content: `<@${client.user.id}>`, embeds: [embed] })
                    }
                });
            }

            client.db.stats.sniped++;

            const audit = await newGuild.fetchAuditLogs({ type: 1, max: 1 })
                .then(audit => audit.entries.first())
                .catch(() => null);

            if (!audit || !audit.executor) return;

            const member = newGuild.members.get(audit.executor.id) || await newGuild.fetchMember(audit.executor.id).catch(() => null);
            if (member && member.kickable) member.kick("Stealy - Lock URL").catch(() => null);            
        } catch (error) {
            console.error("❌ Erreur dans guildUpdate:", error);
        }
    },
};
