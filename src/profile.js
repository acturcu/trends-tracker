import React, {useEffect, useState} from 'react';
import axios from 'axios';
import './profile.css';

function Profile({token}) {
    const [name, setName] = useState('')
    const [images, setImages] = useState([])

    useEffect(() => {
        const getProfile = async () => {
          const { data } = await axios.get('https://api.spotify.com/v1/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setName(data.display_name);
          setImages(data.images);
        };
    
        getProfile();
      }, [token]);
    
      return (
        <div>
          
          {images.length > 0 && (
            <img src={images[0].url} alt={name} class="prof-image" />
          )}
          <div class="prof-name">{name}</div>
        </div>
      );
}

export default Profile;