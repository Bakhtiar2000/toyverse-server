const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nvsxjlv.mongodb.net/?retryWrites=true&w=majority`;

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
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const toyCollection = client.db('toyVerse').collection('toys');

    app.get('/toys', async (req, res) => {
      console.log(req.query.email)
      let query = {};
      if (req.query?.email) {
        query = { seller_email: req.query.email }
      }
      const result = await toyCollection.find(query).toArray();
      res.send(result)
    })

    app.get('/toys/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await toyCollection.findOne(query);
      res.send(result)
    })

    app.post('/toys', async (req, res) => {
      const toy = req.body;
      console.log(toy)
      const result = await toyCollection.insertOne(toy)
      res.send(result)
    })

    app.delete('/toys/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id)
      const query = { _id: new ObjectId(id) }
      const result = await toyCollection.deleteOne(query)
      res.send(result)
    })

    app.patch('/toys/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const updatedBooking = req.body
      console.log(updatedBooking)
      const updateDoc = {
        $set: {
          price: updatedBooking.price,
          available_quantity: updatedBooking.available_quantity,
          description: updatedBooking.description
        },
      };
      const result = await bookingCollection.updateOne(filter, updateDoc)
      res.send(result)
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Toyverse has opened portal')
})

app.listen(port, () => {
  console.log(`toyverse server is running on port: ${port}`)
})
