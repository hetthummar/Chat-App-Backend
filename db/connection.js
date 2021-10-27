const mongoose = require('mongoose');

// let dbUri = "mongodb://localhost/resManagement";
const dbUri = "mongodb+srv://hetthummar:osho9050@cluster0.l6c9h.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

exports.connectToDb = async (succes,failure) => {

    // const client = new Mongo(dbUri,{useNewUrlParser: true,useUnifiedTopology: true,});

    mongoose.connect(dbUri, {
        // useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
        // useFindAndModify : false
    }).then(() => {
        // mongoose.connection.db.dropCollection('products', function(err, result) {});
        console.log("conncetion Successful");
        succes();
    }).catch((e) => {
        failure(e);
        console.log("No conncetion" + e);
    }
    );
}


// const { MongoClient } = require('mongodb');
// const uri = "mongodb+srv://hetthummar:<password>@cluster0.yjbo5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });


// const mongoose = require("mongoose")

// mongoose.connect("mongodb://localhost:27017/qrcodepizza-api", {
//     useCreateIndex: true,
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useFindAndModify : true,
//     useFindAndModify : false
// }).then(() => {
//     console.log("conncetion Successful")
// }).catch((e) =>
//     console.log("No conncetion")
// )
