//서버역할

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http); //socket io 라이브러리 모듈 설치
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html'); //ejs 나 pug같은 렌더링 파일을 사용하지 않으면 render 할 필요없이 그냥 sendfile만 하면됨
});

io.on('connection', (socket) => { //connection으로 통신 연결
  socket.on('chat message', msg => { //on : chat message라는 채널로 메세지 받음
    io.emit('chat message', msg); //emit : chat message 채널로 메세지 전송
    // 메시지 전달 / io.emit 접속한 socket에 모두 뿌려줌 /io.to 하면 특정 socket에만 보낼 수 있음
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
