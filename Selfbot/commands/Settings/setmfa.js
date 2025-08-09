const { Client, Message } = require('legend.js');
const forbiddenPattern = /^[a-z0-9]{4}( [a-z0-9]{4}){7}$/;
const { vanity_defender } = require('../../../Structures/files/Ticket');

module.exports = {
    name: "setmfa",
    premium: true,
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string} args
    */
    run: async (client, message, args) => {
        if (!args[0]) 
            return message.edit(client.language(
                `*Veuillez entrer une clé d'A2F ou mot de passe valide.*`,
                `*Please enter a valid MFA key or password.*`
            ));
                
            if (client.user.mfaEnabled && !forbiddenPattern.test(args.join(' ')))
                return message.edit(client.language(
                    `*Veuillez entrer une clé A2F.*`,
                    `*Please enter a valid MFA key.*`
                ));

            client.db.mfa_key = args.slice(0).join(' ').replaceAll(' ', '');
            client.save();

            vanity_defender(client);

            message.edit(client.language(
                `*Votre clé d'A2F a été Mise à jour.*`,
                `*Your MFA key has been updated.**`
            ));
    }
}