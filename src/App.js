import logo from './logo.svg';
import './App.css';
import { Button, Container, Row, Col } from 'react-bootstrap';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import moment from 'moment/moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function App() {
  const users = [
    {
      name: 'Ahmed Ali'
    },
    {
      name: 'Yasir Ali'
    },
    {
      name: 'Javeirya Ali'
    },
    {
      name: 'Rukhsar Ali'
    },
    {
      name: 'Saniya Ali'
    },
    {
      name: 'Maaz Ali'
    },
  ]
  const [socket, setSocket] = useState(
    io('https://monily-web-chat-server.herokuapp.com'),
  );
  const [loginId, setloginId] = useState(null);
  const [message, setMessage] = useState(null);
  const [search, setSearch] = useState(null);
  const [toId, setToId] = useState(null)
  const [messageList, setMessageList] = useState([]);
  useEffect(() => {
    socket.on('message', message => {
      const msg = JSON.parse(message);
      console.log(msg);
      // if (msg.from_id == loginId) {
        // setNotification(msg.message)
      // }
      if (loginId != null) {
      setMessageList(oldValue => [...oldValue, msg]);
      }
    });
  }, [loginId]);
  function sendMessage() {
    let time = new Date().getTime();
    // if (messageEdit == false) {
    if (message == '' || message == null) {
      return;
    } else {
      socket.emit('message', {
        message: message,
        to_id: toId,
        from_id: loginId,
        timestamp: time,
      });
      document.getElementById('messageInput').value = ''
      // axios
      //   .post(
      //     `https://monilyapp.yourhealthgrades.com/api/chat/sendMessage?to_id=${toId}&from_id=${loginId}&message=${message}&timestamp=${time}`,
      //     {},
      //     {
      //       headers: {
      //         Accept: 'application/json',
      //         Authorization: `Bearer ${token}`,
      //       },
      //     },
      //   )
      //   .then(res => {
      //     setMessage('');
      //     getMessages();
      //   })
      //   .catch(e => {
      //     console.log(e);
      //   });
    }
    // } else {
    // console.log(deleteId, message);
    // axios
    //   .post(
    //     `https://monilyapp.yourhealthgrades.com/api/chat/updateMessage?id=${deleteId}&message=${message}`,
    //     {},
    //     {
    //       headers: {
    //         Accept: 'application/json',
    //         Authorization: `Bearer ${token}`,
    //       },
    //     },
    //   )
    //   .then(res => {
    //     getMessages();
    //     setMessage('');
    //     setmessageEdit(false);
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });
    // }
  }
  const [profileName, setprofileName] = useState(null)
  const UserButton = users?.map((e, i) => {
    return (
      loginId != i ?
        <button key={i} className='btn' onClick={() => { setprofileName(e.name); setToId(i) }}>
          <div className='profile d-flex align-items-center'>
            <div className='profileImg d-flex justify-content-center align-items-center'>
              <p>{e.name.substring(0, 1)}</p>
            </div>
            <p>{e.name}</p>
          </div>
        </button> : null
    )
  })
  const messages = messageList?.map((e, i) => {
    return (
      (e.to_id == toId &&
        e.from_id == loginId &&
        e.to_id != loginId) ?
        <div key={i} className='row d-flex justify-content-end'>
          <div className='reciever'>
            <p>{e?.message}</p>
            <div className='time'>
              <p>{moment(e?.timestamp).format('hh:mm A')}</p>
            </div>
          </div>
        </div>
        : e.to_id == loginId &&
          e.from_id == toId &&
          e.to_id != toId ?
          <div key={i} className='row'>
            <div className='sender'>
              <p>{e.message}</p>
              <div className='time'>
                <p>{moment(e?.timestamp).format('hh:mm A')}</p>
              </div>
            </div>
          </div>
          : null
    )
  })
  const searchUsers = users?.splice(0,3)?.map((e, i) => {
    return (
      loginId != i ?
        <button key={i} className='btn' onClick={() => { setprofileName(e.name); setToId(i) }}>
          <div className='profile d-flex align-items-center'>
            <div className='profileImg d-flex justify-content-center align-items-center'>
              <p>{e.name.substring(0, 1)}</p>
            </div>
            <p>{e.name}</p>
          </div>
        </button> : null
    )
  })
  return (
    <div className='container'>
      <div className='row'>
        <div className='col-lg-2'>
          {/* <input placeholder='Search User' className='w-90 SearchInput' onChange={e=> setSearch(e.target.value)}/> */}
          {/* <div className='SearchBox'>
          {search != null ? searchUsers : null}
          </div> */}
          {UserButton}
        </div>
        <div className='col-lg-10 position-relative'>
          {
            profileName != null ?
              <>
                <div className='header'>
                  <div className='profile d-flex align-items-center'>
                    <div className='profileImg d-flex justify-content-center align-items-center'>
                      <p>{profileName?.substring(0, 1)}</p>
                    </div>
                    <p>{profileName}</p>
                  </div>
                </div>
                <div className='body'>
                  {messages}
                </div>
                <div className='footer'>
                  <div className='position-relative'>
                  <textarea rows={1} placeholder='Type messge' id='messageInput' onChange={e => setMessage(e.target.value)}></textarea>
                  <button className='sendButton' onClick={() => sendMessage()}>Send</button>
                  </div>
                </div>
              </>
              : <div className='d-flex justify-content-center align-items-center w-100 h-100'>
                <p>Hello</p>
                <input onChange={e => setloginId(e.target.value)} />
              </div>
          }
        </div>
      </div>
    </div>
  );
}

export default App;
