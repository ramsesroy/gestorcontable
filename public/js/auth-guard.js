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
            // Wait for db.js to load if it's not yet available
            setTimeout(checkSession, 50);
            return;
        }

        try {
            const { data: { session }, error } = await supabaseClient.auth.getSession();
            if (error || !session) {
                console.warn('No active session found. Redirecting to login...');
                window.location.replace('login.html');
            }
        } catch (err) {
            console.error('Auth guard error:', err);
            window.location.replace('login.html');
        }
    };

    checkSession();
})();
