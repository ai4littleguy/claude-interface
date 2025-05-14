document.addEventListener('DOMContentLoaded', function() {
    const promptInput = document.getElementById('promptInput');
    const submitButton = document.getElementById('submitButton');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const responseOutput = document.getElementById('responseOutput');

    submitButton.addEventListener('click', sendPrompt);
    
    // Also submit when pressing Enter with Shift key
    promptInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.shiftKey) {
            e.preventDefault();
            sendPrompt();
        }
    });

    async function sendPrompt() {
        const promptText = promptInput.value.trim();
        
        if (!promptText) {
            alert('Please enter a question');
            return;
        }
        
        // Show loading state
        loadingIndicator.style.display = 'block';
        submitButton.disabled = true;
        responseOutput.textContent = '';
        
        try {
            const response = await fetch('/api/claude', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ prompt: promptText })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to get response from Claude');
            }
            
            const data = await response.json();
            responseOutput.textContent = data.response;
            
        } catch (error) {
            responseOutput.textContent = `Error: ${error.message}`;
            console.error('Error:', error);
        } finally {
            loadingIndicator.style.display = 'none';
            submitButton.disabled = false;
        }
    }
});
