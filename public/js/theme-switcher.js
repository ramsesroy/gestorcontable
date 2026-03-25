/* CMS Theme Toggle Script */
(function() {
    const CLASSIC_LOGO = "../../public/images/illustration/student/128/white.svg";
    const INST_LOGO = "logoplayer.svg";
    const CLASSIC_COLOR = "#5567ff";
    const INST_COLOR = "#1917ca";

    function applyTheme() {
        const theme = localStorage.getItem('cms-theme') || 'normal';
        const logos = document.querySelectorAll('.navbar-brand-icon, .sidebar-brand-icon img, .navbar-brand-icon img');
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

    // Apply on load
    document.addEventListener('DOMContentLoaded', function() {
        applyTheme();
        
        // Add toggle button to navbar if it doesn't exist
        const navbar = document.querySelector('#default-navbar .ml-auto');
        if (navbar && !document.getElementById('themeToggleBtn')) {
            const btnContainer = document.createElement('div');
            btnContainer.id = 'themeToggleContainer';
            btnContainer.className = 'mr-16pt d-flex align-items-center';
            
            const btn = document.createElement('button');
            btn.id = 'themeToggleBtn';
            btn.className = 'btn btn-outline-secondary btn-sm font-weight-bold';
            
            function updateBtnText() {
                const current = localStorage.getItem('cms-theme') || 'normal';
                btn.innerHTML = current === 'institutional' ? 
                    '<i class="material-icons mr-1" style="font-size:16px;vertical-align:middle;">visibility</i> Modo Clásico' : 
                    '<i class="material-icons mr-1" style="font-size:16px;vertical-align:middle;">palette</i> Modo Institucional';
            }
            
            updateBtnText();
            btn.onclick = function() {
                const current = localStorage.getItem('cms-theme') || 'normal';
                const next = current === 'institutional' ? 'normal' : 'institutional';
                localStorage.setItem('cms-theme', next);
                applyTheme();
                updateBtnText();
            };
            
            btnContainer.appendChild(btn);
            navbar.prepend(btnContainer);
        }
    });

    // Handle initial state immediately to avoid flash
    const savedTheme = localStorage.getItem('cms-theme') || 'normal';
    if (savedTheme === 'institutional') {
        // Wait for body to be available
        const interval = setInterval(() => {
            if (document.body) {
                document.body.classList.add('theme-institutional');
                clearInterval(interval);
            }
        }, 10);
    }
})();
