```javascript
module.exports = async function (req, res) {
    // Enable CORS Settings
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { prompt } = req.body || {};

    if (!prompt) {
        return res.status(400).json({ error: 'Missing Prompt' });
    }

    const apiKey = "AIzaSyCAusIlxk3qwt4zSrorFo-UWMZYFJZzr_c";

    try {
        // Stable Google Gemini 1.5 Flash Endpoint URL
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const resText = await response.text();
        
        let data;
        try {
            data = JSON.parse(resText);
        } catch(e) {
            // Agar JSON na bhi ho, toh crash hone ke bajaye text samne dikhaye
            return res.status(200).json({ 
                content: [{ text: "Server Response (Raw Text):\n" + resText }] 
            });
        }

        if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
            return res.status(200).json({
                content: [{ text: data.candidates[0].content.parts[0].text }]
            });
        } else if (data.error) {
            return res.status(200).json({ 
                content: [{ text: "Google API Alert:\n" + (data.error.message || JSON.stringify(data.error)) }] 
            });
        } else {
            return res.status(200).json({ 
                content: [{ text: "Response Structure:\n" + JSON.stringify(data, null, 2) }] 
            });
        }
    } catch (err) {
        return res.status(200).json({ 
            content: [{ text: "Pipeline System Exception:\n" + err.message }] 
        });
    }
};