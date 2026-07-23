/* ============================================================
   MÓDULO: Operaciones de conjuntos (DQL: Consultar datos)
   Combina el resultado de dos consultas con UNION, INTERSECT y
   EXCEPT. Va después de Subconsultas, como consulta avanzada.
   Misma forma que el resto de módulos; resultados simulados.
   ============================================================ */
(function(){
  'use strict';

  var TOPICS_META = [
    { id:'t1', num:'01', title:'UNION',          level:'intermedio', search:'union combinar sin duplicados apilar' },
    { id:'t2', num:'02', title:'UNION ALL',      level:'intermedio', search:'union all conservar duplicados rendimiento' },
    { id:'t3', num:'03', title:'INTERSECT',      level:'intermedio', search:'intersect interseccion comunes ambas' },
    { id:'t4', num:'04', title:'EXCEPT',         level:'intermedio', search:'except diferencia minus faltantes' },
    { id:'t5', num:'05', title:'Reglas y ORDER BY', level:'intermedio', search:'reglas columnas compatibles order by al final' }
  ];

  var HERO_HTML = `<header class="hero">
      <h1>Operaciones de conjuntos: combinar consultas</h1>
      <p class="sub">Si un <code>JOIN</code> combina tablas <em>a lo ancho</em>, las operaciones de conjuntos combinan resultados <em>a lo alto</em>: apilan filas de dos consultas. Verás <code>UNION</code>, <code>UNION ALL</code>, <code>INTERSECT</code> y <code>EXCEPT</code> sobre <code>empleados</code> y <code>departamentos</code>.</p>
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
                <th>ciudad<span class="type">text</span></th>
                <th>departamento_id<span class="type">integer</span></th>
                <th>jefe_id<span class="type">integer</span></th>
              </tr>
            </thead>
            <tbody>
              <tr><td>1</td><td>Ana Torres</td><td>Ingeniera de Datos</td><td>4 200 000</td><td>Bogotá</td><td>1</td><td>5</td></tr>
              <tr><td>2</td><td>Luis Gómez</td><td>Analista</td><td>3 100 000</td><td>Medellín</td><td>2</td><td>5</td></tr>
              <tr><td>3</td><td>Marta Ruiz</td><td>Ingeniera de Datos</td><td>4 500 000</td><td>Bogotá</td><td>1</td><td>1</td></tr>
              <tr><td>4</td><td>Pedro Sánchez</td><td>Analista Junior</td><td>2 600 000</td><td>Cali</td><td>2</td><td>2</td></tr>
              <tr><td>5</td><td>Carla Díaz</td><td>Gerente</td><td>6 800 000</td><td>Bogotá</td><td class="null">NULL</td><td class="null">NULL</td></tr>
              <tr><td>6</td><td>Jorge Peña</td><td>Analista</td><td>3 100 000</td><td>Medellín</td><td>2</td><td>5</td></tr>
              <tr><td>7</td><td>Sofía León</td><td>Ingeniera de Datos</td><td>4 200 000</td><td>Sogamoso</td><td>1</td><td>1</td></tr>
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

  var TOPICS_HTML = `<!-- ============ 1. UNION ============ -->
    <section class="topic" id="t1" data-title="UNION" data-search="union combinar sin duplicados apilar">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">01</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-mod-sets"/></svg>
          <h2>UNION</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-intermedio"></span> Intermedio</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t1"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Combina los resultados de dos consultas en uno solo, <strong>eliminando las filas duplicadas</strong>.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> columnas <span class="k">FROM</span> tabla1
<span class="k">UNION</span>
<span class="k">SELECT</span> columnas <span class="k">FROM</span> tabla2;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> nombre <span class="k">FROM</span> empleados <span class="k">WHERE</span> ciudad = <span class="s">'Bogotá'</span>
<span class="k">UNION</span>
<span class="k">SELECT</span> nombre <span class="k">FROM</span> empleados <span class="k">WHERE</span> salario &gt; 4000000;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> 4 filas (sin duplicados)</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>nombre</th></tr></thead>
            <tbody>
              <tr><td>Ana Torres</td></tr>
              <tr><td>Marta Ruiz</td></tr>
              <tr><td>Carla Díaz</td></tr>
              <tr><td>Sofía León</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Apila las filas de las dos consultas y quita las repetidas: Ana, Marta y Carla aparecían en ambas, pero salen una sola vez.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Unir listas obtenidas con condiciones o tablas distintas en un único resultado sin repetidos.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Que las dos consultas no tengan el mismo número de columnas, o tipos incompatibles: PostgreSQL lo rechaza.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Las columnas deben coincidir en orden y tipo; el nombre de las columnas del resultado lo pone la primera consulta.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> quitar duplicados tiene un costo (hay que ordenar y comparar). Si sabes que no habrá repetidos, <code>UNION ALL</code> es más rápido (siguiente tema).</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <span></span>
          <a class="next" data-route-link href="#/modulo/operaciones-conjuntos/t2"><small>Siguiente</small><strong>UNION ALL →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 2. UNION ALL ============ -->
    <section class="topic" id="t2" data-title="UNION ALL" data-search="union all conservar duplicados rendimiento">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">02</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-mod-sets"/></svg>
          <h2>UNION ALL</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-intermedio"></span> Intermedio</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t2"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Igual que <code>UNION</code>, pero <strong>conserva los duplicados</strong> en lugar de eliminarlos.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> columnas <span class="k">FROM</span> tabla1
<span class="k">UNION ALL</span>
<span class="k">SELECT</span> columnas <span class="k">FROM</span> tabla2;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> nombre <span class="k">FROM</span> empleados <span class="k">WHERE</span> ciudad = <span class="s">'Bogotá'</span>
<span class="k">UNION ALL</span>
<span class="k">SELECT</span> nombre <span class="k">FROM</span> empleados <span class="k">WHERE</span> salario &gt; 4000000;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> 7 filas (con repetidos)</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>nombre</th><th>origen</th></tr></thead>
            <tbody>
              <tr><td>Ana Torres</td><td>Bogotá</td></tr>
              <tr><td>Marta Ruiz</td><td>Bogotá</td></tr>
              <tr><td>Carla Díaz</td><td>Bogotá</td></tr>
              <tr><td>Ana Torres</td><td>salario &gt; 4M</td></tr>
              <tr><td>Marta Ruiz</td><td>salario &gt; 4M</td></tr>
              <tr><td>Carla Díaz</td><td>salario &gt; 4M</td></tr>
              <tr><td>Sofía León</td><td>salario &gt; 4M</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Apila ambos resultados sin comparar ni quitar nada; Ana, Marta y Carla salen dos veces (la columna "origen" es solo para ilustrar de dónde viene cada una).</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Cuando sabes que no hay duplicados, o cuando justamente quieres conservarlos para contarlos.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Usar <code>UNION</code> (que deduplica) cuando en realidad necesitabas todas las filas: cambia silenciosamente el conteo.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Preferir <code>UNION ALL</code> por rendimiento, salvo que de verdad necesites eliminar duplicados.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> <code>UNION ALL</code> es más rápido porque no ordena ni compara las filas: solo las concatena.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/operaciones-conjuntos/t1"><small>Anterior</small><strong>← UNION</strong></a>
          <a class="next" data-route-link href="#/modulo/operaciones-conjuntos/t3"><small>Siguiente</small><strong>INTERSECT →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 3. INTERSECT ============ -->
    <section class="topic" id="t3" data-title="INTERSECT" data-search="intersect interseccion comunes ambas">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">03</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-join-inner"/></svg>
          <h2>INTERSECT</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-intermedio"></span> Intermedio</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t3"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Devuelve solo las filas que aparecen en <strong>ambas</strong> consultas: la intersección de los dos resultados.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> columnas <span class="k">FROM</span> tabla1
<span class="k">INTERSECT</span>
<span class="k">SELECT</span> columnas <span class="k">FROM</span> tabla2;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> nombre <span class="k">FROM</span> empleados <span class="k">WHERE</span> ciudad = <span class="s">'Bogotá'</span>
<span class="k">INTERSECT</span>
<span class="k">SELECT</span> nombre <span class="k">FROM</span> empleados <span class="k">WHERE</span> salario &gt; 4000000;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> 3 filas (en ambas listas)</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>nombre</th></tr></thead>
            <tbody>
              <tr><td>Ana Torres</td></tr>
              <tr><td>Marta Ruiz</td></tr>
              <tr><td>Carla Díaz</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Devuelve los empleados de Bogotá que además ganan más de 4.000.000: lo común a las dos consultas.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Cuando dos criterios se calculan por separado y quieres las filas que cumplen los dos.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Confundirlo con un <code>WHERE ... AND ...</code>: aquí se comparan <em>resultados completos</em>, no columnas de una misma fila.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Para condiciones sobre la misma tabla, muchas veces un <code>AND</code> es más simple; <code>INTERSECT</code> brilla al cruzar consultas distintas.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> <code>INTERSECT</code> también elimina duplicados; existe <code>INTERSECT ALL</code> para conservarlos.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/operaciones-conjuntos/t2"><small>Anterior</small><strong>← UNION ALL</strong></a>
          <a class="next" data-route-link href="#/modulo/operaciones-conjuntos/t4"><small>Siguiente</small><strong>EXCEPT →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 4. EXCEPT ============ -->
    <section class="topic" id="t4" data-title="EXCEPT" data-search="except diferencia minus faltantes">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">04</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-join-left"/></svg>
          <h2>EXCEPT</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-intermedio"></span> Intermedio</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t4"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Devuelve las filas de la <strong>primera</strong> consulta que <strong>no</strong> aparecen en la segunda: la diferencia entre conjuntos.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> columnas <span class="k">FROM</span> tabla1
<span class="k">EXCEPT</span>
<span class="k">SELECT</span> columnas <span class="k">FROM</span> tabla2;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> nombre <span class="k">FROM</span> empleados <span class="k">WHERE</span> salario &gt; 4000000
<span class="k">EXCEPT</span>
<span class="k">SELECT</span> nombre <span class="k">FROM</span> empleados <span class="k">WHERE</span> ciudad = <span class="s">'Bogotá'</span>;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> 1 fila (gana &gt; 4M pero no es de Bogotá)</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>nombre</th></tr></thead>
            <tbody>
              <tr><td>Sofía León</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Toma los que ganan más de 4M y les resta los de Bogotá: queda Sofía León (gana 4.2M pero es de Sogamoso).</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Encontrar "los que cumplen X pero no Y": clientes sin pedidos, productos sin ventas, etc.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>El orden importa: <code>A EXCEPT B</code> no es lo mismo que <code>B EXCEPT A</code>.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Muy útil para detectar faltantes comparando dos listas; recuerda que también elimina duplicados.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> <code>EXCEPT</code> conserva duplicados con <code>EXCEPT ALL</code>. En algunos motores esta operación se llama <code>MINUS</code>.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/operaciones-conjuntos/t3"><small>Anterior</small><strong>← INTERSECT</strong></a>
          <a class="next" data-route-link href="#/modulo/operaciones-conjuntos/t5"><small>Siguiente</small><strong>Reglas y ORDER BY →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 5. Reglas y ORDER BY ============ -->
    <section class="topic" id="t5" data-title="Reglas y ORDER BY" data-search="reglas columnas compatibles order by al final">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">05</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-orderby"/></svg>
          <h2>Reglas y ORDER BY</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-intermedio"></span> Intermedio</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t5"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Las consultas combinadas deben tener el <strong>mismo número de columnas</strong> y tipos compatibles; el <code>ORDER BY</code> se escribe <strong>una sola vez, al final</strong>.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> col <span class="k">FROM</span> a
<span class="k">UNION</span>
<span class="k">SELECT</span> col <span class="k">FROM</span> b
<span class="k">ORDER BY</span> col;   <span class="c">-- ordena el resultado combinado</span></pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> nombre, salario <span class="k">FROM</span> empleados <span class="k">WHERE</span> ciudad = <span class="s">'Bogotá'</span>
<span class="k">UNION</span>
<span class="k">SELECT</span> nombre, salario <span class="k">FROM</span> empleados <span class="k">WHERE</span> ciudad = <span class="s">'Medellín'</span>
<span class="k">ORDER BY</span> salario <span class="k">DESC</span>;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> 5 filas ordenadas por salario</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>nombre</th><th>salario</th></tr></thead>
            <tbody>
              <tr><td>Carla Díaz</td><td>6 800 000</td></tr>
              <tr><td>Marta Ruiz</td><td>4 500 000</td></tr>
              <tr><td>Ana Torres</td><td>4 200 000</td></tr>
              <tr><td>Luis Gómez</td><td>3 100 000</td></tr>
              <tr><td>Jorge Peña</td><td>3 100 000</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>El <code>ORDER BY</code> final ordena todo el resultado ya combinado, no cada consulta por separado.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Siempre que quieras un orden concreto sobre el resultado de una operación de conjuntos.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Poner un <code>ORDER BY</code> dentro de cada <code>SELECT</code>: no está permitido en las ramas, solo al final.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Los nombres de columna del resultado los define la <strong>primera</strong> consulta; ordena usando esos nombres.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> lo que empareja las columnas es su <em>posición</em>, no su nombre: la 1.ª columna de arriba se combina con la 1.ª de abajo, y así.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/operaciones-conjuntos/t4"><small>Anterior</small><strong>← EXCEPT</strong></a>
          <span></span>
        </nav>
      </div>
    </section>`;

  var EXERCISES_META = [
    {
      id: 'ex1',
      type: 'mcq',
      prompt: '¿Qué hace UNION?',
      options: ['Combina los resultados de dos consultas y elimina los duplicados', 'Multiplica las filas de ambas', 'Hace un JOIN entre las tablas', 'Ordena una consulta'],
      correct: 0,
      explanation: 'UNION apila las filas de dos consultas compatibles y quita las repetidas.'
    },
    {
      id: 'ex2',
      type: 'mcq',
      prompt: '¿Cuál es la diferencia entre UNION y UNION ALL?',
      options: ['UNION ALL conserva los duplicados y es más rápido; UNION los elimina', 'Son exactamente iguales', 'UNION ALL ordena el resultado', 'UNION conserva los duplicados'],
      correct: 0,
      explanation: 'UNION deduplica (más costoso); UNION ALL solo concatena, conservando repetidos y siendo más rápido.'
    },
    {
      id: 'ex3',
      type: 'mcq',
      prompt: '¿Qué devuelve INTERSECT?',
      options: ['Las filas que aparecen en ambas consultas', 'Todas las filas de ambas', 'Solo las de la primera', 'Ninguna fila'],
      correct: 0,
      explanation: 'INTERSECT devuelve la intersección: lo que está presente en las dos consultas.'
    },
    {
      id: 'ex4',
      type: 'write',
      prompt: 'Escribe el operador de conjuntos que devuelve las filas de la primera consulta que NO están en la segunda.',
      placeholder: 'EXCEPT',
      answers: ['except', 'except all', 'minus'],
      explanation: 'EXCEPT (llamado MINUS en algunos motores) devuelve la diferencia: primera consulta menos la segunda.'
    },
    {
      id: 'ex5',
      type: 'mcq',
      prompt: 'Al combinar consultas con UNION, ¿dónde va el ORDER BY?',
      options: ['Una sola vez, al final del conjunto', 'En cada SELECT por separado', 'No se permite ordenar', 'Al inicio de la primera consulta'],
      correct: 0,
      explanation: 'El ORDER BY se escribe una vez al final y ordena el resultado ya combinado.'
    }
  ];

  window.App = window.App || {};
  window.App.modules = window.App.modules || {};
  window.App.modules['operaciones-conjuntos'] = {
    id: 'operaciones-conjuntos',
    topicsMeta: TOPICS_META,
    heroHtml: HERO_HTML,
    schemaHtml: SCHEMA_HTML,
    topicsHtml: TOPICS_HTML,
    exercisesMeta: EXERCISES_META
  };

})();
