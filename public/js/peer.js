const Peer = require('simple-peer')
const socket = io()
const video = document.querySelector('video')
const client = {}
const chatbox_id = document.getElementById('chatbox').innerHTML

navigator.mediaDevices.getUserMedia({video:true, audio:true})
    .then(stream =>{
        socket.emit('NewClient',  chatbox_id )
        video.srcObject = stream
        video.play()

        function InitPeer(type){
            let peer = new Peer({initiator: (type == 'init')? true:false, stream: stream, trickle: false})
            peer.on('stream', stream =>{
                CreateVideo(stream)
            })
            peer.on('close',() =>{
                document.getElementById('peerVideo').remove()
                peer.destroy()
            })
            return peer
        }
        //Create init peer
        function MakePeer(){
            client.gotAnswer = false
            let peer = InitPeer('init')
            peer.on('signal', data =>{
                if(!client.gotAnswer){
                    //console.log('offer')
                    socket.emit('Offer', { chatbox_id, data })
                }
            })
            client.peer = peer
        }
        //Answer to the offer
        function FrontAnswer(offer){
            console.log(offer)
            let peer = InitPeer('notInit')
            peer.on('signal', data=>{
            //    console.log('ans')   
                socket.emit('Answer', {chatbox_id, data })
            })
            peer.signal(offer)
        }
        //Final signal and video chat start
        function SignalAnswer(answer){
            client.gotAnswer = true
            let peer = client.peer
        //    console.log(answer)
            peer.signal(answer)
        }
        function CreateVideo(stream){
            let video = document.createElement('video')
            video.id = 'peerVideo'
            video.srcObject = stream
            document.querySelector('#peerDiv').appendChild(video)
            video.play()
        }

        socket.on('BackOffer',FrontAnswer)
        socket.on('BackAnswer',SignalAnswer)
        socket.on('CreatePeer',MakePeer)
    })
    .catch(err => document.write(err))