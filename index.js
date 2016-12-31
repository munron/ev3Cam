
var http=require('http');
var server=http.createServer();
var io=require('socket.io').listen(server);
var fs=require('fs');
server.listen(1337);
var  exec=require('child_process').exec;
var ev3dev=require('ev3dev-lang');

var fileNumber=0;
var touchSensor=new ev3dev.TouchSensor(ev3dev.INPUT_1);

touchSensor.registerEventCallback(function(error, touchInfo) {
      if(error) throw error;
      if(!touchInfo.lastPressed){
      exec('fswebcam -r 800x600 ' + "./images/" + fileNumber + '.png', function(err, stdout, stderr){
        if (err) { console.log(err); }
        imgFileName.emit('message',fileNumber+".png");
        fileNumber += 1;
      });
      console.log("take");
      }
    },
    function(userData) {
      var isPressed = touchSensor.isPressed;
      var changed = isPressed != userData.lastPressed;
      userData.lastPressed = isPressed;
      return changed;
    },
    false,
    { lastPressed: false }
);


server.on('request', function(req, res) {
  var url = req.url;
  if ('/' == url) {
    fs.readFile(__dirname + '/index.html', 'UTF-8', function (err, data) {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data);
      res.end();
    });
  } else if (url.match(".png")) {
    fs.readFile(__dirname + req.url, function (err, data) {
      res.writeHead(200, {'Content-Type': 'image/png'});
      res.write(data);
      res.end();
    });
  }
})

var imgFileName=io.of('/imgFileName').on('connection',function(socket){
    socket.on('message', function(data) {
	console.log(data);
    });
});
