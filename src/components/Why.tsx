const features = [
  {
    title: "Expert Coaches",
    desc: "Certified trainers who build personalized plans and keep you accountable.",
    icon: "🎯",
  },
  {
    title: "24/7 Access",
    desc: "Your schedule, your rules. Train any time of day with secure keycard entry.",
    icon: "🔑",
  },
  {
    title: "Modern Equipment",
    desc: "Premium machines and free weights, maintained and upgraded regularly.",
    icon: "⚙️",
  },
  {
    title: "Nutrition Support",
    desc: "In-app meal guidance and one-on-one coaching to fuel your progress.",
    icon: "🥗",
  },
];

export default function Why() {
  return (
    <section id="why" className="border-y border-white/10 bg-ink-soft/40">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-14 max-w-2xl">
          <h2 className="text-4xl font-extrabold tracking-tight">Why GymFit?</h2>
          <p className="mt-4 text-neutral-400">
            We&apos;re more than a gym — we&apos;re a community built to help you become the
            strongest version of yourself.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title}>
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand/15 text-2xl">
                {feature.icon}
              </div>
              <h3 className="mt-5 text-lg font-bold">{feature.title}</h3>
              <p className="mt-2 text-sm text-neutral-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
