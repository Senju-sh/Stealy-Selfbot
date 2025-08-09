module.exports = {
  name: "thot",
  run: async (client, message, args) => {
        const Zgeg = message.mentions.users.first() || client.users.get(args[0]) || message.author
        message.edit(client.language(`*Le pourcentage de saloperie de ${Zgeg} : \`${Math.floor(Math.random() * 100) + 1}%\`*`, `*The percentage of dirt from ${Zgeg} : \`${Math.floor(Math.random() * 100) + 1}%\`*`))
    }
}