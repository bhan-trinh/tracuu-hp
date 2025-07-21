require("dotenv").config();

const app = require('./app')
const PORT = 8080;

app.listen(PORT, () => console.log(`alive on http://localhost:${PORT}`));
