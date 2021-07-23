unifi-proxy
===========

Very rudimentary tools to interface with Unifi devices over the UDP discovery
protocol (port `10001`).

This was originally written to allow the mobile Unifi Protect app to connect to a
local device over a L3 network.  These tools work by mimicking the UDP discovery
packet sent by the cloudkey (or similar device) on the same L2 network as the
mobile device trying to connect.

The beauty of the discovery protocol is that the mobile device (the client
sending out discovery packets) doesn't use the IP address of the host that
responds, but instead, uses the IP address that is embedded in the UDP payload.
Because of this, no proxy or anything is needed - the mobile app is able to form
a "direct" connection to a device on a different L3 network.

How To
------

To get started, `client.js` should be run on the same network as the unifi
device you would like to copy.  For me, this means running this tool on the same
network as my cloudkey.

`client.js` will send out a discovery broadcast packet on the L2 network and
print data for each node seen.

``` console
$ ./client.js
listening on 0.0.0.0:62083
discovery packet sent

message received from 10.0.2.10:10001
{"type":"Buffer","data":[1,0,0,...]}

message received from 10.0.2.50:10001
... etc ...
```

Find the device you'd like to be able to mimic.  Copy the JSON line that
represents the packet received by the device into a file like `packet.json`.
Then, run `server.js` with the packet file as an argument.  This server should
be run on the same L2 network where the mobile device searching for local
devices is running:

``` console
$ ./server.js packet.json
listening on 0.0.0.0:10001
```

Finally, open the mobile device and you should see your device when scanning for
local devices.  The server will print lines for each discovery packet it sees:

``` console
$ ./server.js packet.json
listening on 0.0.0.0:10001
got message from 10.0.1.211:55185
successfully sent 132 bytes
```

---

I hope that unifi just supports connecting directly to a device on a different
L3 network without this hack needed.

License
-------

MIT License
