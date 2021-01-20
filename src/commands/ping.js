module.exports = {
	name: 'ping',
	guildOnly: 'true',
	usage: 'ping',
	aliases: ['pg'],
	permissions: "ADMINISTRATOR",
	description: 'Let\'s Ping, Pong!',
	cooldown: 5,
	execute(message, args) {
		message.channel.send('Pong.');
	},
};