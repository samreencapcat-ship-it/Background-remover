import {
  Cpu,
  Download,
  Layers,
  Palette,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="scroll-mt-20 border-t border-[#ece7f8] bg-white py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-[#6d28d9]">Features</p>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-[#161124] sm:text-3xl [text-wrap:balance]">
            Built for clean cutouts, color swaps, and instant PNG downloads
          </h2>
          <p className="mt-3 text-base leading-relaxed text-[#524969]">
            Every control in the studio serves an immediate editing purpose—from precision edge detection to custom backdrop colors.
          </p>
        </div>

        {/* Asymmetric Bento Grid */}
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {/* Marquee Wide Card 1 */}
          <div className="rounded-2xl border border-[#e5def6] bg-[#faf9fe] p-6 sm:p-7 md:col-span-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 text-white">
              <Cpu className="h-5 w-5" />
            </div>
            <h3 className="mt-5 font-display text-xl font-bold text-[#161124]">
              Real Neural AI Segmentation in Your Browser
            </h3>
            <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-[#524969] sm:text-base">
              Powered by an actual ISNet deep-learning segmentation model running locally via WebAssembly. Switch between Fast, Balanced, and Studio HD precision modes to handle everything from sharp product edges to fine hair and pet fur.
            </p>
          </div>

          {/* Standard Card 2 */}
          <div className="rounded-2xl border border-[#e5def6] bg-white p-6 sm:p-7">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f3eeff] text-[#6d28d9]">
              <Layers className="h-5 w-5" />
            </div>
            <h3 className="mt-5 font-display text-lg font-bold text-[#161124]">
              Side-by-Side &amp; Transparency Preview
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#524969]">
              Inspect the original photo next to the cutout on a crisp optical checkerboard, or drag the split slider to verify fine edge accuracy.
            </p>
          </div>

          {/* Standard Card 3 */}
          <div className="rounded-2xl border border-[#e5def6] bg-white p-6 sm:p-7">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f3eeff] text-[#6d28d9]">
              <Palette className="h-5 w-5" />
            </div>
            <h3 className="mt-5 font-display text-lg font-bold text-[#161124]">
              One-Click Background Color Editor
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#524969]">
              Keep true transparency or instantly apply White, Black, Red, Blue, or any custom hex color for ID photos, storefronts, and social posts.
            </p>
          </div>

          {/* Standard Card 4 */}
          <div className="rounded-2xl border border-[#e5def6] bg-white p-6 sm:p-7">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f3eeff] text-[#6d28d9]">
              <Download className="h-5 w-5" />
            </div>
            <h3 className="mt-5 font-display text-lg font-bold text-[#161124]">
              Full-Resolution PNG Export
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#524969]">
              Upload JPG, JPEG, PNG, or WEBP and export crisp lossless PNG files preserving full image dimensions with zero watermarks.
            </p>
          </div>

          {/* Standard Card 5 */}
          <div className="rounded-2xl border border-[#e5def6] bg-white p-6 sm:p-7">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f3eeff] text-[#6d28d9]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="mt-5 font-display text-lg font-bold text-[#161124]">
              Private &amp; Zero API Key Setup
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#524969]">
              Images are processed directly on your device without server queues, API tokens, or account registration.
            </p>
          </div>

          {/* Wide Bottom Card */}
          <div className="flex flex-col justify-between gap-4 rounded-2xl border border-[#e5def6] bg-[#faf9fe] p-6 sm:flex-row sm:items-center sm:p-7 md:col-span-3">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f3eeff] text-[#6d28d9]">
                <Smartphone className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-[#161124]">
                  Fast &amp; Touch-Friendly on Mobile Phones
                </h3>
                <p className="mt-1 max-w-2xl text-sm leading-relaxed text-[#524969]">
                  Responsive layouts, large touch targets, and instant camera-roll uploads make removing backgrounds effortless on iOS and Android.
                </p>
              </div>
            </div>
            <a
              href="#tool"
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:from-violet-700 hover:via-purple-700 hover:to-indigo-700 whitespace-nowrap shrink-0"
            >
              Try the Tool
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
