'use strict'

var debug = require('debug')('chat:tests:fixtures:socketmock')

var createPayload = function(object) {
    return JSON.parse(JSON.stringify(object))
}

/**
 * A mocking class for the Socket IO Client side
 */
function SocketClient(socketMock) {

    this.eventCallbacks = []

    /**
     * Attach event to emit
     * @param  {string} eventKey -- The event key that needs to be attached
     * @param  {Function} callback
     */
    this.on = function(eventKey, callback) {
        this.eventCallbacks[eventKey] = callback
    }

    /**
     * Emit an event to the server client
     * @param  {string}   eventKey -- The event key that needs to be attached
     * @param  {object}   payload  -- The payload that needs to be attached to the emit
     * @param  {function} callback
     */
    this.emit = function(eventKey, payload, callback) {
        payload = payload || null;
        callback = callback || function() { return true }
        callback(socketMock.emitEvent(eventKey, payload))
    }

    /**
     * Fire an event to the server
     * @param  {string}   eventKey -- The event key that needs to be attached
     * @param  {object}   payload -- The payload that needs to be attached to the emit
     * @param  {Function} callback
     */
    this.fireEvent = function(eventKey, payload, doneCallback) {
        // Check if callback is set
        if (typeof this.eventCallbacks[eventKey] === 'function') {
            debug("Event %s on client side is dispatched with payload %s", eventKey, JSON.stringify(payload))
            this.eventCallbacks[eventKey](payload)
        }
    }

    this.broadcast = function(eventKey, payload) {
        // It should emit to all others user, but we are the only one so dont emit
        return;

        socketMock.emit(eventKey, payload);
    }
}

/**
 * A mocking class for the Socket IO Server side
 */
function SocketMock () {
    this.joinedRooms = []
    this.eventCallbacks = {}
    this.socketClient = new SocketClient(this)
    this.generalCallbacks = {}

    // self assign, for avoiding this clashing with objects
    var self = this

    /**
     * Emit an event to the server (used by client)
     * @param  {string} eventKey -- The event key
     * @param  {object} payload -- Additional payload
     * @param  {string} roomKey -- The corresponding roomKey (optional)
     */
    this.emitEvent = function(eventKey, payload, roomKey) {
        if (this.eventCallbacks[eventKey]) {
            debug("Event %s on server side is dispatched with payload %s", eventKey, JSON.stringify(payload))

            return this.eventCallbacks[eventKey](createPayload(payload))
        }
    }

    /**
     * Register on every event that the server sends
     * @param {Function} callback
     */
    this.onEmit = function(eventKey, callback) {
        this.generalCallbacks[eventKey] = callback
    }

    /**
     * Emit an event to the client
     * @param  {string} eventKey -- The event key
     * @param  {object} payload -- Additional payload
     */
    this.emit = function(eventKey, payload) {
        payload = payload || null;
        if (typeof doneCallback === 'function') {
            doneCallback(self.socketClient.emit(eventKey, createPayload(payload)))
        }
        else {
            self.socketClient.fireEvent(eventKey, payload)
        }
    }

    /**
     * Attach event to emit
     * @param  {string}   eventKey -- The event key that needs to be attached
     * @param  {Function} callback
     */
    this.on = function(eventKey, callback) {
        this.eventCallbacks[eventKey] = callback
    }

    /**
     * Broadcast to everybody
     * Since only one client connected, equivalent to emit
     * @param  {string} roomKey the roomkey which need to be attached to
     */
    this.broadcast = this.emit

    /**
     * Joining a room
     * @param  {string} roomKey The room we want to join
     */
    this.join = function(roomKey) {
        this.joinedRooms.push(roomKey)
    }

    /**
     * Leaving a room
     * @param  {string} roomKey The room you want to leave
     */
    this.leave = function(roomKey) {
        this.joinedRooms.splice(roomKey, 1)
    }

    /**
     * Monitor logging feature
     * @param  {string} value The value you want to monitor
     */
    this.monitor = function(value) {
        debug("Monitor: %s", value)
    }

    /**
     * Accept connecting to a channel, but all messages goes to all channels
     * @param  {string} name of the channel (useless)
     */
    this.of = function(value) {
        return this;
    }
}

module.exports = SocketMock
