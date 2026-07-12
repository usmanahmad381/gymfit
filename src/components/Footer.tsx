export default function Footer() {
  return (
    <footer id="contact" className="border-t border-white/10">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <a href="#" className="flex items-center gap-2 text-xl font-extrabold">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-white">
                G
              </span>
              Gym<span className="text-brand">Fit</span>
            </a>
            <p className="mt-4 max-w-sm text-sm text-neutral-400">
              Train hard, live strong. Join a community that&apos;s committed to helping you reach
              your goals.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
              Visit Us
            </h4>
            <address className="mt-4 space-y-1 text-sm not-italic text-neutral-400">
              <p>123 Fitness Avenue</p>
              <p>Downtown, CA 90210</p>
              <p>Mon–Sun · Open 24/7</p>
            </address>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
              Contact
            </h4>
            <div className="mt-4 space-y-1 text-sm text-neutral-400">
              <p>
                <a href="tel:+15551234567" className="hover:text-white">
                  +1 (555) 123-4567
                </a>
              </p>
              <p>
                <a href="mailto:hello@gymfit.com" className="hover:text-white">
                  hello@gymfit.com
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-neutral-500 sm:flex-row">
          <p>© {new Date().getFullYear()} GymFit. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">
              Privacy
            </a>
            <a href="#" className="hover:text-white">
              Terms
            </a>
            <a href="#" className="hover:text-white">
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
