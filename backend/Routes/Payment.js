const { createMollieClient } = require('@mollie/api-client');

const express = require("express");
const router = express.Router();


const mollieClient = createMollieClient({ apiKey: 'test_nhm9Tht5wjvAGeMhmaebMavcTqKK2b' });

router.post("/", async function (req, res) {
  console.log('ok')

  //TODO: in req kijken welke listings?
  // prijs ophalen uit database

  const priceTotal = '1.00' // moet een string uiteindelijk worden.

// nieuwe bestelling maken in de database.

// haal de bestelling id op
const bestellingID = 1

  
  const payment = await mollieClient.payments.create({
    amount: {
      currency: 'EUR',
      value:    priceTotal,

    },
    description: `Bestelling ${bestellingID}`,
    redirectUrl:`http://localhost:3000/order/${bestellingID}`,
    // webhookUrl: 'http://localhost:3000/webhook'
  });

  const url =  payment.getPaymentUrl()

  return res.status(200).json(url)

});


module.exports = router;