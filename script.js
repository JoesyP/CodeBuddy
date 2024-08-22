// Function to start a conversation and get the threadId
async function startConversation() {
    try {
        const response = await fetch('https://c62780c2-4c5e-498e-949c-b74ec65932b5-00-tztzk8q29lbx.riker.replit.dev/start', {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`Failed to start conversation. Status: ${response.status}`);
        }

        const data = await response.json();
        return data.thread_id;  // Assuming your backend returns thread_id in the response
    } catch (error) {
        console.error('Error starting conversation:', error.message);
        return null;
    }
}

document.getElementById('submit-button').addEventListener('click', async function() {
    const inputElement = document.getElementById('input');
    const userInput = inputElement.value.trim();

    // Fetch the threadId (if not already stored)
    let threadId = localStorage.getItem('threadId');
    if (!threadId) {
        threadId = await startConversation();
        if (threadId) {
            localStorage.setItem('threadId', threadId);  // Store it for future use
        } else {
            console.error('Failed to obtain threadId');
            return;  // Stop if threadId couldn't be obtained
        }
    }

    if (userInput !== '' && threadId) {
        const chatLog = document.getElementById('chat-log');

        // Create user message element
        const userMessage = document.createElement('div');
        userMessage.className = 'chat-message user-message';
        userMessage.innerText = userInput;
        chatLog.appendChild(userMessage);

        // Clear input
        inputElement.value = '';

        // Simulate bot response
        const botMessage = document.createElement('div');
        botMessage.className = 'chat-message bot-message';
        botMessage.innerText = 'Thinking...';
        chatLog.appendChild(botMessage);

        // Scroll to the bottom of the chat log
        chatLog.scrollTop = chatLog.scrollHeight;

        // Get bot response from Replit backend
        try {
            const response = await fetch('https://c62780c2-4c5e-498e-949c-b74ec65932b5-00-tztzk8q29lbx.riker.replit.dev/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ thread_id: threadId, message: userInput })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            const botReply = data.response;
            botMessage.innerText = botReply;

        } catch (error) {
            console.error('Error:', error.message);
            botMessage.innerText = `Sorry, there was an error: ${error.message}`;
        }

        // Scroll to the bottom of the chat log after updating bot message
        chatLog.scrollTop = chatLog.scrollHeight;
    }
});
