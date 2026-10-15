const { moveToPaidReceipt } = require("../../models/payment");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.getPaymentParams = async (req, res) => {
  const { receiptId, amount } = req.body;
  const userId = req.user.userId
  console.log(`PAYMENT PARAMS: Receipt ${receiptId} User ${userId}`)
  // Use an existing Customer ID if this is a returning customer.
  const customer = await stripe.customers.create();
  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: customer.id },
    { apiVersion: "2025-06-30.basil" }
  );
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "vnd",
    customer: customer.id,
    description: `${receiptId} ${userId}`,
    payment_method_types: ["card"],
  });

  res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    publishableKey: process.env.STRIPE_PUBLIC_KEY,
  });
};

exports.notifyPayment = async (req, res) => {
  const { receiptId } = req.body;
  const userId = req.user.userId
  try {
    await moveToPaidReceipt(receiptId, userId);
  } catch (err) {
    res.status(404).json(err);
  }
  res.status(200).json('Payment update successful')
}

exports.webhook = async (req, res) => {
  const endpointSecret = process.env.STRIPE_SECRET_WEBHOOK
  const event = req.body;
  if (endpointSecret) {
    // Get the signature sent by Stripe
    const signature = req.headers['stripe-signature'];
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        endpointSecret
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return res.sendStatus(400);
    }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      // Then define and call a method to handle the successful payment intent.
      // handlePaymentIntentSucceeded(paymentIntent);
        const desc = paymentIntent.description.split(" ")
        const receiptId = desc[0]
        const userId = desc[1]
        console.log(`PAYMENT SUCCEEDED: Receipt ${receiptId} User ${userId}`)
        try {
          await moveToPaidReceipt(receiptId, userId);
        } catch (err) {
          res.status(404).json(err);
        }
        res.status(200).json('Payment update successful')
      break;
    case 'payment_method.attached':
      const paymentMethod = event.data.object;
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      // handlePaymentMethodAttached(paymentMethod);
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a res to acknowledge receipt of the event
  res.json({received: true});
}
};
