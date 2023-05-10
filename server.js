const express =require('express')
const { MongoClient,ObjectId } = require('mongodb');
const bodyParser=require('body-parser');
const cors=require('cors');
const {connectToDb, getDb}=require('./db')
const xlsx = require('xlsx');

const app = express()

const PORT=3000
const dbName='Apexdb';
const connectionString=new MongoClient('mongodb://localhost:27017/' + dbName);
const uri='mongodb://localhost:27017/'+dbName;

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
let LoginCredentialsCollection;

function init() {
    db=getDb();
    LoginCredentialsCollection= db.collection('CredentialsCollection');
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
    res.json({"status":"success","message":"Advocate added successfully"})


 })

// API for clients data
app.post('/clients',function(req,res){
    console.log(req.body)
    ClientCollection.insertOne(req.body);
    res.json({"status":"success","message":"Client added successfully"});
})


// API for new cases data
app.post('/cases',function(req,res){
    console.log(req.body)
    NewCaseCollection.insertOne(req.body);
    res.json({"status":"success","message":"New Case added successfully"})
})


// API for authentication

app.post('/login-credentials', async(req, res) => {
  console.log(req.body);
  console.log("Received request:", req.body); // Debug statement
  try{
    console.log("Email and password:", req.body.email, req.body.password); // Debug statement

    const{email,password}=req.body;
    
    // validating the request body 
    if(!email ||!password){
       return res.status(400).json({ message: 'Email and password are required' });
    }
    // it is working till now 
    // check if uer exists in the database 
    //const user =await LoginCredentialsCollection.findOne({email});
    
    LoginCredentialsCollection.find({ email: req.body.email },  function(err, user) {
      console.log(err);

      if (user.length>0) {
        if(user[0].password === req.body.password && user[0].email === req.body.email){
            res.status(200).json({login:'success'})
        } else {
          res.status(401).json({login:'failed','message':'invalid username or password'});
        }
      } else {
        res.status(401).send({login:'failed','message':'email id not registered'});
      }
    });
  }catch(error){
    console.log(error);
    return res.status(500).json({message:"caught internal server error"}); 
  }
  
});


  
// API for deleting data

  app.delete('/advocates/:id', async (req, res) => {
    const id = decodeURI(req.params.id);

    try {
      const result = await AdvocateCollection.deleteOne({ _id: id });
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Advocate Details not found' });
      }
      // If delete operation is successful, send a success response
      return res.status(200).json({ message: 'Advocate Details deleted successfully' });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
     }
    
  });


  //  API for downloading data in excel sheet 

  app.get('/advocates', async (req, res) => {
    const dataType = req.params.dataType;
  
    // get the data from the database based on the data type

    // ...
    console.log(req.body)
    const adArray = await AdvocateCollection.find({}).toArray();
    res.json(adArray);
  
    // convert the data into an Excel file
    const worksheet = xlsx.utils.json_to_sheet(data);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });
  
    // set the response headers and send the file to the frontend
    res.setHeader('Content-Disposition', `attachment; filename=${adArray}.xlsx`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(excelBuffer);
  });





