/**
 * Thimuth Portfolio - Interactive Functionality
 * Pure Vanilla JavaScript (No jQuery dependency needed)
 */

document.addEventListener("DOMContentLoaded", () => {
    const navbar = document.getElementById("navbar");
    const navTrigger = document.getElementById("navTrigger");
    const mainListDiv = document.getElementById("mainListDiv");
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("section[id]");

    // --- 0. Autoplay Hero Video Guarantee (Dual Theme Videos) ---
    const bgVideos = [
        document.getElementById("background-video"),
        document.getElementById("background-video-light")
    ].filter(Boolean);

    bgVideos.forEach((v) => {
        v.muted = true;
        const playPromise = v.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                const onFirstInteraction = () => {
                    v.play().catch(() => {});
                    window.removeEventListener("click", onFirstInteraction);
                    window.removeEventListener("scroll", onFirstInteraction);
                };
                window.addEventListener("click", onFirstInteraction, { once: true });
                window.addEventListener("scroll", onFirstInteraction, { once: true });
            });
        }
    });

    // --- 1. Sticky Navbar Transition on Scroll (.affix) ---
    const handleScroll = () => {
        if (window.scrollY > 40) {
            navbar.classList.add("affix");
        } else {
            navbar.classList.remove("affix");
        }

        // --- 2. Active Section Highlighting (ScrollSpy) ---
        let currentSectionId = "";
        const scrollPosition = window.scrollY + 120; // Offset for navbar

        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute("id");
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove("active");
            if (currentSectionId && link.getAttribute("href") === `#${currentSectionId}`) {
                link.classList.add("active");
            }
        });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial run

    // --- 3. Mobile Hamburger Menu Toggle ---
    const toggleMobileMenu = () => {
        const isOpen = navTrigger.classList.toggle("active");
        mainListDiv.classList.toggle("show_list");
        navTrigger.setAttribute("aria-expanded", isOpen.toString());

        // Prevent body scroll when mobile menu is open
        document.body.style.overflow = isOpen ? "hidden" : "";
    };

    navTrigger.addEventListener("click", toggleMobileMenu);

    // --- 4. Close Mobile Menu When Link is Clicked ---
    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            if (navTrigger.classList.contains("active")) {
                toggleMobileMenu();
            }
        });
    });

    // Close mobile menu on Escape key press
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && navTrigger.classList.contains("active")) {
            toggleMobileMenu();
        }
    });

    // --- 5. Optimized 8x8 Interactive 3D Mesh Grid on Hero Card ---
    const meshCard = document.getElementById("meshCard");
    let meshTiles = [];

    const getActiveMeshImage = () => {
        const isLight = document.documentElement.getAttribute("data-theme") === "light";
        if (meshCard) {
            return isLight
                ? (meshCard.getAttribute("data-image-light") || "assests/l2.w.png")
                : (meshCard.getAttribute("data-image-dark") || "assests/l2.PNG");
        }
        return isLight ? "assests/l2.w.png" : "assests/l2.PNG";
    };

    if (meshCard) {
        const GRID_SIZE = 8; // 64 lightweight tiles for zero delay & instant rendering
        const RADIUS = 2.8;
        const Z_MAX = 50; // Maximum elevation in pixels
        const initialImageSrc = getActiveMeshImage();

        const meshGrid = document.createElement("div");
        meshGrid.className = "mesh-grid";

        const fragment = document.createDocumentFragment();

        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                const tile = document.createElement("div");
                tile.className = "mesh-tile";
                tile.dataset.r = r;
                tile.dataset.c = c;
                tile.style.backgroundImage = `url('${initialImageSrc}')`;
                tile.style.backgroundPosition = `${(c / (GRID_SIZE - 1) * 100).toFixed(4)}% ${(r / (GRID_SIZE - 1) * 100).toFixed(4)}%`;

                fragment.appendChild(tile);
                meshTiles.push({
                    element: tile,
                    r,
                    c,
                    active: false
                });
            }
        }

        meshGrid.appendChild(fragment);
        meshCard.appendChild(meshGrid);

        let isHovered = false;
        let mouseX = 0;
        let mouseY = 0;
        let rafId = null;

        const updateMesh = () => {
            if (!isHovered) return;

            const rect = meshCard.getBoundingClientRect();
            const nx = (mouseX - rect.left) / rect.width;
            const ny = (mouseY - rect.top) / rect.height;

            const mouseCol = nx * GRID_SIZE - 0.5;
            const mouseRow = ny * GRID_SIZE - 0.5;
            const isLight = document.documentElement.getAttribute("data-theme") === "light";

            meshTiles.forEach((tile) => {
                const dr = tile.r - mouseRow;
                const dc = tile.c - mouseCol;
                const dist = Math.sqrt(dc * dc + dr * dr);

                if (dist < RADIUS) {
                    const t = 1 - dist / RADIUS;
                    // Spear / spherical dome falloff curve: sharp peak, rounded flanks
                    const f = Math.pow(t, 1.3) * Math.sqrt(t);
                    const z = f * Z_MAX;
                    const rotX = dr * 3.5 * t;
                    const rotY = -dc * 3.5 * t;
                    const shadowBlur = z * 0.5;

                    const shadowColor = isLight ? "rgba(20, 50, 60, 0.16)" : "rgba(0, 0, 0, 0.7)";
                    const glowColor = isLight ? "rgba(60, 174, 163, 0.35)" : "rgba(60, 174, 163, 0.45)";

                    tile.element.style.transform = `translateZ(${z.toFixed(1)}px) rotateX(${rotX.toFixed(1)}deg) rotateY(${rotY.toFixed(1)}deg)`;
                    tile.element.style.boxShadow = `0 ${(z * 0.3).toFixed(1)}px ${shadowBlur.toFixed(1)}px ${shadowColor}, 0 0 ${(z * 0.35).toFixed(1)}px ${glowColor}`;
                    tile.element.style.zIndex = Math.round(z * 10);
                    tile.active = true;
                } else if (tile.active) {
                    tile.element.style.transform = "translateZ(0px) rotateX(0deg) rotateY(0deg)";
                    tile.element.style.boxShadow = "none";
                    tile.element.style.zIndex = 1;
                    tile.active = false;
                }
            });

            rafId = null;
        };

        const onPointerMove = (e) => {
            isHovered = true;
            mouseX = e.clientX;
            mouseY = e.clientY;

            if (!rafId) {
                rafId = requestAnimationFrame(updateMesh);
            }
        };

        const onPointerLeave = () => {
            isHovered = false;
            if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }

            meshTiles.forEach((tile) => {
                if (tile.active) {
                    tile.element.style.transform = "translateZ(0px) rotateX(0deg) rotateY(0deg)";
                    tile.element.style.boxShadow = "none";
                    tile.element.style.zIndex = 1;
                    tile.active = false;
                }
            });
        };

        meshCard.addEventListener("pointermove", onPointerMove);
        meshCard.addEventListener("pointerleave", onPointerLeave);
    }

    // --- 6. Unified Theme Toggle Logic (Dark <-> Bright) ---
    const themeToggleBtn = document.getElementById("themeToggle");
    const themeToggleText = themeToggleBtn ? themeToggleBtn.querySelector(".theme-toggle-text") : null;

    const updateThemeUI = (theme) => {
        document.documentElement.setAttribute("data-theme", theme);
        try {
            localStorage.setItem("thimuth_portfolio_theme", theme);
        } catch (e) {}

        if (themeToggleText) {
            themeToggleText.textContent = theme === "dark" ? "LIGHT" : "DARK";
        }
        if (themeToggleBtn) {
            themeToggleBtn.setAttribute(
                "title",
                theme === "dark" ? "Switch to Bright Mode" : "Switch to Dark Mode"
            );
        }

        // Update 3D mesh background image if tiles exist
        if (meshTiles.length > 0) {
            const currentMeshSrc = getActiveMeshImage();
            meshTiles.forEach((tile) => {
                tile.element.style.backgroundImage = `url('${currentMeshSrc}')`;
            });
        }

        // Video playback reliability for active theme
        const activeVideo = theme === "light"
            ? document.getElementById("background-video-light")
            : document.getElementById("background-video");
        if (activeVideo && activeVideo.paused) {
            activeVideo.play().catch(() => {});
        }
    };

    // Initialize theme button label from existing attribute
    const initialTheme = document.documentElement.getAttribute("data-theme") || "dark";
    updateThemeUI(initialTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
            const newTheme = currentTheme === "dark" ? "light" : "dark";
            updateThemeUI(newTheme);
        });
    }

    console.log("Thimuth Portfolio initialized successfully with unified dual-theme system.");
});