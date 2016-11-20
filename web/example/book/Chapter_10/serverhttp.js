var http = require('http').createServer(handler),
    url = require('url'),
    path = require('path'),
    fs = require('fs');
var io = require('socket.io').listen(http);
var mimeTypes = {
    "html": "text/html",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "png": "image/png",
    "js": "text/javascript",
    "json": "text/javascript",
    "css": "text/css"};



function handler(req, res) {
    var uri = url.parse(req.url).pathname;
    console.log(uri);
    var filename = path.join(process.cwd(),'/client', uri);
    console.log(filename);
    fs.exists(filename, function(exists) {
        console.log(exists);
        if(!exists) {
            console.log("not exists: " + filename);
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.write('404 Not Found\n');
            res.end();
            return;
        }
        var mimeType = mimeTypes[path.extname(filename).split(".")[1]];
        res.writeHead(200, {'Content-Type':mimeType});
        console.log(filename);
        var fileStream = fs.createReadStream(filename);
        fileStream.pipe(res);

    }); //end path.exists
}


http.listen(8000);
io.sockets.on('connection', function (socket) {
    socket.on('clientMessage', function(content) {

        socket.get('username', function(err, username) { if (! username) {
            username = socket.id;
        }
            socket.get('room', function(err, room) {
                if (err) {
                    throw err;
                }
                var broadcast = socket.broadcast;
                ;
                if (room) {
                    broadcast.to(room);
                }
                var message={};
                //message.key="roommessage";
                //message.value={};
                message.username=username;
                message.roomname=room;
                message.message=JSON.parse(content);

                broadcast.emit('serverMessage', JSON.stringify(message));
                message.username="you";
                socket.emit('serverMessage', JSON.stringify(message)); });

        });
    });
    socket.on('login', function(username) { socket.set('username', username, function(err) {
        if (err) { throw err; }
        var message={};
        //message.key="logged";
        message.username=username;

        socket.broadcast.emit('loggedIn', JSON.stringify(message));
        message.username="you";
        socket.emit('loggedIn', JSON.stringify(message));
    });
    });
    socket.on('join', function(room) { socket.get('room', function(err, oldRoom) {
        if (err) { throw err; }
        socket.set('room', room, function(err) {
            if (err) { throw err; }
            socket.join(room); if (oldRoom) {
                socket.leave(oldRoom);
            }
            socket.get('username', function(err, username) {
                if (! username) {
                    username = socket.id;
                } });

            socket.get('username', function(err, username) {
                if (! username) {
                    username = socket.id;
                }
                var message={};
                //message.key="join";
                message.username=username;
                socket.emit('roomJoined', JSON.stringify(message));

                socket.broadcast.to(room).emit('roomJoined', JSON.stringify(message));
            });
        });
    });
    });
    socket.emit('login');
});
