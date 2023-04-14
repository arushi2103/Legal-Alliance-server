const express =require('express')
const { MongoClient,ObjectId } = require('mongodb');
const bodyParser=require('body-parser');
const cors=require('cors');
const bcrypt = require('bcrypt');
// const fileUpload = require('express-fileupload');

const {connectToDb, getDb}=require('./db')

// const api = require('./routes/api')
const app = express()

const PORT=3000
const dbName='Apexdb';
const connectionString=new MongoClient('mongodb://localhost:27017/' + dbName);
const uri='mongodb://localhost:27017/'+dbName;
// const Schema =mongoose.Schema;

// const advocateSchema=new Schema({
//     advocateName:String,
//     mobileNumber:number,
//     joiningDate:String,
//     address:String,
// })

//  MongoClient.connect(connectionString);

// const AdvocateModel=mongoose.model('advocates',advocateSchema);
// app.use(fileUpload());
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
    LoginCredentialsCollection= db.collection('LoginCredentials');
    AdvocateCollection = db.collection('advocates');
    ClientCollection   = db.collection('Clients');
    NewCaseCollection  = db.collection('NewCases');
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
app.get('/clients',async (req,res)=>{
    console.log(req.body)
    const clientsArray = await ClientCollection.find({}).toArray();
    res.json(clientsArray);
})
// get all the new cases
app.get('/cases',async(req,res)=>{
    console.log(req.body)
    const newCaseArray=await NewCaseCollection.find({}).toArray();
    res.json(newCaseArray);
})

// API for advocates data 
app.post('/advocates',function(req,res){
    console.log(req.body)
    AdvocateCollection.insertOne(req.body);
    res.json("Advocate added successfully")


 })

// API for clients data
app.post('/clients',function(req,res){
    console.log(req.body)
    ClientCollection.insertOne(req.body);
    res.json({"status":"success","message":"Client added successfully"})
})


// API for new cases data
app.post('/cases',function(req,res){
    console.log(req.body)
    NewCaseCollection.insertOne(req.body);
    res.json({'status':'success','message':"New Case added successfully"})
})


// API for authentication

const saltRounds = 10;

app.get('/login-credentials', (req, res) => {
  console.log(req.body);
  console.log(LoginCredentialsCollection);
    LoginCredentialsCollection.find({ "email": req.body.email }, function(err, user) {
      console.log(err);
      if (user) {
        if(user.password===user.password && user.email===req.body.email){
            res.status(200).json({'login':'success'})
        }else{
          res.status(401).json({'login':'failed','message':'inavlid username or password'});
        }
      } else {
        res.status(401).send({'login':'failed','message':'email id not registered'});
      }
    });
});


// app.post('/LoginCredentials', async (req, res) => {
//     const { username, password } = req.body;
  
//     try {
//       // Connect to the MongoDB database
//       const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
//       const db = client.db();
  
//       // Find the user with the provided username
//       const user = await db.collection('LoginCredentials').findOne({ username });
  
//       if (!user) {
//         return res.status(400).json({ message: 'Invalid credentials' });
//       }
  
//       // Compare the provided password with the hashed password stored in the user document
//       const isMatch = await bcrypt.compare(password, user.password);
  
//       if (!isMatch) {
//         return res.status(400).json({ message: 'Invalid credentials' });
//       }
  
//       // If credentials are valid, you can send a success response or create a JWT token
//       return res.status(200).json({ message: 'Login successful' });
  
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Server error' });
//     } finally {
//       // Close the MongoDB database connection
//       await client.close();
//     }
//   });
  
// API for deleting data

  app.delete('/advocates/:id', async (req, res) => {
    const id = req.params.id;
  
    try {
      // Connect to the MongoDB database
      // const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
      // const db = client.db();
  
      // Delete the document with the provided id
      const result = await AdvocateCollection.deleteOne({ _id: ObjectId(id) });
  
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Data not found' });
      }
  
      // If delete operation is successful, send a success response
      return res.status(200).json({ message: 'Data deleted successfully' });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
     }
    // finally {
    //   // Close the MongoDB database connection
    //   await client.close();
    // }
  });













// Define GET route to retrieve selected element

// app.get('/advocates', (req, res) => {
//     const selectedElementId = req.query.selectedElementId;
//     AdvocateCollection.findById(selectedElementId, (err, adv) => {
//       if (err) {
//         console.log(err);
//         return res.status(500).send(err);
//       }
//       if (!adv) {
//         return res.status(404).send('Advocate not found');
//       }
//       res.status(200).send(adv);
//     });
//   });
// // Defined DELETE route to delete element by ID
// app.delete('/advocates/:id', (req, res) => {
//     const id = req.params.id;
//     AdvocateCollection.''(id, (err, adv) => {
//       if (err) {
//         console.log(err);
//         return res.status(500).send(err);
//       }
//       if (!adv) {
//         return res.status(404).send('Advocate not found');
//       }
//       res.status(200).send(`Advocate ${adv._name} with id ${adv._id} deleted`);
//     });
//   });

