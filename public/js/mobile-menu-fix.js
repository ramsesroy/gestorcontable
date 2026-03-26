/**
 * Mobile Menu Fix - v2.9.2
 * Ensures the MDK drawer opens correctly on mobile devices by providing a robust toggle fallback.
 */
(function($) {
    'use strict';

    function initMobileToggle() {
        console.log('[MobileFix] Initializing mobile toggle handlers...');
        
        // 1. Force Upgrade MDK Components
        if (typeof domFactory !== 'undefined') {
            try {
                domFactory.handler.upgradeAll();
                console.log('[MobileFix] MDK components upgraded.');
            } catch (e) {
                console.error('[MobileFix] Error upgrading MDK components:', e);
            }
        }

        // 2. Manual Toggle Listener
        $(document).off('click.mobiletoggle').on('click.mobiletoggle', '[data-toggle="sidebar"]', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const target = $(this).attr('data-target') || '#default-drawer';
            const drawerEl = document.querySelector(target);
            
            console.log('[MobileFix] Toggle clicked for:', target);

            if (drawerEl && drawerEl.mdkDrawer) {
                try {
                    drawerEl.mdkDrawer.toggle();
                    console.log('[MobileFix] Toggled using mdkDrawer property.');
                } catch (err) {
                    console.error('[MobileFix] MDK Toggle Error:', err);
                }
            }

            // FORCE CLASS TOGGLE AS FAIL-SAFE
            const $drawer = $(target);
            if ($drawer.length) {
                const isOpen = $drawer.hasClass('mdk-drawer--open');
                if (isOpen) {
                    $drawer.removeClass('mdk-drawer--open');
                    $('body').removeClass('has-drawer-opened');
                } else {
                    $drawer.addClass('mdk-drawer--open');
                    $('body').addClass('has-drawer-opened');
                }
                console.log('[MobileFix] Force-toggled mdk-drawer--open class. New state:', !isOpen);
            }
        });
    }

    // Run on ready and also after a short delay to ensure MDK is loaded
    $(document).ready(initMobileToggle);
    setTimeout(initMobileToggle, 1000);

})(jQuery);
