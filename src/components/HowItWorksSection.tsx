import { HOW_IT_WORKS_STEPS } from '../data/siteData';

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 border-t border-[#ece7f8] bg-[#faf9fe] py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-[#6d28d9]">How It Works</p>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-[#161124] sm:text-3xl [text-wrap:balance]">
            Clean transparent cutouts in three straightforward steps
          </h2>
          <p className="mt-3 text-base leading-relaxed text-[#524969]">
            Designed for speed on both desktop browsers and mobile phones without accounts, credits, or watermarks.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {HOW_IT_WORKS_STEPS.map((item) => (
            <article
              key={item.step}
              className="flex flex-col justify-between rounded-2xl border border-[#e5def6] bg-white p-6 sm:p-7"
            >
              <div>
                <span className="font-mono text-sm font-semibold text-[#7c3aed]">
                  {item.step}.
                </span>
                <h3 className="mt-3 font-display text-lg font-bold text-[#161124]">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-[#524969]">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
