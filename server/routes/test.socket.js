'use strict';

module.exports.initialize = (socket) => {
    socket.emit('event.send', {hello: 'world'});
    socket.on('event.get', function(data) {
        console.log('on', socket.id);
    });
};