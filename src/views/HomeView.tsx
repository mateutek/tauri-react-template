const placeholderItems = [
  { title: "Feature one", description: "Describe what this section does." },
  { title: "Feature two", description: "Describe what this section does." },
  { title: "Feature three", description: "Describe what this section does." },
];

function HomeView() {
  return (
    <div className="mx-auto max-w-[1180px] px-8 py-10">
      <header className="mb-8">
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
          Platform
        </p>
        <h1 className="mb-1.5 text-3xl font-semibold tracking-tight">Welcome</h1>
        <p className="text-[15px] text-muted-foreground">Your app starts here.</p>
      </header>

      {/* Replace with real feature cards */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
        {placeholderItems.map((item) => (
          <article
            key={item.title}
            className="rounded-xl border bg-card p-6 shadow-sm transition-all hover:border-ring hover:shadow-md"
          >
            <h2 className="mb-1.5 text-base font-semibold tracking-tight">
              {item.title}
            </h2>
            <p className="text-sm leading-5 text-muted-foreground">
              {item.description}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}

export default HomeView;
