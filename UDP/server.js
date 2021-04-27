//비연결형 프로토콜 (채팅에는 적합하지 않음, 영상통화, 스트리밍 등에 사용됨)
//서버 개념이 아니라 상대편 단말 개념
//서버를 통하지 않고 단말에서 바로 단말로 데이터를 보냄
//어디로 보낼지만 설정해주면 서버가 필요없음 => 해킹할 대상이 없음
//UDP 사용하는 모듈 이름 : diagram

const dgram = require('dgram')
const socket = dgram.createSocket('udp4')
socket.bind(3000)

socket.on('listening', function(){
    console.log('listening event')
})

socket.on('message', function(msg, rinfo) {
    console.log('Get message from client : ', msg.toString()) //bitearray 그대로 받아온 파일을 읽는 것
    console.log('Client IP : ', rinfo.address)
})

socket.on('close', function() { //socket 종료시킴
    console.log('close event')
})