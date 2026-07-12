const stats = [
  { value: "5,000+", label: "Active members" },
  { value: "40+", label: "Weekly classes" },
  { value: "25", label: "Expert coaches" },
  { value: "24/7", label: "Gym access" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-30"
        style={{
          background:
            "radial-gradient(60% 60% at 70% 20%, rgba(244,63,29,0.35) 0%, rgba(10,10,10,0) 60%)",
        }}
      />

      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-2 md:items-center md:py-32">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand">
            New members welcome
          </span>
          <h1 className="mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
            Train hard.
            <br />
            Live <span className="text-brand">strong.</span>
          </h1>
          <p className="mt-6 max-w-md text-lg text-neutral-400">
            GymFit is where goals become gains. State-of-the-art equipment, world-class coaches,
            and a community that pushes you further — every single day.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#pricing"
              className="rounded-full bg-brand px-7 py-3 font-semibold text-white transition-colors hover:bg-brand-dark"
            >
              Start Free Trial
            </a>
            <a
              href="#classes"
              className="rounded-full border border-white/20 px-7 py-3 font-semibold text-white transition-colors hover:bg-white/10"
            >
              Explore Classes
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-ink-soft p-6 text-center"
            >
              <div className="text-3xl font-extrabold text-brand">{stat.value}</div>
              <div className="mt-1 text-sm text-neutral-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
