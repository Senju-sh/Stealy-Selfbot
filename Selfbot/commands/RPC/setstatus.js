const status_list = ['online', 'idle', 'dnd', 'invisible'];
const { Client, Message } = require("legend.js");

module.exports = {
    name: "setstatus",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string} args
    */
    run: async (client, message, args) => {
        if (!status_list.includes(args[0]))
            return message.edit(client.language(
                `*Veuillez choisir un de ses types: ${status_list.map(r => `\`${r}\``).join(', ')}.*`, 
                `*Please choose one of this types: ${status_list.map(r => `\`${r}\``).join(', ')}.*`
            ));

        client.db.status = args[0];
        client.user.setStatus(args[0]);

        client.save();
        message.edit(client.language(
            `*Vous êtes maintenant en mode \`${getType(args[0])[0]}\`*`, 
            `*Your now in \`${getType(args[0])[1]}\` mode*`
        ));
    }
}

/**
 * @param {string} type
 * @returns {Array<string>}
*/
function getType(type){
    switch(type){
        case 'dnd': return [ 'ne pas déranger', 'do not disturb' ];
        case 'invisible': return [ 'invisible', 'invisible' ];
        case 'online': return [ 'en ligne', 'online' ];
        case 'idle': return [ 'inactif', 'idle' ];
    }
}