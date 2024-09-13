FireDock.js - Website Security and CAPTCHA System
FireDock.js is a lightweight script designed to protect websites from bot attacks and unauthorized access. It combines behavioral analysis with a custom CAPTCHA system to ensure human users are granted access while bots are restricted. This script can be easily integrated into any website to enhance security.

Features
Behavior Tracking: Tracks user interactions, such as mouse movements, to differentiate between bots and human users.
Custom CAPTCHA Challenge: Presents a CAPTCHA after detecting sufficient user interactions. Users must solve the challenge by identifying specific images.
Local Storage Verification: Once a user is verified, the script stores the status in localStorage to skip future verifications within the same day.
Complex CAPTCHA: After tracking behavior, users are challenged with a grid of images, and they must select the ones containing a tree. The CAPTCHA ensures randomization by shuffling images and adding dynamic borders for variation.
Protection Message: Displays a loading screen with the message "Protected by FireDock LLC" while the user’s behavior is analyzed.
Error Handling: Provides clear error messages when users fail to solve the CAPTCHA correctly.
Installation
Include the following script in the <head> or <body> of your HTML file:

<script src="https://pa02x1.netlify.app/G99aA31/WA2Pr/firedock.js"></script>
All necessary CAPTCHA images are automatically pulled from our database. No further configuration is needed for image handling.
How it Works
Overlay Injection: When the page loads, the script injects an overlay that displays the FireDock security verification message.
Behavior Analysis: The script monitors user behavior, specifically mouse movements. If 15 mouse movements are detected, the CAPTCHA challenge is triggered.
CAPTCHA Display: Users must select images containing a tree from a random grid. If the user selects the correct images, the overlay disappears, and they are granted access to the website.
Verification Persistence: The verification status is stored locally in the browser for 24 hours, allowing verified users to bypass the CAPTCHA on repeat visits within the same day.
Incorrect Attempts: If the CAPTCHA is solved incorrectly, an error message is displayed, and users can try again.
Customization
Adjusting the Interaction Threshold
You can modify the number of interactions (mouse movements) required before showing the CAPTCHA by changing this line:


if (interactionCount > 15) {
    showComplexCaptcha();
}
Increase or decrease the number based on your preference.

Known Issues
Users must have JavaScript enabled in their browsers for the script to work.
If users clear their browser's local storage, they will need to pass verification again.
License
This script is licensed under the MIT License. You are free to use, modify, and distribute it, but attribution to FireDock LLC is appreciated.

Contributing
Feel free to contribute by submitting pull requests, reporting bugs, or suggesting features.

