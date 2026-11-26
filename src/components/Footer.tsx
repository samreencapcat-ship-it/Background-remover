export function Footer() {
  return (
    <footer className="border-t border-[#e8e2f6] bg-[#faf9fe]">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div>
          <a
            href="#home"
            className="font-display text-base font-bold tracking-tight text-[#161124]"
          >
            Pic Background Remover AI
          </a>
          <p className="mt-1 text-xs text-[#645a80]">
            Instant browser-based AI background removal · JPG, JPEG, PNG &amp; WEBP to transparent PNG
          </p>
        </div>

        <nav
          aria-label="Footer navigation"
          className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-[#524969]"
        >
          <a href="#home" className="hover:text-[#6d28d9]">
            Home
          </a>
          <a href="#tool" className="hover:text-[#6d28d9]">
            Background Remover
          </a>
          <a href="#how-it-works" className="hover:text-[#6d28d9]">
            How It Works
          </a>
          <a href="#features" className="hover:text-[#6d28d9]">
            Features
          </a>
          <a href="#faq" className="hover:text-[#6d28d9]">
            FAQ
          </a>
          <a href="#contact" className="hover:text-[#6d28d9]">
            Contact Us
          </a>
        </nav>

        <p className="text-xs text-[#70668c]">
          © {new Date().getFullYear()} Pic Background Remover AI
        </p>
      </div>
    </footer>
  );
}
