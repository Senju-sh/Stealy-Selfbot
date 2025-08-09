const { Client, Message } = require('legend.js');

module.exports = {
    name: "noadd",
    premium: true,
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string} args
    */
    run: async (client, message, args) => {

        const channel = message.mentions.channels.first() || client.channels.get(args[1]) || message.channel
        
        if (channel.type !== 'group') 
            return message.edit(client.language(
                '*Cette commande ne peut être utilisée que dans un groupe DM.*', 
                '*This command can only be used in a group DM.*'
            ));
        
        if (channel.owner.id !== message.author.id) 
            return message.edit(client.language(
                '*Vous devez avoir la propriété du groupe.*',
                '*You must have ownership of this group.*'
            ));
        
        if (client.db.anti_group.no_leave.includes(channel.id)) 
            return message.edit(client.language(
                "*Vous ne pouvez pas définir ce salon en tant que no leave et no add.*",
                "*You can't define this channel as a no leave and a no add.*"
            ));

        switch(args[0]){
            default: 
                return message.edit(client.language(
                    '*Argument invalide. Utilisez "on" pour démarrer ou "off" pour arrêter.*',
                    '*Invalid argument. Use "on" to start or "off" to stop.*'
                ));

            case "on":
                if (client.db.anti_group.no_add.includes(channel.id)) 
                    return message.edit(client.language(
                        'Ce groupe est déjà vérouillé.*',
                        'This group is already locked.*'
                    ));

                client.db.anti_group.no_add.push(channel.id);
                client.save();

                message.edit(client.language(
                    `*Personne ne pourra être ajouté au groupe ${channel.name}*`,
                    `*Nobody can be added to the group ${channel.name}*`
                ));
                break

            case "off":
                if (!client.db.anti_group.no_add.includes(channel.id)) 
                    return message.edit(client.language(
                        '*Aucune surveillance active à arrêter.*',
                        '*No active monitoring to stop.*'
                    ));

                client.db.anti_group.no_add = client.db.anti_group.no_add.filter(c => c !== channel.id)
                client.save();

                message.edit(client.language(
                    `*Les utilisateurs pourront maintenant être ajoutés à ${channel.name}*`,
                    `*Users can bee added to ${channel.name}*`
                ));
                break
        }
    }
};