/* eslint-disable jsx-a11y/accessible-emoji */
/* eslint-disable no-unused-vars */
import React, { useState, useRef } from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import crypto from 'crypto';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyAl0QPWW_qeOOImo2WBDL6-iUoSUoSNgew",
  authDomain: "chat-b12e8.firebaseapp.com",
  projectId: "chat-b12e8",
  storageBucket: "chat-b12e8.appspot.com",
  messagingSenderId: "199340789809",
  appId: "1:199340789809:web:b551270a79d52cab820510",
  measurementId: "G-MKNJRJRHXK"
});

const auth = firebase.auth();
const firestore = firebase.firestore();

const userCrypto = crypto.getDiffieHellman('modp15');
userCrypto.generateKeys();
console.log('userPublicKey: ', userCrypto.getPublicKey());
console.log(userCrypto.computeSecret(userCrypto.getPublicKey(), 'hex'));
console.log(userCrypto.getPrivateKey());

function App() {

  const [user] = useAuthState(auth);


  return ( 
    <div className="App">
      <header className="App-header">
        <h1>🦆💬</h1>
        <SignOut />
      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn/>}
      </section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button onClick={() => auth.SignOut()}>Signout</button>
  )
}

function ChatRoom() {
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limitToLast(20)

  const [messages] = useCollectionData(query, {idField: 'id'});
  const [formValue, setFormValue] = useState('');
  const dummy = useRef();

  const sendMessage = async(e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');

    dummy.current.scrollIntoView({ behavior: 'smooth' });

  }

  return (
    <div>
      <main>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
      
        <div ref={dummy}></div>
      </main>

      <form onSubmit={sendMessage}>

        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />
        <button type="submit">Send</button>

      </form>
    </div>
  )
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} alt='pollo' />
      <p>{text}</p>
    </div>
  )
}

export default App;
