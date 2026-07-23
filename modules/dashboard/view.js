/* ============================================================
   VISTA: DASHBOARD
   Todo lo que antes era HTML fijo con 12 tarjetas copiadas a mano
   ahora se genera a partir de App.registry. Agregar un módulo al
   registro alimenta automáticamente: el catálogo, el roadmap, el
   contador de módulos y el panel de progreso — sin tocar esta vista.
   ============================================================ */
window.App = window.App || {};
App.views = App.views || {};

App.views.dashboard = (function(){

  function levelLabel(level){
    return level === 'basico' ? 'Básico' : level === 'intermedio' ? 'Intermedio' : 'Avanzado';
  }

  function moduleCardHtml(m){
    var locked = m.status === 'available' && !App.registryHelpers.isUnlocked(m.id);
    var unlocked = m.status === 'available' && !locked;

    var progressRow = unlocked
      ? '<div class="module-card__progress">' +
          '<span data-card-progress-label="' + m.id + '">0/' + m.topicsCount + '</span>' +
          '<div class="progress-track" style="flex:1;"><div class="progress-track__fill" data-card-progress-fill="' + m.id + '" style="width:0%"></div></div>' +
        '</div>'
      : '';

    var footer;
    if (unlocked){
      footer = '<div class="module-card__footer"><span class="btn btn-ghost">Entrar <svg aria-hidden="true"><use href="#i-arrow"/></svg></span></div>';
    } else if (locked){
      var req = App.registryHelpers.lockRequirement(m.id);
      footer = '<div class="module-card__footer module-card__footer--locked">' +
        '<span class="lock-note"><svg aria-hidden="true"><use href="#i-lock"/></svg> Completa "' + req.title + '" para desbloquear</span>' +
      '</div>';
    } else {
      footer = '';
    }

    var tag = unlocked ? 'a' : 'div';
    var hrefAttr = unlocked ? ' href="#/modulo/' + m.id + '" data-route-link' : '';
    var iconHtml = locked
      ? '<svg aria-hidden="true"><use href="#i-lock"/></svg>'
      : '<svg aria-hidden="true"><use href="#' + m.icon + '"/></svg>';
    /* El acento y el patrón decorativo son la identidad visual del
       módulo; se reservan para tarjetas desbloqueadas, así lo
       "bloqueado" se sigue leyendo neutro y sin distraer. */
    var identityClasses = unlocked ? ' ' + m.accent + ' ' + m.pattern : '';

    return '<' + tag + ' class="panel module-card reveal' + (unlocked ? ' is-available' : '') + (locked ? ' is-locked' : '') + identityClasses + '"' + hrefAttr + ' data-search="' + m.search + '">' +
      '<div class="module-card__top">' +
        '<span class="module-card__icon">' + iconHtml + '</span>' +
        '<span class="module-card__num">' + m.num + '</span>' +
      '</div>' +
      '<h3>' + m.title + '</h3>' +
      '<p class="desc">' + m.desc + '</p>' +
      '<div class="module-card__meta">' +
        '<span class="badge"><span class="dot lvl-' + m.level + '"></span> ' + levelLabel(m.level) + '</span>' +
        '<span class="module-card__topics"><svg aria-hidden="true"><use href="#i-hash"/></svg> ' + m.topicsCount + ' temas</span>' +
      '</div>' +
      progressRow +
      footer +
    '</' + tag + '>';
  }

  /* recommendedId marca el único nodo "estás aquí" del recorrido;
     el resto de nodos desbloqueados solo se distinguen por su propio
     estado (completado / en progreso / disponible), no por el brillo
     de "actual" que antes se aplicaba a todos los disponibles a la vez. */
  function roadmapNodeHtml(m, recommendedId){
    var locked = m.status === 'available' && !App.registryHelpers.isUnlocked(m.id);
    var clickable = m.status === 'available' && !locked;
    var c = m.status === 'available' ? App.progress.moduleCompletion(m.id) : null;
    var isDone = !!c && c.pct === 100;
    var isCurrent = clickable && m.id === recommendedId;

    var dotContent = locked ? '<svg aria-hidden="true"><use href="#i-lock"/></svg>'
      : isDone ? '<svg aria-hidden="true"><use href="#i-check"/></svg>'
      : m.num;

    var innerHtml =
      '<span class="roadmap-node__dot">' + dotContent + '</span>' +
      '<div><span class="roadmap-node__label">' + m.title + '</span>' +
      (isDone ? '<br><span class="roadmap-node__sub">Completado</span>' : '') +
      '</div>';

    var tag = clickable ? 'a' : 'div';
    var hrefAttr = clickable ? ' href="#/modulo/' + m.id + '" data-route-link' : '';

    return '<li class="roadmap-node' +
        (isCurrent ? ' is-current' : '') +
        (locked ? ' is-locked' : '') +
        (isDone ? ' is-done' : '') +
      '">' +
      '<div class="roadmap-node__track"></div>' +
      '<' + tag + ' class="roadmap-node__inner"' + hrefAttr + '>' + innerHtml + '</' + tag + '>' +
    '</li>';
  }

  function categoryMeta(catId){
    return (App.categories || []).find(function(c){ return c.id === catId; });
  }

  function roadmapDividerHtml(catId){
    var cat = categoryMeta(catId);
    return '<li class="roadmap-divider">' + (cat ? cat.abbr : catId) + '</li>';
  }

  function render(){
    var registry = App.registry;
    var available = App.registryHelpers.available();
    var recommended = App.progress.nextRecommended() || available[0] || registry[0];
    var overall = App.progress.overallCompletion();
    var allDone = overall.total > 0 && overall.pct === 100;
    var modulesCompleted = available.filter(function(m){ return App.progress.moduleCompletion(m.id).pct === 100; }).length;

    // Estadísticas reales, contadas desde el contenido cargado, para que
    // los chips de la portada nunca queden desactualizados al crecer el curso.
    var totalExercises = 0, totalCode = 0, totalResults = 0;
    available.forEach(function(m){
      var mod = App.modules[m.id];
      if (!mod) return;
      if (mod.exercisesMeta) totalExercises += mod.exercisesMeta.length;
      var html = mod.topicsHtml || '';
      totalCode += html.split('class="code-block"').length - 1;
      totalResults += html.split('class="result-wrap"').length - 1;
    });

    // Catálogo agrupado por categoría (sublenguaje). Una categoría sin
    // módulos todavía (DML, TCL, DCL) simplemente no se dibuja.
    var categoriesHtml = App.categories.map(function(cat){
      var mods = App.registryHelpers.byCategory(cat.id);
      if (!mods.length) return '';
      return '<div class="module-category" data-category="' + cat.id + '">' +
          '<div class="module-category__head">' +
            '<span class="module-category__abbr">' + cat.abbr + '</span>' +
            '<div class="module-category__title"><h3>' + cat.name + '</h3><p>' + cat.desc + '</p></div>' +
          '</div>' +
          '<div class="modules-grid">' + mods.map(moduleCardHtml).join('\n') + '</div>' +
        '</div>';
    }).join('');

    // Roadmap: mismo orden del registro, con un divisor cada vez que
    // cambia la categoría (los módulos ya están contiguos por categoría).
    var roadmapHtml = '';
    var lastCategory = null;
    registry.forEach(function(m){
      if (m.category !== lastCategory){
        roadmapHtml += roadmapDividerHtml(m.category);
        lastCategory = m.category;
      }
      roadmapHtml += roadmapNodeHtml(m, recommended.id);
    });

    var ctaHtml = allDone
      ? '<a class="btn btn-primary" href="#/modulo/' + recommended.id + '" data-route-link>' +
          '<svg aria-hidden="true"><use href="#i-check"/></svg> ¡Completaste los ' + registry.length + ' módulos! Repasar ' + recommended.title +
        '</a>'
      : '<a class="btn btn-primary" href="#/modulo/' + recommended.id + '" data-route-link>' +
          '<svg aria-hidden="true"><use href="#i-arrow"/></svg> Continuar en ' + recommended.title +
        '</a>';

    return '' +
    '<section class="dashboard" id="dashboard">' +
      '<div class="wrap">' +
        '<div class="dashboard-grid">' +
          '<div class="panel panel--glass welcome-panel reveal is-visible">' +
            '<span class="badge" style="margin-bottom:10px;">v1.0 · PostgreSQL 15+</span>' +
            '<h1>Aprende PostgreSQL paso a paso, de la teoría a la práctica</h1>' +
            '<p class="lead">SQL Atlas es una plataforma educativa que organiza PostgreSQL en módulos con definición, sintaxis, ejemplos y resultados ejecutados sobre una misma tabla de referencia, para que aprendas practicando.</p>' +
            '<div class="welcome-panel__actions">' +
              ctaHtml +
              '<a class="btn btn-secondary" href="#modulos" data-scroll="modulos">Ver catálogo de módulos</a>' +
            '</div>' +
            '<div class="meta-chips">' +
              '<div class="meta-chip"><span class="meta-chip__value">' + registry.length + '</span><span class="meta-chip__label">Módulos</span></div>' +
              '<div class="meta-chip"><span class="meta-chip__value">' + totalCode + '</span><span class="meta-chip__label">Consultas</span></div>' +
              '<div class="meta-chip"><span class="meta-chip__value">' + totalResults + '</span><span class="meta-chip__label">Ejemplos</span></div>' +
              '<div class="meta-chip"><span class="meta-chip__value">' + totalExercises + '</span><span class="meta-chip__label">Ejercicios</span></div>' +
              '<div class="meta-chip"><span class="meta-chip__value">15+</span><span class="meta-chip__label">Compatibilidad PG</span></div>' +
            '</div>' +
          '</div>' +
          '<div class="panel panel--glass progress-panel reveal is-visible">' +
            '<div class="progress-panel__head">' +
              '<h2>Tu progreso</h2>' +
              '<span class="badge"><span class="dot lvl-' + recommended.level + '"></span> Nivel ' + levelLabel(recommended.level).toLowerCase() + '</span>' +
            '</div>' +
            '<div class="progress-panel__pct" id="progressPctBig">0%</div>' +
            '<div class="progress-track progress-track--lg"><div class="progress-track__fill" id="progressFillBig" style="width:0%"></div></div>' +
            '<div class="progress-rows">' +
              '<div class="progress-row"><span>Módulo recomendado</span><span>' + recommended.title + '</span></div>' +
              '<div class="progress-row"><span>Temas completados</span><span id="progressTopicsDone">0/0</span></div>' +
              '<div class="progress-row"><span>Módulos completados</span><span>' + modulesCompleted + '/' + available.length + '</span></div>' +
              '<div class="progress-row"><span>Última actualización</span><span>Julio 2026</span></div>' +
            '</div>' +
            '<div class="progress-reset">' +
              '<button type="button" class="progress-reset__btn" id="resetProgressBtn">' +
                '<svg aria-hidden="true"><use href="#i-view-replace"/></svg> Reiniciar progreso' +
              '</button>' +
              '<span class="progress-reset__confirm" id="resetProgressConfirm" hidden>' +
                '¿Borrar todo tu avance? ' +
                '<button type="button" id="resetProgressYes">Sí, reiniciar</button>' +
                '<button type="button" id="resetProgressNo">Cancelar</button>' +
              '</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</section>' +

    '<section class="section" id="modulos">' +
      '<div class="wrap">' +
        '<div class="section-header reveal">' +
          '<span class="badge" style="margin-bottom:8px;">Contenido</span>' +
          '<h2>Catálogo de módulos</h2>' +
          '<p>Cada módulo comparte el mismo buscador, navegación y seguimiento de avance del resto de la plataforma.</p>' +
        '</div>' +
        '<div id="modulesGroups">' +
          categoriesHtml +
        '</div>' +
        '<p id="noModuleResults">No se encontraron módulos que coincidan con la búsqueda.</p>' +
      '</div>' +
    '</section>' +

    '<section class="section" id="ruta">' +
      '<div class="wrap">' +
        '<div class="section-header reveal">' +
          '<span class="badge" style="margin-bottom:8px;">Roadmap</span>' +
          '<h2>Ruta de aprendizaje</h2>' +
          '<p>El recorrido recomendado, de principio a fin. Cada etapa se desbloquea con la anterior.</p>' +
        '</div>' +
        '<div class="roadmap-scroll reveal">' +
          '<ol class="roadmap" style="list-style:none; margin:0; padding:4px 0 8px 0;">' +
            roadmapHtml +
          '</ol>' +
        '</div>' +
      '</div>' +
    '</section>' +

    '<section class="section" id="caracteristicas">' +
      '<div class="wrap">' +
        '<div class="section-header reveal">' +
          '<span class="badge" style="margin-bottom:8px;">Consejos de estudio</span>' +
          '<h2>Tips para aprender SQL de forma efectiva</h2>' +
          '<p>Pequeños hábitos que marcan la diferencia al estudiar bases de datos, y cómo SQL Atlas te acompaña en cada uno.</p>' +
        '</div>' +
        '<div class="features-grid reveal">' +
          '<div class="panel feature-item"><span class="feature-item__icon"><svg aria-hidden="true"><use href="#i-tip"/></svg></span><div><strong>Escribe, no solo leas</strong><span>Reproduce cada consulta por tu cuenta: usa el Playground para probar lo que ves en cada módulo.</span></div></div>' +
          '<div class="panel feature-item"><span class="feature-item__icon"><svg aria-hidden="true"><use href="#i-tip"/></svg></span><div><strong>Aprende en orden</strong><span>Sigue la ruta de aprendizaje: cada módulo se apoya en el anterior y se desbloquea al completarlo.</span></div></div>' +
          '<div class="panel feature-item"><span class="feature-item__icon"><svg aria-hidden="true"><use href="#i-tip"/></svg></span><div><strong>Entiende el porqué</strong><span>No memorices sintaxis: cada tema explica qué hace, cuándo usarlo y qué errores evitar.</span></div></div>' +
          '<div class="panel feature-item"><span class="feature-item__icon"><svg aria-hidden="true"><use href="#i-tip"/></svg></span><div><strong>Practica con datos reales</strong><span>Todos los ejemplos usan la misma tabla, así comparas resultados sin distracciones.</span></div></div>' +
          '<div class="panel feature-item"><span class="feature-item__icon"><svg aria-hidden="true"><use href="#i-tip"/></svg></span><div><strong>Equivócate sin miedo</strong><span>Los ejercicios se corrigen al instante y puedes reintentar cuantas veces necesites.</span></div></div>' +
          '<div class="panel feature-item"><span class="feature-item__icon"><svg aria-hidden="true"><use href="#i-tip"/></svg></span><div><strong>Repasa lo aprendido</strong><span>Marca cada tema como completado y vuelve fácilmente a los que aún no dominas.</span></div></div>' +
          '<div class="panel feature-item"><span class="feature-item__icon"><svg aria-hidden="true"><use href="#i-tip"/></svg></span><div><strong>Estudia en sesiones cortas</strong><span>Tu avance queda guardado: retoma justo donde lo dejaste sin perder el hilo.</span></div></div>' +
          '<div class="panel feature-item"><span class="feature-item__icon"><svg aria-hidden="true"><use href="#i-tip"/></svg></span><div><strong>Lee los resultados con calma</strong><span>Ver la salida esperada de cada consulta entrena tu intuición sobre qué devuelve SQL.</span></div></div>' +
          '<div class="panel feature-item"><span class="feature-item__icon"><svg aria-hidden="true"><use href="#i-tip"/></svg></span><div><strong>Aplica buenas prácticas</strong><span>Cada tema incluye una recomendación profesional que puedes llevar a proyectos reales.</span></div></div>' +
        '</div>' +
      '</div>' +
    '</section>';
  }

  /* Cablea comportamiento propio de esta vista: buscador del catálogo. */
  function afterRender(root){
    var searchInput = root.querySelector('#moduleSearchDashboard') || document.getElementById('moduleSearch');
    var cards = Array.prototype.slice.call(root.querySelectorAll('.module-card'));
    var noResults = root.querySelector('#noModuleResults');
    var groups = Array.prototype.slice.call(root.querySelectorAll('.module-category'));
    if (searchInput && cards.length){
      App.search.wire({
        input: searchInput,
        items: cards,
        getHaystack: function(card){ return (card.getAttribute('data-search') || '') + ' ' + card.querySelector('h3').textContent; },
        setVisible: function(card, visible){ card.hidden = !visible; },
        noResultsEl: noResults,
        // Oculta el encabezado de una categoría si ninguno de sus módulos coincide.
        onFilter: function(){
          groups.forEach(function(group){
            var anyVisible = Array.prototype.slice.call(group.querySelectorAll('.module-card'))
              .some(function(c){ return !c.hidden; });
            group.hidden = !anyVisible;
          });
        }
      });
    }
    App.progress.refreshDashboard(root);

    // ---- botón "Reiniciar progreso" (con confirmación en dos pasos) ----
    var resetBtn = root.querySelector('#resetProgressBtn');
    var resetConfirm = root.querySelector('#resetProgressConfirm');
    if (resetBtn && resetConfirm){
      resetBtn.addEventListener('click', function(){
        resetBtn.hidden = true;
        resetConfirm.hidden = false;
      });
      var noBtn = root.querySelector('#resetProgressNo');
      var yesBtn = root.querySelector('#resetProgressYes');
      if (noBtn) noBtn.addEventListener('click', function(){
        resetConfirm.hidden = true;
        resetBtn.hidden = false;
      });
      if (yesBtn) yesBtn.addEventListener('click', function(){
        App.state.clearAllProgress();
        // Se re-renderiza a través del router (en vez de a mano) para que
        // el dashboard quede exactamente igual que en una carga normal:
        // con el wrapper ".view" y la animación "reveal" activada. Hacerlo
        // a mano se saltaba App.reveal.observe() y dejaba el catálogo, el
        // roadmap y los consejos con opacidad 0 hasta salir y volver a entrar.
        App.router.navigate('/');
      });
    }
  }

  return { render: render, afterRender: afterRender };
})();
