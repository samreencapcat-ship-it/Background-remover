import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQ_ITEMS } from '../data/siteData';

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="scroll-mt-20 border-t border-[#ece7f8] bg-[#faf9fe] py-16 sm:py-20"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold text-[#6d28d9]">FAQ</p>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-[#161124] sm:text-3xl [text-wrap:balance]">
            Frequently asked questions
          </h2>
          <p className="mt-3 text-base text-[#524969]">
            Everything you need to know about AI background removal, privacy, supported formats, and free hosting.
          </p>
        </div>

        <div className="mt-10 divide-y divide-[#e6dff6] overflow-hidden rounded-2xl border border-[#e5def6] bg-white">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={item.question}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="flex min-h-[58px] w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-[#faf8ff] sm:px-6"
                >
                  <span className="font-display text-sm font-semibold text-[#161124] sm:text-base">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-[#6d28d9] transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-sm leading-relaxed text-[#524969] sm:px-6">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
