/* ============================================================
   ROUTER SPA — basado en location.hash (funciona sin servidor,
   abriendo index.html directamente con doble clic).
   Rutas:
     #/                                -> Dashboard
     #/modulo/<id>                     -> vista de módulo
     #/modulo/<id>/<topicId>           -> vista de módulo + scroll a tema
   Reemplaza únicamente el contenido de #app-content; el header,
   la barra de breadcrumb y el footer nunca se regeneran.
   ============================================================ */
window.App = window.App || {};

App.router = (function(){
  var contentEl, breadcrumbEl, mainNavLinks;
  var keyboardNavHandler = null;
  var currentTopicTitleEl = null;
  var lastRendered = null; // última ruta ya dibujada: permite "navegación suave" dentro del mismo módulo

  function parseHash(){
    var hash = location.hash.replace(/^#/, '') || '/';
    var parts = hash.split('/').filter(Boolean); // ["modulo","fundamentos-sql","t7"]
    if (parts[0] === 'modulo' && parts[1]){
      return { view: 'modulo', moduleId: parts[1], topicId: parts[2] || null };
    }
    if (parts[0] === 'playground'){
      return { view: 'playground' };
    }
    return { view: 'dashboard' };
  }

  function setActiveMainNav(route){
    mainNavLinks.forEach(function(btn){
      var isDashboardBtn = btn.getAttribute('data-scroll') === 'dashboard';
      var isPlaygroundBtn = btn.getAttribute('href') === '#/playground';
      var active = (route.view === 'dashboard' && isDashboardBtn) || (route.view === 'playground' && isPlaygroundBtn);
      btn.classList.toggle('is-active', active);
    });
  }

  function renderBreadcrumb(route){
    if (route.view === 'dashboard'){
      breadcrumbEl.innerHTML = '<span class="current">Inicio</span>';
      document.title = 'Inicio · SQL Atlas';
      currentTopicTitleEl = null;
      return;
    }
    if (route.view === 'playground'){
      breadcrumbEl.innerHTML =
        '<a href="#/" data-route-link>Inicio</a>' +
        '<svg aria-hidden="true"><use href="#i-chevron"/></svg><span class="current">Playground SQL</span>';
      document.title = 'Playground SQL · SQL Atlas';
      currentTopicTitleEl = null;
      return;
    }
    var meta = App.registryHelpers.get(route.moduleId);
    var moduleTitle = meta ? meta.title : route.moduleId;
    breadcrumbEl.innerHTML =
      '<a href="#/" data-route-link>Inicio</a>' +
      '<svg aria-hidden="true"><use href="#i-chevron"/></svg>' +
      '<a href="#/modulo/' + route.moduleId + '" data-route-link>' + moduleTitle + '</a>' +
      '<svg aria-hidden="true"><use href="#i-chevron"/></svg>' +
      '<span class="current" id="breadcrumbCurrent">' + moduleTitle + '</span>';
    document.title = moduleTitle + ' · SQL Atlas';
    currentTopicTitleEl = document.getElementById('breadcrumbCurrent');
  }

  function updateBreadcrumbTopic(title){
    if (currentTopicTitleEl && title) currentTopicTitleEl.textContent = title;
  }

  function render(){
    var route = parseHash();
    document.body.classList.remove('mobile-nav-open', 'side-nav-open');

    // ---- NAVEGACIÓN SUAVE: si ya estamos dentro del mismo módulo,
    // no se re-renderiza nada; solo se desplaza al tema pedido.
    // Esto es lo que hace que el índice lateral y los botones
    // Anterior/Siguiente respondan al instante (el scroll-spy se
    // encarga de resaltar el tema activo y actualizar el breadcrumb).
    if (route.view === 'modulo' && lastRendered &&
        lastRendered.view === 'modulo' && lastRendered.moduleId === route.moduleId &&
        contentEl.querySelector('.module-shell')){
      if (route.topicId){
        var target = document.getElementById(route.topicId);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      lastRendered = route;
      return;
    }

    keyboardNavHandler = null;
    if (App.views.module && App.views.module.teardown) App.views.module.teardown();

    var html;
    if (route.view === 'dashboard'){
      html = App.views.dashboard.render();
    } else if (route.view === 'playground'){
      html = App.views.playground.render();
    } else {
      html = App.views.module.render(route.moduleId);
    }

    contentEl.innerHTML = '<div class="view">' + html + '</div>';
    renderBreadcrumb(route);
    setActiveMainNav(route);

    // el buscador del header es un único elemento persistente: se
    // clona para descartar los listeners de la vista anterior antes
    // de que la nueva vista lo cablee de nuevo.
    var searchInput = document.getElementById('moduleSearch');
    if (searchInput){
      var fresh = searchInput.cloneNode(true);
      searchInput.parentNode.replaceChild(fresh, searchInput);
    }

    if (route.view === 'dashboard'){
      document.getElementById('moduleSearch').placeholder = 'Buscar un módulo…';
      App.views.dashboard.afterRender(contentEl);
    } else if (route.view === 'playground'){
      document.getElementById('moduleSearch').placeholder = 'Buscar un módulo…';
      App.views.playground.afterRender(contentEl);
    } else {
      document.getElementById('moduleSearch').placeholder = 'Buscar en el curso…';
      App.views.module.afterRender(contentEl, route.moduleId, route.topicId);
    }

    App.reveal.observe(contentEl);
    // Solo volver al tope cuando la ruta NO apunta a un tema concreto:
    // si hay topicId, afterRender ya hizo scroll hasta esa sección y
    // este scrollTo lo estaba anulando (por eso "no pasaba nada" al
    // hacer clic en el índice o en Anterior/Siguiente).
    if (!(route.view === 'modulo' && route.topicId)){
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
    lastRendered = route;
  }

  function navigate(path){
    var target = '#' + path;
    if (location.hash === target){
      // el hash no cambia -> hashchange no dispara; renderizamos a mano
      // para que volver a pulsar el mismo tema siga haciendo scroll.
      render();
    } else {
      location.hash = target;
    }
  }

  function setKeyboardNav(fn){ keyboardNavHandler = fn; }
  function getKeyboardNav(){ return keyboardNavHandler; }

  function init(){
    contentEl = document.getElementById('app-content');
    breadcrumbEl = document.getElementById('breadcrumb');
    mainNavLinks = Array.prototype.slice.call(document.querySelectorAll('.main-nav button, .main-nav a, .mobile-nav button, .mobile-nav a'));

    // navegación declarativa: cualquier elemento con data-route-link
    // o data-scroll, en cualquier vista, sin listeners por-tarjeta.
    document.addEventListener('click', function(e){
      var link = e.target.closest('[data-route-link]');
      if (link){
        e.preventDefault();
        var href = link.getAttribute('href');
        if (href && href.indexOf('#/') === 0){ navigate(href.slice(1)); }
        return;
      }
      var scrollBtn = e.target.closest('[data-scroll]');
      if (scrollBtn){
        e.preventDefault();
        var id = scrollBtn.getAttribute('data-scroll');
        var goTo = function(){
          var el = document.getElementById(id);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        };
        if (parseHash().view !== 'dashboard'){
          navigate('/');
          setTimeout(goTo, 60);
        } else {
          goTo();
        }
      }
    });

    window.addEventListener('hashchange', render);
    render();
  }

  return {
    init: init,
    navigate: navigate,
    render: render,
    updateBreadcrumbTopic: updateBreadcrumbTopic,
    setKeyboardNav: setKeyboardNav,
    getKeyboardNav: getKeyboardNav,
    parseHash: parseHash
  };
})();
