/* ============================================================
   MÓDULO: Filtrado de datos
   Contenido puro (sin header/sidebar/footer del shell). Misma
   forma que fundamentos-sql/content.js: TOPICS_META + HERO_HTML
   + SCHEMA_HTML + TOPICS_HTML, registrados en App.modules con el
   id que aparece en modules/registry.js.
   ============================================================ */
(function(){
  'use strict';

  var TOPICS_META = [
    { id:'t1', num:'01', title:'BETWEEN',            level:'basico',     search:'between rango fechas límites inclusivo' },
    { id:'t2', num:'02', title:'IN',                 level:'basico',     search:'in lista valores pertenencia' },
    { id:'t3', num:'03', title:'LIKE',               level:'basico',     search:'like patrón comodín porcentaje guion bajo texto' },
    { id:'t4', num:'04', title:'ILIKE',              level:'intermedio', search:'ilike mayúsculas minúsculas insensible case postgresql' },
    { id:'t5', num:'05', title:'IS NULL / NOT NULL', level:'intermedio', search:'is null not null nulo ausente vacío' },
    { id:'t6', num:'06', title:'Negaciones con NOT', level:'intermedio', search:'not in not between not like negación excluir' }
  ];

  var HERO_HTML = `<header class="hero">
      <h1>Filtrado de datos</h1>
      <p class="sub">Los operadores que hacen al WHERE realmente expresivo: rangos, listas, patrones de texto, valores nulos y sus negaciones. Todos los ejemplos usan la misma tabla base del módulo anterior.</p>
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

  var TOPICS_HTML = `<!-- ============ 1. BETWEEN ============ -->
    <section class="topic" id="t1" data-title="BETWEEN" data-search="between rango fechas límites inclusivo">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">01</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-between"/></svg>
          <h2>BETWEEN</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-basico"></span> Básico</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t1"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Filtra valores dentro de un <strong>rango</strong>, incluyendo ambos límites. Funciona con números, fechas y texto.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">WHERE</span> columna <span class="k">BETWEEN</span> v1 <span class="k">AND</span> v2;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> nombre, fecha_ingreso
<span class="k">FROM</span> empleados
<span class="k">WHERE</span> fecha_ingreso <span class="k">BETWEEN</span> '2022-01-01' <span class="k">AND</span> '2022-12-31';</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Resultado</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>nombre</th><th>fecha_ingreso</th></tr></thead>
            <tbody>
              <tr><td>Ana Torres</td><td>2022-03-15</td></tr>
              <tr><td>Jorge Peña</td><td>2022-09-01</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Equivale a <code>columna &gt;= v1 AND columna &lt;= v2</code>, con una lectura más natural del rango.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Rangos de fechas (un año, un trimestre), franjas de salario o intervalos de cualquier columna ordenable.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Invertir los límites (<code>BETWEEN v2 AND v1</code> devuelve cero filas); usar BETWEEN sobre <code>timestamp</code> esperando incluir todo el último día, cuando <code>'2022-12-31'</code> se interpreta como la medianoche que lo inicia.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Para columnas <code>timestamp</code>, preferir <code>columna &gt;= inicio AND columna &lt; fin_exclusivo</code>; para columnas <code>date</code>, BETWEEN es claro y suficiente.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> Luis Gómez (2023-01-10) queda fuera aunque "entró hace poco": el rango pedido es exactamente el año 2022 y ambos límites son inclusivos.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <span></span>
          <a class="next" data-route-link href="#/modulo/filtrado-de-datos/t2"><small>Siguiente</small><strong>IN →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 2. IN ============ -->
    <section class="topic" id="t2" data-title="IN" data-search="in lista valores pertenencia">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">02</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-in"/></svg>
          <h2>IN</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-basico"></span> Básico</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t2"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Comprueba si el valor de una columna pertenece a una <strong>lista de valores</strong> concreta.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">WHERE</span> columna <span class="k">IN</span> (v1, v2, v3);</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> nombre, ciudad
<span class="k">FROM</span> empleados
<span class="k">WHERE</span> ciudad <span class="k">IN</span> ('Cali', 'Sogamoso');</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Resultado</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>nombre</th><th>ciudad</th></tr></thead>
            <tbody>
              <tr><td>Pedro Sánchez</td><td>Cali</td></tr>
              <tr><td>Sofía León</td><td>Sogamoso</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Reemplaza una cadena de <code>OR</code> (<code>ciudad = 'Cali' OR ciudad = 'Sogamoso'</code>) por una condición compacta y legible.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Cuando los valores válidos son 3, 5 o 10 opciones concretas: ciudades, estados, categorías, ids seleccionados.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Esperar que <code>IN</code> encuentre filas con <code>NULL</code> (la comparación con nulos no es verdadera); mezclar tipos de dato distintos dentro de la lista.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Si la lista sale de otra tabla, usar <code>IN (SELECT ...)</code> en lugar de escribir los valores a mano: se verá en el módulo de subconsultas.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> el orden de los valores dentro del paréntesis no afecta el resultado; IN solo evalúa pertenencia, no orden.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/filtrado-de-datos/t1"><small>Anterior</small><strong>← BETWEEN</strong></a>
          <a class="next" data-route-link href="#/modulo/filtrado-de-datos/t3"><small>Siguiente</small><strong>LIKE →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 3. LIKE ============ -->
    <section class="topic" id="t3" data-title="LIKE" data-search="like patrón comodín porcentaje guion bajo texto">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">03</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-like"/></svg>
          <h2>LIKE</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-basico"></span> Básico</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t3"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Compara texto contra un <strong>patrón</strong> usando comodines: <code>%</code> (cero o más caracteres) y <code>_</code> (exactamente un carácter). Distingue mayúsculas de minúsculas.</p>

        <div class="block-label">Comodines</div>
        <table class="ops">
          <thead><tr><th>Comodín</th><th>Significado</th><th>Ejemplo</th></tr></thead>
          <tbody>
            <tr><td class="op">%</td><td>Cero o más caracteres</td><td><code>'Ana%'</code>: empieza por "Ana"</td></tr>
            <tr><td class="op">_</td><td>Exactamente un carácter</td><td><code>'An_'</code>: "Ana", "Ano", pero no "Anas"</td></tr>
            <tr><td class="op">%...%</td><td>Contiene el texto</td><td><code>'%Datos%'</code>: "Datos" en cualquier posición</td></tr>
          </tbody>
        </table>

        <div class="grid2" style="margin-top:18px;">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">WHERE</span> columna <span class="k">LIKE</span> 'patrón';</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> nombre, cargo
<span class="k">FROM</span> empleados
<span class="k">WHERE</span> cargo <span class="k">LIKE</span> 'Analista%';</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Resultado</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>nombre</th><th>cargo</th></tr></thead>
            <tbody>
              <tr><td>Luis Gómez</td><td>Analista</td></tr>
              <tr><td>Pedro Sánchez</td><td>Analista Junior</td></tr>
              <tr><td>Jorge Peña</td><td>Analista</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Devuelve las filas cuyo texto encaja con el patrón completo; <code>'Analista%'</code> acepta "Analista" y todo lo que empiece igual.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Búsquedas por prefijo ("empieza por"), sufijo ("termina en") o contenido ("contiene") en columnas de texto.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Olvidar el <code>%</code> y convertir el patrón en una igualdad exacta; asumir que <code>'analista%'</code> encuentra "Analista": LIKE es sensible a mayúsculas.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Preferir patrones con prefijo fijo (<code>'Ana%'</code>) cuando sea posible: pueden aprovechar índices, mientras que <code>'%Ana%'</code> obliga a recorrer toda la tabla.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> con esta misma tabla, <code>WHERE nombre LIKE '_a%'</code> devuelve a Carla Díaz y Marta Ruiz: la <code>_</code> consume el primer carácter y exige una "a" en la segunda posición.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/filtrado-de-datos/t2"><small>Anterior</small><strong>← IN</strong></a>
          <a class="next" data-route-link href="#/modulo/filtrado-de-datos/t4"><small>Siguiente</small><strong>ILIKE →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 4. ILIKE ============ -->
    <section class="topic" id="t4" data-title="ILIKE" data-search="ilike mayúsculas minúsculas insensible case postgresql">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">04</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-like"/></svg>
          <h2>ILIKE</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-intermedio"></span> Intermedio</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t4"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Versión de LIKE <strong>insensible a mayúsculas y minúsculas</strong>. Es una extensión propia de PostgreSQL, no SQL estándar.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">WHERE</span> columna <span class="k">ILIKE</span> 'patrón';</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> nombre, cargo
<span class="k">FROM</span> empleados
<span class="k">WHERE</span> cargo <span class="k">ILIKE</span> 'ingeniera%';</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Resultado</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>nombre</th><th>cargo</th></tr></thead>
            <tbody>
              <tr><td>Ana Torres</td><td>Ingeniera de Datos</td></tr>
              <tr><td>Marta Ruiz</td><td>Ingeniera de Datos</td></tr>
              <tr><td>Sofía León</td><td>Ingeniera de Datos</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Encaja el patrón ignorando la diferencia entre mayúsculas y minúsculas: <code>'ingeniera%'</code> encuentra "Ingeniera de Datos" aunque el patrón esté en minúscula.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Búsquedas escritas por usuarios (formularios, buscadores) donde nadie garantiza cómo capitalizaron el texto guardado.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Usar ILIKE en consultas que deben ser portables a otros motores (MySQL, SQL Server no lo tienen); aplicarlo a columnas enormes sin índice adecuado y sorprenderse por la lentitud.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>La alternativa portable es <code>WHERE LOWER(cargo) LIKE 'ingeniera%'</code>: mismo efecto, SQL estándar, y prepara el terreno para el módulo de funciones.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> con LIKE en lugar de ILIKE, este mismo ejemplo devuelve cero filas: en la tabla el cargo empieza con "I" mayúscula y el patrón está en minúscula.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/filtrado-de-datos/t3"><small>Anterior</small><strong>← LIKE</strong></a>
          <a class="next" data-route-link href="#/modulo/filtrado-de-datos/t5"><small>Siguiente</small><strong>IS NULL / NOT NULL →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 5. IS NULL / IS NOT NULL ============ -->
    <section class="topic" id="t5" data-title="IS NULL / NOT NULL" data-search="is null not null nulo ausente vacío">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">05</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-isnull"/></svg>
          <h2>IS NULL / IS NOT NULL</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-intermedio"></span> Intermedio</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t5"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Comprueba si un valor está <strong>ausente</strong> (<code>IS NULL</code>) o <strong>presente</strong> (<code>IS NOT NULL</code>). Es la única forma correcta de preguntar por nulos.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">WHERE</span> columna <span class="k">IS NULL</span>;
<span class="k">WHERE</span> columna <span class="k">IS NOT NULL</span>;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> nombre, correo
<span class="k">FROM</span> empleados
<span class="k">WHERE</span> correo <span class="k">IS NULL</span>;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Resultado</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>nombre</th><th>correo</th></tr></thead>
            <tbody>
              <tr><td>Luis Gómez</td><td class="null">NULL</td></tr>
              <tr><td>Jorge Peña</td><td class="null">NULL</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>NULL significa "valor desconocido": no es cero ni cadena vacía, y por eso ningún <code>=</code> o <code>&lt;&gt;</code> lo detecta.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Auditorías de calidad de datos (¿a quién le falta el correo?) o filtros previos a procesos que exigen el dato, como envíos masivos.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Escribir <code>WHERE correo = NULL</code> (nunca es verdadero, devuelve cero filas); confundir NULL con la cadena vacía <code>''</code>, que sí es un valor.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Definir columnas como <code>NOT NULL</code> desde el diseño cuando el dato es obligatorio evita tener que filtrar nulos después.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> la consulta opuesta, <code>WHERE correo IS NOT NULL</code>, devuelve las otras 5 filas; entre ambas siempre suman el total de la tabla.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/filtrado-de-datos/t4"><small>Anterior</small><strong>← ILIKE</strong></a>
          <a class="next" data-route-link href="#/modulo/filtrado-de-datos/t6"><small>Siguiente</small><strong>Negaciones con NOT →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 6. Negaciones con NOT ============ -->
    <section class="topic" id="t6" data-title="Negaciones con NOT" data-search="not in not between not like negación excluir">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">06</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-ops"/></svg>
          <h2>Negaciones con NOT</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-intermedio"></span> Intermedio</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t6"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Cada operador de este módulo tiene su forma <strong>negada</strong>: sirve para <strong>excluir</strong> filas en lugar de incluirlas.</p>

        <div class="block-label">Formas negadas</div>
        <table class="ops">
          <thead><tr><th>Operador</th><th>Significado</th><th>Ejemplo</th></tr></thead>
          <tbody>
            <tr><td class="op">NOT IN</td><td>No pertenece a la lista</td><td><code>WHERE ciudad NOT IN ('Bogotá')</code></td></tr>
            <tr><td class="op">NOT BETWEEN</td><td>Fuera del rango</td><td><code>WHERE salario NOT BETWEEN 3000000 AND 4500000</code></td></tr>
            <tr><td class="op">NOT LIKE / NOT ILIKE</td><td>No encaja con el patrón</td><td><code>WHERE cargo NOT LIKE 'Analista%'</code></td></tr>
            <tr><td class="op">IS NOT NULL</td><td>El valor existe</td><td><code>WHERE correo IS NOT NULL</code></td></tr>
          </tbody>
        </table>

        <div class="result-label" style="margin-top:20px;"><svg aria-hidden="true"><use href="#i-result"/></svg> Ejemplo con NOT IN: WHERE ciudad NOT IN ('Bogotá')</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>nombre</th><th>ciudad</th></tr></thead>
            <tbody>
              <tr><td>Luis Gómez</td><td>Medellín</td></tr>
              <tr><td>Pedro Sánchez</td><td>Cali</td></tr>
              <tr><td>Jorge Peña</td><td>Medellín</td></tr>
              <tr><td>Sofía León</td><td>Sogamoso</td></tr>
            </tbody>
          </table>
        </div>

        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Invierte la condición: lo que el operador incluiría, la forma negada lo excluye, y viceversa.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Cuando es más corto describir lo que <em>no</em> se quiere: "todos menos la sede principal", "salarios fuera de la banda estándar".</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p><code>NOT IN</code> con una lista que contiene NULL devuelve cero filas siempre; esperar que <code>ciudad NOT IN ('Bogotá')</code> incluya filas donde ciudad sea NULL: los nulos tampoco pasan la negación.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Si la columna admite nulos y deben incluirse, hacerlo explícito: <code>WHERE ciudad NOT IN ('Bogotá') OR ciudad IS NULL</code>.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> ningún empleado con correo NULL aparece en filtros de igualdad ni de negación sobre esa columna; NULL no es "distinto de", es "desconocido". Por eso IS NULL / IS NOT NULL son operadores aparte.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/filtrado-de-datos/t5"><small>Anterior</small><strong>← IS NULL / NOT NULL</strong></a>
          <span></span>
        </nav>
      </div>
    </section>`;

  var EXERCISES_META = [
    {
      id: 'ex1',
      type: 'mcq',
      prompt: '¿Cuál es la diferencia principal entre LIKE e ILIKE en PostgreSQL?',
      options: ['No hay diferencia', 'ILIKE ignora mayúsculas y minúsculas', 'LIKE es siempre más rápido', 'ILIKE solo funciona con números'],
      correct: 1,
      explanation: 'ILIKE es específico de PostgreSQL y hace la comparación insensible a mayúsculas/minúsculas; LIKE sí las distingue.'
    },
    {
      id: 'ex2',
      type: 'write',
      prompt: 'Escribe la condición que excluye a los empleados cuyo <code>cargo</code> sea "Gerente" o "Analista", usando NOT IN.',
      placeholder: "cargo NOT IN ('Gerente', 'Analista')",
      answers: ["cargo not in ('gerente', 'analista')", "cargo not in ('analista', 'gerente')"],
      explanation: 'NOT IN excluye las filas cuyo valor coincide con alguno de la lista; cuidado si la lista pudiera contener NULL, porque el resultado quedaría vacío de forma inesperada.'
    },
    {
      id: 'ex3',
      type: 'mcq',
      prompt: '¿Qué condición es equivalente a <code>NOT (salario BETWEEN 3000000 AND 4000000)</code>?',
      options: ['salario &lt; 3000000 OR salario &gt; 4000000', 'salario &lt; 3000000 AND salario &gt; 4000000', 'salario BETWEEN 4000000 AND 3000000', 'salario &lt;&gt; 3000000'],
      correct: 0,
      explanation: 'Negar un rango cerrado equivale a quedar por fuera de ambos límites: menor que el mínimo, o mayor que el máximo.'
    },
    {
      id: 'ex4',
      type: 'write',
      prompt: 'Escribe la condición para encontrar filas donde la columna <code>correo</code> sí tiene un valor asignado.',
      placeholder: 'correo IS NOT NULL',
      answers: ['correo is not null'],
      explanation: 'IS NOT NULL es el opuesto de IS NULL: selecciona las filas donde el dato está presente.'
    },
    {
      id: 'ex5',
      type: 'mcq',
      prompt: '¿Qué patrón de LIKE encuentra los correos que terminan en "empresa.com"?',
      options: ["'%empresa.com'", "'empresa.com%'", "'_empresa.com'", "'%empresa.com%%'"],
      correct: 0,
      explanation: 'El comodín % al inicio permite cualquier texto antes de "empresa.com", que debe quedar exactamente al final del patrón.'
    }
  ];

  window.App = window.App || {};
  window.App.modules = window.App.modules || {};
  window.App.modules['filtrado-de-datos'] = {
    id: 'filtrado-de-datos',
    topicsMeta: TOPICS_META,
    heroHtml: HERO_HTML,
    schemaHtml: SCHEMA_HTML,
    topicsHtml: TOPICS_HTML,
    exercisesMeta: EXERCISES_META
  };

})();
