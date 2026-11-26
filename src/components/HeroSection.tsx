import { ArrowDown, Upload } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroSectionProps {
  onQuickUploadClick: () => void;
}

export function HeroSection({ onQuickUploadClick }: HeroSectionProps) {
  return (
    <section
      id="home"
      className="relative overflow-hidden border-b border-[#ece7f8] bg-gradient-to-b from-[#faf9fe] via-white to-white"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 h-96 w-[760px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-violet-200/45 via-purple-100/35 to-indigo-100/30 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left column: Headline, value prop, primary CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-center lg:col-span-6"
          >
            <p className="text-sm font-medium text-[#6d28d9]">
              On-Device AI Segmentation <span aria-hidden="true" className="mx-1.5 text-[#c4b5fd]">·</span> Zero Sign-Up Required
            </p>

            <h1
              className="mt-4 font-display font-extrabold tracking-tight text-[#161124] [text-wrap:balance]"
              style={{ fontSize: 'clamp(2.25rem, 4.1vw, 3.65rem)', lineHeight: 1.08 }}
            >
              Remove image backgrounds automatically in one click.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-[#524969] sm:text-lg">
              Upload any portrait, product, or pet photo and isolate the subject cleanly with real neural AI. Preview transparent cutouts side by side, swap solid backdrop colors, and export high-quality PNG files right in your browser.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={onQuickUploadClick}
                className="inline-flex min-h-[48px] cursor-pointer items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-md shadow-violet-600/25 transition-all duration-150 hover:from-violet-700 hover:via-purple-700 hover:to-indigo-700 active:scale-[0.99] whitespace-nowrap shrink-0"
              >
                <Upload className="h-4.5 w-4.5" />
                Upload Image
              </button>

              <a
                href="#tool"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-[#ddd5f3] bg-white px-5 py-3 text-base font-medium text-[#161124] transition-colors duration-150 hover:border-[#b9a7ea] hover:bg-[#f7f4ff] whitespace-nowrap shrink-0"
              >
                Try Sample Photos
                <ArrowDown className="h-4 w-4 text-[#6d28d9]" />
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[#ece7f8] pt-6 text-xs font-medium text-[#645a80]">
              <span>Supports JPG, JPEG, PNG &amp; WEBP</span>
              <span aria-hidden="true" className="text-[#c4b5fd]">·</span>
              <span>Lossless Transparent PNG Output</span>
              <span aria-hidden="true" className="text-[#c4b5fd]">·</span>
              <span>100% Private Browser Processing</span>
            </div>
          </motion.div>

          {/* Right column: Clean visual pair preview */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-center lg:col-span-6"
          >
            <div className="overflow-hidden rounded-2xl border border-[#e5def6] bg-white p-3 shadow-sm">
              <div className="grid grid-cols-2 gap-3">
                <div className="relative overflow-hidden rounded-xl border border-[#ece7f8] bg-[#f8f6fc]">
                  <img
                    src="/src/assets/images/sample_product_sneaker_1795680811165.jpg"
                    alt="Original street photo of a white and purple running sneaker"
                    referrerPolicy="no-referrer"
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <div className="flex items-center justify-between border-t border-[#ece7f8] bg-white px-3 py-2 text-xs font-medium text-[#4a4162]">
                    <span>Original Photo</span>
                    <span className="font-mono text-[#7c3aed]">JPG</span>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-xl border border-[#ece7f8] checkerboard-bg">
                  <img
                    src="/src/assets/images/sample_portrait_studio_1795680810687.jpg"
                    alt="Studio portrait ready for instant AI background removal"
                    referrerPolicy="no-referrer"
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <div className="flex items-center justify-between border-t border-[#ece7f8] bg-white px-3 py-2 text-xs font-medium text-[#4a4162]">
                    <span>Studio Ready</span>
                    <span className="font-mono text-[#7c3aed]">PNG</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between rounded-xl bg-[#f7f4ff] px-4 py-3">
                <p className="text-xs sm:text-sm font-medium text-[#3b2f5c]">
                  Pick any sample or drop your own photo below to see live transparency.
                </p>
                <a
                  href="#tool"
                  className="ml-3 text-xs sm:text-sm font-semibold text-[#6d28d9] hover:text-[#5b21b6] whitespace-nowrap shrink-0"
                >
                  Open Studio →
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
