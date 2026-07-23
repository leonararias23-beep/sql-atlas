/* ============================================================
   VISTA: MÓDULO (genérica)
   No sabe nada específico de "Fundamentos SQL": lee de
   App.modules[moduleId] (topicsMeta + heroHtml + schemaHtml +
   topicsHtml) y arma el índice lateral, el buscador, el resumen
   de sesión anterior y el marcado de completado. Cualquier módulo
   nuevo que siga esta misma forma funciona aquí sin cambios.
   ============================================================ */
window.App = window.App || {};
App.views = App.views || {};

App.views.module = (function(){

  var spyHandler = null; // listener de scroll activo; se limpia al salir de la vista

  function teardown(){
    if (spyHandler){
      document.removeEventListener('scroll', spyHandler);
      spyHandler = null;
    }
  }

  function navListHtml(moduleId, topicsMeta){
    var items = topicsMeta.map(function(t){
      return '<li data-search="' + t.search + '">' +
        '<a href="#/modulo/' + moduleId + '/' + t.id + '" data-route-link data-level="' + t.level + '">' +
          '<span class="n">' + t.num + '</span>' +
          '<span class="dot lvl-' + t.level + '"></span> ' + t.title +
          '<svg class="nav-check" aria-hidden="true"><use href="#i-check"/></svg>' +
        '</a>' +
      '</li>';
    }).join('');
    return '<ol id="navlist">' + items + '</ol>';
  }

  function render(moduleId){
    var mod = App.modules[moduleId];
    var meta = App.registryHelpers.get(moduleId);
    if (!mod || !meta) {
      return '<div class="wrap section"><p>Este módulo todavía no tiene contenido publicado.</p></div>';
    }

    var locked = meta.status === 'available' && !App.registryHelpers.isUnlocked(moduleId);
    var lockAlertHtml = '';
    if (locked){
      var req = App.registryHelpers.lockRequirement(moduleId);
      lockAlertHtml = '<div class="alert" style="margin-bottom:16px;">' +
        '<svg aria-hidden="true"><use href="#i-lock"/></svg>' +
        '<span><strong>Fuera de la ruta recomendada:</strong> normalmente este módulo se desbloquea al completar "' + req.title + '". Puedes seguir explorándolo igual, a tu ritmo.</span>' +
      '</div>';
    }

    var hasExercises = mod.exercisesMeta && mod.exercisesMeta.length;
    var exercisesNavHtml = hasExercises
      ? '<button type="button" class="side-exercises-link" id="goToExercises">' +
          '<svg aria-hidden="true"><use href="#i-tip"/></svg> Ejercicios prácticos' +
        '</button>'
      : '';

    return '' +
    '<div class="module-shell">' +
      '<button class="icon-btn side-toggle" id="sideToggle" aria-label="Abrir índice de temas" aria-expanded="false" aria-controls="sideNav">' +
        '<svg aria-hidden="true"><use href="#i-menu"/></svg>' +
      '</button>' +
      '<nav class="side" id="sideNav" aria-label="Índice de temas">' +
        '<div class="side-brand">' +
          '<span class="side-brand__label">Índice</span>' +
          '<div class="side-progress" id="sideProgress" title="Porcentaje de temas marcados como completados">' +
            '<svg class="side-progress__ring" viewBox="0 0 22 22">' +
              '<circle class="track" cx="11" cy="11" r="9"/>' +
              '<circle class="fill" cx="11" cy="11" r="9" id="ringFill" stroke-dasharray="56.5" stroke-dashoffset="56.5"/>' +
            '</svg>' +
            '<span id="progressPct">0%</span>' +
          '</div>' +
        '</div>' +
        navListHtml(moduleId, mod.topicsMeta) +
        exercisesNavHtml +
        '<div class="side-legend">' +
          '<span><span class="dot lvl-basico"></span> Básico</span>' +
          '<span><span class="dot lvl-intermedio"></span> Intermedio</span>' +
          '<span><span class="dot lvl-avanzado"></span> Avanzado</span>' +
          '<span><svg class="legend-check" aria-hidden="true"><use href="#i-check"/></svg> Completado</span>' +
        '</div>' +
      '</nav>' +
      '<main class="module-main" id="module-main">' +
        mod.heroHtml +
        lockAlertHtml +
        mod.schemaHtml +
        '<div id="noResults">' +
          '<svg aria-hidden="true"><use href="#i-search"/></svg>' +
          '<p>No se encontraron temas que coincidan con la búsqueda.</p>' +
        '</div>' +
        mod.topicsHtml +
        (hasExercises ? App.exercises.renderSection(mod.exercisesMeta) : '') +
        '<div class="module-finish" id="moduleFinish">' +
          '<div class="module-finish__text">' +
            '<strong>¿Terminaste este módulo?</strong>' +
            '<span>Márcalo como finalizado para guardar tu avance y poder saltar al siguiente módulo de la ruta.</span>' +
          '</div>' +
          '<button type="button" class="btn btn-primary module-finish__btn" id="moduleFinishBtn" aria-pressed="false">' +
            '<svg aria-hidden="true"><use href="#i-check"/></svg>' +
            '<span class="module-finish__label">Marcar módulo como finalizado</span>' +
          '</button>' +
        '</div>' +
      '</main>' +
    '</div>';
  }

  function afterRender(root, moduleId, topicId){
    var mod = App.modules[moduleId];
    if (!mod) return;

    // ---- menú lateral móvil ----
    var sideToggle = root.querySelector('#sideToggle');
    if (sideToggle){
      sideToggle.addEventListener('click', function(){
        var open = document.body.classList.toggle('side-nav-open');
        sideToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      root.querySelectorAll('nav.side a').forEach(function(a){
        a.addEventListener('click', function(){ document.body.classList.remove('side-nav-open'); });
      });
    }

    // ---- marcar como completado ----
    App.progress.refreshModule(root, moduleId);

    var allTopicIds = mod.topicsMeta.map(function(t){ return t.id; });
    var finishBtn = root.querySelector('#moduleFinishBtn');

    // El botón único del final refleja si TODO el módulo está finalizado.
    function syncFinishButton(){
      if (!finishBtn) return;
      var done = allTopicIds.length > 0 &&
        App.state.getCompletedTopics(moduleId).length >= allTopicIds.length;
      finishBtn.classList.toggle('is-done', done);
      finishBtn.setAttribute('aria-pressed', done ? 'true' : 'false');
      var label = finishBtn.querySelector('.module-finish__label');
      if (label) label.textContent = done ? 'Módulo finalizado' : 'Marcar módulo como finalizado';
    }

    root.querySelectorAll('[data-topic-check]').forEach(function(cb){
      cb.addEventListener('change', function(){
        App.state.toggleTopic(moduleId, this.getAttribute('data-topic-check'), this.checked);
        App.progress.refreshModule(root, moduleId);
        syncFinishButton();
      });
    });

    // Un solo botón al final: marca (o desmarca) todo el módulo de una vez,
    // así el usuario puede darlo por finalizado y saltar a otro módulo.
    if (finishBtn){
      finishBtn.addEventListener('click', function(){
        var done = allTopicIds.length > 0 &&
          App.state.getCompletedTopics(moduleId).length >= allTopicIds.length;
        App.state.setCompletedTopics(moduleId, done ? [] : allTopicIds.slice());
        App.progress.refreshModule(root, moduleId);
        syncFinishButton();
      });
    }
    syncFinishButton();

    // ---- buscador de temas (filtra secciones + resalta título/definición) ----
    var searchInput = document.getElementById('moduleSearch');
    var topics = Array.prototype.slice.call(root.querySelectorAll('section.topic'));
    var navItems = Array.prototype.slice.call(root.querySelectorAll('#navlist li'));
    var noResults = root.querySelector('#noResults');
    var schemaTable = root.querySelector('#schemaTable');

    var originalMarkup = topics.map(function(sec){
      var h2 = sec.querySelector('.topic-head h2');
      var def = sec.querySelector('p.def');
      return { h2: h2, def: def, h2html: h2 ? h2.innerHTML : '', defhtml: def ? def.innerHTML : '' };
    });

    if (searchInput){
      App.search.wire({
        input: searchInput,
        items: topics,
        getHaystack: function(sec){ return (sec.getAttribute('data-search') || '') + ' ' + (sec.getAttribute('data-title') || ''); },
        setVisible: function(sec, visible){ sec.hidden = !visible; },
        noResultsEl: noResults,
        onFilter: function(term, visibleCount){
          topics.forEach(function(sec, i){
            var om = originalMarkup[i];
            App.search.highlight(om.h2, om.h2html, sec.hidden ? '' : term);
            App.search.highlight(om.def, om.defhtml, sec.hidden ? '' : term);
          });
          navItems.forEach(function(li){
            var haystack = (li.getAttribute('data-search') || '').toLowerCase();
            li.hidden = !(!term || haystack.indexOf(term) !== -1);
          });
          if (schemaTable) schemaTable.style.display = term ? 'none' : '';
        }
      });
    }

    // ---- scroll-spy: resalta el tema visible + actualiza breadcrumb ----
    var navLinks = Array.prototype.slice.call(root.querySelectorAll('nav.side a'));
    var sections = navLinks.map(function(a){ return document.getElementById(a.getAttribute('href').split('/').pop()); });
    var lastActiveId = topicId || (mod.topicsMeta[0] && mod.topicsMeta[0].id);

    function updateSpy(){
      var y = (window.scrollY || document.documentElement.scrollTop) + 120;
      var current = sections[0];
      sections.forEach(function(sec){ if (sec && sec.offsetTop <= y) current = sec; });
      if (current && current.id !== lastActiveId){
        lastActiveId = current.id;
      }
      navLinks.forEach(function(a){
        var isActive = a.getAttribute('href').split('/').pop() === lastActiveId;
        a.classList.toggle('active', isActive);
        if (isActive) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      });
      if (current) {
        App.router.updateBreadcrumbTopic(current.getAttribute('data-title'));
      }
    }
    teardown(); // descarta el spy de un render anterior antes de registrar el nuevo
    spyHandler = updateSpy;
    document.addEventListener('scroll', updateSpy, { passive: true });
    updateSpy();

    // ---- atajo Alt+flechas para moverse entre temas visibles ----
    App.router.setKeyboardNav(function(direction){
      var visibleIds = sections.filter(function(s){ return s && !s.hidden; }).map(function(s){ return s.id; });
      var curIdx = visibleIds.indexOf(lastActiveId);
      if (curIdx === -1) curIdx = 0;
      var nextIdx = direction === 'next' ? Math.min(curIdx + 1, visibleIds.length - 1) : Math.max(curIdx - 1, 0);
      var nextEl = document.getElementById(visibleIds[nextIdx]);
      if (nextEl) nextEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // ---- bloques de código ----
    App.codeBlocks.enhance(root);

    // ---- ejercicios prácticos (opcional por módulo) ----
    if (mod.exercisesMeta && mod.exercisesMeta.length){
      App.exercises.wire(root, mod.exercisesMeta);
      var goEx = root.querySelector('#goToExercises');
      var exSection = root.querySelector('#exercises');
      if (goEx && exSection){
        goEx.addEventListener('click', function(){
          exSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          document.body.classList.remove('side-nav-open');
        });
      }
    }

    // ---- si la ruta apunta a un tema concreto, desplázate a él ----
    if (topicId){
      var target = document.getElementById(topicId);
      if (target) target.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  }

  return { render: render, afterRender: afterRender, teardown: teardown };
})();
