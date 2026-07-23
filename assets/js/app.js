/* ============================================================
   APP BOOTSTRAP — se ejecuta una sola vez al cargar index.html.
   Cablea el "chrome" fijo del shell (header, footer, progress
   bar, back-to-top) y arranca el router. Nada aquí se repite al
   navegar entre vistas: eso es exactamente lo que hace SPA a
   esta plataforma en vez de una unión de archivos HTML.
   ============================================================ */
(function(){
  'use strict';

  document.addEventListener('DOMContentLoaded', function(){

    // ---- tema claro/oscuro ----
    App.theme.init(document.getElementById('themeToggle'));

    // ---- menú móvil del header ----
    var navToggle = document.getElementById('navToggle');
    if (navToggle){
      navToggle.addEventListener('click', function(){
        var open = document.body.classList.toggle('mobile-nav-open');
        navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }

    // ---- barra de progreso de lectura + botón "volver arriba" ----
    var progressBar = document.getElementById('progressBar');
    var backToTop = document.getElementById('backToTop');
    function onScroll(){
      var doc = document.documentElement;
      var scrollTop = window.scrollY || doc.scrollTop;
      var scrollable = (doc.scrollHeight - doc.clientHeight) || 1;
      var pct = Math.min(100, Math.max(0, Math.round((scrollTop / scrollable) * 100)));
      progressBar.style.width = pct + '%';
      progressBar.setAttribute('aria-valuenow', pct);
      backToTop.classList.toggle('visible', scrollTop > 420);
    }
    document.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    backToTop.addEventListener('click', function(){
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ---- atajos de teclado globales: "/" enfoca el buscador,
    //      Escape lo limpia, Alt+flechas delega en la vista activa ----
    document.addEventListener('keydown', function(e){
      var tag = (e.target.tagName || '').toLowerCase();
      var typing = tag === 'input' || tag === 'textarea';
      var searchInput = document.getElementById('moduleSearch');

      if (e.key === '/' && !typing){
        e.preventDefault();
        if (searchInput) searchInput.focus();
        return;
      }
      if (e.key === 'Escape' && document.activeElement === searchInput){
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
        searchInput.blur();
        return;
      }
      if (e.altKey && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')){
        var handler = App.router.getKeyboardNav();
        if (handler){
          e.preventDefault();
          handler(e.key === 'ArrowRight' ? 'next' : 'prev');
        }
      }
    });

    // ---- arranca el router (dibuja la vista inicial) ----
    App.router.init();
  });

})();
