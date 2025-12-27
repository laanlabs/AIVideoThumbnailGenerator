
import { GoogleGenAI } from "@google/genai";

export async function generateThumbnailVariation(
  subjectImage: string,
  subjectMime: string,
  referenceImage: string | null,
  referenceMime: string | null,
  thumbnailText: string,
  videoDescription: string,
  stylePrompt: string
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const textInstruction = thumbnailText 
    ? `CRITICAL: The thumbnail MUST display this exact text: "${thumbnailText}". Use professional, high-impact typography. Make the text stand out with outlines, shadows, or 3D effects.`
    : "Choose appropriate, viral-style text based on the video description if needed.";

  const contextInstruction = videoDescription 
    ? `The video is about: "${videoDescription}". Design the background and visual cues to perfectly match this topic.`
    : "";

  const styleInstruction = referenceImage 
    ? "IMAGE 2 is a STYLE REFERENCE. Match its color palette, lighting, composition style, and overall professional aesthetic exactly."
    : `Apply the following style direction: ${stylePrompt}`;

  const parts: any[] = [
    {
      inlineData: {
        data: subjectImage.split(',')[1],
        mimeType: subjectMime,
      },
    }
  ];

  if (referenceImage && referenceMime) {
    parts.push({
      inlineData: {
        data: referenceImage.split(',')[1],
        mimeType: referenceMime,
      },
    });
  }

  parts.push({
    text: `You are a world-class YouTube Thumbnail Designer specializing in high-CTR (click-through rate) graphics.
    
    INPUTS:
    - IMAGE 1: The main subject(s) to be featured.
    ${referenceImage ? "- IMAGE 2: Style reference to emulate." : ""}
    - Target Text: ${thumbnailText || 'None specified'}
    - Video Topic: ${videoDescription || 'General'}

    YOUR TASK:
    1. Extract the primary subjects from IMAGE 1. Remove their original background cleanly. Clean up the subject and make look more photogenic.
    2. Place these subjects in a new, high-production-value environment that fits the Video Topic.
    3. ${styleInstruction}
    4. ${textInstruction}
    5. ${contextInstruction}
    6. Ensure the final image is extremely sharp, vibrant, and follows the rule of thirds for maximum visual impact.
    
    The output MUST be a 16:9 aspect ratio image. 
    DO not add any additional text than the target text. 
    Make sure the corners of the image are not rounded`,
  });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts },
      config: {
        imageConfig: {
          aspectRatio: "16:9"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error('No image was generated. Please try again with different inputs.');
  } catch (error) {
    console.error('Gemini Image Generation Error:', error);
    throw error;
  }
}
