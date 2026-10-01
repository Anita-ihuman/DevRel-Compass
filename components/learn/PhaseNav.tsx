'use client'

import { useEffect, useState } from 'react'

export type PhaseNavItem = { id: string; phase: string; title: string; color: string; modules: { id: string; title: string }[] }

// Side navigation for the DevRel Playbook (/playbook): lists every phase and highlights the
// one currently on screen. The links work without JS; the highlight is the
// only thing that needs it.
export default function PhaseNav({ items }: { items: PhaseNavItem[] }) {
  const [active, setActive] = useState(items[0]?.id)

  useEffect(() => {
    const sections = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => el !== null)
    // A phase is "active" once its top crosses the upper third of the viewport.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length) {
          const top = visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
          setActive(top.target.id)
        }
      },
      { rootMargin: '-20% 0px -65% 0px' },
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [items])

  return (
    <nav className="lib-nav" aria-label="Phases">
      <div className="lib-nav-title">The 5 phases</div>
      <ol>
        {items.map((i) => {
          const on = i.id === active
          return (
            <li key={i.id} style={{ '--phase-color': i.color } as React.CSSProperties}>
              <a href={`#${i.id}`} className={`lib-nav-phase${on ? ' lib-nav-phase--on' : ''}`} aria-current={on ? 'true' : undefined}>
                <span className="lib-nav-num">{i.phase}</span>
                <span>{i.title}</span>
              </a>
              {on && (
                <ul className="lib-nav-modules">
                  {i.modules.map((m) => (
                    <li key={m.id}>
                      <a href={`#${i.id}-${m.id}`}>{m.title}</a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
