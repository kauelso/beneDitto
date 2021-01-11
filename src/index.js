const Discord = require('discord.js')
const {prefix, token, standardCd} = require('./config.json')
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
	//Get the command from the collection
	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	//Check if command exists
	if (!command) return;
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
	
	const now = Date.now(); //Get the current time
	const timestamps = cooldowns.get(command.name);//Get the collection of the command used
	const cooldownAmount = (command.cooldown || standardCd) * 1000;//Get the cooldown of the command
	
	if (timestamps.has(message.author.id)) {//Check if the message author is on cooldown
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;//Check the expiration time of the command

		if (now < expirationTime) {//If its in cooldown yet then send the time left
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${prefix}${command.name}\` command again.`);
		}
	}

	timestamps.set(message.author.id, now);//Set author on the command collection
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);//Delete the author from collection when cooldown ends

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

