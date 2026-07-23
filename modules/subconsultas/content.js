/* ============================================================
   MÓDULO: Subconsultas
   Misma forma que los módulos anteriores. Reutiliza las tablas
   empleados/departamentos introducidas en modules/joins, así que
   los ejemplos combinan lo aprendido ahí con consultas anidadas.
   ============================================================ */
(function(){
  'use strict';

  var TOPICS_META = [
    { id:'t1', num:'01', title:'Subconsulta en WHERE',    level:'basico',     search:'subconsulta where comparacion escalar' },
    { id:'t2', num:'02', title:'Subconsulta con IN',      level:'basico',     search:'subconsulta in lista pertenencia' },
    { id:'t3', num:'03', title:'Subconsulta con EXISTS',  level:'intermedio', search:'subconsulta exists not exists existencia' },
    { id:'t4', num:'04', title:'Subconsulta en FROM',     level:'intermedio', search:'subconsulta from tabla derivada' },
    { id:'t5', num:'05', title:'Subconsulta en SELECT',   level:'intermedio', search:'subconsulta select escalar columna' },
    { id:'t6', num:'06', title:'Subconsultas correlacionadas', level:'avanzado', search:'subconsulta correlacionada fila por fila' }
  ];

  var HERO_HTML = `<header class="hero">
      <h1>Subconsultas: consultas dentro de consultas</h1>
      <p class="sub">Consultas anidadas en WHERE, FROM y SELECT, y la diferencia entre una subconsulta normal y una correlacionada. Sigue usando las tablas <code>empleados</code> y <code>departamentos</code> del módulo de JOINs.</p>
      <p style="margin:0 0 14px 0; font-size:12.5px; color:var(--ink-3);">Por Nelson Leonardo Páez Arias</p>
      <div class="hero__meta">
        <span><svg aria-hidden="true"><use href="#i-check"/></svg> <span id="heroCompletedCount">0/6</span> completados</span>
        <span><svg aria-hidden="true"><use href="#i-hash"/></svg> 6 temas</span>
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
                <th>jefe_id<span class="type">integer</span></th>
              </tr>
            </thead>
            <tbody>
              <tr><td>1</td><td>Ana Torres</td><td>Ingeniera de Datos</td><td>4 200 000</td><td>1</td><td>5</td></tr>
              <tr><td>2</td><td>Luis Gómez</td><td>Analista</td><td>3 100 000</td><td>2</td><td>5</td></tr>
              <tr><td>3</td><td>Marta Ruiz</td><td>Ingeniera de Datos</td><td>4 500 000</td><td>1</td><td>1</td></tr>
              <tr><td>4</td><td>Pedro Sánchez</td><td>Analista Junior</td><td>2 600 000</td><td>2</td><td>2</td></tr>
              <tr><td>5</td><td>Carla Díaz</td><td>Gerente</td><td>6 800 000</td><td class="null">NULL</td><td class="null">NULL</td></tr>
              <tr><td>6</td><td>Jorge Peña</td><td>Analista</td><td>3 100 000</td><td>2</td><td>5</td></tr>
              <tr><td>7</td><td>Sofía León</td><td>Ingeniera de Datos</td><td>4 200 000</td><td>1</td><td>1</td></tr>
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

  var TOPICS_HTML = `<!-- ============ 1. Subconsulta en WHERE ============ -->
    <section class="topic" id="t1" data-title="Subconsulta en WHERE" data-search="subconsulta where comparacion escalar">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">01</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-where"/></svg>
          <h2>Subconsulta en WHERE</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-basico"></span> Básico</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t1"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Una consulta <strong>completa</strong> escrita entre paréntesis, dentro de otra consulta. La forma más simple: comparar una columna contra el valor que devuelve una subconsulta escalar (una sola fila, una sola columna).</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">WHERE</span> columna <span class="k">operador</span> (<span class="k">SELECT</span> ...);</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> nombre, salario
<span class="k">FROM</span> empleados
<span class="k">WHERE</span> salario > (<span class="k">SELECT</span> <span class="k">AVG</span>(salario) <span class="k">FROM</span> empleados)
<span class="k">ORDER BY</span> salario <span class="k">DESC</span>;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Resultado</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>nombre</th><th>salario</th></tr></thead>
            <tbody>
              <tr><td>Carla Díaz</td><td>6 800 000</td></tr>
              <tr><td>Marta Ruiz</td><td>4 500 000</td></tr>
              <tr><td>Ana Torres</td><td>4 200 000</td></tr>
              <tr><td>Sofía León</td><td>4 200 000</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>PostgreSQL ejecuta primero la subconsulta (que da un único número, 4 071 428.57…) y luego usa ese valor como si fuera una constante en el WHERE.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Comparar cada fila contra un valor calculado dinámicamente (un promedio, un máximo) en vez de un número fijo escrito a mano.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Usar un operador de comparación simple (<code>=</code>, <code>&gt;</code>) con una subconsulta que devuelve más de una fila: PostgreSQL lanza el error "more than one row returned by a subquery used as an expression".</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Si la subconsulta puede devolver cero filas, recordar que la comparación completa se vuelve NULL (ni verdadera ni falsa), y la fila externa queda excluida del resultado.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> el promedio general (≈4 071 429) ya se calculó en el módulo de Agrupaciones con GROUP BY; aquí se usa ese mismo cálculo, pero como una pieza dentro de otra consulta.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <span></span>
          <a class="next" data-route-link href="#/modulo/subconsultas/t2"><small>Siguiente</small><strong>Subconsulta con IN →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 2. Subconsulta con IN ============ -->
    <section class="topic" id="t2" data-title="Subconsulta con IN" data-search="subconsulta in lista pertenencia">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">02</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-in"/></svg>
          <h2>Subconsulta con IN</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-basico"></span> Básico</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t2"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Compara una columna contra la <strong>lista de valores</strong> que devuelve una subconsulta de una sola columna (pero cualquier número de filas).</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">WHERE</span> columna <span class="k">IN</span> (<span class="k">SELECT</span> columna <span class="k">FROM</span> ...);</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> nombre
<span class="k">FROM</span> empleados
<span class="k">WHERE</span> departamento_id <span class="k">IN</span> (
  <span class="k">SELECT</span> id <span class="k">FROM</span> departamentos <span class="k">WHERE</span> presupuesto > 40000000
)
<span class="k">ORDER BY</span> nombre;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Resultado</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>nombre</th></tr></thead>
            <tbody>
              <tr><td>Ana Torres</td></tr>
              <tr><td>Marta Ruiz</td></tr>
              <tr><td>Sofía León</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>La subconsulta interna devuelve solo el id 1 (Tecnología, el único departamento con presupuesto mayor a 40 000 000); la consulta externa filtra empleados con ese departamento_id.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Cuando la lista de valores a comparar depende de otra tabla o de una condición, en vez de ser una lista fija escrita a mano como en el módulo de Filtrado de datos.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p><code>NOT IN</code> con una subconsulta que puede devolver NULL produce resultados vacíos de forma inesperada; en ese caso conviene usar <code>NOT EXISTS</code> (siguiente tema).</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Para tablas grandes, evaluar si un JOIN sería más eficiente que IN con subconsulta; el optimizador de PostgreSQL suele reescribirlos de forma similar, pero un JOIN es a veces más legible.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> Carla Díaz queda fuera aunque no se filtró explícitamente por ella: su <code>departamento_id</code> es NULL, y NULL nunca coincide con ningún valor de la lista devuelta por IN.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/subconsultas/t1"><small>Anterior</small><strong>← Subconsulta en WHERE</strong></a>
          <a class="next" data-route-link href="#/modulo/subconsultas/t3"><small>Siguiente</small><strong>Subconsulta con EXISTS →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 3. Subconsulta con EXISTS ============ -->
    <section class="topic" id="t3" data-title="Subconsulta con EXISTS" data-search="subconsulta exists not exists existencia">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">03</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-sub-exists"/></svg>
          <h2>Subconsulta con EXISTS</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-intermedio"></span> Intermedio</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t3"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Verifica si una subconsulta devuelve <strong>al menos una fila</strong>, sin importar cuáles sean sus valores. Devuelve verdadero o falso, nunca datos.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">WHERE</span> <span class="k">EXISTS</span> (<span class="k">SELECT</span> 1 <span class="k">FROM</span> ... <span class="k">WHERE</span> ...);</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> d.nombre
<span class="k">FROM</span> departamentos d
<span class="k">WHERE</span> <span class="k">EXISTS</span> (
  <span class="k">SELECT</span> 1 <span class="k">FROM</span> empleados e <span class="k">WHERE</span> e.departamento_id = d.id
)
<span class="k">ORDER BY</span> d.nombre;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Resultado</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>nombre</th></tr></thead>
            <tbody>
              <tr><td>Comercial</td></tr>
              <tr><td>Tecnología</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Por cada fila de departamentos, comprueba si existe al menos un empleado con ese departamento_id; en cuanto encuentra una coincidencia, deja de buscar (no necesita contar todas).</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Preguntas de sí/no sobre relaciones: "¿tiene al menos un pedido?", "¿tiene algún empleado asignado?". Suele ser más eficiente que IN en tablas grandes.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Escribir columnas específicas en el SELECT de la subconsulta (<code>SELECT nombre FROM ...</code>) pensando que importan; con EXISTS no importa qué se selecciona, solo si hay filas, por eso es común usar <code>SELECT 1</code>.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Usar <code>NOT EXISTS</code> en vez de <code>NOT IN</code> para buscar ausencia de relación: NOT EXISTS no tiene el problema de resultados vacíos inesperados que sí tiene NOT IN con NULL.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> Marketing y Recursos Humanos no aparecen porque EXISTS es falso para ellos: ningún empleado tiene su departamento_id.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/subconsultas/t2"><small>Anterior</small><strong>← Subconsulta con IN</strong></a>
          <a class="next" data-route-link href="#/modulo/subconsultas/t4"><small>Siguiente</small><strong>Subconsulta en FROM →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 4. Subconsulta en FROM ============ -->
    <section class="topic" id="t4" data-title="Subconsulta en FROM" data-search="subconsulta from tabla derivada">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">04</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-from"/></svg>
          <h2>Subconsulta en FROM</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-intermedio"></span> Intermedio</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t4"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Una subconsulta puede aparecer en el <strong>FROM</strong> y funcionar como una tabla temporal ("tabla derivada"), sobre la cual la consulta externa puede filtrar, ordenar o volver a agregar.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">FROM</span> (<span class="k">SELECT</span> ...) <span class="k">AS</span> alias</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> resumen.departamento_id, <span class="k">ROUND</span>(resumen.promedio) <span class="k">AS</span> promedio
<span class="k">FROM</span> (
  <span class="k">SELECT</span> departamento_id, <span class="k">AVG</span>(salario) <span class="k">AS</span> promedio
  <span class="k">FROM</span> empleados
  <span class="k">WHERE</span> departamento_id <span class="k">IS NOT NULL</span>
  <span class="k">GROUP BY</span> departamento_id
) <span class="k">AS</span> resumen
<span class="k">WHERE</span> resumen.promedio > 2500000
<span class="k">ORDER BY</span> resumen.departamento_id;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Resultado</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>departamento_id</th><th>promedio</th></tr></thead>
            <tbody>
              <tr><td>1</td><td>4 300 000</td></tr>
              <tr><td>2</td><td>2 933 333</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Primero calcula el promedio por departamento en la subconsulta interna, y solo después la consulta externa puede filtrar por ese resultado ya agregado, algo que WHERE no permite hacer directamente sobre una función de agregación.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Cuando se necesita reutilizar un resultado calculado (agregaciones, rankings) como si fuera una tabla normal, para seguir filtrando u ordenando sobre él.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Olvidar el alias de la tabla derivada (<code>AS resumen</code>): PostgreSQL exige que toda subconsulta en FROM tenga un nombre, a diferencia de las subconsultas en WHERE.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Si la subconsulta en FROM crece mucho o se reutiliza varias veces en la misma consulta, considerar una CTE con <code>WITH</code> en su lugar: hace lo mismo, pero suele leerse de arriba hacia abajo con más claridad.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> este resultado ya se podía obtener con GROUP BY y HAVING (módulo de Agrupaciones); la diferencia es que aquí el resultado agregado se trata como una tabla completa, reutilizable en filtros y JOIN posteriores.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/subconsultas/t3"><small>Anterior</small><strong>← Subconsulta con EXISTS</strong></a>
          <a class="next" data-route-link href="#/modulo/subconsultas/t5"><small>Siguiente</small><strong>Subconsulta en SELECT →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 5. Subconsulta en SELECT ============ -->
    <section class="topic" id="t5" data-title="Subconsulta en SELECT" data-search="subconsulta select escalar columna">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">05</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-select"/></svg>
          <h2>Subconsulta en SELECT</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-intermedio"></span> Intermedio</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t5"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Una subconsulta escalar también puede aparecer como una <strong>columna más</strong> dentro del SELECT, agregando un valor calculado a cada fila.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> columna, (<span class="k">SELECT</span> ...) <span class="k">AS</span> alias
<span class="k">FROM</span> tabla;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> nombre, salario,
       (<span class="k">SELECT</span> <span class="k">ROUND</span>(<span class="k">AVG</span>(salario)) <span class="k">FROM</span> empleados) <span class="k">AS</span> promedio_general
<span class="k">FROM</span> empleados
<span class="k">ORDER BY</span> nombre;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Resultado</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>nombre</th><th>salario</th><th>promedio_general</th></tr></thead>
            <tbody>
              <tr><td>Ana Torres</td><td>4 200 000</td><td>4 071 429</td></tr>
              <tr><td>Carla Díaz</td><td>6 800 000</td><td>4 071 429</td></tr>
              <tr><td>Jorge Peña</td><td>3 100 000</td><td>4 071 429</td></tr>
              <tr><td>Luis Gómez</td><td>3 100 000</td><td>4 071 429</td></tr>
              <tr><td>Marta Ruiz</td><td>4 500 000</td><td>4 071 429</td></tr>
              <tr><td>Pedro Sánchez</td><td>2 600 000</td><td>4 071 429</td></tr>
              <tr><td>Sofía León</td><td>4 200 000</td><td>4 071 429</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Como esta subconsulta no depende de la fila externa, PostgreSQL la resuelve como un único valor y lo repite en cada fila del resultado.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Para comparar visualmente cada fila contra una referencia general, como el promedio, sin necesidad de una segunda consulta aparte.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Que la subconsulta devuelva más de una fila: en el SELECT, igual que en WHERE, una subconsulta escalar solo admite un valor. Si devuelve varias filas, PostgreSQL lanza error en tiempo de ejecución.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Si el mismo valor calculado se usa en varias columnas o cláusulas, considerar calcularlo una sola vez con una CTE (<code>WITH</code>) en vez de repetir la subconsulta.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> el siguiente tema muestra el caso contrario: una subconsulta en SELECT que sí cambia de valor en cada fila, porque hace referencia a la fila externa.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/subconsultas/t4"><small>Anterior</small><strong>← Subconsulta en FROM</strong></a>
          <a class="next" data-route-link href="#/modulo/subconsultas/t6"><small>Siguiente</small><strong>Subconsultas correlacionadas →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 6. Subconsultas correlacionadas ============ -->
    <section class="topic" id="t6" data-title="Subconsultas correlacionadas" data-search="subconsulta correlacionada fila por fila">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">06</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-mod-subconsultas"/></svg>
          <h2>Subconsultas correlacionadas</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-avanzado"></span> Avanzado</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t6"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Una subconsulta que hace referencia a una columna de la <strong>consulta externa</strong>. A diferencia de las anteriores, no se resuelve una sola vez: se vuelve a ejecutar <strong>por cada fila</strong>.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> e.columna,
  (<span class="k">SELECT</span> ... <span class="k">FROM</span> tabla t <span class="k">WHERE</span> t.col = e.columna) <span class="k">AS</span> alias
<span class="k">FROM</span> tabla e;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> e.nombre, e.salario,
  (<span class="k">SELECT COUNT</span>(*) <span class="k">FROM</span> empleados e2
   <span class="k">WHERE</span> e2.departamento_id = e.departamento_id
     <span class="k">AND</span> e2.salario > e.salario) <span class="k">AS</span> con_salario_mayor
<span class="k">FROM</span> empleados e
<span class="k">WHERE</span> e.departamento_id <span class="k">IS NOT NULL</span>
<span class="k">ORDER BY</span> e.departamento_id, con_salario_mayor, e.nombre;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Resultado</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>nombre</th><th>salario</th><th>con_salario_mayor</th></tr></thead>
            <tbody>
              <tr><td>Marta Ruiz</td><td>4 500 000</td><td>0</td></tr>
              <tr><td>Ana Torres</td><td>4 200 000</td><td>1</td></tr>
              <tr><td>Sofía León</td><td>4 200 000</td><td>1</td></tr>
              <tr><td>Jorge Peña</td><td>3 100 000</td><td>0</td></tr>
              <tr><td>Luis Gómez</td><td>3 100 000</td><td>0</td></tr>
              <tr><td>Pedro Sánchez</td><td>2 600 000</td><td>2</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>La condición <code>e2.departamento_id = e.departamento_id</code> conecta la subconsulta (e2) con la fila actual de la consulta externa (e); por eso el resultado cambia fila a fila, en vez de repetirse.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Comparaciones "dentro de su propio grupo": ranking de salario por departamento, diferencia contra el máximo de su categoría, sin necesidad de funciones de ventana.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Usarlas sobre tablas grandes sin medir el impacto: al ejecutarse una vez por cada fila externa, pueden ser mucho más lentas que un JOIN o una función de ventana equivalente.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Si el problema es "una posición dentro de un grupo" (como este ranking de salarios), vale la pena comparar esta solución con funciones de ventana como <code>RANK()</code> u <code>ROW_NUMBER()</code> más adelante: suelen ser más claras y más rápidas.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> Marta Ruiz tiene 0 porque gana el salario más alto de Tecnología; Pedro Sánchez tiene 2 porque tanto Luis como Jorge ganan más que él dentro de Comercial. El mismo número (0) significa cosas distintas en cada departamento porque la subconsulta se recalcula por fila.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/subconsultas/t5"><small>Anterior</small><strong>← Subconsulta en SELECT</strong></a>
          <span></span>
        </nav>
      </div>
    </section>`;

  var EXERCISES_META = [
    {
      id: 'ex1',
      type: 'mcq',
      prompt: '¿Qué debe devolver una subconsulta <strong>escalar</strong> para poder usarse con <code>=</code> o <code>&gt;</code> en un WHERE?',
      options: ['Varias filas y columnas', 'Un único valor (una fila, una columna)', 'Siempre una tabla completa', 'Nada, solo se usa como comentario'],
      correct: 1,
      explanation: 'Una subconsulta escalar debe reducirse a un solo valor; si devuelve más de una fila, PostgreSQL lanza un error al compararla con = o >.'
    },
    {
      id: 'ex2',
      type: 'write',
      prompt: 'Escribe la condición WHERE completa que filtra empleados con <code>salario</code> mayor al promedio de todos los salarios de la tabla <code>empleados</code>.',
      placeholder: 'salario > (SELECT AVG(salario) FROM empleados)',
      answers: ['salario > (select avg(salario) from empleados)'],
      explanation: 'La subconsulta entre paréntesis se evalúa primero y devuelve un único número; luego se compara cada salario contra ese valor.'
    },
    {
      id: 'ex3',
      type: 'mcq',
      prompt: '¿Cuál es la diferencia principal entre una subconsulta con IN y una con EXISTS?',
      options: ['No hay diferencia, son intercambiables siempre', 'IN compara valores devueltos; EXISTS solo verifica si la subconsulta devuelve alguna fila', 'EXISTS solo funciona con columnas numéricas', 'IN es exclusivo de PostgreSQL'],
      correct: 1,
      explanation: 'IN compara la columna contra la lista de valores que trae la subconsulta; EXISTS ignora los valores y solo pregunta si existe al menos una fila.'
    },
    {
      id: 'ex4',
      type: 'mcq',
      prompt: '¿Qué hace que una subconsulta sea "correlacionada"?',
      options: ['Que use JOIN internamente', 'Que haga referencia a una columna de la consulta externa', 'Que devuelva más de una fila', 'Que esté escrita en mayúsculas'],
      correct: 1,
      explanation: 'Una subconsulta correlacionada depende de la fila actual de la consulta externa (por ejemplo, e.departamento_id), así que se vuelve a evaluar por cada fila.'
    },
    {
      id: 'ex5',
      type: 'mcq',
      prompt: '¿En qué cláusula se usa una subconsulta como si fuera una tabla temporal (una "tabla derivada")?',
      options: ['SELECT', 'WHERE', 'FROM', 'ORDER BY'],
      correct: 2,
      explanation: 'Una subconsulta en FROM se comporta como una tabla más, con su propio alias obligatorio, sobre la que la consulta externa puede filtrar y ordenar.'
    }
  ];

  window.App = window.App || {};
  window.App.modules = window.App.modules || {};
  window.App.modules['subconsultas'] = {
    id: 'subconsultas',
    topicsMeta: TOPICS_META,
    heroHtml: HERO_HTML,
    schemaHtml: SCHEMA_HTML,
    topicsHtml: TOPICS_HTML,
    exercisesMeta: EXERCISES_META
  };

})();
