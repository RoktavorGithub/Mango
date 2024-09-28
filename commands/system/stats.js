const { ChatInputCommand } = require('../../classes/Commands');
const { stripIndents } = require('common-tags');
const { version } = require('discord.js');
const { BYTES_IN_KIB } = require('../../constants');
const { colorResolver, msToHumanReadableTime } = require('../../util');

const discordVersion = version.indexOf('dev') < 0 ? version : version.slice(0, version.indexOf('dev') + 3);
const discordVersionDocLink = `https://discord.js.org/#/docs/discord.js/v${ discordVersion.split('.')[0] }/general/welcome`;
const nodeVersionDocLink = `https://nodejs.org/docs/latest-${ process.version.split('.')[0] }.x/api/#`;

module.exports = new ChatInputCommand({
  global: true,
  cooldown: {
    // Use channel cooldown type instead of default member
    type: 'channel',
    usages: 1,
    duration: 30
  },
  clientPerms: [ 'EmbedLinks' ],
  alias: [ 'ping' ],
  data: { description: 'Displays bot stats!' },

  run: async (client, interaction) => {
    const { emojis } = client.container;

    // Calculating our API latency
    const latency = Math.round(client.ws.ping);
    const sent = await interaction.reply({
      content: 'Pinging...',
      fetchReply: true
    });
    const fcLatency = sent.createdTimestamp - interaction.createdTimestamp;

    // Utility function for getting appropriate status emojis
    const getMsEmoji = (ms) => {
      let emoji = undefined;

      for (const [ key, value ] of Object.entries({
        250: '🟢',
        500: '🟡',
        1000: '🟠'
      })) if (ms <= key) {
        emoji = value;
        break;
      }
      return (emoji ??= '🔴');
    };

    // Memory Variables
    const memoryUsage = process.memoryUsage();
    const memoryUsedInMB = memoryUsage.heapUsed / BYTES_IN_KIB / BYTES_IN_KIB;
    const memoryAvailableInMB = memoryUsage.heapTotal
      / BYTES_IN_KIB / BYTES_IN_KIB;
    const objCacheSizeInMB = memoryUsage.external / BYTES_IN_KIB / BYTES_IN_KIB;

    // Replying to the interaction with our embed data
    interaction.editReply({
      content: '\u200b',
      embeds: [
        {
          color: colorResolver(),
          author: {
            name: `${ client.user.username }`,
            iconURL: client.user.displayAvatarURL()
          },
          fields: [
            {
              name: 'Latency',
              value: stripIndents`
                ${ getMsEmoji(latency) } **API Latency:** ${ latency } ms
                ${ getMsEmoji(fcLatency) } **Full Circle Latency:** ${ fcLatency } ms
              `,
              inline: true
            },
            {
              name: 'Memory',
              value: stripIndents`
                💾 **Memory Usage:** ${ memoryUsedInMB.toFixed(2) }/${ memoryAvailableInMB.toFixed(2) } MB 
                ♻️ **Cache Size:** ${ objCacheSizeInMB.toFixed(2) } MB
              `,
              inline: true
            },
            {
              name: 'Uptime',
              value: stripIndents`**📊 I've been online for ${ msToHumanReadableTime(Date.now() - client.readyTimestamp) }**`,
              inline: false
            },
            {
              name: 'System',
              value: stripIndents`
                ⚙️ **Discord.js Version:** [v${ discordVersion }](${ discordVersionDocLink })
                ⚙️ **Node Version:** [${ process.version }](${ nodeVersionDocLink })
              `,
              inline: true
            },
            {
              name: 'Stats',
              value: stripIndents`
                👪 **Servers:** ${ client.guilds.cache.size.toLocaleString('en-US') }
                🙋 **Users:** ${ client.guilds.cache.reduce((previousValue, currentValue) => previousValue += currentValue.memberCount, 0).toLocaleString('en-US') }
              `,
              inline: true
            }
          ],
          footer: { text: `Made by juices ${ emojis.separator } Brought to you by Manguard 🥭` }
        }
      ]
    });
  }
});
