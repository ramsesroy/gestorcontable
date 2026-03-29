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

    function relocateHeaderButtons() {
        if ($('.mobile-header-actions').length > 0) return;
        
        // Find navbar logo (brand)
        const $brand = $('.navbar-brand').first();
        if (!$brand.length) return;

        // Create a dedicated container in the navbar for our top buttons
        const $actions = $('<div class="mobile-header-actions d-flex align-items-center ml-auto"></div>');
        
        // 1. View Toggle Button (Cajeras usually don't have this, only admins)
        // We'll check if #viewToggle exists in the DOM (indicating admin role)
        const $origToggle = $('#viewToggle');
        if ($origToggle.length) {
            const $viewBtn = $('<button class="btn btn-sm btn-primary mr-8pt shadow-sm" id="mobileViewToggle" title="Cambiar Vista">' +
                               '<i class="material-icons">style</i></button>');
            
            $viewBtn.on('click', function() {
                const current = $('input[name="viewMode"]:checked').val();
                const next = current === 'admin' ? 'cajero' : 'admin';
                $(`input[name="viewMode"][value="${next}"]`).prop('checked', true).trigger('change');
                
                // Visual feedback to show active state on the solid button
                $(this).toggleClass('btn-primary btn-secondary');
            });
            $actions.append($viewBtn);
        }

        // 2. Logout Button
        const $logoutBtn = $('<button class="btn btn-sm btn-danger shadow-sm" title="Cerrar Sesión">' +
                             '<i class="material-icons">exit_to_app</i></button>');
        $logoutBtn.on('click', function() {
            if (confirm('¿Cerrar sesión?')) {
                if (typeof logout === 'function') logout();
                else window.location.replace('login.html');
            }
        });
        $actions.append($logoutBtn);

        // Inject into the navbar
        $brand.after($actions);
        
        // Hide the original large radio buttons and password button on mobile to save space
        $('#viewToggle, #btnChangePassword').addClass('d-none d-lg-block');
    }

    function initMobileToggle() {
        const isMobile = window.innerWidth <= 992;

        if (!isMobile) {
            // Cleanup: remove header icons and restore desktop toggles
            $('.mobile-header-actions').remove();
            $('#viewToggle, #btnChangePassword').removeClass('d-none d-lg-block');
            
            // Optionally close the drawer if it was open
            const $nav = $('#ultimate-mobile-nav');
            const $scrim = $('#ultimate-scrim');
            if ($nav.hasClass('active')) closeNavDrawer($nav, $scrim);
            return;
        }

        // --- MOBILE MODE ---
        relocateHeaderButtons();

        const createNuclearNav = () => {
            if ($('#ultimate-mobile-nav').length > 0) return true;

            const $source = $('.sidebar').first();
            if ($source.length && $source.find('.sidebar-menu-item').length > 0) {
                const $clone = $source.clone(false);
                $clone.removeClass('mdk-drawer js-mdk-drawer perfect-scrollbar sidebar-dark sidebar-dark-pickled-bluewood')
                      .removeAttr('data-perfect-scrollbar data-mdk-drawer data-mdk-reveal data-domfactory-upgraded');
                
                $clone.css('height', 'auto');
                $clone.find('*').css('height', 'auto');
                $clone.find('.mdk-drawer__content').contents().unwrap();

                // Clean up: remove redundancy
                $clone.find('[onclick="logout()"], #themeToggle').closest('li').remove();

                $clone.find('[id]').each(function() {
                    $(this).attr('id', $(this).attr('id') + '-nuclear');
                });

                const $scrollWrapper = $('<div class="nuclear-scroll-wrapper"></div>').append($clone);
                const $nav = $('<div id="ultimate-mobile-nav"></div>').append($scrollWrapper);
                const $scrim = $('<div id="ultimate-scrim"></div>');

                $('body').prepend($nav).prepend($scrim);
                $scrim.on('click', () => closeNavDrawer($nav, $scrim));
                return true;
            }
            return false;
        };

        // Static listener for hamburger (only attach once)
        if (!window._mobileToggleInitialized) {
            $(document).on('click.mobiletoggle', '[data-toggle="sidebar"]', function(e) {
                if (window.innerWidth > 992) return;
                e.preventDefault();
                e.stopPropagation();

                const $nav = $('#ultimate-mobile-nav');
                const $scrim = $('#ultimate-scrim');
                if ($nav.length === 0) createNuclearNav();

                if ($nav.hasClass('active')) closeNavDrawer($nav, $scrim);
                else openNavDrawer($nav, $scrim);
            });
            window._mobileToggleInitialized = true;
        }

        // Poll for dynamic content
        let attempts = 0;
        const interval = setInterval(() => {
            attempts++;
            relocateHeaderButtons(); 
            if (createNuclearNav() || attempts > 10) clearInterval(interval);
        }, 800);
    }

    $(document).ready(function() {
        initMobileToggle();
    });

    // Handle orientation change and resizing for a seamless experience
    $(window).on('resize orientationchange', function() {
        initMobileToggle();
    });

})(jQuery);
