import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import moment from 'moment/moment';
import Select from 'react-select';
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
  const [loginId, setloginId] = useState(1);
  const [message, setMessage] = useState(null);
  const [messageEdit, setmessageEdit] = useState(false);
  const [search, setSearch] = useState(null);
  const [searchUser, setSearchUser] = useState([]);
  const [token, settoken] = useState('c4ca4238a0b923820dcc509a6f75849b');
  const [toId, setToId] = useState(9)
  const [miniLoader, setminiLoader] = useState(false)
  const [messageList, setMessageList] = useState([]);
  const [recentUser, setRecentUsers] = useState([]);

  useEffect(() => {
    socket.on('message', message => {
      const msg = JSON.parse(message);
      // if (msg.from_id == loginId) {
      // setNotification(msg.message)
      // }
      if (loginId != null) {
        setMessageList(oldValue => [...oldValue, msg]);
      }
    });
    users?.map((e, i) => {
      if (i == loginId) {
        setuserName(e.name)
        console.log(e);
      }
    })
  }, [loginId]);
  function sendMessage() {
    let time = new Date().getTime();
    if (messageEdit == false) {
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
        axios
          .post(
            // `https://monilyapp.yourhealthgrades.com/api/chat/sendMessage?to_id=${toId}&from_id=${loginId}&message=${message}&timestamp=${time}`,
            `https://monilyapp.yourhealthgrades.com/api/chat/sendMessage?to_id=${toId}&from_id=${loginId}&message=${message}&timestamp=${time}`,
            {},
            {
              headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
              },
            },
          )
          .then(res => {
          })
          .catch(e => {
            console.log(e);
          });
      }
    } else {
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
    }
  }
  const [profileName, setprofileName] = useState(null)
  const [userName, setuserName] = useState(null)
  const UserButton = recentUser?.map((e, i) => {
    console.log(e);
    return (
      // loginId != i ?
        <button key={i} className='btn' onClick={() => { getChat(e) }}>
        {/* <button key={i} className='btn' onClick={() => { setprofileName(e.name); setToId(i) }}> */}
          <div className='profile d-flex align-items-center'>
            <div className='profileImg d-flex justify-content-center align-items-center'>
              <p>{e.to_name.substring(0, 1)}</p>
            </div>
            <p>{e.to_name}</p>
          </div>
        </button> 
        // : null
    )
  })
  const getChat = e => {
    setprofileName(e);
    console.log(e);
    axios
      .get(
        `https://monilyapp.yourhealthgrades.com/api/chat/getChat?to_id=${ e?.hasOwnProperty("to_id") ? e?.to_id : e?.id}&from_id=${loginId}`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(res => {
        console.log(res);
        setMessageList(res.data.data.data);
        // setLoading(false)
      })
      .catch(e => {
        console.log(e, 'chatData');
        // setLoading(false)
      });
  }
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
          <div className='profile d-flex align-items-center widthFit'>
            <div className='profileImg d-flex justify-content-center align-items-center'>
              <p>{userName?.substring(0, 1)}</p>
            </div>
          </div>
        </div>
        : e.to_id == loginId &&
          e.from_id == toId &&
          e.to_id != toId ?
          <div key={i} className='row d-flex'>
            <div className='profile d-flex align-items-center widthFit'>
              <div className='profileImg d-flex justify-content-center align-items-center'>
                <p>{profileName?.substring(0, 1)}</p>
              </div>
            </div>
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
  useEffect(() => {
    if (search == null || search == '') {
      setminiLoader(false)
      return
    }
    else {
      setminiLoader(true)
    }
    const delayDebounceFn = setTimeout(() => {
      // Send Axios request here
      if (search == null || search == '') {
        return
      }
      else {
        searchApi(search)
      }
    }, 3000)

    return () => clearTimeout(delayDebounceFn)
  }, [search])
  useEffect(() => {
    axios
          .get(
            `https://monilyapp.yourhealthgrades.com/api/chat/getChatList?user_id=${loginId}`,{
              headers: {
                'Content-Type': 'multipart/form-data',
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
              },
            },
          )
          .then(res => {
            console.log(res?.data);
            let users = [];
            res?.data?.data.map(res => {
              if(res?.from_id == loginId ){
                users.push(res);
              }
            });
            setRecentUsers(users);
          })
          .catch(err => {
            console.log(err);
          });
  }, [loginId])
  
  const searchApi = (e) => {
    axios
      .get(
        `https://monilyapp.yourhealthgrades.com/api/chat/getUsers?keyword=${e}`, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
      )
      .then(res => {
        let arr = []
        res?.data?.data.map(e => {
          if (e?.id != loginId) {
            arr.push({
              label: e.name,
              value: e.name,
              id: e.id,
              email: e.email
            })
            setminiLoader(false)
            //   setsearchedUser([res?.data?.data]);
            //   if (res?.data?.data?.length > 0) {
            //     setdropDownOpen(true);
            //   } else {
            //     setdropDownOpen(false);
            //   }
            // } else {
            //   return;
          }
        });
        setSearchUser(arr)
      })
      .catch(err => {
        setminiLoader(false)
        console.log(err);
      });
    // console.log(e);
  }
  return (
    <div className='container'>
      <div className='row'>
        <div className='col-lg-2'>
          <div className='position-relative'>
            <Select
              options={searchUser}
              onChange = {e => {getChat(e)}}
              placeholder="Search user"
              onInputChange={e => { setSearch(e) }}
            />
            {
              miniLoader ?
                <div className='loading'>
                </div> : null
            }
          </div>
          {UserButton}
        </div>
        <div className='col-lg-10 position-relative'>
          {
            profileName != null ?
              <>
                <div className='header'>
                  <div className='profile d-flex align-items-center'>
                    <div className='profileImg d-flex justify-content-center align-items-center'>
                      <p>{profileName?.hasOwnProperty('to_name') ? profileName?.to_name?.substring(0, 1) : profileName?.label?.substring(0, 1)}</p>
                    </div>
                    <p>{profileName?.hasOwnProperty('to_name') ? profileName?.to_name : profileName?.label}</p>
                  </div>
                </div>
                <div className='body'>
                  {messages}
                </div>
                <div className='footer'>
                  <div className='position-relative'>
                    <textarea rows={1} placeholder='Type messge' id='messageInput' onChange={e => setMessage(e.target.value)}></textarea>
                    <button className='sendButton' onClick={() => sendMessage()}><i className='fa fa-paper-plane'></i>
                    </button>
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
