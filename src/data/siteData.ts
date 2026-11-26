import type { BackgroundPresetId, SampleImageItem } from '../types/bgRemover';

export const SAMPLE_IMAGES: SampleImageItem[] = [
  {
    id: 'sneaker',
    label: 'Sneaker',
    category: 'Product',
    src: '/src/assets/images/sample_product_sneaker_1795680811165.jpg',
    fileName: 'running-sneaker.jpg',
  },
  {
    id: 'portrait',
    label: 'Portrait',
    category: 'People',
    src: '/src/assets/images/sample_portrait_studio_1795680810687.jpg',
    fileName: 'studio-portrait.jpg',
  },
  {
    id: 'watch',
    label: 'Watch',
    category: 'Macro',
    src: '/src/assets/images/sample_luxury_watch_1795680811555.jpg',
    fileName: 'titanium-watch.jpg',
  },
  {
    id: 'cat',
    label: 'Tabby Cat',
    category: 'Animal',
    src: '/src/assets/images/sample_cat_portrait_1795680811730.jpg',
    fileName: 'ginger-cat.jpg',
  },
];

export interface BackgroundColorPreset {
  id: BackgroundPresetId;
  label: string;
  hex: string | null;
}

export const BACKGROUND_PRESETS: BackgroundColorPreset[] = [
  { id: 'transparent', label: 'Transparent', hex: null },
  { id: 'white', label: 'White', hex: '#FFFFFF' },
  { id: 'black', label: 'Black', hex: '#000000' },
  { id: 'red', label: 'Red', hex: '#EF4444' },
  { id: 'blue', label: 'Blue', hex: '#3B82F6' },
];

export const QUICK_CUSTOM_SWATCHES = [
  '#7C3AED',
  '#F3E8FF',
  '#10B981',
  '#F59E0B',
  '#EC4899',
  '#F1F5F9',
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    title: 'Upload or Drop Any Photo',
    description:
      'Drag and drop an image, browse from your phone or computer, or paste directly from your clipboard. Supports JPG, JPEG, PNG, and WEBP up to 25 MB.',
  },
  {
    step: '02',
    title: 'Automatic AI Subject Segmentation',
    description:
      'An on-device neural segmentation network analyzes foreground edges, hair, fur, and product contours in seconds without uploading your photo to external servers.',
  },
  {
    step: '03',
    title: 'Edit Backdrop & Download PNG',
    description:
      'Compare the original and cutout side by side on a transparent checkerboard, switch to White, Black, Red, Blue, or any custom hex color, and download a crisp PNG.',
  },
];

export const FAQ_ITEMS = [
  {
    question: 'Does Pic Background Remover AI use a real AI model?',
    answer:
      'Yes. It runs a real deep-learning image segmentation model (ISNet via ONNX Runtime Web) directly inside your browser. It produces genuine pixel-level alpha masks rather than simple color keying or simulated previews.',
  },
  {
    question: 'Do I need an API key or account registration?',
    answer:
      'No API key, credit card, or sign-up is required. Because the AI model runs directly in your browser using WebAssembly/WebGPU, everything works out of the box and can be hosted for free on static platforms like Vercel, Netlify, Cloudflare Pages, or GitHub Pages.',
  },
  {
    question: 'Which image formats are supported for upload and download?',
    answer:
      'You can upload JPG, JPEG, PNG, and WEBP images. After background removal, your edited image is exported as a full-resolution lossless PNG file—either with true alpha transparency or composited over your chosen background color.',
  },
  {
    question: 'Are my photos uploaded to a third-party server?',
    answer:
      'No. Your photos stay on your own device during segmentation and export. On the very first run, the browser downloads and caches the AI model weights locally so subsequent edits run even faster.',
  },
  {
    question: 'Can I replace the transparent background with solid colors?',
    answer:
      'Yes. Use the Background Color Editor right below the preview to switch between Transparent, White, Black, Red, Blue, curated swatches, or any custom hex color using the interactive color picker.',
  },
  {
    question: 'How well does it work on mobile phones?',
    answer:
      'The interface is built mobile-first with large touch controls, responsive side-by-side or split comparison views, and native photo library selection on iOS and Android browsers.',
  },
];
