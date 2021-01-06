const Discord = require('discord.js')
const {prefix, token} = require('./config.json')
const fs = require('fs');

// create a new Discord client
const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const cooldowns = new Discord.Collection();

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready',() => {
    console.log("ready!");
});

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	//Command message args
	const args = message.content.slice(prefix.length).trim().split(/ +/);
	//Command name
	const commandName = args.shift().toLowerCase();
	//Check if command name exists
	if (!client.commands.has(commandName)) return;
	//Get the command from the collection
	const command = client.commands.get(commandName);
	//Check if command is guildOnly
	if (command.guildOnly && message.channel.type === 'dm') {
		return message.reply('I can\'t execute that command inside DMs!');
	}
	//Check command args
	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}
		
		return message.channel.send(reply);
	}
	//Check if command have any cooldown
	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}
	
	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 10) * 1000;
	console.log(timestamps)
	
	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
	}
		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	}

	//Execute command
	try {
		command.execute(message, args);
	} //Catch errors in command execution
	catch (error) {
		console.error(error);
		message.reply('Something went wrong with your command!');
	}
});

// login to Discord with your app's token
client.login(token);

