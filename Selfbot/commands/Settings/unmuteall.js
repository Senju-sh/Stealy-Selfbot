const { Client, Message } = require('legend.js');

module.exports = {
    name: "unmuteall",
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
                muted: false, 
                suppress_roles: false, 
                suppress_everyone: false, 
                mute_scheduled_events: false
            });
            await new Promise(r => setTimeout(r, 2000));
        }

        if (message.editable) message.edit(client.language(
            `*Suppresion des notifications des serveurs terminées.*`,
            `*Suppression of the notifications of the guilds finished.*`
        ));
    }
}