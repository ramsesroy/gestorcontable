/**
 * Mobile Menu Fix - v2.9.2
 * Ensures the MDK drawer opens correctly on mobile devices by providing a robust toggle fallback.
 */
(function($) {
    'use strict';

    function initMobileToggle() {
        console.log('[MobileFix] Initializing high-stability custom handlers...');
        
        const tryClone = () => {
            if ($('#custom-mobile-nav').length > 0) return;

            const $originalSidebar = $('#default-drawer .sidebar').first();
            // Check if sidebar has menu items before cloning
            if ($originalSidebar.length && $originalSidebar.find('.sidebar-menu-item').length > 0) {
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

                console.log('[MobileFix] Custom mobile nav created successfully with content.');
                return true;
            }
            return false;
        };

        // 1. Initial attempt
        if (!tryClone()) {
            // 2. Poll every second for 5 seconds
            let attempts = 0;
            const interval = setInterval(() => {
                attempts++;
                if (tryClone() || attempts > 5) clearInterval(interval);
            }, 1000);
        }

        // 2. Override Toggle Listener
        $(document).off('click.mobiletoggle').on('click.mobiletoggle', '[data-toggle="sidebar"]', function(e) {
            if (window.innerWidth > 992) return;

            e.preventDefault();
            e.stopPropagation();
            
            const $nav = $('#custom-mobile-nav');
            const $scrim = $('#custom-mobile-scrim');
            
            console.log('[MobileFix] Custom toggle triggered. Nav exists:', $nav.length);

            if ($nav.length === 0) {
                // Last ditch attempt to clone
                tryClone();
            }

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
            const $debug = $('<div id="mobile-fix-badge" style="position: fixed; bottom: 5px; right: 5px; background: rgba(0,255,0,0.8); color: black; font-size: 9px; padding: 4px 8px; z-index: 30005; border-radius: 4px; pointer-events: none; font-weight: bold; border: 1px solid black;">NavFix v4.1 Ready</div>');
            $('#mobile-fix-badge').remove();
            $('body').append($debug);
            setTimeout(() => $debug.fadeOut(1000), 8000);
        }
    }

    // Run immediately and on ready
    initMobileToggle();
    $(document).ready(initMobileToggle);

    window.addEventListener('resize', () => {
        if (window.innerWidth > 992) {
            $('#custom-mobile-nav').removeClass('open');
            $('#custom-mobile-scrim').removeClass('visible');
        }
    });

})(jQuery);
