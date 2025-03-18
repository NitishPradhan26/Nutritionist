import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: '',
});

export async function analyzeImageWithOpenAI(imageUrl: string) {
  try {

    const prompt = "Confidently and concisely (with as few words as possible) identify and return all the ingredients of the food item shown in the image as a numbered list. Include details on composition (e.g., gluten, buckwheat) and for allergens, place them in parentheses without using 'contains' or additional text";
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: imageUrl } }
          ],
        },
      ],
    });
    
    console.log(response.choices[0].message.content);
    console.log("Reached end of openai");

    return response.choices[0]?.message?.content || null;
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
}