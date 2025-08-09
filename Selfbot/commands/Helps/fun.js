const { Client, Message } = require("legend.js")

module.exports = {
    name: "fun",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message) => {
    
        message.edit(client.language(
            `***___› Stealy - Fun___*** <a:star:1345073135095123978>

            \`${client.db.prefix}magic <user>\` › *Permet de faire de la magie avec la pp d'une personne.*
            \`${client.db.prefix}hug <user>\` › *Permet de faire un calin à quelqu'un.*

            \`${client.db.prefix}kiss <user>\` › *Permet de faire un bisous à quelqu'un.*
            \`${client.db.prefix}slap <user>\` › *Permet de mettre une claque à quelqu'un.*

            \`${client.db.prefix}deepfry <user>\` › *Permet de détruire la pp de quelqu'un*
            \`${client.db.prefix}blurpify <user>\` › *Permet d'appliquer les couleurs de Discord sur la pp de quelqu'un.*

            \`${client.db.prefix}say <user> <message>\` › *Dire une chose sous l'identité d'autrui (webhook).*
            \`${client.db.prefix}thot <user>\` › *Note le pourçentage de saloperie d'autrui.*

            \`${client.db.prefix}love <user>\` › *Message animé.*
            \`${client.db.prefix}nitro\` › *Drop un faux nitro.*`.replaceAll('  ', ''),

            `***___› Stealy - Fun___*** <a:star:1345073135095123978>

            \`${client.db.prefix}magic <user>\` › *Allows you to make magic with the pp of someone.*
            \`${client.db.prefix}hug <user>\` › *Allows you to hug someone.*

            \`${client.db.prefix}kiss <user>\` › *Allows you to kiss someone.*
            \`${client.db.prefix}slap <user>\` › *Allows you to slap someone.*

            \`${client.db.prefix}deepfry <user>\` › *Allows you to destroy someone's pp*  
            \`${client.db.prefix}blurpify <user>\` › *Allows you to apply Discord colors on someone's pp.*

            \`${client.db.prefix}say <user> <message>\` › *Say something under someone's identity (webhook).*
            \`${client.db.prefix}thot <user>\` › *Note the percentage of niceness of someone.*

            \`${client.db.prefix}love <user>\` › *Animated message.*
            \`${client.db.prefix}nitro\` › *Drop a fake nitro.*`.replaceAll('  ', '')
        ));
    }
}