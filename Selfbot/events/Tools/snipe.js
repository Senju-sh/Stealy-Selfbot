module.exports = {
    name: "messageDelete",
    once: false,
    run: async (message, client) => {
        if (!message.author) return
        if (message.author.id === client.user.id)
            client.db.messages_deleted++
        

        if (message.content?.includes(`<@${client.user.id}>`) || message.content?.includes(`<@!${client.user.id}>`)){
            if (!client.ment.get(message.channel.id)) client.ment.set(message.channel.id, [])
            if (client.ment.get(message.channel.id).length > 5) client.ment.get(message.channel.id).splice(5, 1)
        
            client.ment.get(message.channel.id).push({
                content: message.content ?? client.language(`\`Aucun message.\``, `\`No message.\``),
                author: message.author,
                images: message.attachments.size > 0 ? message.attachments.first().url : null,
                date: Date.now()
            })
        }

        if (!client.snipes.get(message.channel.id)) client.snipes.set(message.channel.id, [])
        if (client.snipes.get(message.channel.id).length > 5) client.snipes.get(message.channel.id).splice(5, 1)

        client.snipes.get(message.channel.id).push({
            content: message.content ?? client.language(`\`Aucun message.\``, `\`No message.\``),
            author: message.author,
            images: message.attachments.size > 0 ? message.attachments.first().url : null,
            date: Date.now()
        })
    }
}