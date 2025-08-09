module.exports = {
    name: "viplist",
    owner: true,
    run: async (client, message, args) => {
        message.edit(`***__› Stealy - VIP LIST__*** <a:star:1345073135095123978>
            
${client.commands.filter(cmd => cmd.premium).map(cmd => `\`${client.db.prefix}${cmd.name}\``).join(", ")}`)
    }
}