const { ApplicationCommandOptionType, AttachmentBuilder } = require('discord.js');
const { ChatInputCommand } = require('../../classes/Commands');
const { ApexImagine } = require("apexify.js");
const logger = require('@mirasaki/logger');

module.exports = new ChatInputCommand({
    global: true,
    data: {
        description: "Creates an image based on your liking!",
        options: [
            {
                name: "description",
                description: "The description of the image you want to create",
                type: ApplicationCommandOptionType.String,
                required: true
            },
            {
                name: "amount",
                description: "The amount of images you want to create",
                type: ApplicationCommandOptionType.Integer,
                required: true
            },
            {
                name: "model",
                description: "The model you want to use for image generation",
                type: ApplicationCommandOptionType.String,
                required: true,
                choices: [
                    {
                        name: "Lexica",
                        value: "lexica",
                    },
                    {
                        name: "Prodia",
                        value: "prodia",
                    },
                    {
                        name: "Animefy",
                        value: "animefy",
                    },
                    {
                        name: "Raava",
                        value: "raava",
                    },
                    {
                        name: "Simurg",
                        value: "simurg"
                    },
                    {
                        name: "Shonin",
                        value: "shonin"
                    }
                ],
            }
        ],
    },
  run: async (client, interaction) => {
    const {
        options
    } = interaction;

    const {
        emojis
    } = client.container;

    await interaction.deferReply();

    const description = options.getString("description");
    const amount = options.getInteger("amount");
    const model = options.getString("model");

    if (amount > 4 || amount < 1) return interaction.editReply({
        content: `${ emojis.error } Invalid amount. Please specify a number between 1-4.`
    });

    if (typeof amount !== "number" || isNaN(amount)) return interaction.editReply({
        content: `${ emojis.error } Invalid amount. Please specify a number between 1-4.`
    });

    try {
         if (model === "lexica") {
            const imageUrls = await ApexImagine("lexica", description, {
                count: amount
            });
    
            const attachment = imageUrls.map(url => new AttachmentBuilder(url));
    
            await interaction.editReply({
                files: attachment
            });
        } else if (model === "prodia") {
            const imageUrls = await ApexImagine("prodia", description, {
                count: amount,
                nsfw: false
            });
    
            const attachment = imageUrls.map(url => new AttachmentBuilder(url));
    
            await interaction.editReply({
                files: attachment
            });
        } else if (model === "animefy") {
            const imageUrls = await ApexImagine("animefy", description, {
                count: amount,
                nsfw: false
            });
    
            const attachment = imageUrls.map(url => new AttachmentBuilder(url));
    
            await interaction.editReply({
                files: attachment
            });
        } else if (model === "raava") {
            const imageUrls = await ApexImagine("raava", description, {
                count: amount,
                nsfw: false
            });
    
            const attachment = imageUrls.map(url => new AttachmentBuilder(url));
    
            await interaction.editReply({
                files: attachment
            });
        } else if (model === "simurg") {
            const imageUrls = await ApexImagine("simurg", description, {
                count: amount,
                nsfw: false
            });
    
            const attachment = imageUrls.map(url => new AttachmentBuilder(url));
    
            await interaction.editReply({
                files: attachment
            });
        } else if (model === "shonin") {
            const imageUrls = await ApexImagine("shonin", description, {
                count: amount,
                nsfw: false
            });
    
            const attachment = imageUrls.map(url => new AttachmentBuilder(url));
    
            await interaction.editReply({
                files: attachment
            });
        };
    } catch (error) {
        logger.syserr("Error while generating image:");
        console.log(error);
        await interaction.editReply({
            content: `${ emojis.error } An error occured while generating the image. Please try again later.`
        });
    };
  },
});