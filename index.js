import express from "express";
import mongoose from "mongoose";
import tournaments from "./tournaments";

const app = express();
const mongoDB = "mongodb://admin:admin@ds019856.mlab.com:19856/niello";
// const mongoDB = 'mongodb://admin:admin@ds213199.mlab.com:13199/dev';
const db = mongoose.connection;

app.set("port", process.env.PORT || 7268);
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.route("/").get((req, res) => {
  res.json({
    success: true,
    message: `welcome to bacon's backend`
  });
});

app.use("/tournaments", tournaments);

app.listen(app.get("port"));
console.log(`bacon up on port ${app.get("port")}`);
export default app;
