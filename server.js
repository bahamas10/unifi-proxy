#!/usr/bin/env node
/*
 * Pretend to be a unifi device by responding to UDP broadcast info packets.
 *
 * Author: Dave Eddy <dave@daveeddy.com>
 * Date: July 13, 2021
 * License: MIT
 */

var fs = require('fs');
var dgram = require('dgram');

// unifi udp discovery stuff
var port = 10001;
var mcastAddr = '233.89.188.1';
var request = Buffer.from([1, 0, 0, 0]);

var packetFile = process.argv[2];
if (!packetFile) {
    console.error('packet.json file must be specified as the first argument');
    process.exit(1);
}
var message = Buffer.from(JSON.parse(fs.readFileSync(packetFile, 'utf8')));

var socket = dgram.createSocket({
    type: 'udp4',
    reuseAddr: true
});

socket.on('message', function (msg, rinfo) {
    console.log('got message from %s:%d', rinfo.address, rinfo.port);

    if (!msg.equals(request)) {
        console.warn('ignoring non-request packet');
        return;
    }

    socket.send(message, 0, message.length, rinfo.port, rinfo.address, function (err, bytes) {
        if (err) {
            console.error('error sending response packet');
            return;
        }
        console.log('successfully sent %d bytes', bytes);
    });
});

socket.on('listening', function () {
    var addr = socket.address();
    socket.setBroadcast(true);
    socket.setMulticastLoopback(false);
    socket.addMembership(mcastAddr);

    console.log('listening on %s:%d', addr.address, addr.port);
});

socket.bind({
    port: port,
    address: null,
    exclusive: false
});
