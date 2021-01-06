module.exports = {
	name: 'ping',
	guildOnly: 'true',
	usage: '!ping',
	description: 'Ping!',
	execute(message, args) {
		message.channel.send('Pong.');
	},
};