/**
 * Mobile Menu Fix - v2.9.2
 * Ensures the MDK drawer opens correctly on mobile devices by providing a robust toggle fallback.
 */
(function($) {
    'use strict';

    function initMobileToggle() {
        console.log('[MobileFix v5.0] Starting restoration...');
        
        // 1. Relocate drawer to body (Vanilla JS for speed/reliability)
        const drawer = document.getElementById('default-drawer');
        if (drawer && drawer.parentElement !== document.body) {
            document.body.insertBefore(drawer, document.body.firstChild);
            console.log('[MobileFix v5.0] Drawer relocated to body.');
        }

        // 2. Click Listener (Delegated)
        $(document).off('click.mobiletoggle').on('click.mobiletoggle', '[data-toggle="sidebar"]', function(e) {
            if (window.innerWidth > 992) return;
            e.preventDefault();
            
            console.log('[MobileFix v5.0] Toggle clicked.');
            $('body').toggleClass('has-drawer-opened');
            $('#default-drawer').toggleClass('mdk-drawer--open');
        });

        // 3. Body click to close
        $(document).off('click.mobileclose').on('click.mobileclose', function(e) {
            if ($('body').hasClass('has-drawer-opened') && !$(e.target).closest('#default-drawer, [data-toggle="sidebar"]').length) {
                $('body').removeClass('has-drawer-opened');
                $('#default-drawer').removeClass('mdk-drawer--open');
            }
        });

        // 4. Force status badge
        if (window.innerWidth <= 992) {
            const badge = document.createElement('div');
            badge.id = 'mobile-fix-badge-final';
            badge.innerHTML = 'NAV STABLE v5.0';
            badge.style = 'position:fixed; bottom:5px; right:5px; background:green; color:white; font-size:9px; padding:3px 6px; z-index:100000; border-radius:3px; font-weight:bold;';
            document.body.appendChild(badge);
            setTimeout(() => badge.style.display = 'none', 5000);
        }
    }

    $(document).ready(initMobileToggle);
    setTimeout(initMobileToggle, 1000); // Fail-safe re-init

})(jQuery);
