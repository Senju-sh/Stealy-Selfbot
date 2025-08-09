const { Client, Message } = require('legend.js');

module.exports = {
    name: "paypal",
    /**
     * @param {Client} client
     * @param {Message} message
    */
    run: async (client, message, args) => {
        switch(args[0]){
            default:
                if (!client.db.payment.paypal)
                    return message.edit(client.language(
                        `***___› Stealy - Paypal___*** <a:star:1345073135095123978>

                        \`${client.db.prefix}paypal [nombre]\` › *Envoie un lien de paiement paypal.*
                        \`${client.db.prefix}paypal set <pseudo>\` › *Configure votre pseudo paypal.*`.replaceAll('  ', ''),
                        `***___› Stealy - Paypal___*** <a:star:1345073135095123978>

                        \`${client.db.prefix}paypal [number]\` › *Send a paypal's payment link.*
                        \`${client.db.prefix}paypal set <name>\` › *Edit your paypal name.*`.replaceAll('  ', '')
                    ))

                if (args[0] && isNaN(args[0]))
                    return message.edit(client.language(
                        `*Veuillez entrer un nombre valide.*`,
                        `*Please enter a valid number.*`
                    ));

                message.edit(`[${client.db.payment.paypal}](https://www.paypal.me/${client.db.payment.paypal}${args[0] ? `/${args[0]}` : ''})`);
                break;

            case 'set':
                if (!args[1]){
                    client.db.payment.paypal = null;
                    client.save();

                    return message.edit(client.language(
                        `*Votre pseudo paypal a été supprimé.*`,
                        `*Your paypal name has been deleted.*`
                    ))
                }

                client.db.payment.paypal = args[1];
                client.save();

                message.edit(client.language(
                    `*Votre pseudo paypal est maintenant [\`${args[1]}\`](<https://www.paypal.me/${client.db.payment.paypal}>).*`,
                    `*Your paypal name is now [\`${args[1]}\`](<https://www.paypal.me/${client.db.payment.paypal}>).*`
                ));
                break;
        }
    }
};