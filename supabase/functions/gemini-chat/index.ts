
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
const TRAVILY_API_KEY = Deno.env.get('TRAVILY_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, searchDoctors, location } = await req.json();

    // If it's a doctor search request
    if (searchDoctors && location) {
      return await searchDoctorsNearby(location, searchDoctors, corsHeaders);
    }

    // Regular chat with Gemini
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: messages.map((msg: any) => ({
          role: msg.sender === 'ai' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        })),
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1000,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(`Gemini API error: ${data.error.message}`);
    }

    let reply = '';
    try {
      reply = data.candidates[0].content.parts[0].text;
    } catch (e) {
      console.error('Error parsing Gemini response:', e);
      console.error('Response data:', JSON.stringify(data));
      throw new Error('Failed to parse Gemini response');
    }

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in gemini-chat function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function searchDoctorsNearby(location: string, specialty: string, corsHeaders: any) {
  if (!TRAVILY_API_KEY) {
    throw new Error('TRAVILY_API_KEY is not configured');
  }
  
  try {
    // Use Gemini to formulate a good search query
    const searchResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [{
          role: 'user',
          parts: [{ text: `Create a web search query for finding doctors specializing in ${specialty} near ${location}. Only return the search query, no additional text.` }]
        }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 100,
        }
      }),
    });
    
    const searchData = await searchResponse.json();
    const searchQuery = searchData.candidates[0].content.parts[0].text.trim();
    
    // Use Travily API to search for doctors
    const travilyResponse = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TRAVILY_API_KEY}`
      },
      body: JSON.stringify({
        query: searchQuery,
        search_depth: "advanced",
        include_images: true,
        include_answer: true,
        max_results: 10
      })
    });
    
    const travilyData = await travilyResponse.json();
    
    // Use Gemini to parse and extract structured doctor data
    const parsingResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [{
          role: 'user',
          parts: [{ text: `Based on these search results for doctors specializing in ${specialty} near ${location}, extract a list of at least 5 doctors with their name, specialty, location, and contact information if available. Format the output as a JSON array with fields: name, specialty, address, phone, website, rating (if available). 
          
          Search results:
          ${JSON.stringify(travilyData)}`
          }]
        }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 1000,
        }
      }),
    });
    
    const parsingData = await parsingResponse.json();
    const doctorsText = parsingData.candidates[0].content.parts[0].text;
    
    // Extract the JSON part from the response
    const jsonMatch = doctorsText.match(/```json\n([\s\S]*?)\n```/) || 
                      doctorsText.match(/\[\n?\s*\{[\s\S]*\}\n?\s*\]/);
    
    let doctorsList = [];
    if (jsonMatch) {
      try {
        doctorsList = JSON.parse(jsonMatch[1] || jsonMatch[0]);
      } catch (e) {
        console.error('Error parsing doctor JSON:', e);
        doctorsList = [];
      }
    }

    return new Response(JSON.stringify({ doctors: doctorsList }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error searching for doctors:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}
