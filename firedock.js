(function() {
    // Inject the CAPTCHA and tracking system
    function injectOverlay() {
        if (!document.body) {
            console.error('Document body not found.');
            return;
        }

        const lastVerified = localStorage.getItem('firedock-verified');
        const currentDate = new Date().toISOString().slice(0, 10);
        if (lastVerified === currentDate) {
            return; // Skip verification if already verified today
        }

        // Create the overlay for the CAPTCHA system
        const overlay = document.createElement('div');
        overlay.id = 'security-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
        overlay.style.zIndex = '9999';
        overlay.style.display = 'flex';
        overlay.style.flexDirection = 'column';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.color = '#fff';
        overlay.style.fontFamily = 'Arial, sans-serif';
        overlay.style.textAlign = 'center';

        // Create the loading message
        const loadingMessage = document.createElement('div');
        loadingMessage.id = 'loading-message';
        loadingMessage.innerHTML = `
            <h1>FireDock Security Verification</h1>
            <p>Analyzing your behavior...</p>
            <div id="loading-spinner" style="
                border: 4px solid rgba(0, 0, 0, 0.1);
                border-radius: 50%;
                border-top: 4px solid #007bff;
                width: 50px;
                height: 50px;
                animation: spin 1s linear infinite;
            "></div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;
        overlay.appendChild(loadingMessage);

        // Create the footer
        const footer = document.createElement('div');
        footer.id = 'footer';
        footer.style.position = 'absolute';
        footer.style.bottom = '20px';
        footer.style.width = '100%';
        footer.style.textAlign = 'center';
        footer.style.color = '#ccc';
        footer.innerHTML = `
            <p>Protected by FireDock LLC</p>
        `;
        overlay.appendChild(footer);

        document.body.appendChild(overlay);

        // Function to track behavior
        function trackBehavior() {
            let interactionCount = 0;

            function handleMouseMove() {
                interactionCount++;
                if (interactionCount > 15) {
                    showComplexCaptcha(); // Trigger complex CAPTCHA after 15 movements
                    document.removeEventListener('mousemove', handleMouseMove); // Stop tracking after CAPTCHA
                }
            }

            document.addEventListener('mousemove', handleMouseMove);

            // Show complex CAPTCHA after sufficient interaction
            function showComplexCaptcha() {
                overlay.innerHTML = ''; // Clear the overlay content

                const captchaContainer = document.createElement('div');
                captchaContainer.innerHTML = `
                    <h2>Verify you're not a robot</h2>
                    <p>Select all images that contain a tree:</p>
                    <div id="captcha-challenge" style="
                        display: grid;
                        grid-template-columns: repeat(3, 100px);
                        grid-gap: 10px;
                    ">
                        ${generateImageGrid()}
                    </div>
                    <button id="captcha-submit" style="
                        background-color: #28a745;
                        color: white;
                        padding: 10px 20px;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        margin-top: 20px;
                    ">Submit</button>
                    <p id="captcha-error" style="color: red; display: none;">Please select the correct images.</p>
                `;
                overlay.appendChild(captchaContainer);

                const selectedImages = [];
                document.querySelectorAll('.captcha-image').forEach(img => {
                    img.addEventListener('click', () => {
                        img.classList.toggle('selected'); // Mark as selected
                        const imgId = img.getAttribute('data-id');
                        if (selectedImages.includes(imgId)) {
                            selectedImages.splice(selectedImages.indexOf(imgId), 1);
                        } else {
                            selectedImages.push(imgId);
                        }
                    });
                });

                // CAPTCHA validation logic
                document.getElementById('captcha-submit').addEventListener('click', () => {
                    if (validateCaptcha(selectedImages)) {
                        overlay.style.display = 'none'; // Hide overlay on success
                        localStorage.setItem('firedock-verified', currentDate); // Store verification status
                    } else {
                        document.getElementById('captcha-error').style.display = 'block'; // Show error on failure
                    }
                });
            }

            // Generates random image grid (for CAPTCHA)
            function generateImageGrid() {
                const imageList = [
                    { id: 1, src: 'https://pa02x1.netlify.app/images/tree1.jpg', isTree: true },
                    { id: 2, src: 'https://pa02x1.netlify.app/images/car1.jpg', isTree: false },
                    { id: 3, src: 'https://pa02x1.netlify.app/images/tree2.jpg', isTree: true },
                    { id: 4, src: 'https://pa02x1.netlify.app/images/dog1.jpg', isTree: false },
                    { id: 5, src: 'https://pa02x1.netlify.app/images/tree3.jpg', isTree: true },
                    { id: 6, src: 'https://pa02x1.netlify.app/images/house1.jpg', isTree: false }
                ];
                // Shuffle images to ensure randomness
                const shuffledImages = imageList.sort(() => Math.random() - 0.5);
                return shuffledImages.map(img => {
                    const borderPosition = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
                    const borderWidth = '2px';
                    const borderColor = '#ff0000'; // Red border
                    let borderStyle = '';

                    switch (borderPosition) {
                        case 0:
                            borderStyle = `border-top: ${borderWidth} solid ${borderColor};`;
                            break;
                        case 1:
                            borderStyle = `border-right: ${borderWidth} solid ${borderColor};`;
                            break;
                        case 2:
                            borderStyle = `border-bottom: ${borderWidth} solid ${borderColor};`;
                            break;
                        case 3:
                            borderStyle = `border-left: ${borderWidth} solid ${borderColor};`;
                            break;
                    }

                    return `
                        <img src="${img.src}" class="captcha-image" data-id="${img.id}" style="
                            width: 100px;
                            height: 100px;
                            border: ${borderStyle};
                            border-radius: 5px;
                            cursor: pointer;
                        ">
                    `;
                }).join('');
            }

            // Validate CAPTCHA
            function validateCaptcha(selectedImages) {
                const correctImages = ['1', '3', '5']; // IDs of the correct images (trees)
                return JSON.stringify(selectedImages.sort()) === JSON.stringify(correctImages.sort());
            }
        }

        trackBehavior();
    }

    document.addEventListener('DOMContentLoaded', function() {
        injectOverlay(); // Inject CAPTCHA system
    });
})();
