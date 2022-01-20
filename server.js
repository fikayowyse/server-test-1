const express = require("express");
const app = express();
const port = process.env.PORT|| 4100

//Connect the database
const MongoClient = require("mongodb").MongoClient;

//parse the request parameters
app.use(express.json());

 let db="";
MongoClient.connect('mongodb+srv://FO348:fikayo@cluster0.o2kjn.mongodb.net/Mdxtest?retryWrites=true&w=majority', 
(err, client)=> {
 db = client.db("webstore")
})

//GET the collection name - For example: URL localhost:4100/collectionName
app.param("collectionName", (req, res, next, collectionName)=>
{
    req.collection = db.collection(collectionName)
    return next()
});

//CORS ISSUE.....
app.use(function(req,res, next){
    res.header("Access-Control-Allow-Origin", "*"); //allow CORS
    next();
});

//display a message for the root path to show API is working but a proper path needs to be provided
app.get("/", (req, res, next)=>{
    res.send("select a collection, e.g. /collection/messages")
});

//Retrive all items in a collection 
app.get("/collection/:collectionName", (req, res, next)=>{
    req.collection.find({}).toArray((e, results)=>{
        res.send(results)
    })
})

app.post("/collection/:collectionName", (req, res, next)=>{
req.collection.insert(req.body, (e, results)=>{
    if(e) return next(e)
    res.send(results.ops)
 })
})

const ObjectID = require("mongodb").ObjectId;
app.get("/collection/:collectionName/:id", (req, res, next)=>{
req.collection.findOne({_id: new ObjectId(req.params.id)}, (e,result)=>{
res.send(results)
    })
})

app.put("/collection/:collectionName/:id", (req, res, next)=>{
req.collection.update(
{_id: new ObjectId(req.params.id)},
{$set: req.body},
{safe: true, multi: false},
(e, results)=>{
if(e) return next (e)
res.send((result.result.n === 1)?{msg:"success"}:{msg:"error"})
     })
})

app.delete("/collection/:collectionName/:id", (req, res, next)=>{
req.collection.delete(
{_id: new ObjectId(req.params.id)},
(e, results)=>{
if(e) return next (e)
 res.send((result.result.n === 1)?{msg:"success"}:{msg:"error"})
      })
})

app.listen(port);
console.log("server running on port 4100");