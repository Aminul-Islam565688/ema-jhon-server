const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = 10000;

//.env file
require("dotenv").config();
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;

//MongoDB
const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb+srv://${user}:${password}@cluster0.aifw0.mongodb.net/emaJhonStore?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  const productsCollection = client.db("emaJhonStore").collection("Products");
  const ordersCollection = client.db("emaJhonStore").collection("Orders");

  //adding product data from fakedata to mongodb
  app.post("/addProduct", (req, res) => {
    const products = req.body;
    console.log(products);
    productsCollection.insertOne(products).then((result) => {
      res.send(result.insertedCount);
    });
  });

  //getting data from mongodb and load data at the place of fakedata
  app.get("/products", (req, res) => {
    productsCollection
      .find({})
      // .limit(10)
      .toArray((err, documents) => {
        res.send(documents);
      });
  });

  //showing details from mongodb isntead of fakedata
  app.get("/product/:key", (req, res) => {
    productsCollection
      .find({ key: req.params.key })
      .toArray((err, documents) => {
        res.send(documents[0]);
      });
  });

  //Review Products by key

  app.post("/productsByKeys", (req, res) => {
    const productKeys = req.body;
    console.log(productKeys);
    productsCollection
      .find({ key: { $in: productKeys } })
      .toArray((err, documents) => {
        res.send(documents);
        console.log(documents);
      });
  });

  //Order Data store in mongodb

  app.post("/addOrder", (req, res) => {
    const oreders = req.body;
    ordersCollection.insertOne(oreders).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  console.log("Database Connected");
});

app.get("/", (req, res) => {
  res.send("Assalamu Walaikum");
});

app.listen(process.env.PORT || port);
