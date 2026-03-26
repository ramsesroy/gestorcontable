/**
 * CMS Global Sidebar Search
 * Handles student lookups and redirection to payment/profile.
 */
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('globalSidebarSearch');
    const resultsContainer = document.getElementById('globalSearchResults');

    if (!searchInput || !resultsContainer) return;

    let timeout = null;

    searchInput.addEventListener('input', function() {
        clearTimeout(timeout);
        const query = searchInput.value.trim();

        if (query.length < 3) {
            resultsContainer.style.display = 'none';
            return;
        }

        timeout = setTimeout(async () => {
            try {
                const { data, error } = await supabaseClient
                    .from('students')
                    .select('id, full_name, dni, branches(name)')
                    .or(`full_name.ilike.%${query}%,dni.ilike.%${query}%`)
                    .limit(5);

                if (error) throw error;

                displayResults(data);
            } catch (err) {
                console.error('Search error:', err);
            }
        }, 400);
    });

    function displayResults(students) {
        if (!students || students.length === 0) {
            resultsContainer.innerHTML = '<div class="sidebar-search-item text-muted">Sin resultados</div>';
            resultsContainer.style.display = 'block';
            return;
        }

        resultsContainer.innerHTML = students.map(s => `
            <div class="sidebar-search-item" data-id="${s.id}" data-dni="${s.dni}">
                <strong>${s.full_name}</strong>
                <small>${s.dni} - ${s.branches ? s.branches.name : '-'}</small>
            </div>
        `).join('');

        resultsContainer.style.display = 'block';

        // Add click events
        resultsContainer.querySelectorAll('.sidebar-search-item').forEach(item => {
            item.addEventListener('click', () => {
                const dni = item.getAttribute('data-dni');
                window.location.href = `search.html?q=${encodeURIComponent(dni)}`;
            });
        });
    }

    // Close on click outside
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !resultsContainer.contains(e.target)) {
            resultsContainer.style.display = 'none';
        }
    });
});
