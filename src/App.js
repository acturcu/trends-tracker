import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios'
import Profile from './profile'
function App() {

  const CLIENT_ID = "33285a8d70574a9d8fc4bf12e8f209eb"
  const REDIRECT_URI = "http://localhost:3000"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"
  const [token, setToken] = useState('')
  const [searchKey, setSearchKey] = useState('')
  const [artists, setArtists] = useState([])

  useEffect(() => {
    const hash = window.location.hash
    let token = window.localStorage.getItem("token")

    if (!token && hash) {
      token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]
      
      window.location.hash = ""
      window.localStorage.setItem("token", token)
    }

    setToken(token)
  }, [])

  const logout = () => {
    setToken("")
    setArtists([])
    window.localStorage.removeItem("token")
  }

  const searchArtists = async (e) => {
    e.preventDefault()
    const {data} = await axios.get("https://api.spotify.com/v1/search", {
      headers : {
        Authorization: `Bearer ${token}`
      },
      params: {
        q: searchKey,
        type: "artist"
      }
    })
    setArtists(data.artists.items)
  }
  
  const renderArtists = () => {
    const gridStyle = {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '10px',
    };
  
    const filteredArtists = artists.filter((artist) => artist.images.length > 0);
  
    const artistStyle = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    };
  
    const imageStyle = {
      maxWidth: '60%',
      maxHeight: '60%',
    };
  
    return (
      <div style={gridStyle}>
        {filteredArtists.map((artist) => (
          <div key={artist.id} style={artistStyle}>
            <img src={artist.images[0].url} alt={artist.name} style={imageStyle} />
            <div>{artist.name}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="App">
      <div class="title">  Trends Tracker  </div>
      <header className="App-header">
        
        {!token? 
          <div class="login-button" onClick={() => window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>
              Login
            </div>
          : <div>
              <div class="profile"><Profile token={token}/> </div>
              <div onClick={logout} class="logout-button">Logout</div>
            </div> }

        {token ?
          <form onSubmit={searchArtists}>
              <input type="text" onChange={e => setSearchKey(e.target.value)}/>
              <button type={"submit"}>Search</button>
          </form>
        
          : null
        }

        {renderArtists()}
      </header>
    </div>
  );
}

export default App;
