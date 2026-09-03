export type Language = 'th' | 'en';

export const translations = {
  th: {
    nav: {
      about: "เกี่ยวกับ",
      services: "บริการ",
      work: "ผลงาน",
      exp: "ประสบการณ์",
      resume: "เรซูเม่",
      cert: "เกียรติบัตร",
      git: "GitHub"
    },
    hero: {
      status: "ระบบออนไลน์ พร้อมลุยโปรเจกต์",
      greeting: "สวัสดี ผมคือ",
      subGreeting: "ผู้เชี่ยวชาญด้าน",
      bio: "เปลี่ยนไอเดียให้กลายเป็นผลงานที่จับต้องได้ด้วย Code คุณภาพสูง มุ่งเน้น Performance และ User Experience ที่ยอดเยี่ยม",
      btnWork: "ชมผลงานของผม",
      btnContact: "ติดต่องาน",
      scroll: "เลื่อนลงเพื่อดูเพิ่มเติม"
    },
    stats: {
      exp: "ปีแห่งประสบการณ์",
      projects: "โปรเจกต์ที่สำเร็จ",
      code: "บรรทัดโค้ดที่เขียน",
      coffee: "กาแฟที่ดื่มไป"
    },
    about: {
      header: "เกี่ยวกับผม",
      subtitle: "ค้นพบตัวตนและทักษะที่ผมสั่งสมมา",
      storyTitle: "จุดเริ่มต้นและการเดินทาง",
      bioLong: "ผมคือ Developer ที่เชื่อว่า 'โค้ดที่ดีคือศิลปะ' ด้วยประสบการณ์ในการออกแบบสถาปัตยกรรมระบบตั้งแต่ระดับ Microservices ไปจนถึง Pixel-Perfect Frontend ผมพร้อมรับมือกับโจทย์ที่ซับซ้อน เพื่อส่งมอบโซลูชันที่เหนือความคาดหมาย",
      skillFrontend: "Frontend Specialists",
      skillBackend: "Backend & Systems",
      skillDevOps: "Infrastructure & Tools"
    },
    services: {
      header: "ความเชี่ยวชาญเฉพาะด้าน",
      subtitle: "มากกว่าการเขียนโค้ด คือการสร้างโซลูชันที่ขับเคลื่อนธุรกิจของคุณ",
      items: [
        {
          title: "Frontend Architecture",
          description: "วางโครงสร้าง Frontend ขนาดใหญ่ ให้ดูแลรักษาง่าย ประสิทธิภาพสูง และรองรับ SEO อย่างเต็มรูปแบบ"
        },
        {
          title: "Scalable Backend",
          description: "พัฒนาระบบหลังบ้านที่รองรับผู้ใช้งานจำนวนมาก พร้อมมาตรฐานความปลอดภัยระดับสากล"
        },
        {
          title: "DevOps & Cloud",
          description: "บริหารจัดการ Server, CI/CD Pipeline และ Cloud Infrastructure (AWS/GCP) แบบอัตโนมัติ"
        },
        {
          title: "UI/UX Engineering",
          description: "เปลี่ยนงานออกแบบให้เป็นโค้ดที่แม่นยำทุกพิกเซล พร้อม Interaction ที่ลื่นไหลเป็นธรรมชาติ"
        }
      ]
    },
    experience: {
      header: "เส้นทางอาชีพ",
      subtitle: "ประสบการณ์และความสำเร็จที่ผ่านมา",
      items: [
        {
          company: "Tech Giants Co.",
          role: "Senior Full Stack Developer",
          year: "2022 - ปัจจุบัน",
          description: "นำทีมพัฒนาแพลตฟอร์ม SaaS ขนาดใหญ่ รองรับผู้ใช้งานหลัก 100k+ ต่อวัน ออกแบบสถาปัตยกรรม Microservices ด้วย Node.js และ Kubernetes"
        },
        {
          company: "Innovative Solutions",
          role: "Frontend Lead",
          year: "2019 - 2022",
          description: "ดูแลโปรเจกต์ Design System ของบริษัท พัฒนา Web Application ด้วย Next.js และเพิ่มประสิทธิภาพความเร็วในการโหลดขึ้น 40%"
        },
        {
          company: "Freelance",
          role: "Web Developer",
          year: "2017 - 2019",
          description: "ส่งมอบโปรเจกต์ E-commerce และ Corporate Website คุณภาพสูงให้กับลูกค้ากว่า 20 รายทั่วโลก"
        }
      ]
    },
    projects: {
      header: "โปรเจกต์ที่น่าสนใจ",
      subtitle: "ผลงานระดับ Masterpiece ที่ผ่านการคัดสรรมาอย่างดี",
      action: "เลือกดำเนินการ",
      details: "รายละเอียดโปรเจกต์",
      live: "เข้าชมเว็บไซต์จริง",
      github: "ดู Code บน GitHub",
      comingSoon: "กำลังดำเนินการ...",
      featured: "ผลงานโดดเด่น",
      standard: "โปรเจกต์",
      items: [
        {
          title: "Goomairu",
          description: "เว็บแอปพลิเคชันสายเทคอัจฉริยะ โครงสร้าง Next.js พัฒนาด้วยเทคโนโลยีทันสมัย มาพร้อมระบบที่ลื่นไหลและการประมวลผลข้อมูล Real-time"
        },
        {
          title: "Data Crypto Pulse",
          description: "ระบบติดตามและวิเคราะห์ข้อมูลคริปโทเคอร์เรนซี Real-time Dashboard แสดงแนวโน้มราคาและสถิติตลาดคริปโทด้วยความแม่นยำสูง"
        },
        {
          title: "Milk Road",
          description: "เว็บแอปพลิเคชัน Milk Road สำหรับบริหารจัดการข้อมูลและบริการครบวงจร เชื่อมต่อ APIs ทรงพลังและอินเทอร์เฟซตอบสนองทันใจ"
        }
      ]
    },
    testimonials: {
      header: "คำนิยม",
      subtitle: "เสียงตอบรับจากผู้ที่เคยร่วมงานด้วย",
      items: [
        {
          name: "Sarah Johnson",
          role: "CTO ที่ StartupX",
          quote: "เขาสามารถเปลี่ยน requirements ที่ซับซ้อนให้เป็นระบบที่ใช้งานง่ายและมีประสิทธิภาพสูง"
        },
        {
          name: "Michael Chen",
          role: "Product Manager",
          quote: "การทำงานกับเขาลื่นไหลมาก เขามีความเข้าใจทั้งในมุมมองของ Tech และ Business ทำให้โปรเจกต์สำเร็จลุล่วงไปได้ด้วยดีเสมอ"
        }
      ]
    },
    footer: {
      ready: "พร้อมจะเปลี่ยนไอเดียของคุณ<br/>ให้กลายเป็นผลงานที่ยอดเยี่ยมหรือยัง?",
      btn: "เริ่มพูดคุยกับผม",
      copy: "สร้างสรรค์ด้วยความมุ่งมั่นและโค้ดคุณภาพ",
      toast: "คัดลอกอีเมลเรียบร้อย!"
    },
    certificates: {
      header: "เกียรติบัตรและวุฒิบัตร",
      subtitle: "การรับรองทักษะและความสำเร็จทางวิชาการ",
      view: "ดูรูปขยาย",
      items: [
        { title: "Network Penetration Testing", issuer: "NCSA (สกมช.)" },
        { title: "Cyber Security Analyst", issuer: "NCSA (สกมช.)" },
        { title: "Critical Infrastructure Protection", issuer: "OPSWAT Academy" },
        { title: "Network Security Excellence", issuer: "Success Network Security" },
        { title: "Foundations of Data Science", issuer: "Data Science Academy" },
        { title: "Cybersecurity Analyst", issuer: "Coursera & Google" },
        { title: "Cyber Security Fundamentals", issuer: "Cyber Defense Foundation" },
        { title: "WordPress CMS Development", issuer: "Coursera" },
        { title: "Gemini AI Specialist (Mock)", issuer: "ของปลอมทำเล่นๆ แต่จะพัฒนาตัวเองเพื่อเอาของจริงมาให้ได้!" }
      ]
    },
    resume: {
      header: "ประวัติส่วนตัว & เรซูเม่",
      subtitle: "เปิดอ่านเอกสาร Resume ได้โดยตรงบนเว็บไซต์ หรือดาวน์โหลดเก็บไว้",
      downloadBtn: "ดาวน์โหลด Resume (PDF)",
      openBtn: "เปิดดูแบบเต็มหน้าจอ",
      viewOnline: "เปิดในแท็บใหม่",
      closeBtn: "ปิดหน้าต่าง"
    }
  },
  en: {
    nav: {
      about: "About",
      services: "Services",
      work: "Work",
      exp: "Experience",
      resume: "Resume",
      cert: "Certificates",
      git: "Git"
    },
    hero: {
      status: "System Online. Ready to Code.",
      greeting: "Hi, I'm",
      subGreeting: "Here to be your",
      bio: "Turning ideas into reality with high-quality code. Passionate about performance and exceptional user experience.",
      btnWork: "View My Work",
      btnContact: "Get In Touch",
      scroll: "Scroll Down"
    },
    stats: {
      exp: "Years Experience",
      projects: "Projects Delivered",
      code: "Lines of Code",
      coffee: "Coffees Consumed"
    },
    about: {
      header: "About Me",
      subtitle: "Discover my persona and skills",
      storyTitle: "The Origin Story",
      bioLong: "I am a developer who believes 'Good code is art'. With experience designing systems from microservices to pixel-perfect frontends, I'm ready to tackle complex challenges and deliver superior solutions.",
      skillFrontend: "Frontend Powerhouse",
      skillBackend: "Backend & Data",
      skillDevOps: "DevOps & Tools"
    },
    services: {
      header: "Areas of Expertise",
      subtitle: "More than just writing code, it's about delivering solutions that solve business problems.",
      items: [
        {
          title: "Frontend Architecture",
          description: "Design large-scale frontend structures for easy maintenance, fast loading, and SEO optimization."
        },
        {
          title: "Scalable Backend",
          description: "Develop backends supporting thousands of users with international security standards."
        },
        {
          title: "DevOps & Cloud",
          description: "Automate Server setup, CI/CD pipelines, and manage cloud infrastructure (AWS/GCP)."
        },
        {
          title: "UI/UX Engineering",
          description: "Transform designs into pixel-perfect code with fluid 60fps interactions."
        }
      ]
    },
    experience: {
      header: "Experience",
      subtitle: "Career path and past achievements",
      items: [
        {
          company: "Tech Giants Co.",
          role: "Senior Full Stack Developer",
          year: "2022 - Present",
          description: "Leading large-scale SaaS platform development for 100k+ daily users, designing microservices with Node.js and Kubernetes."
        },
        {
          company: "Innovative Solutions",
          role: "Frontend Lead",
          year: "2019 - 2022",
          description: "Responsible for major design systems, developing web apps with Next.js and reducing page load times by 40%."
        },
        {
          company: "Freelance",
          role: "Web Developer",
          year: "2017 - 2019",
          description: "Delivering high-quality e-commerce and corporate websites for 20+ global clients."
        }
      ]
    },
    projects: {
      header: "Featured Projects",
      subtitle: "Carefully selected masterpiece works",
      action: "Select Action",
      details: "Project Details",
      live: "Open Live Website",
      github: "View on GitHub",
      comingSoon: "Links coming soon...",
      featured: "Featured Build",
      standard: "Project",
      items: [
        {
          title: "Goomairu",
          description: "Smart tech web application built with Next.js modern architecture, fluid user interface, and real-time data processing."
        },
        {
          title: "Data Crypto Pulse",
          description: "Real-time cryptocurrency analytics & market data tracking dashboard with live price trends and high-precision data insights."
        },
        {
          title: "Milk Road",
          description: "Milk Road web application for end-to-end data management and services with high-performance API integration and responsive UX."
        }
      ]
    },
    testimonials: {
      header: "Testimonials",
      subtitle: "Feedback from those I've collaborated with",
      items: [
        {
          name: "Sarah Johnson",
          role: "CTO at StartupX",
          quote: "He can transform complex requirements into intuitive and high-performance systems."
        },
        {
          name: "Michael Chen",
          role: "Product Manager",
          quote: "Collaboration was seamless. He understands both tech and business perspectives, always delivering successful projects."
        }
      ]
    },
    footer: {
      ready: "Ready to create something <br/> extraordinary?",
      btn: "Start a Conversation",
      copy: "Crafted with passion & code",
      toast: "Email Copied!"
    },
    certificates: {
      header: "Certificates & Awards",
      subtitle: "Recognition of skills and academic achievements",
      view: "View Full Size",
      items: [
        { title: "Network Penetration Testing", issuer: "NCSA" },
        { title: "Cyber Security Analyst", issuer: "NCSA" },
        { title: "Critical Infrastructure Protection", issuer: "OPSWAT" },
        { title: "Network Security Excellence", issuer: "Success Network Security" },
        { title: "Foundations of Data Science", issuer: "Data Science Academy" },
        { title: "Cybersecurity Analyst", issuer: "Coursera & Google" },
        { title: "Cyber Security Fundamentals", issuer: "Cyber Defense Foundation" },
        { title: "WordPress CMS Development", issuer: "Coursera" },
        { title: "Gemini AI Specialist (Mock)", issuer: "Fake one, but I'll thrive till I get the real one!" }
      ]
    },
    resume: {
      header: "Resume & Curriculum Vitae",
      subtitle: "Read the complete resume directly on-site or download as PDF",
      downloadBtn: "Download Resume (PDF)",
      openBtn: "View Fullscreen",
      viewOnline: "Open in New Tab",
      closeBtn: "Close Window"
    }
  }
};
