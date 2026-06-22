export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Missing Prompt' });
    }

    // Zaman bhai, aap ki secure Google API Key yahan backend par lock kar di hai
    const apiKey = "AIzaSyCAusIlxk3qwt4zSrorFo-UWMZYFJZzr_c";

    try {
        // Google Gemini Pro Free Flash Pipeline Engine
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();
        
        if (data.candidates && data.candidates[0].content.parts[0]) {
            return res.status(200).json({
                content: [{ text: data.candidates[0].content.parts[0].text }]
            });
        } else if (data.error) {
            return res.status(200).json({ error: data.error.message });
        } else {
            return res.status(200).json({ error: 'Unexpected response from Gemini API' });
        }
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}