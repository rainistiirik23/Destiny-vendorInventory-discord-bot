// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits } = require("discord.js");

const { Token } = require("./Config/config.json");
const axios = require("axios");
// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, async (readyClient) => {
  const guild = await client.guilds.fetch("1236068127897288754");
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
  /* console.log(client.channels.cache.get("1236068127897288757").send("Hello there")); */
  /* console.log(client.users.cache.get()); */
  const usersList = (await guild.members.fetch()).filter((member) => member.user.bot != true);
  /* console.log(usersList); */
  const response = await axios.post("https://localhost:8000/api/checkForWishListedItem", { data: { usersList } });
  /* console.log(response.data); */
  const channnel = client.channels.cache.get("1236068127897288757");

  const userKeys = Object.keys(response.data);
  userKeys.forEach((userKey) => {
    const user = usersList.find((user) => {
      return user.id === userKey;
    }).user;
    const strings = [];
    /*  console.log(response.data); */
    response.data[userKey].forEach((item) => {
      strings.push(`\n${item.itemName}`);
      const perksAsJson = JSON.parse(item.perks);
      const perkColumnKeys = Object.keys(perksAsJson);
      for (let i = 0; i < perkColumnKeys.length; i++) {
        strings.push(`\nPerk column ${i + 1}`);
        perksAsJson[perkColumnKeys[i]].forEach((perk, perkIndex) => {
          if (perkIndex === 0) {
            strings.push(`\n\t\v${perk.perkName}`);
            return;
          }
          strings.push(`  \v${perk.perkName}`);
        });
      }
    });
    const channelMessage = `Hello ${user.username}, following items you have wihlisted are for sale at Banshee`.concat(
      ...strings
    );
    channnel.send(channelMessage);
  });
  /*  setInterval(() => {
  }, 7000); */
});
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;
  const { commandName } = interaction;
  if (commandName === "vendorsales") {
    const request = await axios.get("https://localhost:8000/api/allVendorSales");
    const message = [];
    request.data.currentVendorSales.forEach((vendorSale) => {
      message.push(vendorSale.itemName);
      const perksAsJson = JSON.parse(vendorSale.perks);
      const perkColumnKeys = Object.keys(perksAsJson);
      for (let i = 0; i < perkColumnKeys.length; i++) {
        message.push(perkColumnKeys[i]);
        perksAsJson[perkColumnKeys[i]].forEach((perk) => {
          message.push(perk.perkName);
        });
      }
    });
    console.log(request.data.currentVendorSales);
    interaction.reply("Banshee is selling".concat(...message));
  }
});
// Log in to Discord with your client's token
client.login(Token);
