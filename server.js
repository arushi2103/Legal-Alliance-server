const express =require('express')
const { MongoClient } = require('mongodb');
const bodyParser=require('body-parser')
const cors=require('cors')
const {connectToDb, getDb}=require('./db')

// const api = require('./routes/api')
const app = express()

const PORT=3000
const dbName='Apexdb';
const connectionString=new MongoClient('mongodb://localhost:27017/' + dbName);

// const Schema =mongoose.Schema;

// const advocateSchema=new Schema({
//     advocateName:String,
//     mobileNumber:number,
//     joiningDate:String,
//     address:String,
// })

//  MongoClient.connect(connectionString);

// const AdvocateModel=mongoose.model('advocates',advocateSchema);

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// app.use('/api',api)
app.use(cors())
// parse various different custom JSON types as JSON
app.use(bodyParser.json({ type: 'application/*+json' }))

// parse some custom thing into a Buffer
app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }))

// parse an HTML body into a string
app.use(bodyParser.text({ type: 'text/html' }))

//db connection 
let db;
connectToDb((err)=>{
    console.log(err)
    if(!err){
        init();
    }
    console.log('-- ')

})

let AdvocateCollection;
let ClientCollection;
let NewCaseCollection;

function init() {
    db=getDb();
    AdvocateCollection = db.collection('advocates');
    ClientCollection   = db.collection('Clients');
    NewCaseCollection=db.collection('NewCases');

}


app.listen(PORT,function(){
    console.log('server running on localhost'+PORT)
})

// get all advocates
app.get('/advocates',async (req,res)=>{
    console.log(req.body)
    const adArray = await AdvocateCollection.find({}).toArray();
    res.json(adArray);
})

// get all clients
app.get('/Clients',async (req,res)=>{
    console.log(req.body)
    const clientsArray = await ClientCollection.find({}).toArray();
    res.json(clientsArray);
})
// get all the new cases
app.get('/NewCases',async(req,res)=>{
    console.log(req.body)
    const newCaseArray=await NewCaseCollection.find({}).toArray();
    res.json(newCaseArray);
})

// API for advocates data 
app.post('/advocates',function(req,res){
    console.log(req.body)
    AdvocateCollection.insertOne(req.body);
    // Db.use
    // Db.collection
    res.json("Advocate added successfully")


 })

// API for clients data
app.post('/Clients',function(req,res){
    console.log(req.body)
    ClientCollection.insertOne(req.body);
    // Db.use
    // Db.collection
    res.json("Client added successfully")
})

// API for new cases data
app.post('/NewCases',function(req,res){
    console.log(req.body)
    NewCaseCollection.insertOne(req.body);
    // Db.use
    // Db.collection
    res.json("New Case added successfully")
})


