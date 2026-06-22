```javascript
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Missing Prompt' });
    }

    const apiKey = "AIzaSyCAusIlxk3qwt4zSrorFo-UWMZYFJZzr_c";

    try {
        // Stable standard content endpoint path fix
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const textData = await response.text();
        let data;
        try {
            data = JSON.parse(textData);
        } catch(e) {
            return res.status(200).json({ error: "Raw response from server was not JSON: " + textData });
        }
        
        if (data.candidates && data.candidates[0].content.parts[0]) {
            return res.status(200).json({
                content: [{ text: data.candidates[0].content.parts[0].text }]
            });
        } else if (data.error) {
            return res.status(200).json({ error: data.error.message || JSON.stringify(data.error) });
        } else {
            return res.status(200).json({ error: JSON.stringify(data) });
        }
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}