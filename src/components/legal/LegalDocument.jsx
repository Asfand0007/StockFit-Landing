export default function LegalDocument({ title, subtitle, sections, compact = false }) {
  return (
    <div>
      {title ? (
        <div className={compact ? 'mb-4' : 'mb-8'}>
          <h1 className={compact ? 'text-2xl font-bold' : 'text-3xl md:text-4xl font-bold'}>{title}</h1>
          {subtitle ? <p className="mt-3 text-white/65">{subtitle}</p> : null}
        </div>
      ) : null}

      <div className={compact ? 'space-y-5' : 'space-y-8'}>
        {sections.map((section) => (
          <section key={section.title} className="rounded-2xl border border-white/10 bg-black/20 p-4 md:p-5">
            <h2 className={compact ? 'text-lg font-semibold text-primary' : 'text-xl font-semibold text-primary'}>
              {section.title}
            </h2>

            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph} className="mt-3 text-sm md:text-base leading-relaxed text-white/85">
                {paragraph}
              </p>
            ))}

            {section.lists?.map((list, idx) => (
              <div key={`${section.title}-list-${idx}`} className="mt-3">
                {list.title ? <p className="text-sm md:text-base text-white/85">{list.title}</p> : null}
                {list.intro ? <p className="mt-1 text-sm md:text-base text-white/80">{list.intro}</p> : null}
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm md:text-base text-white/80">
                  {list.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}

            {section.closing ? <p className="mt-3 text-sm md:text-base leading-relaxed text-white/80">{section.closing}</p> : null}
          </section>
        ))}
      </div>
    </div>
  );
}
