const net = require('net')
// 서버로 접속해야하기 때문에 접속하고자 하는 ip 주소와 port가 필요함
const ip = '127.0.0.1'
const port = 3000
// 서버측에서는 createServer로 서버를 만들지만 client 측에서는 socket(단말기)를 생성함
const socket = new net.Socket()

socket.connect({host:ip, port:port}, function() { //서버 연결
    console.log('Connected to Server')

    socket.on('data', function(chunk) { //실행되면 바로 데이터 받음
        console.log('Get message from Server : ', chunk.toString()) //'Welcome to Socket Server'   
    })
    
    socket.on('end', function() { //서버로부터 접속이 종료되면 아래 동작
        console.log('Disconnected From Server')
    })

    socket.write('Hello Socket Server\n') //서버측으로 보내는 데이터
    socket.end() //접속 종료
})