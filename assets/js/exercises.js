/* ============================================================
   EJERCICIOS PRÁCTICOS — motor genérico, sin backend. Cada módulo
   aporta únicamente datos (App.modules[id].exercisesMeta), con dos
   tipos posibles:

     { type:'mcq', id, prompt, options:[...], correct: <índice>, explanation }
     { type:'write', id, prompt, answers:[...aceptadas...], explanation, placeholder }

   Este archivo no sabe nada de un módulo en particular: renderSection()
   arma el HTML y wire() cablea la validación comparando contra la
   definición original (nunca contra el DOM), así que no hay datos
   sensibles que "adivinar" mirando el HTML generado.
   ============================================================ */
window.App = window.App || {};

App.exercises = (function(){

  function normalize(str){
    return String(str || '')
      .trim()
      .toLowerCase()
      .replace(/;+\s*$/, '')
      .replace(/\s+/g, ' ')
      .replace(/[`"]/g, "'");
  }

  function mcqCardHtml(ex, index){
    var optionsHtml = ex.options.map(function(opt, i){
      return '<label class="exercise-option">' +
        '<input type="radio" name="exercise-' + ex.id + '" value="' + i + '">' +
        '<span>' + opt + '</span>' +
      '</label>';
    }).join('');

    return '<div class="exercise-card" data-exercise-id="' + ex.id + '" data-exercise-type="mcq">' +
      '<div class="exercise-card__num">Ejercicio ' + (index + 1) + '</div>' +
      '<p class="exercise-card__prompt">' + ex.prompt + '</p>' +
      '<div class="exercise-options">' + optionsHtml + '</div>' +
      '<div class="exercise-actions">' +
        '<button type="button" class="btn btn-secondary" data-action="check">Verificar</button>' +
        '<button type="button" class="btn btn-ghost" data-action="reset" hidden>Reintentar</button>' +
      '</div>' +
      '<div class="exercise-feedback" hidden></div>' +
    '</div>';
  }

  function escapeHtml(s){
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function writeCardHtml(ex, index){
    // El placeholder NO revela la respuesta: se usa un texto genérico.
    // La solución (ex.placeholder / ex.answers) solo se muestra tras 3 intentos fallidos.
    return '<div class="exercise-card" data-exercise-id="' + ex.id + '" data-exercise-type="write">' +
      '<div class="exercise-card__num">Ejercicio ' + (index + 1) + '</div>' +
      '<p class="exercise-card__prompt">' + ex.prompt + '</p>' +
      '<input type="text" class="exercise-input" placeholder="Escribe tu respuesta…" autocomplete="off" spellcheck="false">' +
      '<div class="exercise-actions">' +
        '<button type="button" class="btn btn-secondary" data-action="check">Verificar</button>' +
        '<button type="button" class="btn btn-ghost" data-action="reset" hidden>Reintentar</button>' +
      '</div>' +
      '<div class="exercise-feedback" hidden></div>' +
    '</div>';
  }

  function renderSection(exercisesMeta){
    var cardsHtml = exercisesMeta.map(function(ex, i){
      return ex.type === 'write' ? writeCardHtml(ex, i) : mcqCardHtml(ex, i);
    }).join('');

    return '<section class="exercises-section" id="exercises" data-title="Ejercicios prácticos">' +
      '<div class="topic-head">' +
        '<div class="topic-head__left">' +
          '<svg class="topic-icon" aria-hidden="true"><use href="#i-tip"/></svg>' +
          '<h2>Ejercicios prácticos</h2>' +
        '</div>' +
      '</div>' +
      '<p class="def">Preguntas cortas para repasar este módulo. Se corrigen al instante en tu navegador; puedes reintentar cuantas veces quieras.</p>' +
      '<div class="exercise-list">' + cardsHtml + '</div>' +
    '</section>';
  }

  var MAX_ATTEMPTS = 3; // preguntas abiertas: la solución solo se revela tras 3 fallos

  function showFeedback(card, correct, explanation){
    var feedback = card.querySelector('.exercise-feedback');
    feedback.hidden = false;
    feedback.classList.toggle('is-correct', correct);
    feedback.classList.toggle('is-incorrect', !correct);
    feedback.innerHTML =
      '<svg aria-hidden="true"><use href="#' + (correct ? 'i-check' : 'i-warn') + '"/></svg>' +
      '<span><strong>' + (correct ? '¡Correcto!' : 'No es correcto.') + '</strong> ' + (explanation || '') + '</span>';
  }

  // Aviso de reintento SIN revelar la respuesta (preguntas abiertas, intentos 1 y 2).
  function showRetryHint(card, attemptsLeft){
    var feedback = card.querySelector('.exercise-feedback');
    feedback.hidden = false;
    feedback.classList.remove('is-correct');
    feedback.classList.add('is-incorrect');
    var restante = attemptsLeft === 1 ? 'te queda 1 intento' : 'te quedan ' + attemptsLeft + ' intentos';
    feedback.innerHTML =
      '<svg aria-hidden="true"><use href="#i-warn"/></svg>' +
      '<span><strong>Aún no es correcto.</strong> Revísalo e inténtalo otra vez: ' + restante +
      ' antes de ver la solución.</span>';
  }

  // Tras 3 fallos: se muestra la explicación y una respuesta válida de ejemplo.
  function showSolution(card, explanation, sample){
    var feedback = card.querySelector('.exercise-feedback');
    feedback.hidden = false;
    feedback.classList.remove('is-correct');
    feedback.classList.add('is-incorrect');
    var solHtml = sample ? '<br>Una respuesta válida es: <code>' + escapeHtml(sample) + '</code>' : '';
    feedback.innerHTML =
      '<svg aria-hidden="true"><use href="#i-warn"/></svg>' +
      '<span><strong>Solución.</strong> ' + (explanation || '') + solHtml + '</span>';
  }

  function wireCard(card, ex){
    var checkBtn = card.querySelector('[data-action="check"]');
    var resetBtn = card.querySelector('[data-action="reset"]');
    var attempts = 0;

    function setLocked(locked){
      if (ex.type === 'write'){
        card.querySelector('.exercise-input').disabled = locked;
      } else {
        Array.prototype.slice.call(card.querySelectorAll('input[type="radio"]')).forEach(function(r){ r.disabled = locked; });
      }
      checkBtn.hidden = locked;
      resetBtn.hidden = !locked;
    }

    checkBtn.addEventListener('click', function(){
      if (ex.type === 'write'){
        var value = normalize(card.querySelector('.exercise-input').value);
        if (!value) return;
        var correct = ex.answers.some(function(a){ return normalize(a) === value; });
        if (correct){
          attempts = 0;
          card.classList.add('is-solved');
          showFeedback(card, true, ex.explanation);
          setLocked(true);
          return;
        }
        // Respuesta incorrecta: contamos el intento y ocultamos la solución.
        attempts++;
        card.classList.remove('is-solved');
        if (attempts >= MAX_ATTEMPTS){
          var sample = ex.placeholder || (ex.answers && ex.answers[0]) || '';
          showSolution(card, ex.explanation, sample);
          setLocked(true); // ya puede reintentar desde cero con el botón Reintentar
        } else {
          showRetryHint(card, MAX_ATTEMPTS - attempts); // sigue editable para reintentar
        }
        return;
      }

      // Opción múltiple: comportamiento inmediato como antes.
      var picked = card.querySelector('input[type="radio"]:checked');
      if (!picked) return;
      var mcqCorrect = Number(picked.value) === ex.correct;
      card.classList.toggle('is-solved', mcqCorrect);
      showFeedback(card, mcqCorrect, ex.explanation);
      setLocked(true);
    });

    resetBtn.addEventListener('click', function(){
      attempts = 0;
      card.classList.remove('is-solved');
      if (ex.type === 'write'){
        card.querySelector('.exercise-input').value = '';
      } else {
        Array.prototype.slice.call(card.querySelectorAll('input[type="radio"]')).forEach(function(r){ r.checked = false; });
      }
      card.querySelector('.exercise-feedback').hidden = true;
      setLocked(false);
    });
  }

  function wire(root, exercisesMeta){
    var byId = {};
    exercisesMeta.forEach(function(ex){ byId[ex.id] = ex; });
    Array.prototype.slice.call(root.querySelectorAll('.exercise-card')).forEach(function(card){
      var ex = byId[card.getAttribute('data-exercise-id')];
      if (ex) wireCard(card, ex);
    });
  }

  return { renderSection: renderSection, wire: wire };
})();
