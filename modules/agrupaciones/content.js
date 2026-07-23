/* ============================================================
   MÓDULO: Agrupaciones
   Misma forma que los módulos anteriores: TOPICS_META + HERO_HTML
   + SCHEMA_HTML + TOPICS_HTML + EXERCISES_META, registrados en
   App.modules con el id que aparece en modules/registry.js.
   ============================================================ */
(function(){
  'use strict';

  var TOPICS_META = [
    { id:'t1', num:'01', title:'COUNT',      level:'basico',     search:'count contar filas registros' },
    { id:'t2', num:'02', title:'SUM',        level:'basico',     search:'sum suma total numerico' },
    { id:'t3', num:'03', title:'AVG',        level:'basico',     search:'avg promedio media numerico' },
    { id:'t4', num:'04', title:'MIN y MAX',  level:'basico',     search:'min max minimo maximo' },
    { id:'t5', num:'05', title:'GROUP BY',   level:'intermedio', search:'group by agrupar categorias' },
    { id:'t6', num:'06', title:'HAVING',     level:'intermedio', search:'having filtrar grupos agregacion' }
  ];

  var HERO_HTML = `<header class="hero">
      <h1>Agrupaciones y funciones de agregación</h1>
      <p class="sub">COUNT, SUM, AVG, MIN, MAX, y las cláusulas GROUP BY y HAVING para resumir filas en cifras por categoría. Todos los ejemplos usan la misma tabla base de los módulos anteriores.</p>
      <p style="margin:0 0 14px 0; font-size:12.5px; color:var(--ink-3);">Por Nelson Leonardo Páez Arias</p>
      <div class="hero__meta">
        <span><svg aria-hidden="true"><use href="#i-check"/></svg> <span id="heroCompletedCount">0/6</span> completados</span>
        <span><svg aria-hidden="true"><use href="#i-hash"/></svg> 6 temas</span>
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

  var TOPICS_HTML = `<!-- ============ 1. COUNT ============ -->
    <section class="topic" id="t1" data-title="COUNT" data-search="count contar filas registros">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">01</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-agg-func"/></svg>
          <h2>COUNT</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-basico"></span> Básico</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t1"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Cuenta la <strong>cantidad de filas</strong> de un resultado, o la cantidad de valores no nulos de una columna.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">COUNT</span>(*)
<span class="k">COUNT</span>(columna)</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> <span class="k">COUNT</span>(*) <span class="k">AS</span> total,
       <span class="k">COUNT</span>(correo) <span class="k">AS</span> con_correo
<span class="k">FROM</span> empleados;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Resultado</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>total</th><th>con_correo</th></tr></thead>
            <tbody>
              <tr><td>7</td><td>5</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p><code>COUNT(*)</code> cuenta todas las filas; <code>COUNT(columna)</code> cuenta solo las filas donde esa columna no es NULL.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Para saber cuántos registros cumplen una condición, o cuántos tienen un dato completo (como el correo).</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Confundir <code>COUNT(columna)</code> con <code>COUNT(*)</code> esperando el mismo resultado; difieren exactamente en la cantidad de NULL que tenga esa columna.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Usar <code>COUNT(DISTINCT columna)</code> cuando lo que interesa es la cantidad de valores únicos, no el total de filas.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> con_correo da 5 porque Luis Gómez y Jorge Peña tienen correo NULL; COUNT(*) sí los cuenta porque evalúa la fila completa, no una columna en particular.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <span></span>
          <a class="next" data-route-link href="#/modulo/agrupaciones/t2"><small>Siguiente</small><strong>SUM →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 2. SUM ============ -->
    <section class="topic" id="t2" data-title="SUM" data-search="sum suma total numerico">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">02</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-agg-func"/></svg>
          <h2>SUM</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-basico"></span> Básico</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t2"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Suma todos los valores <strong>numéricos</strong> de una columna en un solo resultado.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">SUM</span>(columna)</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> <span class="k">SUM</span>(salario) <span class="k">AS</span> nomina_total
<span class="k">FROM</span> empleados;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Resultado</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>nomina_total</th></tr></thead>
            <tbody>
              <tr><td>28 500 000</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Suma los valores de la columna en todas las filas del resultado; ignora los valores NULL, no los trata como cero.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Totales de nómina, ventas, inventario: cualquier cifra que deba sumarse a lo largo de muchas filas.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Aplicar SUM sobre una columna de texto o fecha, donde no tiene sentido; olvidar filtrar antes con WHERE cuando solo interesa sumar un subconjunto de filas.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Si la tabla puede no tener filas que cumplan la condición, recordar que SUM devuelve NULL (no 0) en ese caso; envolver con <code>COALESCE(SUM(columna), 0)</code> si se necesita un cero explícito.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> 28 500 000 es la suma de los 7 salarios de la tabla; SUM no necesita GROUP BY cuando el resultado es un único total general.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/agrupaciones/t1"><small>Anterior</small><strong>← COUNT</strong></a>
          <a class="next" data-route-link href="#/modulo/agrupaciones/t3"><small>Siguiente</small><strong>AVG →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 3. AVG ============ -->
    <section class="topic" id="t3" data-title="AVG" data-search="avg promedio media numerico">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">03</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-agg-func"/></svg>
          <h2>AVG</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-basico"></span> Básico</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t3"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Calcula el <strong>promedio</strong> (media aritmética) de los valores de una columna numérica.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">AVG</span>(columna)</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> <span class="k">ROUND</span>(<span class="k">AVG</span>(salario), 0) <span class="k">AS</span> salario_promedio
<span class="k">FROM</span> empleados;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Resultado</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>salario_promedio</th></tr></thead>
            <tbody>
              <tr><td>4 071 429</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Equivale a <code>SUM(columna) / COUNT(columna)</code>, pero ignorando NULL tanto en la suma como en el divisor.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Salario promedio, calificación promedio, tiempo promedio de respuesta: cualquier cifra representativa de un conjunto.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Interpretar el promedio como si describiera a "la mayoría": un solo salario muy alto (como el de Carla Díaz) puede subir el promedio por encima de lo que gana la mayoría del equipo.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Combinar AVG con ROUND para presentación, y considerar reportar también la mediana cuando los datos tienen valores extremos.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> 28 500 000 ÷ 7 = 4 071 428.57…, redondeado a 4 071 429 con ROUND(..., 0).</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/agrupaciones/t2"><small>Anterior</small><strong>← SUM</strong></a>
          <a class="next" data-route-link href="#/modulo/agrupaciones/t4"><small>Siguiente</small><strong>MIN y MAX →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 4. MIN y MAX ============ -->
    <section class="topic" id="t4" data-title="MIN y MAX" data-search="min max minimo maximo">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">04</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-agg-func"/></svg>
          <h2>MIN y MAX</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-basico"></span> Básico</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t4"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Devuelven el valor <strong>más pequeño</strong> y el <strong>más grande</strong> de una columna.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">MIN</span>(columna)
<span class="k">MAX</span>(columna)</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> <span class="k">MIN</span>(salario) <span class="k">AS</span> minimo,
       <span class="k">MAX</span>(salario) <span class="k">AS</span> maximo
<span class="k">FROM</span> empleados;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Resultado</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>minimo</th><th>maximo</th></tr></thead>
            <tbody>
              <tr><td>2 600 000</td><td>6 800 000</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Recorren todos los valores no nulos de la columna y devuelven el extremo correspondiente; también funcionan con fechas y texto (orden alfabético).</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Rangos de precios, fecha de ingreso más antigua o más reciente, límites de cualquier columna ordenable.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Confundir MIN/MAX de agregación con las funciones de comparación entre dos valores (como <code>GREATEST()</code>/<code>LEAST()</code>), que trabajan fila por fila en vez de sobre un grupo.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Combinar con GROUP BY para obtener extremos por categoría, por ejemplo el salario máximo por ciudad, en lugar de solo el general.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> Pedro Sánchez (2 600 000) tiene el salario más bajo y Carla Díaz (6 800 000) el más alto de toda la tabla.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/agrupaciones/t3"><small>Anterior</small><strong>← AVG</strong></a>
          <a class="next" data-route-link href="#/modulo/agrupaciones/t5"><small>Siguiente</small><strong>GROUP BY →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 5. GROUP BY ============ -->
    <section class="topic" id="t5" data-title="GROUP BY" data-search="group by agrupar categorias">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">05</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-mod-agrupaciones"/></svg>
          <h2>GROUP BY</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-intermedio"></span> Intermedio</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t5"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Agrupa filas que comparten el mismo valor en una o varias columnas, para aplicar <strong>funciones de agregación</strong> a cada grupo por separado.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> columna, <span class="k">FUNC_AGREGACION</span>(otra)
<span class="k">FROM</span> tabla
<span class="k">GROUP BY</span> columna;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> ciudad, <span class="k">COUNT</span>(*) <span class="k">AS</span> cantidad,
       <span class="k">ROUND</span>(<span class="k">AVG</span>(salario), 0) <span class="k">AS</span> salario_promedio
<span class="k">FROM</span> empleados
<span class="k">GROUP BY</span> ciudad
<span class="k">ORDER BY</span> ciudad;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Resultado</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>ciudad</th><th>cantidad</th><th>salario_promedio</th></tr></thead>
            <tbody>
              <tr><td>Bogotá</td><td>3</td><td>5 166 667</td></tr>
              <tr><td>Cali</td><td>1</td><td>2 600 000</td></tr>
              <tr><td>Medellín</td><td>2</td><td>3 100 000</td></tr>
              <tr><td>Sogamoso</td><td>1</td><td>4 200 000</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Colapsa todas las filas de un mismo grupo en una sola fila de resultado, aplicando la función de agregación dentro de cada grupo.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Reportes por categoría: ventas por mes, empleados por ciudad, pedidos por cliente.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Incluir en el SELECT una columna que no está ni en GROUP BY ni dentro de una función de agregación: PostgreSQL lo rechaza porque no sabría qué valor mostrar de ese grupo.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Agregar siempre un ORDER BY explícito después de GROUP BY: el orden de los grupos no está garantizado si no se pide.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> Bogotá promedia 5 166 667 porque agrupa a Ana (4 200 000), Marta (4 500 000) y Carla (6 800 000); el salario alto de Carla sube el promedio de todo el grupo.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/agrupaciones/t4"><small>Anterior</small><strong>← MIN y MAX</strong></a>
          <a class="next" data-route-link href="#/modulo/agrupaciones/t6"><small>Siguiente</small><strong>HAVING →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 6. HAVING ============ -->
    <section class="topic" id="t6" data-title="HAVING" data-search="having filtrar grupos agregacion">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">06</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-where"/></svg>
          <h2>HAVING</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-intermedio"></span> Intermedio</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t6"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Filtra <strong>grupos</strong> ya formados por GROUP BY, según una condición sobre una función de agregación.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">GROUP BY</span> columna
<span class="k">HAVING</span> condición_con_agregacion;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> ciudad, <span class="k">COUNT</span>(*) <span class="k">AS</span> cantidad
<span class="k">FROM</span> empleados
<span class="k">GROUP BY</span> ciudad
<span class="k">HAVING</span> <span class="k">COUNT</span>(*) > 1
<span class="k">ORDER BY</span> ciudad;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Resultado</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>ciudad</th><th>cantidad</th></tr></thead>
            <tbody>
              <tr><td>Bogotá</td><td>3</td></tr>
              <tr><td>Medellín</td><td>2</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Se evalúa después de formar los grupos, así que puede usar funciones de agregación como COUNT, SUM o AVG en su condición; WHERE no puede hacer eso.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Para quedarse solo con los grupos que superan un umbral: ciudades con más de un empleado, clientes con más de N compras.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Usar HAVING para filtrar filas individuales antes de agrupar (eso es trabajo de WHERE); usar WHERE con una función de agregación, que PostgreSQL rechaza directamente.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Filtrar primero con WHERE lo que se pueda filtrar fila por fila (más eficiente), y dejar HAVING solo para condiciones sobre el resultado agregado.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> Cali y Sogamoso desaparecen del resultado porque cada una agrupa un solo empleado; el orden de evaluación completo es FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/agrupaciones/t5"><small>Anterior</small><strong>← GROUP BY</strong></a>
          <span></span>
        </nav>
      </div>
    </section>`;

  var EXERCISES_META = [
    {
      id: 'ex1',
      type: 'mcq',
      prompt: '¿Cuál es la diferencia entre <code>COUNT(*)</code> y <code>COUNT(correo)</code> sobre la tabla empleados?',
      options: ['Ninguna, dan siempre el mismo resultado', 'COUNT(correo) ignora las filas donde correo es NULL', 'COUNT(*) ignora las filas con NULL en cualquier columna', 'COUNT(correo) cuenta caracteres, no filas'],
      correct: 1,
      explanation: 'COUNT(columna) solo cuenta las filas donde esa columna tiene un valor no nulo; COUNT(*) cuenta todas las filas sin excepción.'
    },
    {
      id: 'ex2',
      type: 'write',
      prompt: 'Escribe la función que calcula el salario máximo de la tabla <code>empleados</code>, con el alias <code>maximo</code>.',
      placeholder: 'MAX(salario) AS maximo',
      answers: ['max(salario) as maximo'],
      explanation: 'MAX(columna) devuelve el valor más alto de la columna indicada; AS le da nombre a la columna resultante.'
    },
    {
      id: 'ex3',
      type: 'mcq',
      prompt: '¿Qué ocurre si el SELECT incluye una columna que no está ni en GROUP BY ni dentro de una función de agregación?',
      options: ['PostgreSQL la ignora automáticamente', 'PostgreSQL devuelve un error', 'PostgreSQL muestra un valor al azar de esa columna', 'PostgreSQL la agrupa igual sin avisar'],
      correct: 1,
      explanation: 'PostgreSQL exige que cada columna del SELECT esté en el GROUP BY o dentro de una función de agregación, porque de lo contrario no hay un único valor posible para esa columna dentro del grupo.'
    },
    {
      id: 'ex4',
      type: 'mcq',
      prompt: '¿Cuál es la diferencia principal entre WHERE y HAVING?',
      options: ['Son exactamente lo mismo', 'WHERE filtra antes de agrupar, HAVING filtra después de agrupar', 'HAVING es más rápido siempre', 'WHERE solo funciona con texto'],
      correct: 1,
      explanation: 'WHERE filtra filas individuales antes de que se formen los grupos; HAVING filtra los grupos ya formados, por eso puede usar funciones de agregación en su condición.'
    },
    {
      id: 'ex5',
      type: 'write',
      prompt: 'Escribe la cláusula que agrupa las filas de <code>empleados</code> por la columna <code>cargo</code>.',
      placeholder: 'GROUP BY cargo',
      answers: ['group by cargo'],
      explanation: 'GROUP BY cargo colapsa todas las filas con el mismo cargo en un solo grupo, listo para aplicarle funciones de agregación.'
    }
  ];

  window.App = window.App || {};
  window.App.modules = window.App.modules || {};
  window.App.modules['agrupaciones'] = {
    id: 'agrupaciones',
    topicsMeta: TOPICS_META,
    heroHtml: HERO_HTML,
    schemaHtml: SCHEMA_HTML,
    topicsHtml: TOPICS_HTML,
    exercisesMeta: EXERCISES_META
  };

})();
