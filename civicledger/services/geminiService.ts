
import { GoogleGenAI, Type } from "@google/genai";

export interface AIAnalysisResult {
    type: string;
    severity: 'Low' | 'Medium' | 'High';
    description: string;
}

// Helper function to convert File to base64
const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                const base64Data = reader.result.split(',')[1];
                if (base64Data) {
                    resolve(base64Data);
                } else {
                    reject(new Error("Failed to extract base64 data from file."));
                }
            } else {
                 reject(new Error("FileReader result is not a string."));
            }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
    const data = await base64EncodedDataPromise;
    return {
        inlineData: {
            data,
            mimeType: file.type,
        },
    };
};

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// This is a mock function to simulate calling an AI API like Gemini.
// In a real application, this would handle the API call to analyze the image.
export const analyzeIssueImage = async (imageFile: File): Promise<AIAnalysisResult> => {
    console.log('Analyzing image with Gemini:', imageFile.name);

    const imagePart = await fileToGenerativePart(imageFile);
    
    const prompt = "Analyze this image of a civic issue. Identify the type of issue (e.g., Pothole, Graffiti, Broken Streetlight, Fallen Tree), assess its severity (must be one of: Low, Medium, or High), and provide a brief description. Respond in JSON format.";

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: { parts: [imagePart, { text: prompt }] },
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    type: {
                        type: Type.STRING,
                        description: "The type of civic issue identified.",
                    },
                    severity: {
                        type: Type.STRING,
                        description: "The severity of the issue, must be 'Low', 'Medium', or 'High'.",
                    },
                    description: {
                        type: Type.STRING,
                        description: "A brief description of the issue.",
                    },
                },
                required: ["type", "severity", "description"],
            },
        },
    });

    const jsonString = response.text.trim();
    const analysisResult = JSON.parse(jsonString) as AIAnalysisResult;

    if (!['Low', 'Medium', 'High'].includes(analysisResult.severity)) {
       console.warn(`Received unexpected severity: ${analysisResult.severity}. Defaulting to Medium.`);
       analysisResult.severity = 'Medium';
    }

    return analysisResult;
};
