const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/create-payment-intent', async (req, res) => {
  const { amount, phone } = req.body;

  console.log("✅ Received amount:", amount);
  console.log("📞 User phone:", phone);

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // in cents
      currency: 'usd', // or 'inr'
      payment_method_types: ['card'],
      metadata: {
        userPhone: phone || 'Not provided',
      },
    });

    console.log("✅ ClientSecret sent:", paymentIntent.client_secret);

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.error("❌ Stripe Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
