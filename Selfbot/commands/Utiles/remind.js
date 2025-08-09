const { Client, Message } = require("legend.js");

module.exports = {
    name: "remind",
    owner: true,
    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args
     */
    run: async (client, message, args) => {
        if (!['add', 'delete', 'list'].includes(args[0]))
            return message.edit(client.language(
                "*Veuillez spécifier une sous-commande : `add`, `delete` ou `list`.*",
                "*Please use once of this arguments : `add`, `delete` or `list`.*"
            ));


        switch (args[0]) {
            case "add" :

                if (!ms(args[1])) 
                    return message.edit(client.language(
                        `*Utilisez un temps valide comme \`20m , 1h , 2d\`.*`,
                        `*Please use a time format such as \`20m , 1h , 2d\`.*`
                    ));

                const timeMs = ms(args[1]);
                const channel = message.mentions.channels.first() || client.channels.get(args[2]);

                if (!channel) 
                    return message.edit(client.language(
                        `*Aucun salon de trouvé pour \`${args[2] ?? 'rien'}\`.*`,
                        `*No channel found for \`${args[2] ?? 'nothing'}\`.*`
                    ));

                if (!args[3])
                    return message.edit(client.language(
                        `*Format invalide : \`${client.db.prefix}remind add <number> <channel> <message>\`*`,
                        `Invalid Format : \`${client.db.prefix}remind add <number> <channel> <message>\``
                    ));

                const reminds = {
                    channelId: channel.id,
                    message: args.slice(3).join(' '),
                    time: timeMs
                };

                client.db.reminder.push(reminds);
                client.emit('remind', reminds);
                message.edit(client.language(
                    `*Remind activé avec l'id : \`${client.db.reminder.length - 1}\`.*`,
                    `*Remind activated with id : \`${client.db.reminder.length - 1}\`.*`
                ));
                break;

            case "delete" : 
                const id = parseInt(args[1]);

                if (isNaN(args[1]))
                    return message.edit(client.language(
                        `*Veuillez spécifier l'ID du remind à supprimer.*`,
                        `*Please specify the remind ID to be deleted.*`
                    ));

                if (args[1] < 0 || args[1] > client.db.reminder.length) 
                    return message.edit(client.language(
                        `*Aucun remind a supprimé.*`,
                        `*No reminder has been deleted.*`
                    ));

                clearInterval(client.data[`remind_${client.db.reminder[args[1]].channelId}_${client.db.reminder[args[1]].message}`])
                client.db.reminder = client.db.reminder.filter(r => r !== client.db.reminder[args[1]]);
                client.save();

                message.edit(client.language(
                    `*Rappel avec l'ID \`${id}\` supprimé avec succès.*`,
                    `Remind with id \`${id}\` successfully deleted.`
                ));
                break;

            case "list" : 
                if (client.db.reminder.length === 0) return message.edit(client.language(`*Vous n'avez aucun rappel en cours.*`,`*You have no active reminders.*`));

                client.send(message, client.db.reminder.map((r, i) => client.language(
                    `> *ID :* \`${i}\`\n` +
                    `> *Canal :* <#${r.channelId}>\n` +
                    `> *Message :* \`${r.message}\`\n` +
                    `> *Temps :* \`${ms2(r.time)}\``,
                    
                    `> *ID :* \`${i}\`\n` +
                    `> *Channel :* <#${r.channelId}>\n` +
                    `> *Message :* \`${r.message}\`\n` +
                    `> *Time :* \`${ms2(r.time)}\``
                )).join('\n'))
                break;
        }
    }
}




/**
 * Convertit du temps en millisecondes.
 * @param {number} ms - Le temps à convertir.
 * @returns {number | string} - Le temps converti ou un false si l'unité est invalide.
 */
function ms(timeString) {
    if (!timeString) return null;
    const match = timeString.match(/(\d+)([smhdwy])/);
    if (!match) return null;

    const value = parseInt(match[1]);
    const unit = match[2];

    switch (unit) {
        case 's': return value * 1000;
        case 'm': return value * 60 * 1000;
        case 'h': return value * 60 * 60 * 1000;
        case 'd': return value * 24 * 60 * 60 * 1000;
        case 'w': return value * 7 * 24 * 60 * 60 * 1000;
        case 'y': return value * 365 * 24 * 60 * 60 * 1000;
        default: return null;
    }
};

/**
 * Convertit des millisecondes en secondes, minutes, heures, jours ou semaines.
 * @param {number} ms - Le temps en millisecondes à convertir.
 * @returns {number | boolean} - Le temps converti ou un false si l'unité est invalide.
 */
function ms2(ms) {
    const units = [
        { name: "weeks", value: 1000 * 60 * 60 * 24 * 7 },
        { name: "days", value: 1000 * 60 * 60 * 24 },
        { name: "hours", value: 1000 * 60 * 60 },
        { name: "minutes", value: 1000 * 60 },
        { name: "seconds", value: 1000 },
    ];

    for (const unit of units) {
        if (ms >= unit.value && ms % unit.value === 0) {
            return `${ms / unit.value}${unit.name[0]}`;
        }
    }
    return `${ms}ms`;
}