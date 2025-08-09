const { Client, Message } = require('legend.js');

module.exports = {
    name: "utils",
    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async (client, message, args) => {

        message.edit(client.language(
            `***___› Stealy - Utility___*** <a:star:1345073135095123978>

            \`${client.db.prefix}ping\` › *Voir la latence de la machine.*
            \`${client.db.prefix}profil <user>\` › *Voir le profil d'un user.*

            \`${client.db.prefix}avatar <user>\` › *Voir l'avatar d'un user.*
            \`${client.db.prefix}banner <user>\` › *Montre la bannière d'un user.*

            \`${client.db.prefix}userinfo <user>\` › *Informations utilisateur.*
            \`${client.db.prefix}serverinfo <server_id>\` › *Informations serveur.*

            \`${client.db.prefix}dmfriends <message>\` › *Envoyer un message à tout vos amis.*
            \`${client.db.prefix}dm\` › *Permet d'afficher le menu de gestion des dms.*

            \`${client.db.prefix}stats\` › *Permet d'afficher vos stats.*
            \`${client.db.prefix}react <user/stop>\` › *Permet de react a tout les message d'un user dans le channel ou vous faites la commande.*

            \`${client.db.prefix}wb\` › *Créé un webhook dans le salon.*
            \`${client.db.prefix}emoji <emoji>\` › *Créé un emoji.*

            \`${client.db.prefix}savechat <channel> <number>\` › *Sauvegarder un nombre de message demandé d'un salon en question sous format txt.*
            \`${client.db.prefix}badges <user>\` › *Voir les badges d'un user.*

            \`${client.db.prefix}paypal\` › *Affiche le panel paypal.*
            \`${client.db.prefix}ltc\` › *Affiche le panel LTC.*

            \`${client.db.prefix}nsfw <on/off>\` › *Activer ou desactiver le mode NSFW d'un salon.*
            \`${client.db.prefix}hide <on/off>\` › *Afficher ou Cacher un salon.*
            \`${client.db.prefix}edit <number> <text>\` › *Modifier un nombre de message demandé par un texte.*

            \`${client.db.prefix}invite <server_id>\` › *Permet d'avoir une invitation d'un serveur.*
            \`${client.db.prefix}move <user>\` › *Permets de vous move dans le vocal de l'utilisateur.*

            \`${client.db.prefix}bring <user>\` › *Permets de te portez un utilisateur dans votre vocal.*
            \`${client.db.prefix}hype\` › *Permet de modifier votre hypesquad.*`.replaceAll('  ', ''),
            
            `***___› Stealy - Utility___*** <a:star:1345073135095123978>

            \`${client.db.prefix}ping\` › *See the latency of the machine.*
            \`${client.db.prefix}profil <user>\` › *See the profile of a user.*

            \`${client.db.prefix}avatar <user>\` › *See the avatar of a user.*
            \`${client.db.prefix}banner <user>\` › *See the banner of a user.*

            \`${client.db.prefix}userinfo <user>\` › *User information.*
            \`${client.db.prefix}serverinfo <server_id>\` › *Server information.*

            \`${client.db.prefix}dmfriends <message>\` › *Send a message to all your friends.*
            \`${client.db.prefix}dm\` › *Allows you to display the dm management menu.*

            \`${client.db.prefix}stats\` › *Allows you to display your stats.*
            \`${client.db.prefix}react <user/stop>\` › *Allows you to react to all the messages of a user in the channel you made the command.*

            \`${client.db.prefix}wb\` › *Create a webhook in the channel.*
            \`${client.db.prefix}emoji <emoji>\` › *Create an emoji.*

            \`${client.db.prefix}savechat <channel> <number>\` › *Save a number of messages asked from a channel in txt format.*
            \`${client.db.prefix}badges <user>\` › *See the badges of a user.*

            \`${client.db.prefix}paypal\` › *Display the paypal panel.*
            \`${client.db.prefix}ltc\` › *Display the LTC panel.*

            \`${client.db.prefix}nsfw <on/off>\` › *Activate or deactivate the NSFW mode of a channel.*
            \`${client.db.prefix}edit <number> <text>\` › *Modify a number of messages asked by a text.*

            \`${client.db.prefix}invite <server_id>\` › *Allows you to get an invitation of a server.*
            \`${client.db.prefix}move <user>\` › *Allows you to move to the voice of a user.*

            \`${client.db.prefix}bring <user>\` › *Allows you to bring a user to your voice.*
            \`${client.db.prefix}hype\` › *Allows you to modify your hypesquad.*`.replaceAll('  ', '')
        ));
    }
}; 