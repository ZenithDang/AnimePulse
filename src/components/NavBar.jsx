import { NavLink } from 'react-router-dom';

const NAV_LINKS = [
  { to: '/',         label: 'Summary'  },
  { to: '/genres',   label: 'Genres'   },
  { to: '/studios',  label: 'Studios'  },
  { to: '/discover', label: 'Discover' },
];

export default function NavBar() {
  return (
    <nav
      className="w-full"
      style={{ background: 'var(--bg-base)', borderBottom: '0.5px solid var(--border)' }}
    >
      <div
        className="max-w-[1600px] mx-auto px-4 flex items-center gap-4 overflow-x-auto"
        style={{ height: '40px' }}
      >
        <NavLink
          to="/"
          className="flex items-center gap-2 flex-shrink-0"
          style={{ textDecoration: 'none', paddingBottom: '4px' }}
          aria-label="AniSeasonr home"
        >
          <svg width="18" height="17" viewBox="0 0 32 30" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <defs>
              <linearGradient id="nav-g" x1="0" y1="29" x2="0" y2="1" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#5b21b6"/>
                <stop offset="100%" stopColor="#c4b5fd"/>
              </linearGradient>
            </defs>
            <rect x="0"  y="21" width="6" height="8"  rx="1.5" fill="url(#nav-g)"/>
            <rect x="8"  y="15" width="6" height="14" rx="1.5" fill="url(#nav-g)"/>
            <rect x="16" y="9"  width="6" height="20" rx="1.5" fill="url(#nav-g)"/>
            <rect x="24" y="1"  width="6" height="28" rx="1.5" fill="url(#nav-g)"/>
          </svg>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 600, letterSpacing: '0.02em' }}>
            <span style={{ color: 'var(--text-primary)' }}>Ani</span><span style={{ color: 'var(--accent-violet)' }}>Seasonr</span>
          </span>
        </NavLink>

        <div className="flex items-center gap-4 flex-shrink-0">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              style={({ isActive }) => ({
                fontSize: '12px',
                textDecoration: 'none',
                color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                borderBottom: isActive ? '2px solid var(--accent-violet)' : '2px solid transparent',
                paddingBottom: '2px',
                transition: 'color 0.15s, border-color 0.15s',
              })}
            >
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
