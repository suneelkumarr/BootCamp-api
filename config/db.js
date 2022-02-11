const mongoose = require('mongoose')


const connect =async () =>{
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true, 
      useUnifiedTopology: true
      });
    
      console.log(`Mongo started on ${conn.connection.host}`);
}

module.exports = connect; 
