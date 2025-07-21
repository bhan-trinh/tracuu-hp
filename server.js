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
