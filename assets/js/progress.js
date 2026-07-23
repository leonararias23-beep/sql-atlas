/* ============================================================
   PROGRESO — calcula porcentajes desde App.state y actualiza
   cualquier widget presente en el DOM actual (chips, anillo,
   barra, checkboxes). Se llama después de cada render de vista.
   ============================================================ */
window.App = window.App || {};

App.progress = (function(){
  var RING_CIRCUM = 56.5;

  function moduleCompletion(moduleId){
    var meta = App.registryHelpers.get(moduleId);
    var total = meta ? meta.topicsCount : 0;
    var completed = App.state.getCompletedTopics(moduleId).length;
    var pct = total ? Math.round((completed / total) * 100) : 0;
    return { completed: completed, total: total, pct: pct };
  }

  /* Suma el avance de todos los módulos disponibles: usado en el
     panel de bienvenida del dashboard. Preparado para crecer solo
     con agregar módulos "available" al registro. */
  function overallCompletion(){
    var available = App.registryHelpers.available();
    var totalTopics = 0, totalDone = 0;
    available.forEach(function(m){
      var c = moduleCompletion(m.id);
      totalTopics += c.total;
      totalDone += c.completed;
    });
    var pct = totalTopics ? Math.round((totalDone / totalTopics) * 100) : 0;
    return { completed: totalDone, total: totalTopics, pct: pct, modulesAvailable: available.length };
  }

  /* Próximo módulo a recomendar en el panel de bienvenida y en el
     roadmap ("estás aquí"): el primero, en el orden de la ruta, que
     esté desbloqueado y todavía no esté al 100%. Antes del bloqueo
     progresivo esto siempre apuntaba al primer módulo disponible sin
     importar cuánto se hubiera avanzado; ahora sigue el progreso real.
     Si ya todo está completo, recomienda repasar el último módulo. */
  function nextRecommended(){
    var available = App.registryHelpers.available();
    for (var i = 0; i < available.length; i++){
      var m = available[i];
      if (!App.registryHelpers.isUnlocked(m.id)) continue;
      if (moduleCompletion(m.id).pct < 100) return m;
    }
    return available.length ? available[available.length - 1] : null;
  }

  /* Refresca los widgets de progreso en la vista Dashboard */
  function refreshDashboard(root){
    root = root || document;
    var overall = overallCompletion();

    var pctBig = root.querySelector('#progressPctBig');
    var fillBig = root.querySelector('#progressFillBig');
    var topicsDone = root.querySelector('#progressTopicsDone');
    if (pctBig) pctBig.textContent = overall.pct + '%';
    if (fillBig) fillBig.style.width = overall.pct + '%';
    if (topicsDone) topicsDone.textContent = overall.completed + '/' + overall.total;

    App.registryHelpers.available().forEach(function(m){
      var c = moduleCompletion(m.id);
      var label = root.querySelector('[data-card-progress-label="' + m.id + '"]');
      var fill = root.querySelector('[data-card-progress-fill="' + m.id + '"]');
      if (label) label.textContent = c.completed + '/' + c.total;
      if (fill) fill.style.width = c.pct + '%';
    });
  }

  /* Refresca los widgets de progreso dentro de la vista de un módulo:
     anillo del sidebar, contador del hero, check-marks del índice y
     el estado de los checkboxes "marcar como completado". */
  function refreshModule(root, moduleId){
    root = root || document;
    var c = moduleCompletion(moduleId);
    var completedIds = App.state.getCompletedTopics(moduleId);

    var ringFill = root.querySelector('#ringFill');
    var pctEl = root.querySelector('#progressPct');
    var heroCount = root.querySelector('#heroCompletedCount');
    if (pctEl) pctEl.textContent = c.pct + '%';
    if (ringFill) ringFill.style.strokeDashoffset = RING_CIRCUM - (c.pct / 100) * RING_CIRCUM;
    if (heroCount) heroCount.textContent = c.completed + '/' + c.total;

    Array.prototype.slice.call(root.querySelectorAll('[data-topic-check]')).forEach(function(cb){
      var id = cb.getAttribute('data-topic-check');
      cb.checked = completedIds.indexOf(id) !== -1;
      var navLink = root.querySelector('nav.side a[href$="/' + id + '"]');
      if (navLink) navLink.classList.toggle('is-done', cb.checked);
    });
  }

  return {
    moduleCompletion: moduleCompletion,
    overallCompletion: overallCompletion,
    nextRecommended: nextRecommended,
    refreshDashboard: refreshDashboard,
    refreshModule: refreshModule
  };
})();
