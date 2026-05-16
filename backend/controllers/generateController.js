import { generateAIContent } from "../services/aiService.js";
import { cleanJson } from "../utils/cleanJson.js";

export const generateLandingPage = async (req, res) => {
  try {
    const { businessType, audience, style, color, background, heroImageUrl } = req.body;
    const prompt = `
You are an expert Senior UI/UX Designer and SaaS Product Architect.

Your job is to generate a COMPLETE, production-ready landing page JSON for a modern AI website builder.

This is NOT a simple content generator.
This is a REAL website design system generator like Framer AI or V0.

---

🚨 STRICT RULES:
- Return ONLY valid JSON
- NO markdown, NO explanation, NO comments
- Output must start with { and end with }
- Must be fully unique every time (NO repeated patterns or generic templates)
- Must feel like a real startup landing page
- Do NOT reuse previous wording or structures

---

🧠 CORE OBJECTIVE:
Generate a HIGHLY UNIQUE SaaS landing page where only CONTENT changes, not structure.

The website must always follow the SAME layout:

👉 FIXED STRUCTURE (DO NOT CHANGE ORDER):

1. Navbar
2. Hero (text left, image right)
3. Features
4. Projects
5. About
6. Testimonials
7. Contact
8. Footer

---

🎨 DESIGN INTELLIGENCE (VERY IMPORTANT):

You MUST include a "design" object:

{
  "design": {
    "style": "minimal | futuristic | glassmorphism | corporate | brutalist",
    "font": "inter | poppins | space-grotesk | roboto",
    "radius": "none | soft | rounded | full",
    "shadow": "none | light | strong",
    "density": "compact | medium | spacious",
    "animationLevel": "none | subtle | dynamic"
  }
}

---

📌 INPUTS:
Business Type: ${businessType}
Audience: ${audience}
Style Preference: ${style}
Primary Color: ${color}
Background: ${background}
Hero Image URL: ${heroImageUrl || "none"}

---

🧱 REQUIRED OUTPUT STRUCTURE (FIXED):

{
  "design": { ... },

  "theme": {
    "style": "${style}",
    "primaryColor": "${color}",
    "background": "${background}"
  },

  "navbar": {
    "logo": {
      "text": "",
      "icon": ""
    },
    "links": [
      { "label": "Features", "href": "#features" },
      { "label": "Projects", "href": "#projects" },
      { "label": "About", "href": "#about" },
      { "label": "Contact", "href": "#contact" }
    ],
    "ctaButton": {
      "text": "",
      "style": "primary | outline"
    }
  },

  "hero": {
    "title": "",
    "subtitle": "",
    "cta": "",
    "image": {
    "type": "upload",
    "url": "",
    "alt": ""
}
  },

  "features": [
    {
      "title": "",
      "description": ""
    },
    {
      "title": "",
      "description": ""
    },
    {
      "title": "",
      "description": ""
    }
  ],

  "projects": [
    {
      "title": "",
      "description": ""
    },
    {
      "title": "",
      "description": ""
    }
  ],

  "about": {
    "title": "",
    "description": ""
  },

  "testimonials": [
    {
      "name": "",
      "role": "",
      "content": ""
    },
    {
      "name": "",
      "role": "",
      "content": ""
    }
  ],

  "contact": {
    "title": "",
    "emailPlaceholder": "",
    "buttonText": ""
  },

  "footer": {
    "text": "",
    "links": [
      { "label": "Privacy Policy", "href": "#" },
      { "label": "Terms", "href": "#" },
      { "label": "Support", "href": "#" }
    ]
  }
}

---

🧠 IMPORTANT CREATIVE RULES:

1. Every output must feel like a different startup company
2. Avoid repeating sentence patterns
3. Vary tone: professional, bold, luxury, startup, creative
4. Make hero section highly unique every time
5. If a Hero Image URL is provided, ALWAYS use it in hero.image.url
6. NEVER generate an AI image prompt or external image URL when heroImageUrl exists
7. hero.image must always be an upload object with type, url, and alt
8. Never generate generic placeholder content
9. Design system must change significantly each generation
---

🔥 CONTENT MAXIMIZATION SYSTEM (VERY IMPORTANT):

You must generate RICH, HIGH-DENSITY content for every section.

This is NOT a minimal landing page.
This is a FULL startup website with deep marketing content.

---

📈 CONTENT DEPTH RULES:

1. Hero section must feel like a full product pitch:
- Strong emotional hook
- Clear value proposition
- Powerful SaaS positioning
- Slightly longer subtitle (1–2 sentences minimum)

---

2. Features MUST be EXPANDED:

Instead of simple features:
- Each feature must include:
  - strong title (marketing level)
  - detailed description (2–3 sentences minimum)
  - real-world benefit explanation
  - optional micro-detail about how it works

---

3. Projects section must feel REAL:

Each project MUST include:
- project name
- detailed description (3–4 sentences minimum)
- use case scenario
- implied tech/business value

---

4. About section must be STORY-DRIVEN:

About section MUST include:
- company mission
- vision statement
- origin story (why it exists)
- emotional tone (startup identity)

Description MUST be at least 4–6 sentences.

---

5. Testimonials must be HIGHLY REALISTIC:

Each testimonial MUST include:
- believable person identity
- job title with company
- detailed feedback (2–3 sentences minimum)
- emotional + result-driven impact

---

6. CTA section must be HIGH IMPACT:

CTA must include:
- strong persuasive headline
- urgency or transformation message
- business outcome focus

---

7. NAVBAR ENHANCEMENT RULE:

Links must remain same structure BUT:
- add MORE meaningful labels in text content across sections
- ensure navigation reflects a real SaaS product

---

8. SEO + MARKETING QUALITY BOOST:

Every section must feel like:
- a real SaaS landing page from a funded startup
- persuasive copywriting (not generic AI text)
- conversion-focused messaging

---

9. NO SHORT CONTENT RULE:

STRICT RULE:
- No single-line descriptions allowed (except navbar links)
- Every content field must feel “human written”
- Avoid generic placeholders like "Lorem ipsum style"
- Features, projects, about, testimonials must have rich, detailed content
- Squize as much real marketing content as possible into every section
- Make the landing page feel like a real startup website, not a demo or template
- The response in Json must be at least 5000 characters long (excluding formatting) to ensure depth and richness of content

---

10. NATURAL VARIATION RULE:

Even with fixed structure:
- change writing style every generation
- vary tone: startup / luxury / technical / bold / enterprise
- avoid repetitive phrasing patterns

---

🚀 FINAL GOAL:

The output must feel like:
"Stripe + Notion + Framer level landing page content"

NOT:
generic AI-generated website

---

💡 CONTENT INTENSITY MODE:

Think of this as:
👉 1 landing page = full marketing website copy
👉 not a demo page
👉 not a template
👉 a real SaaS product website ready to launch
`;

    const raw = await generateAIContent(prompt);

    if (!raw) {
      throw new Error("Empty AI response");
    }

    const cleaned = cleanJson(raw);

    const parsed = JSON.parse(cleaned);

    // If the client provided a hero image URL, enforce the upload object and keep the image permanent.
    if (heroImageUrl) {
      parsed.hero = parsed.hero || {};
      parsed.hero.image = {
        type: "upload",
        url: heroImageUrl,
        alt: "user uploaded image",
      };
    } else {
      parsed.hero = parsed.hero || {};
      parsed.hero.image = parsed.hero.image || {
        type: "upload",
        url: "",
        alt: "Hero image",
      };
      parsed.hero.image.type = "upload";
      parsed.hero.image.url = parsed.hero.image.url || "";
      parsed.hero.image.alt = parsed.hero.image.alt || "Hero image";
    }

    parsed.theme = parsed.theme || {};
    parsed.theme.style = parsed.theme.style || style;
    parsed.theme.primaryColor = parsed.theme.primaryColor || color;
    parsed.theme.background = parsed.theme.background || background;
    parsed.color = parsed.color || color;
    parsed.background = parsed.background || background;

    return res.json({
      success: true,
      data: parsed,
    });

  } catch (error) {
    console.log("Generation Error:", error);

    return res.status(500).json({
      success: false,
      error: "Generation failed",
    });
  }
};