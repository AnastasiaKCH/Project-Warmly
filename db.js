const mongoose = require("mongoose");

var mongoURL = "mongodb+srv://NastyaEnum:nW9YTtqftOtMjSDE@cluster0.mzsemq0.mongodb.net/mem-rooms";

mongoose.connect(mongoURL, {useUnifiedTopology:true , useNewUrLParser:true});

var connection = mongoose.connection;

connection.on("error", () => {
    console.log("Mongo DB Connection Failed")
});

connection.on("connected", () => {
    console.log("Mongo DB Connection Successful")
});

module.exports = mongoose;