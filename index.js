// x. cinera 2k18 12 20

const path = require('path');
const fs = require('fs');
const disco = require('discord.js');
const verid = "1.0";

var f = (process.argv.indexOf('f') + process.argv.indexOf('-f') + 2);
var h = (process.argv.indexOf('h') + process.argv.indexOf('-h') + 2);
var d = (process.argv.indexOf('d') + process.argv.indexOf('-d') + 2);
var a = (process.argv.indexOf('a') + process.argv.indexOf('-a') + 2);
var l = (process.argv.indexOf('l') + process.argv.indexOf('-l') + 2);
var s = (process.argv.indexOf('s') + process.argv.indexOf('-s') + 2);
if (process.argv.indexOf('--help') != -1) h = 1;
// Process command-line arguments into variables.

f = f ? 1 : 0;
d = d ? 1 : 0;
h = h ? 1 : 0;
a = a ? 1 : 0;
l = l ? 1 : 0;
s = s ? 1 : 0;

console.log("ZA HANDO v" + verid + " || ex cinera 2k19 GPL v3");
if (h) {
 console.log("Usage: node " + path.basename(__filename) + " [-d] [-h] [-f] [-a]")
 console.log("  -d, dry        Run without deleting anything")
 console.log("  -h, help       Display this help menu and exit")
 console.log("  -f, force      Override channel/guild ID mismatch")
 console.log("  -a, automatic  Run without confirmation dialog")
 console.log("  -l, list       List available channels and exit")
 console.log("  -s, setup      Create blank configuration file")
 process.abort();
 }


try {
  purgeConfig = JSON.parse(fs.readFileSync(__dirname + '/config.json'));
  console.log("Configuration file valid.");
  s && console.log("Setup not needed, exiting program.");
  s && process.abort();
  }
 catch (e) {
  !s && console.log("ERROR: No configuration file found.");
  baseconfig = {
   "client_id":"000000000000000000",
   "server_id":"000000000000000000",
   "token":"00000000000000000000000000000000000000000000000000000000000",
   "purge":"off",
   "purge_channel":"000000000000000000",
   "messagecount":"on",
   "message":"My Stand, **Za Hando**, erases all chats in the Discord channel specified in its configuration file! It can be really dangerous, so watch out.",
   "sendmessage":"on"
  };
  s && console.log("Creating blank configuration file at " + __dirname + "/config.json");
  try {
   fs.appendFileSync(__dirname + '/config.json', JSON.stringify(baseconfig, null, ' '));
   console.log("Blank config file successfully written to disk. Exiting program.");
   process.abort();
   } catch (e) {
    console.log("ERROR: Blank config file could not be written to disk. Exiting program.");
    process.abort();
    }
  } // Catches error from reading config file.


const disClient = new disco.Client();
console.log("Attempting to authenticate to " + purgeConfig['server_id']);
disClient.login(purgeConfig['token'])
 .catch(err => {console.log('ERROR: Could not authenticate with provided credentials.'); throw err});
disClient.on('ready', () => {
 if (l) {
  console.log(disClient.channels.size + " channels for user " + disClient.user.id + " (" + disClient.user.username + ") on " + disClient.guilds.size + " guilds");
  var iter = disClient.channels.keys();
  for(var j = 0; j < disClient.channels.size; j++) {
   chan = disClient.channels.get(iter.next().value);
   console.log(chan.guild.id + " / " + chan.id + " (" + chan.guild.name + " / " + chan.name + ")");
   } // closes iterator over channels
  setTimeout(function() {
   console.log(" (end of list) ");
   process.abort();
   }, 10000);
 } // closes list

 
 var msgCount = 0;
 if (!l) {
  try { disServer = disClient.guilds.get(purgeConfig['server_id']);
  } catch(e) {
   console.log("ERROR: Server in configuration file not found.");
   a && process.abort();
   }
  try { disChannel = disClient.channels.get(purgeConfig['purge_channel']);
   } catch(e) {
    console.log("ERROR: Channel in configuration file not found.");
    a && process.abort();
    }
  } // if no l

 if (!l && disChannel.type != "dm" && disChannel.guild.id != disServer.id && !f) {
  console.log("ERROR: Channel is on different guild from server");
  process.abort();
  }
 // console.log(disChannel);
 var i = 1;
 if (!l && !d && a) { killEmAll(disChannel, disChannel.lastMessageID); }
 if (!l && (!a || d)) {
  console.log("\nChannel from configuration file located.");
  console.log(xPad(disServer.memberCount, 4, "0") + " users from guild \"" + disServer.name + "\"");
  console.log(xPad(disChannel.type, 8, " ") + " type channel \"" + disChannel.name + "\"");
  console.log("Last message: " + disChannel.lastMessageID);
  console.log("");
  console.log("\Enter \"Y\" to purge all messages from here,");
  console.log("      \"N\" to exit the program, or alternate");
  console.log("      channel ID to purge that one instead");
  console.log("      (program will exit if a channel with");
  console.log("      the alternate ID cannot be located)");
  var stdin = process.openStdin();
  stdin.addListener("data", function(data) {
  data = data.toString().trim();
   if (data === "Y" || data === "y") {
    d && process.abort();
    !d && killEmAll(disChannel, disChannel.lastMessageID);
    }
   if (data === "N" || data === "n") {
    console.log("See ya later.");
    process.abort();
    }
   if (data != "N" && data != "n" && data != "Y" && data != "y") {
    console.log("Attempting to purge " + parseInt(data));
    if (!parseInt(data)) {
     console.log("ERROR: Invalid string for channel ID");
     process.abort();
     }
    if (!disClient.channels.get(data)) {
     console.log("ERROR: Could not retrieve that channel");
     process.abort();
     }
    else {
     d && process.abort();
     !d && killEmAll(disClient.channels.get(data), disClient.channels.get(data).lastMessageID);
     }
    }
   }); // listener for data
  } // If it's being run normally

 function killEmAll(channel, parameter) {
  console.log(channel.lastMessageID);
  if (channel.type === "text") {
   channel.bulkDelete(100)
    .then(messages => {
     for (var j in messages) {
      console.log(j);
      }
     console.log(`Deleting ${messages.size} messages`)
     msgCount+= messages.size;
     if (messages.size == 0) { exitProgram(channel); }
     killEmAll(channel, "x");
     }) // What to do with the messages!
    .catch(console.error);
   } // If it's a text channel.
  if (channel.type === "dm") {
   channel.fetchMessages({before: parameter})
    .then(messages => {
     var iterChan = messages.keys();
     for (var asdf = 0; asdf < messages.size; asdf++) {
      msgId = iterChan.next().value;
      msg = messages.get(msgId);
      if (msg.author.id === disClient.user.id) msg.delete(asdf * 100)
      .catch(console.error);
      if (asdf +1 === messages.size) { setTimeout(function() {killEmAll(channel, msgId);}, 50000) }
      } // closes out function to iterate over fetched msgs
     if (messages.size == 0) { exitProgram(channel); }
    }) // What to do with fetched messages.
   .catch(console.error);
   } // If it's a DM channel.
  } // closes killEmAll

 function exitProgram(channel) {
  var prefix = "";
  msgCount--;
  console.log("Deleted ${msgCount} messages in total.");
  if (purgeConfig['messagecount'] === "on") {
   prefix = "[" + msgCount + " messages deleted] ";
   if (msgCount === 1) prefix = "[" + msgCount + " message deleted] ";
   }
  if (purgeConfig['sendmessage'] === "on") {
  channel.send(prefix + purgeConfig['message'])
   .then(function() {
    console.log("Purge complete. Exiting program.");
    process.abort();
    })
   .catch(function() {
    console.log("Purge complete. Exiting program.");
    process.abort();
    });
  }
  else {
   console.log("Purge complete. Exiting program.");
   process.abort();
   }
  } // closes exitProgram

 }); // closes routine to execute when the client's ready.


function xPad (input, n, x) {
input = input.toString();
 while (input.length < n) {
  input = x + input;
  }
 return input;
 }