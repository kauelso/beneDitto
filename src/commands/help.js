const { prefix, standardCd} = require('../config.json');

module.exports = {
    name: 'help',
	description: 'List of my commands or more info about a specific command.',
	aliases: ['help','commands'],
    usage: 'help',
    execute(message,args){
        const data = [];
        const { commands } = message.client;
        if(!args.length) {
            data.push('**Here\'s a list of all my commands:**');
            data.push(commands.map(command => `\`${prefix}${command.name}\`: ${command.description}`).join('\n'));
            data.push(`\nYou can send \`${prefix}help [command name]\` to get more info on a specific command!`);

            return message.author.send(data, { split: true })
	        .then(() => {
		    if (message.channel.type === 'dm') return;
		    message.reply('I\'ve sent you a DM with all my commands!');
	        })
	        .catch(error => {
		    console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
		    message.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
	        });
         }
        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
	    return message.reply('that\'s not a valid command!');
        }

        data.push(`**Info about ${command.name} command:**\n`)
        data.push(`**Name:** ${command.name}`);
        if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
        if (command.description) data.push(`**Description:** ${command.description}`);
        if (command.usage) data.push(`**Usage:** ${prefix}${command.usage}`);
        if (command.guildOnly) data.push(`**GuildOnly:** ${command.guildOnly}`);
        if (command.permissions) data.push(`**Permissions:** ${command.permissions}`);

        data.push(`**Cooldown:** ${command.cooldown || standardCd} second(s)`);

        message.channel.send(data, { split: true });
    }
}