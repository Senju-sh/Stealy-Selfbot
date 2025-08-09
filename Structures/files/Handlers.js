const fs = require("node:fs");
const Selfbot = require("legend.js");

function	loadCommands(client, dir) 
{
	client.commands = new Selfbot.Collection();
	fs.readdirSync(dir).forEach((dirs) => 
	{
		const commands = fs
			.readdirSync(`${dir}/${dirs}/`)
			.filter((files) => files.endsWith(".js"));

		for (const file of commands) {
			const getFileName = require(`../../${dir}/${dirs}/${file}`);
			client.commands.set(getFileName.name, getFileName);
		}
	});
}

function	loadEvents(client, dir)
{
  	fs.readdirSync(dir).forEach((dirs) =>
	{
		const events = fs
			.readdirSync(`${dir}/${dirs}`)
			.filter((files) => files.endsWith(".js"));

		for (const event of events)
		{
			const evt = require(`../../${dir}/${dirs}/${event}`);
			if (evt.developer && !client.config['developer']) continue;

			else if (evt.once) 
				client.once(evt.name, (...args) => evt.run(...args, client));
			else if (evt.ws)
				client.ws.on(evt.name, (...args) => evt.run(...args, client));
			else
				client.on(evt.name, (...args) => evt.run(...args, client));
		}
	});
}

module.exports = { loadCommands, loadEvents };
