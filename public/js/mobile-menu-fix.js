/**
 * Mobile Menu Fix - v2.9.2
 * Ensures the MDK drawer opens correctly on mobile devices by providing a robust toggle fallback.
 */
(function($) {
    'use strict';

    function initMobileToggle() {
        console.log('[MobileFix v6.0] Hyper-stability mode...');
        
        const drawer = document.getElementById('default-drawer');
        if (drawer) {
            // 1. Strip all MDK behavior to prevent conflicts
            drawer.classList.remove('js-mdk-drawer');
            drawer.removeAttribute('data-domfactory-upgraded');
            if (drawer.mdkDrawer) drawer.mdkDrawer = null;

            // 2. Relocate to body
            if (drawer.parentElement !== document.body) {
                document.body.insertBefore(drawer, document.body.firstChild);
                console.log('[MobileFix v6.0] Drawer decoupled and moved to body.');
            }
        }

        // 3. Robust Toggle
        $(document).off('click.mobiletoggle').on('click.mobiletoggle', '[data-toggle="sidebar"]', function(e) {
            if (window.innerWidth > 992) return;
            e.preventDefault();
            e.stopPropagation();
            
            console.log('[MobileFix v6.0] Toggle triggered.');
            $('body').toggleClass('has-drawer-opened');
            $('#default-drawer').toggleClass('mdk-drawer--open');
        });

        // 4. Scrim Close
        $(document).off('click.mobileclose').on('click.mobileclose', function(e) {
            if ($('body').hasClass('has-drawer-opened')) {
                if (!$(e.target).closest('#default-drawer, [data-toggle="sidebar"]').length) {
                    $('body').removeClass('has-drawer-opened');
                    $('#default-drawer').removeClass('mdk-drawer--open');
                    console.log('[MobileFix v6.0] Closed via outside click.');
                }
            }
        });

        // 5. Version Badge
        if (window.innerWidth <= 992) {
            const badge = document.createElement('div');
            badge.id = 'mobile-fix-badge-final';
            badge.innerHTML = 'NAV DECOUPLED v6.0';
            badge.style = 'position:fixed; bottom:5px; right:5px; background:blue; color:white; font-size:9px; padding:3px 6px; z-index:200001; border-radius:3px; font-weight:bold;';
            document.body.appendChild(badge);
            setTimeout(() => badge.style.display = 'none', 5000);
        }
    }

    $(document).ready(() => {
        initMobileToggle();
        // Constant enforcement poll
        setInterval(initMobileToggle, 2000);
    });

})(jQuery);
