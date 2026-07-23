/* ============================================================
   MÓDULO: Funciones de ventana (DQL: Consultar datos)
   Cálculos sobre conjuntos de filas relacionadas SIN colapsarlas:
   OVER, PARTITION BY, ranking, acumulados y LAG/LEAD. El módulo
   más avanzado de DQL. Resultados simulados.
   ============================================================ */
(function(){
  'use strict';

  var TOPICS_META = [
    { id:'t1', num:'01', title:'OVER()',                 level:'avanzado', search:'over funcion de ventana window sin agrupar' },
    { id:'t2', num:'02', title:'PARTITION BY',           level:'avanzado', search:'partition by particion grupo por fila' },
    { id:'t3', num:'03', title:'ROW_NUMBER / RANK',      level:'avanzado', search:'row_number rank dense_rank ranking numerar empates' },
    { id:'t4', num:'04', title:'Totales acumulados',     level:'avanzado', search:'sum over order by acumulado running total corrido' },
    { id:'t5', num:'05', title:'LAG / LEAD',             level:'avanzado', search:'lag lead fila anterior siguiente comparar' }
  ];

  var HERO_HTML = `<header class="hero">
      <h1>Funciones de ventana</h1>
      <p class="sub">Las funciones de ventana hacen cálculos sobre un conjunto de filas relacionadas <strong>sin colapsarlas</strong>: cada fila conserva su detalle y recibe además el valor calculado. Son la herramienta para rankings, acumulados y comparaciones entre filas, sobre <code>empleados</code> y <code>departamentos</code>.</p>
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

  var TOPICS_HTML = `<!-- ============ 1. OVER() ============ -->
    <section class="topic" id="t1" data-title="OVER()" data-search="over funcion de ventana window sin agrupar">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">01</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-mod-window"/></svg>
          <h2>OVER()</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-avanzado"></span> Avanzado</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t1"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Una función de ventana calcula sobre un conjunto de filas, pero <strong>sin colapsarlas</strong>: cada fila conserva su detalle y recibe el valor calculado. La cláusula <code>OVER()</code> es lo que la convierte en función de ventana.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> columna,
       funcion() <span class="k">OVER</span> () <span class="k">AS</span> resultado
<span class="k">FROM</span> tabla;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> nombre, salario,
       <span class="k">ROUND</span>(<span class="k">AVG</span>(salario) <span class="k">OVER</span> ()) <span class="k">AS</span> promedio_empresa
<span class="k">FROM</span> empleados;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> 7 filas: cada empleado junto al promedio general</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>nombre</th><th>salario</th><th>promedio_empresa</th></tr></thead>
            <tbody>
              <tr><td>Ana Torres</td><td>4 200 000</td><td>4 071 429</td></tr>
              <tr><td>Luis Gómez</td><td>3 100 000</td><td>4 071 429</td></tr>
              <tr><td>Carla Díaz</td><td>6 800 000</td><td>4 071 429</td></tr>
              <tr><td>…</td><td>…</td><td>4 071 429</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p><code>AVG(salario) OVER ()</code> calcula el promedio de todas las filas, pero lo muestra en cada una, sin agrupar.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Comparar cada fila con un agregado (su salario frente al promedio) sin perder el detalle de la fila.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Confundirlo con <code>GROUP BY</code>: la agrupación colapsa las filas a una por grupo; la ventana las conserva todas.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p><code>OVER ()</code> vacío usa <strong>toda la tabla</strong> como ventana; en los siguientes temas la acotaremos.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> esta es la diferencia clave con <code>GROUP BY</code>: la agregación normal reduce las filas; una función de ventana las mantiene y agrega una columna calculada.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <span></span>
          <a class="next" data-route-link href="#/modulo/funciones-ventana/t2"><small>Siguiente</small><strong>PARTITION BY →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 2. PARTITION BY ============ -->
    <section class="topic" id="t2" data-title="PARTITION BY" data-search="partition by particion grupo por fila">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">02</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-mod-agrupaciones"/></svg>
          <h2>PARTITION BY</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-avanzado"></span> Avanzado</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t2"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Divide las filas en <strong>grupos (particiones)</strong> y aplica la función de ventana dentro de cada uno, sin colapsarlas.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code">funcion() <span class="k">OVER</span> (<span class="k">PARTITION BY</span> columna)</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> nombre, departamento_id, salario,
       <span class="k">ROUND</span>(<span class="k">AVG</span>(salario)
         <span class="k">OVER</span> (<span class="k">PARTITION BY</span> departamento_id)) <span class="k">AS</span> prom_depto
<span class="k">FROM</span> empleados;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> 7 filas: el promedio se reinicia por departamento</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>nombre</th><th>departamento_id</th><th>salario</th><th>prom_depto</th></tr></thead>
            <tbody>
              <tr><td>Ana Torres</td><td>1</td><td>4 200 000</td><td>4 300 000</td></tr>
              <tr><td>Marta Ruiz</td><td>1</td><td>4 500 000</td><td>4 300 000</td></tr>
              <tr><td>Sofía León</td><td>1</td><td>4 200 000</td><td>4 300 000</td></tr>
              <tr><td>Luis Gómez</td><td>2</td><td>3 100 000</td><td>2 933 333</td></tr>
              <tr><td>Jorge Peña</td><td>2</td><td>3 100 000</td><td>2 933 333</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Calcula el promedio <strong>por cada departamento</strong> y lo muestra en cada empleado de ese departamento.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Comparar cada fila con su propio grupo: el salario de un empleado frente al promedio de su área.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Creer que <code>PARTITION BY</code> filtra filas: solo agrupa el cálculo; siguen apareciendo todas.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Piénsalo como un <code>GROUP BY</code> "por fila": agrupa para calcular, pero no colapsa el resultado.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> <code>PARTITION BY</code> es a las funciones de ventana lo que <code>GROUP BY</code> es a las agregaciones, pero conservando cada fila.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/funciones-ventana/t1"><small>Anterior</small><strong>← OVER()</strong></a>
          <a class="next" data-route-link href="#/modulo/funciones-ventana/t3"><small>Siguiente</small><strong>ROW_NUMBER / RANK →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 3. ROW_NUMBER / RANK ============ -->
    <section class="topic" id="t3" data-title="ROW_NUMBER / RANK" data-search="row_number rank dense_rank ranking numerar empates">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">03</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-orderby"/></svg>
          <h2>ROW_NUMBER / RANK</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-avanzado"></span> Avanzado</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t3"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Numeran o rankean las filas dentro de la ventana según un <code>ORDER BY</code>. Se diferencian en cómo tratan los <strong>empates</strong>.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Las tres</div>
            <div class="code-block"><pre class="code"><span class="k">ROW_NUMBER</span>() <span class="k">OVER</span> (<span class="k">ORDER BY</span> salario <span class="k">DESC</span>)
<span class="k">RANK</span>()       <span class="k">OVER</span> (<span class="k">ORDER BY</span> salario <span class="k">DESC</span>)
<span class="k">DENSE_RANK</span>() <span class="k">OVER</span> (<span class="k">ORDER BY</span> salario <span class="k">DESC</span>)</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> nombre, salario,
       <span class="k">ROW_NUMBER</span>() <span class="k">OVER</span> (<span class="k">ORDER BY</span> salario <span class="k">DESC</span>) <span class="k">AS</span> fila,
       <span class="k">RANK</span>()       <span class="k">OVER</span> (<span class="k">ORDER BY</span> salario <span class="k">DESC</span>) <span class="k">AS</span> rango
<span class="k">FROM</span> empleados;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> 7 filas: fíjate en el empate de 4 200 000</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>nombre</th><th>salario</th><th>fila</th><th>rango</th></tr></thead>
            <tbody>
              <tr><td>Carla Díaz</td><td>6 800 000</td><td>1</td><td>1</td></tr>
              <tr><td>Marta Ruiz</td><td>4 500 000</td><td>2</td><td>2</td></tr>
              <tr><td>Ana Torres</td><td>4 200 000</td><td>3</td><td>3</td></tr>
              <tr><td>Sofía León</td><td>4 200 000</td><td>4</td><td>3</td></tr>
              <tr><td>Luis Gómez</td><td>3 100 000</td><td>5</td><td>5</td></tr>
              <tr><td>Jorge Peña</td><td>3 100 000</td><td>6</td><td>5</td></tr>
              <tr><td>Pedro Sánchez</td><td>2 600 000</td><td>7</td><td>7</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p><code>ROW_NUMBER</code> numera 1,2,3… sin repetir; <code>RANK</code> da el mismo número a los empatados y deja huecos (3, 3, 5); <code>DENSE_RANK</code> hace lo mismo pero sin huecos (3, 3, 4).</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Top-N por grupo, rankings, o quedarte con "la primera fila de cada partición".</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Usar <code>ROW_NUMBER</code> esperando que los empates reciban el mismo número: siempre son únicos.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Combínalas con <code>PARTITION BY</code> para rankear dentro de cada grupo (p. ej., top salario por departamento).</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> en un empate, <code>ROW_NUMBER</code> desempata de forma arbitraria; <code>RANK</code> y <code>DENSE_RANK</code> asignan el mismo número a las filas iguales.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/funciones-ventana/t2"><small>Anterior</small><strong>← PARTITION BY</strong></a>
          <a class="next" data-route-link href="#/modulo/funciones-ventana/t4"><small>Siguiente</small><strong>Totales acumulados →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 4. Totales acumulados ============ -->
    <section class="topic" id="t4" data-title="Totales acumulados" data-search="sum over order by acumulado running total corrido">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">04</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-func-num"/></svg>
          <h2>Totales acumulados</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-avanzado"></span> Avanzado</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t4"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Con un <code>ORDER BY</code> dentro de <code>OVER</code>, la función agrega de forma <strong>acumulada</strong>: cada fila suma desde la primera hasta ella.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">SUM</span>(columna) <span class="k">OVER</span> (<span class="k">ORDER BY</span> otra)</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> nombre, salario,
       <span class="k">SUM</span>(salario) <span class="k">OVER</span> (<span class="k">ORDER BY</span> id) <span class="k">AS</span> acumulado
<span class="k">FROM</span> empleados;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> 7 filas: el acumulado crece fila a fila</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>nombre</th><th>salario</th><th>acumulado</th></tr></thead>
            <tbody>
              <tr><td>Ana Torres</td><td>4 200 000</td><td>4 200 000</td></tr>
              <tr><td>Luis Gómez</td><td>3 100 000</td><td>7 300 000</td></tr>
              <tr><td>Marta Ruiz</td><td>4 500 000</td><td>11 800 000</td></tr>
              <tr><td>Pedro Sánchez</td><td>2 600 000</td><td>14 400 000</td></tr>
              <tr><td>Carla Díaz</td><td>6 800 000</td><td>21 200 000</td></tr>
              <tr><td>Jorge Peña</td><td>3 100 000</td><td>24 300 000</td></tr>
              <tr><td>Sofía León</td><td>4 200 000</td><td>28 500 000</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>El <code>ORDER BY id</code> dentro de <code>OVER</code> hace que cada fila sume su salario más el de todas las anteriores.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Totales corridos, saldos que se van sumando, progresión de ventas día a día.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Olvidar el <code>ORDER BY</code> dentro de <code>OVER</code>: sin él, <code>SUM</code> da el total en todas las filas, no el acumulado.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Combínalo con <code>PARTITION BY</code> para acumulados por grupo (por ejemplo, un total corrido por departamento).</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> sin <code>ORDER BY</code>, <code>SUM(...) OVER ()</code> devuelve el total; con <code>ORDER BY</code>, devuelve el acumulado hasta cada fila.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/funciones-ventana/t3"><small>Anterior</small><strong>← ROW_NUMBER / RANK</strong></a>
          <a class="next" data-route-link href="#/modulo/funciones-ventana/t5"><small>Siguiente</small><strong>LAG / LEAD →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 5. LAG / LEAD ============ -->
    <section class="topic" id="t5" data-title="LAG / LEAD" data-search="lag lead fila anterior siguiente comparar">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">05</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-ascdesc"/></svg>
          <h2>LAG / LEAD</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-avanzado"></span> Avanzado</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t5"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Acceden al valor de la fila <strong>anterior</strong> (<code>LAG</code>) o <strong>siguiente</strong> (<code>LEAD</code>) dentro de la ventana, sin necesidad de auto-JOINs.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">LAG</span>(columna)  <span class="k">OVER</span> (<span class="k">ORDER BY</span> otra)
<span class="k">LEAD</span>(columna) <span class="k">OVER</span> (<span class="k">ORDER BY</span> otra)</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> nombre, salario,
       <span class="k">LAG</span>(salario) <span class="k">OVER</span> (<span class="k">ORDER BY</span> salario) <span class="k">AS</span> salario_anterior
<span class="k">FROM</span> empleados;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> 7 filas: cada salario junto al inmediatamente menor</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>nombre</th><th>salario</th><th>salario_anterior</th></tr></thead>
            <tbody>
              <tr><td>Pedro Sánchez</td><td>2 600 000</td><td class="null">NULL</td></tr>
              <tr><td>Luis Gómez</td><td>3 100 000</td><td>2 600 000</td></tr>
              <tr><td>Jorge Peña</td><td>3 100 000</td><td>3 100 000</td></tr>
              <tr><td>Ana Torres</td><td>4 200 000</td><td>3 100 000</td></tr>
              <tr><td>Marta Ruiz</td><td>4 500 000</td><td>4 200 000</td></tr>
              <tr><td>Carla Díaz</td><td>6 800 000</td><td>4 500 000</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p><code>LAG(salario)</code> trae el salario de la fila anterior según el orden; <code>LEAD</code> haría lo mismo con la siguiente.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Comparar con el periodo anterior, calcular diferencias (variación mes a mes) o detectar cambios entre filas consecutivas.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>La primera fila no tiene anterior, así que <code>LAG</code> devuelve <code>NULL</code>; puedes dar un valor por defecto: <code>LAG(salario, 1, 0)</code>.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Definir bien el <code>ORDER BY</code>: es el que decide cuál es "la fila anterior".</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> <code>LAG</code> y <code>LEAD</code> evitan auto-JOINs complicados cuando solo quieres comparar una fila con su vecina.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/funciones-ventana/t4"><small>Anterior</small><strong>← Totales acumulados</strong></a>
          <span></span>
        </nav>
      </div>
    </section>`;

  var EXERCISES_META = [
    {
      id: 'ex1',
      type: 'mcq',
      prompt: '¿En qué se diferencia una función de ventana de un GROUP BY?',
      options: ['Conserva todas las filas en lugar de colapsarlas a una por grupo', 'Siempre es más lenta', 'No se puede usar en un SELECT', 'Borra filas de la tabla'],
      correct: 0,
      explanation: 'La función de ventana calcula sobre un conjunto de filas pero mantiene cada fila, agregando una columna con el resultado.'
    },
    {
      id: 'ex2',
      type: 'mcq',
      prompt: '¿Qué hace PARTITION BY dentro de OVER?',
      options: ['Divide las filas en grupos y calcula la ventana dentro de cada uno', 'Filtra filas de la consulta', 'Ordena el resultado final', 'Elimina duplicados'],
      correct: 0,
      explanation: 'PARTITION BY agrupa el cálculo por particiones (como un GROUP BY por fila), sin quitar filas.'
    },
    {
      id: 'ex3',
      type: 'mcq',
      prompt: 'Ante un empate en el orden, ¿qué función asigna el mismo número a las filas empatadas?',
      options: ['RANK', 'ROW_NUMBER', 'LIMIT', 'DISTINCT'],
      correct: 0,
      explanation: 'RANK (y DENSE_RANK) repiten el número en los empates; ROW_NUMBER siempre da valores únicos.'
    },
    {
      id: 'ex4',
      type: 'write',
      prompt: 'Escribe la función de ventana que numera las filas de forma única (1, 2, 3…) según un orden.',
      placeholder: 'ROW_NUMBER()',
      answers: ['row_number()', 'row_number'],
      explanation: 'ROW_NUMBER() OVER (ORDER BY ...) asigna un número correlativo único a cada fila.'
    },
    {
      id: 'ex5',
      type: 'mcq',
      prompt: '¿Para qué sirve LAG?',
      options: ['Para acceder al valor de la fila anterior dentro de la ventana', 'Para agrupar filas', 'Para borrar filas', 'Para ordenar la tabla'],
      correct: 0,
      explanation: 'LAG trae el valor de la fila anterior (según el ORDER BY); LEAD hace lo mismo con la siguiente.'
    }
  ];

  window.App = window.App || {};
  window.App.modules = window.App.modules || {};
  window.App.modules['funciones-ventana'] = {
    id: 'funciones-ventana',
    topicsMeta: TOPICS_META,
    heroHtml: HERO_HTML,
    schemaHtml: SCHEMA_HTML,
    topicsHtml: TOPICS_HTML,
    exercisesMeta: EXERCISES_META
  };

})();
