const axios  = require('axios');
const Discord = require('discord.js')

const url = 'https://pokeapi.co/api/v2/pokemon/'


module.exports = {
	name: 'find',
	guildOnly: 'true',
	usage: 'find',
	aliases: ['f'],
	description: 'Find a random wild pokemon',
	cooldown: 60,
	execute(message, args) {
    const rndIV = Math.round(Math.random() * (31 - 1) + 1);
    var pokeCount = 898
    const rndPoke = Math.round(Math.random() * (pokeCount - 1) + 1);
    axios.get(url + rndPoke).then(res => {
      const pokemon = res.data;
      const pokemonEmbed = new Discord.MessageEmbed()
      .setAuthor(message.author.username, message.author.avatarURL())
	    .setColor('#fa8cad')
	    .setTimestamp()
      .setDescription(`A wild ${pokemon.name} appeared!`)
      .setThumbnail(pokemon.sprites.front_default)
      .addFields(
		  { name: 'IV', value: rndIV, inline: true },
		  { name: 'LVL', value: 'Some value here', inline: true },
		  { name: 'Types', value: pokemon.types.map(types => `${types.type.name}`), inline: true })
      //.setImage('https://media.giphy.com/media/j2xgBIuAgmrpS/giphy.gif')

      return message.channel.send(pokemonEmbed)
    })
    .catch(error => {
      console.log(error);
    })
	},
};