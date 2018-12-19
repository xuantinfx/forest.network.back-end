
const mongoose = require('mongoose')
const config = require('./config')
const sync = require('./lib/sync')

mongoose.connect(config.connectionString, {useNewUrlParser: true}, (err) => {
  if(err) {
    console.log(err)
  } else {
    console.log("Connect to DB successfully!");
    sync.syncFromBlockChainInfo(config.nodeHost);
  }
})
