document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const toggleButton = document.getElementById('sidebar-toggle');

    toggleButton.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
    });

    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Remove active class from all other items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // If it wasn't active, make it active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
});

