document.addEventListener('DOMContentLoaded', () => {
    const texts = [
        'Mukesh Veeravalli',
        'a Web Developer.',
        'a Cinematic Shooter.',
        'a Pixel Perfectionist.',
        'a UI/UX Enthusiast.'
    ];

    const h1 = document.querySelector('.home .left h1');
    // Create cursor element
    const cursor = document.createElement('span');
    cursor.classList.add('cursor');
    h1.appendChild(cursor);

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 90;

    function type() {
        const currentText = texts[textIndex];

        if (!isDeleting) {
            // Typing forward
            h1.firstChild
                ? h1.firstChild.nodeType === Node.TEXT_NODE
                    ? (h1.firstChild.textContent = currentText.slice(0, ++charIndex))
                    : h1.insertBefore(document.createTextNode(currentText.slice(0, ++charIndex)), cursor)
                : h1.insertBefore(document.createTextNode(currentText.slice(0, ++charIndex)), cursor);

            // Update text node
            if (h1.childNodes[0] && h1.childNodes[0].nodeType === Node.TEXT_NODE) {
                h1.childNodes[0].textContent = currentText.slice(0, charIndex);
            }

            if (charIndex === currentText.length) {
                typingSpeed = 2200; // Pause at end
                isDeleting = true;
            } else {
                typingSpeed = 90;
            }
        } else {
            // Deleting
            charIndex--;
            if (h1.childNodes[0] && h1.childNodes[0].nodeType === Node.TEXT_NODE) {
                h1.childNodes[0].textContent = currentText.slice(0, charIndex);
            }

            typingSpeed = 45;

            if (charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typingSpeed = 300;
            }
        }

        setTimeout(type, typingSpeed);
    }

    // Initialize text node before cursor
    h1.insertBefore(document.createTextNode(''), cursor);
    type();
});