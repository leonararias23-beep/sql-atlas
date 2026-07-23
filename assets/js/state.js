/* ============================================================
   ESTADO GLOBAL — única fachada sobre localStorage.
   Ninguna vista ni módulo debe leer/escribir localStorage
   directamente; todos pasan por App.state. Esto es lo que
   mantiene sincronizados el panel del dashboard, la tarjeta del
   catálogo y el sidebar del módulo sin código repetido.
   ============================================================ */
window.App = window.App || {};

App.state = (function(){
  var THEME_KEY = 'sqlDocsTheme';
  var PROGRESS_PREFIX = 'sqlDocsProgress:';
  var LEGACY_PROGRESS_KEY = 'sqlDocsCompleted'; // clave usada por la versión standalone anterior

  function readJSON(key, fallback){
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch(e){ return fallback; }
  }
  function writeJSON(key, value){
    try { localStorage.setItem(key, JSON.stringify(value)); } catch(e) {}
  }

  function getTheme(){
    var saved = null;
    try { saved = localStorage.getItem(THEME_KEY); } catch(e) {}
    if (!saved){
      saved = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
    }
    return saved;
  }
  function setTheme(theme){
    try { localStorage.setItem(THEME_KEY, theme); } catch(e) {}
  }

  function getCompletedTopics(moduleId){
    var key = PROGRESS_PREFIX + moduleId;
    var stored = readJSON(key, null);
    if (stored) return stored;
    // migración silenciosa desde la clave de la versión standalone (solo aplica a fundamentos-sql)
    if (moduleId === 'fundamentos-sql'){
      var legacy = readJSON(LEGACY_PROGRESS_KEY, null);
      if (legacy){ writeJSON(key, legacy); return legacy; }
    }
    return [];
  }
  function setCompletedTopics(moduleId, arr){
    writeJSON(PROGRESS_PREFIX + moduleId, arr);
  }
  function toggleTopic(moduleId, topicId, done){
    var completed = getCompletedTopics(moduleId);
    var idx = completed.indexOf(topicId);
    if (done && idx === -1) completed.push(topicId);
    if (!done && idx !== -1) completed.splice(idx, 1);
    setCompletedTopics(moduleId, completed);
    return completed;
  }

  /* Borra TODO el avance guardado (todos los módulos). Lo usa el botón
     "Reiniciar progreso" del panel del dashboard. No toca el tema
     (claro/oscuro). */
  function clearAllProgress(){
    try {
      Object.keys(localStorage).forEach(function(k){
        if (k.indexOf(PROGRESS_PREFIX) === 0 || k === LEGACY_PROGRESS_KEY){
          localStorage.removeItem(k);
        }
      });
    } catch(e) {}
  }

  return {
    getTheme: getTheme,
    setTheme: setTheme,
    getCompletedTopics: getCompletedTopics,
    setCompletedTopics: setCompletedTopics,
    toggleTopic: toggleTopic,
    clearAllProgress: clearAllProgress
  };
})();
