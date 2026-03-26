/**
 * Mobile Menu Fix - v7.3 (Accessibility & Scrolling)
 * Ensures the MDK drawer opens correctly on mobile devices by providing a robust toggle fallback.
 */
(function($) {
    'use strict';

    function initMobileToggle() {
        console.log('[MobileFix v7.0] NUCLEAR RESTORATION ACTIVE...');
        
        const createNuclearNav = () => {
            if ($('#ultimate-mobile-nav').length > 0) return;

            // 1. Find the sidebar source
            const $source = $('.sidebar').first();
            if ($source.length && $source.find('.sidebar-menu-item').length > 0) {
                // 2. Clone it DEEPLY to keep events (like logout)
                const $clone = $source.clone(true);
                
                // 3. CLEAN UP: Strip ALL MDK/Library artifacts from the clone
                $clone.removeClass('mdk-drawer js-mdk-drawer perfect-scrollbar sidebar-dark sidebar-dark-pickled-bluewood')
                      .removeAttr('data-perfect-scrollbar')
                      .removeAttr('data-mdk-drawer')
                      .removeAttr('data-mdk-reveal')
                      .removeAttr('data-domfactory-upgraded');
                
                // Force height auto for native scroll
                $clone.css('height', 'auto');
                $clone.find('*').css('height', 'auto');
                
                // Remove MDK specific wrapping if any
                $clone.find('.mdk-drawer__content').contents().unwrap();

                // Clean child IDs to avoid conflicts with original
                $clone.find('[id]').each(function() {
                    $(this).attr('id', $(this).attr('id') + '-nuclear');
                });

                console.log('[MobileFix v7.3] Sidebar cleaned (Native Scroll Ready).');

                // 4. Wrap and Inject
                const $nav = $('<div id="ultimate-mobile-nav"></div>').append($clone);
                const $scrim = $('<div id="ultimate-scrim"></div>');
                
                // UX: Move theme toggle to top for mobile
                const $toggleLi = $nav.find('[id*="themeToggle"]').closest('li');
                if ($toggleLi.length) {
                    $nav.find('.sidebar-menu').prepend($toggleLi);
                    $toggleLi.css({ 'margin-top': '10px', 'margin-bottom': '10px', 'border-bottom': '1px solid rgba(255,255,255,0.1)', 'padding-bottom': '15px' });
                }

                $('body').prepend($nav).prepend($scrim);
                
                // Close on scrim click
                $scrim.on('click', function() {
                    $nav.removeClass('active');
                    $scrim.removeClass('visible');
                    $('body').removeClass('has-drawer-opened');
                });

                console.log('[MobileFix v7.0] Nuclear menu injected successfully.');
                return true;
            }
            return false;
        };

        // Aggressive polling to wait for dynamic content (Supabase)
        if (!createNuclearNav()) {
            let attempts = 0;
            const interval = setInterval(() => {
                attempts++;
                if (createNuclearNav() || attempts > 5) clearInterval(interval);
            }, 1000);
        }

        // 5. Override Toggle Listener (Global Delegation)
        $(document).off('click.mobiletoggle').on('click.mobiletoggle', '[data-toggle="sidebar"]', function(e) {
            if (window.innerWidth > 992) return;
            e.preventDefault();
            e.stopPropagation();
            
            const $nav = $('#ultimate-mobile-nav');
            const $scrim = $('#ultimate-scrim');
            
            console.log('[MobileFix v7.0] Toggle triggered. Nav exists:', $nav.length);

            if ($nav.length === 0) createNuclearNav();

            if ($nav.hasClass('active')) {
                $nav.removeClass('active');
                $scrim.removeClass('visible');
                $('body').removeClass('has-drawer-opened');
            } else {
                $nav.addClass('active');
                $scrim.addClass('visible');
                $('body').addClass('has-drawer-opened');
            }
        });

        // 6. Final Status Badge
        if (window.innerWidth <= 992) {
            const badge = document.createElement('div');
            badge.id = 'mobile-fix-badge-nuclear';
            badge.innerHTML = 'NAV NUCLEAR v7.0 READY';
            badge.style = 'position:fixed; bottom:5px; right:5px; background:red; color:white; font-size:9px; padding:4px 8px; z-index:400000; border-radius:4px; font-weight:bold; border:2px solid gold;';
            document.body.appendChild(badge);
            setTimeout(() => badge.style.display = 'none', 6000);
        }
    }

    $(document).ready(initMobileToggle);

})(jQuery);
