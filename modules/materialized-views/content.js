/* ============================================================
   MÓDULO: Materialized Views
   Misma forma que los módulos anteriores. Contrasta explícitamente
   con modules/vistas: aquí los datos sí se copian físicamente y
   hay que refrescarlos a mano, justo lo contrario de lo que se
   remarcó en el módulo anterior.
   ============================================================ */
(function(){
  'use strict';

  var TOPICS_META = [
    { id:'t1', num:'01', title:'CREATE MATERIALIZED VIEW',        level:'intermedio', search:'create materialized view crear vista materializada' },
    { id:'t2', num:'02', title:'Vista normal vs. materializada',  level:'avanzado',   search:'diferencia snapshot foto actualizada' },
    { id:'t3', num:'03', title:'REFRESH MATERIALIZED VIEW',       level:'intermedio', search:'refresh actualizar vista materializada' },
    { id:'t4', num:'04', title:'REFRESH CONCURRENTLY',            level:'avanzado',   search:'refresh concurrently indice unico bloqueo' }
  ];

  var HERO_HTML = `<header class="hero">
      <h1>Materialized Views: vistas con datos propios</h1>
      <p class="sub">A diferencia de las vistas normales del módulo anterior, una vista materializada sí guarda una copia física del resultado. Eso la hace rápida de consultar, pero exige refrescarla a mano. Sigue usando <code>empleados</code> y <code>departamentos</code>.</p>
      <p style="margin:0 0 14px 0; font-size:12.5px; color:var(--ink-3);">Por Nelson Leonardo Páez Arias</p>
      <div class="hero__meta">
        <span><svg aria-hidden="true"><use href="#i-check"/></svg> <span id="heroCompletedCount">0/4</span> completados</span>
        <span><svg aria-hidden="true"><use href="#i-hash"/></svg> 4 temas</span>
        <span><svg aria-hidden="true"><use href="#i-result"/></svg> 2 tablas relacionadas</span>
      </div>
    </header>`;

  var SCHEMA_HTML = `<div id="schemaTable">
      <div class="schema">
        <div class="schema-head">
          <span>tabla base &nbsp;<span class="tag">empleados</span></span>
          <span class="tag">7 filas</span>
        </div>
        <div class="schema-scroll">
          <table class="data">
            <thead>
              <tr>
                <th>id<span class="type">integer</span></th>
                <th>nombre<span class="type">text</span></th>
                <th>cargo<span class="type">text</span></th>
                <th>salario<span class="type">numeric</span></th>
                <th>departamento_id<span class="type">integer</span></th>
              </tr>
            </thead>
            <tbody>
              <tr><td>1</td><td>Ana Torres</td><td>Ingeniera de Datos</td><td>4 200 000</td><td>1</td></tr>
              <tr><td>2</td><td>Luis Gómez</td><td>Analista</td><td>3 100 000</td><td>2</td></tr>
              <tr><td>3</td><td>Marta Ruiz</td><td>Ingeniera de Datos</td><td>4 500 000</td><td>1</td></tr>
              <tr><td>4</td><td>Pedro Sánchez</td><td>Analista Junior</td><td>2 600 000</td><td>2</td></tr>
              <tr><td>5</td><td>Carla Díaz</td><td>Gerente</td><td>6 800 000</td><td class="null">NULL</td></tr>
              <tr><td>6</td><td>Jorge Peña</td><td>Analista</td><td>3 100 000</td><td>2</td></tr>
              <tr><td>7</td><td>Sofía León</td><td>Ingeniera de Datos</td><td>4 200 000</td><td>1</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="schema">
        <div class="schema-head">
          <span>tabla relacionada &nbsp;<span class="tag">departamentos</span></span>
          <span class="tag">4 filas</span>
        </div>
        <div class="schema-scroll">
          <table class="data">
            <thead>
              <tr>
                <th>id<span class="type">integer</span></th>
                <th>nombre<span class="type">text</span></th>
                <th>presupuesto<span class="type">numeric</span></th>
              </tr>
            </thead>
            <tbody>
              <tr><td>1</td><td>Tecnología</td><td>50 000 000</td></tr>
              <tr><td>2</td><td>Comercial</td><td>30 000 000</td></tr>
              <tr><td>3</td><td>Recursos Humanos</td><td>12 000 000</td></tr>
              <tr><td>4</td><td>Marketing</td><td>18 000 000</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>`;

  var TOPICS_HTML = `<!-- ============ 1. CREATE MATERIALIZED VIEW ============ -->
    <section class="topic" id="t1" data-title="CREATE MATERIALIZED VIEW" data-search="create materialized view crear vista materializada">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">01</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-mod-mvistas"/></svg>
          <h2>CREATE MATERIALIZED VIEW</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-intermedio"></span> Intermedio</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t1"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Crea una vista que <strong>ejecuta la consulta una vez</strong> y guarda el resultado como datos físicos, listos para leerse sin recalcular nada.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">CREATE MATERIALIZED VIEW</span> nombre <span class="k">AS</span>
<span class="k">SELECT</span> ...;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">CREATE MATERIALIZED VIEW</span> resumen_departamentos <span class="k">AS</span>
<span class="k">SELECT</span> d.nombre <span class="k">AS</span> departamento,
       <span class="k">COUNT</span>(e.id) <span class="k">AS</span> cantidad_empleados,
       <span class="k">ROUND</span>(<span class="k">AVG</span>(e.salario)) <span class="k">AS</span> salario_promedio
<span class="k">FROM</span> departamentos d
<span class="k">LEFT JOIN</span> empleados e <span class="k">ON</span> e.departamento_id = d.id
<span class="k">GROUP BY</span> d.nombre
<span class="k">ORDER BY</span> d.nombre;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Contenido guardado en la vista materializada</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>departamento</th><th>cantidad_empleados</th><th>salario_promedio</th></tr></thead>
            <tbody>
              <tr><td>Comercial</td><td>3</td><td>2 933 333</td></tr>
              <tr><td>Marketing</td><td>0</td><td class="null">NULL</td></tr>
              <tr><td>Recursos Humanos</td><td>0</td><td class="null">NULL</td></tr>
              <tr><td>Tecnología</td><td>3</td><td>4 300 000</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Ejecuta el GROUP BY con el JOIN una sola vez y guarda estas 4 filas como datos reales, ocupando espacio en disco igual que una tabla.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Cuando la consulta es costosa (muchos JOIN, agregaciones sobre tablas grandes) y no hace falta el dato al segundo: reportes diarios, dashboards, resúmenes históricos.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Usarla para datos que cambian todo el tiempo y deben verse siempre actualizados: ahí una vista normal (o consultar la tabla directamente) es más apropiado.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Reservar CREATE MATERIALIZED VIEW para consultas que de verdad tardan y se repiten mucho; para consultas rápidas, una vista normal alcanza y evita el trabajo de mantenerla actualizada.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> Marketing y Recursos Humanos aparecen con 0 empleados y NULL de promedio; AVG ignora filas sin valor, y aquí no hay ninguna fila de empleados que aportar.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <span></span>
          <a class="next" data-route-link href="#/modulo/materialized-views/t2"><small>Siguiente</small><strong>Vista normal vs. materializada →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 2. Vista normal vs. materializada ============ -->
    <section class="topic" id="t2" data-title="Vista normal vs. materializada" data-search="diferencia snapshot foto actualizada">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">02</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-scale"/></svg>
          <h2>Vista normal vs. materializada</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-avanzado"></span> Avanzado</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t2"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">La diferencia no es de sintaxis: es de <strong>cuándo se calculan los datos</strong>. Una vista normal siempre refleja el presente; una materializada refleja el momento de su último REFRESH.</p>
        <div class="grid2">
          <div>
            <div class="block-label">El cambio que ocurre</div>
            <div class="code-block"><pre class="code"><span class="k">INSERT INTO</span> empleados (nombre, cargo, salario, departamento_id)
<span class="k">VALUES</span> (<span class="s">'Diego Rojas'</span>, <span class="s">'Analista'</span>, 3500000, 2);</pre></div>
          </div>
          <div>
            <div class="block-label">Ambas consultadas justo después, sin REFRESH</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> * <span class="k">FROM</span> vista_normal <span class="k">WHERE</span> departamento = <span class="s">'Comercial'</span>;
<span class="k">SELECT</span> * <span class="k">FROM</span> resumen_departamentos <span class="k">WHERE</span> departamento = <span class="s">'Comercial'</span>;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Comercial, después del INSERT, antes de cualquier REFRESH</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>fuente</th><th>cantidad_empleados</th><th>salario_promedio</th></tr></thead>
            <tbody>
              <tr><td>Vista normal (recalcula siempre)</td><td>4</td><td>3 075 000</td></tr>
              <tr><td>Vista materializada (sin refrescar)</td><td>3</td><td>2 933 333</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>La vista normal vuelve a ejecutar su SELECT en cada consulta, así que ve a Diego Rojas de inmediato. La materializada muestra los datos "congelados" desde su creación, ignorando el INSERT.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Elegir según qué tan tolerante es el caso de uso a datos "un poco viejos": un dashboard gerencial diario tolera esto; un saldo de cuenta bancaria, no.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Olvidar por completo que la vista materializada quedó desactualizada, y tomar decisiones sobre números que ya no reflejan la realidad.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Documentar (o mostrar en el propio dashboard) la fecha del último REFRESH, para que quien lea los datos sepa qué tan recientes son.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> esta es exactamente la contrapartida de lo que se remarcó en el módulo de Vistas: ahí insistí en que una vista normal "nunca guarda una foto fija"; una vista materializada es justo eso, una foto fija hasta el próximo REFRESH.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/materialized-views/t1"><small>Anterior</small><strong>← CREATE MATERIALIZED VIEW</strong></a>
          <a class="next" data-route-link href="#/modulo/materialized-views/t3"><small>Siguiente</small><strong>REFRESH MATERIALIZED VIEW →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 3. REFRESH MATERIALIZED VIEW ============ -->
    <section class="topic" id="t3" data-title="REFRESH MATERIALIZED VIEW" data-search="refresh actualizar vista materializada">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">03</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-view-replace"/></svg>
          <h2>REFRESH MATERIALIZED VIEW</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-intermedio"></span> Intermedio</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t3"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def"><strong>Vuelve a ejecutar</strong> la consulta guardada y reemplaza los datos de la vista materializada con el resultado actual.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">REFRESH MATERIALIZED VIEW</span> nombre;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">REFRESH MATERIALIZED VIEW</span> resumen_departamentos;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Comercial, después del REFRESH</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>departamento</th><th>cantidad_empleados</th><th>salario_promedio</th></tr></thead>
            <tbody>
              <tr><td>Comercial</td><td>4</td><td>3 075 000</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Descarta los datos guardados y los reemplaza con el resultado fresco de la consulta original; ahora Comercial ya refleja a Diego Rojas.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Según qué tan frecuente deba estar actualizada: puede dispararse manualmente, con un cron job, o desde un trigger en la aplicación tras cargas masivas de datos.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Por defecto, REFRESH MATERIALIZED VIEW bloquea las lecturas de la vista mientras se ejecuta: en una vista grande, eso puede significar varios segundos u horas sin poder consultarla.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Programar el REFRESH en horarios de bajo tráfico si la vista es pesada, o usar CONCURRENTLY (siguiente tema) cuando no se puede permitir ese bloqueo.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> mientras dura el REFRESH, cualquier intento de leer la vista materializada queda en espera hasta que termine; esta es la razón de ser del siguiente tema.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/materialized-views/t2"><small>Anterior</small><strong>← Vista normal vs. materializada</strong></a>
          <a class="next" data-route-link href="#/modulo/materialized-views/t4"><small>Siguiente</small><strong>REFRESH CONCURRENTLY →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 4. REFRESH CONCURRENTLY ============ -->
    <section class="topic" id="t4" data-title="REFRESH CONCURRENTLY" data-search="refresh concurrently indice unico bloqueo">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">04</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-unlock"/></svg>
          <h2>REFRESH CONCURRENTLY</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-avanzado"></span> Avanzado</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t4"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Actualiza la vista materializada <strong>sin bloquear</strong> a quienes la estén consultando al mismo tiempo. Requiere preparación adicional.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">CREATE UNIQUE INDEX</span> nombre_indice <span class="k">ON</span> vista (columna_unica);
<span class="k">REFRESH MATERIALIZED VIEW CONCURRENTLY</span> vista;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">CREATE UNIQUE INDEX</span> resumen_departamentos_idx
  <span class="k">ON</span> resumen_departamentos (departamento);

<span class="k">REFRESH MATERIALIZED VIEW CONCURRENTLY</span> resumen_departamentos;</pre></div>
          </div>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>En vez de reemplazar todo de golpe, PostgreSQL calcula el nuevo resultado aparte y actualiza solo las filas que cambiaron, usando el índice único para identificarlas; mientras tanto, las lecturas siguen viendo la versión anterior.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Vistas materializadas grandes que se consultan constantemente (por ejemplo, desde una aplicación web en producción) y no pueden quedar bloqueadas durante el REFRESH.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Intentar usar CONCURRENTLY sin haber creado antes un índice único sobre la vista: PostgreSQL lo rechaza con un error explícito pidiendo ese índice.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Elegir como columna del índice único una que de verdad identifique cada fila sin repetirse (aquí, "departamento"); si la vista pudiera tener departamentos repetidos, este ejemplo no calificaría para CONCURRENTLY.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> CONCURRENTLY suele tardar más que un REFRESH normal (hace más trabajo de comparación), así que es un cambio de "más lento pero sin bloqueo" a cambio de "más rápido pero bloqueante"; se elige según qué le duele más a cada sistema.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/materialized-views/t3"><small>Anterior</small><strong>← REFRESH MATERIALIZED VIEW</strong></a>
          <span></span>
        </nav>
      </div>
    </section>`;

  var EXERCISES_META = [
    {
      id: 'ex1',
      type: 'mcq',
      prompt: '¿Cuál es la diferencia principal entre una vista normal y una vista materializada?',
      options: ['No hay diferencia real', 'La materializada guarda una copia física de los datos calculados en el momento de crearla o refrescarla', 'La materializada no puede usar JOIN', 'La vista normal siempre es más lenta'],
      correct: 1,
      explanation: 'La vista materializada ejecuta la consulta una vez y guarda el resultado como datos reales; la vista normal recalcula todo en cada consulta.'
    },
    {
      id: 'ex2',
      type: 'write',
      prompt: 'Escribe el comando para actualizar los datos guardados en una vista materializada llamada <code>resumen_departamentos</code>.',
      placeholder: 'REFRESH MATERIALIZED VIEW resumen_departamentos',
      answers: ['refresh materialized view resumen_departamentos'],
      explanation: 'REFRESH MATERIALIZED VIEW vuelve a ejecutar la consulta original y reemplaza los datos guardados con el resultado actual.'
    },
    {
      id: 'ex3',
      type: 'mcq',
      prompt: 'Si se inserta una fila nueva en <code>empleados</code> después de crear una vista materializada, ¿qué verá una consulta inmediata a esa vista?',
      options: ['Los datos actualizados de inmediato', 'Los datos tal como estaban en la creación o el último REFRESH', 'Un error de sincronización', 'La fila nueva, pero sin recalcular los totales'],
      correct: 1,
      explanation: 'La vista materializada no reacciona a cambios en las tablas de origen: sigue mostrando el snapshot guardado hasta que se ejecute un REFRESH.'
    },
    {
      id: 'ex4',
      type: 'mcq',
      prompt: '¿Qué se necesita como requisito previo para poder usar <code>REFRESH MATERIALIZED VIEW CONCURRENTLY</code>?',
      options: ['Nada especial', 'Un índice único sobre la vista materializada', 'Que la vista no use JOIN', 'Permisos de superusuario'],
      correct: 1,
      explanation: 'PostgreSQL exige un índice único sobre la vista materializada para poder identificar qué filas cambiaron sin bloquear a los lectores durante el proceso.'
    },
    {
      id: 'ex5',
      type: 'mcq',
      prompt: '¿Qué ventaja ofrece REFRESH CONCURRENTLY frente a un REFRESH normal?',
      options: ['Es siempre más rápido', 'Permite seguir consultando la vista mientras se actualiza, sin bloquear a los lectores', 'Se ejecuta automáticamente sin necesidad de invocarlo', 'No requiere espacio en disco adicional'],
      correct: 1,
      explanation: 'CONCURRENTLY evita bloquear las lecturas durante el refresco, a cambio de ser generalmente más lento que un REFRESH normal.'
    }
  ];

  window.App = window.App || {};
  window.App.modules = window.App.modules || {};
  window.App.modules['materialized-views'] = {
    id: 'materialized-views',
    topicsMeta: TOPICS_META,
    heroHtml: HERO_HTML,
    schemaHtml: SCHEMA_HTML,
    topicsHtml: TOPICS_HTML,
    exercisesMeta: EXERCISES_META
  };

})();
