const { ApexChat } = require("apexify.js");
const { ChatInputCommand } = require('../../classes/Commands');
const { ApplicationCommandOptionType } = require("discord.js");
const { MESSAGE_CONTENT_MAX_LENGTH } = require("../../constants");
const logger = require("@mirasaki/logger");

module.exports = new ChatInputCommand({
    global: true,
    data: { 
    description: "Ask me a question about anything!",
    options: [
        {
            name: "question",
            description: "The question you would like me to answer?",
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
},
  run: async (client, interaction) => {
    const {
        emojis
    } = client.container;
    const question = interaction.options.getString("question");
    const userId = interaction.user.id;

    await interaction.deferReply();

    try {
       const response = await ApexChat("v3-32k", question, {
        userId: userId,
        memory: true
       });
    
            if (response.length <= MESSAGE_CONTENT_MAX_LENGTH) {
                await interaction.editReply(response);
            } else {
                const chunks = response.match(new RegExp(`.{1,${MESSAGE_CONTENT_MAX_LENGTH}}`, "g"));
                await interaction.editReply(chunks[0]);
                for (let i = 1; i < chunks.length; i++) {
                    await interaction.followUp(chunks[i]);
                };
            };
    } catch (error) {
        logger.syserr("Error in AI response generation:");
        console.log(error);
        await interaction.editReply(`${ emojis.error } Sorry, I couldn't generate a response. Please try again later.`);
    };
  }
});