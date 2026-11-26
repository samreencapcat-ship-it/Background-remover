import { removeBackground, type Config } from '@imgly/background-removal';
import type {
  ImageDimensions,
  ModelPrecision,
  ProcessingProgress,
} from '../types/bgRemover';

const ACCEPTED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]);

const ACCEPTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

const CDN_PUBLIC_PATHS = [
  undefined, // Default staticimgly.com CDN built into @imgly/background-removal
  'https://unpkg.com/@imgly/background-removal-data@1.7.0/dist/',
  'https://cdn.jsdelivr.net/npm/@imgly/background-removal-data@1.7.0/dist/',
];

export function validateImageFile(file: File): string | null {
  const lowerName = file.name.toLowerCase();
  const hasValidExtension = ACCEPTED_EXTENSIONS.some((ext) =>
    lowerName.endsWith(ext)
  );
  const hasValidMime = ACCEPTED_MIME_TYPES.has(file.type.toLowerCase());

  if (!hasValidMime && !hasValidExtension) {
    return 'Unsupported file format. Please upload a JPG, JPEG, PNG, or WEBP image.';
  }

  const maxSizeBytes = 25 * 1024 * 1024; // 25 MB
  if (file.size > maxSizeBytes) {
    return 'File is larger than 25 MB. Please choose a smaller image for fast browser processing.';
  }

  return null;
}

export function formatBytes(bytes: number): string {
  if (bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );
  const value = bytes / Math.pow(1024, index);
  return `${value >= 10 || index === 0 ? Math.round(value) : value.toFixed(1)} ${units[index]}`;
}

export function getImageDimensions(url: string): Promise<ImageDimensions> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height,
      });
    };
    img.onerror = () => {
      reject(new Error('Could not decode image dimensions.'));
    };
    img.src = url;
  });
}

function mapProgressStage(key: string, current: number, total: number): ProcessingProgress {
  const safeTotal = total > 0 ? total : 1;
  const ratio = Math.min(1, Math.max(0, current / safeTotal));

  if (key.startsWith('fetch:')) {
    const pct = Math.round(5 + ratio * 45);
    return {
      stageLabel: 'Downloading AI segmentation model weights (cached after first use)…',
      percent: pct,
    };
  }

  switch (key) {
    case 'compute:decode':
      return { stageLabel: 'Preparing image tensor…', percent: 55 };
    case 'compute:inference':
      return { stageLabel: 'Running neural network subject segmentation…', percent: 72 };
    case 'compute:mask':
      return { stageLabel: 'Refining edges and foreground alpha mask…', percent: 88 };
    case 'compute:encode':
      return {
        stageLabel: 'Encoding high-quality transparent PNG…',
        percent: current >= total ? 100 : 95,
      };
    default:
      return {
        stageLabel: 'Processing image with AI…',
        percent: Math.round(50 + ratio * 45),
      };
  }
}

export async function runAiBackgroundRemoval(
  sourceBlob: Blob,
  model: ModelPrecision,
  onProgress?: (progress: ProcessingProgress) => void
): Promise<Blob> {
  let lastError: unknown = null;

  for (const publicPath of CDN_PUBLIC_PATHS) {
    try {
      const config: Config = {
        model,
        ...(publicPath ? { publicPath } : {}),
        output: {
          format: 'image/png',
          quality: 1,
        },
        progress: (key: string, current: number, total: number) => {
          onProgress?.(mapProgressStage(key, current, total));
        },
      };

      const resultBlob = await removeBackground(sourceBlob, config);
      onProgress?.({ stageLabel: 'Completed', percent: 100 });
      return resultBlob;
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error('AI background removal failed to load model resources.');
}

export async function createCompositePngBlob(
  transparentUrl: string,
  backgroundColor: string | null
): Promise<Blob> {
  const img = new Image();
  img.crossOrigin = 'anonymous';

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error('Failed to load processed image for export.'));
    img.src = transparentUrl;
  });

  const width = img.naturalWidth || img.width;
  const height = img.naturalHeight || img.height;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not initialize 2D canvas context.');
  }

  if (backgroundColor) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);
  } else {
    ctx.clearRect(0, 0, width, height);
  }

  ctx.drawImage(img, 0, 0, width, height);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Failed to generate PNG output.'));
          return;
        }
        resolve(blob);
      },
      'image/png',
      1.0
    );
  });
}

export function buildDownloadFilename(originalName: string, suffix: string): string {
  const stripped = originalName.replace(/\.[^/.]+$/, '');
  const cleanBase = stripped.replace(/[^a-zA-Z0-9_-]+/g, '-').replace(/^-|-$/g, '') || 'image';
  return `${cleanBase}-${suffix}.png`;
}
