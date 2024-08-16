
// const express = require("express");
// const cors = require("cors");
// const { MongoClient, ServerApiVersion } = require("mongodb");
// require("dotenv").config();
// const app = express();
// const port = process.env.PORT || 5000;

// // middleware
// app.use(cors());
// app.use(express.json());

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hzcboi3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

// async function run() {
//   try {
//     await client.connect();

//     const productCollection = client.db("EchoMart").collection("allproducts");


//     app.get("/allproducts", async (req, res) => {
//       const page = parseInt(req.query.page) || 0;
//       const size = parseInt(req.query.size) || 10;
//       const sort = req.query.sort === "asc" ? 1 : -1;
//       const search = req.query.search || '';
    
//       let query = {};
    
//       if (search) {
//         query = {
//           $or: [
//             { product_name: { $regex: search, $options: "i" } },
//             { Category: { $regex: search, $options: "i" } }
//           ],
//         };
//       }
    
//       const result = await productCollection
//         .find(query)
//         .sort({ Price: sort })
//         .skip(page * size)
//         .limit(size)
//         .toArray();
//       res.send(result);
//     });
    
    
//     app.get("/productCount", async (req, res) => {
//       const count = await productCollection.estimatedDocumentCount();
//       res.send({ count });
//     });

//     await client.db("admin").command({ ping: 1 });
//     console.log(
//       "Pinged your deployment. You successfully connected to MongoDB!"
//     );
//   } finally {
//     // await client.close();
//   }
// }
// run().catch(console.dir);

// app.get("/", (req, res) => {
//   res.send("echomart is running");
// });

// app.listen(port, () => {
//   console.log(`echomart is running peacefully on ${port}`);
// });

const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hzcboi3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const productCollection = client.db("EchoMart").collection("allproducts");

    app.get("/allproducts", async (req, res) => {
      const page = parseInt(req.query.page) || 0;
      const size = parseInt(req.query.size) || 10;
      const sort = req.query.sort === "asc" ? 1 : -1;
      const search = req.query.search || '';
      const brand = req.query.brand || '';
      const category = req.query.category || '';
      const priceRange = req.query.priceRange || '';

      let query = {};

      if (search) {
        query.$or = [
          { product_name: { $regex: search, $options: "i" } },
          { Category: { $regex: search, $options: "i" } }
        ];
      }

      if (brand && brand !== 'all') {
        query.Brand = brand;
      }

      if (category && category !== 'all') {
        query.Category = category;
      }

      if (priceRange) {
        const [min, max] = priceRange.split('-').map(val => parseFloat(val.replace('$', '')));
        query.Price = { $gte: min, $lte: max };
      }

      const result = await productCollection
        .find(query)
        .sort({ Price: sort })
        .skip(page * size)
        .limit(size)
        .toArray();
      res.send(result);
    });

    app.get("/productCount", async (req, res) => {
      const count = await productCollection.countDocuments();
      res.send({ count });
    });

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } finally {
    // Ensure the client will close when you finish/error
  }
}

run().catch(console.dir);
