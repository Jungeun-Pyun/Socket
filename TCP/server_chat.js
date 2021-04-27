//net tcp 지원 모듈
const net = require('net')

const sockets=[]
let count = 0
const server = net.createServer(function(socket) {
    // console.log(socket)
    console.log('Client connected')
    count++
    socket.num = count //num관련 코드 추가하면 나중에 채팅 인원제한 가능
    // const socket_num_array = sockets.map(item => item.num)
    // console.log('socket num : ', socket_num_array)
    // if(!socket_num_array.includes(count)){
    //     sockets.push(sockets)
    // }

    if(!sockets.includes(socket)){ //상대방만 메세지를 보내기 위함
        sockets.push(socket)
    }
    socket.on('data', function(chunk) {
        for (let i=0;i<sockets.length;i++){
            // if(sockets[i].num != socket.num){
            // sockets[i].write(chunck.toString())
            // }
            if(sockets[i] != socket){ //자기 자신 외에 다른 socket으로 데이터 보냄
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