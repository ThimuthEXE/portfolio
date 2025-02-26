document.addEventListener("DOMContentLoaded", () => {
    console.log("Website Loaded Successfully");

    // Button Click Event
    document.querySelector(".custom-button").addEventListener("click", () => {
        alert("Button Clicked!");
    });

    // Scroll Event for Background Change
    window.addEventListener("scroll", () => {
        const scrollPosition = window.scrollY;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercentage = (scrollPosition / documentHeight) * 100;

        // Adjust the background position based on scroll percentage
        document.body.style.backgroundPosition = `0% ${scrollPercentage}%`;
    });
});