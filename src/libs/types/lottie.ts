import { UploadStatus } from './upload';

export type LottieMetadata = {
  author?: string;
  description?: string;
  // generator which generated the lottie animation
  generator?: string;
  // Dimensions of the lottie animation
  width?: number;
  height?: number;
  // Frame rate of the lottie animation
  frameRate?: number;
  // Number of layers in the lottie animation
  layerCount?: number;
  // Number of frames in the lottie animation
  totalFrames?: number;
  // Duration of the lottie animation in seconds
  duration?: number;
  // user allotted filename
  userFilename?: string;
};

export type Lottie = {
  _id: string;
  animationId: string;
  url: string;
  filename: string;
  filesize: number;
  uploadStatus: UploadStatus;
  metadata: LottieMetadata;
};

export type LottieSignedUploadURL = {
  generateUploadLottieURL: Lottie;
};

export type LottieUploadURLInput = {
  input: {
    filename: string;
    filesize: number;
  };
};

export type LottieMetadataInput = {
  input: {
    animationId: Lottie['animationId'];
    filename: Lottie['filename'];
    _id: Lottie['_id'];
  };
};
