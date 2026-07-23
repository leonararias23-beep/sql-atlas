/* ============================================================
   ANIMACIÓN "REVEAL" AL HACER SCROLL — reutilizable en cualquier
   vista. Se vuelve a invocar cada vez que el router inserta
   contenido nuevo en #app-content.
   ============================================================ */
window.App = window.App || {};

App.reveal = (function(){
  function observe(root){
    root = root || document;
    var els = Array.prototype.slice.call(root.querySelectorAll('.reveal:not(.is-visible)'));
    if (!els.length) return;
    if ('IntersectionObserver' in window){
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if (entry.isIntersecting){
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
      els.forEach(function(el){ io.observe(el); });
    } else {
      els.forEach(function(el){ el.classList.add('is-visible'); });
    }
  }
  return { observe: observe };
})();
