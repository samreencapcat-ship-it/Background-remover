export type ModelPrecision = 'isnet_quint8' | 'isnet_fp16' | 'isnet';

export type BackgroundPresetId =
  | 'transparent'
  | 'white'
  | 'black'
  | 'red'
  | 'blue'
  | 'custom';

export type ComparisonMode = 'side-by-side' | 'slider';

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface LoadedImageInfo {
  fileName: string;
  fileSize: number;
  mimeType: string;
  objectUrl: string;
  dimensions: ImageDimensions;
  sourceBlob: Blob;
}

export interface RemovalResult {
  transparentBlob: Blob;
  transparentUrl: string;
  processingTimeMs: number;
  modelUsed: ModelPrecision;
}

export interface SampleImageItem {
  id: string;
  label: string;
  category: string;
  src: string;
  fileName: string;
}

export interface ProcessingProgress {
  stageLabel: string;
  percent: number;
}
