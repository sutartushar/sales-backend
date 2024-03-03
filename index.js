const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const port = 3000;
app.use(express.json());
app.use(cors());
const transactionRoute = require("./routes/transaction.routes");

mongoose
  .connect(
    `mongodb+srv://sutartushar:9kfYQCW2apNzAZvr@cluster0.vggkdb8.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => console.log(`connected with DB :)`))
  .catch((error) => console.log(`connection failed${error}`));

app.use("/api", transactionRoute);

app.listen(port, () => {
  console.log(`Server app listening on port ${port}`);
});
