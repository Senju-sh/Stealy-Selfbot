const { Client, Message } = require("legend.js");
const types = [  'mobile', 'pc', 'web', 'console' ];

module.exports = {
    name: "multispoof",
    owner: true,
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        switch(args[0]) {

            default:
                message.edit(client.language(
                    `***__› Stealy - MULTI SPOOF__*** <a:star:1345073135095123978>

                    \`${client.db.prefix}multispoof on\` › *Active le multi spoof.*
                    \`${client.db.prefix}multispoof off\` › *Désactive le multi spoof.*
                
                    \`${client.db.prefix}multispoof add\` › *Ajoute un appareil au spoof.*
                    \`${client.db.prefix}multispoof del\` › *Retire un appareil du spoof.*
                    \`${client.db.prefix}multispoof list\` › *Affiche la liste des appareils spoofs.*`.replaceAll('  ', ''),

                    `***__› Stealy - MULTI SPOOF__*** <a:star:1345073135095123978>

                    \`${client.db.prefix}multispoof on\` › *Enable the multi spoof.*
                    \`${client.db.prefix}multispoof off\` › *Disable the multi spoof.*
                
                    \`${client.db.prefix}multispoof add\` › *Add a device to the multi spoof.*
                    \`${client.db.prefix}multispoof del\` › *Remove a device from the multi spoof.*
                    \`${client.db.prefix}multispoof list\` › *Display the list of the multi spoof.*`.replaceAll('  ', ''),
                ))
                break;

            case 'on':
                if (client.db.multispoof.status)
                    return message.edit(client.language(
                        `*Le multi spoof est déjà activé.*`,
                        `*The multi spoof is already active.*`
                    ));

                    
                client.db.multispoof.devices.forEach(d => client.multiSpoof(d));
                client.db.multispoof.status = true;
                client.save();


                message.edit(client.language(
                    `*Le multi spoof a été activé.*`,
                    `*The multi spoof has been activated.*`
                ));
                break;

            
            case 'off':
                if (!client.db.multispoof.status)
                    return message.edit(client.language(
                        `*Le multi spoof est déjà désactivé.*`,
                        `*The multi spoof is already disable.*`
                    ));

                client.db.multispoof.status = false;
                client.save();

                client.db.multispoof.devices.forEach(d => {
                    if (client.data[`multispoof_${d}`]) {
                        client.data[`multispoof_${d}`].close();
                        delete client.data[`multispoof_${d}`];
                    }
                })

                message.edit(client.language(
                    `*Le multi spoof a été désactivé.*`,
                    `*The multi spoof has been disabled.*`
                ));
                break;

            case 'add':
                if (!types.includes(args[1]))
                    return message.edit(client.language(
                        `*Le type d'appareil doit être l'un de ces types : \`${types.join(', ')}\`.*`,
                        `*The device type must be one of these types: \`${types.join(', ')}\`.*`
                    ));

                if (client.db.multispoof.devices.includes(args[1]))
                    return message.edit(client.language(
                        `*L'appareil \`${args[1]}\` est déjà ajouté au multi spoof.*`,
                        `*The device \`${args[1]}\` is already added to the multi spoof.*`
                    ));

                if (client.db.multispoof.status) client.multiSpoof(args[1]);
                client.db.multispoof.devices.push(args[1]);
                client.save();

                message.edit(client.language(
                    `*L'appareil \`${args[1]}\` a été ajouté au multi spoof.*`,
                    `*The device \`${args[1]}\` has been added to the multi spoof.*`
                ));
                break;

            case 'del':
                if (!types.includes(args[1]))
                    return message.edit(client.language(
                        `*Le type d'appareil doit être l'un de ces types : \`${types.join(', ')}\`.*`,
                        `*The device type must be one of these types: \`${types.join(', ')}\`.*`
                    ));

                if (!client.db.multispoof.devices.includes(args[1]))
                    return message.edit(client.language(
                        `*L'appareil \`${args[1]}\` n'est pas ajouté au multi spoof.*`,
                        `*The device \`${args[1]}\` is not added to the multi spoof.*`
                    ));

                client.db.multispoof.devices = client.db.multispoof.devices.filter(d => d !== args[1]);
                client.save();

                if (client.data[`multispoof_${args[1]}`]) {
                    client.data[`multispoof_${args[1]}`].close();
                    delete client.data[`multispoof_${args[1]}`];
                }

                message.edit(client.language(
                    `*L'appareil \`${args[1]}\` a été retiré du multi spoof.*`,
                    `*The device \`${args[1]}\` has been removed from the multi spoof.*`
                ));
                break;

            case 'list':
                if (client.db.multispoof.devices.length === 0)
                    return message.edit(client.language(
                        `*Aucun appareil n'est ajouté au multi spoof.*`,
                        `*No device is added to the multi spoof.*`
                    ));

                client.send(message, client.language(
                    `*Appareils ajoutés au multi spoof : \`${client.db.multispoof.devices.join(', ')}\`.*`,
                    `*Devices added to the multi spoof: \`${client.db.multispoof.devices.join(', ')}\`.*`
                ));
                break;
        }
    }
};