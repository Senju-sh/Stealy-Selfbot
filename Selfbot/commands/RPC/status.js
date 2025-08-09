const { Util, Client, Message } = require('legend.js')
const types = [ "love", "think", "question", "excited", "recommend", "leave" ];

module.exports = {
    name: "status",
    /**
     * @param  {Client} client
    * @param  {Message} message
    * @param  {string[]} args
    */
    run: async (client, message,args,) => {        
        switch(args[0]){
            default: 
                return message.edit(client.language(
                    `***___› Stealy - Status___*** <a:star:1345073135095123978>

                    \`${client.db.prefix}setstatus [online, idle, dnd, invisible]\` › *Changer la présence*
                    \`${client.db.prefix}setrpc\` › *Définir un RPC*

                    \`${client.db.prefix}clearstatus\` › *Supprimer votre status*
                    \`${client.db.prefix}rpc\` › *Configuration du RPC*

                    \`${client.db.prefix}status <on/off>\` › *Active ou Désactive le status*
                    \`${client.db.prefix}status emoji [emoji]\` › *Mettre un emoji dans votre status*

                    \`${client.db.prefix}status content [text]\` › *Mettre du texte dans votre status*
                    \`${client.db.prefix}status type <type>\` › *Modifie le type de status*

                    \`${client.db.prefix}spotify\` › *Configuration de la presence Spotify*
                    \`${client.db.prefix}setgame\` › *Configuration de la presence jeux*`.replaceAll('  ', ''), 
                    `***___› Stealy - Status___*** <a:star:1345073135095123978>

                    \`${client.db.prefix}setstatus [online, idle, dnd, invisible]\` › *Change the status*
                    \`${client.db.prefix}setrpc\` › *Set a rich presence*

                    \`${client.db.prefix}clearstatus\` › *Delete your status*
                    \`${client.db.prefix}rpc\` › *Rich presence configuration*

                    \`${client.db.prefix}status <on/off>\` › *Enable or disable the status*
                    \`${client.db.prefix}status emoji [emoji]\` › *Set an emoji to your status*

                    \`${client.db.prefix}status content [text]\` › *Set a text in your status*
                    \`${client.db.prefix}status type <type>\` › *Edit the type of your status*

                    \`${client.db.prefix}spotify\` › *Spotify rich presence*
                    \`${client.db.prefix}setgame\` › *Games rich presence*`.replaceAll('  ', '')
                ));

            case "emoji":
                if (!args[1]) {
                    message.edit(client.language("*L'emoji a été supprimé du status.*", "*The emoji has been deleted.*"))
                    client.db.custom.emoji = null;

                    client.save();
                    client.multiRPC();
                }
                else {
                    const emoji = Util.parseEmoji(args[1]);

                    if (/\p{Extended_Pictographic}/ug.test(emoji.name) || emoji.id) 
                        client.db.custom.emoji = { animated: emoji.animated, name: emoji.name, id: emoji.id };

                    client.save()
                    client.multiRPC();
                    message.edit(client.language("*L'emoji a été modifié*", ".*The emoji has been updated*"))
                }
                break

            case "content":
                if (!args[1]) {
                    message.edit(client.language("*Le texte a été supprimé du status.*", "*The text of the state has been deleted.*"))
                    client.db.custom.state = null

                    client.save();
                    client.multiRPC();
                }
                else {
                    message.edit(client.language("*Le texte a été modifié.*", "*The text has been updated.*"));
                    client.db.custom.state = args.slice(1).join(' ');
                    
                    client.save();
                    client.multiRPC();
                }
                break

            case "type":
                if (!types.includes(args[1]))
                    return message.edit(client.language(
                        `*Veuillez entrer l'un de ses types de status: ${types.map((t,i)=>`\`${t}\``).join(', ')}.*`, 
                        `*Please enter one of these status types: ${types.map((t,i)=>`\`${t}\``).join(', ')}.*`
                    ));

                client.db.custom.details = args[1] == "leave" ? null : args[1];

                client.save();
                client.multiRPC();

                message.edit(client.language(
                    `*Le type de status a été changé en \`${args[1] == "leave" ? 'rien' : args[1]}\`.*`, 
                    `*The status type has been changed to \`${args[1] == "leave" ? 'nothing' : args[1]}\`.*`
                ));
                break

            case 'on':
                message.edit(client.language('*Le custom status a été activé.*', '*The custom status has been enable.*'));
                client.db.custom.status = true;

                client.save();
                client.multiRPC();
                break;

            case 'off':
                message.edit(client.language('*Le custom status a été désactivé.*', '*The custom status has been disable.*'));
                client.db.custom.status = false;

                client.save();
                client.multiRPC();
                break;
        }
    }
}