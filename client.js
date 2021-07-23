#!/usr/bin/env node
/*
 * Scan for unifi devices via UDP discovery.
 *
 * Author: Dave Eddy <dave@daveeddy.com>
 * Date: July 13, 2021
 * License: MIT
 */

var dgram = require('dgram');
var socket = dgram.createSocket('udp4');

// unifi discovery info
var port = 10001;
var host = '255.255.255.255';
var mcastAddr = '233.89.188.1';
var message = Buffer.from([1, 0, 0, 0]);

socket.on('message', function (msg, rinfo) {
    console.log();
    console.log('message received from %s:%d', rinfo.address, rinfo.port);
    console.log(JSON.stringify(msg));
    console.log();
});

socket.on('listening', function () {
    var addr = socket.address();
    socket.addMembership(mcastAddr);
    socket.setBroadcast(true);

    console.log('listening on %s:%d', addr.address, addr.port);

    socket.send(message, 0, message.length, port, host, function (err, bytes) {
        if (err) {
            console.error('failed to send discovery request');
            process.exit(1);
        }

        console.log('discovery packet sent');
    });
});

socket.bind(null, '0.0.0.0');
