# Socket
## Authored by Jungeun Pyun

### Socket이란?

-   추상적인 개념의 통신 접속 포인트이자 종착점(Endpoint)
-   통신에서 각 단말기간 연결해주는 인터페이스
-   서버 입장에선 접속 포인트이자 접속한 단말이 socket이라고 할 수 있다

socket을 활용해서 통신할 때 사용하는 프로토콜이 TCP & UDP이다. [관련 포스팅 참고](https://jungeunpyun.tistory.com/25)

#### 1\. TCP 기반 통신

-   TCP 프로토콜을 지원하는 모듈인 net을 require 해서 사용할 수 있다.
-   createServer로 서버를 생성한다. socket 관련 동작은 서버가 생성된 후 그 내부에서 동작하게끔 만들어준다.
-   **socket.write** : socket 즉, 서버의 단말기 측으로 메시지를 보낸다.
-   **socket.on('data'**,function(chunk){}) : socket으로부터 메시지(data)를 받아온다.
-   console.log(**chunck.toString()**) : TCP로 전달받는 데이터는 buffer로 저장돼서 전달된다. 메시지로 표시하기 위해선 string화 해주어야 한다.
-   **socket.on('end'**,function(){}) : socket이 접속 종료할 때 동작한다.
-   **server.on('listening'**,function(){}) : 서버가 시작될 때 동작한다.
-   **server.on('close'**,function(){}) : 서버가 종료될 때 동작한다.

```javascript
//TCP/server.js

const net = require('net')
const server = net.createServer(function(socket) { 

    console.log('Client connected')
    socket.write('Welcome to Socket Server')
    socket.on('data', function(chunck) { 
        console.log('Get message from Client : ', chunck.toString()) 
    })
    socket.on('end',function(){
        console.log('Client disconnected')
    })
})
server.on('listening', function(){
    console.log('Server is listening')
})
server.on('close', function(){
    console.log('Server closed')
})
server.listen(3000) 
```

-   client 페이지에서는 서버로 접속해야 하기 때문에 접속하고자 하는 ip 주소와 port 정보가 필요하다.
-   서버 측이 createSever로 서버를 만드는 반면에 client 측에서는 socket을 생성한다.
-   **socket.connect**(options: SocketConnectOpts, connectionListener?: () \=>  void) : 서버에 연결한다.
-   **socket.on(event: "data"**, listener: (data: Buffer) \=>  void) : 서버 측으로부터 데이터를 받아온다. (예제의 경우 서버 측에서 socket.write로 보낸 'Welcome to Socket Server'를 chunk로 받아옴)
-   **socket.on(event:** **"end"**, listener: () \=>  void) : 서버로부터 접속이 종료되면 동작한다.
-   **socket.write** : 서버 측으로 보내는 메시지(데이터)이다. 서버 측에서 socket.on('data')로 읽어 들인다.
-   **socket.end()** : socket의 접속을 종료한다.

```javascript
//TCP/client.js

const net = require('net')
const ip = '127.0.0.1'
const port = 3000
const socket = new net.Socket()

socket.connect({host:ip, port:port}, function() {
    console.log('Connected to Server')

    socket.on('data', function(chunk) { 
        console.log('Get message from Server : ', chunk.toString())    
    })
    
    socket.on('end', function() { 
        console.log('Disconnected From Server')
    })

    socket.write('Hello Socket Server\n') 
    socket.end() 
})
```

#### 2\. TCP 기반 통신으로 채팅 구현

-   sockets라는 array를 만들어서 특정 단말기 간에 통신이 가능하도록 한다.
-   새로운 socket이 연결될 때마다 count가 증가한다.
-   socket.num에 특정 값을 입력해두면 추후에 해당 채팅방의 인원수 제한이 가능하다.
-   if문으로 새로 연결된 socket을 sockets라는 array에 push 해서 넣어준다.
-   for문을 돌려서 socket.on으로 받아온 데이터를 다른 socket으로 전달한다. 한 서버에 여러 개의 socket이 연결되기 때문에 데이터를 전송한 socket에 다시 그 데이터가 보내지는 것을 방지하기 위함이다.

```javascript
//TCP/server_chat.js

const net = require('net')

const sockets=[]
let count = 0
const server = net.createServer(function(socket) {
    // console.log(socket)
    console.log('Client connected')
    count++
    socket.num = count
    // const socket_num_array = sockets.map(item => item.num)
    // console.log('socket num : ', socket_num_array)
    // if(!socket_num_array.includes(count)){
    //     sockets.push(sockets)
    // }

    if(!sockets.includes(socket)){
        sockets.push(socket)
    }
    socket.on('data', function(chunk) {
        for (let i=0;i<sockets.length;i++){
            // if(sockets[i].num != socket.num){
            // sockets[i].write(chunck.toString())
            // }
            if(sockets[i] != socket){
                sockets[i].write(chunk.toString())
            }   
        }
    })
    socket.on('end',function(){
        console.log('Client disconnected')
    })
})
server.on('listening', function(){
    console.log('Server is listening')
})
server.on('close', function(){
    console.log('Server closed')
})
server.listen(3000)
```

-   readline 모듈을 사용해서 입력값을 받는다. [readline 모듈 관련 포스팅 참고](https://jungeunpyun.tistory.com/14?category=914393)
-   채팅이 계속 지속되기 위해 cllient 측 socket이 종료되면 안 된다.
-   client를 다수의 터미널을 통해 여러 개 돌려주면 server를 통해 client 간 통신이 되는 것을 확인할 수 있다.

```javascript
//TCP/client_chat.js

const net = require('net')
const ip = '127.0.0.1'
const port = 3000
const socket = new net.Socket()

const readline = require('readline')
const rl = readline.createInterface({
    input:process.stdin,
    output:process.stdout
})

socket.connect({host:ip, port:port}, function() {
    console.log('Connected to Server')

    socket.on('data', function(chunk) {
        console.log('Get message from Server : ', chunk.toString())     
    })
    
    socket.on('end', function() {
        console.log('Disconnected From Server')
    })
    rl.on('line',(input)=>{
        console.log(`sent : ${input}`)
        socket.write(`${input}`) 
    })
    //socket.end()
})
```

-   client 간 통신을 하더라도 결국은 server를 통해서 전달되기 때문에 server로부터 데이터를 받아오는 것을 볼 수 있다.

![Terminal1 에서 client가 메세지 전송](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2F8pNxB%2Fbtq3IQ8Q2sP%2FSJIY9zBlsB41qsKwau5YVk%2Fimg.png "Terminal1 에서 client가 메세지 전송")     
_Terminal1 에서 client가 메세지 전송_           
           
![Terminal2 에서 client가 메세지 받음](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FSNzCt%2Fbtq3GDBWLIk%2FCRe1AIccXqza9pZfK0ksTK%2Fimg.png "Terminal2 에서 client가 메세지 받음")       
_Terminal2 에서 client가 메세지 받음_

#### 3\. UDP 기반 통신

-   UDP는 TCP와 달리 송신만 할 뿐 수신확인은 하지 않는다.
-   실질적으로 채팅에 활용하기는 적합하지 않다. 주로 영상통화 또는 스트리밍 서비스에 사용되는 통신 프로토콜이다.
-   아래 예제에서 스크립트 명칭을 server와 client로 구분해 두었지만 실제로 UDP는 서버가 있다고 볼 수 없다.
-   각각이 모두 하나의 단말기이고 서버를 통하는 개념이 아니라 단말에서 단말로 데이터를 보내는 개념이다.

```javascript
//UDP/server.js

const dgram = require('dgram')
const socket = dgram.createSocket('udp4')
socket.bind(3000)

socket.on('listening', function(){
    console.log('listening event')
})

socket.on('message', function(msg, rinfo) {
    console.log('Get message from client : ', msg.toString())
    console.log('Client IP : ', rinfo.address)
})

socket.on('close', function() { 
    console.log('close event')
})
```

```javascript
//UDP/client.js

const dgram = require('dgram')
const socket = dgram.createSocket('udp4')

const msg = new Buffer.from('Hello UDP Server') 
socket.send(
    msg, //data
    0, //시작점
    msg.length, //종료점
    3000, //포트
    '127.0.0.1', //주소 
    function(err){
    console.log('err : ', +err)
    if (err) {
        console.log('UDP message send error ', err)
        return
    }
    socket.close()
} )
```

---

### SOCKET IO

-   socket 모듈과 TCP를 이용해서 채팅을 구현할 수 있지만 서버와 클라이언트 간 시작 및 종료, 유저 구분 등 코드 양이 방대해지고 이슈 사항 컨트롤이 힘들다.
-   SOCKET IO는 node.js 기반 소켓 통신 라이브러리이다.

#### 1\. 모듈설치

-   Server : npm i --save socket.io
-   Client : npm i --save socket.io-client

#### 2\. JOIN

socket.io를 사용하더라도 채팅방을 만들기 위해선 user를 모두 구분해서 분기 처리를 해주어야 하는 것은 마찬가지이다. 이러한 수고를 덜기 위해 사용할 수 있는 것이 join이다. join을 이용하면 socket은 특정 채널을 통해 들어오는 데이터를 모두 받을 수 있게 된다. 즉, socket이 해당 채널을 구독한다. 반대로 해당 채널을 통하지 않은 데이터는 받아올 수는 없게 되는 것이다.

이것을 **PUB SUB (Publish & Subscribe) 구조**라고 한다. PUB SUB 구조에서 발신자는 특정 채널로 메시지를 전달하고 해당 메시지는 채널을 구독하는 수신자에게만 전달된다. 대표적으로 어플의 Push 기능을 예로 들 수 있다.

-   **위 TCP 예제의 net 모듈에서 가져온 socket이랑 socket.io 모듈에서 가져온 socket은 다르다!** _~(각 모듈에서 socket을 정의하는 바가 다르기 때문에 쓰임에 차이가 있다. 나는 공부하면서 해당 부분이 헷갈렸었다..)~_
-   **io.on('connection',** function(**socket**){}) : socket을 받아와서 연결한다.
-   **socket.on('chat message'**, function(msg){}) : socket.io 모듈의 socket.on에선 채널명을 지정해줄 수 있다. 해당 채널명을 통해서 데이터를 주고받는다.
-   **io.to(roomName).emit**('chat message',msg) : 특정 roomName으로 msg를 전달한다.
-   **socket.on('room'**, function(room){}) : socket에 room이라는 채널을 추가해서 client에서 room을 받아온다.
-   if문을 통해서 해당 room이 없으면 새로운 방을 추가하면서 roomName을 지정한다.
-   room이 있으면 socket을 기존 room에 join 시킨다.

```javascript
//chat_example_join/index.js

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

let sockets = {}
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected : ');
  socket.on('chat message', function(msg){ 
    let roomName = socket.roomName
    console.log('roomName : ',roomName)
    // console.log('sockets : ',sockets)
    io.to(roomName).emit('chat message', msg);
  });

  socket.on('room', function(room){
    if(!sockets[room]){
      sockets[room] = []
      // console.log(sockets)
      socket.roomName = room
      // socket1.roomName = 123
      
      sockets[room].push(socket)
       // sockets = {
      //    "123":[socket1]

      // }
      socket.join(room)
      
    } else {
      if (sockets[room].length < 2){
        socket.roomName = room     
        // socket2.roomName = 123 
        sockets[room].push(socket)
        // sockets = {
      //    "123":[socket1, socket2],
      //    "room1":[socket1, socket2],
      //    "room2":[socket1, socket2],
      // }
        // sockets =  [[socket1, socket2], [socket3, socket4]]
        socket.join(room)
        console.log('sockets : ', sockets)
      } else {
        socket.emit('result','failed')
      }  
    }    
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});

```

블로그 링크 : <https://jungeunpyun.tistory.com/51> 