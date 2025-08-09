const { Client, Message } = require("legend.js")

module.exports = {
    name: "bigreact",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        try{
            const channelMessages = await message.channel.fetchMessage(args[0] || 0).catch(() => false);
            
            if (!args[0] || !channelMessages) 
                return message.edit(client.language(
                    `*Veuillez préciser une ID de message.*`,
                    `*Please specify a message ID.*`
                ))

            const letters = transformText(args.slice(1).join(' '))
            for (const lettre of letters)
                channelMessages.react(lettre).catch(() => false)
        }
        catch {
            message.edit(client.language(`*Aucun message de trouvé pour \`${args[0]}\`*`, `*No message found for \`${args[0]}\`*`))
        }
    }
}
  
function transformText(text) {
    const map = {
        'a': '🅰️', 'b': '🅱️', 'c': '🇨', 'd': '🇩', 'e': '🇪', 'f': '🇫', 'g': '🇬', 'h': '🇭', 'i': '🇮',
        'j': '🇯', 'k': '🇰', 'l': '🇱', 'm': '🇲', 'n': '🇳', 'o': '🇴', 'p': '🇵', 'q': '🇶', 'r': '🇷',
        's': '🇸', 't': '🇹', 'u': '🇺', 'v': '🇻', 'w': '🇼', 'x': '🇽', 'y': '🇾', 'z': '🇿', '0': '0️⃣',
        '1': '1️⃣', '2': '2️⃣', '3': '3️⃣', '4': '4️⃣', '5': '5️⃣', '6': '6️⃣', '7': '7️⃣', '8': '8️⃣',
        '9': '9️⃣', '$': '💲', '+': '➕', '-': '➖', '?': '❓', '!': '❗', '#': '#️⃣', '*': '*️⃣', '¡': 'ℹ'
    };
        const transformed = [];
    for (let i = 0; i < text.split('').length; i++) {
        if (map[text[i].toLowerCase()]) {
            transformed.push(map[text[i].toLowerCase()]);
        } else {
            transformed.push(text[i]);
        }
    }
    return transformed.join('');
}