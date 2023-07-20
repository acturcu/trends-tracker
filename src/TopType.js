import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TopType.css";

function TopType({ timeRange, type, token }) {
    const [tracks, setTracks] = useState([]);

    useEffect(() => {
        const getTopTracks = async () => {

            const { data } = await axios.get(`https://api.spotify.com/v1/me/top/${type}?time_range=${timeRange}&limit=48`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                });
            setTracks(data.items);
        };

        getTopTracks();

        return () => {
            setTracks([]);
        }
    }, [timeRange, type, token]);

    const gridStyle = {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "10px",
        marginTop: "10px",
    };

    const trackStyle = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    };

    const imageStyle = {
        maxWidth: "200px",
        maxHeight: "200px",
        borderRadius: "10px",
        cursor: "pointer",
    };

    const getPeriod = (timeRange) => {
        switch (timeRange) {
            case "short_term":
                return "Last 3 Months";
            case "medium_term":
                return "Last 6 Months";
            case "long_term":
                return "All Time";
            default:
                return "All Time";
        }
    }
    return (type === "artists" ?
        <div className="top-title"> Top Artists {getPeriod(timeRange)}
            <div style={gridStyle}>
                {tracks.map((track) => (
                    <div key={track.id} style={trackStyle}>
                        <a href={track.external_urls.spotify} target="_blank" rel="noreferrer">
                            <img src={track.images[0].url} alt={track.name} style={imageStyle} />
                        </a>
                        <div className="track-name">{track.name}</div>
                    </div>
                ))}
            </div>
        </div>
        :
        <div className="top-title"> Top Songs {getPeriod(timeRange)}
            <div style={gridStyle}>
                {tracks.map((track) => (
                    <div key={track.id} style={trackStyle}>
                        <a href={track.external_urls.spotify} target="_blank" rel="noreferrer">
                            <img src={track.album.images[0].url} alt={track.name} style={imageStyle} />
                        </a>
                        <div className="track-name">{track.name}</div>
                    </div>
                ))}
            </div>
        </div>
    );

}
export default TopType;

