/* ============================================================
   TEMA (claro/oscuro) — un único botón en el header global.
   ============================================================ */
window.App = window.App || {};

App.theme = (function(){
  function apply(theme, toggleEl){
    document.documentElement.setAttribute('data-theme', theme);
    if (toggleEl) toggleEl.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
  }

  function init(toggleEl){
    apply(App.state.getTheme(), toggleEl);
    toggleEl.addEventListener('click', function(){
      var current = document.documentElement.getAttribute('data-theme');
      var next = current === 'dark' ? 'light' : 'dark';
      apply(next, toggleEl);
      App.state.setTheme(next);
    });
  }

  return { init: init };
})();
