import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios'
import Profile from './profile'
import TopType from './TopType'
function App() {

  const CLIENT_ID = "33285a8d70574a9d8fc4bf12e8f209eb"
  const REDIRECT_URI = "http://localhost:3000"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const SCOPE = "user-top-read"; // Add the user-top-read scope here

  const RESPONSE_TYPE = "token"
  const [token, setToken] = useState('')
  const [searchKey, setSearchKey] = useState('')
  const [artists, setArtists] = useState([])
  const [activeComponent, setActiveComponent] = useState(null);
  const [activeType, setActiveType] = useState('artists');
  const [activePeriod, setActivePeriod] = useState('long_term');




  useEffect(() => {
    const hash = window.location.hash
    let token = window.localStorage.getItem("token")

    if (!token && hash) {
      console.log("hash", hash)
      token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

      window.location.hash = ""
      window.localStorage.setItem("token", token)
    }

    setToken(token)
  }, [])

  const logout = () => {
    setToken("")
    setArtists([])
    setActiveComponent(null)
    window.localStorage.removeItem("token")
  }

  return (
    <div className="App">
      <div className="title">  Trends Tracker  </div>
      <header className="App-header">

        {!token ?
          <div className='login-container'>
            <div className="login-button" onClick={() => window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPE}&response_type=${RESPONSE_TYPE}`}>
              Login
            </div>
          </div>
          : <div>
            <div className="profile"><Profile token={token} /> </div>
            <div onClick={logout} className="logout-button">Logout</div>
          </div>}

        {token ?
          <div>
            {activeComponent ?
              <div className='back-button' onClick={() => setActiveComponent(null)}>Back</div>
              :
              (
                <div className='get-top'>
                  <div className="dropdowns">
                    <select
                      value={activeType}
                      onChange={(e) => setActiveType(e.target.value)}
                    >
                      <option value="artists">Top Artists</option>
                      <option value="tracks">Top Tracks</option>
                    </select>
                    <select
                      value={activePeriod}
                      onChange={(e) => setActivePeriod(e.target.value)}
                    >
                      <option value="long_term">All Time</option>
                      <option value="medium_term">Last 6 Months</option>
                      <option value="short_term">Last 3 Months</option>
                    </select>
                  </div>
                  <div className="top-button" onClick={() => setActiveComponent(<TopType timeRange={activePeriod} type={activeType} token={token} />)}>Get</div>
                </div>
              )
            }
          </div>
          : null
        }

        <div className='component-flex'>{activeComponent} </div>
      </header>
    </div>
  );
}

export default App;

