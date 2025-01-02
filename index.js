const express = require("express");
const cors = require("cors");
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.wnyje.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    const touristCollection = client.db('touristDB').collection('tourist');

    // tourist operation**********
    // delete operation 
    app.delete("/spots/:id", async(req, res) =>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id)};
      const result = await touristCollection.deleteOne(query);
      res.send(result);
    })
    // get operation
    app.get('/spots', async(req, res) =>{
        const cursor = touristCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })
    app.get('/spots/:id', async(req, res) =>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id)};
      const result = await touristCollection.findOne(query);
      res.send(result);
    })
    // post operation
    app.post('/spots', async(req, res) =>{
        const spot = req.body;
        const result = await touristCollection.insertOne(spot);
        res.send(result);
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res)=>{
    res.send('Tourist management server');
})
app.listen(port, () =>{
    console.log(`tourist management server is running on port ${port}`);    
})