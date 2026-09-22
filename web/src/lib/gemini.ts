// Gemini AI Service for CivicDex Web
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export type IssueAnalysis = {
  title: string;
  description: string;
  category: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  isFraud: boolean;
  fraudReason?: string;
  confidenceScore: number;
};

export type CompletionVerification = {
  improvementScore: number;
  confidenceScore: number;
  fraudRiskScore: number;
  feedback: string;
  isCompleted: boolean;
};

export type WorkerRecommendation = {
  teamId: string;
  distanceKm: number;
  estimatedHours: number;
  priorityScore: number;
  reasoning: string;
};

export type OfficerSummary = {
  criticalIssues: string[];
  pendingReports: number;
  completedToday: number;
  recommendations: string[];
};

export class GeminiService {
  private model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  private proModel = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

  async analyzeIssue(imageUrl: string, description: string): Promise<IssueAnalysis> {
    const prompt = `Analyze this civic infrastructure issue image and description.
    
Description: ${description}

Return a JSON response with the following structure:
{
  "title": "Brief descriptive title",
  "description": "Detailed description of the issue",
  "category": "One of: ROADS, WATER, ELECTRICITY, WASTE, STREETLIGHTS, DRAINAGE, OTHER",
  "severity": "One of: Low, Medium, High, Critical",
  "isFraud": boolean,
  "fraudReason": "Reason if fraud detected, otherwise null",
  "confidenceScore": number (0-100)
}

Consider these fraud indicators:
- Image appears to be a screenshot or from internet
- Image quality is suspiciously low or high
- Description doesn't match image content
- Known duplicate image`;

    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from Gemini');
    }
    
    return JSON.parse(jsonMatch[0]);
  }

  async verifyCompletion(beforeImageUrl: string, afterImageUrl: string): Promise<CompletionVerification> {
    const prompt = `Compare these before and after images of a civic repair job.
    
Analyze if the repair was properly completed:
- Check if the issue visible in "before" image is resolved in "after" image
- Look for signs of fake repairs or manipulation
- Assess the quality of work

Return a JSON response:
{
  "improvementScore": number (0-100),
  "confidenceScore": number (0-100),
  "fraudRiskScore": number (0-100),
  "feedback": "Detailed feedback on the repair quality",
  "isCompleted": boolean (true if improvementScore >= 80 and fraudRiskScore < 20)
}`;

    const result = await this.proModel.generateContent([prompt, { uri: beforeImageUrl }, { uri: afterImageUrl }]);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from Gemini');
    }
    
    return JSON.parse(jsonMatch[0]);
  }

  async recommendWorker(
    issueLocation: { lat: number; lng: number },
    requiredSkills: string[],
    availableTeams: Array<{ id: string; location: { lat: number; lng: number }; skills: string[]; workload: number }>
  ): Promise<WorkerRecommendation[]> {
    const prompt = `Given the following data, recommend the best team for this civic issue:
    
Issue Location: ${issueLocation.lat}, ${issueLocation.lng}
Required Skills: ${requiredSkills.join(', ')}
Available Teams: ${JSON.stringify(availableTeams)}

Use this scoring formula:
Score = 0.4 * (1 - distance/maxDistance) + 0.3 * (1 - workload/maxWorkload) + 0.3 * skillMatch

Return a JSON array of recommendations sorted by priority score:
[{
  "teamId": string,
  "distanceKm": number,
  "estimatedHours": number,
  "priorityScore": number,
  "reasoning": string
}]`;

    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from Gemini');
    }
    
    return JSON.parse(jsonMatch[0]);
  }

  async generateOfficerSummary(issues: Array<{ id: string; status: string; severity: string; createdAt: string }>): Promise<OfficerSummary> {
    const prompt = `Generate an executive summary for a municipal officer based on these issues:
    
${JSON.stringify(issues, null, 2)}

Provide:
1. List of critical issues requiring immediate attention
2. Count of pending reports
3. Count of issues completed today
4. Actionable recommendations

Return JSON:
{
  "criticalIssues": string[],
  "pendingReports": number,
  "completedToday": number,
  "recommendations": string[]
}`;

    const result = await this.proModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from Gemini');
    }
    
    return JSON.parse(jsonMatch[0]);
  }

  async chatWithAssistant(message: string, context?: string): Promise<string> {
    const prompt = `You are CivicDex Assistant, a helpful AI for civic infrastructure management.
    
${context ? `Context: ${context}\n` : ''}
User: ${message}

Provide a helpful, concise response. Support multiple languages including Hindi, Punjabi, and English.`;

    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  }

  async detectDuplicate(
    description: string,
    location: { lat: number; lng: number },
    existingIssues: Array<{ id: string; description: string; location: { lat: number; lng: number } }>
  ): Promise<{ isDuplicate: boolean; duplicateId?: string; confidence: number }> {
    const prompt = `Check if this new issue report is a duplicate of existing reports.
    
New Issue:
- Description: ${description}
- Location: ${location.lat}, ${location.lng}

Existing Issues: ${JSON.stringify(existingIssues.slice(0, 10))}

Consider:
- Similar descriptions (semantic similarity)
- Proximity (within 50 meters)
- Same category

Return JSON:
{
  "isDuplicate": boolean,
  "duplicateId": string | null,
  "confidence": number (0-100)
}`;

    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from Gemini');
    }
    
    return JSON.parse(jsonMatch[0]);
  }
}

export const geminiService = new GeminiService();
