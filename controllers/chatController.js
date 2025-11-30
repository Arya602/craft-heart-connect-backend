const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// @desc    Chat with AI
// @route   POST /api/chat
// @access  Private
const chatWithAI = async (req, res) => {
    const { messages } = req.body; // Expecting an array of messages

    if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ message: 'Messages array is required' });
    }

    try {
        // Safety Filter (Basic keyword check)
        const lastMessage = messages[messages.length - 1].content.toLowerCase();
        const forbiddenWords = ['hate', 'violence', 'kill', 'abuse']; // Add more as needed
        if (forbiddenWords.some(word => lastMessage.includes(word))) {
            return res.json({ role: 'assistant', content: "I cannot respond to that." });
        }

        const systemPrompt = {
            role: 'system',
            content: `You are a helpful assistant for 'Craft Heart Connect', a handmade crafts marketplace in India. 
      Assist users with finding products (Pottery, Textiles, Jewelry, Paintings), 
      understanding artisan stories, and tracking orders. 
      Prices are in INR (₹). Be polite and concise.
      If asked about products, suggest categories available: Pottery, Textiles, Jewelry, Paintings.`,
        };

        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [systemPrompt, ...messages],
        });

        res.json(completion.choices[0].message);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'AI Service Error' });
    }
};

module.exports = { chatWithAI };
