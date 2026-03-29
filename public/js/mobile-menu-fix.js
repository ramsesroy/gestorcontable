/**
 * Mobile Menu Fix - v10.0 (Pure JS Touchmove Lock)
 * 
 * STRATEGY: Zero CSS body locking.
 * - body/html get NO overflow:hidden, NO position:fixed
 * - Body scroll is prevented purely via JS touchmove interception
 * - Nav scroll works via its own overflow-y:scroll + native browser handling
 * 
 * WHY THIS WORKS ON ANDROID:
 *   When we DON'T call preventDefault() for touches inside #ultimate-mobile-nav,
 *   the browser sees overflow-y:scroll + touch-action:pan-y on the nav and
 *   handles scroll natively at the compositor level. No CSS context creates
 *   interference.
 */
(function($) {
    'use strict';

    // ── Body scroll lock (pure JS, no CSS needed) ─────────────────────────────
    function _onBodyTouchMove(e) {
        // Touch is inside the nav → let native nav scroll handle it
        if (e.target && e.target.closest && e.target.closest('#ultimate-mobile-nav')) {
            return; // DO NOT preventDefault — nav handles this via overflow-y:scroll
        }
        // Touch is outside the nav (page content, scrim) → block body scroll
        e.preventDefault();
    }

    function openNavDrawer($nav, $scrim) {
        $nav.addClass('active');
        $scrim.addClass('visible');
        // Lock body scroll via JS only — no CSS required
        document.addEventListener('touchmove', _onBodyTouchMove, { passive: false });
    }

    function closeNavDrawer($nav, $scrim) {
        $nav.removeClass('active');
        $scrim.removeClass('visible');
        // Release body scroll
        document.removeEventListener('touchmove', _onBodyTouchMove, { passive: false });
    }
    // ──────────────────────────────────────────────────────────────────────────

    function initMobileToggle() {

        const createNuclearNav = () => {
            if ($('#ultimate-mobile-nav').length > 0) return true;

            const $source = $('.sidebar').first();
            if ($source.length && $source.find('.sidebar-menu-item').length > 0) {

                // Clone cleanly — don't carry library event listeners
                const $clone = $source.clone(false);

                // Strip ALL MDK/PerfectScrollbar artifacts
                $clone.removeClass('mdk-drawer js-mdk-drawer perfect-scrollbar sidebar-dark sidebar-dark-pickled-bluewood')
                      .removeAttr('data-perfect-scrollbar data-mdk-drawer data-mdk-reveal data-domfactory-upgraded');

                // Allow natural height so the sidebar can overflow the nav container
                $clone.css('height', 'auto');
                $clone.find('*').css('height', 'auto');

                // Unwrap any MDK inner content wrapper
                $clone.find('.mdk-drawer__content').contents().unwrap();

                // Suffix IDs to avoid DOM conflicts with the original sidebar
                $clone.find('[id]').each(function() {
                    $(this).attr('id', $(this).attr('id') + '-nuclear');
                });

                // Build the nav: scroll wrapper (content) → nav (scroll container)
                const $scrollWrapper = $('<div class="nuclear-scroll-wrapper"></div>').append($clone);
                const $nav = $('<div id="ultimate-mobile-nav"></div>').append($scrollWrapper);
                const $scrim = $('<div id="ultimate-scrim"></div>');

                $('body').prepend($nav).prepend($scrim);

                // Close on scrim click
                $scrim.on('click', function() {
                    closeNavDrawer($nav, $scrim);
                });

                return true;
            }
            return false;
        };

        // Poll for dynamic content loaded by Supabase
        if (!createNuclearNav()) {
            let attempts = 0;
            const interval = setInterval(() => {
                attempts++;
                if (createNuclearNav() || attempts > 8) clearInterval(interval);
            }, 800);
        }

        // Hamburger toggle
        $(document).off('click.mobiletoggle').on('click.mobiletoggle', '[data-toggle="sidebar"]', function(e) {
            if (window.innerWidth > 992) return;
            e.preventDefault();
            e.stopPropagation();

            const $nav = $('#ultimate-mobile-nav');
            const $scrim = $('#ultimate-scrim');
            if ($nav.length === 0) createNuclearNav();

            if ($nav.hasClass('active')) {
                closeNavDrawer($nav, $scrim);
            } else {
                openNavDrawer($nav, $scrim);
            }
        });
    }

    $(document).ready(function() {
        if (window.innerWidth <= 992) {
            initMobileToggle();
        }
    });

})(jQuery);
