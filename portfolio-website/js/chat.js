/* ============================================================
   chat.js — "Ask my AI twin" chat widget
   A lightweight, offline AI assistant that answers questions
   about Mukesh's skills, projects and experience.
   ============================================================ */
(function () {
    "use strict";

    var fab = document.getElementById("chatFab");
    var panel = document.getElementById("chatPanel");
    var closeBtn = document.getElementById("chatClose");
    var body = document.getElementById("chatBody");
    var form = document.getElementById("chatForm");
    var input = document.getElementById("chatText");
    var suggests = document.getElementById("chatSuggests");
    if (!fab || !panel || !body || !form || !input) return;

    /* ---------- Knowledge base ---------- */
    var KB = [
        {
            keys: ["project", "built", "build", "work", "portfolio", "repo"],
            reply: "Mukesh's main projects are:\n• <strong>NutriScan AI</strong> — AI food scanner with barcode health grades (A–F) & NOVA scoring (React, FastAPI, PyTorch)\n• <strong>EduTracker</strong> — student activity points platform (Flutter, Spring Boot, MySQL)\n• <strong>Jarvis</strong> — Python voice assistant with wake-word detection & OpenAI\n• <strong>NeetCode submissions</strong> — DSA practice in C++.\nAll live on github.com/Mukesh1701 🚀"
        },
        {
            keys: ["nutriscan", "food", "scanner", "barcode", "nutrition"],
            reply: "<strong>NutriScan AI</strong> is a free AI-powered food scanner — point your camera at any barcode and instantly get a health grade (A–F), NOVA processing score, full nutrition breakdown and ingredient alerts. No sign-up needed. Built with React, FastAPI & PyTorch on top of Open Food Facts. 🥗"
        },
        {
            keys: ["edutracker", "activity points", "student"],
            reply: "<strong>EduTracker</strong> is a Student Activity Points Tracker Mukesh built with a 5-member team — a Flutter + Spring Boot + MySQL platform for submitting, verifying and tracking student activity points, complete with role-based dashboards. 📱"
        },
        {
            keys: ["jarvis", "voice", "assistant"],
            reply: "<strong>Jarvis</strong> is a Python voice assistant with wake-word detection — it opens websites, plays music, fetches the news and answers questions using the OpenAI API. Built with speech-recognition and gTTS. 🤖"
        },
        {
            keys: ["skill", "stack", "tech", "know", "language", "tools"],
            reply: "Mukesh's stack:\n• <strong>AI/ML:</strong> PyTorch, computer vision, transfer learning, generative AI, LLMs\n• <strong>Web/Mobile:</strong> React, JavaScript, HTML/CSS, FastAPI, Flutter\n• <strong>Languages:</strong> Python, C++, Java, Dart\n• <strong>Tools:</strong> MySQL, Spring Boot, Git, Postman 🛠️"
        },
        {
            keys: ["contact", "email", "reach", "hire", "connect"],
            reply: "You can reach Mukesh at <strong>veeravallimukesh2006@gmail.com</strong> ✉️ — or connect on LinkedIn (veeravalli-mukesh) and GitHub (@Mukesh1701). He's open to internships, collaborations and freelance work!"
        },
        {
            keys: ["college", "study", "education", "nit", "student", "year", "btech"],
            reply: "Mukesh is a 3rd-year B.Tech student at <strong>NIT Calicut</strong>, focused on AI/ML and web development. 🎓"
        }
        {
            keys: ["about", "who", "yourself", "mukesh", "intro"],
            reply: "<strong>Veeravalli Mukesh</strong> is a developer & AI/ML enthusiast at NIT Calicut. He builds AI-powered apps, web experiences and ML projects — currently deep into deep learning, computer vision and generative AI, while learning system design for ML-powered apps. 🚀"
        },
        {
            keys: ["cgpa", "gpa", "marks", "percentage", "grade"],
            reply: "Nice try 😄 — academic scores aren't listed here, but Mukesh's projects speak for themselves. Check out NutriScan AI on GitHub!"
        },
        {
            keys: ["github", "linkedin", "social", "instagram"],
            reply: "Find Mukesh here:\n• GitHub: <strong>@Mukesh1701</strong>\n• LinkedIn: <strong>veeravalli-mukesh</strong>\n• Instagram: <strong>mukesh._.chowdary</strong> 🔗"
        },
        {
            keys: ["hello", "hi", "hey", "namaste"],
            reply: "Hey there! 👋 I'm Mukesh's AI twin. Ask me about his projects, skills, or how to reach him!"
        },
        {
            keys: ["learn", "current", "now", "exploring", "doing"],
            reply: "Currently Mukesh is exploring <strong>deep learning, computer vision & generative AI</strong> (PyTorch, transfer learning, LLMs) and learning <strong>system design</strong> for scaling ML-powered web apps. 🌱"
        }
    ];

    var FALLBACK = "I'm not sure about that one 🤔 — try asking about Mukesh's <strong>projects</strong>, <strong>skills</strong>, <strong>education</strong>, or how to <strong>contact</strong> him!";

    var SUGGESTIONS = ["Tell me about projects", "What's his tech stack?", "How can I contact him?"];

    /* ---------- Helpers ---------- */
    function addMsg(text, who) {
        var div = document.createElement("div");
        div.className = "chat-msg " + who;
        div.innerHTML = text.replace(/\n/g, "<br>");
        body.appendChild(div);
        body.scrollTop = body.scrollHeight;
        return div;
    }

    function botReply(text) {
        var typing = addMsg("<span></span><span></span><span></span>", "bot typing");
        setTimeout(function () {
            typing.remove();
            addMsg(text, "bot");
        }, 700 + Math.random() * 500);
    }

    function answer(q) {
        var lower = q.toLowerCase();
        for (var i = 0; i < KB.length; i++) {
            for (var k = 0; k < KB[i].keys.length; k++) {
                if (lower.indexOf(KB[i].keys[k]) !== -1) return KB[i].reply;
            }
        }
        return FALLBACK;
    }

    /* ---------- Toggle ---------- */
    var opened = false;
    function open() {
        panel.classList.add("is-open");
        panel.setAttribute("aria-hidden", "false");
        setTimeout(function () { input.focus(); }, 350);
        if (!opened) {
            opened = true;
            botReply("Hey! 👋 I'm <strong>Mukesh's AI twin</strong>. Ask me anything about his projects, skills or experience.");
            SUGGESTIONS.forEach(function (s) {
                var b = document.createElement("button");
                b.type = "button";
                b.textContent = s;
                b.addEventListener("click", function () {
                    addMsg(s, "user");
                    botReply(answer(s));
                });
                suggests.appendChild(b);
            });
        }
    }
    function close() {
        panel.classList.remove("is-open");
        panel.setAttribute("aria-hidden", "true");
    }

    fab.addEventListener("click", function () {
        if (panel.classList.contains("is-open")) close(); else open();
    });
    closeBtn.addEventListener("click", close);

    /* ---------- Submit ---------- */
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        var text = input.value.trim();
        if (!text) return;
        addMsg(text.replace(/</g, "&lt;"), "user");
        input.value = "";
        botReply(answer(text));
    });
})();

    ];
