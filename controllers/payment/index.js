const { moveToPaidReceipt } = require("../../models/payment");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.getPaymentParams = async (req, res) => {
  const { amount } = req.body;
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
  const { receiptId } = req.params;
  const userId = req.user.userId
  try {
    await moveToPaidReceipt(receiptId, userId);
  } catch (err) {
    res.status(404).json(err);
  }
  res.status(200).json('Payment update successful')
};
