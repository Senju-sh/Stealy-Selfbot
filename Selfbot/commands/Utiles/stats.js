const { Client, Message } = require("legend.js");
const os = require('os');

module.exports = {
    name: "stats",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        message.edit(client.language(
            `***__› Stealy - Stats__*** <a:star:1345073135095123978>

            > ***Tag*** : \`${client.user.username}\`
            > ***Serveurs*** : \`${client.guilds.size}\`
            > ***Users*** : \`${client.config.users.length}\`

            > ***Amis*** : \`${client.user.friends.size}\`
            > ***Bloqués*** : \`${client.user.blocked.size}\`
            > ***Clans*** : \`${client.guilds.filter(g => g.features.includes('GUILD_TAGS')).size}\`

            > ***Version Module*** : \`${process.version}\`
            > ***Uptime*** : \`${uptime(client)}\`
            > ***Utilisation Mémoire*** : \`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB / ${(os.totalmem() / 1024 / 1024).toFixed(2)} MB\`
                        
            > ***Nitro*** : \`${client.user.premium ? "Oui" : "Non"}\`
            > ***Numéro de Téléphone Vérifié*** : \`${client.user.mobile ? "Oui" : "Non"}\`
            > ***A2F*** : \`${client.user.mfaEnabled ? "Oui" : "Non"}\`
                        
            > ***Messages*** : \`${client.db.stats.messages_created}\`
            > ***Messages Supprimés*** : \`${client.db.stats.messages_deleted}\`
            > ***Urls Snipées*** : \`${client.db.stats.sniped}\``.replaceAll('  ', ''),
                        
            `***__› Stealy - Stats__*** <a:star:1345073135095123978>

            > ***Tag*** : \`${client.user.username}\`
            > ***Servers*** : \`${client.guilds.size}\`
            > ***Users*** : \`${client.config.users.length}\`

            > ***Friends*** : \`${client.user.friends.size}\`
            > ***Blocked*** : \`${client.user.blocked.size}\`
            > ***Clans*** : \`${client.guilds.filter(g => g.features.includes('GUILD_TAGS')).size}\`

            > ***Version Module*** : \`${process.version}\`
            > ***Uptime*** : \`${uptime(client)}\`
            > ***Memory Usage*** : \`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB / ${(os.totalmem() / 1024 / 1024).toFixed(2)} MB\`
                    
            > ***Nitro*** : \`${client.user.premium ? "Yes" : "No"}\`
            > ***Verified Phone Number*** : \`${client.user.mobile ? "Yes" : "No"}\`
            > ***2FA*** : \`${client.user.mfaEnabled ? "Yes" : "No"}\`
                        
            > ***Messages*** : \`${client.db.stats.messages_created}\`
            > ***Deleted Messages*** : \`${client.db.stats.messages_deleted}\`
            > ***Sniped Urls*** : \`${client.db.stats.sniped}\``.replaceAll('  ', '')
        ));
    }
};


function uptime(client){
    let totalSeconds = (client.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);
        
    return `${days}j ${hours}h ${minutes}m ${seconds}s`
}