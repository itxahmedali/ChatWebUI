import logo from './logo.svg';
import './App.css';
import { Button, Container, Row, Col } from 'react-bootstrap';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';
import { useState } from 'react';
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
  const [profileName, setprofileName] = useState(null)
  const UserButton = users?.map((e, i) => {
    return (
      <button key={i} className='btn' onClick={() => setprofileName(e.name)}>
        <div className='profile d-flex align-items-center'>
          <div className='profileImg d-flex justify-content-center align-items-center'>
            <p>{e.name.substring(0, 1)}</p>
          </div>
          <p>{e.name}</p>
        </div>
      </button>
    )
  })
  return (
    <div className='container'>
      <div className='row'>
        <div className='col-lg-2'>
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
                  <div className='sender'>
                    <p>hello i'm Ahmed</p>
                    <div className='time'>
                      <p>12:00 pm</p>
                    </div>
                  </div>
                  <div className='reciever'>
                    <p>hello i'm Ali</p>
                    <div className='time'>
                      <p>12:00 pm</p>
                    </div>
                  </div>
                </div>
                <div className='footer'>
                  <textarea></textarea>
                </div>
              </>
              : <div className='d-flex justify-content-center align-items-center w-100 h-100'>
                <p>Hello</p>
              </div>
          }
        </div>
      </div>
    </div>
  );
}

export default App;
