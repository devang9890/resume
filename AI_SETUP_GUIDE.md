# Resume Builder - AI Enhancement Setup Guide

## 🚨 AI Enhancement 400 Error Fix

The 400 Bad Request error you're experiencing is likely due to missing environment variables. Here's how to fix it:

### 1. Create Environment Variables File

Create a `.env` file in the `server` directory with the following content:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/resume-builder

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key-here
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-3.5-turbo

# Server Configuration
PORT=3000

# ImageKit Configuration (optional)
IMAGEKIT_PUBLIC_KEY=your-imagekit-public-key
IMAGEKIT_PRIVATE_KEY=your-imagekit-private-key
IMAGEKIT_URL_ENDPOINT=your-imagekit-url-endpoint
```

### 2. Get OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and replace `your-openai-api-key-here` in the `.env` file

### 3. Alternative: Use a Mock AI Service

If you don't want to use OpenAI right now, you can temporarily modify the AI controller to return mock responses:

```javascript
// In server/controllers/aiController.js
export const enhanceProfessionalSummary = async (req, res) => {
  try {
    const { userContent } = req.body;
    
    if (!userContent) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Mock response for testing
    const mockEnhancedContent = `Enhanced professional summary: ${userContent} - This is a mock enhancement for testing purposes.`;
    
    return res.status(200).json({ enhancedContent: mockEnhancedContent });
  } catch (error) {
    return res.status(500).json({ message: error.message || "AI service unavailable" });
  }
};
```

### 4. Restart Your Server

After creating the `.env` file:

```bash
cd server
npm run server
```

### 5. Test the AI Enhancement

1. Go to your resume builder
2. Add some text to the Professional Summary field
3. Click "AI Enhance" button
4. You should now see either:
   - Enhanced content from OpenAI (if API key is configured)
   - A mock enhancement (if using mock service)
   - A clear error message (if there are still issues)

### 6. Debug Steps

If you're still getting errors:

1. Check the server console for error messages
2. Verify the `.env` file is in the correct location (`server/.env`)
3. Make sure the server is restarted after adding environment variables
4. Check that your OpenAI API key is valid and has credits

### 7. Common Issues

- **Missing .env file**: Make sure it's in the `server` directory
- **Invalid API key**: Verify your OpenAI API key is correct
- **No credits**: Check your OpenAI account has available credits
- **Network issues**: Ensure your server can reach OpenAI's API

The AI enhancement feature should now work properly! 🎉
