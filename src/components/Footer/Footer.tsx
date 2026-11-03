import { ArrowUp } from 'lucide-react';
import type { MouseEvent } from 'react';
import type { SectionId } from '../../data/types';
import { useI18n } from '../../i18n/I18nProvider';
import { fill } from '../../i18n/ui';
import { configuredSocials, scrollToSection } from '../../utils/links';
import { Logo } from '../Navigation/Logo';
import { SocialIcon } from '../ui/BrandIcons';
import './footer.css';

export function Footer() {
  const { t, content } = useI18n();
  const { profile, navItems } = content;
  const f = t.footer;
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

          <nav className="footer__nav" aria-label={f.label}>
            <p className="footer__heading mono">{f.navigate}</p>
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
            <p className="footer__heading mono">{f.elsewhere}</p>
            {socials.length > 0 ? (
              <ul>
                {socials.map((s) => (
                  <li key={s.id + s.url}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer">
                      <SocialIcon id={s.id} /> {s.label}
                      <span className="sr-only"> {t.common.opensInNewTab}</span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="footer__muted">{f.socialsSoon}</p>
            )}
          </div>

          <a href="#home" className="footer__top-btn" onClick={go('home')}>
            <ArrowUp aria-hidden />
            <span>{f.backToTop}</span>
          </a>
        </div>

        <div className="footer__bottom mono">
          <p>
            © {year} {profile.fullName}. {f.rights}
          </p>
          <p className="footer__signature">{fill(f.designedBy, { name: profile.nickname })}</p>
          <p className="footer__build">
            <span className="status-dot" aria-hidden="true" /> {f.build}
          </p>
        </div>
      </div>
    </footer>
  );
}
