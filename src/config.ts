export const config = {
    developer: {
        name: "Mukesh",
        fullName: "Mukesh Veeravalli",
        title: "AI & Full-Stack Developer",
        description: "AI & Full-Stack Developer building intelligent systems and modern web applications. Passionate about machine learning, deep learning, computer vision, and creating real products that solve real problems."
    },
    social: {
        github: "Mukesh1701",
        email: "veeravallimukesh2006@gmail.com",
        location: "India"
    },
    about: {
        title: "About Me",
        description: "I am an AI & Full-Stack Developer from India, currently pursuing my B.Tech at NIT Calicut. I build intelligent systems, AI-powered apps, and modern web experiences. My expertise includes Machine Learning, Deep Learning, Computer Vision, and Full-Stack Web Development with React, Python, and FastAPI. I built NutriScan AI, a free AI food scanner, and EduTracker, a student activity points platform shipped with a 5-member team. Currently exploring deep learning, generative AI, and system design for ML-powered apps. Code is poetry, AI is the canvas."
    },
    experiences: [
        {
            position: "Exploring AI & Deep Learning",
            company: "Self-Development",
            period: "2026 - Present",
            location: "India",
            description: "Going deep into deep learning, computer vision, and generative AI while learning system design for scaling ML-powered web applications.",
            responsibilities: [
                "Training and fine-tuning models with PyTorch and transfer learning",
                "Exploring LLMs and generative AI workflows",
                "Studying system design for ML-powered applications",
                "Building innovative personal projects"
            ],
            technologies: ["PyTorch", "Computer Vision", "LLMs", "Generative AI", "System Design"]
        },
        {
            position: "AI/ML Developer",
            company: "Personal Projects",
            period: "2026",
            location: "India",
            description: "Built NutriScan AI — a free AI-powered food scanner that gives barcode health grades (A-F), NOVA processing scores, nutrition breakdown, and ingredient alerts. No sign-up needed.",
            responsibilities: [
                "Developing ML models for food grading and scoring",
                "Building the product with React and FastAPI",
                "Integrating the Open Food Facts database",
                "Shipping a free, sign-up-free user experience"
            ],
            technologies: ["React", "FastAPI", "PyTorch", "Open Food Facts", "Python"]
        },
        {
            position: "Full-Stack Developer",
            company: "EduTracker — 5-Member Team",
            period: "2026",
            location: "India",
            description: "Shipped EduTracker, a Student Activity Points Tracker platform for submitting, verifying, and tracking student activity points with role-based dashboards.",
            responsibilities: [
                "Building cross-platform mobile UIs with Flutter",
                "Developing Spring Boot REST APIs",
                "Designing the MySQL data model",
                "Implementing role-based dashboards and access control"
            ],
            technologies: ["Flutter", "Spring Boot", "MySQL", "Java", "Dart", "RBAC"]
        },
        {
            position: "Web Developer",
            company: "Self-Taught & Projects",
            period: "2025",
            location: "India",
            description: "Built responsive, human-friendly websites with semantic HTML, modern CSS, and JavaScript, with a strong eye for UI/UX and detail — including this 3D portfolio.",
            responsibilities: [
                "Developing responsive and performant web applications",
                "Learning React and modern frontend tooling",
                "Designing clean, accessible user interfaces",
                "Deploying and maintaining web projects"
            ],
            technologies: ["HTML", "CSS", "JavaScript", "React", "TailwindCSS", "Figma"]
        },
        {
            position: "Python Programmer",
            company: "Self-Taught & Projects",
            period: "2024",
            location: "India",
            description: "Dove deep into Python programming — built Jarvis, a voice assistant with wake-word detection that opens websites, plays music, fetches news, and answers questions using OpenAI.",
            responsibilities: [
                "Building a voice assistant with wake-word detection",
                "Integrating OpenAI APIs for conversational intelligence",
                "Working with speech recognition and text-to-speech (gTTS)",
                "Writing automation scripts and tooling"
            ],
            technologies: ["Python", "Speech Recognition", "OpenAI", "gTTS", "Automation"]
        },
        {
            position: "Started Coding",
            company: "Foundations",
            period: "2023",
            location: "India",
            description: "Started my journey into programming with C++ — grinding data structures and algorithms and building the problem-solving mindset that powers everything I do today.",
            responsibilities: [
                "Learning C++ and core programming concepts",
                "Solving data structures and algorithms problems",
                "Practicing consistently on NeetCode",
                "Building strong problem-solving fundamentals"
            ],
            technologies: ["C++", "Data Structures", "Algorithms", "Problem Solving"]
        }
    ],
    projects: [
        {
            id: 1,
            title: "NutriScan AI",
            category: "AI / ML",
            technologies: "React, FastAPI, PyTorch, Python, Open Food Facts",
            image: "/images/NutriScanAI.png",
            description: "A free AI-powered food scanner — point your camera at any barcode and instantly get a health grade (A-F), NOVA processing score, full nutrition breakdown, and ingredient alerts. No sign-up needed.",
            link: "https://github.com/Mukesh1701/NutriScan-AI"
        },
        {
            id: 2,
            title: "EduTracker",
            category: "Full-Stack / Mobile",
            technologies: "Flutter, Spring Boot, MySQL, Java, Dart, Role-Based Access",
            image: "/images/EduTracker.png",
            description: "A Student Activity Points Tracker platform built by a 5-member team — submit, verify, and track student activity points with role-based dashboards for students, faculty, and admins.",
            link: "https://github.com/Mukesh1701/Group06_EduTracker"
        },
        {
            id: 3,
            title: "Jarvis",
            category: "AI Assistant",
            technologies: "Python, Speech Recognition, OpenAI API, gTTS",
            image: "/images/Jarvis.png",
            description: "A Python voice assistant with wake-word detection — opens websites, plays music, fetches the news, and answers questions using OpenAI. Your own JARVIS-style desktop companion.",
            link: "https://github.com/Mukesh1701/Jarvis"
        },
        {
            id: 4,
            title: "NeetCode Submissions",
            category: "DSA / Competitive",
            technologies: "C++, Data Structures, Algorithms",
            image: "/images/NeetCode.png",
            description: "My NeetCode.io problem submissions — consistent grinding of data structures and algorithms in C++ to build strong problem-solving fundamentals.",
            link: "https://github.com/Mukesh1701/neetcode-submissions"
        },
        {
            id: 5,
            title: "3D Portfolio",
            category: "Web / 3D",
            technologies: "React, TypeScript, Three.js, GSAP, WebGL",
            image: "/images/Portfolio.png",
            description: "This interactive 3D developer portfolio — a React + TypeScript + Three.js experience with GSAP animations, a 3D character, and an AI chat assistant.",
            link: "https://github.com/Mukesh1701/Mukesh-Portfolio"
        },
        {
            id: 6,
            title: "Play Chess vs AI",
            category: "AI / Game Engine",
            technologies: "React, chess.js, Stockfish WASM Engine",
            image: "/images/ChessAI.png",
            description: "Play a full game of chess against a built-in AI engine right in the browser — with move history, captured-piece tracking, and an integrated chat assistant.",
            link: "/play"
        }
    ],
    contact: {
        email: "veeravallimukesh2006@gmail.com",
        github: "https://github.com/Mukesh1701",
        linkedin: "https://www.linkedin.com/in/veeravalli-mukesh-1840b7321/",
        twitter: "#",
        facebook: "#",
        instagram: "https://www.instagram.com/mukesh._.chowdary?igsh=eWhiY3V3d3J0a3Rj"
    },
    skills: {
        develop: {
            title: "AI / ML DEVELOPER",
            description: "Building intelligent systems & ML-powered products",
            details: "Developing machine learning models and AI-powered applications using Python, PyTorch, and FastAPI. Specializing in computer vision, transfer learning, LLMs, and generative AI.",
            tools: ["Python", "PyTorch", "Computer Vision", "Transfer Learning", "LLMs", "Generative AI", "OpenCV", "FastAPI", "Pandas", "NumPy"]
        },
        design: {
            title: "WEB & MOBILE DEVELOPER",
            description: "Modern web & mobile development",
            details: "Building responsive and performant web and mobile applications using React, Flutter, Spring Boot, and MySQL. Creating seamless user experiences with modern UI/UX principles.",
            tools: ["React", "JavaScript", "HTML/CSS", "Flutter", "Dart", "Spring Boot", "MySQL", "TailwindCSS", "Git", "Figma"]
        }
    }
};
