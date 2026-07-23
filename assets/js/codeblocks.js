/* ============================================================
   BLOQUES DE CÓDIGO — numeración, copiar, seleccionar todo.
   Se invoca sobre cualquier contenedor recién insertado; funciona
   igual en Fundamentos SQL que en cualquier módulo futuro que use
   la clase .code-block.
   ============================================================ */
window.App = window.App || {};

App.codeBlocks = (function(){
  function fallbackCopy(text){
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch(e) {}
    document.body.removeChild(ta);
  }

  function enhance(root){
    root = root || document;
    Array.prototype.slice.call(root.querySelectorAll('.code-block')).forEach(function(block){
      if (block.dataset.enhanced === '1') return;
      var pre = block.querySelector('pre.code');
      if (!pre) return;
      block.dataset.enhanced = '1';

      var lines = pre.innerHTML.split('\n');
      pre.innerHTML = lines.map(function(line, idx){
        return '<span class="code-line"><span class="line-no">' + (idx + 1) + '</span><span class="line-text">' + line + '</span></span>';
      }).join('');

      var toolbar = document.createElement('div');
      toolbar.className = 'code-block__toolbar';
      toolbar.innerHTML =
        '<span class="code-block__label">SQL</span>' +
        '<div class="code-block__actions">' +
          '<button type="button" data-action="lines" aria-label="Mostrar u ocultar numeración de líneas"><svg aria-hidden="true"><use href="#i-hash"/></svg></button>' +
          '<button type="button" data-action="select" aria-label="Seleccionar todo el código"><svg aria-hidden="true"><use href="#i-select-all"/></svg></button>' +
          '<button type="button" data-action="copy" aria-label="Copiar código"><svg aria-hidden="true"><use href="#i-copy"/></svg><span>Copiar</span></button>' +
        '</div>';
      block.insertBefore(toolbar, pre);

      toolbar.querySelector('[data-action="lines"]').addEventListener('click', function(){
        block.classList.toggle('show-lines');
        this.classList.toggle('is-active', block.classList.contains('show-lines'));
      });

      toolbar.querySelector('[data-action="select"]').addEventListener('click', function(){
        var range = document.createRange();
        range.selectNodeContents(pre);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      });

      toolbar.querySelector('[data-action="copy"]').addEventListener('click', function(){
        var text = pre.textContent;
        var label = this.querySelector('span');
        var restore = label.textContent;
        var done = function(){
          label.textContent = '¡Copiado!';
          setTimeout(function(){ label.textContent = restore; }, 1500);
        };
        if (navigator.clipboard && navigator.clipboard.writeText){
          navigator.clipboard.writeText(text).then(done).catch(function(){ fallbackCopy(text); done(); });
        } else {
          fallbackCopy(text); done();
        }
      });
    });
  }

  return { enhance: enhance };
})();
