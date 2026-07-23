/* ============================================================
   MÓDULO: JOINs
   Misma forma que los módulos anteriores, con una diferencia: los
   JOIN necesitan más de una tabla. SCHEMA_HTML por eso envuelve dos
   bloques .schema dentro de un único #schemaTable (module-view.js
   solo oculta/muestra ese contenedor durante la búsqueda, así que
   no hizo falta tocar ningún archivo compartido). La tabla
   empleados se extiende con departamento_id y jefe_id sobre la
   misma base de los módulos anteriores.
   ============================================================ */
(function(){
  'use strict';

  var TOPICS_META = [
    { id:'t1', num:'01', title:'INNER JOIN',      level:'basico',     search:'inner join coincidencias interseccion' },
    { id:'t2', num:'02', title:'LEFT JOIN',       level:'basico',     search:'left join izquierda todas las filas' },
    { id:'t3', num:'03', title:'RIGHT JOIN',      level:'basico',     search:'right join derecha todas las filas' },
    { id:'t4', num:'04', title:'FULL JOIN',       level:'intermedio', search:'full join outer union completo' },
    { id:'t5', num:'05', title:'Alias de tablas', level:'basico',     search:'alias tablas ambiguedad as' },
    { id:'t6', num:'06', title:'SELF JOIN',       level:'intermedio', search:'self join tabla consigo misma jerarquia' },
    { id:'t7', num:'07', title:'CROSS JOIN',      level:'intermedio', search:'cross join producto cartesiano combinaciones' }
  ];

  var HERO_HTML = `<header class="hero">
      <h1>JOINs: combinar tablas relacionadas</h1>
      <p class="sub">INNER, LEFT, RIGHT, FULL, SELF y CROSS JOIN, con alias de tabla explícitos. A partir de aquí los ejemplos usan dos tablas: la misma <code>empleados</code> de los módulos anteriores, ahora con dos columnas de relación, y una nueva tabla <code>departamentos</code>.</p>
      <p style="margin:0 0 14px 0; font-size:12.5px; color:var(--ink-3);">Por Nelson Leonardo Páez Arias</p>
      <div class="hero__meta">
        <span><svg aria-hidden="true"><use href="#i-check"/></svg> <span id="heroCompletedCount">0/7</span> completados</span>
        <span><svg aria-hidden="true"><use href="#i-hash"/></svg> 7 temas</span>
        <span><svg aria-hidden="true"><use href="#i-result"/></svg> 2 tablas relacionadas</span>
      </div>
    </header>`;

  var SCHEMA_HTML = `<div id="schemaTable">
      <div class="schema">
        <div class="schema-head">
          <span>tabla base &nbsp;<span class="tag">empleados</span></span>
          <span class="tag">7 filas · +2 columnas de relación</span>
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
                <th>departamento_id<span class="type">integer</span></th>
                <th>jefe_id<span class="type">integer</span></th>
              </tr>
            </thead>
            <tbody>
              <tr><td>1</td><td>Ana Torres</td><td>Ingeniera de Datos</td><td>4 200 000</td><td>Bogotá</td><td>2022-03-15</td><td>ana.torres@empresa.com</td><td>1</td><td>5</td></tr>
              <tr><td>2</td><td>Luis Gómez</td><td>Analista</td><td>3 100 000</td><td>Medellín</td><td>2023-01-10</td><td class="null">NULL</td><td>2</td><td>5</td></tr>
              <tr><td>3</td><td>Marta Ruiz</td><td>Ingeniera de Datos</td><td>4 500 000</td><td>Bogotá</td><td>2021-11-02</td><td>marta.ruiz@empresa.com</td><td>1</td><td>1</td></tr>
              <tr><td>4</td><td>Pedro Sánchez</td><td>Analista Junior</td><td>2 600 000</td><td>Cali</td><td>2023-06-20</td><td>pedro.sanchez@empresa.com</td><td>2</td><td>2</td></tr>
              <tr><td>5</td><td>Carla Díaz</td><td>Gerente</td><td>6 800 000</td><td>Bogotá</td><td>2019-08-30</td><td>carla.diaz@empresa.com</td><td class="null">NULL</td><td class="null">NULL</td></tr>
              <tr><td>6</td><td>Jorge Peña</td><td>Analista</td><td>3 100 000</td><td>Medellín</td><td>2022-09-01</td><td class="null">NULL</td><td>2</td><td>5</td></tr>
              <tr><td>7</td><td>Sofía León</td><td>Ingeniera de Datos</td><td>4 200 000</td><td>Sogamoso</td><td>2023-02-14</td><td>sofia.leon@empresa.com</td><td>1</td><td>1</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="schema">
        <div class="schema-head">
          <span>tabla nueva &nbsp;<span class="tag">departamentos</span></span>
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

  var TOPICS_HTML = `<!-- ============ 1. INNER JOIN ============ -->
    <section class="topic" id="t1" data-title="INNER JOIN" data-search="inner join coincidencias interseccion">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">01</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-join-inner"/></svg>
          <h2>INNER JOIN</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-basico"></span> Básico</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t1"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Combina dos tablas y devuelve <strong>solo las filas que tienen coincidencia</strong> en ambas.</p>
        <figure class="venn-figure">
          <svg class="venn" viewBox="0 0 100 60" role="img" aria-label="Diagrama de INNER JOIN: solo la intersección">
            <defs><clipPath id="vennInnerClip"><circle cx="38" cy="30" r="22"/></clipPath></defs>
            <circle class="venn__fill" cx="62" cy="30" r="22" clip-path="url(#vennInnerClip)"/>
            <circle class="venn__ring" cx="38" cy="30" r="22"/>
            <circle class="venn__ring" cx="62" cy="30" r="22"/>
          </svg>
          <figcaption>
            <p>Se devuelven solo las filas <strong>resaltadas</strong>: los empleados cuyo <code>departamento_id</code> coincide con un departamento. Los que no coinciden quedan fuera.</p>
            <span class="venn-legend">izquierda: empleados · derecha: departamentos</span>
          </figcaption>
        </figure>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> columnas
<span class="k">FROM</span> tabla1
<span class="k">INNER JOIN</span> tabla2 <span class="k">ON</span> condición;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> e.nombre, d.nombre <span class="k">AS</span> departamento
<span class="k">FROM</span> empleados e
<span class="k">INNER JOIN</span> departamentos d <span class="k">ON</span> e.departamento_id = d.id
<span class="k">ORDER BY</span> e.nombre;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Resultado</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>nombre</th><th>departamento</th></tr></thead>
            <tbody>
              <tr><td>Ana Torres</td><td>Tecnología</td></tr>
              <tr><td>Jorge Peña</td><td>Comercial</td></tr>
              <tr><td>Luis Gómez</td><td>Comercial</td></tr>
              <tr><td>Marta Ruiz</td><td>Tecnología</td></tr>
              <tr><td>Pedro Sánchez</td><td>Comercial</td></tr>
              <tr><td>Sofía León</td><td>Tecnología</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Recorre ambas tablas y conserva únicamente las combinaciones donde la condición ON resulta verdadera.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Cuando solo interesan los registros completos, con relación garantizada en ambos lados (por ejemplo, empleados que sí tienen departamento asignado).</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Olvidar la cláusula ON (produce un cruce de todas las filas contra todas, no un JOIN real); usar INNER JOIN esperando ver también los registros sin coincidencia.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Usar siempre alias cortos de tabla (<code>e</code>, <code>d</code>) cuando hay más de una tabla involucrada; hace la consulta más legible y evita ambigüedad en columnas con el mismo nombre.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> Carla Díaz no aparece porque su <code>departamento_id</code> es NULL: no tiene coincidencia en <code>departamentos</code>, y por eso INNER JOIN la descarta.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <span></span>
          <a class="next" data-route-link href="#/modulo/joins/t2"><small>Siguiente</small><strong>LEFT JOIN →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 2. LEFT JOIN ============ -->
    <section class="topic" id="t2" data-title="LEFT JOIN" data-search="left join izquierda todas las filas">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">02</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-join-left"/></svg>
          <h2>LEFT JOIN</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-basico"></span> Básico</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t2"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Conserva <strong>todas las filas de la tabla izquierda</strong>, tengan o no coincidencia en la derecha.</p>
        <figure class="venn-figure">
          <svg class="venn" viewBox="0 0 100 60" role="img" aria-label="Diagrama de LEFT JOIN: toda la tabla izquierda">
            <circle class="venn__fill" cx="38" cy="30" r="22"/>
            <circle class="venn__ring" cx="38" cy="30" r="22"/>
            <circle class="venn__ring" cx="62" cy="30" r="22"/>
          </svg>
          <figcaption>
            <p>Se devuelven <strong>todas</strong> las filas de la tabla izquierda (empleados), coincidan o no. Donde no hay coincidencia, las columnas de la derecha llegan en <code>NULL</code>.</p>
            <span class="venn-legend">izquierda: empleados · derecha: departamentos</span>
          </figcaption>
        </figure>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> columnas
<span class="k">FROM</span> tabla1
<span class="k">LEFT JOIN</span> tabla2 <span class="k">ON</span> condición;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> e.nombre, d.nombre <span class="k">AS</span> departamento
<span class="k">FROM</span> empleados e
<span class="k">LEFT JOIN</span> departamentos d <span class="k">ON</span> e.departamento_id = d.id
<span class="k">ORDER BY</span> e.nombre;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Resultado</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>nombre</th><th>departamento</th></tr></thead>
            <tbody>
              <tr><td>Ana Torres</td><td>Tecnología</td></tr>
              <tr><td>Carla Díaz</td><td class="null">NULL</td></tr>
              <tr><td>Jorge Peña</td><td>Comercial</td></tr>
              <tr><td>Luis Gómez</td><td>Comercial</td></tr>
              <tr><td>Marta Ruiz</td><td>Tecnología</td></tr>
              <tr><td>Pedro Sánchez</td><td>Comercial</td></tr>
              <tr><td>Sofía León</td><td>Tecnología</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Cuando no hay coincidencia en la tabla derecha, rellena esas columnas con NULL en vez de descartar la fila.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Para no perder registros de la tabla principal aunque falte información relacionada: "todos los empleados, tengan o no departamento".</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Filtrar después con <code>WHERE d.id = 3</code> en vez de <code>WHERE d.id = 3 OR d.id IS NULL</code>: un WHERE normal sobre la tabla derecha elimina silenciosamente las filas sin coincidencia, anulando el efecto del LEFT JOIN.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Usar LEFT JOIN + <code>WHERE d.id IS NULL</code> como patrón clásico para encontrar registros sin relación (aquí, empleados sin departamento).</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> a diferencia del INNER JOIN del tema anterior, aquí Carla Díaz sí aparece, con NULL en la columna departamento.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/joins/t1"><small>Anterior</small><strong>← INNER JOIN</strong></a>
          <a class="next" data-route-link href="#/modulo/joins/t3"><small>Siguiente</small><strong>RIGHT JOIN →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 3. RIGHT JOIN ============ -->
    <section class="topic" id="t3" data-title="RIGHT JOIN" data-search="right join derecha todas las filas">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">03</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-join-right"/></svg>
          <h2>RIGHT JOIN</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-basico"></span> Básico</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t3"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Conserva <strong>todas las filas de la tabla derecha</strong>, tengan o no coincidencia en la izquierda. Es el espejo de LEFT JOIN.</p>
        <figure class="venn-figure">
          <svg class="venn" viewBox="0 0 100 60" role="img" aria-label="Diagrama de RIGHT JOIN: toda la tabla derecha">
            <circle class="venn__fill" cx="62" cy="30" r="22"/>
            <circle class="venn__ring" cx="38" cy="30" r="22"/>
            <circle class="venn__ring" cx="62" cy="30" r="22"/>
          </svg>
          <figcaption>
            <p>El espejo del LEFT: se devuelven <strong>todas</strong> las filas de la tabla derecha (departamentos), coincidan o no. Un departamento sin empleados aparece con las columnas de la izquierda en <code>NULL</code>.</p>
            <span class="venn-legend">izquierda: empleados · derecha: departamentos</span>
          </figcaption>
        </figure>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> columnas
<span class="k">FROM</span> tabla1
<span class="k">RIGHT JOIN</span> tabla2 <span class="k">ON</span> condición;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> e.nombre, d.nombre <span class="k">AS</span> departamento
<span class="k">FROM</span> empleados e
<span class="k">RIGHT JOIN</span> departamentos d <span class="k">ON</span> e.departamento_id = d.id
<span class="k">ORDER BY</span> d.nombre, e.nombre;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Resultado</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>nombre</th><th>departamento</th></tr></thead>
            <tbody>
              <tr><td>Jorge Peña</td><td>Comercial</td></tr>
              <tr><td>Luis Gómez</td><td>Comercial</td></tr>
              <tr><td>Pedro Sánchez</td><td>Comercial</td></tr>
              <tr><td class="null">NULL</td><td>Marketing</td></tr>
              <tr><td class="null">NULL</td><td>Recursos Humanos</td></tr>
              <tr><td>Ana Torres</td><td>Tecnología</td></tr>
              <tr><td>Marta Ruiz</td><td>Tecnología</td></tr>
              <tr><td>Sofía León</td><td>Tecnología</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Aquí "Marketing" y "Recursos Humanos" aparecen con NULL en nombre de empleado: son departamentos sin nadie asignado todavía.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Para no perder registros de la tabla "de catálogo" aunque no tengan relación aún: "todos los departamentos, tengan o no empleados".</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Usarlo por costumbre cuando en realidad un LEFT JOIN invirtiendo el orden de las tablas sería más legible; ambos son equivalentes, pero LEFT JOIN suele leerse más natural.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Muchos equipos evitan RIGHT JOIN por convención y reescriben la consulta como LEFT JOIN cambiando el orden de <code>FROM</code>; el resultado es idéntico y suele ser más fácil de leer de corrido.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> esta misma consulta escrita como LEFT JOIN sería <code>FROM departamentos d LEFT JOIN empleados e ON e.departamento_id = d.id</code>: mismo resultado, orden de tablas invertido.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/joins/t2"><small>Anterior</small><strong>← LEFT JOIN</strong></a>
          <a class="next" data-route-link href="#/modulo/joins/t4"><small>Siguiente</small><strong>FULL JOIN →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 4. FULL JOIN ============ -->
    <section class="topic" id="t4" data-title="FULL JOIN" data-search="full join outer union completo">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">04</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-join-full"/></svg>
          <h2>FULL JOIN</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-intermedio"></span> Intermedio</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t4"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Conserva <strong>todas las filas de ambas tablas</strong>, con coincidencia o sin ella.</p>
        <figure class="venn-figure">
          <svg class="venn" viewBox="0 0 100 60" role="img" aria-label="Diagrama de FULL JOIN: ambas tablas completas">
            <circle class="venn__fill" cx="38" cy="30" r="22"/>
            <circle class="venn__fill" cx="62" cy="30" r="22"/>
            <circle class="venn__ring" cx="38" cy="30" r="22"/>
            <circle class="venn__ring" cx="62" cy="30" r="22"/>
          </svg>
          <figcaption>
            <p>Se devuelven <strong>todas</strong> las filas de ambas tablas. Donde no hay coincidencia, el lado que falta llega en <code>NULL</code>. La zona central, más intensa, son las filas que coinciden en las dos.</p>
            <span class="venn-legend">izquierda: empleados · derecha: departamentos</span>
          </figcaption>
        </figure>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> columnas
<span class="k">FROM</span> tabla1
<span class="k">FULL JOIN</span> tabla2 <span class="k">ON</span> condición;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> e.nombre, d.nombre <span class="k">AS</span> departamento
<span class="k">FROM</span> empleados e
<span class="k">FULL JOIN</span> departamentos d <span class="k">ON</span> e.departamento_id = d.id
<span class="k">ORDER BY</span> d.nombre, e.nombre;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Resultado</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>nombre</th><th>departamento</th></tr></thead>
            <tbody>
              <tr><td>Jorge Peña</td><td>Comercial</td></tr>
              <tr><td>Luis Gómez</td><td>Comercial</td></tr>
              <tr><td>Pedro Sánchez</td><td>Comercial</td></tr>
              <tr><td class="null">NULL</td><td>Marketing</td></tr>
              <tr><td class="null">NULL</td><td>Recursos Humanos</td></tr>
              <tr><td>Ana Torres</td><td>Tecnología</td></tr>
              <tr><td>Marta Ruiz</td><td>Tecnología</td></tr>
              <tr><td>Sofía León</td><td>Tecnología</td></tr>
              <tr><td>Carla Díaz</td><td class="null">NULL</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Es la unión de lo que darían un LEFT JOIN y un RIGHT JOIN por separado: nada se pierde de ninguna de las dos tablas.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Auditorías de datos: encontrar de un vistazo tanto los empleados sin departamento como los departamentos sin empleados.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Usar FULL JOIN por defecto cuando en realidad se necesitaba un INNER o LEFT JOIN: suele producir muchas más filas con NULL de las esperadas y complica el resto de la consulta.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Si el objetivo es detectar huérfanos de un solo lado, casi siempre alcanza con LEFT JOIN + IS NULL; reservar FULL JOIN para cuando de verdad importan ambos lados a la vez.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> esta consulta reúne en una sola tabla el caso del LEFT JOIN (Carla Díaz sin departamento) y el caso del RIGHT JOIN (Marketing y Recursos Humanos sin empleados).</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/joins/t3"><small>Anterior</small><strong>← RIGHT JOIN</strong></a>
          <a class="next" data-route-link href="#/modulo/joins/t5"><small>Siguiente</small><strong>Alias de tablas →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 5. Alias de tablas ============ -->
    <section class="topic" id="t5" data-title="Alias de tablas" data-search="alias tablas ambiguedad as">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">05</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-mod-joins"/></svg>
          <h2>Alias de tablas</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-basico"></span> Básico</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t5"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Nombres cortos temporales para una tabla dentro de una consulta, indispensables cuando dos tablas tienen <strong>columnas con el mismo nombre</strong>.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">FROM</span> tabla <span class="k">AS</span> alias
<span class="k">FROM</span> tabla alias  <span class="c">-- AS es opcional</span></pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> e.nombre <span class="k">AS</span> empleado, d.nombre <span class="k">AS</span> departamento
<span class="k">FROM</span> empleados <span class="k">AS</span> e
<span class="k">JOIN</span> departamentos <span class="k">AS</span> d <span class="k">ON</span> e.departamento_id = d.id
<span class="k">ORDER BY</span> e.nombre;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Resultado</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>empleado</th><th>departamento</th></tr></thead>
            <tbody>
              <tr><td>Ana Torres</td><td>Tecnología</td></tr>
              <tr><td>Jorge Peña</td><td>Comercial</td></tr>
              <tr><td>Luis Gómez</td><td>Comercial</td></tr>
              <tr><td>Marta Ruiz</td><td>Tecnología</td></tr>
              <tr><td>Pedro Sánchez</td><td>Comercial</td></tr>
              <tr><td>Sofía León</td><td>Tecnología</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Tanto empleados como departamentos tienen una columna llamada <code>nombre</code>: sin alias, <code>SELECT nombre</code> sería ambiguo y PostgreSQL rechazaría la consulta.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>En cualquier consulta con dos o más tablas, incluso si por ahora no hay columnas repetidas: facilita agregar más JOIN después sin romper nada.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Definir el alias en el FROM y seguir usando el nombre completo de la tabla en el resto de la consulta; una vez declarado el alias, hay que usarlo en todas partes.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Elegir alias que se entiendan a simple vista (<code>e</code> por empleados, <code>d</code> por departamentos) en vez de letras arbitrarias como <code>a</code>, <code>b</code>, <code>c</code>.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> AS también sirve para renombrar columnas del resultado (<code>e.nombre AS empleado</code>), un uso distinto pero relacionado: ambos casos son "ponerle una etiqueta temporal a algo".</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/joins/t4"><small>Anterior</small><strong>← FULL JOIN</strong></a>
          <a class="next" data-route-link href="#/modulo/joins/t6"><small>Siguiente</small><strong>SELF JOIN →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 6. SELF JOIN ============ -->
    <section class="topic" id="t6" data-title="SELF JOIN" data-search="self join tabla consigo misma jerarquia">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">06</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-join-self"/></svg>
          <h2>SELF JOIN</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-intermedio"></span> Intermedio</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t6"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Une una tabla <strong>consigo misma</strong>, tratándola como si fueran dos tablas distintas gracias a los alias.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">FROM</span> tabla t1
<span class="k">JOIN</span> tabla t2 <span class="k">ON</span> t1.col_relacion = t2.col_clave;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> e.nombre <span class="k">AS</span> empleado, j.nombre <span class="k">AS</span> jefe
<span class="k">FROM</span> empleados e
<span class="k">JOIN</span> empleados j <span class="k">ON</span> e.jefe_id = j.id
<span class="k">ORDER BY</span> e.nombre;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Resultado</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>empleado</th><th>jefe</th></tr></thead>
            <tbody>
              <tr><td>Ana Torres</td><td>Carla Díaz</td></tr>
              <tr><td>Jorge Peña</td><td>Carla Díaz</td></tr>
              <tr><td>Luis Gómez</td><td>Carla Díaz</td></tr>
              <tr><td>Marta Ruiz</td><td>Ana Torres</td></tr>
              <tr><td>Pedro Sánchez</td><td>Luis Gómez</td></tr>
              <tr><td>Sofía León</td><td>Ana Torres</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>PostgreSQL lee <code>empleados e</code> y <code>empleados j</code> como dos copias lógicas independientes de la misma tabla, cada una con su propio alias.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Jerarquías dentro de una misma tabla: empleado/jefe, categoría/subcategoría, ciudad/ciudad vecina.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Omitir los alias: <code>FROM empleados JOIN empleados ON ...</code> es ambiguo, PostgreSQL no puede distinguir a qué "copia" se refiere cada columna.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Usar LEFT JOIN en vez de INNER JOIN cuando la jerarquía puede tener raíces sin padre (como Carla Díaz, que no tiene jefe), para no perder esas filas del resultado.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> Carla Díaz no aparece como "empleado" en este INNER JOIN porque su <code>jefe_id</code> es NULL; sí aparece como "jefe" de Ana, Luis y Jorge.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/joins/t5"><small>Anterior</small><strong>← Alias de tablas</strong></a>
          <a class="next" data-route-link href="#/modulo/joins/t7"><small>Siguiente</small><strong>CROSS JOIN →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 7. CROSS JOIN ============ -->
    <section class="topic" id="t7" data-title="CROSS JOIN" data-search="cross join producto cartesiano combinaciones">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">07</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-join-cross"/></svg>
          <h2>CROSS JOIN</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-intermedio"></span> Intermedio</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t7"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Combina <strong>todas las filas</strong> de una tabla con <strong>todas las filas</strong> de la otra: el producto cartesiano. No usa condición ON.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> columnas
<span class="k">FROM</span> tabla1
<span class="k">CROSS JOIN</span> tabla2;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> e.nombre, d.nombre <span class="k">AS</span> departamento
<span class="k">FROM</span> (<span class="k">SELECT</span> nombre <span class="k">FROM</span> empleados <span class="k">WHERE</span> cargo = <span class="s">'Gerente'</span>) e
<span class="k">CROSS JOIN</span> departamentos d
<span class="k">ORDER BY</span> d.nombre;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Resultado</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>nombre</th><th>departamento</th></tr></thead>
            <tbody>
              <tr><td>Carla Díaz</td><td>Comercial</td></tr>
              <tr><td>Carla Díaz</td><td>Marketing</td></tr>
              <tr><td>Carla Díaz</td><td>Recursos Humanos</td></tr>
              <tr><td>Carla Díaz</td><td>Tecnología</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Multiplica: si la tabla izquierda tiene N filas y la derecha M, el resultado tiene N × M filas. Aquí 1 gerente × 4 departamentos = 4 filas.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Generar todas las combinaciones posibles de dos conjuntos: tallas × colores, meses × sucursales, fechas × productos.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>El error más común no es de sintaxis: es un JOIN sin ON escrito por accidente. Si dos tablas grandes se cruzan sin condición, el resultado puede tener millones de filas sin que PostgreSQL avise.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Escribir CROSS JOIN explícitamente cuando de verdad se necesita, para dejar claro que el producto cartesiano es intencional y no un ON olvidado.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> con las 7 filas completas de empleados, este mismo CROSS JOIN contra los 4 departamentos daría 28 filas (7 × 4); limitar el ejemplo a un solo gerente lo hace más fácil de leer.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/joins/t6"><small>Anterior</small><strong>← SELF JOIN</strong></a>
          <span></span>
        </nav>
      </div>
    </section>`;

  var EXERCISES_META = [
    {
      id: 'ex1',
      type: 'mcq',
      prompt: '¿Qué tipo de JOIN devuelve únicamente las filas que tienen coincidencia en ambas tablas?',
      options: ['LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'FULL JOIN'],
      correct: 2,
      explanation: 'INNER JOIN descarta cualquier fila que no tenga coincidencia en la otra tabla; es el más restrictivo de los cuatro.'
    },
    {
      id: 'ex2',
      type: 'write',
      prompt: 'Escribe la condición ON que une <code>empleados e</code> con <code>departamentos d</code> por la clave foránea <code>departamento_id</code>.',
      placeholder: 'e.departamento_id = d.id',
      answers: ['e.departamento_id = d.id', 'e.departamento_id=d.id'],
      explanation: 'La condición ON compara la clave foránea de la tabla izquierda (departamento_id) con la clave primaria de la derecha (id).'
    },
    {
      id: 'ex3',
      type: 'mcq',
      prompt: '¿Qué JOIN conserva TODAS las filas de la tabla que aparece a la izquierda del FROM, tengan o no coincidencia?',
      options: ['INNER JOIN', 'RIGHT JOIN', 'LEFT JOIN', 'CROSS JOIN'],
      correct: 2,
      explanation: 'LEFT JOIN mantiene todas las filas de la tabla izquierda; cuando no hay coincidencia, rellena con NULL las columnas de la tabla derecha.'
    },
    {
      id: 'ex4',
      type: 'mcq',
      prompt: 'En un SELF JOIN de <code>empleados</code> consigo misma usando <code>e.jefe_id = j.id</code>, ¿qué representa cada fila del resultado?',
      options: ['La relación entre cada empleado y su jefe', 'Una tabla completamente distinta a empleados', 'Un error de sintaxis', 'Un CROSS JOIN disfrazado'],
      correct: 0,
      explanation: 'El SELF JOIN trata la misma tabla como si fueran dos (e y j), permitiendo comparar cada empleado con otro registro de la misma tabla: en este caso, su jefe.'
    },
    {
      id: 'ex5',
      type: 'write',
      prompt: '¿Cuántas filas produce un CROSS JOIN entre una tabla de 3 filas y otra de 4 filas?',
      placeholder: '12',
      answers: ['12'],
      explanation: 'CROSS JOIN multiplica el número de filas de ambas tablas: 3 × 4 = 12 combinaciones posibles.'
    }
  ];

  window.App = window.App || {};
  window.App.modules = window.App.modules || {};
  window.App.modules['joins'] = {
    id: 'joins',
    topicsMeta: TOPICS_META,
    heroHtml: HERO_HTML,
    schemaHtml: SCHEMA_HTML,
    topicsHtml: TOPICS_HTML,
    exercisesMeta: EXERCISES_META
  };

})();
