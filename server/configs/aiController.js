import Resume from "../models/Resume.js";
import ai from "../configs/ai.js"

// NEW SAFE FUNCTION WITH RETRY
async function safeAIRequest(prompt) {
  let retries = 2;
  while (retries > 0) {
    try {
      const response = await ai.responses.create({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        input: prompt,
      });

      return response.output_text;
    } catch (err) {
      if (err.status === 429) {
        console.log("⚠️ Rate limit hit. Retrying in 2 sec…");
        await new Promise((r) => setTimeout(r, 2000));
        retries--;
      } else {
        throw err;
      }
    }
  }
  throw new Error("AI rate limit — try again later");
}

export const enhanceProfessionalSummary = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent?.trim()) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const prompt = `
You are an expert resume writer.
Rewrite this into a clean, ATS-friendly professional summary. Keep it 1–2 sentences.

Text:
${userContent}
    `;

    const enhanced = await safeAIRequest(prompt);

    return res.status(200).json({ enhancedContent: enhanced.trim() });
  } catch (error) {
    console.error("AI Summary Error:", error);
    return res.status(500).json({ message: "AI Server Error" });
  }
};

//controller for enhancing a resumes's job descriptions
//POST:/api/ai/enhance-job-desc
export const enhanceJobDescription = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent?.trim()) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const prompt = `
You are an expert resume writer.
Convert this job description into a short 1–2 sentence ATS-friendly bullet.

Text:
${userContent}
    `;

    const enhanced = await safeAIRequest(prompt);

    return res.status(200).json({ enhancedContent: enhanced.trim() });
  } catch (error) {
    console.error("Job Desc Error:", error);
    return res.status(500).json({ message: "AI Server Error" });
  }
};


export const uploadResume = async (req, res) => {
  try {
    const { title, resumeText } = req.body;
    const userId = req.userId;

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized: userId missing" });
    }

    //  VALIDATION FIRST
    if (!title || !resumeText) {
      return res.status(400).json({ message: "Title and resume text are required" });
    }

    if (resumeText.length < 50) {
      return res.status(400).json({ message: "Resume content too short" });
    }

    let extractedData = {};
 
    try {
      const SystemPrompt = `
You are an expert resume parser.

STRICT RULES:
- Return ONLY valid JSON
- DO NOT skip any field
- If data missing → use "" or []
- NO explanation, ONLY JSON

Extract ALL:
- full name
- profession
- email
- phone
- location
- linkedin
- website
- professional summary
- skills
- experience
- projects
- education
`;

const userPrompt = `
Extract COMPLETE resume data.

STRICT RULES:
- Return ONLY valid JSON
- Do NOT skip any field
- If data not available → return empty string "" or []

FORMAT:
{
  "personal_info": {
    "full_name": "",
    "profession": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "website": ""
  },
  "professional_summary": "",
  "skills": [],
  "experience": [
    {
      "company": "",
      "position": "",
      "start_date": "",
      "end_date": "",
      "description": "",
      "is_current": ""
    }
  ],
  "project": [
    {
      "name": "",
      "type": "",
      "description": ""
    }
  ],
  "education": [
    {
      "institution": "",
      "degree": "",
      "filed": "",
      "graduation_date": "",
      "gpa": ""
    }
  ]
}

IMPORTANT:
- Extract ALL skills (technical + soft skills)
- Extract ALL projects if present
- If no projects → return empty array []

Resume:
${resumeText}
`;

      const response = await ai.chat.completions.create({
        model: process.env.OPENAI_MODEL,
        messages: [
          { role: "system", content: SystemPrompt },
          { role: "user", content: userPrompt }
        ],
      });

     let aiText = response.choices[0].message.content;

aiText = aiText.replace(/```json/g, "");
aiText = aiText.replace(/```/g, "");
aiText = aiText.trim();

try {
  extractedData = JSON.parse(aiText);
} catch (err) {
  extractedData = {};
}
    } catch (aiError) {
      
      extractedData = {
      rawText: resumeText,
      professional_summary: "",
      skills: [],
      personal_info: {},
      experience: [],
      project: [],
      education: []
      };
      
    }

     const finalData = {
          rawText: resumeText || "",
          professional_summary: extractedData.professional_summary || "",
          skills: Array.isArray(extractedData.skills) ? extractedData.skills : [],
          personal_info: {
          full_name: extractedData.personal_info?.full_name || "",
          profession: extractedData.personal_info?.profession || "",
          email: extractedData.personal_info?.email || "",
          phone: extractedData.personal_info?.phone || "",
          location: extractedData.personal_info?.location || "",
          linkedin: extractedData.personal_info?.linkedin || "",
          website: extractedData.personal_info?.website || ""
      },
      experience: Array.isArray(extractedData.experience) ? extractedData.experience : [],
      project: Array.isArray(extractedData.project) ? extractedData.project : [],
      education: Array.isArray(extractedData.education) ? extractedData.education : []
    };
  
if (!finalData.personal_info.full_name) {
  const firstLine = resumeText.split("\n")[0];
  finalData.personal_info.full_name = firstLine.slice(0, 40);
}

// EMAIL
const emailMatch = resumeText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/);
if (emailMatch) finalData.personal_info.email = emailMatch[0];

// PHONE
const phoneMatch = resumeText.match(/\+?\d[\d\s-]{8,}/);
if (phoneMatch) finalData.personal_info.phone = phoneMatch[0];

// LINKEDIN
const linkedinMatch = resumeText.match(/linkedin\.com\/[^\s]+/);
if (linkedinMatch) finalData.personal_info.linkedin = linkedinMatch[0];

// WEBSITE
const websiteMatch = resumeText.match(/https?:\/\/[^\s]+/);
if (websiteMatch) finalData.personal_info.website = websiteMatch[0];

//  PROFESSIONAL SUMMARY 
if (!finalData.professional_summary) {
  const sentences = resumeText.split(".").slice(0, 2);
  finalData.professional_summary = sentences.join(".");
}

// EXPERIENCE DETECTION
if (finalData.experience.length === 0) {
  finalData.experience = [];

  const lines = resumeText.split(/[\n\.]/);

  lines.forEach(line => {
    if (
      line.toLowerCase().includes("developer") ||
      line.toLowerCase().includes("intern") ||
      line.toLowerCase().includes("engineer")
    ) {
      finalData.experience.push({
        company: "",
        position: line.trim(),
        start_date: "",
        end_date: "",
        description: "",
        is_current: ""
      });
    }
  });
}

//  PROJECT DETECTION 
if (finalData.project.length === 0) {
  finalData.project = [];

  const lines = resumeText.split(/[\n\.]/);

  lines.forEach(line => {
    if (
      line.toLowerCase().includes("project") ||
      line.toLowerCase().includes("app") ||
      line.toLowerCase().includes("system")
    ) {
      finalData.project.push({
        name: line.trim(),
        type: "Detected",
        description: ""
      });
    }
  });
}

//  EDUCATION 
if (finalData.education.length === 0) {
  finalData.education = [];

  const lines = resumeText.split(/[\n\.]/);

  lines.forEach(line => {
    if (
      line.toLowerCase().includes("btech") ||
      line.toLowerCase().includes("b.sc") ||
      line.toLowerCase().includes("degree") ||
      line.toLowerCase().includes("college") ||
      line.toLowerCase().includes("university")
    ) {
      finalData.education.push({
        institution: line.trim(),
        degree: "",
        filed: "",
        graduation_date: "",
        gpa: ""
      });
    }
  });
}

    const newResume = await Resume.create({
      userId,
      title,
      ...finalData
    });

    return res.status(200).json({
      message: "Resume uploaded successfully",
      resume: newResume
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};