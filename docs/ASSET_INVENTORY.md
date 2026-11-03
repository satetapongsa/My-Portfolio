# Asset inventory — legacy portfolio migration

Assets recovered from the original Next.js portfolio (preserved on branch
`archive/legacy-portfolio-before-upgrade-2026-11-03`) and moved with `git mv`, so each
file keeps its history. Binary files are byte-for-byte unchanged (no compression or
conversion). Certificate titles, issuers and dates in `src/data/certificates.ts` were
transcribed from the images themselves — several labels on the old site did not match
the actual certificates and were corrected.

| Original location | New location | Used in |
| --- | --- | --- |
| `public/profile.png` | `public/assets/legacy/profile/profile.png` | About section portrait |
| `public/Resume_Satetapong_Sanguansuk.pdf` | `public/assets/legacy/resume/Resume_Satetapong_Sanguansuk.pdf` | About "View My CV" / "Download Resume", hero résumé icon, command palette |
| `public/certificate/Fortinet NSE 3 Certified in Cybersecurity-1.png` | `public/assets/legacy/certificates/…` (same filename) | Credentials — Fortinet NSE 3 Certified in Cybersecurity (Fortinet Training Institute, 2026-10-01) |
| `public/certificate/a7b6ba2f-c753-4b6f-b1ec-7ffeb5abc899-1.png` | `public/assets/legacy/certificates/…` | Credentials — CC Domain 5: Security Operations (ISC2, 2026-09-19) |
| `public/certificate/THNCA Pentest.png` | `public/assets/legacy/certificates/…` | Credentials — Penetration Test specialist course (NCSA / THNCA, 2026-03-26) |
| `public/certificate/THNCA Cyber Security Analyst.png` | `public/assets/legacy/certificates/…` | Credentials — Cybersecurity Analyst specialist course (NCSA / THNCA, 2026-03-26) |
| `public/certificate/Success Network Security.png` | `public/assets/legacy/certificates/…` | Credentials — Palo Alto Networks Certified Cybersecurity Practitioner (2026-03-26) |
| `public/certificate/Cyber Security Fundemental.png` | `public/assets/legacy/certificates/…` | Credentials — Cybersecurity Fundamentals (Palo Alto Networks, 2026-03-26) |
| `public/certificate/introduction_ICIP.png` | `public/assets/legacy/certificates/…` | Credentials — Introduction to Critical Infrastructure Protection (OPSWAT Academy, 2026-03-26) |
| `public/certificate/Coursera CyberSecurity.png` | `public/assets/legacy/certificates/…` | Credentials — Cyber Security: Essentials for Workplace (Macquarie University · Coursera, 2026-03-26) |
| `public/certificate/Data Science.png` | `public/assets/legacy/certificates/…` | Credentials — Basics of Data Science (UniAthena · CIQ, 2026-03-25) |
| `public/certificate/coursena_wordpress.png` | `public/assets/legacy/certificates/…` | Credentials — Build a free website with WordPress (Coursera, 2026-03-25) |
| `public/mai.png` | `public/assets/legacy/other/mai.png` | Not displayed — screenshot of a "MYRIOX Enterprise AI" dashboard that does not match any listed project |
| `public/portfolio.png` | `public/assets/legacy/other/portfolio.png` | README — screenshot of the original portfolio |

## Not migrated

| File | Reason |
| --- | --- |
| `app/favicon.ico` | Default create-next-app favicon (replaced by `public/favicon.svg`) |
| `public/file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg` | create-next-app boilerplate, unused |
| Project images in the old `app/page.tsx` | Remote Unsplash stock photos, not real project screenshots |

All of the above remain available on the archive branch.

## Privacy notes

- The résumé includes a phone number, email, city and GPA; it was already public on the
  original site and its publication was re-approved for the upgrade.
- Certificates show the holder's name and the issuers' public verification codes / QR
  codes. The ISC2 certificate also shows an ISC2 Learner ID (publication approved).
