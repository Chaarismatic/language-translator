// Chatbot functionality with OpenAI GPT integration
document.addEventListener('DOMContentLoaded', function() {
    // Get chatbot elements
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotContainer = document.getElementById('chatbot-container');
    const closeBtn = document.getElementById('close-chatbot');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const chatbotInput = document.getElementById('chatbot-input');
    const sendBtn = document.getElementById('send-message');

    // Toggle chatbot visibility
    if (chatbotToggle) {
        chatbotToggle.addEventListener('click', function() {
            if (chatbotContainer.style.display === 'flex') {
                chatbotContainer.style.display = 'none';
            } else {
                chatbotContainer.style.display = 'flex';
            }
        });
    }

    // Close chatbot
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            chatbotContainer.style.display = 'none';
        });
    }

    // Send message on button click
    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }

    // Send message on Enter key
    if (chatbotInput) {
        chatbotInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
                e.preventDefault();
            }
        });
    }

    // Function to add message to chat
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);

        const contentDiv = document.createElement('div');
        contentDiv.classList.add('message-content');
        contentDiv.textContent = text;

        messageDiv.appendChild(contentDiv);
        chatbotMessages.appendChild(messageDiv);

        // Scroll to bottom
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // Function to show typing indicator
    function showTypingIndicator() {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', 'bot', 'typing');
        messageDiv.id = 'typing-indicator';

        const contentDiv = document.createElement('div');
        contentDiv.classList.add('message-content');

        const typingDiv = document.createElement('div');
        typingDiv.classList.add('typing-indicator');

        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('span');
            typingDiv.appendChild(dot);
        }

        contentDiv.appendChild(typingDiv);
        messageDiv.appendChild(contentDiv);
        chatbotMessages.appendChild(messageDiv);

        // Scroll to bottom
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // Function to remove typing indicator
    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Function to send message to API
    async function sendMessage() {
        if (!chatbotInput.value.trim()) return;

        // Get user message
        const userMessage = chatbotInput.value.trim();
        chatbotInput.value = '';

        // Add user message to chat
        addMessage(userMessage, 'user');

        // Show typing indicator
        showTypingIndicator();

        try {
            console.log('Sending message to chatbot API:', userMessage);
            
            // Send message to API
            const response = await fetch('http://localhost:5000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: userMessage
                })
            });
            
            console.log('Response status:', response.status);
            
            // If the response isn't OK, throw an error
            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Response data:', data);
            
            // Remove typing indicator
            removeTypingIndicator();
            
            // Fallback response in case of empty or error response
            if (!data || (data.error && !data.response)) {
                console.log('Handling error response:', data);
                const errorMessage = data?.message || data?.error || 'Unknown error occurred';
                addMessage(`Sorry, I encountered an issue: ${errorMessage}. Please try again.`, 'bot');
            } else {
                // Add bot response - make sure we have a response
                const botResponse = data.response || 'I apologize, but I could not generate a response. Please try again.';
                console.log('Adding bot response:', botResponse);
                addMessage(botResponse, 'bot');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            removeTypingIndicator();
            
            // Provide helpful fallback responses even when API calls fail
            let fallbackResponse = 'Sorry, I encountered an error. ';
            
            if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                fallbackResponse += 'It seems there might be a network issue. Please check your connection and try again.';
            } else if (error.message.includes('status: 401')) {
                fallbackResponse += 'There appears to be an authentication issue with the chatbot service.';
            } else if (error.message.includes('status: 429')) {
                fallbackResponse += 'The chatbot service is currently experiencing high demand. Please try again in a few moments.';
            } else {
                // Simple keyword-based fallback responses when server is unreachable
                const lowerMessage = userMessage.toLowerCase();
                
                if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
                    fallbackResponse = 'Hello! I\'m the TransGO assistant. While I\'m having trouble connecting to my brain right now, I\'d be happy to help once the connection is restored.';
                } else if (lowerMessage.includes('translate') || lowerMessage.includes('translation')) {
                    fallbackResponse = 'You can use the translator above to translate text between many different languages. Just type your text, select languages, and click "Convert Now".';
                } else if (lowerMessage.includes('language')) {
                    fallbackResponse = 'TransGO supports numerous languages including English, Spanish, French, German, Hindi, Chinese, Japanese, and many more.';
                } else if (lowerMessage.includes('help')) {
                    fallbackResponse = 'I can help you with translations and language questions. Please try again when my connection is restored, or use the translator feature above.';
                }
            }
            
            addMessage(fallbackResponse, 'bot');
        }
    }
});
