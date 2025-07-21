
app.get("/getBill", async (req, res) => {
  // Create transaction time
  const curTime = new Date();
  const datetime = `${curTime.getFullYear()}${padDate(curTime.getMonth() + 1)}${padDate(curTime.getDay())}${padDate(curTime.getHours())}${padDate(curTime.getMinutes())}${padDate(curTime.getSeconds())}`;

  // Create transaction id
  var id = Date.now() + Math.floor(Math.random() * 100);

  // Tape the values together
  var body = {
    ACTION: process.env.ACTION,
    VERSION: process.env.VERSION,
    PARTNER_ID: process.env.PARTNER_ID,
    SERVICE_ID: process.env.SERVICE_ID,
    SERVICE_PROVIDER_ID: process.env.SERVICE_PROVIDER_ID,
    CHANNEL_ID: process.env.CHANNEL_ID,
    PAYMENT_CODE: process.env.PAYMENT_CODE,
    TRANS_DATE_TIME: datetime,
    TRANS_REQUEST_ID: id.toString(),
    ADDITION_INFO: process.env.ADDITION_INFO,
  };
  var tapedValues = [...Object.values(body), [process.env.PRIVATE_KEY]].join(
    "|"
  );

  // Encode them and use as secure code
  var secureCode = hash(tapedValues);
  body.SECURE_CODE = secureCode;

  const response = await fetch(
    "https://sandboxpay.vnptmedia.vn/rest/collection/v2.0.0/get_bill",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  const json = await response.json();
  console.log(json);
  res.send(json)
});

function hash(string) {
  return createHash("sha256").update(string).digest("hex");
}

function padDate(number) {
  return number.toString().padStart(2, "0")
}


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
