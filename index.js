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

function killPage(channel, pageSize) {
 console.log(channel.lastMessageID);
 return channel.bulkDelete(pageSize).then(messages => {
  console.log(`Deleted ${messages.size} messages`);
  return messages.size;
 }); // what to do with the messages
} // closes killPage

function killEmAll(channel) {
 const pageSize = 100;
 return killPage(channel, pageSize).then(msgs => {
  if (msgs < pageSize) {
   return msgs;
  } else {
   return killEmAll(channel).then(others => msgs + others);
  }
 }); // what to do after deleting one page
} // closes killEmAll

function getAdvertisement(msgCount) {
 var prefix = "";
 if (purgeConfig['messagecount'] === "on") {
  prefix = "[" + msgCount + " messages deleted] ";
  if (msgCount === 1) prefix = "[" + msgCount + " message deleted] ";
 }
 return prefix + purgeConfig['message'];
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
 killEmAll(disChannel).then(msgCount => {
  exitProgram(disChannel, msgCount);
 }).catch(console.error);

 function exitProgram(channel, msgCount) {
  msgCount--;
  console.log("Deleted ${msgCount} messages in total.");
  channel.send(getAdvertisement(msgCount))
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
