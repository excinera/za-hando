// x. cinera 2k18 12 20

const fs = require('fs');
const disco = require('discord.js');

try {
  purgeConfig = JSON.parse(fs.readFileSync(__dirname + '/config.json'));
  console.log("Configuration loaded.");
  }
 catch (e) {
  console.log("No configuration file found. Exiting program.");
  process.abort();
  }   

const disClient = new disco.Client();
disClient.login(purgeConfig['token']).catch(err => {console.log('Authentication failure!'); throw err});
console.log("Starting purge on " + purgeConfig['server_id']);
disClient.on('ready', () => {
 var msgCount = 0;
 disServer = disClient.guilds.get(purgeConfig['server_id']);
 console.log("im gay");
 console.log(disServer.channels);
 disChannel = disServer.channels.get(purgeConfig['purge_channel']);
 var i = 1;
 killEmAll(disChannel);

 function killEmAll(channel) {
  console.log(channel.lastMessageID);
  channel.bulkDelete(100)
   .then(messages => {
    console.log(`Bulk deleted ${messages.size} messages`)
    msgCount+= messages.size;
    if (messages.size == 0) { exitProgram(channel); }
    killEmAll(channel);
    }) // What to do with the messages!
   .catch(console.error);
  // }
  } // closes killEmAll

 function exitProgram(channel) {
  var prefix = "";
  msgCount--;
  if (purgeConfig['messagecount'] === "on") {
   prefix = "[" + msgCount + " messages deleted] ";
   if (msgCount === 1) prefix = "[" + msgCount + " message deleted] ";
   }
  channel.send(prefix + purgeConfig['message'])
   .then(function() {
    console.log("Purge complete");
    process.abort();
    })
   .catch(function() {
    console.log("Purge complete");
    process.abort();
    });
  } // closes exitProgram

 }); // closes routine to execute when the client's ready.