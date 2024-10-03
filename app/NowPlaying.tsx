"use client"; 
import React, { useEffect, useRef, useState } from "react";
// @ts-ignore
import YouTubePlayer from "youtube-player";

// Video list
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

  useEffect(() => {
    if (!videoPlayerRef.current) return;

    const playerInstance = YouTubePlayer(videoPlayerRef.current);

    setPlayer(playerInstance);

    // Load the first video when the player is ready
    playerInstance.loadVideoById(videoIds[currentVideoIndex].extractedId);
    playerInstance.playVideo();

    // Handle state changes in the YouTube player
    const eventHandler = (event: any) => {
      if (event.data === 0) {
        // When video ends, play the next one
        playNext();
      }
    };

    playerInstance.on("stateChange", eventHandler);

    return () => {
      playerInstance.destroy();
    };
  }, [currentVideoIndex]);

  const playNext = () => {
    setPlayNextLoader(true);
    setTimeout(() => {
      const nextIndex = (currentVideoIndex + 1) % videoIds.length;
      setCurrentVideoIndex(nextIndex);

      // Load the next video
      if (player) {
        player.loadVideoById(videoIds[nextIndex].extractedId);
        player.playVideo();
      }

      setPlayNextLoader(false);
    }, 1000); // Simulate a short loading delay
  };

  return (
    <div className="space-y-4">
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
    </div>
  );
}
