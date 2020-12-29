import Discord from 'discord.js'
import config from './config.json'

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
client.login(config.token);

