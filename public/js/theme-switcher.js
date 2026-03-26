/* CMS Theme Switcher & Global Toggle Logic */
(function() {
    const CLASSIC_LOGO = "../../public/images/illustration/student/128/white.svg";
    const INST_LOGO = "logoplayer.svg";
    const CLASSIC_COLOR = "#5567ff";
    const INST_COLOR = "#1917ca";

    function applyTheme() {
        const theme = localStorage.getItem('cms-theme') || 'normal';
        const logos = document.querySelectorAll('.navbar-brand-icon, .sidebar-brand-icon img, .navbar-brand-icon img, .login-logo');
        const themeMeta = document.querySelector('meta[name="theme-color"]');
        
        if (theme === 'institutional') {
            document.body.classList.add('theme-institutional');
            if (themeMeta) themeMeta.setAttribute('content', INST_COLOR);
            logos.forEach(img => {
                if (img.tagName === 'IMG') img.src = INST_LOGO;
                else {
                    const childImg = img.querySelector('img');
                    if (childImg) childImg.src = INST_LOGO;
                }
            });
        } else {
            document.body.classList.remove('theme-institutional');
            if (themeMeta) themeMeta.setAttribute('content', CLASSIC_COLOR);
            logos.forEach(img => {
                if (img.tagName === 'IMG') img.src = CLASSIC_LOGO;
                else {
                    const childImg = img.querySelector('img');
                    if (childImg) childImg.src = CLASSIC_LOGO;
                }
            });
        }
    }

    // Export toggle as global
    window.toggleTheme = function() {
        const current = localStorage.getItem('cms-theme') || 'normal';
        const next = current === 'institutional' ? 'normal' : 'institutional';
        localStorage.setItem('cms-theme', next);
        applyTheme();
        
        // Find and update any toggle button text if needed
        const btn = document.getElementById('themeToggle');
        if (btn) {
            // Optional: update text if needed, though usually icon is enough
        }
    };

    // Apply on load
    document.addEventListener('DOMContentLoaded', function() {
        applyTheme();
    });

    // Handle initial state immediately to avoid flash
    const savedTheme = localStorage.getItem('cms-theme') || 'normal';
    if (savedTheme === 'institutional') {
        // Find a way to apply class before body renders fully
        var style = document.createElement('style');
        style.innerHTML = 'body { visibility: hidden; } body.theme-institutional, body.theme-normal { visibility: visible; }';
        document.head.appendChild(style);
        
        const interval = setInterval(() => {
            if (document.body) {
                document.body.classList.add('theme-institutional');
                clearInterval(interval);
            }
        }, 5);
    }
})();
