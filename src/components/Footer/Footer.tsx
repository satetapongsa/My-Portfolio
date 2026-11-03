import { ArrowUp } from 'lucide-react';
import type { MouseEvent } from 'react';
import { navItems, profile } from '../../data/portfolio';
import type { SectionId } from '../../data/types';
import { configuredSocials, scrollToSection } from '../../utils/links';
import { Logo } from '../Navigation/Logo';
import { SocialIcon } from '../ui/BrandIcons';
import './footer.css';

export function Footer() {
  const socials = configuredSocials();
  const year = new Date().getFullYear();

  const go = (id: SectionId) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    scrollToSection(id);
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <Logo />
            <p>{profile.tagline}</p>
          </div>

          <nav className="footer__nav" aria-label="Footer">
            <p className="footer__heading mono">Navigate</p>
            <ul>
              {navItems.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} onClick={go(item.id)}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer__social">
            <p className="footer__heading mono">Elsewhere</p>
            {socials.length > 0 ? (
              <ul>
                {socials.map((s) => (
                  <li key={s.id + s.url}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer">
                      <SocialIcon id={s.id} /> {s.label}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="footer__muted">Social links coming soon.</p>
            )}
          </div>

          <a href="#home" className="footer__top-btn" onClick={go('home')}>
            <ArrowUp aria-hidden />
            <span>Back to top</span>
          </a>
        </div>

        <div className="footer__bottom mono">
          <p>
            © {year} {profile.fullName}. All rights reserved.
          </p>
          <p className="footer__signature">
            Designed &amp; Developed by {profile.nickname}.
          </p>
          <p className="footer__build">
            <span className="status-dot" aria-hidden="true" /> raw html → digital identity
          </p>
        </div>
      </div>
    </footer>
  );
}
