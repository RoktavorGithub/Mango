const { ApplicationCommandOptionType } = require('discord.js');
const { ChatInputCommand } = require('../../classes/Commands');
const { translate } = require("@vitalets/google-translate-api");
const logger = require('@mirasaki/logger');

module.exports = new ChatInputCommand({
    data: { 
        description: "Translate your message to any language!",
        options: [
            {
                name: "text",
                description: "The text you want to translate!",
                type: ApplicationCommandOptionType.String,
                required: true
            },
            {
                name: "language",
                description: "The language you want your text to be translated!",
                type: ApplicationCommandOptionType.String,
                required: true,
                choices: [
                    {
                        name: "English",
                        value: "en",
                    },
                    {
                        name: "Spanish",
                        value: "es",
                    },
                    {
                        name: "Chinese (Simplified)",
                        value: "zh-CN",
                    },
                    {
                        name: "Hindi",
                        value: "hi",
                    },
                    {
                        name: "Arabic",
                        value: "ar",
                    },
                    {
                        name: "Portuguese",
                        value: "pt",
                    },
                    {
                        name: "Bengali",
                        value: "bn",
                    },
                    {
                        name: "Russian",
                        value: "ru",
                    },
                    {
                        name: "Japanese",
                        value: "ja",
                    },
                    {
                        name: "German",
                        value: "de",
                    },
                    {
                        name: "French",
                        value: "fr",
                    },
                    {
                        name: "Urdu",
                        value: "ur",
                    },
                    {
                        name: "Italian",
                        value: "it",
                    },
                    {
                        name: "Indonesian",
                        value: "id",
                    },
                    {
                        name: "Vietnamese",
                        value: "vi",
                    },
                    {
                        name: "Turkish",
                        value: "tr",
                    },
                    {
                        name: "Polish",
                        value: "pl",
                    },
                    {
                        name: "Ukrainian",
                        value: "uk",
                    },
                    {
                        name: "Dutch",
                        value: "nl",
                    },
                    {
                        name: "Thai",
                        value: "th",
                    },
                    {
                        name: "Korean",
                        value: "ko",
                    },
                    {
                        name: "Filipino",
                        value: "tl",
                    },
                    {
                        name: "Persian",
                        value: "fa",
                    },
                    {
                        name: "Swedish",
                        value: "sv",
                    },
                    {
                        name: "Romanian",
                        value: "ro",
                    },
                ]
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
    const languageNames = {
        'en': 'English',
        'es': 'Spanish',
        'zh-CN': 'Chinese (Simplified)',
        'hi': 'Hindi',
        'ar': 'Arabic',
        'pt': 'Portuguese',
        'bn': 'Bengali',
        'ru': 'Russian',
        'ja': 'Japanese',
        'de': 'German',
        'fr': 'French',
        'ur': 'Urdu',
        'it': 'Italian',
        'id': 'Indonesian',
        'vi': 'Vietnamese',
        'tr': 'Turkish',
        'pl': 'Polish',
        'uk': 'Ukrainian',
        'nl': 'Dutch',
        'th': 'Thai',
        'ko': 'Korean',
        'tl': 'Filipino',
        'fa': 'Persian',
        'sv': 'Swedish',
        'ro': 'Romanian'
    };
    

    const text = options.getString("text");
    const language = options.getString("language");

    if (!languageNames[language]) {
        await interaction.editReply({
            content: `${ emojis.error } Invalid language code! Please provide a valid language code. e.g. \`es\` for spanish.`
        });
        return;
    };

    try {
        const result = await translate(text, {
            to: language
        });

        const targetLanguageName = languageNames[language];
        await interaction.editReply({
            content: `${ emojis.success } Text sucessfully translated!\nOriginal Text: **${text}**\nTranslated to **${targetLanguageName}**: **${result.text}**`
        });
    } catch (error) {
        logger.syserr("Error translating text:");
        console.log(error);
        await interaction.editReply({
            content: `${ emojis.error } An error occurred while translating the text.`
        });
    };
  }
});