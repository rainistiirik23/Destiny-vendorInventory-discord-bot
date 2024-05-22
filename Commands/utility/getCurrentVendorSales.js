const axios = require("axios");
async function getAllVendorSales(interaction, commandName) {
  if (commandName === "vendorsales") {
    const request = await axios.get("https://localhost:8000/api/currentVendorSales");
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
}
module.exports = getAllVendorSales;
