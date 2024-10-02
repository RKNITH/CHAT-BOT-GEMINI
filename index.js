// Toggle Chat Window
function toggleChatWindow() {
    const chatWindow = document.getElementById('chat-window');
    const chatBotIcon = document.getElementById('chat-bot-icon');

    chatWindow.classList.toggle('hidden');
    chatBotIcon.classList.toggle('hidden');
}

// Chat Functionality
const sendBtn = document.getElementById('send-btn');
const inputText = document.getElementById('user-input');
const chatMessages = document.getElementById('chat-messages');

const API_KEY = '';

let userMessage;

const generateResponse = (incomingChatLi) => {
    const API_URL = 'https://api.openai.com/v1/chat/completions';
    const messageElement = incomingChatLi.querySelector('p');

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: userMessage }]
        })
    };

    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
        messageElement.textContent = data.choices[0].message.content;
    }).catch(() => {
        messageElement.textContent = 'Oops! Something went wrong. Try again.';
    }).finally(() => chatMessages.scrollTo(0, chatMessages.scrollHeight));
};

const createChatLi = (message, className) => {
    const chatLi = document.createElement('li');
    chatLi.classList.add('chat', className);
    const chatContent = className === 'outgoing' ? `<p>${message}</p>` : `<p>Thinking...</p>`;
    chatLi.innerHTML = chatContent;
    return chatLi;
};

const handleChat = () => {
    userMessage = inputText.value.trim();
    if (!userMessage) return;
    inputText.value = '';

    // Create and append outgoing message
    const outgoingChat = createChatLi(userMessage, 'outgoing');
    chatMessages.appendChild(outgoingChat);
    chatMessages.scrollTo(0, chatMessages.scrollHeight);

    // Create and append incoming message placeholder
    setTimeout(() => {
        const incomingChat = createChatLi('', 'incoming');
        chatMessages.appendChild(incomingChat);
        chatMessages.scrollTo(0, chatMessages.scrollHeight);
        generateResponse(incomingChat);
    }, 600);
};

sendBtn.addEventListener('click', handleChat);
