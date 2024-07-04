const token = process.env.TELEGRAM_BOT_TOKEN; // Replace with your bot token
const chatId = '-1234567890'; // Replace with your chat ID
const text = document.getElementById('message').value; // Assuming the message is input in a field with id 'message'

fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    chat_id: chatId,
    text: text,
  }),
})
.then(response => response.json())
.then(data => console.log('Success:', data))
.catch((error) => {
  console.error('Error:', error);
});




document.getElementById('message-form').addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent the default form submission behavior
  sendMessage(); // Call our function to send the message
});