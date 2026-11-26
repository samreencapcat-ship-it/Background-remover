import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type RefObject,
} from 'react';
import {
  AlertCircle,
  Check,
  Columns2,
  Download,
  ImagePlus,
  Loader2,
  Palette,
  RotateCcw,
  SlidersHorizontal,
  Upload,
  Wand2,
} from 'lucide-react';
import {
  BACKGROUND_PRESETS,
  QUICK_CUSTOM_SWATCHES,
  SAMPLE_IMAGES,
} from '../data/siteData';
import type {
  BackgroundPresetId,
  ComparisonMode,
  LoadedImageInfo,
  ModelPrecision,
  ProcessingProgress,
  RemovalResult,
  SampleImageItem,
} from '../types/bgRemover';
import {
  buildDownloadFilename,
  createCompositePngBlob,
  formatBytes,
  getImageDimensions,
  runAiBackgroundRemoval,
  validateImageFile,
} from '../utils/imageProcessing';

interface BackgroundRemoverToolProps {
  fileInputRef: RefObject<HTMLInputElement | null>;
}

const PRECISION_OPTIONS: { id: ModelPrecision; label: string; hint: string }[] = [
  { id: 'isnet_quint8', label: 'Fast', hint: 'Quick 8-bit model' },
  { id: 'isnet_fp16', label: 'Balanced', hint: 'Recommended precision' },
  { id: 'isnet', label: 'Studio HD', hint: 'Maximum edge detail' },
];

export function BackgroundRemoverTool({ fileInputRef }: BackgroundRemoverToolProps) {
  const [loadedImage, setLoadedImage] = useState<LoadedImageInfo | null>(null);
  const [removalResult, setRemovalResult] = useState<RemovalResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [justDownloaded, setJustDownloaded] = useState(false);
  const [progress, setProgress] = useState<ProcessingProgress>({
    stageLabel: 'Initializing AI model…',
    percent: 0,
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [modelPrecision, setModelPrecision] = useState<ModelPrecision>('isnet_fp16');
  const [comparisonMode, setComparisonMode] = useState<ComparisonMode>('side-by-side');
  const [sliderPosition, setSliderPosition] = useState(50);

  const [selectedPreset, setSelectedPreset] = useState<BackgroundPresetId>('transparent');
  const [customColor, setCustomColor] = useState('#7C3AED');
  const [hexInput, setHexInput] = useState('#7C3AED');

  const activeJobIdRef = useRef(0);
  const loadedUrlRef = useRef<string | null>(null);
  const resultUrlRef = useRef<string | null>(null);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (loadedUrlRef.current) URL.revokeObjectURL(loadedUrlRef.current);
      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    };
  }, []);

  const activeBackgroundHex = useMemo<string | null>(() => {
    if (selectedPreset === 'transparent') return null;
    if (selectedPreset === 'custom') return customColor;
    const preset = BACKGROUND_PRESETS.find((p) => p.id === selectedPreset);
    return preset?.hex ?? null;
  }, [selectedPreset, customColor]);

  const executeBackgroundRemoval = useCallback(
    async (sourceBlob: Blob, precision: ModelPrecision) => {
      const jobId = ++activeJobIdRef.current;
      setIsProcessing(true);
      setErrorMessage(null);
      setProgress({
        stageLabel: 'Preparing AI segmentation model…',
        percent: 8,
      });

      const startedAt = performance.now();

      try {
        const transparentBlob = await runAiBackgroundRemoval(
          sourceBlob,
          precision,
          (nextProgress) => {
            if (activeJobIdRef.current === jobId) {
              setProgress(nextProgress);
            }
          }
        );

        if (activeJobIdRef.current !== jobId) return;

        if (resultUrlRef.current) {
          URL.revokeObjectURL(resultUrlRef.current);
        }
        const transparentUrl = URL.createObjectURL(transparentBlob);
        resultUrlRef.current = transparentUrl;

        setRemovalResult({
          transparentBlob,
          transparentUrl,
          processingTimeMs: Math.round(performance.now() - startedAt),
          modelUsed: precision,
        });
      } catch (err) {
        if (activeJobIdRef.current !== jobId) return;
        const message =
          err instanceof Error
            ? err.message
            : 'Background removal encountered an unexpected error.';
        setErrorMessage(
          `AI processing could not complete: ${message} Check your internet connection so the browser can download the AI model weights, then click Remove Background to retry.`
        );
      } finally {
        if (activeJobIdRef.current === jobId) {
          setIsProcessing(false);
        }
      }
    },
    []
  );

  const loadBlobIntoWorkspace = useCallback(
    async (
      blob: Blob,
      fileName: string,
      mimeType: string,
      autoProcess = true
    ) => {
      setErrorMessage(null);
      setJustDownloaded(false);

      if (loadedUrlRef.current) {
        URL.revokeObjectURL(loadedUrlRef.current);
      }
      if (resultUrlRef.current) {
        URL.revokeObjectURL(resultUrlRef.current);
        resultUrlRef.current = null;
      }

      const objectUrl = URL.createObjectURL(blob);
      loadedUrlRef.current = objectUrl;

      try {
        const dimensions = await getImageDimensions(objectUrl);
        const imageInfo: LoadedImageInfo = {
          fileName,
          fileSize: blob.size,
          mimeType,
          objectUrl,
          dimensions,
          sourceBlob: blob,
        };

        setLoadedImage(imageInfo);
        setRemovalResult(null);

        if (autoProcess) {
          await executeBackgroundRemoval(blob, modelPrecision);
        }
      } catch (err) {
        URL.revokeObjectURL(objectUrl);
        loadedUrlRef.current = null;
        setErrorMessage(
          err instanceof Error
            ? err.message
            : 'Unable to read this image file. Please try another JPG, PNG, or WEBP file.'
        );
      }
    },
    [executeBackgroundRemoval, modelPrecision]
  );

  const handleFileSelection = useCallback(
    async (file: File) => {
      const validationError = validateImageFile(file);
      if (validationError) {
        setErrorMessage(validationError);
        return;
      }
      await loadBlobIntoWorkspace(file, file.name, file.type || 'image/png', true);
    },
    [loadBlobIntoWorkspace]
  );

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      void handleFileSelection(file);
    }
    e.target.value = '';
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      void handleFileSelection(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  // Support Ctrl+V / Cmd+V image paste anywhere on page
  useEffect(() => {
    const onPaste = (event: ClipboardEvent) => {
      const items = event.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const pastedFile = item.getAsFile();
          if (pastedFile) {
            void handleFileSelection(pastedFile);
            const toolEl = document.getElementById('tool');
            toolEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            break;
          }
        }
      }
    };

    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, [handleFileSelection]);

  const handleSampleClick = async (sample: SampleImageItem) => {
    setErrorMessage(null);
    try {
      const response = await fetch(sample.src);
      if (!response.ok) {
        throw new Error('Could not load sample image.');
      }
      const blob = await response.blob();
      await loadBlobIntoWorkspace(blob, sample.fileName, blob.type || 'image/jpeg', true);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Unable to load sample image.'
      );
    }
  };

  const handleRemoveBackgroundClick = () => {
    if (!loadedImage || isProcessing) return;
    void executeBackgroundRemoval(loadedImage.sourceBlob, modelPrecision);
  };

  const handleReset = () => {
    activeJobIdRef.current += 1;
    if (loadedUrlRef.current) {
      URL.revokeObjectURL(loadedUrlRef.current);
      loadedUrlRef.current = null;
    }
    if (resultUrlRef.current) {
      URL.revokeObjectURL(resultUrlRef.current);
      resultUrlRef.current = null;
    }

    setLoadedImage(null);
    setRemovalResult(null);
    setIsProcessing(false);
    setErrorMessage(null);
    setJustDownloaded(false);
    setProgress({ stageLabel: 'Ready', percent: 0 });
    setSelectedPreset('transparent');
    setComparisonMode('side-by-side');
    setSliderPosition(50);
  };

  const handleDownloadPng = async () => {
    if (!removalResult || !loadedImage || isExporting) return;

    setIsExporting(true);
    setErrorMessage(null);
    try {
      const exportBlob = await createCompositePngBlob(
        removalResult.transparentUrl,
        activeBackgroundHex
      );

      const suffix =
        selectedPreset === 'transparent'
          ? 'no-bg'
          : selectedPreset === 'custom'
            ? `bg-${customColor.replace('#', '').toLowerCase()}`
            : `bg-${selectedPreset}`;

      const downloadUrl = URL.createObjectURL(exportBlob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = buildDownloadFilename(loadedImage.fileName, suffix);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);

      setJustDownloaded(true);
      setTimeout(() => setJustDownloaded(false), 2600);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Could not export PNG file.'
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleCustomColorPick = (value: string) => {
    const normalized = value.toUpperCase();
    setCustomColor(normalized);
    setHexInput(normalized);
    setSelectedPreset('custom');
  };

  const handleHexInputChange = (raw: string) => {
    setHexInput(raw);
    const cleaned = raw.startsWith('#') ? raw : `#${raw}`;
    if (/^#[0-9A-Fa-f]{6}$/.test(cleaned)) {
      setCustomColor(cleaned.toUpperCase());
      setSelectedPreset('custom');
    }
  };

  return (
    <section id="tool" className="scroll-mt-20 bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#6d28d9]">
              Background Remover Studio
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-[#161124] sm:text-3xl [text-wrap:balance]">
              Upload your image and isolate the subject
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#5b5273]">
            <span>AI Precision</span>
            <div
              role="group"
              aria-label="AI segmentation precision"
              className="inline-flex items-center rounded-lg border border-[#e5def6] bg-[#faf9fe] p-1"
            >
              {PRECISION_OPTIONS.map((opt) => {
                const active = modelPrecision === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    title={opt.hint}
                    onClick={() => setModelPrecision(opt.id)}
                    className={`min-h-[34px] cursor-pointer rounded-md px-3 py-1 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                      active
                        ? 'bg-white text-[#6d28d9] shadow-xs'
                        : 'text-[#5b5273] hover:text-[#161124]'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Hidden file input shared with Hero CTA */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
          onChange={handleFileInputChange}
          className="sr-only"
          aria-label="Choose an image file in JPG, JPEG, PNG, or WEBP format"
        />

        {/* Error Alert Banner */}
        {errorMessage && (
          <div
            role="alert"
            className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-900"
          >
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
            <div className="flex-1">
              <p className="font-medium">{errorMessage}</p>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-xs font-semibold text-red-700 underline underline-offset-2 hover:text-red-900"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Workspace Container */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-[#e4dcf6] bg-[#fcfbfe] shadow-xs">
          {!loadedImage ? (
            /* Empty State: Drag & Drop Uploader + Sample Picker */
            <div className="p-5 sm:p-8 lg:p-10">
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
                aria-label="Drop an image here or press Enter to browse files"
                className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 text-center transition-all duration-150 sm:py-16 ${
                  isDragging
                    ? 'border-[#7c3aed] bg-[#f3eeff]'
                    : 'border-[#d6cbed] bg-white hover:border-[#8b5cf6] hover:bg-[#faf8ff]'
                }`}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-purple-700 text-white shadow-sm shadow-violet-600/25">
                  <ImagePlus className="h-7 w-7" />
                </div>

                <h3 className="mt-5 font-display text-lg font-bold text-[#161124] sm:text-xl">
                  {isDragging
                    ? 'Drop your image to remove background'
                    : 'Drag & drop your image here'}
                </h3>
                <p className="mt-2 max-w-md text-sm text-[#5b5273]">
                  Or browse files from your device. Paste from clipboard with{' '}
                  <kbd className="rounded border border-[#ded6f2] bg-[#faf9fe] px-1.5 py-0.5 font-mono text-xs text-[#3b2f5c]">
                    Ctrl+V
                  </kbd>
                  .
                </p>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <span className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-violet-600/20">
                    <Upload className="h-4 w-4" />
                    Browse Files
                  </span>
                </div>

                <p className="mt-4 text-xs font-medium text-[#70668c]">
                  JPG · JPEG · PNG · WEBP — Max 25 MB
                </p>
              </div>

              {/* Sample Images Strip */}
              <div className="mt-7 border-t border-[#ece7f8] pt-6">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm font-semibold text-[#161124]">
                    No photo handy? Try one click on a sample image
                  </p>
                  <span className="text-xs text-[#645a80]">
                    Runs the real AI background remover instantly
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                  {SAMPLE_IMAGES.map((sample) => (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => void handleSampleClick(sample)}
                      className="group cursor-pointer overflow-hidden rounded-xl border border-[#e5def6] bg-white text-left transition-all duration-150 hover:border-[#8b5cf6] hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2"
                    >
                      <div className="aspect-[4/3] w-full overflow-hidden bg-[#f4f1fb]">
                        <img
                          src={sample.src}
                          alt={`${sample.label} sample for AI background removal`}
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
                        />
                      </div>
                      <div className="flex items-center justify-between px-3 py-2.5">
                        <span className="text-xs font-semibold text-[#161124] sm:text-sm">
                          {sample.label}
                        </span>
                        <span className="text-xs text-[#6d28d9]">{sample.category}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Loaded Image Editor & Side-by-Side Workspace */
            <div className="p-4 sm:p-6 lg:p-8">
              {/* Top Action Toolbar */}
              <div className="flex flex-col gap-3 border-b border-[#ece7f8] pb-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={handleRemoveBackgroundClick}
                    disabled={isProcessing}
                    className="inline-flex min-h-[44px] cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-violet-600/20 transition-all duration-150 hover:from-violet-700 hover:via-purple-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 whitespace-nowrap shrink-0"
                  >
                    {isProcessing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Wand2 className="h-4 w-4" />
                    )}
                    {isProcessing ? 'Removing Background…' : 'Remove Background'}
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessing}
                    className="inline-flex min-h-[44px] cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#ddd5f3] bg-white px-4 py-2.5 text-sm font-medium text-[#161124] transition-colors hover:bg-[#f7f4ff] disabled:cursor-not-allowed disabled:opacity-50 whitespace-nowrap shrink-0"
                  >
                    <Upload className="h-4 w-4 text-[#6d28d9]" />
                    Upload Another
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex min-h-[44px] cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#ddd5f3] bg-white px-4 py-2.5 text-sm font-medium text-[#4a4162] transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-700 whitespace-nowrap shrink-0"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* View Mode Switch */}
                  <div
                    role="group"
                    aria-label="Preview layout mode"
                    className="inline-flex items-center rounded-xl border border-[#e5def6] bg-white p-1"
                  >
                    <button
                      type="button"
                      onClick={() => setComparisonMode('side-by-side')}
                      className={`inline-flex min-h-[36px] cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                        comparisonMode === 'side-by-side'
                          ? 'bg-[#f3eeff] text-[#6d28d9]'
                          : 'text-[#5b5273] hover:text-[#161124]'
                      }`}
                    >
                      <Columns2 className="h-3.5 w-3.5" />
                      Side by Side
                    </button>
                    <button
                      type="button"
                      onClick={() => setComparisonMode('slider')}
                      className={`inline-flex min-h-[36px] cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                        comparisonMode === 'slider'
                          ? 'bg-[#f3eeff] text-[#6d28d9]'
                          : 'text-[#5b5273] hover:text-[#161124]'
                      }`}
                    >
                      <SlidersHorizontal className="h-3.5 w-3.5" />
                      Split Slider
                    </button>
                  </div>

                  {/* Download High-Quality PNG CTA */}
                  <button
                    type="button"
                    onClick={() => void handleDownloadPng()}
                    disabled={!removalResult || isProcessing || isExporting}
                    className="inline-flex min-h-[44px] cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#5b21b6] via-[#7c3aed] to-[#6d28d9] px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-purple-700/20 transition-all duration-150 hover:from-[#4c1d95] hover:via-[#6d28d9] hover:to-[#5b21b6] disabled:cursor-not-allowed disabled:opacity-45 whitespace-nowrap shrink-0"
                  >
                    {isExporting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : justDownloaded ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                    {isExporting
                      ? 'Preparing PNG…'
                      : justDownloaded
                        ? 'PNG Downloaded'
                        : 'Download PNG'}
                  </button>
                </div>
              </div>

              {/* AI Progress Bar */}
              {isProcessing && (
                <div
                  aria-live="polite"
                  className="mt-5 rounded-xl border border-[#e5def6] bg-white p-4"
                >
                  <div className="flex items-center justify-between gap-4 text-xs sm:text-sm">
                    <span className="font-medium text-[#161124]">
                      {progress.stageLabel}
                    </span>
                    <span className="font-mono font-semibold text-[#6d28d9]">
                      {progress.percent}%
                    </span>
                  </div>
                  <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-[#efeafc]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 transition-all duration-200"
                      style={{ width: `${Math.max(8, progress.percent)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Preview Area: Side by Side OR Split Slider */}
              {comparisonMode === 'side-by-side' ? (
                <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
                  {/* Original Image Card */}
                  <div className="overflow-hidden rounded-xl border border-[#e5def6] bg-white">
                    <div className="flex items-center justify-between border-b border-[#ece7f8] px-4 py-3">
                      <span className="text-sm font-semibold text-[#161124]">
                        Original Image
                      </span>
                      <span className="font-mono text-xs text-[#645a80]">
                        {loadedImage.dimensions.width} × {loadedImage.dimensions.height} px ·{' '}
                        {formatBytes(loadedImage.fileSize)}
                      </span>
                    </div>
                    <div className="flex aspect-[4/3] w-full items-center justify-center bg-[#f6f4fb] p-3 sm:p-4">
                      <img
                        src={loadedImage.objectUrl}
                        alt={`Original uploaded photo: ${loadedImage.fileName}`}
                        referrerPolicy="no-referrer"
                        className="max-h-full max-w-full rounded-lg object-contain"
                      />
                    </div>
                  </div>

                  {/* Background Removed Card */}
                  <div className="overflow-hidden rounded-xl border border-[#e5def6] bg-white">
                    <div className="flex items-center justify-between border-b border-[#ece7f8] px-4 py-3">
                      <span className="text-sm font-semibold text-[#161124]">
                        Background Removed
                      </span>
                      <span className="font-mono text-xs text-[#6d28d9]">
                        {removalResult
                          ? `PNG · ${formatBytes(removalResult.transparentBlob.size)} · ${(
                              removalResult.processingTimeMs / 1000
                            ).toFixed(1)}s`
                          : isProcessing
                            ? 'Processing…'
                            : 'Ready'}
                      </span>
                    </div>

                    <div
                      className={`relative flex aspect-[4/3] w-full items-center justify-center p-3 sm:p-4 transition-colors duration-150 ${
                        activeBackgroundHex === null ? 'checkerboard-bg' : ''
                      }`}
                      style={
                        activeBackgroundHex
                          ? { backgroundColor: activeBackgroundHex }
                          : undefined
                      }
                    >
                      {removalResult ? (
                        <img
                          src={removalResult.transparentUrl}
                          alt="Subject with background removed"
                          referrerPolicy="no-referrer"
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : isProcessing ? (
                        <div className="flex flex-col items-center gap-3 rounded-xl bg-white/90 px-6 py-5 text-center shadow-sm backdrop-blur-xs">
                          <Loader2 className="h-7 w-7 animate-spin text-[#6d28d9]" />
                          <p className="text-sm font-medium text-[#161124]">
                            Isolating foreground subject…
                          </p>
                        </div>
                      ) : (
                        <div className="rounded-xl bg-white/90 px-5 py-4 text-center shadow-xs">
                          <p className="text-sm font-medium text-[#3b2f5c]">
                            Click <span className="font-semibold text-[#6d28d9]">Remove Background</span> above to generate the transparent cutout.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* Interactive Split Slider Comparison View */
                <div className="mt-5 overflow-hidden rounded-xl border border-[#e5def6] bg-white">
                  <div className="flex items-center justify-between border-b border-[#ece7f8] px-4 py-3 text-xs sm:text-sm">
                    <span className="font-semibold text-[#161124]">
                      Left: Original · Right: Background Removed
                    </span>
                    <span className="font-mono text-xs text-[#645a80]">
                      {loadedImage.dimensions.width} × {loadedImage.dimensions.height} px
                    </span>
                  </div>

                  <div
                    className={`relative mx-auto flex aspect-[4/3] max-h-[520px] w-full select-none items-center justify-center overflow-hidden ${
                      activeBackgroundHex === null ? 'checkerboard-bg' : ''
                    }`}
                    style={
                      activeBackgroundHex
                        ? { backgroundColor: activeBackgroundHex }
                        : undefined
                    }
                  >
                    {/* Right/Background layer: Removed Background */}
                    {removalResult ? (
                      <img
                        src={removalResult.transparentUrl}
                        alt="Processed image with background removed"
                        referrerPolicy="no-referrer"
                        className="pointer-events-none h-full w-full object-contain p-4"
                      />
                    ) : (
                      <div className="p-6 text-center text-sm font-medium text-[#5b5273]">
                        {isProcessing
                          ? 'Running AI background removal…'
                          : 'Click Remove Background to preview cutout'}
                      </div>
                    )}

                    {/* Left/Foreground clipped layer: Original */}
                    <div
                      className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#f6f4fb]"
                      style={{
                        clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
                      }}
                    >
                      <img
                        src={loadedImage.objectUrl}
                        alt="Original uploaded image"
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-contain p-4"
                      />
                    </div>

                    {/* Divider line */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-y-0 w-0.5 bg-[#7c3aed] shadow-sm"
                      style={{ left: `${sliderPosition}%` }}
                    >
                      <div className="absolute top-1/2 left-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-[#7c3aed] text-white shadow-md">
                        <SlidersHorizontal className="h-4 w-4" />
                      </div>
                    </div>

                    {/* Accessible Range Input Overlay */}
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={sliderPosition}
                      onChange={(e) => setSliderPosition(Number(e.target.value))}
                      aria-label="Comparison slider between original and background-removed image"
                      className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
                    />
                  </div>
                </div>
              )}

              {/* Background Color Editor */}
              <div className="mt-6 rounded-xl border border-[#e5def6] bg-white p-4 sm:p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f3eeff] text-[#6d28d9]">
                      <Palette className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h3 className="font-display text-sm font-bold text-[#161124] sm:text-base">
                        Background Color Editor
                      </h3>
                      <p className="text-xs text-[#5b5273]">
                        Keep transparent alpha or fill with White, Black, Red, Blue, or a custom color before downloading PNG.
                      </p>
                    </div>
                  </div>

                  {/* Preset Buttons + Custom Color Picker */}
                  <div className="flex flex-wrap items-center gap-2">
                    {BACKGROUND_PRESETS.map((preset) => {
                      const isActive = selectedPreset === preset.id;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => setSelectedPreset(preset.id)}
                          className={`inline-flex min-h-[42px] cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all duration-150 whitespace-nowrap shrink-0 ${
                            isActive
                              ? 'border-[#7c3aed] bg-[#f5f0ff] text-[#5b21b6] ring-1 ring-[#7c3aed]'
                              : 'border-[#e5def6] bg-white text-[#3b2f5c] hover:border-[#c4b5fd] hover:bg-[#faf9fe]'
                          }`}
                        >
                          <span
                            aria-hidden="true"
                            className={`h-4 w-4 rounded border border-black/15 ${
                              preset.hex === null ? 'checkerboard-bg' : ''
                            }`}
                            style={
                              preset.hex ? { backgroundColor: preset.hex } : undefined
                            }
                          />
                          {preset.label}
                        </button>
                      );
                    })}

                    {/* Custom Color Control */}
                    <div
                      className={`inline-flex min-h-[42px] items-center gap-2 rounded-lg border px-2.5 py-1 transition-all ${
                        selectedPreset === 'custom'
                          ? 'border-[#7c3aed] bg-[#f5f0ff] ring-1 ring-[#7c3aed]'
                          : 'border-[#e5def6] bg-white'
                      }`}
                    >
                      <label
                        htmlFor="custom-bg-color-picker"
                        className="cursor-pointer text-xs font-semibold text-[#3b2f5c] whitespace-nowrap"
                      >
                        Custom
                      </label>
                      <input
                        id="custom-bg-color-picker"
                        type="color"
                        value={customColor}
                        onChange={(e) => handleCustomColorPick(e.target.value)}
                        aria-label="Pick custom background color"
                        className="h-7 w-7 cursor-pointer rounded border border-[#ddd5f3] bg-transparent p-0"
                      />
                      <input
                        type="text"
                        value={hexInput}
                        onChange={(e) => handleHexInputChange(e.target.value)}
                        maxLength={7}
                        aria-label="Custom background hex color code"
                        placeholder="#7C3AED"
                        className="w-[74px] rounded border border-[#e5def6] bg-white px-2 py-1 font-mono text-xs text-[#161124] focus:border-[#7c3aed] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Quick Accent Swatches */}
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#f0ecf9] pt-3.5">
                  <span className="mr-1 text-xs font-medium text-[#645a80]">
                    Quick colors:
                  </span>
                  {QUICK_CUSTOM_SWATCHES.map((swatch) => {
                    const active =
                      selectedPreset === 'custom' &&
                      customColor.toUpperCase() === swatch.toUpperCase();
                    return (
                      <button
                        key={swatch}
                        type="button"
                        onClick={() => handleCustomColorPick(swatch)}
                        aria-label={`Apply background color ${swatch}`}
                        title={swatch}
                        className={`h-7 w-7 cursor-pointer rounded-md border transition-transform hover:scale-105 ${
                          active
                            ? 'border-[#5b21b6] ring-2 ring-[#7c3aed] ring-offset-1'
                            : 'border-black/15'
                        }`}
                        style={{ backgroundColor: swatch }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
