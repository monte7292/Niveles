// Deshabilitar clic derecho en toda la página
document.addEventListener('contextmenu', function(event) {
    event.preventDefault();
  });
  
  // Deshabilitar el uso de teclas de acceso rápido
  document.onkeydown = function(e) {
    // Deshabilitar Ctrl + C, Ctrl + U, Ctrl + S, y F12
    if (
      (e.ctrlKey && (e.keyCode === 67 || e.keyCode === 85 || e.keyCode === 83)) || // Ctrl + C, Ctrl + U, Ctrl + S
      e.keyCode === 123 // F12
    ) {
      e.preventDefault();
    }
  };
    
  // Manejo del menú móvil
  document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');

    // Verifica si los elementos existen antes de agregar eventos
    if (mobileMenuToggle && mobileMenu) {
      mobileMenuToggle.addEventListener('click', function() {
        mobileMenu.classList.toggle('show');
      });
    } 
  });