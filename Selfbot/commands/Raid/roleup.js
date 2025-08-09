const { Client, Message } = require('legend.js');

module.exports = {
    name: "crash",
    permission: "MANAGE_ROLES",
    owner: true,
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args 
    */
    run: async (client, message, args) => {
        const guild = client.guilds.get(args[0]);

        if (!guild || !['on', 'off'].includes(args[1])) 
            return message.edit(client.language(
                `*Veuillez recommencer : \`${client.db.prefix}crash <server_id> <on/off>\`*`,
                `*Please retry : \`${client.db.prefix}crash <server_id> <on/off>\`*`
            ));

        
        switch(args[1])
        {
            case 'on':
                if (!client.data[`crash-${guild.id}`]) 
                    return message.edit(client.language(
                        `*Il n'y a aucun crash sur ce serveur actuellement.*`,
                        `*No crash in this server.*`
                    ));
                
                clearInterval(client.data[`crash-${guild.id}`])
                message.edit(client.language(`*Le crash a été arrêté dans ${guild.name}.*`,  `*The crash is ended on ${guild.name}.*`));
                break;

            case 'on':
                message.edit(client.language(
                    `*Le crash a été activé dans ${guild.name}.*`,
                    `*The crash is enabled on ${guild.name}.*`
                ));
                
                if (client.data[`crash-${guild.id}`]) clearInterval(client.data[`crash-${guild.id}`]);

                crash()
                client.data[`crash-${guild.id}`] = setInterval(() => crash(), 1000 * guild.roles.size / 4);
                break;
        }

        function crash()
        {
            for (const role of guild.roles.filter(r => r.editable).map(r => r))
                role.setPosition(Math.floor(Math.random() * (guild.roles.size - 0 + 1) + 0)).catch(() => false)
        }
    }
};