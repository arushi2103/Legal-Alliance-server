//import mongoclient from mongodb 
const{MongoClient}=require('mongodb')

let dbConnection

module.exports={
//establish connection to the database
    connectToDb:(cb)=>{
        MongoClient.connect('mongodb://localhost:27017/Apexdb')
        .then((client)=>{
            dbConnection=client.db()
            return cb()
        })
        .catch(err =>{
            console.log(err)
            return cb(err)
        })
    }, 
// return that connection to the database
    getDb: ()=>dbConnection
}