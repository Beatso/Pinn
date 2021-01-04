const Discord = require("discord.js")
require("dotenv").config()

const client = new Discord.Client({partials:["MESSAGE","CHANNEL","REACTION"]})

client.once("ready", ()=>{
	console.log("bot running")
	client.user.setPresence({status:"dnd"})
})
client.login(process.env.bottoken)

client.on("messageReactionAdd", async (reaction, user) => {

	const message = reaction.message

	if (message.partial) await message.fetch()
	if (reaction.partial) await reaction.fetch()
	
	const clientHasReacted = emoji => message.reactions.cache.get(emoji).users.cache.has(client.user.id)
	const available = emoji => reaction.emoji.name==emoji && !clientHasReacted(emoji)

	if ( available("📌") && !message.pinned && message.pinnable ) {
		message.pin({reason: `Pinned by ${user.tag}`})
		message.react("📌")
	}
	
	else if ( available("🚫") && message.pinned && clientHasReacted("📌") ) {
		message.unpin({reason: `Unpinned by ${user.tag}`})
		message.reactions.cache.find(reaction=>reaction.emoji.name=="📌").remove()
		reaction.remove()
	}

})
