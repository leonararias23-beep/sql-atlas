/* ============================================================
   MÓDULO: Transacciones (TCL: Controlar transacciones)
   Único módulo del bloque TCL: agrupar operaciones para que se
   apliquen todas o ninguna. Retoma los avisos de "usa una
   transacción" que aparecieron en UPDATE y DELETE. Misma forma
   que el resto de módulos.
   ============================================================ */
(function(){
  'use strict';

  var TOPICS_META = [
    { id:'t1', num:'01', title:'Qué es una transacción', level:'intermedio', search:'transaccion atomicidad acid todo o nada unidad' },
    { id:'t2', num:'02', title:'BEGIN / COMMIT',         level:'intermedio', search:'begin commit confirmar iniciar transaccion autocommit' },
    { id:'t3', num:'03', title:'ROLLBACK',               level:'intermedio', search:'rollback deshacer revertir cancelar' },
    { id:'t4', num:'04', title:'SAVEPOINT',              level:'intermedio', search:'savepoint punto intermedio rollback to release parcial' },
    { id:'t5', num:'05', title:'Niveles de aislamiento', level:'avanzado',   search:'aislamiento isolation read committed repeatable read serializable concurrencia' }
  ];

  var HERO_HTML = `<header class="hero">
      <h1>Transacciones: todo o nada</h1>
      <p class="sub">En los módulos de <code>UPDATE</code> y <code>DELETE</code> apareció el consejo de "envolver el cambio en una transacción". Aquí lo desarrollamos: cómo agrupar varias operaciones para que se apliquen <strong>todas o ninguna</strong>, y cómo deshacerlas si algo sale mal. Ejemplos sobre <code>empleados</code> y <code>departamentos</code>.</p>
      <p style="margin:0 0 14px 0; font-size:12.5px; color:var(--ink-3);">Por Nelson Leonardo Páez Arias</p>
      <div class="hero__meta">
        <span><svg aria-hidden="true"><use href="#i-check"/></svg> <span id="heroCompletedCount">0/5</span> completados</span>
        <span><svg aria-hidden="true"><use href="#i-hash"/></svg> 5 temas</span>
        <span><svg aria-hidden="true"><use href="#i-result"/></svg> 2 tablas de referencia</span>
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
                <th>id<span class="type">serial</span></th>
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

  var TOPICS_HTML = `<!-- ============ 1. Qué es una transacción ============ -->
    <section class="topic" id="t1" data-title="Qué es una transacción" data-search="transaccion atomicidad acid todo o nada unidad">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">01</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-mod-transaction"/></svg>
          <h2>Qué es una transacción</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-intermedio"></span> Intermedio</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t1"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Una transacción agrupa varias operaciones en <strong>una sola unidad</strong>: o se aplican todas, o no se aplica ninguna.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Estructura</div>
            <div class="code-block"><pre class="code"><span class="k">BEGIN</span>;      <span class="c">-- inicia</span>
  <span class="c">-- varias operaciones</span>
<span class="k">COMMIT</span>;     <span class="c">-- confirma todo</span>
<span class="c">-- o ROLLBACK; para deshacer todo</span></pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo: mover presupuesto</div>
            <div class="code-block"><pre class="code"><span class="k">BEGIN</span>;
  <span class="k">UPDATE</span> departamentos <span class="k">SET</span> presupuesto = presupuesto - 5000000
    <span class="k">WHERE</span> nombre = <span class="s">'Tecnología'</span>;
  <span class="k">UPDATE</span> departamentos <span class="k">SET</span> presupuesto = presupuesto + 5000000
    <span class="k">WHERE</span> nombre = <span class="s">'Marketing'</span>;
<span class="k">COMMIT</span>;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> departamentos: los dos cambios se aplican juntos</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>nombre</th><th>presupuesto</th></tr></thead>
            <tbody>
              <tr><td>Tecnología</td><td>45 000 000</td></tr>
              <tr><td>Marketing</td><td>23 000 000</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Si algo falla entre los dos <code>UPDATE</code>, ninguno queda aplicado: el presupuesto nunca desaparece a medio camino.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Operaciones que deben cuadrar juntas: transferencias, reservas, cualquier cambio en varias tablas que deba quedar consistente.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Dejar la transacción abierta sin <code>COMMIT</code> ni <code>ROLLBACK</code>: mantiene bloqueos y puede frenar a otras sesiones.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Transacciones cortas: agrupa solo lo que de verdad debe ser atómico y confírmalas rápido.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> las transacciones cumplen las propiedades <strong>ACID</strong>: Atomicidad, Consistencia, Aislamiento y Durabilidad. Son las garantías que hacen confiable una base relacional.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <span></span>
          <a class="next" data-route-link href="#/modulo/transacciones/t2"><small>Siguiente</small><strong>BEGIN / COMMIT →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 2. BEGIN / COMMIT ============ -->
    <section class="topic" id="t2" data-title="BEGIN / COMMIT" data-search="begin commit confirmar iniciar transaccion autocommit">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">02</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-do"/></svg>
          <h2>BEGIN / COMMIT</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-intermedio"></span> Intermedio</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t2"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def"><code>BEGIN</code> abre la transacción; <code>COMMIT</code> confirma y hace <strong>permanentes</strong> todos sus cambios.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">BEGIN</span>;
  <span class="c">-- operaciones</span>
<span class="k">COMMIT</span>;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">BEGIN</span>;
  <span class="k">UPDATE</span> empleados <span class="k">SET</span> salario = salario * 1.05
    <span class="k">WHERE</span> cargo = <span class="s">'Analista'</span>;
<span class="k">COMMIT</span>;</pre></div>
          </div>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Hasta el <code>COMMIT</code>, los cambios solo los ve tu sesión; tras confirmarlos, son visibles para todos y duraderos.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Siempre que quieras controlar de forma explícita el momento en que un conjunto de cambios se vuelve definitivo.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Olvidar el <code>COMMIT</code>: la transacción queda abierta, reteniendo bloqueos y sin guardar nada de forma definitiva.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Confirmar cuanto antes libera los bloqueos y deja avanzar a las demás sesiones.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> sin <code>BEGIN</code>, PostgreSQL ejecuta cada instrucción en su propia transacción (<em>autocommit</em>): un <code>INSERT</code> suelto ya es atómico por sí mismo.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/transacciones/t1"><small>Anterior</small><strong>← Qué es una transacción</strong></a>
          <a class="next" data-route-link href="#/modulo/transacciones/t3"><small>Siguiente</small><strong>ROLLBACK →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 3. ROLLBACK ============ -->
    <section class="topic" id="t3" data-title="ROLLBACK" data-search="rollback deshacer revertir cancelar">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">03</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-view-replace"/></svg>
          <h2>ROLLBACK</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-intermedio"></span> Intermedio</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t3"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Descarta <strong>todos</strong> los cambios hechos desde el <code>BEGIN</code>, como si nunca hubieran ocurrido.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">BEGIN</span>;
  <span class="c">-- operaciones</span>
<span class="k">ROLLBACK</span>;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">BEGIN</span>;
  <span class="k">DELETE FROM</span> empleados;   <span class="c">-- ¡borré todo por error!</span>
<span class="k">ROLLBACK</span>;                  <span class="c">-- deshecho: la tabla vuelve</span></pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> empleados: el ROLLBACK restauró las 7 filas</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>id</th><th>nombre</th><th>cargo</th></tr></thead>
            <tbody>
              <tr><td>1</td><td>Ana Torres</td><td>Ingeniera de Datos</td></tr>
              <tr><td>…</td><td>… (todas siguen ahí)</td><td>…</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Revierte por completo el bloque: la base queda tal como estaba antes del <code>BEGIN</code>.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Cuando algo salió mal, o incluso para "ensayar" un cambio peligroso y luego deshacerlo.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Creer que se puede hacer <code>ROLLBACK</code> después de un <code>COMMIT</code>: una vez confirmado, ya no hay vuelta atrás.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Usa <code>BEGIN … ROLLBACK</code> para probar consultas de riesgo (un <code>DELETE</code> grande) sin comprometerte.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> si una instrucción dentro de la transacción da error, PostgreSQL la aborta y solo acepta <code>ROLLBACK</code> hasta que la cierres.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/transacciones/t2"><small>Anterior</small><strong>← BEGIN / COMMIT</strong></a>
          <a class="next" data-route-link href="#/modulo/transacciones/t4"><small>Siguiente</small><strong>SAVEPOINT →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 4. SAVEPOINT ============ -->
    <section class="topic" id="t4" data-title="SAVEPOINT" data-search="savepoint punto intermedio rollback to release parcial">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">04</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-flag"/></svg>
          <h2>SAVEPOINT</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-intermedio"></span> Intermedio</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t4"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Marca un <strong>punto intermedio</strong> dentro de la transacción para deshacer solo una parte, sin cancelarla entera.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">BEGIN</span>;
  <span class="c">-- ...</span>
  <span class="k">SAVEPOINT</span> punto1;
  <span class="c">-- ...</span>
  <span class="k">ROLLBACK TO</span> punto1;  <span class="c">-- vuelve al punto</span>
<span class="k">COMMIT</span>;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">BEGIN</span>;
  <span class="k">UPDATE</span> empleados <span class="k">SET</span> salario = salario + 100000
    <span class="k">WHERE</span> id = 1;
  <span class="k">SAVEPOINT</span> antes_borrar;
  <span class="k">DELETE FROM</span> empleados <span class="k">WHERE</span> id = 2;
  <span class="k">ROLLBACK TO</span> antes_borrar; <span class="c">-- deshace el DELETE</span>
<span class="k">COMMIT</span>;  <span class="c">-- conserva el UPDATE</span></pre></div>
          </div>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Permite retroceder hasta el savepoint (deshaciendo el <code>DELETE</code>) mientras conserva lo hecho antes (el <code>UPDATE</code>).</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Transacciones largas donde un paso puede fallar sin que quieras abortar todo lo anterior.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Confundir <code>ROLLBACK</code> (deshace toda la transacción) con <code>ROLLBACK TO savepoint</code> (deshace solo hasta ese punto).</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Nombrar los savepoints de forma descriptiva y liberarlos con <code>RELEASE SAVEPOINT</code> cuando ya no hacen falta.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> el savepoint no confirma nada por sí mismo; todo sigue dependiendo del <code>COMMIT</code> o <code>ROLLBACK</code> final de la transacción.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/transacciones/t3"><small>Anterior</small><strong>← ROLLBACK</strong></a>
          <a class="next" data-route-link href="#/modulo/transacciones/t5"><small>Siguiente</small><strong>Niveles de aislamiento →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 5. Niveles de aislamiento ============ -->
    <section class="topic" id="t5" data-title="Niveles de aislamiento" data-search="aislamiento isolation read committed repeatable read serializable concurrencia">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">05</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-lock"/></svg>
          <h2>Niveles de aislamiento</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-avanzado"></span> Avanzado</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t5"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Definen qué cambios de <strong>otras transacciones en curso</strong> puede ver la tuya. Controlan el equilibrio entre consistencia y concurrencia.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">BEGIN</span> <span class="k">ISOLATION LEVEL</span> <span class="k">REPEATABLE READ</span>;
  <span class="c">-- consultas con una foto estable</span>
<span class="k">COMMIT</span>;</pre></div>
          </div>
          <div>
            <div class="block-label">Los tres niveles usuales</div>
            <div class="code-block"><pre class="code"><span class="k">READ COMMITTED</span>   <span class="c">-- por defecto</span>
<span class="k">REPEATABLE READ</span>  <span class="c">-- foto fija del inicio</span>
<span class="k">SERIALIZABLE</span>     <span class="c">-- como si fueran en serie</span></pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Qué ve cada nivel</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>nivel</th><th>qué garantiza</th></tr></thead>
            <tbody>
              <tr><td>READ COMMITTED</td><td>Cada consulta ve lo confirmado hasta ese instante</td></tr>
              <tr><td>REPEATABLE READ</td><td>Toda la transacción ve una foto fija del inicio</td></tr>
              <tr><td>SERIALIZABLE</td><td>Como si las transacciones corrieran una tras otra</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Controla fenómenos de concurrencia como lecturas no repetibles o filas "fantasma" que aparecen entre consultas.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Reportes que deben cuadrar (<code>REPEATABLE READ</code>) u operaciones críticas que no toleran conflictos (<code>SERIALIZABLE</code>).</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Subir el nivel sin necesidad: reduce la concurrencia y aumenta los conflictos que obligan a reintentar.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p><code>READ COMMITTED</code> (el nivel por defecto) cubre bien la mayoría de las aplicaciones.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> a mayor aislamiento, más consistencia pero más probabilidad de conflictos; en <code>SERIALIZABLE</code> conviene preparar la aplicación para reintentar transacciones abortadas.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/transacciones/t4"><small>Anterior</small><strong>← SAVEPOINT</strong></a>
          <span></span>
        </nav>
      </div>
    </section>`;

  var EXERCISES_META = [
    {
      id: 'ex1',
      type: 'mcq',
      prompt: '¿Qué garantiza una transacción?',
      options: ['Que todas sus operaciones se apliquen o ninguna (atomicidad)', 'Que las consultas sean más rápidas', 'Que no se usen índices', 'Que los datos se ordenen solos'],
      correct: 0,
      explanation: 'La atomicidad es el corazón de una transacción: el conjunto de operaciones es "todo o nada".'
    },
    {
      id: 'ex2',
      type: 'mcq',
      prompt: '¿Qué hace COMMIT?',
      options: ['Confirma y hace permanentes los cambios de la transacción', 'Deshace los cambios', 'Abre la transacción', 'Crea una tabla'],
      correct: 0,
      explanation: 'COMMIT cierra la transacción confirmando todo lo hecho; a partir de ahí los cambios son visibles y duraderos.'
    },
    {
      id: 'ex3',
      type: 'mcq',
      prompt: '¿Qué hace ROLLBACK?',
      options: ['Deshace todos los cambios hechos desde el BEGIN', 'Los confirma', 'Borra la base de datos', 'Acelera la transacción'],
      correct: 0,
      explanation: 'ROLLBACK revierte la transacción entera, dejando la base como estaba antes de empezar.'
    },
    {
      id: 'ex4',
      type: 'write',
      prompt: 'Escribe el comando que inicia una transacción.',
      placeholder: 'BEGIN',
      answers: ['begin', 'begin transaction', 'start transaction'],
      explanation: 'BEGIN (o START TRANSACTION) abre una transacción; luego se cierra con COMMIT o ROLLBACK.'
    },
    {
      id: 'ex5',
      type: 'mcq',
      prompt: '¿Para qué sirve un SAVEPOINT?',
      options: ['Para deshacer solo una parte de la transacción sin cancelarla entera', 'Para acelerar la consulta', 'Para crear una tabla', 'Para confirmar los cambios'],
      correct: 0,
      explanation: 'Un SAVEPOINT permite hacer ROLLBACK TO ese punto, deshaciendo lo posterior y conservando lo anterior.'
    }
  ];

  window.App = window.App || {};
  window.App.modules = window.App.modules || {};
  window.App.modules['transacciones'] = {
    id: 'transacciones',
    topicsMeta: TOPICS_META,
    heroHtml: HERO_HTML,
    schemaHtml: SCHEMA_HTML,
    topicsHtml: TOPICS_HTML,
    exercisesMeta: EXERCISES_META
  };

})();
