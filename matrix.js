// Common hash database (for demonstration - in reality, you'd use an API)
const commonHashes = {
    // MD5 hashes
    '5d41402abc4b2a76b9719d911017c592': 'hello',
    '098f6bcd4621d373cade4e832627b4f6': 'test',
    '5f4dcc3b5aa765d61d8327deb882cf99': 'password',
    '827ccb0eea8a706c4c34a16891f84e7b': '12345',
    'e10adc3949ba59abbe56e057f20f883e': '123456',
    'd8578edf8458ce06fbc5bb76a58c5ca4': 'qwerty',
    '25d55ad283aa400af464c76d713c07ad': '12345678',
    'fcea920f7412b5da5ceef8e98b358e3a': 'letmein',
    '25f9e794323b453885f5181f1b624d0b': '123456789',
    '200820e3227815ed1756a6b531e7e0d2': 'abc123',
    'e99a18c428cb38d5f260853678922e03': 'abc123',
    '21232f297a57a5a743894a0e4a801fc3': 'admin',
    '482c811da5d5b4bc6d497ffa98491e38': 'password123',
    
    // SHA1 hashes
    'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d': 'hello',
    'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3': 'test',
    '5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8': 'password',
    '8cb2237d0679ca88db6464eac60da96345513964': '12345',
    '7c4a8d09ca3762af61e59520943dc26494f8941b': '123456',
    'b1b3773a05c0ed0176787a4f1574ff0075f7521e': 'qwerty',
    '7c222fb2927d828af22f592134e8932480637c0d': '12345678',
    
    // SHA256 hashes
    '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c5fa7425e73043362938b9824': 'hello',
    '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08': 'test',
    '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8': 'password',
    '5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5': '12345',
    '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92': '123456',
    '65e84be33532fb784c48129675f9eff3a682b27168c0ea744b2cf58ee02337c5': 'qwerty',
    'ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f': '12345678'
};

// Current mode
let currentMode = 'encode';

// Switch between encode and decode modes
function switchMode(mode) {
    currentMode = mode;
    
    // Update button states
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Show/hide sections
    if (mode === 'encode') {
        document.getElementById('encode-section').classList.remove('hidden');
        document.getElementById('decode-section').classList.add('hidden');
    } else {
        document.getElementById('decode-section').classList.remove('hidden');
        document.getElementById('encode-section').classList.add('hidden');
    }
}

// Generate hash for specific algorithm
function generateHash(type) {
    const inputText = document.getElementById('input-text').value;
    
    if (!inputText) {
        showNotification('Please enter some text to hash!', 'error');
        return;
    }

    document.getElementById('encode-results').classList.remove('hidden');

    let hash = '';
    switch(type) {
        case 'MD5':
            hash = CryptoJS.MD5(inputText).toString();
            document.getElementById('md5-value').textContent = hash;
            document.getElementById('md5-result').classList.remove('hidden');
            break;
        case 'SHA1':
            hash = CryptoJS.SHA1(inputText).toString();
            document.getElementById('sha1-value').textContent = hash;
            document.getElementById('sha1-result').classList.remove('hidden');
            break;
        case 'SHA256':
            hash = CryptoJS.SHA256(inputText).toString();
            document.getElementById('sha256-value').textContent = hash;
            document.getElementById('sha256-result').classList.remove('hidden');
            break;
    }
    
    // Store in our "database" for demonstration
    if (hash && inputText.length < 50) { // Only store short strings
        commonHashes[hash] = inputText;
    }
}

// Generate all hashes
function generateAll() {
    const inputText = document.getElementById('input-text').value;
    
    if (!inputText) {
        showNotification('Please enter some text to hash!', 'error');
        return;
    }

    generateHash('MD5');
    generateHash('SHA1');
    generateHash('SHA256');
}

// Clear encode section
function clearEncode() {
    document.getElementById('input-text').value = '';
    document.getElementById('encode-results').classList.add('hidden');
    document.getElementById('md5-result').classList.add('hidden');
    document.getElementById('sha1-result').classList.add('hidden');
    document.getElementById('sha256-result').classList.add('hidden');
}

// Decode hash
async function decodeHash() {
    const hashInput = document.getElementById('hash-input').value.trim();
    const hashType = document.querySelector('input[name="hashType"]:checked').value;
    
    if (!hashInput) {
        showNotification('Please enter a hash to decode!', 'error');
        return;
    }
    
    document.getElementById('decode-results').classList.remove('hidden');
    const decodeValue = document.getElementById('decode-value');
    const decodeStatus = document.getElementById('decode-status');
    
    // Show loading
    decodeValue.innerHTML = '<span class="loading"></span> Searching...';
    decodeStatus.className = '';
    decodeStatus.textContent = '';
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if hash exists in our database
    if (commonHashes[hashInput]) {
        decodeValue.textContent = commonHashes[hashInput];
        decodeStatus.className = 'success';
        decodeStatus.textContent = '✓ Hash successfully decoded!';
    } else {
        // Try to identify hash type by length
        let detectedType = '';
        if (hashInput.length === 32) detectedType = 'MD5';
        else if (hashInput.length === 40) detectedType = 'SHA-1';
        else if (hashInput.length === 64) detectedType = 'SHA-256';
        
        decodeValue.textContent = 'Hash not found in database';
        decodeStatus.className = 'warning';
        
        if (detectedType && detectedType !== hashType) {
            decodeStatus.textContent = `⚠ This appears to be a ${detectedType} hash, but you selected ${hashType}. Hash not found in database.`;
        } else {
            decodeStatus.textContent = '⚠ This hash is not in our database. It may be from a complex or random string.';
        }
    }
}

// Clear decode section
function clearDecode() {
    document.getElementById('hash-input').value = '';
    document.getElementById('decode-results').classList.add('hidden');
    document.getElementById('decode-value').textContent = '';
    document.getElementById('decode-status').textContent = '';
    document.getElementById('decode-status').className = '';
}

// Copy to clipboard
function copyToClipboard(elementId) {
    const text = document.getElementById(elementId).textContent;
    
    navigator.clipboard.writeText(text).then(() => {
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = '✓ Copied!';
        button.style.background = '#0f0';
        button.style.color = '#000';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
            button.style.color = '';
        }, 2000);
    }).catch(err => {
        showNotification('Failed to copy text', 'error');
    });
}

// Show notification
function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'error' ? 'rgba(255,0,0,0.2)' : 'rgba(0,255,0,0.2)'};
        border: 1px solid ${type === 'error' ? '#f00' : '#0f0'};
        color: ${type === 'error' ? '#f00' : '#0f0'};
        border-radius: 5px;
        font-family: 'Courier New', monospace;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to generate/decode
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (currentMode === 'encode') {
            generateAll();
        } else {
            decodeHash();
        }
    }
    
    // Ctrl/Cmd + Shift + C to clear
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
        if (currentMode === 'encode') {
            clearEncode();
        } else {
            clearDecode();
        }
    }
    
    // Ctrl/Cmd + 1/2 to switch modes
    if ((e.ctrlKey || e.metaKey) && e.key === '1') {
        switchMode('encode');
        document.querySelector('.mode-btn').classList.add('active');
    }
    if ((e.ctrlKey || e.metaKey) && e.key === '2') {
        switchMode('decode');
        document.querySelectorAll('.mode-btn')[1].classList.add('active');
    }
});

// Auto-detect hash type when pasting
document.getElementById('hash-input').addEventListener('paste', (e) => {
    setTimeout(() => {
        const hash = e.target.value.trim();
        let detectedType = '';
        
        if (hash.length === 32) {
            detectedType = 'MD5';
        } else if (hash.length === 40) {
            detectedType = 'SHA1';
        } else if (hash.length === 64) {
            detectedType = 'SHA256';
        }
        
        if (detectedType) {
            document.querySelector(`input[name="hashType"][value="${detectedType}"]`).checked = true;
            showNotification(`Auto-detected ${detectedType} hash`, 'success');
        }
    }, 10);
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {// Matrix Rain Effect
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

setCanvasSize();

// Matrix characters
const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
const matrixArray = matrix.split("");

// Configuration
const fontSize = 10;
let columns = canvas.width / fontSize;

// Drops array
let drops = [];

// Initialize drops
function initDrops() {
    drops = [];
    columns = canvas.width / fontSize;
    for(let x = 0; x < columns; x++) {
        drops[x] = 1;
    }
}

initDrops();

// Draw matrix rain
function drawMatrix() {
    // Black background with transparency for trail effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Green text
    ctx.fillStyle = '#0F0';
    ctx.font = fontSize + 'px monospace';

    // Draw characters
    for(let i = 0; i < drops.length; i++) {
        // Random character from matrix
        const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
        
        // Draw the character
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Reset drop to top randomly after reaching bottom
        if(drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        
        // Move drop down
        drops[i]++;
    }
}

// Animation loop
setInterval(drawMatrix, 35);

// Handle window resize
window.addEventListener('resize', () => {
    setCanvasSize();
    initDrops();
});
    // Set initial mode
    currentMode = 'encode';
    
    // Add smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});

// Add some common words to hash database on load
const commonWords = ['admin', 'user', 'login', 'welcome', 'secret', 'password1', 'admin123', 'root', 'toor', 'pass'];
commonWords.forEach(word => {
    commonHashes[CryptoJS.MD5(word).toString()] = word;
    commonHashes[CryptoJS.SHA1(word).toString()] = word;
    commonHashes[CryptoJS.SHA256(word).toString()] = word;
});