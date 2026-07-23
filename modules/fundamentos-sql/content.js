/* ============================================================
   MÓDULO: Fundamentos SQL
   Contenido puro (sin header/sidebar/footer del shell). El shell
   inserta hero + navlist + schema + topics en los slots del
   layout de módulo. Para agregar el próximo módulo (Consultas,
   Funciones, etc.) se crea un archivo hermano con esta misma
   forma y se referencia desde registry.js: nada más cambia.
   ============================================================ */
(function(){
  'use strict';

  var TOPICS_META = [
    { id:'t1',  num:'01', title:'SELECT',                level:'basico',     search:'select columnas proyección' },
    { id:'t2',  num:'02', title:'FROM',                  level:'basico',     search:'from tabla origen' },
    { id:'t3',  num:'03', title:'DISTINCT',               level:'basico',     search:'distinct duplicados únicos' },
    { id:'t4',  num:'04', title:'ORDER BY',               level:'basico',     search:'order by ordenar' },
    { id:'t5',  num:'05', title:'ASC y DESC',             level:'basico',     search:'asc desc ascendente descendente' },
    { id:'t6',  num:'06', title:'LIMIT',                  level:'basico',     search:'limit filas top n' },
    { id:'t7',  num:'07', title:'WHERE',                  level:'intermedio', search:'where filtrar condición' },
    { id:'t8',  num:'08', title:'Operadores con WHERE',   level:'intermedio', search:'operadores and or not comparación' },
    { id:'t9',  num:'09', title:'BETWEEN',                level:'intermedio', search:'between rango' },
    { id:'t10', num:'10', title:'IN',                     level:'intermedio', search:'in lista valores' },
    { id:'t11', num:'11', title:'LIKE / ILIKE',           level:'intermedio', search:'like ilike patrón texto comodín' },
    { id:'t12', num:'12', title:'IS NULL',                level:'intermedio', search:'is null nulo ausente' }
  ];

  // NOTA: el índice lateral (nav.side) se genera en tiempo de render
  // a partir de TOPICS_META: así cualquier módulo futuro solo aporta
  // esta lista y el HTML de sus temas, sin escribir el <ol> a mano.

  var HERO_HTML = `<header class="hero">
      <h1>Fundamentos de consultas SQL</h1>
      <p class="sub">Definición, sintaxis, ejemplo y resultado para cada cláusula, en el orden en que se suelen aprender. Todos los ejemplos usan la misma tabla base.</p>
      <p style="margin:0 0 14px 0; font-size:12.5px; color:var(--ink-3);">Por Nelson Leonardo Páez Arias</p>
      <div class="hero__meta">
        <span><svg aria-hidden="true"><use href="#i-check"/></svg> <span id="heroCompletedCount">0/12</span> completados</span>
        <span><svg aria-hidden="true"><use href="#i-hash"/></svg> 12 temas</span>
        <span><svg aria-hidden="true"><use href="#i-result"/></svg> 1 tabla de referencia</span>
      </div>
    </header>`;

  var SCHEMA_HTML = `<div class="schema" id="schemaTable">
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
              <th>ciudad<span class="type">text</span></th>
              <th>fecha_ingreso<span class="type">date</span></th>
              <th>correo<span class="type">text</span></th>
            </tr>
          </thead>
          <tbody>
            <tr><td>1</td><td>Ana Torres</td><td>Ingeniera de Datos</td><td>4 200 000</td><td>Bogotá</td><td>2022-03-15</td><td>ana.torres@empresa.com</td></tr>
            <tr><td>2</td><td>Luis Gómez</td><td>Analista</td><td>3 100 000</td><td>Medellín</td><td>2023-01-10</td><td class="null">NULL</td></tr>
            <tr><td>3</td><td>Marta Ruiz</td><td>Ingeniera de Datos</td><td>4 500 000</td><td>Bogotá</td><td>2021-11-02</td><td>marta.ruiz@empresa.com</td></tr>
            <tr><td>4</td><td>Pedro Sánchez</td><td>Analista Junior</td><td>2 600 000</td><td>Cali</td><td>2023-06-20</td><td>pedro.sanchez@empresa.com</td></tr>
            <tr><td>5</td><td>Carla Díaz</td><td>Gerente</td><td>6 800 000</td><td>Bogotá</td><td>2019-08-30</td><td>carla.diaz@empresa.com</td></tr>
            <tr><td>6</td><td>Jorge Peña</td><td>Analista</td><td>3 100 000</td><td>Medellín</td><td>2022-09-01</td><td class="null">NULL</td></tr>
            <tr><td>7</td><td>Sofía León</td><td>Ingeniera de Datos</td><td>4 200 000</td><td>Sogamoso</td><td>2023-02-14</td><td>sofia.leon@empresa.com</td></tr>
          </tbody>
        </table>
      </div>
    </div>`;

  var TOPICS_HTML = `<!-- ============ 1. SELECT ============ -->
    <section class="topic" id="t1" data-title="SELECT" data-search="select columnas proyección">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">01</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-select"/></svg>
          <h2>SELECT</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-basico"></span> Básico</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t1"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Cláusula que indica <strong>qué columnas</strong> se quieren consultar de una tabla.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> columna1, columna2
<span class="k">FROM</span> tabla;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> nombre, cargo
<span class="k">FROM</span> empleados;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Resultado</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>nombre</th><th>cargo</th></tr></thead>
            <tbody>
              <tr><td>Ana Torres</td><td>Ingeniera de Datos</td></tr>
              <tr><td>Luis Gómez</td><td>Analista</td></tr>
              <tr><td>Marta Ruiz</td><td>Ingeniera de Datos</td></tr>
              <tr><td>Pedro Sánchez</td><td>Analista Junior</td></tr>
              <tr><td>Carla Díaz</td><td>Gerente</td></tr>
              <tr><td>Jorge Peña</td><td>Analista</td></tr>
              <tr><td>Sofía León</td><td>Ingeniera de Datos</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Extrae los datos de las columnas indicadas, sin filtrar ni ordenar filas por sí sola.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Siempre. Es la base de cualquier consulta de lectura.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Olvidar la coma entre columnas; usar <code>SELECT *</code> en tablas grandes cuando solo se necesitan dos o tres columnas, lo que consume más recursos de los necesarios.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Seleccionar solo las columnas necesarias en lugar de usar <code>SELECT *</code> facilita la lectura y el mantenimiento de la consulta.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> el orden de las columnas en el resultado sigue el orden en que se escriben en el SELECT, no el orden físico de la tabla.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <span></span>
          <a class="next" data-route-link href="#/modulo/fundamentos-sql/t2"><small>Siguiente</small><strong>FROM →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 2. FROM ============ -->
    <section class="topic" id="t2" data-title="FROM" data-search="from tabla origen">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">02</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-from"/></svg>
          <h2>FROM</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-basico"></span> Básico</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t2"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Indica la <strong>tabla de origen</strong> sobre la que actúa el resto de la consulta.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> columnas
<span class="k">FROM</span> tabla;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> *
<span class="k">FROM</span> empleados;</pre></div>
          </div>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Define la fuente de datos; SELECT, WHERE, ORDER BY, etc. actúan sobre esa tabla.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Es obligatorio en toda consulta que lea una tabla.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Escribir mal el nombre de la tabla, o el esquema (<code>schema.tabla</code>) cuando hay varios esquemas en la base.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Usar alias cortos y descriptivos (por ejemplo <code>e</code> para <code>empleados</code>) cuando la consulta involucra varias tablas.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> FROM puede recibir varias tablas separadas por coma o combinadas con JOIN; también acepta alias con AS, por ejemplo <code>FROM empleados AS e</code>.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/fundamentos-sql/t1"><small>Anterior</small><strong>← SELECT</strong></a>
          <a class="next" data-route-link href="#/modulo/fundamentos-sql/t3"><small>Siguiente</small><strong>DISTINCT →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 3. DISTINCT ============ -->
    <section class="topic" id="t3" data-title="DISTINCT" data-search="distinct duplicados únicos">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">03</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-distinct"/></svg>
          <h2>DISTINCT</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-basico"></span> Básico</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t3"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Elimina las <strong>filas duplicadas</strong> del resultado.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT DISTINCT</span> columna
<span class="k">FROM</span> tabla;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT DISTINCT</span> cargo
<span class="k">FROM</span> empleados;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Resultado</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>cargo</th></tr></thead>
            <tbody>
              <tr><td>Ingeniera de Datos</td></tr>
              <tr><td>Analista</td></tr>
              <tr><td>Analista Junior</td></tr>
              <tr><td>Gerente</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Compara las columnas seleccionadas fila por fila y agrupa las combinaciones idénticas en una sola.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Para conocer los valores únicos presentes en una o varias columnas.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Pensar que DISTINCT filtra una sola columna cuando se seleccionan varias; en ese caso compara la combinación completa de todas ellas.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Verificar primero cuántas columnas se necesitan realmente antes de aplicar DISTINCT sobre varias a la vez.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> DISTINCT puede ser costoso en tablas grandes, porque el motor debe comparar y ordenar internamente antes de descartar duplicados.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/fundamentos-sql/t2"><small>Anterior</small><strong>← FROM</strong></a>
          <a class="next" data-route-link href="#/modulo/fundamentos-sql/t4"><small>Siguiente</small><strong>ORDER BY →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 4. ORDER BY ============ -->
    <section class="topic" id="t4" data-title="ORDER BY" data-search="order by ordenar">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">04</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-orderby"/></svg>
          <h2>ORDER BY</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-basico"></span> Básico</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t4"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Ordena las filas del resultado según una o varias columnas.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> columnas
<span class="k">FROM</span> tabla
<span class="k">ORDER BY</span> columna;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> nombre, salario
<span class="k">FROM</span> empleados
<span class="k">ORDER BY</span> salario;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Resultado</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>nombre</th><th>salario</th></tr></thead>
            <tbody>
              <tr><td>Pedro Sánchez</td><td>2 600 000</td></tr>
              <tr><td>Luis Gómez</td><td>3 100 000</td></tr>
              <tr><td>Jorge Peña</td><td>3 100 000</td></tr>
              <tr><td>Ana Torres</td><td>4 200 000</td></tr>
              <tr><td>Sofía León</td><td>4 200 000</td></tr>
              <tr><td>Marta Ruiz</td><td>4 500 000</td></tr>
              <tr><td>Carla Díaz</td><td>6 800 000</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Reorganiza las filas devueltas; no modifica el orden físico de los datos en la tabla.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Cuando el orden de presentación importa: rankings, reportes, series de tiempo.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Ordenar por una columna que no está en el SELECT esperando que no funcione (sí funciona); olvidar que el orden por defecto es ascendente.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Incluir siempre una columna con valores únicos (como el id) cuando el orden debe ser reproducible entre ejecuciones.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> se puede ordenar por varias columnas, por ejemplo <code>ORDER BY ciudad, salario</code> ordena primero por ciudad y, dentro de cada ciudad, por salario.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/fundamentos-sql/t3"><small>Anterior</small><strong>← DISTINCT</strong></a>
          <a class="next" data-route-link href="#/modulo/fundamentos-sql/t5"><small>Siguiente</small><strong>ASC y DESC →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 5. ASC / DESC ============ -->
    <section class="topic" id="t5" data-title="ASC y DESC" data-search="asc desc ascendente descendente">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">05</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-ascdesc"/></svg>
          <h2>ASC y DESC</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-basico"></span> Básico</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t5"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Palabras clave que fijan la <strong>dirección</strong> del ordenamiento: ascendente o descendente.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">ORDER BY</span> columna <span class="k">ASC</span> | <span class="k">DESC</span>;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> nombre, salario
<span class="k">FROM</span> empleados
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
              <tr><td>Luis Gómez</td><td>3 100 000</td></tr>
              <tr><td>Jorge Peña</td><td>3 100 000</td></tr>
              <tr><td>Pedro Sánchez</td><td>2 600 000</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>ASC ordena de menor a mayor (o A-Z); DESC ordena de mayor a menor (o Z-A).</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>DESC es útil para ver primero los valores más altos, por ejemplo los salarios más altos o las fechas más recientes.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Escribir DESC pensando que también afecta a otras columnas del ORDER BY; cada columna necesita su propio ASC o DESC.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Escribir explícitamente ASC en consultas compartidas con otras personas; aunque sea el valor por defecto, mejora la legibilidad.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> ASC es el valor por defecto, así que <code>ORDER BY salario</code> y <code>ORDER BY salario ASC</code> son equivalentes.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/fundamentos-sql/t4"><small>Anterior</small><strong>← ORDER BY</strong></a>
          <a class="next" data-route-link href="#/modulo/fundamentos-sql/t6"><small>Siguiente</small><strong>LIMIT →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 6. LIMIT ============ -->
    <section class="topic" id="t6" data-title="LIMIT" data-search="limit filas top n">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">06</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-limit"/></svg>
          <h2>LIMIT</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-basico"></span> Básico</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t6"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Restringe el <strong>número de filas</strong> devueltas por la consulta.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> columnas
<span class="k">FROM</span> tabla
<span class="k">LIMIT</span> n;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> nombre, salario
<span class="k">FROM</span> empleados
<span class="k">ORDER BY</span> salario <span class="k">DESC</span>
<span class="k">LIMIT</span> 3;</pre></div>
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
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Corta el resultado después de las primeras n filas, según el orden actual de la consulta.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Para revisar muestras rápidas de datos o construir consultas de tipo "top N".</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Usar LIMIT sin ORDER BY esperando un resultado consistente; sin un orden explícito, el motor puede devolver filas distintas en cada ejecución.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Combinar siempre LIMIT con ORDER BY para obtener resultados consistentes en cada ejecución.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> la sintaxis LIMIT no es estándar en todos los motores; SQL Server usa <code>TOP</code> y el estándar SQL define <code>FETCH FIRST n ROWS ONLY</code>.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/fundamentos-sql/t5"><small>Anterior</small><strong>← ASC y DESC</strong></a>
          <a class="next" data-route-link href="#/modulo/fundamentos-sql/t7"><small>Siguiente</small><strong>WHERE →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 7. WHERE ============ -->
    <section class="topic" id="t7" data-title="WHERE" data-search="where filtrar condición">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">07</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-where"/></svg>
          <h2>WHERE</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-intermedio"></span> Intermedio</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t7"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Filtra las filas que cumplen una <strong>condición</strong>, antes de que la consulta devuelva el resultado.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> columnas
<span class="k">FROM</span> tabla
<span class="k">WHERE</span> condición;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> nombre, ciudad
<span class="k">FROM</span> empleados
<span class="k">WHERE</span> ciudad = <span class="s">'Bogotá'</span>;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Resultado</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>nombre</th><th>ciudad</th></tr></thead>
            <tbody>
              <tr><td>Ana Torres</td><td>Bogotá</td></tr>
              <tr><td>Marta Ruiz</td><td>Bogotá</td></tr>
              <tr><td>Carla Díaz</td><td>Bogotá</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Evalúa la condición fila por fila y conserva únicamente las que resultan verdaderas.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Siempre que se necesite un subconjunto de datos según una regla.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Comparar texto sin comillas; usar doble igual <code>==</code> en vez de un solo <code>=</code>.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Filtrar por columnas indexadas cuando sea posible, para que la consulta se ejecute más rápido en tablas grandes.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> WHERE se evalúa antes que ORDER BY y LIMIT: primero se filtra y después se ordena y se recorta el resultado.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/fundamentos-sql/t6"><small>Anterior</small><strong>← LIMIT</strong></a>
          <a class="next" data-route-link href="#/modulo/fundamentos-sql/t8"><small>Siguiente</small><strong>Operadores con WHERE →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 8. Operadores con WHERE ============ -->
    <section class="topic" id="t8" data-title="Operadores con WHERE" data-search="operadores and or not comparación">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">08</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-ops"/></svg>
          <h2>Operadores con WHERE</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-intermedio"></span> Intermedio</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t8"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Conjunto de operadores de <strong>comparación</strong> y <strong>lógicos</strong> que se combinan con WHERE para construir condiciones de filtrado.</p>

        <div class="block-label">Operadores de comparación</div>
        <table class="ops">
          <thead><tr><th>Operador</th><th>Significado</th><th>Ejemplo</th></tr></thead>
          <tbody>
            <tr><td class="op">=</td><td>Igual a</td><td><code>WHERE cargo = 'Gerente'</code></td></tr>
            <tr><td class="op">&lt;&gt;  /  !=</td><td>Diferente de</td><td><code>WHERE ciudad &lt;&gt; 'Bogotá'</code></td></tr>
            <tr><td class="op">&gt;</td><td>Mayor que</td><td><code>WHERE salario &gt; 4000000</code></td></tr>
            <tr><td class="op">&lt;</td><td>Menor que</td><td><code>WHERE salario &lt; 3000000</code></td></tr>
            <tr><td class="op">&gt;=</td><td>Mayor o igual que</td><td><code>WHERE salario &gt;= 4200000</code></td></tr>
            <tr><td class="op">&lt;=</td><td>Menor o igual que</td><td><code>WHERE salario &lt;= 3100000</code></td></tr>
          </tbody>
        </table>

        <div class="block-label" style="margin-top:18px;">Operadores lógicos</div>
        <table class="ops">
          <thead><tr><th>Operador</th><th>Significado</th><th>Ejemplo</th></tr></thead>
          <tbody>
            <tr><td class="op">AND</td><td>Cumple ambas condiciones</td><td><code>WHERE ciudad = 'Bogotá' AND salario &gt; 4300000</code></td></tr>
            <tr><td class="op">OR</td><td>Cumple al menos una condición</td><td><code>WHERE ciudad = 'Cali' OR ciudad = 'Medellín'</code></td></tr>
            <tr><td class="op">NOT</td><td>Niega la condición</td><td><code>WHERE NOT cargo = 'Gerente'</code></td></tr>
          </tbody>
        </table>

        <div class="result-label" style="margin-top:20px;"><svg aria-hidden="true"><use href="#i-result"/></svg> Ejemplo con AND: WHERE ciudad = 'Bogotá' AND salario &gt; 4300000</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>nombre</th><th>ciudad</th><th>salario</th></tr></thead>
            <tbody>
              <tr><td>Marta Ruiz</td><td>Bogotá</td><td>4 500 000</td></tr>
              <tr><td>Carla Díaz</td><td>Bogotá</td><td>6 800 000</td></tr>
            </tbody>
          </table>
        </div>

        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Permiten construir condiciones simples (comparación) o combinar varias condiciones (lógicos) dentro de un mismo WHERE.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Cada vez que el filtro necesite algo más que una simple igualdad, o que dependa de más de una columna.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Usar <code>= NULL</code> para comparar con nulos (nunca es verdadero, se debe usar IS NULL); olvidar paréntesis al mezclar AND con OR, lo que cambia el resultado.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Usar paréntesis explícitos al combinar AND y OR, incluso cuando la precedencia por defecto daría el mismo resultado.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> AND tiene mayor precedencia que OR. Si se combinan en la misma condición conviene usar paréntesis, por ejemplo <code>WHERE ciudad = 'Bogotá' AND (cargo = 'Gerente' OR salario &gt; 4000000)</code>, para que la lógica quede explícita.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/fundamentos-sql/t7"><small>Anterior</small><strong>← WHERE</strong></a>
          <a class="next" data-route-link href="#/modulo/fundamentos-sql/t9"><small>Siguiente</small><strong>BETWEEN →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 9. BETWEEN ============ -->
    <section class="topic" id="t9" data-title="BETWEEN" data-search="between rango">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">09</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-between"/></svg>
          <h2>BETWEEN</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-intermedio"></span> Intermedio</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t9"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Filtra valores dentro de un <strong>rango</strong>, incluyendo ambos límites.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">WHERE</span> columna <span class="k">BETWEEN</span> v1 <span class="k">AND</span> v2;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> nombre, salario
<span class="k">FROM</span> empleados
<span class="k">WHERE</span> salario <span class="k">BETWEEN</span> 3000000 <span class="k">AND</span> 4500000;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Resultado</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>nombre</th><th>salario</th></tr></thead>
            <tbody>
              <tr><td>Ana Torres</td><td>4 200 000</td></tr>
              <tr><td>Luis Gómez</td><td>3 100 000</td></tr>
              <tr><td>Marta Ruiz</td><td>4 500 000</td></tr>
              <tr><td>Jorge Peña</td><td>3 100 000</td></tr>
              <tr><td>Sofía León</td><td>4 200 000</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Equivale a <code>columna &gt;= v1 AND columna &lt;= v2</code>, pero más legible.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Rangos de salario, edad, fechas, etc. También funciona con fechas: <code>WHERE fecha_ingreso BETWEEN '2022-01-01' AND '2023-01-01'</code>.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Invertir el orden de los valores (poner primero el mayor); olvidar que ambos límites son inclusivos.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Confirmar el tipo de dato de la columna antes de usar BETWEEN con fechas, ya que el comportamiento puede variar entre motores.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> Marta Ruiz (4 500 000) aparece en el resultado porque el límite superior es inclusivo; Carla Díaz (6 800 000) y Pedro Sánchez (2 600 000) quedan fuera del rango.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/fundamentos-sql/t8"><small>Anterior</small><strong>← Operadores con WHERE</strong></a>
          <a class="next" data-route-link href="#/modulo/fundamentos-sql/t10"><small>Siguiente</small><strong>IN →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 10. IN ============ -->
    <section class="topic" id="t10" data-title="IN" data-search="in lista valores">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">10</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-in"/></svg>
          <h2>IN</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-intermedio"></span> Intermedio</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t10"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Filtra filas cuyo valor coincide con alguno de una <strong>lista</strong> de valores.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">WHERE</span> columna <span class="k">IN</span> (v1, v2, ...);</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> nombre, ciudad
<span class="k">FROM</span> empleados
<span class="k">WHERE</span> ciudad <span class="k">IN</span> (<span class="s">'Bogotá'</span>, <span class="s">'Sogamoso'</span>);</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Resultado</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>nombre</th><th>ciudad</th></tr></thead>
            <tbody>
              <tr><td>Ana Torres</td><td>Bogotá</td></tr>
              <tr><td>Marta Ruiz</td><td>Bogotá</td></tr>
              <tr><td>Carla Díaz</td><td>Bogotá</td></tr>
              <tr><td>Sofía León</td><td>Sogamoso</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Evita escribir varias condiciones OR sobre la misma columna.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Cuando se compara una columna contra un conjunto conocido de valores.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Confundir IN con BETWEEN cuando en realidad se necesita un rango continuo; incluir NULL dentro de la lista sin saber que nunca produce coincidencia.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Preferir IN sobre varias condiciones OR repetidas; el motor suele optimizarlo mejor y la consulta es más corta.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> existe <code>NOT IN</code> para el caso contrario, pero si la lista contiene algún NULL el resultado puede quedar vacío de forma inesperada; en ese caso conviene usar <code>NOT EXISTS</code>.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/fundamentos-sql/t9"><small>Anterior</small><strong>← BETWEEN</strong></a>
          <a class="next" data-route-link href="#/modulo/fundamentos-sql/t11"><small>Siguiente</small><strong>LIKE / ILIKE →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 11. LIKE / ILIKE ============ -->
    <section class="topic" id="t11" data-title="LIKE / ILIKE" data-search="like ilike patrón texto comodín">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">11</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-like"/></svg>
          <h2>LIKE e ILIKE</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-intermedio"></span> Intermedio</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t11"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Buscan <strong>coincidencias de texto</strong> usando patrones con comodines. LIKE distingue mayúsculas y minúsculas; ILIKE no.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">WHERE</span> columna <span class="k">LIKE</span> <span class="s">'patrón'</span>;
<span class="k">WHERE</span> columna <span class="k">ILIKE</span> <span class="s">'patrón'</span>;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> nombre
<span class="k">FROM</span> empleados
<span class="k">WHERE</span> nombre <span class="k">LIKE</span> <span class="s">'A%'</span>;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Resultado: LIKE 'A%'</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>nombre</th></tr></thead>
            <tbody>
              <tr><td>Ana Torres</td></tr>
            </tbody>
          </table>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Comparación: LIKE 'a%' vs ILIKE 'a%' (minúscula)</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>consulta</th><th>coincide con "Ana Torres"</th></tr></thead>
            <tbody>
              <tr><td><code>LIKE 'a%'</code></td><td>No, distingue mayúsculas</td></tr>
              <tr><td><code>ILIKE 'a%'</code></td><td>Sí, ignora mayúsculas</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p><code>%</code> representa cualquier cantidad de caracteres (incluido ninguno); <code>_</code> representa exactamente un carácter.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Búsquedas de texto parciales: nombres, correos, descripciones.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Olvidar el comodín <code>%</code> y terminar buscando una coincidencia exacta; asumir que LIKE ignora mayúsculas (solo ILIKE lo hace).</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Evitar el comodín <code>%</code> al inicio del patrón en tablas grandes, porque impide el uso eficiente de índices.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> ILIKE es específico de PostgreSQL. En otros motores el mismo efecto se logra con <code>LOWER(columna) LIKE LOWER('patrón')</code>.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/fundamentos-sql/t10"><small>Anterior</small><strong>← IN</strong></a>
          <a class="next" data-route-link href="#/modulo/fundamentos-sql/t12"><small>Siguiente</small><strong>IS NULL →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 12. IS NULL ============ -->
    <section class="topic" id="t12" data-title="IS NULL" data-search="is null nulo ausente">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">12</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-isnull"/></svg>
          <h2>IS NULL</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-intermedio"></span> Intermedio</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t12"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Verifica si una columna <strong>no tiene ningún valor</strong> asignado.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">WHERE</span> columna <span class="k">IS NULL</span>;
<span class="k">WHERE</span> columna <span class="k">IS NOT NULL</span>;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> nombre
<span class="k">FROM</span> empleados
<span class="k">WHERE</span> correo <span class="k">IS NULL</span>;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Resultado</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>nombre</th></tr></thead>
            <tbody>
              <tr><td>Luis Gómez</td></tr>
              <tr><td>Jorge Peña</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Identifica filas donde el dato está ausente, algo distinto de una cadena vacía <code>''</code> o de un cero.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Para detectar datos incompletos antes de un análisis o antes de cargar información a otra tabla.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Escribir <code>columna = NULL</code> en lugar de <code>columna IS NULL</code>; esa comparación nunca es verdadera, sin importar el valor.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Revisar con IS NULL los datos incompletos antes de cualquier análisis o exportación, para no descartar filas por error.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> el opuesto es <code>IS NOT NULL</code>, útil para quedarse solo con los registros completos, por ejemplo antes de enviar correos masivos.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/fundamentos-sql/t11"><small>Anterior</small><strong>← LIKE / ILIKE</strong></a>
          <span></span>
        </nav>
      </div>
    </section>`;

  var EXERCISES_META = [
    {
      id: 'ex1',
      type: 'mcq',
      prompt: '¿Qué cláusula indica de qué tabla se van a leer los datos?',
      options: ['SELECT', 'FROM', 'WHERE', 'LIMIT'],
      correct: 1,
      explanation: 'FROM especifica la tabla de origen; SELECT indica qué columnas, WHERE filtra filas y LIMIT recorta el número de filas devueltas.'
    },
    {
      id: 'ex2',
      type: 'write',
      prompt: 'Escribe la cláusula que ordena los resultados de mayor a menor según la columna <code>salario</code>.',
      placeholder: 'ORDER BY salario DESC',
      answers: ['order by salario desc'],
      explanation: 'ORDER BY fija la columna de orden; DESC invierte el orden por defecto (ascendente) a descendente.'
    },
    {
      id: 'ex3',
      type: 'mcq',
      prompt: '¿Cuál operador filtra un rango de valores incluyendo ambos límites?',
      options: ['IN', 'LIKE', 'BETWEEN', 'IS NULL'],
      correct: 2,
      explanation: 'BETWEEN v1 AND v2 incluye tanto v1 como v2 en el resultado, a diferencia de una comparación estrictamente menor/mayor.'
    },
    {
      id: 'ex4',
      type: 'write',
      prompt: 'Escribe la condición que filtra los empleados cuyo <code>cargo</code> sea exactamente "Gerente".',
      placeholder: "cargo = 'Gerente'",
      answers: ["cargo = 'gerente'"],
      explanation: 'El operador = compara igualdad exacta; el texto debe ir entre comillas simples en SQL.'
    },
    {
      id: 'ex5',
      type: 'mcq',
      prompt: '¿Qué patrón de LIKE encuentra los nombres que empiezan por "A"?',
      options: ["'%A'", "'A%'", "'_A%'", "'A_'"],
      correct: 1,
      explanation: 'El comodín % representa cualquier cantidad de caracteres (incluido ninguno); \'A%\' busca textos que comienzan con A.'
    },
    {
      id: 'ex6',
      type: 'write',
      prompt: 'Escribe la condición para encontrar filas donde la columna <code>correo</code> no tiene ningún valor asignado.',
      placeholder: 'correo IS NULL',
      answers: ['correo is null'],
      explanation: 'IS NULL verifica ausencia de valor; nunca se usa "= NULL" porque esa comparación nunca resulta verdadera.'
    }
  ];

  window.App = window.App || {};
  window.App.modules = window.App.modules || {};
  window.App.modules['fundamentos-sql'] = {
    id: 'fundamentos-sql',
    topicsMeta: TOPICS_META,
    heroHtml: HERO_HTML,
    schemaHtml: SCHEMA_HTML,
    topicsHtml: TOPICS_HTML,
    exercisesMeta: EXERCISES_META
  };

})();
