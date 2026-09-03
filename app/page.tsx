"use client";

import { motion, useScroll, useSpring, useMotionTemplate, useMotionValue, Variants, AnimatePresence } from "framer-motion";
import { Github, Linkedin, Mail, Terminal, Code2, Database, Cpu, Layers, Server, ArrowDown, ExternalLink, Briefcase, User, Code, FolderGit2, MessageSquareQuote, ArrowUp, Facebook, Instagram, Award, ZoomIn, X, FileText, Download, Maximize2, LayoutGrid, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRef, useState, useEffect, MouseEvent, useCallback } from "react";
import { TypeAnimation } from 'react-type-animation';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import type { Engine } from "tsparticles-engine";
import { translations, Language } from "./translations";

const config = {
  name: "SATETAPONG",
  titles: [
    "Full Stack Developer", 2000,
    "UI/UX Enthusiast", 2000,
    "Open Source Contributor", 2000,
    "Problem Solver", 2000,
  ],
  links: {
    github: "https://github.com/satetapongsa",
    linkedin: "https://www.linkedin.com/in/satetapong-sanguansuk/",
    instagram: "https://www.instagram.com/manhideyi/",
    facebook: "https://www.facebook.com/wirburus.h.ng.lok.sinangein.kheiyw/",
    email: "mailto:satetapongs@gmail.com",
  },
  stats: [
    { value: "5+" },
    { value: "50+" },
    { value: "1M+" },
    { value: "∞" },
  ],
  services: [
    { icon: <Layers size={24} /> },
    { icon: <Database size={24} /> },
    { icon: <Server size={24} /> },
    { icon: <Cpu size={24} /> },
  ],
  skillCategories: [
    {
      skills: [
        { name: "React / Next.js", icon: <Code2 /> },
        { name: "TypeScript", icon: <Terminal /> },
        { name: "Tailwind CSS", icon: <Layers /> },
        { name: "Framer Motion", icon: <Cpu /> },
      ]
    },
    {
      skills: [
        { name: "Node.js / Nest", icon: <Server /> },
        { name: "PostgreSQL", icon: <Database /> },
        { name: "Redis", icon: <Database /> },
        { name: "GraphQL", icon: <Code /> },
      ]
    },
    {
      skills: [
        { name: "Docker", icon: <Cpu /> },
        { name: "AWS", icon: <Server /> },
        { name: "Git / CI/CD", icon: <FolderGit2 /> },
      ]
    }
  ],
  experience: [{}, {}, {}],
  projects: [
    {
      tech: ["Next.js 14", "Python", "TensorFlow", "FastAPI", "Socket.io", "Tailwind CSS"],
      link: "https://myriox.vercel.app/", 
      github: "https://github.com/satetapongsa/MYRIOX-AI", 
      featured: true,
      image: "/mai.png"
    },
    {
      tech: ["React", "Web3.js", "Tailwind CSS", "Chart.js"],
      link: "https://nexus-cowork.vercel.app/", 
      github: "https://github.com/satetapongsa/Nexus-Cowork", 
      featured: false,
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop"
    },
    {
      tech: ["Next.js 14", "TypeScript", "Tailwind CSS", "Framer Motion", "Lucide React", "tsparticles"],
      link: "https://satetapong-portfolio.vercel.app/", 
      github: "https://github.com/satetapongsa/my-portfolio", 
      featured: false,
      image: "/portfolio.png"
    },
  ],
  testimonials: [
    { name: "Sarah Johnson", role: "CTO at StartupX" },
    { name: "Michael Chen", role: "Product Manager" }
  ],
  certificates: [
    { image: "/certificate/THNCA Pentest.png" },
    { image: "/certificate/THNCA Cyber Security Analyst.png" },
    { image: "/certificate/introduction_ICIP.png" },
    { image: "/certificate/Success Network Security.png" },
    { image: "/certificate/Data Science.png" },
    { image: "/certificate/Coursera CyberSecurity.png" },
    { image: "/certificate/Cyber Security Fundemental.png" },
    { image: "/certificate/coursena_wordpress.png" },
    { image: "/certificate/Gemini_Cer.png" }
  ]
};

const fadeInUp: Variants = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } };
const staggerContainer: Variants = { visible: { transition: { staggerChildren: 0.15 } } };

export default function Home() {
  const containerRef = useRef(null);
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [lang, setLang] = useState<Language>('en');
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('projects');
  const t = translations[lang];

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);
  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  useEffect(() => {
    return scrollY.onChange((latest) => setIsScrolled(latest > 100));
  }, [scrollY]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handleTabSwitch = (tabId: string) => {
    setActiveTab(tabId);
    const dashboardElem = document.getElementById('dashboard-content');
    if (dashboardElem) {
      dashboardElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <main ref={containerRef} onMouseMove={handleMouseMove} className="min-h-screen bg-[#050505] text-white relative overflow-hidden scroll-smooth selection:bg-purple-500/30 pb-24">

      <BackToTopButton isScrolled={isScrolled} onClick={scrollToTop} />

      {/* --- BACKGROUND SYSTEMS --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={{
            fullScreen: { enable: false },
            background: { color: { value: "transparent" } },
            fpsLimit: 120,
            interactivity: {
              events: {
                onHover: { enable: true, mode: "grab" },
              },
              modes: { grab: { distance: 150, links: { opacity: 0.5 } } },
            },
            particles: {
              color: { value: ["#a855f7", "#3b82f6"] },
              links: { color: "#ffffff", distance: 150, enable: true, opacity: 0.1, width: 1 },
              move: { enable: true, speed: 1, direction: "none", outModes: { default: "bounce" } },
              number: { density: { enable: true, area: 800 }, value: 60 },
              opacity: { value: 0.3 },
              shape: { type: "circle" },
              size: { value: { min: 1, max: 3 } },
            },
            detectRetina: true,
          }}
          className="absolute inset-0 z-0"
        />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(to right, #222 1px, transparent 1px), linear-gradient(to bottom, #222 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
        <Spotlight mouseX={mouseX} mouseY={mouseY} />
      </div>

      {/* --- STICKY TOP HEADER NAVBAR (Single Permanent Sticky Top Header) --- */}
      <header className="sticky top-0 z-50 w-full bg-[#08080c]/95 border-b border-white/10 backdrop-blur-xl shadow-2xl py-2.5 px-4 md:px-8">
        <div className="container mx-auto max-w-6xl flex flex-wrap items-center justify-between gap-4">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <DevLogoInline />
            <span className="font-mono text-sm font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
              {config.name}
            </span>
          </div>

          {/* Center Tabs Navigation */}
          <div id="dashboard-content" className="flex-1 max-w-3xl w-full">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5 w-full">
              <TabButton
                id="projects"
                label={t.nav.work}
                icon={<Code size={15} />}
                active={activeTab === 'projects'}
                onClick={() => handleTabSwitch('projects')}
              />
              <TabButton
                id="resume"
                label={t.nav.resume}
                icon={<FileText size={15} />}
                active={activeTab === 'resume'}
                onClick={() => handleTabSwitch('resume')}
              />
              <TabButton
                id="experience"
                label={t.nav.exp}
                icon={<Briefcase size={15} />}
                active={activeTab === 'experience'}
                onClick={() => handleTabSwitch('experience')}
              />
              <TabButton
                id="about"
                label={t.nav.about}
                icon={<User size={15} />}
                active={activeTab === 'about'}
                onClick={() => handleTabSwitch('about')}
              />
              <TabButton
                id="certificates"
                label={t.nav.cert}
                icon={<Award size={15} />}
                active={activeTab === 'certificates'}
                onClick={() => handleTabSwitch('certificates')}
              />
              <TabButton
                id="services"
                label={t.nav.services}
                icon={<Layers size={15} />}
                active={activeTab === 'services'}
                onClick={() => handleTabSwitch('services')}
              />
              <TabButton
                id="all"
                label={lang === 'th' ? "แสดงทั้งหมด" : "View All"}
                icon={<LayoutGrid size={15} />}
                active={activeTab === 'all'}
                onClick={() => handleTabSwitch('all')}
              />
            </div>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-3">
            <a
              href={config.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              title="GitHub Repository"
            >
              <Github size={18} />
            </a>
            <LanguageToggle lang={lang} setLang={setLang} inline />
          </div>

        </div>
      </header>

      <div className="relative z-10 container mx-auto px-6 md:px-12 max-w-5xl">

        {/* --- COMPACT TECH HERO BANNER --- */}
        <section className="pt-12 pb-8 text-center relative">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6 relative z-20">

            <motion.div variants={fadeInUp} whileHover={{ scale: 1.05 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/50 border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.2)] backdrop-blur-md text-xs text-green-400 font-mono cursor-crosshair">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <span>{t.hero.status}</span>
            </motion.div>

            <div className="space-y-2">
              <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-extrabold tracking-tighter">
                {t.hero.greeting} <span className="relative inline-block">
                  <span className="absolute -inset-2 blur-2xl bg-gradient-to-r from-blue-600/30 via-purple-600/30 to-pink-600/30 opacity-70"></span>
                  <span className="relative bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">{config.name}</span>
                </span>
              </motion.h1>
              <motion.div variants={fadeInUp} className="text-xl md:text-2xl font-light text-gray-300 h-[36px] flex justify-center items-center font-mono">
                <span>{t.hero.subGreeting}&nbsp;</span>
                <TypeAnimation key={lang} sequence={config.titles} wrapper="span" speed={50} repeat={Infinity} className="font-bold text-purple-400" />
              </motion.div>
            </div>

            <motion.p variants={fadeInUp} className="max-w-xl mx-auto text-gray-400 text-base leading-relaxed font-light">{t.hero.bio}</motion.p>

            {/* Social Links */}
            <motion.div variants={fadeInUp} className="flex gap-4 justify-center items-center mt-2 mb-2">
              <SocialIconBtn href={config.links.github} icon={<Github size={20} />} />
              <SocialIconBtn href={config.links.linkedin} icon={<Linkedin size={20} />} />
              <SocialIconBtn href={config.links.facebook} icon={<Facebook size={20} />} />
              <SocialIconBtn href={config.links.instagram} icon={<Instagram size={20} />} />
            </motion.div>

            {/* Quick Hero CTAs */}
            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4 pt-2">
              <button
                onClick={() => handleTabSwitch('projects')}
                className="flex items-center gap-2.5 px-6 py-3 rounded-full bg-white text-black font-bold text-sm hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] transition-all cursor-pointer"
              >
                <Code size={18} />
                <span>{t.hero.btnWork}</span>
              </button>
              <button
                onClick={() => handleTabSwitch('resume')}
                className="flex items-center gap-2.5 px-6 py-3 rounded-full bg-purple-600/80 hover:bg-purple-500 text-white font-bold text-sm border border-purple-400/50 shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all cursor-pointer"
              >
                <FileText size={18} />
                <span>{t.nav.resume}</span>
              </button>
              <MainButton href={config.links.email} icon={<Mail size={18} />} label={t.hero.btnContact} isCopy />
            </motion.div>

          </motion.div>
        </section>

        {/* --- COMPACT IMPACT STATS --- */}
        <section className="py-6 border-y border-white/5 bg-white/[0.02] rounded-2xl my-6 backdrop-blur-md">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {config.stats.map((stat, index) => {
               const labels = [t.stats.exp, t.stats.projects, t.stats.code, t.stats.coffee];
               return <StatsItem key={index} stat={{ ...stat, label: labels[index] }} index={index} />;
            })}
          </motion.div>
        </section>

        {/* --- DASHBOARD CONTENT PANELS --- */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="min-h-[500px]"
          >
            {/* TAB 1: PROJECTS */}
            {(activeTab === 'projects' || activeTab === 'all') && (
              <section id="projects" className="py-8 relative">
                <SectionHeader title={t.projects.header} icon={<FolderGit2 />} subtitle={t.projects.subtitle} />
                <div className="mt-12 grid md:grid-cols-2 gap-8">
                  {t.projects.items.map((project, index) => (
                    <ProjectCard 
                      key={index} 
                      project={{ 
                        ...project, 
                        ...config.projects[index]
                      }} 
                      index={index} 
                      t={t}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* TAB 2: RESUME VIEWER */}
            {(activeTab === 'resume' || activeTab === 'all') && (
              <section id="resume" className={`py-8 relative ${activeTab === 'all' ? 'border-t border-white/5 mt-16' : ''}`}>
                <SectionHeader title={t.resume.header} icon={<FileText />} subtitle={t.resume.subtitle} />
                
                <div className="mt-12 max-w-4xl mx-auto space-y-6">
                  {/* Control Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:border-purple-500/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400">
                        <FileText size={24} />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-white font-mono">Resume_Satetapong_Sanguansuk.pdf</h4>
                        <p className="text-xs text-purple-300/70 font-mono">Official PDF Document</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <motion.a
                        href="/Resume_Satetapong_Sanguansuk.pdf"
                        download="Resume_Satetapong_Sanguansuk.pdf"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all cursor-pointer"
                      >
                        <Download size={16} />
                        <span>{t.resume.downloadBtn}</span>
                      </motion.a>

                      <motion.a
                        href="/Resume_Satetapong_Sanguansuk.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-bold backdrop-blur-md transition-all cursor-pointer"
                      >
                        <ExternalLink size={16} />
                        <span>{t.resume.viewOnline}</span>
                      </motion.a>

                      <motion.button
                        onClick={() => setIsResumeModalOpen(true)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white rounded-xl text-xs font-bold backdrop-blur-md transition-all cursor-pointer"
                      >
                        <Maximize2 size={16} />
                        <span>{t.resume.openBtn}</span>
                      </motion.button>
                    </div>
                  </div>

                  {/* Embedded Interactive PDF Viewer */}
                  <div className="relative w-full rounded-3xl border border-white/10 overflow-hidden shadow-2xl bg-[#0d0d12]">
                    <iframe
                      src="/Resume_Satetapong_Sanguansuk.pdf#toolbar=1"
                      className="w-full h-[650px] md:h-[800px] border-0"
                      title="Satetapong Sanguansuk Resume PDF"
                    />
                  </div>
                </div>
              </section>
            )}

            {/* TAB 3: EXPERIENCE TIMELINE */}
            {(activeTab === 'experience' || activeTab === 'all') && (
              <section id="experience" className={`py-8 relative ${activeTab === 'all' ? 'border-t border-white/5 mt-16' : ''}`}>
                <SectionHeader title={t.experience.header} icon={<Briefcase />} subtitle={t.experience.subtitle} />
                <div className="mt-16 relative max-w-3xl mx-auto">
                  <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-purple-500 via-blue-500 to-transparent opacity-30 md:-translate-x-1/2"></div>
                  <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="space-y-12">
                    {t.experience.items.map((job, index) => (
                      <TimelineItem key={index} job={job} index={index} />
                    ))}
                  </motion.div>
                </div>
              </section>
            )}

            {/* TAB 4: ABOUT & SKILLS */}
            {(activeTab === 'about' || activeTab === 'all') && (
              <section id="about" className={`py-8 relative ${activeTab === 'all' ? 'border-t border-white/5 mt-16' : ''}`}>
                <SectionHeader title={t.about.header} icon={<User />} subtitle={t.about.subtitle} />
                <div className="grid lg:grid-cols-5 gap-12 items-start mt-12">
                  <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="lg:col-span-2 relative group rounded-3xl p-[1px]">
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-700 pointer-events-none"></div>
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative h-full bg-[#0a0a0a] p-8 rounded-3xl border border-white/10 z-10 overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-10 font-mono text-xs text-right pointer-events-none"><p>class Developer {"{"}</p><p>&nbsp;&nbsp;this.passion = true;</p><p>{"}"}</p></div>
                      <h3 className="text-2xl font-bold text-white flex items-center gap-2 mb-4"><Terminal size={20} className="text-purple-400 group-hover:text-cyan-400 transition-colors" /> {t.about.storyTitle}</h3>
                      <p className="text-gray-300 leading-relaxed text-lg font-light group-hover:text-white transition-colors">{t.about.bioLong}</p>
                    </div>
                  </motion.div>
                  <div className="lg:col-span-3 space-y-8">
                    {config.skillCategories.map((category, catIndex) => {
                      const categoryTitles = [t.about.skillFrontend, t.about.skillBackend, t.about.skillDevOps];
                      return (
                        <motion.div key={catIndex} variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                          <h4 className="text-lg font-mono text-purple-300 mb-4 flex items-center gap-2"><span className="h-[1px] w-4 bg-purple-500 inline-block"></span> {categoryTitles[catIndex]}</h4>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {category.skills.map((skill, index) => (<SkillCard key={index} skill={skill} />))}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}

            {/* TAB 5: CERTIFICATES */}
            {(activeTab === 'certificates' || activeTab === 'all') && (
              <section id="certificates" className={`py-8 relative ${activeTab === 'all' ? 'border-t border-white/5 mt-16' : ''}`}>
                <SectionHeader title={t.certificates.header} icon={<Award />} subtitle={t.certificates.subtitle} />
                <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {t.certificates.items.map((cert, index) => (
                    <CertificateCard 
                      key={index} 
                      cert={{ ...cert, ...config.certificates[index] }} 
                      t={t}
                    />
                  ))}
                </motion.div>
              </section>
            )}

            {/* TAB 6: SERVICES */}
            {(activeTab === 'services' || activeTab === 'all') && (
              <section id="services" className={`py-8 relative ${activeTab === 'all' ? 'border-t border-white/5 mt-16' : ''}`}>
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="mb-12 text-center">
                  <h3 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2"><Layers className="text-purple-400" /> {t.services.header}</h3>
                  <p className="text-gray-400">{t.services.subtitle}</p>
                </motion.div>
                <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {t.services.items.map((service, index) => (
                    <ServiceCard key={index} service={{ ...service, icon: config.services[index].icon }} index={index} />
                  ))}
                </motion.div>
              </section>
            )}

            {/* TESTIMONIALS (Shown on 'all' or 'about' tab) */}
            {(activeTab === 'all' || activeTab === 'about') && (
              <section className="py-16 relative border-t border-white/5 mt-12">
                <SectionHeader title={t.testimonials.header} icon={<MessageSquareQuote />} subtitle={t.testimonials.subtitle} />
                <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-12 grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  {t.testimonials.items.map((item, index) => (
                    <TestimonialCard key={index} item={{ ...item, ...config.testimonials[index] }} />
                  ))}
                </motion.div>
              </section>
            )}
          </motion.div>
        </AnimatePresence>

        {/* --- Fullscreen Resume Modal Overlay --- */}
        <AnimatePresence>
          {isResumeModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex flex-col p-4 md:p-8"
            >
              <div className="flex justify-between items-center pb-4 mb-4 border-b border-white/10 max-w-6xl mx-auto w-full">
                <div className="flex items-center gap-3">
                  <FileText className="text-purple-400" size={24} />
                  <h4 className="text-lg font-bold text-white font-mono">{t.resume.header}</h4>
                </div>
                <div className="flex items-center gap-4">
                  <a
                    href="/Resume_Satetapong_Sanguansuk.pdf"
                    download="Resume_Satetapong_Sanguansuk.pdf"
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition-colors"
                  >
                    <Download size={16} /> {t.resume.downloadBtn}
                  </a>
                  <button
                    onClick={() => setIsResumeModalOpen(false)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={28} />
                  </button>
                </div>
              </div>
              <div className="flex-grow w-full max-w-6xl mx-auto rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <iframe
                  src="/Resume_Satetapong_Sanguansuk.pdf#toolbar=1"
                  className="w-full h-full border-0 bg-[#0d0d12]"
                  title="Satetapong Sanguansuk Resume PDF Fullscreen"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- SECTION 5: FOOTER --- */}
        <section className="py-24 text-center relative border-t border-white/5 mt-16">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none -z-10"></div>
          <motion.h3 
            initial="hidden" 
            whileInView="visible" 
            variants={fadeInUp} 
            className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400 mb-6"
            dangerouslySetInnerHTML={{ __html: t.footer.ready }}
          />
          <motion.div initial="hidden" whileInView="visible" variants={fadeInUp} className="pt-6">
            <MainButton href={config.links.email} icon={<Mail size={20} />} label={t.footer.btn} primary size="large" isCopy toast={t.footer.toast} />
          </motion.div>
          <footer className="mt-20 pt-8 border-t border-white/5 text-gray-500 text-sm font-mono flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-4"><Link href={config.links.github} className="hover:text-white"><Github size={18} /></Link><Link href={config.links.linkedin} className="hover:text-white"><Linkedin size={18} /></Link></div>
            <p>© {new Date().getFullYear()} {config.name} <span className="text-purple-500">::</span> {t.footer.copy}.</p>
          </footer>
        </section>
      </div>
    </main>
  );
}

// =========================================
// SUB-COMPONENTS
// =========================================

// Note: Use motion.a for external links
function SocialIconBtn({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.1, y: -2 }}
      whileTap={{ scale: 0.9 }}
      className="p-3 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 hover:border-purple-500/50 transition-all shadow-lg backdrop-blur-sm cursor-pointer flex items-center justify-center"
    >
      {icon}
    </motion.a>
  );
}

function TestimonialCard({ item }: { item: any }) {
  return (
    <motion.div variants={fadeInUp} className="p-8 bg-white/5 border border-white/10 rounded-3xl relative backdrop-blur-sm hover:border-purple-500/30 transition-colors">
      <div className="text-purple-500 mb-6 opacity-50"><MessageSquareQuote size={40} /></div>
      <p className="text-gray-300 italic text-lg leading-relaxed mb-6">"{item.quote}"</p>
      <div><h4 className="text-white font-bold">{item.name}</h4><p className="text-purple-400 text-sm font-mono">{item.role}</p></div>
    </motion.div>
  )
}

function BackToTopButton({ isScrolled, onClick }: { isScrolled: boolean, onClick: () => void }) {
  return (
    <AnimatePresence>
      {isScrolled && (
        <motion.button initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} onClick={onClick} className="fixed bottom-8 right-8 z-50 p-3 bg-purple-600/80 hover:bg-purple-500 text-white rounded-full shadow-lg backdrop-blur-md border border-white/20">
          <ArrowUp size={24} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

function DevLogo() {
  const variants: Variants = { idle: { y: [0, -5, 0], rotate: [0, 2, 0], transition: { duration: 4, repeat: Infinity, ease: "easeInOut" } }, hover: { scale: 1.2, rotate: 10, filter: "drop-shadow(0 0 15px rgba(139, 92, 246, 0.8))" } };
  const pathVariants: Variants = { idle: { pathLength: 1, opacity: 0.8 }, hover: { pathLength: [0, 1], opacity: 1, transition: { duration: 0.5, ease: "easeInOut" } } };
  return (
    <div className="fixed top-6 left-6 z-50 mix-blend-screen pointer-events-auto">
      <motion.svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 cursor-pointer" variants={variants} initial="idle" animate="idle" whileHover="hover">
        <defs><linearGradient id="dev-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#22d3ee" /><stop offset="50%" stopColor="#a855f7" /><stop offset="100%" stopColor="#ec4899" /></linearGradient></defs>
        <motion.path d="M10 20L4 12L10 4" stroke="url(#dev-grad)" variants={pathVariants} />
        <motion.path d="M14 4L20 12L14 20" stroke="url(#dev-grad)" variants={pathVariants} />
        <motion.path d="M8 21L16 3" stroke="url(#dev-grad)" className="opacity-50" variants={pathVariants} />
      </motion.svg>
    </div>
  );
}

function Spotlight({ mouseX, mouseY }: { mouseX: any, mouseY: any }) {
  let springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  let springY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  let background = useMotionTemplate`radial-gradient(600px circle at ${springX}px ${springY}px, rgba(120, 50, 255, 0.15), transparent 80%)`;
  return <motion.div className="absolute inset-0 z-10 opacity-70 mix-blend-screen" style={{ background }} />;
}

function SectionHeader({ title, subtitle, icon }: { title: string, subtitle?: string, icon?: React.ReactNode }) {
  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center space-y-4 relative z-10">
      <div className="inline-flex items-center justify-center p-2 rounded-xl bg-white/5 border border-white/10 text-purple-400 mb-2 shadow-lg shadow-purple-500/10">{icon}</div>
      <h3 className="text-4xl md:text-5xl font-bold py-2 bg-clip-text text-transparent bg-gradient-to-b from-white via-gray-200 to-gray-500">{title}</h3>
      {subtitle && <p className="text-gray-400 text-lg max-w-xl mx-auto font-light">{subtitle}</p>}
    </motion.div>
  )
}

function SkillCard({ skill }: { skill: any }) {
  return (
    <motion.div variants={fadeInUp} whileHover={{ scale: 1.05, y: -5 }} className="group relative rounded-2xl p-[1px] cursor-default">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-70 blur-xl transition-opacity duration-500 pointer-events-none" />
      <div className="absolute inset-0 rounded-2xl animate-rainbow opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative h-full bg-[#0a0a0a]/90 backdrop-blur-xl rounded-2xl p-4 flex flex-col items-center gap-3 text-center border border-white/10 group-hover:border-transparent transition-colors z-10">
        <div className="p-3 rounded-xl bg-white/5 group-hover:bg-white/10 text-gray-300 group-hover:text-white transition-colors shadow-sm">{skill.icon}</div>
        <span className="text-sm font-semibold text-gray-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-300 group-hover:to-purple-300 transition-all">{skill.name}</span>
      </div>
    </motion.div>
  )
}

function StatsItem({ stat, index }: { stat: any, index: number }) {
  return (
    <motion.div variants={fadeInUp} className="flex flex-col items-center justify-center p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md hover:border-purple-500/50 transition-colors">
      <h4 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2">{stat.value}</h4>
      <p className="text-gray-400 font-mono text-sm uppercase tracking-wider">{stat.label}</p>
    </motion.div>
  )
}

function ServiceCard({ service, index }: { service: any, index: number }) {
  return (
    <motion.div variants={fadeInUp} whileHover={{ y: -5 }} className="group relative p-8 bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-3xl overflow-hidden hover:border-purple-500/30 transition-all">
      <div className="absolute inset-0 opacity-10 bg-[url('/grid.svg')]"></div>
      <div className="relative z-10 w-12 h-12 flex items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 mb-6 group-hover:bg-purple-500 group-hover:text-white transition-all duration-300">{service.icon}</div>
      <h4 className="relative z-10 text-xl font-bold mb-3 group-hover:text-purple-300 transition-colors">{service.title}</h4>
      <p className="relative z-10 text-gray-400 leading-relaxed text-sm group-hover:text-gray-300">{service.description}</p>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </motion.div>
  )
}

function TimelineItem({ job, index }: { job: any, index: number }) {
  const isEven = index % 2 === 0;
  return (
    <motion.div variants={fadeInUp} className={`relative flex items-start ${isEven ? 'md:flex-row-reverse' : ''}`}>
      <div className="absolute left-8 md:left-1/2 -translate-x-1/2 mt-1 flex flex-col items-center justify-center">
        <div className="w-4 h-4 rounded-full bg-black border-2 border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)] z-10 relative">
          <div className="absolute inset-1 rounded-full bg-purple-400 animate-ping opacity-75"></div>
        </div>
      </div>
      <div className={`ml-20 md:ml-0 ${isEven ? 'md:mr-[50%]' : 'md:ml-[50%]'} md:px-8 w-full`}>
        <div className={`p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm relative hover:border-purple-500/30 transition-all group ${isEven ? 'md:text-right' : ''}`}>
          <span className="absolute top-0 -translate-y-1/2 inline-block px-3 py-1 text-xs font-mono font-bold bg-black border border-purple-500/50 text-purple-300 rounded-full shadow-sm">{job.year}</span>
          <h4 className="text-xl font-bold text-white mt-2 group-hover:text-purple-300 transition-colors">{job.role}</h4>
          <h5 className="text-purple-400 font-mono text-sm mb-4">{job.company}</h5>
          <p className="text-gray-400 text-sm leading-relaxed">{job.description}</p>
        </div>
      </div>
    </motion.div>
  )
}

// ProjectCard component without emojis
function ProjectCard({ project, index, t }: { project: any, index: number, t: any }) {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -10 }}
      className={`group relative bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden transition-all duration-500 hover:border-purple-500/50 hover:shadow-[0_10px_30px_-10px_rgba(168,85,247,0.2)] ${project.featured ? 'md:col-span-2 md:flex md:gap-8 bg-gradient-to-br from-[#111] to-[#0a0a0a]' : ''}`}
    >
      {/* Image Section */}
      <div
        className={`h-48 w-full relative overflow-hidden bg-gray-900 cursor-pointer ${project.featured ? 'md:h-auto md:w-2/5' : ''}`}
        onClick={() => setShowOptions(true)}
      >
        <img
          src={project.image}
          alt={project.title}
          className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60"></div>

        <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 border border-white/10 text-xs font-mono text-gray-300 backdrop-blur-md z-10 shadow-lg">
          {project.featured ? <Sparkles size={13} className="text-yellow-400" /> : <FolderGit2 size={13} className="text-purple-400" />}
          <span>{project.featured ? t.projects.featured : t.projects.standard}</span>
        </div>

        {/* --- Selection Overlay --- */}
        <AnimatePresence>
          {showOptions && (
            <motion.div
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
              animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
              exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
              className="absolute inset-0 z-20 bg-black/70 flex flex-col items-center justify-center p-6 gap-4"
              onClick={(e: MouseEvent) => { e.stopPropagation(); setShowOptions(false); }}
            >
              <div className="text-center space-y-1 mb-2">
                <p className="text-xs font-mono text-purple-400 uppercase tracking-widest">{t.projects.action}</p>
                <h5 className="text-lg font-bold text-white">{t.projects.details}</h5>
              </div>

              <div className="flex flex-col w-full gap-3" onClick={(e: MouseEvent) => e.stopPropagation()}>
                {project.link !== "#" && (
                  <motion.a
                    href={project.link}
                    target="_blank"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-3 px-4 py-3 bg-white text-black rounded-xl font-bold text-sm shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                  >
                    <ExternalLink size={18} /> {t.projects.live}
                  </motion.a>
                )}
                {project.github !== "#" && (
                  <motion.a
                    href={project.github}
                    target="_blank"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-3 px-4 py-3 bg-white/10 border border-white/20 text-white rounded-xl font-bold text-sm backdrop-blur-md hover:bg-white/20 transition-all"
                  >
                    <Github size={18} /> {t.projects.github}
                  </motion.a>
                )}
                {/* Fallback if both are # */}
                {project.link === "#" && project.github === "#" && (
                  <p className="text-gray-400 text-xs italic text-center">{t.projects.comingSoon}</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- Content Section --- */}
      <div className={`p-8 flex flex-col relative z-10 ${project.featured ? 'md:w-3/5 md:py-12' : ''}`}>
        <div className="flex justify-between items-start mb-4">
          <h4 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 group-hover:from-purple-300 group-hover:to-blue-300 transition-all">{project.title}</h4>
          <div className="flex gap-3 text-gray-400">
            {project.github !== "#" && <a href={project.github} target="_blank" className="hover:text-purple-400 transition-colors"><Github size={18} /></a>}
            {project.link !== "#" && <a href={project.link} target="_blank" className="hover:text-blue-400 transition-colors"><ExternalLink size={18} /></a>}
          </div>
        </div>
        <p className="text-gray-400 mb-6 flex-grow font-light leading-relaxed">{project.description}</p>
        <ul className="flex flex-wrap gap-2 text-xs font-mono text-purple-300/80">
          {project.tech.map((t: string, i: number) => (
            <li key={i} className="px-2.5 py-1 bg-purple-900/20 border border-purple-500/20 rounded-md group-hover:border-purple-500/40 transition-colors">{t}</li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}

function NavLink({ href, icon, label, external }: { href: string, icon: React.ReactNode, label: string, external?: boolean }) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!external && href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.replace('#', '');
      const elem = document.getElementById(targetId);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Update URL hash without jumping
        window.history.pushState(null, '', href);
      }
    }
  };

  return (
    <Link 
      href={href} 
      onClick={handleClick}
      target={external ? "_blank" : undefined} 
      className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors relative group"
    >
      {icon}
      <span>{label}</span>
      <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-purple-500 group-hover:w-full transition-all duration-300"></span>
    </Link>
  )
}

function DevLogoInline() {
  return (
    <div className="flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <defs><linearGradient id="dev-grad-inline" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#22d3ee" /><stop offset="50%" stopColor="#a855f7" /><stop offset="100%" stopColor="#ec4899" /></linearGradient></defs>
        <path d="M10 20L4 12L10 4" stroke="url(#dev-grad-inline)" />
        <path d="M14 4L20 12L14 20" stroke="url(#dev-grad-inline)" />
        <path d="M8 21L16 3" stroke="url(#dev-grad-inline)" className="opacity-50" />
      </svg>
    </div>
  );
}

function LanguageToggle({ lang, setLang, inline = false }: { lang: Language, setLang: (l: Language) => void, inline?: boolean }) {
  return (
    <div className={inline ? "flex gap-1.5" : "fixed top-6 right-6 z-50 flex gap-2"}>
      {(['th', 'en'] as const).map((l) => (
        <motion.button
          key={l}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setLang(l)}
          className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${lang === l ? 'bg-purple-600 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'bg-black/50 border-white/10 text-gray-400 hover:text-white'}`}
        >
          {l.toUpperCase()}
        </motion.button>
      ))}
    </div>
  );
}

// --- Certificate Card Component ---
function CertificateCard({ cert, t }: { cert: any, t: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.div
        variants={fadeInUp}
        whileHover={{ y: -10 }}
        className="group relative bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <div className="h-48 w-full relative overflow-hidden bg-gray-900">
          <img 
            src={cert.image} 
            alt={cert.title} 
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="p-3 rounded-full bg-purple-500/80 backdrop-blur-md text-white scale-50 group-hover:scale-100 transition-transform duration-300">
              <ZoomIn size={24} />
            </div>
          </div>
        </div>
        <div className="p-5 border-t border-white/5">
          <h4 className="text-sm font-bold text-white mb-1 group-hover:text-purple-400 transition-colors line-clamp-1">{cert.title}</h4>
          <p className="text-xs text-gray-500 font-mono italic">{cert.issuer}</p>
        </div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full h-auto max-h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute -top-12 right-0 p-2 text-white hover:text-purple-400 transition-colors"
              >
                <X size={32} />
              </button>
              <img 
                src={cert.image} 
                alt={cert.title} 
                className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10" 
              />
              <div className="absolute -bottom-12 left-0 right-0 text-center">
                <h4 className="text-xl font-bold text-white">{cert.title}</h4>
                <p className="text-purple-400 font-mono text-sm">{cert.issuer}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Main button component with copy support
function MainButton({ href, icon, label, primary = false, size = "normal", isCopy = false, toast = "Email Copied!" } : { href: string, icon: React.ReactNode, label: string, primary?: boolean, size?: "normal" | "large", isCopy?: boolean, toast?: string }) {
    const isLarge = size === "large";
    const [copied, setCopied] = useState(false);

    const handleClick = async (e: any) => {
        if (isCopy) {
            e.preventDefault();
            const email = href.replace('mailto:', '');
            await navigator.clipboard.writeText(email);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };
    
    return (
      <motion.a 
        href={isCopy ? "#" : href}
        onClick={handleClick}
        target={(!isCopy && href.startsWith('http')) ? "_blank" : undefined}
        rel={(!isCopy && href.startsWith('http')) ? "noopener noreferrer" : undefined}
        whileHover={{ scale: 1.05 }} 
        whileTap={{ scale: 0.95 }} 
        className={`relative group flex items-center gap-3 rounded-full transition-all duration-300 font-bold overflow-hidden cursor-pointer ${isLarge ? 'px-8 py-4 text-lg' : 'px-6 py-3 text-base'} ${primary ? 'bg-white text-black hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] border border-transparent' : 'bg-black/50 text-white border border-white/20 hover:bg-white/10 hover:border-white/40'}`}
      >
        <AnimatePresence>
          {copied && (
            <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               className="absolute inset-0 bg-purple-600 text-white flex items-center justify-center z-20 text-sm font-mono"
            >
               {toast}
            </motion.div>
          )}
        </AnimatePresence>
        {primary && <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10"></div>}
        <span className={`${primary ? 'group-hover:text-purple-600' : ''} transition-colors`}>{icon}</span>
        <span>{label}</span>
      </motion.a>
    )
}

// Tab Button Subcomponent (Full Width Responsive)
function TabButton({ id, label, icon, active, onClick }: { id: string, label: string, icon: React.ReactNode, active: boolean, onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`relative w-full px-2 md:px-3 py-2.5 rounded-xl text-xs md:text-sm font-bold font-mono transition-all flex items-center justify-center gap-1.5 md:gap-2 cursor-pointer ${
        active 
          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.5)] border border-purple-400/80' 
          : 'bg-white/5 text-gray-400 hover:text-white border border-white/10 hover:border-white/20 hover:bg-white/10'
      }`}
    >
      <span className={active ? 'text-white' : 'text-purple-400'}>{icon}</span>
      <span className="truncate">{label}</span>
      {active && (
        <motion.div
          layoutId="activeTabGlow"
          className="absolute -bottom-1 left-2 right-2 h-[2px] bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee]"
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
        />
      )}
    </motion.button>
  );
}
