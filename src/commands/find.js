const https  = require('https');

const options = {
    hostname: 'pokeapi.co',
    path: '/api/v2/pokemon/1',
    method: 'GET'
  }

module.exports = {
	name: 'find',
	guildOnly: 'true',
	usage: 'find <generation>',
	aliases: ['f'],
	description: 'Find a pokemon on specified generation or in all generations if no argument is passed',
	cooldown: 60,
	execute(message, args) {
        const req = https.request({
            hostname: 'pokeapi.co',
            path: '/api/v2/pokemon/1',
            method: 'GET'
          }, res => {
            console.log(`statusCode: ${res.statusCode}`)
          
            res.on('data', d => {
                console.log(d.id)
            })
          })
          
          req.on('error', error => {
            console.error(error)
          })
          
          req.end()

		//message.channel.send(`A wild ${pokemon.name} appears!`);
	},
};