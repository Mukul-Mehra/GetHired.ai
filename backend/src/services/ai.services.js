import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY,

})
const interviewReportSchema = z.object({
    matchScore: z.number().min(0).max(100).describe("The match score between the candidate and the job describe."),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview."),
        intention: z.string().describe("The intention of interviewer behind asking this technical question."),
        answer: z.string().describe("how to answer this technical question, what points to cover. what approach to take while answering this question.")
    })).describe("Technical questions that can be asked in the interview, along with intention and how to answer them."),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview."),
        intention: z.string().describe("The intention of interviewer behind asking this technical question."),
        answer: z.string().describe("how to answer this technical question, what points to cover. what approach to take while answering this question.")
    })).describe("Behavioral questions that can be asked in the interview, along with intention and how to answer them."),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill in which the candidate is lacking as per the job describe."),
        severity: z.enum(["low", "medium", "high"]).describe("The severity of the skill gap.")
    })).describe("Gaps in skills that the candidate has as per the job describe."),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day of the week for the preparation task."),
        focus: z.string().describe("The area of focus for the preparation task."),

        task: z.array(z.string()).describe("The specific tasks to be completed for the preparation.")
    })).describe("A day wise preparation plan for the candidate to follow."),
})



export default async function generateInterviewReport(resume, selfdescribe, jobdescribe) {
const prompt = `You are an interview report generator.

Return ONLY valid JSON.
Do not return markdown.
Do not return explanations outside JSON.
Do not flatten arrays into alternating keys and values.

Output format:
{
  "matchScore": number,
  "technicalQuestions": [
    {
      "question": string,
      "intention": string,
      "answer": string
    }
  ],
  "behavioralQuestions": [
    {
      "question": string,
      "intention": string,
      "answer": string
    }
  ],
  "skillGaps": [
    {
      "skill": string,
      "severity": "low" | "medium" | "high"
    }
  ],
  "preparationPlan": [
    {
      "day": number,
      "focus": string,
      "task": [string]
    }
  ]
}

Rules:
- Every question entry must be a JSON object with question, intention, and answer keys and values.
- Every skill gap entry must be a JSON object.
- Every preparation plan entry must be a JSON object.
- Do not output key-value pairs as separate strings.
- Do not use arrays of alternating labels and values.
- Return strict JSON only.

Resume:
${resume}

Self-description:
${selfdescribe}

Job description:
${jobdescribe}

Do not flatten arrays into alternating keys and values.
`


    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseJsonSchema: zodToJsonSchema(interviewReportSchema)
        }
    })
    return JSON.parse(response.text);
}





