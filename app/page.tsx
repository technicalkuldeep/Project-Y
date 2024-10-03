// app/page.tsx

import NowPlaying from "./NowPlaying";

export default function Home() {
  return (
    <div>
      <h1>Welcome to the Video Player</h1>
      <NowPlaying />
    </div>
  );
}
