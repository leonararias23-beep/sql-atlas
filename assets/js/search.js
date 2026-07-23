/* ============================================================
   BUSCADOR GENÉRICO — misma lógica para filtrar el catálogo de
   módulos (dashboard) y el índice de temas (dentro de un módulo).
   No conoce nada de dashboard ni de módulos: recibe una lista de
   elementos, una función para extraer el texto a comparar y,
   opcionalmente, dónde mostrar el resaltado y el "sin resultados".
   ============================================================ */
window.App = window.App || {};

App.search = (function(){
  function escapeRegExp(str){ return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

  function highlight(el, originalHtml, term){
    if (!el) return;
    if (!term){ el.innerHTML = originalHtml; return; }
    var re = new RegExp('(' + escapeRegExp(term) + ')', 'ig');
    el.innerHTML = originalHtml.replace(/(>)([^<]+)(<)/g, function(m, a, text, b){
      return a + text.replace(re, '<mark>$1</mark>') + b;
    }).replace(/^([^<]+)/, function(m){
      return m.replace(re, '<mark>$1</mark>');
    });
  }

  /**
   * wire({ input, items, getHaystack, setVisible, noResultsEl, onFilter })
   * - input: <input> que dispara la búsqueda
   * - items: array de objetos { el, haystack } o elementos con getHaystack
   * - getHaystack(item): string donde buscar
   * - setVisible(item, visible): aplica/oculta el item
   * - noResultsEl: elemento a mostrar cuando no hay coincidencias
   * - onFilter(term, visibleCount): callback opcional tras cada filtro
   */
  function wire(opts){
    function run(){
      var term = opts.input.value.trim().toLowerCase();
      var visible = 0;
      opts.items.forEach(function(item){
        var haystack = opts.getHaystack(item).toLowerCase();
        var match = !term || haystack.indexOf(term) !== -1;
        opts.setVisible(item, match);
        if (match) visible++;
      });
      if (opts.noResultsEl){
        opts.noResultsEl.style.display = (term && visible === 0) ? 'block' : 'none';
      }
      if (opts.onFilter) opts.onFilter(term, visible);
    }
    opts.input.addEventListener('input', run);
    run();
    return run;
  }

  return { wire: wire, highlight: highlight, escapeRegExp: escapeRegExp };
})();
