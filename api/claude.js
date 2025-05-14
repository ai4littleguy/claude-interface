export default async function handler(req, res) {
    // Only allow POST method
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { prompt } = req.body;
        
        if (!prompt) {
            return res.status(400).json({ error: 'No prompt provided' });
        }
        
        // Call Claude API
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-7-sonnet-20250219',
                max_tokens: 1000,
                temperature: 0.7,
                messages: [
                    { role: 'user', content: prompt }
                ],
                system: 'You are a helpful AI assistant that explains topics clearly and accurately.'
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            return res.status(response.status).json({
                error: data.error?.message || 'API Error'
            });
        }
        
        return res.status(200).json({ response: data.content[0].text });
        
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Failed to get response from Claude' });
    }
}
