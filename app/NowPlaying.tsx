"use client";
import React, { useEffect, useRef, useState } from "react";
// @ts-ignore
import YouTubePlayer from "youtube-player";

// Video list with IDs and titles
const videoIds = [
  { extractedId: "NQXE3iJCWNI", title: "Video 1" },
  { extractedId: "eMhc70Q8vJg", title: "Video 2" },
  { extractedId: "WMIkiRPcxhg", title: "Video 3" },
  { extractedId: "Z3NsXwRCGAA", title: "Video 4" },
  { extractedId: "gVFT9QBxOwo", title: "Video 5" },
];

export default function NowPlaying() {
  const videoPlayerRef = useRef<HTMLDivElement | null>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [playNextLoader, setPlayNextLoader] = useState(false);
  const [player, setPlayer] = useState<any>(null);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false); // Control when to show the player
  const [playlistEnded, setPlaylistEnded] = useState(false); // Control the end of playlist

  useEffect(() => {
    if (!videoPlayerRef.current || !showVideoPlayer) return;

    const playerInstance = YouTubePlayer(videoPlayerRef.current);

    setPlayer(playerInstance);

    // Load the current video when the player is ready
    playerInstance.loadVideoById(videoIds[currentVideoIndex].extractedId);
    playerInstance.playVideo();

    // Handle state changes in the YouTube player
    const eventHandler = (event: any) => {
      if (event.data === 0) {
        // When video ends, play the next one or end playlist
        playNext();
      }
    };

    playerInstance.on("stateChange", eventHandler);

    return () => {
      playerInstance.destroy();
    };
  }, [currentVideoIndex, showVideoPlayer]);

  const playNext = () => {
    if (currentVideoIndex + 1 === videoIds.length) {
      // End of the playlist
      setPlaylistEnded(true);
    } else {
      setPlayNextLoader(true);
      setTimeout(() => {
        const nextIndex = currentVideoIndex + 1;
        setCurrentVideoIndex(nextIndex);

        // Load the next video
        if (player) {
          player.loadVideoById(videoIds[nextIndex].extractedId);
          player.playVideo();
        }

        setPlayNextLoader(false);
      }, 1000); // Simulate a short loading delay
    }
  };

  // Function to start the first video when the button is clicked
  const startFirstVideo = () => {
    setShowVideoPlayer(true);
    if (player) {
      player.loadVideoById(videoIds[0].extractedId);
      player.playVideo();
    }
  };

  // Remaining videos list excluding the current one
  const remainingVideos = videoIds.slice(currentVideoIndex + 1);

  return (
    <div className="space-y-4">
      {!showVideoPlayer && !playlistEnded && (
        <>
          {/* Initially show the thumbnail of the first video */}
          <img
            src={`https://img.youtube.com/vi/${videoIds[0].extractedId}/hqdefault.jpg`}
            alt={videoIds[0].title}
            style={{ width: "100%", height: "400px", objectFit: "cover" }}
          />
          {/* Button to start playing the first video */}
          <button
            onClick={startFirstVideo}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "blue",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Play First Video
          </button>
        </>
      )}

      {showVideoPlayer && !playlistEnded && (
        <>
          {/* Show video player when play button is clicked */}
          <h2>Now Playing: {videoIds[currentVideoIndex].title}</h2>
          <div ref={videoPlayerRef} style={{ width: "100%", height: "400px" }} />
          <button
            disabled={playNextLoader}
            onClick={playNext}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "blue",
              color: "white",
              border: "none",
              cursor: playNextLoader ? "not-allowed" : "pointer",
            }}
          >
            {playNextLoader ? "Loading..." : "Play Next Video"}
          </button>

          {/* Display remaining videos as thumbnails below the current video */}
          <div className="remaining-videos">
            <h3>Up Next:</h3>
            <div style={{ display: "flex", gap: "10px", overflowX: "auto" }}>
              {remainingVideos.map((video, index) => (
                <div key={index}>
                  <img
                    src={`https://img.youtube.com/vi/${video.extractedId}/hqdefault.jpg`}
                    alt={video.title}
                    style={{ width: "150px", height: "100px", objectFit: "cover" }}
                  />
                  <p>{video.title}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Show a thank you message when all videos have been played */}
      {playlistEnded && (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <h1>Thank you for watching!</h1>
        </div>
      )}
    </div>
  );
}
