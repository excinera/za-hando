// x. cinera 2k18 12 20

const fs = require('fs');
const disco = require('discord.js');

try {
  purgeConfig = JSON.parse(fs.readFileSync(__dirname + '/config.json'));
  console.log("Configuration loaded.");
  }
 catch (e) {
  console.log("No configuration file found. Exiting program.");
  baseconfig = {
   "client_id":"000000000000000000",
   "server_id":"000000000000000000",
   "token":"00000000000000000000000000000000000000000000000000000000000",
   "purge":"off",
   "purge_channel":"000000000000000000",
   "messagecount":"on",
   "message":"My Stand, **Za Hando**, erases all chats in the Discord channel specified in its configuration file! It can be really dangerous, so watch out."
  };
 fs.appendFileSync(__dirname + '/config.json', JSON.stringify(baseconfig, null, ' '));
  process.abort();
  }   

const disClient = new disco.Client();
disClient.login(purgeConfig['token']).catch(err => {console.log('Authentication failure!'); throw err});
console.log("Starting purge on " + purgeConfig['server_id']);
disClient.on('ready', () => {
 var msgCount = 0;
 disServer = disClient.guilds.get(purgeConfig['server_id']);
 console.log(disServer.channels);
 disChannel = disServer.channels.get(purgeConfig['purge_channel']);
 var i = 1;
 killEmAll(disChannel);

 function killEmAll(channel) {
  console.log(channel.lastMessageID);
  channel.bulkDelete(100)
   .then(messages => {
    console.log(`Deleting ${messages.size} messages`)
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
  console.log("Deleted ${msgCount} messages in total.");
  if (purgeConfig['messagecount'] === "on") {
   prefix = "[" + msgCount + " messages deleted] ";
   if (msgCount === 1) prefix = "[" + msgCount + " message deleted] ";
   }
  channel.send(prefix + purgeConfig['message'])
   .then(function() {
    console.log("Purge complete. Exiting program.");
    process.abort();
    })
   .catch(function() {
    console.log("Purge complete. Exiting program.");
    process.abort();
    });
  } // closes exitProgram

 }); // closes routine to execute when the client's ready.