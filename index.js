'use strict';

var xmpp = require('node-xmpp-server');
var server = null;
var Client = require('node-xmpp-client');

var startServer = function(done) {

  console.log('setting server');
  server = new xmpp.C2S.TCPServer({
    port: 5222,
    domain: 'localhost'
  });

  console.log('setting onConnection');
  server.on('connection', function(client) {
    client.on('register', function(opts, cb) {
      console.log('REGISTER');
      cb(true);
    });

    client.on('authenticate', function(opts, cb) {
      console.log('server:', opts.username, opts.password, 'AUTHENTICATING');
      if (opts.password === 'secret') {
        console.log('server: ', opts.username, 'AUTH OK');
      } else {
        console.log('server: ', opts.username, 'AUTH FAIL');
      }
    });

    client.on('online', function() {
      console.log('server: ', client.jid.local, 'stanza ', stanza.toString());
      var from = stanza.attrs.from;
      stanza.attrs.from = stanza.attrs.to;
      stanza.attrs.to = from;
      client.send(stanza);
    });

    client.on('disconnect', function() {
      console.log('server:', client.jid.local, 'DISCONNECT');
    });
  });

  console.log('listening...');
  server.on('listening', done);
}

startServer(function() {
  var client1 = new Client({
    jid: 'client1@localhost',
    password: 'secret'
  });

  client1.on('online', function(){
    console.log('client1: online');
    client1.send(
      new xmpp.Stanza('message', {to: 'localhost'}).c('body').t('HelloWorld')
    );
  });

  var client2 = new Client({
    jid: 'client2@localhost',
    password: 'notsecret'
  });

  client2.on('error', function(error) {
    console.log('client2', error);
  });
});
