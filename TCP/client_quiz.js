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
        // console.log(chunk)
        console.log('Get message from Server : ', chunk.toString())     
    })
    
    socket.on('end', function() {
        console.log('Disconnected From Server')
    })
    rl.on('line',(input)=>{
        console.log(`sent : ${input}`)
        socket.write(`${input}`) //접속된 서버로 메세지를 보내는 것 (socket 이라는건 접속 단자일 뿐이고 상대편으로 보내는 것)
    })
    // socket.end()
})