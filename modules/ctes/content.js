/* ============================================================
   MÓDULO: CTEs: WITH (DQL: Consultar datos)
   Consultas con nombre para dividir consultas complejas en pasos
   legibles, incluyendo la variante recursiva para jerarquías.
   Va después de Operaciones de conjuntos. Resultados simulados.
   ============================================================ */
(function(){
  'use strict';

  var TOPICS_META = [
    { id:'t1', num:'01', title:'WITH: una CTE',        level:'intermedio', search:'with cte common table expression consulta con nombre' },
    { id:'t2', num:'02', title:'Varias CTEs',          level:'intermedio', search:'varias ctes encadenadas coma pasos' },
    { id:'t3', num:'03', title:'CTE vs subconsulta',   level:'intermedio', search:'cte versus subconsulta legibilidad' },
    { id:'t4', num:'04', title:'CTE recursiva',        level:'avanzado',   search:'with recursive jerarquia cadena de jefes arbol' }
  ];

  var HERO_HTML = `<header class="hero">
      <h1>CTEs: consultas con nombre (WITH)</h1>
      <p class="sub">Una <em>Common Table Expression</em> es una consulta con nombre que defines con <code>WITH</code> y usas como si fuera una tabla temporal. Sirve para partir una consulta compleja en pasos legibles y, con <code>RECURSIVE</code>, recorrer jerarquías. Todo sobre <code>empleados</code> y <code>departamentos</code>.</p>
      <p style="margin:0 0 14px 0; font-size:12.5px; color:var(--ink-3);">Por Nelson Leonardo Páez Arias</p>
      <div class="hero__meta">
        <span><svg aria-hidden="true"><use href="#i-check"/></svg> <span id="heroCompletedCount">0/4</span> completados</span>
        <span><svg aria-hidden="true"><use href="#i-hash"/></svg> 4 temas</span>
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

  var TOPICS_HTML = `<!-- ============ 1. WITH: una CTE ============ -->
    <section class="topic" id="t1" data-title="WITH: una CTE" data-search="with cte common table expression consulta con nombre">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">01</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-mod-cte"/></svg>
          <h2>WITH: una CTE</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-intermedio"></span> Intermedio</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t1"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Define una <strong>consulta con nombre</strong> con <code>WITH</code> y luego la usas como si fuera una tabla dentro de la consulta principal.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">WITH</span> nombre_cte <span class="k">AS</span> (
  <span class="k">SELECT</span> ...
)
<span class="k">SELECT</span> ... <span class="k">FROM</span> nombre_cte;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">WITH</span> bien_pagados <span class="k">AS</span> (
  <span class="k">SELECT</span> nombre, salario
  <span class="k">FROM</span> empleados
  <span class="k">WHERE</span> salario &gt; 4000000
)
<span class="k">SELECT</span> * <span class="k">FROM</span> bien_pagados
<span class="k">ORDER BY</span> salario <span class="k">DESC</span>;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> 4 filas</div>
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
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Define <code>bien_pagados</code> como un resultado con nombre y luego lo consulta como si fuera una tabla.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Para partir una consulta larga en pasos con nombre, más fáciles de leer y de mantener.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Esperar que la CTE persista: solo existe durante esa consulta; no es una tabla ni una vista.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Nombres descriptivos (<code>bien_pagados</code>, <code>ventas_mes</code>): la CTE debe leerse casi como una frase.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> una CTE es, en esencia, una subconsulta con nombre; su mayor valor es la legibilidad.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <span></span>
          <a class="next" data-route-link href="#/modulo/ctes/t2"><small>Siguiente</small><strong>Varias CTEs →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 2. Varias CTEs ============ -->
    <section class="topic" id="t2" data-title="Varias CTEs" data-search="varias ctes encadenadas coma pasos">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">02</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-mod-cte"/></svg>
          <h2>Varias CTEs</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-intermedio"></span> Intermedio</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t2"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Puedes definir <strong>varias CTEs</strong> separadas por comas, y cada una puede apoyarse en las anteriores.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">WITH</span> a <span class="k">AS</span> (...),
     b <span class="k">AS</span> (<span class="k">SELECT</span> ... <span class="k">FROM</span> a ...)
<span class="k">SELECT</span> ... <span class="k">FROM</span> b;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">WITH</span> por_departamento <span class="k">AS</span> (
  <span class="k">SELECT</span> departamento_id, <span class="k">AVG</span>(salario) <span class="k">AS</span> promedio
  <span class="k">FROM</span> empleados
  <span class="k">GROUP BY</span> departamento_id
),
altos <span class="k">AS</span> (
  <span class="k">SELECT</span> * <span class="k">FROM</span> por_departamento <span class="k">WHERE</span> promedio &gt; 3500000
)
<span class="k">SELECT</span> d.nombre, a.promedio
<span class="k">FROM</span> altos a
<span class="k">JOIN</span> departamentos d <span class="k">ON</span> d.id = a.departamento_id;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> 1 fila (departamentos con promedio &gt; 3.5M)</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>nombre</th><th>promedio</th></tr></thead>
            <tbody>
              <tr><td>Tecnología</td><td>4 300 000</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>La primera CTE calcula el promedio por departamento; la segunda filtra los altos; la consulta final les pone nombre con un JOIN.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Consultas de varios pasos, donde encadenar CTEs se lee como una receta de arriba abajo.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Referenciar una CTE antes de haberla definido: cada una solo puede usar las que están escritas arriba.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Un paso por CTE, con nombres claros: se depura y se entiende mucho mejor que una consulta anidada gigante.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> las CTEs se separan con coma; la palabra <code>WITH</code> se escribe una sola vez, al inicio.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/ctes/t1"><small>Anterior</small><strong>← WITH: una CTE</strong></a>
          <a class="next" data-route-link href="#/modulo/ctes/t3"><small>Siguiente</small><strong>CTE vs subconsulta →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 3. CTE vs subconsulta ============ -->
    <section class="topic" id="t3" data-title="CTE vs subconsulta" data-search="cte versus subconsulta legibilidad">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">03</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-scale"/></svg>
          <h2>CTE vs subconsulta</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-intermedio"></span> Intermedio</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t3"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Una CTE y una subconsulta pueden dar el <strong>mismo resultado</strong>; la CTE suele ganar en legibilidad y reutilización.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Con subconsulta</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> nombre, salario
<span class="k">FROM</span> empleados
<span class="k">WHERE</span> salario &gt; (
  <span class="k">SELECT</span> <span class="k">AVG</span>(salario) <span class="k">FROM</span> empleados
);</pre></div>
          </div>
          <div>
            <div class="block-label">Con CTE</div>
            <div class="code-block"><pre class="code"><span class="k">WITH</span> prom <span class="k">AS</span> (
  <span class="k">SELECT</span> <span class="k">AVG</span>(salario) <span class="k">AS</span> s <span class="k">FROM</span> empleados
)
<span class="k">SELECT</span> nombre, salario
<span class="k">FROM</span> empleados, prom
<span class="k">WHERE</span> salario &gt; prom.s;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> 4 filas (ganan más que el promedio ≈ 4 071 428)</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>nombre</th><th>salario</th></tr></thead>
            <tbody>
              <tr><td>Ana Torres</td><td>4 200 000</td></tr>
              <tr><td>Marta Ruiz</td><td>4 500 000</td></tr>
              <tr><td>Carla Díaz</td><td>6 800 000</td></tr>
              <tr><td>Sofía León</td><td>4 200 000</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Ambas versiones comparan cada salario contra el promedio y devuelven lo mismo; cambia la forma, no el resultado.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>CTE si el subresultado se usa varias veces o la consulta es larga; subconsulta para algo pequeño y puntual.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Suponer que la CTE siempre es más rápida: el motor suele optimizarla igual que una subconsulta.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Elige por claridad: una CTE bien nombrada es más fácil de leer para quien mantenga la consulta después.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> en PostgreSQL moderno una CTE simple se "aplana" como una subconsulta; la diferencia principal es de legibilidad, no de velocidad.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/ctes/t2"><small>Anterior</small><strong>← Varias CTEs</strong></a>
          <a class="next" data-route-link href="#/modulo/ctes/t4"><small>Siguiente</small><strong>CTE recursiva →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 4. CTE recursiva ============ -->
    <section class="topic" id="t4" data-title="CTE recursiva" data-search="with recursive jerarquia cadena de jefes arbol">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">04</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-mod-subconsultas"/></svg>
          <h2>CTE recursiva</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-avanzado"></span> Avanzado</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t4"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Una CTE <code>RECURSIVE</code> se llama a sí misma para recorrer estructuras <strong>jerárquicas</strong>, como la cadena de jefes de un empleado.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">WITH RECURSIVE</span> cadena <span class="k">AS</span> (
  <span class="k">SELECT</span> ...            <span class="c">-- caso base</span>
  <span class="k">UNION ALL</span>
  <span class="k">SELECT</span> ... <span class="k">FROM</span> t
  <span class="k">JOIN</span> cadena <span class="k">ON</span> ...  <span class="c">-- paso recursivo</span>
)
<span class="k">SELECT</span> * <span class="k">FROM</span> cadena;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo: cadena de mando de Pedro</div>
            <div class="code-block"><pre class="code"><span class="k">WITH RECURSIVE</span> cadena_mando <span class="k">AS</span> (
  <span class="k">SELECT</span> id, nombre, jefe_id, 1 <span class="k">AS</span> nivel
  <span class="k">FROM</span> empleados <span class="k">WHERE</span> id = 4
  <span class="k">UNION ALL</span>
  <span class="k">SELECT</span> e.id, e.nombre, e.jefe_id, c.nivel + 1
  <span class="k">FROM</span> empleados e
  <span class="k">JOIN</span> cadena_mando c <span class="k">ON</span> e.id = c.jefe_id
)
<span class="k">SELECT</span> nivel, nombre <span class="k">FROM</span> cadena_mando;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> 3 filas: de Pedro hasta la cima</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>nivel</th><th>nombre</th></tr></thead>
            <tbody>
              <tr><td>1</td><td>Pedro Sánchez</td></tr>
              <tr><td>2</td><td>Luis Gómez</td></tr>
              <tr><td>3</td><td>Carla Díaz</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Parte de Pedro (caso base) y en cada paso sube al jefe usando <code>jefe_id</code>, hasta que ya no hay jefe (Carla).</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Jerarquías y árboles: organigramas, categorías anidadas, listas de materiales, rutas en un grafo.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Olvidar la palabra <code>RECURSIVE</code>, o un paso que nunca termina (recursión infinita) si los datos tienen ciclos.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Asegurar que cada paso avance hacia un fin; un contador de <code>nivel</code> ayuda a seguir y a limitar la profundidad.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> una CTE recursiva combina un <em>caso base</em> con un <em>paso recursivo</em> unidos por <code>UNION ALL</code>, y repite el paso hasta que no produce filas nuevas.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/ctes/t3"><small>Anterior</small><strong>← CTE vs subconsulta</strong></a>
          <span></span>
        </nav>
      </div>
    </section>`;

  var EXERCISES_META = [
    {
      id: 'ex1',
      type: 'mcq',
      prompt: '¿Qué es una CTE?',
      options: ['Una consulta con nombre definida con WITH', 'Un tipo de índice', 'Una tabla física', 'Un trigger'],
      correct: 0,
      explanation: 'Una Common Table Expression es una consulta con nombre (WITH) que se usa como una tabla temporal dentro de la consulta.'
    },
    {
      id: 'ex2',
      type: 'write',
      prompt: 'Escribe la palabra clave con la que empieza una CTE.',
      placeholder: 'WITH',
      answers: ['with'],
      explanation: 'Toda CTE arranca con WITH nombre AS ( ... ).'
    },
    {
      id: 'ex3',
      type: 'mcq',
      prompt: '¿Cómo se separan varias CTEs en un mismo WITH?',
      options: ['Con una coma', 'Con punto y coma', 'Con AND', 'Con UNION'],
      correct: 0,
      explanation: 'Se escriben una tras otra separadas por comas; la palabra WITH aparece una sola vez al inicio.'
    },
    {
      id: 'ex4',
      type: 'mcq',
      prompt: '¿Para qué sirve WITH RECURSIVE?',
      options: ['Para recorrer estructuras jerárquicas, como una cadena de jefes', 'Para ordenar resultados', 'Para borrar filas', 'Para crear tablas'],
      correct: 0,
      explanation: 'La CTE recursiva parte de un caso base y se repite subiendo o bajando por la jerarquía hasta agotar las filas.'
    },
    {
      id: 'ex5',
      type: 'mcq',
      prompt: '¿Cuál es la principal ventaja de una CTE frente a una subconsulta anidada?',
      options: ['Mejora la legibilidad y se puede reutilizar dentro de la consulta', 'Siempre es más rápida', 'Permite consultar sin SELECT', 'Evita usar WHERE'],
      correct: 0,
      explanation: 'La ventaja es de claridad: divide la consulta en pasos con nombre; en rendimiento suele ser equivalente a una subconsulta.'
    }
  ];

  window.App = window.App || {};
  window.App.modules = window.App.modules || {};
  window.App.modules['ctes'] = {
    id: 'ctes',
    topicsMeta: TOPICS_META,
    heroHtml: HERO_HTML,
    schemaHtml: SCHEMA_HTML,
    topicsHtml: TOPICS_HTML,
    exercisesMeta: EXERCISES_META
  };

})();
