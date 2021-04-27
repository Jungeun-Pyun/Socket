const dgram = require('dgram')
const socket = dgram.createSocket('udp4')

const msg = new Buffer.from('Hello UDP Server') 
socket.send( //client에서 메세지를 바로 보내버림
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