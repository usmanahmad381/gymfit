const plans = [
  {
    name: "Starter",
    price: "$29",
    period: "/mo",
    features: ["Full gym access", "2 group classes / week", "Locker room access", "Fitness app"],
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$49",
    period: "/mo",
    features: [
      "Everything in Starter",
      "Unlimited group classes",
      "1 personal training session / mo",
      "Nutrition plan",
      "24/7 access",
    ],
    highlighted: true,
  },
  {
    name: "Elite",
    price: "$89",
    period: "/mo",
    features: [
      "Everything in Pro",
      "Weekly personal training",
      "Recovery & sauna access",
      "Priority class booking",
    ],
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-6 py-24">
      <div className="mb-14 text-center">
        <h2 className="text-4xl font-extrabold tracking-tight">Simple, honest pricing</h2>
        <p className="mx-auto mt-4 max-w-xl text-neutral-400">
          No hidden fees. Cancel anytime. Start with a free 7-day trial on any plan.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-3xl border p-8 ${
              plan.highlighted
                ? "border-brand bg-gradient-to-b from-brand/15 to-ink-soft"
                : "border-white/10 bg-ink-soft"
            }`}
          >
            {plan.highlighted && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand px-4 py-1 text-xs font-bold uppercase tracking-wide text-white">
                Most Popular
              </span>
            )}
            <h3 className="text-lg font-bold">{plan.name}</h3>
            <div className="mt-4 flex items-end gap-1">
              <span className="text-5xl font-extrabold">{plan.price}</span>
              <span className="mb-1.5 text-neutral-400">{plan.period}</span>
            </div>

            <ul className="mt-8 space-y-3 text-sm">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-neutral-300">
                  <span className="mt-0.5 text-brand">✓</span>
                  {feature}
                </li>
              ))}
            </ul>

            <a
              href="#contact"
              className={`mt-8 block rounded-full py-3 text-center font-semibold transition-colors ${
                plan.highlighted
                  ? "bg-brand text-white hover:bg-brand-dark"
                  : "border border-white/20 text-white hover:bg-white/10"
              }`}
            >
              Choose {plan.name}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
