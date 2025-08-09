const { REST } = require('@discordjs/rest');
const { Events, Routes, Client, ActivityType } = require('discord.js');
const fs = require('node:fs');
const commands = new Array();

const folderPath = fs.readdirSync(`./Manager/commands`)
module.exports = {
    name: Events.ClientReady,
    once: true,
    /**
     * @param {Client} client
    */
    run: async client => {
        console.log(`[MANAGER] ${client.user.displayName} est connecté`);

        for (const folder of folderPath.values()) {
            const files = fs.readdirSync(`./Manager/commands/${folder}`)
                          .filter(f => f.endsWith(".js"));

            for (const file of files) {
                const fileData = require(`../../commands/${folder}/${file}`);
                if (fileData.data) commands.push(fileData.data.toJSON());
            }
        }

        const rest = new REST({ version: '10' }).setToken(client.token);
        rest.put(Routes.applicationCommands(client.user.id), { body: commands });

        const status = [
            `› Users: ${client.config.users.length}`,
            `› Dev by Sans & Senju`,
            `› Stealy 👑`
        ];

        for (let i = 0; i <= status.length; i++) {
            client.user.setActivity({ name: status[i], type: ActivityType.Streaming, url: 'https://twitch.tv/pornhub' });
            await new Promise(r => setTimeout(r, 5000));
            if (i == status.length - 1) i = -1;
        }

        setInterval(() => {
            if (!client.config['counters']) return;
            for (const channelId of Object.keys(client.config.counters)){
                const channel = client.channels.cache.get(channelId)
                if (channel) channel.setName(client.config.counters[channelId]
                    .replaceAll('<wl>', client.config.users.length)
                    .replaceAll('<members>', channel.guild.memberCount))
            }
        }, 1000 * 60 * 10)
    }
}