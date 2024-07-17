const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = {
  async createPaymentIntent(amount, currency = 'brl') {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
    });
    return paymentIntent;
  },
};
