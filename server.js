require("dotenv").config();

const app = require('./app')
const PORT = 8080;

app.listen(PORT, () => console.log(`alive on http://localhost:${PORT}`));

// TEST ROUTES =================================
app.get("/student", (req, res) => {
  res.status(200).send({
    studentName: "Thanh",
    studentCode: "894138218",
  });
});

app.post("/student/:id", (req, res) => {
  const { id } = req.params;
  const { studentClass } = req.body;

  if (!studentClass) {
    res.status(418).send({ message: "we need a logo!" });
  }

  const student = res.send({
    studentName: `Thanh in class ${studentClass} and id ${id}`,
  });
});


// PAYMENT ROUTE =================================
const stripe = require("stripe")(
  "sk_test_51Rq53WBicnVx2gWhhsrK8wnG8gMoTyqtzLizwmMJmPjueCI0uL0Pu9F1rXjDb7TZkw6XrjW48HVh2X3TDoa1oqPI00L5CLUHoe"
);

app.get("/", (req, res) => {
  res.send("Hi This is the stripe docs example code sandbox");
});

app.post("/api-hp/v1/payment-sheet", async (req, res) => {
  // Use an existing Customer ID if this is a returning customer.
  const customer = await stripe.customers.create();
  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: customer.id },
    { apiVersion: "2025-06-30.basil" }
  );
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1000000,
    currency: "vnd",
    customer: customer.id,
    payment_method_types: ["card"],
  });

  res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    publishableKey:
      "pk_test_51Rq53WBicnVx2gWhMY4bb0mL68mI4Yti7DSRuKCCv1MXpXYQd2FeeECOoD1K93pDhYv8pCFYagOgDuswitUMGvAD003QzxoA9O",
  });
});


