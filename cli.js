#!/usr/bin/env node
const argv = require('yargs')
  .usage('Usage: $0 [host-name [port]]')
  .default('host', 'localhost')
  .default('port', 18444)
  .argv

var net = require('net');
var fs = require('fs')
var history_file = '.client.history'
var history = (fs.existsSync(history_file)) ? fs.readFileSync('.client.history').toString().split("\n") : []

var client = new net.Socket();

client.on('data', function(data) {
        console.log('Received: ' + data);
});

client.on('close', function() {
        console.log('Connection closed');
});

var methods = {
  test : function() {
    console.log(arguments)
    return 'hello'
  },
  connect: function(host, port) {
    console.log("Connecting to ", host, port)
    client.connect(port, host, function() {
      return "connected"
    });
  },
  version : function (){
    var buff = Buffer.from('fabfb5da76657273696f6e000000000064000000358d493262ea0000010000000000000011b2d05000000000010000000000000000000000000000000000ffff000000000000000000000000000000000000000000000000ffff0000000000003b2eb35d8ce617650f2f5361746f7368693a302e372e322fc03e0300','hex')
    try {
      client.write(buff)
    } catch (e) {
      console.log(e)
    }
  },
  disconnect: function() {
    client.destroy()
  },
  quit : function() {
    console.log('Have a great day!');
    process.exit(0);
  },
  unknown : function() {
    return "Unknown command"
  }
};


function writeLog(data) {
  if (data != '') {
  fs.appendFile(history_file, data + "\n", function(err) {
    history.push(data)
    if(err) {
        return console.log(err);
    }
  }); 
  }
}

function handleCmd() {
  rl.prompt();
  rl.on('line', (line) => {
    var answer = line.trim()
    writeLog(answer)
    var parts = answer.split(' ')
    var method = (parts[0] in methods) ? parts[0] : 'unknown'
    console.log(methods[method](...parts.splice(1)))
    rl.prompt();
  }).on('close', () => {
    methods.quit()
i });
}


var rl = null
if (argv._.length < 1 ) {
  const readline = require('readline');

  rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'bitcoin> '
  });
  handleCmd()
} else {
  methods['connect'](...argv._)
  methods['version']()
}
