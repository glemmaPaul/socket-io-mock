# socket-io-mock
[![NPM](https://nodei.co/npm/socket-io-mock.png?compact=true)](https://npmjs.org/package/socket-io-mock?compact=true)
[![Build Status](https://travis-ci.org/glemmaPaul/socket-io-mock.svg?branch=master)](https://travis-ci.org/glemmaPaul/socket-io-mock)


A mock to test the socket.io library implementation

# Installation 
```bash
npm install socket-io-mock
```

# Usage
Simply create new socket mock with:
```js
var mockedSocket = new require('socket-io-mock')
```
And use the socket as if it was a normal Socket.io socket. 

For example:

```js
var SocketMock = require('socket-io-mock')
  , should = require('chai').should()

describe('Fast and isolated socket tests', function(){
  it('Sockets should be able to talk to each other without a server', function(done) {
    var socket = new SocketMock()
    
    socket.on('message', function (message) {
      message.should.be.equal('Hello World!')
    })
    socket.emit('message', 'Hello World!')
  })
})
```