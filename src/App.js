import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import moment from 'moment/moment';
import Select from 'react-select';
import addNotification, { Notifications } from 'react-push-notification';
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
  const [deleteId, setdeleteId] = useState([]);
  const [profileName, setprofileName] = useState(null)
  const [userName, setuserName] = useState(null)
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    socket.on('message', message => {
      const msg = JSON.parse(message);
      if (loginId != null) {
        setMessageList(oldValue => [...oldValue, msg]);
        successNotification(msg)
      }
    });
    return function cleanup() { socket.off('message') }
  })
  useEffect(() => {
    users?.map((e, i) => {
      if (i == loginId) {
        setuserName(e.name)
      }
    })
  }, [loginId]);
  let imcrement = 1;
  function sendMessage() {
    imcrement++
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
          mesgId: imcrement
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
      console.log(deleteId, message);
      axios
        .post(
          `https://monilyapp.yourhealthgrades.com/api/chat/updateMessage?id=${deleteId}&message=${message}`,
          {},
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then(res => {
          getDeleteChat();
          setMessage('');
          setmessageEdit(false);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  const UserButton = recentUser?.map((e, i) => {
    return (
      <div key={i} className="profile d-flex align-items-center position-relative">
        <button className='profile d-flex align-items-center' onClick={() => { getChat(e) }}>
          <div className='profileImg d-flex justify-content-center align-items-center'>
            <p>{e.to_name.substring(0, 1)}</p>
          </div>
          <div className='d-flex align-items-baseline flex-column'>
            <p>{e?.from_id == loginId ? e?.to_name : e?.from_name}</p>
            <div className='d-flex align-items-baseline flex-column'>
              <p className='text-left'>{e?.message}</p>
              <p className='userTime text-left'>{moment(e?.timestamp).format('hh:mm A')}</p>
            </div>
          </div>
        </button>
        <i className='fa fa-chevron-down' data-bs-toggle="dropdown" />
        <div className="dropdown-menu">
          <button className="dropdown-item" onClick={() => { deleteChat(e); }}>Delete</button>
        </div>
      </div>
    )
  })
  const getChat = e => {
    setLoading(true)
    setprofileName(e);
    if (e?.hasOwnProperty('from_name') && loginId != null) {
      if (e.from_id == loginId && e.to_id == loginId) {
        return;
      } else if (
        e.from_id != loginId &&
        e.to_id == loginId
      ) {
        setToId(e.from_id);
      } else if (
        e.to_id != loginId &&
        e.from_id == loginId
      ) {
        setToId(e.to_id);
      } else {
        return;
      }
    } else {
      setToId(e?.id);
    }
    axios
      .get(
        `https://monilyapp.yourhealthgrades.com/api/chat/getChat?to_id=${e?.hasOwnProperty("to_id") ? e?.to_id : e?.id}&from_id=${loginId}`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(res => {
        setLoading(false)
        setMessageList(res.data.data.data);
        // setLoading(false)
      })
      .catch(e => {
        setLoading(false)
        console.log(e, 'chatData');
        // setLoading(false)
      });
  }
  const getDeleteChat = () => {
    axios
      .get(
        `https://monilyapp.yourhealthgrades.com/api/chat/getChat?to_id=${profileName?.hasOwnProperty("to_id") ? profileName?.to_id : profileName?.id}&from_id=${loginId}`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(res => {
        console.log(res.data.data.data);
        setMessageList(res.data.data.data);
        // setLoading(false)
      })
      .catch(e => {
        console.log(e, 'chatData');
        // setLoading(false)
      });
  }
  const deleteMessage = (e) => {
    axios
      .post(
        `https://monilyapp.yourhealthgrades.com/api/chat/deleteMessage?id=${e}`,
        {},
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(res => {
        console.log(res);
        getDeleteChat();
      })
      .catch(err => {
        console.log(err);
      });
  };
  const editMessage = (e) => {
    document.getElementById('messageInput').value = e
    setmessageEdit(true)
  }
  const deleteChat = async (e) => {
    console.log(e);
    (e?.from_id != loginId && e.to_id == loginId) ?
      axios.post(`http://monilyapp.yourhealthgrades.com/api/chat/deleteChat?to_id=${e.from_id}&from_id=${e.to_id}`,
        {},
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      ).then((res) => {
        console.log(res);
        getUserList()
        setprofileName(null)
        console.log(profileName);
      }).catch((err) => {
        console.log(err);
      })
      :
      axios.post(`http://monilyapp.yourhealthgrades.com/api/chat/deleteChat?to_id=${e.to_id}&from_id=${e.from_id}`,
        {},
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      ).then((res) => {
        console.log(res);
        getUserList()
        setprofileName(null)
        console.log(profileName);
      }).catch((err) => {
        console.log(err);
      })
  }
  const messages = messageList?.map((e, i) => {
    console.log(e,"mesage here");
    return (
      (e.to_id == (toId) &&
        e.from_id == loginId &&
        e.to_id != loginId) ?
        <div key={i} className='row d-flex justify-content-end'>
          <div className='reciever'>
            <i className='fa fa-chevron-down' data-bs-toggle="dropdown" />
            <p>{e?.message}</p>
            <div className='time'>
              <p>{moment(e?.timestamp).format('hh:mm A')}</p>
            </div>
            <div className="dropdown-menu">
              <button className="dropdown-item" onClick={() => { editMessage(e?.message); setdeleteId(e?.id) }}>Edit</button>
              <button className="dropdown-item" onClick={() => { deleteMessage(e?.id); setdeleteId(e?.id) }}>Delete</button>
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
                <p>{profileName?.from_id == loginId && profileName?.to_id != loginId ? profileName?.to_name?.substring(0, 1) : profileName?.from_name?.substring(0, 1)}</p>
              </div>
            </div>
            <div className='sender'>
              <i className='fa fa-chevron-down' data-bs-toggle="dropdown" />
              <p>{e.message}</p>
              <div className='time'>
                <p>{moment(e?.timestamp).format('hh:mm A')}</p>
              </div>
            </div>
            <div className="dropdown-menu">
              <button className="dropdown-item" onClick={() => { editMessage(); setdeleteId(e?.id) }}>Edit</button>
              <button className="dropdown-item" onClick={() => { deleteMessage(e?.id); setdeleteId(e?.id) }}>Delete</button>
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
    getUserList()
  }, [loginId, messageList])
  const getUserList = () => {
    axios
      .get(
        `https://monilyapp.yourhealthgrades.com/api/chat/getChatList?user_id=${loginId}`, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
      )
      .then(res => {
        let users = [];
        res?.data?.data.map(res => {
          console.log(res);
          if (res?.from_id == loginId && res?.to_id == loginId) {
            return
          }
          else {
            users.push(res);
          }
        });
        setRecentUsers(users);
      })
      .catch(err => {
        console.log(err);
      });
  }
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
          }
        });
        setSearchUser(arr)
      })
      .catch(err => {
        setminiLoader(false)
        console.log(err);
      });
  }
  const successNotification = (e) => {
    if (e.to_id == loginId &&
      e.from_id == toId &&
      e.to_id != toId) {
      addNotification({
        title: 'Message',
        message: e.message,
        theme: 'darkblue',
        native: true // when using native, your OS will handle theming.
      });
    }

  };
  return (
    <div className='container'>
      <Notifications />
      <div className='row'>
        <div className='col-lg-2'>
          <div className='position-relative'>
            <Select
              options={searchUser}
              onChange={e => { getChat(e) }}
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
                {
                  loading ?
                    <div className='d-flex justify-content-center align-items-center h-100'>
                      <div className='loadingBig'>
                      </div>
                    </div>
                    :
                    <>
                      <div className='header'>
                        <div className='profile d-flex align-items-center'>
                          <div className='profileImg d-flex justify-content-center align-items-center'>
                            {
                              console.log(profileName?.hasOwnProperty('to_name') ? (profileName?.from_id == loginId && profileName?.to_id != loginId ? profileName?.to_name?.substring(0, 1) : profileName?.from_name?.substring(0, 1)) : profileName?.hasOwnProperty('label') ? profileName?.label?.substring(0, 1) : null)
                            }
                            <p>{profileName?.hasOwnProperty('to_name') ? (profileName?.from_id == loginId && profileName?.to_id != loginId ? profileName?.to_name?.substring(0, 1) : profileName?.from_name?.substring(0, 1)) : profileName?.hasOwnProperty('label') ? profileName?.label?.substring(0, 1) : null}</p>
                          </div>
                          <p>{profileName?.hasOwnProperty('to_name') ? (profileName?.from_id == loginId && profileName?.to_id != loginId ? profileName?.to_name : profileName?.from_name) : profileName?.hasOwnProperty('label') ? profileName?.label : null}</p>
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
                }
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
