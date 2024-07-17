'use strict';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::order.order', ({ strapi }) => ({
  async create(ctx) {
    const { chargeTotal, address, cartItems } = ctx.request.body.data;

    // Calculate the fee as 4% of the chargeTotal
    const feeAmount = Math.ceil(chargeTotal * 0.04);
    const totalAmount = chargeTotal * 100; // Convert to centavos

    try {
      console.log('Creating Stripe session with the following details:', {
        chargeTotal,
        address,
        cartItems,
        feeAmount,
      });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: cartItems.map(item => ({
          price_data: {
            currency: 'brl',
            product_data: {
              name: item.title,
            },
            unit_amount: parseInt(item.price) * 100, // Ensure price is in centavos (smallest unit of BRL)
          },
          quantity: item.quantity,
        })),
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/cancel`,
        customer_email: ctx.state.user.email,
        payment_intent_data: {
          application_fee_amount: feeAmount, // Set the application fee
          transfer_data: {
            destination: 'acct_1PbpIMRusYLm7uIY', // Replace with your connected account ID
          },
        },
        metadata: {
          userId: ctx.state.user.id,
          chargeTotal,
          address,
          cartItems: JSON.stringify(cartItems),
        },
      });

      console.log('Stripe session created successfully:', session.id);
      return { sessionId: session.id };
    } catch (err) {
      console.error('Error creating Stripe session:', err);
      ctx.response.status = 500;
      return { error: { message: 'There was a problem creating the session' } };
    }
  },

  async webhook(ctx) {
    const sig = ctx.request.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(ctx.request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error('Webhook error:', err.message);
      ctx.response.status = 400;
      return { error: { message: `Webhook Error: ${err.message}` } };
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      try {
        await strapi.service('api::order.order').create({
          data: {
            chargeTotal: session.metadata.chargeTotal,
            address: session.metadata.address,
            cartItems: JSON.parse(session.metadata.cartItems),
            numItemsInCart: JSON.parse(session.metadata.cartItems).length,
            user: session.metadata.userId,
            status: 'paid',
          }
        });
        console.log('Order created successfully from webhook');
      } catch (err) {
        console.error('Error creating order from webhook:', err);
      }
    }

    ctx.response.status = 200;
    return { received: true };
  }
}));
