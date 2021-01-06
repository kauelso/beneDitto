module.exports = {
	name: 'ping',
	guildOnly: 'true',
	usage: '!ping',
	cooldown: 5,
	description: 'Ping!',
	execute(message, args) {
		message.channel.send('Pong.');
	},
};