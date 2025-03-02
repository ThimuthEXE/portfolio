document.addEventListener("DOMContentLoaded", () => {
    console.log("Website Loaded Successfully");

    const menuIcon = document.querySelector(".menu-icon");
    const dropdownMenu = document.querySelector(".dropdown-menu");

    // Show dropdown when hovering over the menu icon
    menuIcon.addEventListener("mouseenter", () => {
        dropdownMenu.style.display = "block";
    });

    // Hide dropdown when the mouse leaves both the menu icon and the dropdown
    menuIcon.addEventListener("mouseleave", () => {
        setTimeout(() => {
            if (!dropdownMenu.matches(":hover")) {
                dropdownMenu.style.display = "none";
            }
        }, 300); // Small delay to allow for mouse movement
    });

    dropdownMenu.addEventListener("mouseleave", () => {
        dropdownMenu.style.display = "none";
    });
});