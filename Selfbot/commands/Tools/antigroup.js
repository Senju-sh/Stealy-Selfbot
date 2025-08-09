const { Client, Message } = require("legend.js")

module.exports = {
    name: "antigroup",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string} args
    */
    run: async (client, message, args) => {
        switch(args[0]){
            default: 
                message.edit(client.language(
                    `***___› Stealy - Groups___*** <a:star:1345073135095123978>
                        
                \`${client.db.prefix}antigroup <on/off> <text>\` › *Active ou Désactive anti-group.*
                \`${client.db.prefix}antigroup silent <on/off>\` › *Active ou Désactive l'anti-group silent.*
                        
                \`${client.db.prefix}antigroup wl <user>\` › *Autorise un user à t'ajouter dans un groupe.*
                \`${client.db.prefix}antigroup unwl <user>\` › *Retire un utilisateur de la whitelist anti-group.*
                        
                \`${client.db.prefix}antigroup wl list\` › *Liste les users whitelists.*
                \`${client.db.prefix}antigroup content <text>\` › *Défini un texte à envoyer avant de quitter un groupe.* 

                \`${client.db.prefix}noadd <on/off>\` › *Active ou Désactive la permission d'ajouter quelqu'un dans un groupe.*
                \`${client.db.prefix}noleave <on/off>\` ›  *Re-ajoute les users qui quitte le groupe (friends only).*`.replaceAll('  ', '')))
                
                `***___› Stealy - Groups___*** <a:star:1345073135095123978>
                        
                \`${client.db.prefix}antigroup <on/off> <text>\` › *Enable or Disable anti-group.*
                \`${client.db.prefix}antigroup silent <on/off>\` › *Enable or Disable silent anti-group.*
                        
                \`${client.db.prefix}antigroup wl <user>\` › *Allow a user to add you to a group.*
                \`${client.db.prefix}antigroup unwl <user>\` › *Remove a user whitelist from the anti-group.*
                        
                \`${client.db.prefix}antigroup wl list\` › *List whitelisted users.*
                \`${client.db.prefix}antigroup content <text>\` › *Define a text to send before leaving groups.* 

                \`${client.db.prefix}noadd <on/off>\` › *Enable or disable the permission to add a user to your group.*
                \`${client.db.prefix}noleave <on/off>\` ›  *Re-add users who leave the group (friends only).*`.replaceAll('  ', '')
                break

            case 'wl':
                const user = message.mentions.users.first() || client.users.get(args[0]) || await client.fetchUser(args[0]).catch(() => false);

                if (!user || !args[0]) 
                    return message.edit(client.language(
                        '*Aucun utilisateur trouvé.*',
                        '*No user found.*'
                    ));

                if (client.db.anti_group.whitelist.includes(user.id)) 
                    return message.edit(client.language(
                        `*${user} est déjà whitelist.*`,
                        `*${user} is already whitelist.*`
                    ));

                client.db.anti_group.whitelist.push(user.id);
                client.save();

                message.edit(client.language(
                    `*${user} a été ajouté à la whitelist de l'anti groupe.*`,
                    `*${user} has been added to the whitelist of the anti group.*`
                ));
                break;

            case 'unwl':
                const unwl_user = message.mentions.users.first() || client.users.get(args[0]) || await client.fetchUser(args[0]).catch(() => false);

                if (!unwl_user || !args[0])
                    return message.edit(client.language(
                        '*Aucun utilisateur trouvé.*',
                        '*No user found.*'
                    ));

                if (!client.db.anti_group.whitelist.includes(unwl_user.id)) 
                    return message.edit(client.language(
                        `*${unwl_user} n'est pas whitelist.*`,
                        `*${user} is not whitelist.*`
                    ));

                client.db.anti_group.whitelist = client.db.anti_group.whitelist.filter(r => r !== unwl_user.id);
                client.save();

                message.edit(client.language(
                    `*${unwl_user} a été retiré de la whitelist de l'anti groupe.*`,
                    `*${unwl_user} has been removed from the whitelist of the anti group.*`
                ));
                break;
            
            case "silent":
                if (args[1] === "on"){
                    client.db.anti_group.silent = true;
                    client.save();
                    message.edit(client.language(
                        "*Tu vas quitter le groupe sans envoyer de signal.*",
                        "*You're gonna leave the group without sending any message.*"
                    ));
                }
                if (args[1] === "off"){
                    client.db.anti_group.silent = false;
                    client.save();
                    message.edit(client.language(
                        "*Tu ne quitteras pas le groupe discrètement.*",
                        "*You're gonna leave the group and sending the discord message.*"
                    ));
                }
                break

            case 'content':
                client.db.anti_group.message = args[1] ? args.slice(1).join(' ') : null;
                client.save();
                message.edit(client.language(
                    `Le message de l'anti groupe a été ${args[1] ? 'modifié' : 'supprimé'}`,
                    `The message of the anti group has been ${args[1] ? 'edited' : 'deleted'}`,
                ));
                break;

            case "on":
                client.db.anti_group.status = true;

                client.save();
                message.edit(client.language(
                    `*L'anti groupes a été activé.*`,
                    `The anti groups has been activated.*`
                ));
                break

            case "off":
                client.db.anti_group.status = false;
                client.save();
                message.edit(client.language(
                    "*L'anti groupes a été désactivé.*", 
                    "*The anti groups has been desactivated.*"
                ))
                break
        }
    }
}