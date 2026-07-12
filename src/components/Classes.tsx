const classes = [
  {
    name: "Strength & Conditioning",
    desc: "Build raw power with guided lifting and progressive overload.",
    icon: "🏋️",
    level: "All levels",
  },
  {
    name: "HIIT Burn",
    desc: "High-intensity intervals to torch calories and boost endurance.",
    icon: "🔥",
    level: "Intermediate",
  },
  {
    name: "Yoga & Mobility",
    desc: "Improve flexibility, balance, and recovery with mindful flows.",
    icon: "🧘",
    level: "All levels",
  },
  {
    name: "Boxing",
    desc: "Sharpen reflexes and power through technical pad and bag work.",
    icon: "🥊",
    level: "Beginner+",
  },
  {
    name: "Spin Cycle",
    desc: "Ride to the rhythm in our high-energy indoor cycling studio.",
    icon: "🚴",
    level: "All levels",
  },
  {
    name: "CrossTraining",
    desc: "Functional full-body workouts that build real-world strength.",
    icon: "💪",
    level: "Advanced",
  },
];

export default function Classes() {
  return (
    <section id="classes" className="mx-auto max-w-6xl px-6 py-24">
      <div className="mb-14 text-center">
        <h2 className="text-4xl font-extrabold tracking-tight">Find your class</h2>
        <p className="mx-auto mt-4 max-w-xl text-neutral-400">
          Over 40 sessions every week led by certified trainers. Whatever your goal, there&apos;s a
          program built to get you there.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {classes.map((cls) => (
          <div
            key={cls.name}
            className="group rounded-2xl border border-white/10 bg-ink-soft p-7 transition-colors hover:border-brand/50"
          >
            <div className="text-4xl">{cls.icon}</div>
            <h3 className="mt-5 text-xl font-bold">{cls.name}</h3>
            <p className="mt-2 text-sm text-neutral-400">{cls.desc}</p>
            <span className="mt-5 inline-block rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-neutral-300">
              {cls.level}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
