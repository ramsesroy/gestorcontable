/**
 * CMS Toast Notification Engine
 * Usage: showToast('Mensaje...', 'success' | 'error' | 'warning' | 'info')
 */
window.showToast = function(msg, type = 'success') {
    let container = document.getElementById('cms-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'cms-toast-container';
        document.body.appendChild(container);
    }

    // Auto-detect type if it's default 'success' but message looks like an error
    const msgLower = msg.toLowerCase();
    if (type === 'success' && (msgLower.includes('error') || msgLower.includes('fallo') || msgLower.includes('inválido') || msgLower.includes('por favor') || msgLower.includes('ingrese') || msgLower.includes('seleccione'))) {
        type = 'error';
    }

    const toast = document.createElement('div');
    toast.className = `cms-toast ${type}`;
    
    const icons = {
        success: 'check_circle',
        error: 'error',
        warning: 'warning',
        info: 'info'
    };

    const titles = {
        success: '¡Éxito!',
        error: 'Error',
        warning: 'Atención',
        info: 'Información'
    };

    toast.innerHTML = `
        <i class="material-icons">${icons[type]}</i>
        <div class="cms-toast-content">
            <span class="cms-toast-title">${titles[type]}</span>
            <span class="cms-toast-msg">${msg}</span>
        </div>
    `;

    container.appendChild(toast);

    // Auto remove
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(20px)';
        setTimeout(() => {
            if (toast.parentNode) {
                container.removeChild(toast);
            }
        }, 300);
    }, 4000);
};

// Override native alert (optional but recommended for legacy)
/*
window.alert = function(msg) {
    showToast(msg, 'info');
};
*/
