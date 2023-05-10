import './style.css'
import typescriptLogo from './typescript.svg'
import { setupCounter } from './counter'
import firebase, { initializeApp }  from 'firebase/app';
import  {getFirestore} from 'firebase/firestore';

interface firebasetype {
  apiKey: String
  authDomain: String
  projectId: String
  storageBucket: String
  messagingSenderId: String
  appId: String
  measurementId: String
}
const firebaseConfig: firebasetype = {
  apiKey: "AIzaSyAADxEYn9B9PnPDYBTwVuYTuBrhiPEw_Jg",
  authDomain: "fir-rtctesting-5d9ed.firebaseapp.com",
  projectId: "fir-rtctesting-5d9ed",
  storageBucket: "fir-rtctesting-5d9ed.appspot.com",
  messagingSenderId: "47508261309",
  appId: "1:47508261309:web:adae39a08854f7b82a2ad4",
  measurementId: "G-5VHL01D1MJ"
};
const app = initializeApp(firebaseConfig);

// if(!firebase.apps.length){
//   firebase.initializeApp(firebaseConfig);
// }

const firestore :any  = getFirestore(app)



// globel state 
const servers:any = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
  iceCandidatePoolSize: 10,
};
let pc:any = new RTCPeerConnection();
let localStream:any = null;
let remoteStream:any = null;

// HTML elements
const webcamButton :HTMLElement | null = document.getElementById('webcamButton');
const webcamVideo = document.getElementById('webcamVideo');
const callButton = document.getElementById('callButton');
const callInput = document.getElementById('callInput');
const answerButton = document.getElementById('answerButton');
const remoteVideo = document.getElementById('remoteVideo');
const hangupButton = document.getElementById('hangupButton');





// webcam 
webcamButton.onclick = async () => {
  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

  // Push tracks from local stream to peer connection
  localStream.getTracks().forEach((track:any) => {
      pc.addTrack(track, localStream);
  });

  // Pull tracks from remote stream, add to video stream
  pc.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track);
    });
  };

  // Show stream in HTML video
  webcamVideo.srcObject = localStream;
  remoteVideo.srcObject = remoteStream;



  callButton.disabled = false;
  answerButton.disabled = false;
  webcamButton.disabled = true;
}


// 2. Create an offer
callButton.onclick = async () => {
  // Reference Firestore collections for signaling
  const callDoc = firestore.collection('calls').doc();
  const offerCandidates = callDoc.collection('offerCandidates');
  const answerCandidates = callDoc.collection('answerCandidates');

  callInput.value = callDoc.id;

  // Get candidates for caller, save to db
  pc.onicecandidate = (event) => {
    event.candidate && offerCandidates.add(event.candidate.toJSON());
  };
}
