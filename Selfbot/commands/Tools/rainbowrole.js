const RCLR = ["FF0D00","FF3D00","FF4F00","FF5F00","FF6C00","FF7800","FF8300","FF8C00","FF9500","FF9E00","FFA500","FFAD00","FFB400","FFBB00","FFC200","FFC900","FFCF00","FFD600","FFDD00","FFE400","FFEB00","FFF200","FFFA00","F7FE00","E5FB00","D5F800","C6F500","B7F200","A8F000","98ED00","87EA00","74E600","5DE100","41DB00","1DD300","00C618","00BB3F","00B358","00AC6B","00A67C","009E8E","028E9B","06799F","0969A2","0C5DA5","0E51A7","1047A9","133CAC","1531AE","1924B1","1F1AB2","2A17B1","3415B0","3C13AF","4512AE","4E10AE","560EAD","600CAC","6A0AAB","7608AA","8506A9","9702A7","AD009F","BC008D","C7007D","D0006E","D8005F","DF004F","E7003E","EF002A","F80012"]
const { Client, Message } = require("legend.js");

module.exports = {
    name: "rainbowrole",
    permission: "MANAGE_ROLES",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string} args
    */
    run: async (client, message, args) => {
        
        if (args[0] === "stop"){
            clearInterval(client.data["rainbowrole"])
            message.edit(client.language(
                "*Rainbow role arrêté", 
                "*Rainbow role stopped"
            ));
        }
        else {
            const role = message.mentions.roles.first() || message.guild.roles.get(args[0])
            if (!role) 
                return message.edit(client.language(
                    `*Aucun rôle de trouvé pour \`${args[0] || "Rien"}\`*`,
                    `*No rôles found for \`${args[0] || "Nothing"}\`*`
                ));
    
            message.edit(client.language(
                "*Rainbow role lancé.*",
                "*Rainbow Role started.*"
            ));

            if (client.data["rainbowrole"]) clearInterval(client.data["rainbowrole"]);
            client.data["rainbowrole"] = setInterval(() => {
                if (role.editable) role.edit({ color: RCLR }).catch(() => false);
            }, 1000 * 60 * 3);
        }
    }
}