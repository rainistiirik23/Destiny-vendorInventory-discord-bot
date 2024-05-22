const axios = require("axios");
async function checkForWishListedItem(client) {
  const guild = await client.guilds.fetch("1236068127897288754");
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
}
module.exports = checkForWishListedItem;
