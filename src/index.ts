import Discord from 'discord.js'

// create a new Discord client
const client = new Discord.Client();

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready',() => {
    console.log("ready!");
});

client.on('message', message => {
	if (message.content === '!ping') {
        // send back "Pong." to the channel the message was sent in
        message.channel.send('Pong.');
    }
});

// login to Discord with your app's token
client.login('NzkzNTI2NDQwMTU4NTYwMjc2.X-tjFg.hmX856C2urcj3jLddZSBBDN7-Wc');

