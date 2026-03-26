/**
 * CMS Authentication Guard
 * Prevents unauthenticated access to protected pages.
 */
(async function() {
    const path = window.location.pathname;
    const isAuthPage = path.includes('login.html') || path.includes('signup.html') || path.includes('index.html');
    
    if (isAuthPage) return;

    // Check if supabaseClient exists (from db.js)
    const checkSession = async () => {
        if (typeof supabaseClient === 'undefined') {
            setTimeout(checkSession, 50);
            return;
        }

        try {
            const { data: { session }, error } = await supabaseClient.auth.getSession();
            if (error || !session) {
                console.warn('No active session found. Redirecting to login...');
                window.location.replace('login.html');
                return;
            }

            // GLOBAL SIDEBAR VISIBILITY LOGIC
            // Fetch profile to determine role-based menu access
            const { data: profile } = await supabaseClient.from('profiles').select('role').eq('id', session.user.id).single();
            if (profile && profile.role === 'admin') {
                const showItems = () => {
                    const ids = ['sidebarUsersItem', 'sidebarBranchesItem'];
                    ids.forEach(id => {
                        const el = document.getElementById(id);
                        if (el) el.style.display = 'block';
                    });
                };
                
                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', showItems);
                } else {
                    showItems();
                }
            }
        } catch (err) {
            console.error('Auth guard error:', err);
            // We don't always redirect to login on generic errors to avoid loops
        }
    };

    checkSession();
})();
