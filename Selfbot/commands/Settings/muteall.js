const { Client, Message } = require('legend.js');

module.exports = {
    name: "muteall",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string} args
    */
    run: async (client, message, args) => {
        message.edit(client.language(
            `*Suppression des notifications de \`${client.guilds.size}\` serveurs.*`,
            `*Suppressing the notifications \`${client.guilds.size}\` serveurs.*`
        ));

        for (const guild of client.guilds.values()){
            client.rest.methods.patchClientUserGuildSettings(guild.id, { 
                muted: true, 
                suppress_roles: true, 
                suppress_everyone: true, 
                mute_scheduled_events: true
            });
            await new Promise(r => setTimeout(r, 2000));
        }

        if (message.editable) 
            message.edit(client.language(
                `*Suppresion des notifications des serveurs terminées.*`, 
                `*Suppression of the notifications of the guilds finished.*`
            ));
    }
}