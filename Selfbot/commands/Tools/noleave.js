const { Client, Message } = require("legend.js");

module.exports = {
    name: "noleave",
    premium: true,
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string} args
    */
    run: async (client, message, args) => {
        
        const channel = message.mentions.channels.first() || client.channels.get(args[0]) || message.channel 
        
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
            default: return message.edit(client.language('*Vous devez spécifier "on" pour démarrer ou "off" pour arrêter.*', '*You must specify "on" to start or "off" to stop.*'));

            case "on":
                if (client.db.anti_group.no_leave.includes(channel.id)) 
                    return message.edit(client.language(
                        '*Ce groupe est déjà vérouillé*',
                        '*This group is already locked*'
                    ));

                client.db.anti_group.no_leave.push(channel.id);
                client.save();
                message.edit(client.language(
                    `*Plus aucun utilisateur ne pourra maintenant quitter ${channel}.*`,
                    `*Nobody will be able to leave ${channel}.*`
                ));
                break

            case "off":
                if (!client.db.anti_group.no_leave.includes(channel.id)) 
                    return message.edit(client.language(
                        '*Aucune surveillance active à arrêter.*',
                        '*No active monitoring to stop.*'
                    ));

                client.db.anti_group.no_leave = client.db.anti_group.no_leave.filter(c => c !== channel.id)
                client.save()

                message.edit(client.language(
                    `*Les utilisateurs pourront de nouveau quitter ${channel}.*`,
                    `*Users are now able to leave ${channel}.*`
                ));
                break
        }
    }
};
