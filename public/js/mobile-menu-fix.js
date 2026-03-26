/**
 * Mobile Menu Fix - v2.9.2
 * Ensures the MDK drawer opens correctly on mobile devices by providing a robust toggle fallback.
 */
(function($) {
    'use strict';

    function initMobileToggle() {
        console.log('[MobileFix] Initializing high-stability custom handlers...');
        
        // 1. CLONE SIDEBAR FOR STABLE MOBILE NAV
        if ($('#custom-mobile-nav').length === 0) {
            const $originalSidebar = $('#default-drawer .sidebar').first();
            if ($originalSidebar.length) {
                const $clone = $originalSidebar.clone(true);
                $clone.find('[id]').each(function() {
                    $(this).attr('id', $(this).attr('id') + '-clone');
                });
                
                const $nav = $('<div id="custom-mobile-nav"></div>').append($clone);
                const $scrim = $('<div id="custom-mobile-scrim"></div>');
                
                $('body').prepend($nav).prepend($scrim);
                
                // Close on scrim click
                $scrim.on('click', function() {
                    $nav.removeClass('open');
                    $scrim.removeClass('visible');
                    $('body').removeClass('has-drawer-opened');
                });

                console.log('[MobileFix] Custom mobile nav created.');
            }
        }

        // 2. Override Toggle Listener
        $(document).off('click.mobiletoggle').on('click.mobiletoggle', '[data-toggle="sidebar"]', function(e) {
            if (window.innerWidth > 992) return; // Only for mobile/tablet

            e.preventDefault();
            e.stopPropagation();
            
            console.log('[MobileFix] Custom toggle triggered.');

            const $nav = $('#custom-mobile-nav');
            const $scrim = $('#custom-mobile-scrim');
            
            if ($nav.hasClass('open')) {
                $nav.removeClass('open');
                $scrim.removeClass('visible');
                $('body').removeClass('has-drawer-opened');
            } else {
                $nav.addClass('open');
                $scrim.addClass('visible');
                $('body').addClass('has-drawer-opened');
            }
        });

        // 3. Visual Debug Helper
        if (window.innerWidth <= 992) {
            if ($('#mobile-fix-badge').length === 0) {
                const $debug = $('<div id="mobile-fix-badge" style="position: fixed; bottom: 5px; right: 5px; background: rgba(0,255,0,0.7); color: black; font-size: 8px; padding: 2px 5px; z-index: 30001; border-radius: 3px; pointer-events: none;">NavFix v3 Active</div>');
                $('body').append($debug);
                setTimeout(() => $debug.fadeOut(), 5000);
            }
        }
    }

    // Run on ready and also after a short delay
    $(document).ready(initMobileToggle);
    setTimeout(initMobileToggle, 1500); // Wait for other scripts to populate sidebar

    window.addEventListener('resize', () => {
        if (window.innerWidth > 992) {
            $('#custom-mobile-nav').removeClass('open');
            $('#custom-mobile-scrim').removeClass('visible');
        }
    });

})(jQuery);
