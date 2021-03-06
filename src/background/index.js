'use strict';

require('6to5/polyfill');

var storage = require('../lib/storage');
var communicator = require('../lib/communicator');
var native = require('./native');

var user = require('./user')(storage, communicator);
user.setupListeners();

var discussions = {};

var nativeActions = {
    encrypted: require('./native-actions/encrypted')(communicator),
    decrypted: require('./native-actions/decrypted')(communicator, discussions),
    signed: require('./native-actions/signed')(communicator),
    signedencrypted: require('./native-actions/signedencrypted')(communicator),
    verified: require('./native-actions/verified')(communicator),
    error: require('./native-actions/error')()
};

var port = chrome.runtime.connectNative('com.margaine.erinome_native');

native.setup(port, nativeActions);

var actions = {
    encrypt: require('./actions/encrypt')(port, discussions),
    decrypt: require('./actions/decrypt')(port, user),
    getMessages: require('./actions/getMessages')(discussions),
    addDiscussion: require('./actions/addDiscussion')(discussions),
    sign: require('./actions/sign')(port),
    signencrypt: require('./actions/signencrypt')(port),
    verify: require('./actions/verify')(port)
};

Object.keys(actions).forEach(function(action) {
    communicator.on(action, actions[action]);
});
