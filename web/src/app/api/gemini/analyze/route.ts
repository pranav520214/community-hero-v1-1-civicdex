import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageUrl, description } = body;

    if (!imageUrl || !description) {
      return NextResponse.json(
        { error: 'Image URL and description are required' },
        { status: 400 }
      );
    }

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

    const result = await model.generateContent([prompt, { uri: imageUrl }]);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from Gemini');
    }

    const analysis = JSON.parse(jsonMatch[0]);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze image' },
      { status: 500 }
    );
  }
}
