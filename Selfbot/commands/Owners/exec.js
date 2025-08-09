const { exec } = require('node:child_process');
const { Client, Message } = require("legend.js");

module.exports = {
    name: "exec",
    developer: true,
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */    
    run: async (client, message, args) => {
        if (!args[0]) return message.edit("***Veuillez entrer un code valide***");

        exec(args.join(" "), async (error, stdout, stderr) => {
            if (stdout) {
                let output = `\`\`\`bash\n${stdout}\`\`\``;
                if (stdout.length > 1024) return client.send(message, stdout);
                message.edit(`📥 INPUT\n\`\`\`bash\n${args.join(" ")}\`\`\`\n\n📤OUPUT\n${output}`);
            } 
            
            else if (stderr) {
                let error = `\`\`\`bash\n${stderr}\`\`\``;
                if (stderr.length > 1024) return client.send(message, stderr);
                message.edit(`📥 INPUT\n\`\`\`bash\n${args.join(" ")}\`\`\`\n\n⛔ERROR\n${error}`);
            }

            else 
              return message.edit(`📥 INPUT\n\`\`\`bash\n${args.join(' ')}\`\`\`\n\n📤OUPUT\n\`\`\`bash\n# Commande executée sans retour.\`\`\``);
        });
    },
};
