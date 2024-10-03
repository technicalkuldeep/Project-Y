declare module 'youtube-player' {
    export default function YouTubePlayer(container: HTMLElement): {
      loadVideoById(videoId: string): void;
      playVideo(): void;
      pauseVideo(): void;
      stopVideo(): void;
      seekTo(seconds: number, allowSeekAhead: boolean): void;
      on(event: 'stateChange', callback: (event: any) => void): void;
      destroy(): void;
    };
  }
  