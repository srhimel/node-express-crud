const { MongoClient } = require('mongodb');
const express = require('express')
var cors = require('cors')
const app = express()
const port = 8000;
//middleware
app.use(cors())
app.use(express.json())

const ObjectId = require('mongodb').ObjectId;

const uri = "mongodb+srv://user:password@cluster0.pt0xz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
        await client.connect();
        const database = client.db("emaJohn");
        const productCollection = database.collection("products");
        // post api
        app.post('/products', async (req, res) => {
            const newProducts = req.body;
            const result = await productCollection.insertOne(newProducts);
            res.json(result);
        })
        //get all api
        app.get('/products', async (req, res) => {
            const cursor = productCollection.find({});
            const products = await cursor.toArray();
            res.send(products)
        })

        // get one api
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await productCollection.findOne(query);
            res.send(result);
        })

        //update api

        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const productNew = req.body;
            console.log(productNew);
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    prname: productNew.prname,
                    prprice: productNew.prprice,
                    prqty: productNew.prqty,
                }
            }
            const result = await productCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        })



        // delete api 
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productCollection.deleteOne(query);
            res.json(result);
        })

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.listen(port)
