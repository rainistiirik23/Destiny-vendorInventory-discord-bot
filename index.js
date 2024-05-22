// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits } = require("discord.js");
const checkForWishListedItem = require("./Utils/checkForWishListedItems");
const getCurrentVendorSales = require("./Commands/utility/getCurrentVendorSales");
const { Token } = require("./Config/config.json");
// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });
// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, async (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
  await checkForWishListedItem(client);
});
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;
  const { commandName } = interaction;
  await getCurrentVendorSales(interaction, commandName);
});
// Log in to Discord with your client's token
client.login(Token);
