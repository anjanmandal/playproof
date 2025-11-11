export {};

declare global {
  interface Window {
    Pose?: {
      Pose: new (options?: { locateFile?: (file: string) => string }) => {
        setOptions(options: Record<string, unknown>): void;
        onResults(callback: (results: any) => void): void;
        send(input: { image: HTMLVideoElement }): Promise<void>;
        close(): void;
      };
      POSE_CONNECTIONS: Array<[number, number]>;
    };
    Camera?: {
      Camera: new (
        videoElement: HTMLVideoElement,
        options: { onFrame: () => Promise<void>; width?: number; height?: number },
      ) => {
        start(): Promise<void>;
        stop(): void;
      };
    };
    drawConnectors?: (
      ctx: CanvasRenderingContext2D,
      landmarks: any[],
      connections: Array<[number, number]>,
      options?: Record<string, unknown>,
    ) => void;
    drawLandmarks?: (
      ctx: CanvasRenderingContext2D,
      landmarks: any[],
      options?: Record<string, unknown>,
    ) => void;
  }
}
