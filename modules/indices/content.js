/* ============================================================
   MÓDULO: Índices
   Misma forma que los módulos anteriores. Los planes de EXPLAIN son
   texto ilustrativo (no hay motor real detrás de esta página), así
   que se presentan dentro de .code-block igual que el SQL, pero sin
   resaltado de palabras clave.
   ============================================================ */
(function(){
  'use strict';

  var TOPICS_META = [
    { id:'t1', num:'01', title:'CREATE INDEX',           level:'basico',     search:'create index crear indice btree' },
    { id:'t2', num:'02', title:'EXPLAIN',                level:'intermedio', search:'explain analyze plan de ejecucion seq scan index scan' },
    { id:'t3', num:'03', title:'Índice único',           level:'basico',     search:'unique index indice unico duplicados' },
    { id:'t4', num:'04', title:'Índice compuesto',       level:'intermedio', search:'indice compuesto multicolumna prefijo izquierdo' },
    { id:'t5', num:'05', title:'Índice parcial',         level:'avanzado',   search:'indice parcial partial where' },
    { id:'t6', num:'06', title:'Cuándo no usar un índice', level:'avanzado', search:'costos mantenimiento cuando no indexar' }
  ];

  var HERO_HTML = `<header class="hero">
      <h1>Índices: acelerar consultas, con costo</h1>
      <p class="sub">CREATE INDEX, cómo leer un plan con EXPLAIN, índices únicos, compuestos y parciales, y por qué un índice no siempre es gratis. Sigue usando <code>empleados</code> y <code>departamentos</code>.</p>
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
                <th>correo<span class="type">text</span></th>
                <th>departamento_id<span class="type">integer</span></th>
              </tr>
            </thead>
            <tbody>
              <tr><td>1</td><td>Ana Torres</td><td>Ingeniera de Datos</td><td>4 200 000</td><td>ana.torres@empresa.com</td><td>1</td></tr>
              <tr><td>2</td><td>Luis Gómez</td><td>Analista</td><td>3 100 000</td><td class="null">NULL</td><td>2</td></tr>
              <tr><td>3</td><td>Marta Ruiz</td><td>Ingeniera de Datos</td><td>4 500 000</td><td>marta.ruiz@empresa.com</td><td>1</td></tr>
              <tr><td>4</td><td>Pedro Sánchez</td><td>Analista Junior</td><td>2 600 000</td><td>pedro.sanchez@empresa.com</td><td>2</td></tr>
              <tr><td>5</td><td>Carla Díaz</td><td>Gerente</td><td>6 800 000</td><td>carla.diaz@empresa.com</td><td class="null">NULL</td></tr>
              <tr><td>6</td><td>Jorge Peña</td><td>Analista</td><td>3 100 000</td><td class="null">NULL</td><td>2</td></tr>
              <tr><td>7</td><td>Sofía León</td><td>Ingeniera de Datos</td><td>4 200 000</td><td>sofia.leon@empresa.com</td><td>1</td></tr>
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

  var TOPICS_HTML = `<!-- ============ 1. CREATE INDEX ============ -->
    <section class="topic" id="t1" data-title="CREATE INDEX" data-search="create index crear indice btree">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">01</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-mod-indices"/></svg>
          <h2>CREATE INDEX</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-basico"></span> Básico</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t1"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Crea una estructura auxiliar que le permite al motor <strong>encontrar filas sin recorrer toda la tabla</strong>, a cambio de espacio en disco y trabajo extra al escribir.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">CREATE INDEX</span> nombre_indice <span class="k">ON</span> tabla (columna);</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">CREATE INDEX</span> idx_empleados_cargo
<span class="k">ON</span> empleados (cargo);</pre></div>
          </div>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Construye un árbol B-tree (el tipo por defecto) ordenado por los valores de "cargo", que el planificador puede recorrer en vez de leer las 7 filas una por una.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Sobre columnas que se filtran, ordenan o se usan en JOIN con frecuencia, especialmente en tablas con miles o millones de filas.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Crear un índice y asumir que ya se está usando: PostgreSQL decide usarlo o no según el costo estimado; el siguiente tema muestra cómo comprobarlo.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Indexar según los patrones reales de consulta (qué WHERE, JOIN y ORDER BY se ejecutan de verdad), no "por si acaso" sobre cada columna de cada tabla.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> las columnas <code>id</code> declaradas como clave primaria ya tienen un índice único creado automáticamente por PostgreSQL; CREATE INDEX es para las demás columnas que se consultan seguido.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <span></span>
          <a class="next" data-route-link href="#/modulo/indices/t2"><small>Siguiente</small><strong>EXPLAIN →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 2. EXPLAIN ============ -->
    <section class="topic" id="t2" data-title="EXPLAIN" data-search="explain analyze plan de ejecucion seq scan index scan">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">02</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-search"/></svg>
          <h2>EXPLAIN</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-intermedio"></span> Intermedio</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t2"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Muestra el <strong>plan de ejecución</strong> que PostgreSQL usaría para una consulta, sin necesariamente ejecutarla. Es la forma de comprobar si un índice de verdad se está usando.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">EXPLAIN</span> consulta;
<span class="k">EXPLAIN ANALYZE</span> consulta;  <span class="c">-- sí la ejecuta</span></pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">EXPLAIN</span>
<span class="k">SELECT</span> nombre <span class="k">FROM</span> empleados
<span class="k">WHERE</span> cargo = <span class="s">'Gerente'</span>;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Plan sin índice sobre cargo</div>
        <div class="code-block"><pre class="code">Seq Scan on empleados  (cost=0.00..1.09 rows=1 width=15)
  Filter: (cargo = 'Gerente'::text)
  Rows Removed by Filter: 6</pre></div>
        <div class="result-label" style="margin-top:16px;"><svg aria-hidden="true"><use href="#i-result"/></svg> Plan con idx_empleados_cargo creado</div>
        <div class="code-block"><pre class="code">Index Scan using idx_empleados_cargo on empleados  (cost=0.15..8.17 rows=1 width=15)
  Index Cond: (cargo = 'Gerente'::text)</pre></div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>"Seq Scan" significa que recorrió las 7 filas una por una descartando las que no cumplían; "Index Scan" significa que fue directo a las filas con cargo = 'Gerente' usando el índice.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Antes de crear un índice "a ciegas", y después de crearlo, para confirmar que el planificador de verdad lo eligió.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Usar EXPLAIN ANALYZE en un UPDATE o DELETE sin darse cuenta de que sí ejecuta el comando de verdad (no solo lo simula), modificando los datos.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Fijarse en el "cost" y en "rows": son estimaciones del planificador, útiles para comparar dos versiones de una misma consulta entre sí, más que como una medida absoluta de tiempo real.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> con solo 7 filas, PostgreSQL casi siempre elegiría Seq Scan de todas formas, aunque exista el índice: el ejemplo es ilustrativo de cómo se vería el plan en una tabla con miles de filas, donde la diferencia sí importa. El tema 6 vuelve sobre esta idea.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/indices/t1"><small>Anterior</small><strong>← CREATE INDEX</strong></a>
          <a class="next" data-route-link href="#/modulo/indices/t3"><small>Siguiente</small><strong>Índice único →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 3. Índice único ============ -->
    <section class="topic" id="t3" data-title="Índice único" data-search="unique index indice unico duplicados">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">03</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-distinct"/></svg>
          <h2>Índice único</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-basico"></span> Básico</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t3"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Además de acelerar búsquedas, <strong>impide valores duplicados</strong> en la columna indexada.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">CREATE UNIQUE INDEX</span> nombre_indice <span class="k">ON</span> tabla (columna);</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">CREATE UNIQUE INDEX</span> idx_empleados_correo
<span class="k">ON</span> empleados (correo);

<span class="k">INSERT INTO</span> empleados (nombre, correo)
<span class="k">VALUES</span> (<span class="s">'Otro Empleado'</span>, <span class="s">'ana.torres@empresa.com'</span>);</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Resultado del INSERT</div>
        <div class="code-block"><pre class="code">ERROR:  duplicate key value violates unique constraint "idx_empleados_correo"
DETAIL:  Key (correo)=(ana.torres@empresa.com) already exists.</pre></div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Antes de insertar, PostgreSQL revisa el índice; si ya existe ese valor, rechaza la operación completa en vez de guardar el duplicado.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Correos, números de documento, códigos de producto: cualquier columna que por reglas de negocio no debería repetirse.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Asumir que un índice único impide filas con NULL repetido: no es así, PostgreSQL permite varios NULL en una columna con índice único, porque NULL nunca se considera igual a otro NULL.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Para reglas de negocio importantes, preferir una restricción <code>UNIQUE</code> declarada en la tabla en vez de solo un índice único: comunica mejor la intención, aunque técnicamente PostgreSQL cree un índice de todas formas por debajo.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> Luis Gómez y Jorge Peña ya tienen <code>correo</code> NULL en la tabla; con este índice único, un tercer empleado también podría tener correo NULL sin ningún conflicto.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/indices/t2"><small>Anterior</small><strong>← EXPLAIN</strong></a>
          <a class="next" data-route-link href="#/modulo/indices/t4"><small>Siguiente</small><strong>Índice compuesto →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 4. Índice compuesto ============ -->
    <section class="topic" id="t4" data-title="Índice compuesto" data-search="indice compuesto multicolumna prefijo izquierdo">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">04</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-idx-composite"/></svg>
          <h2>Índice compuesto</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-intermedio"></span> Intermedio</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t4"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Un índice puede cubrir <strong>varias columnas</strong> a la vez. El orden en que se declaran importa: solo ayuda a las consultas que filtran desde la primera columna hacia adelante.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">CREATE INDEX</span> nombre_indice <span class="k">ON</span> tabla (col1, col2);</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">CREATE INDEX</span> idx_empleados_depto_salario
<span class="k">ON</span> empleados (departamento_id, salario);</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Qué consultas aprovechan este índice</div>
        <table class="ops">
          <thead><tr><th>Consulta</th><th>¿Usa el índice completo?</th></tr></thead>
          <tbody>
            <tr><td><code>WHERE departamento_id = 1 AND salario &gt; 4000000</code></td><td>Sí, usa ambas columnas</td></tr>
            <tr><td><code>WHERE departamento_id = 1</code></td><td>Sí, solo con el prefijo izquierdo</td></tr>
            <tr><td><code>WHERE salario &gt; 4000000</code></td><td>No, salta la primera columna</td></tr>
          </tbody>
        </table>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Ordena las filas primero por departamento_id y, dentro de cada departamento, por salario; es como un índice de libro ordenado por capítulo y luego por página.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Cuando varias consultas filtran repetidamente por la misma combinación de columnas, en ese mismo orden de importancia.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Declarar las columnas en el orden equivocado: un índice (salario, departamento_id) no sirve de la misma forma para <code>WHERE departamento_id = 1</code>.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Poner primero la columna que se usa siempre en el filtro (o con mayor selectividad), y después las que se agregan solo a veces.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> esta es la "regla del prefijo izquierdo": un índice compuesto sirve como si fuera varios índices más pequeños, pero solo empezando desde su primera columna.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/indices/t3"><small>Anterior</small><strong>← Índice único</strong></a>
          <a class="next" data-route-link href="#/modulo/indices/t5"><small>Siguiente</small><strong>Índice parcial →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 5. Índice parcial ============ -->
    <section class="topic" id="t5" data-title="Índice parcial" data-search="indice parcial partial where">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">05</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-where"/></svg>
          <h2>Índice parcial</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-avanzado"></span> Avanzado</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t5"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Un índice que solo cubre las filas que cumplen una <strong>condición WHERE</strong>, en vez de la tabla completa.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">CREATE INDEX</span> nombre_indice <span class="k">ON</span> tabla (columna)
<span class="k">WHERE</span> condición;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">CREATE INDEX</span> idx_empleados_sin_departamento
<span class="k">ON</span> empleados (nombre)
<span class="k">WHERE</span> departamento_id <span class="k">IS NULL</span>;</pre></div>
          </div>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>De las 7 filas de empleados, este índice solo guarda la de Carla Díaz (la única con departamento_id NULL): un índice diminuto para un caso puntual y frecuente.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Consultas que siempre filtran por el mismo subconjunto pequeño de una tabla grande: pedidos pendientes, empleados sin departamento, registros marcados como activos.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Esperar que ayude a consultas cuya condición no coincide con la del índice: este índice solo sirve para <code>WHERE departamento_id IS NULL</code>, no para buscar por nombre en general.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Usarlo cuando el subconjunto filtrado es una fracción pequeña de la tabla: si "sin departamento" fuera el 90% de las filas, un índice normal sería casi igual de grande y no aportaría tanto.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> este es el mismo patrón LEFT JOIN + IS NULL para encontrar "huérfanos" que se vio en los módulos de JOINs y Subconsultas; el índice parcial hace que esa consulta puntual sea más rápida sin agrandar el índice para las otras 6 filas que nunca la necesitan.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/indices/t4"><small>Anterior</small><strong>← Índice compuesto</strong></a>
          <a class="next" data-route-link href="#/modulo/indices/t6"><small>Siguiente</small><strong>Cuándo no usar un índice →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 6. Cuándo no usar un índice ============ -->
    <section class="topic" id="t6" data-title="Cuándo no usar un índice" data-search="costos mantenimiento cuando no indexar">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">06</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-scale"/></svg>
          <h2>Cuándo no usar un índice</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-avanzado"></span> Avanzado</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t6"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Un índice no es gratis: acelera lecturas selectivas, pero <strong>cuesta</strong> en escrituras y en espacio, y el planificador puede decidir ignorarlo de todas formas.</p>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> El costo, en una tabla con varios índices</div>
        <table class="ops">
          <thead><tr><th>Operación</th><th>Efecto de tener más índices</th></tr></thead>
          <tbody>
            <tr><td class="op">INSERT / UPDATE / DELETE</td><td>Más lentas: cada índice también debe actualizarse</td></tr>
            <tr><td class="op">Espacio en disco</td><td>Mayor: cada índice es una estructura adicional guardada</td></tr>
            <tr><td class="op">SELECT muy selectivo en tabla grande</td><td>Mucho más rápido con el índice adecuado</td></tr>
            <tr><td class="op">SELECT en tabla pequeña (como esta de 7 filas)</td><td>El optimizador suele preferir Seq Scan igual</td></tr>
          </tbody>
        </table>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>PostgreSQL estima el costo de cada plan posible (con y sin índice) y elige el más barato; en tablas pequeñas, leer todo secuencialmente suele ser más barato que "saltar" por un índice.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Evaluar el balance real: ¿esta tabla crece mucho?, ¿esta columna se consulta seguido?, ¿cuántos INSERT/UPDATE recibe por segundo?</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Indexar cada columna "por si acaso": en tablas con muchas escrituras, un exceso de índices puede hacer que INSERT y UPDATE se vuelvan notablemente más lentos sin que ninguna consulta se beneficie realmente.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Medir antes de indexar: usar EXPLAIN ANALYZE sobre las consultas reales y lentas, y crear índices dirigidos a esos casos concretos, no de forma preventiva y genérica.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> esto conecta con lo visto en el tema de EXPLAIN: en la tabla empleados de este curso (7 filas), ningún índice cambiaría el rendimiento de forma perceptible; todo lo aprendido en este módulo importa de verdad a partir de miles o millones de filas.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/indices/t5"><small>Anterior</small><strong>← Índice parcial</strong></a>
          <span></span>
        </nav>
      </div>
    </section>`;

  var EXERCISES_META = [
    {
      id: 'ex1',
      type: 'mcq',
      prompt: '¿Qué tipo de índice crea <code>CREATE INDEX</code> por defecto en PostgreSQL?',
      options: ['Hash', 'B-tree', 'GIN', 'BRIN'],
      correct: 1,
      explanation: 'B-tree es el tipo por defecto y sirve para la gran mayoría de los casos: igualdad, rangos y ordenamiento.'
    },
    {
      id: 'ex2',
      type: 'mcq',
      prompt: '¿Qué hace <code>EXPLAIN</code> (sin ANALYZE) sobre una consulta?',
      options: ['Ejecuta la consulta y muestra los datos', 'Muestra el plan de ejecución estimado, sin ejecutar realmente la consulta', 'Borra los datos de prueba', 'Solo funciona con vistas materializadas'],
      correct: 1,
      explanation: 'EXPLAIN sin ANALYZE solo pide el plan estimado al planificador; EXPLAIN ANALYZE sí ejecuta la consulta de verdad para medir tiempos reales.'
    },
    {
      id: 'ex3',
      type: 'write',
      prompt: 'Escribe el comando para crear un índice único llamado <code>idx_empleados_correo</code> sobre la columna <code>correo</code> de <code>empleados</code>.',
      placeholder: 'CREATE UNIQUE INDEX idx_empleados_correo ON empleados (correo)',
      answers: ['create unique index idx_empleados_correo on empleados (correo)'],
      explanation: 'CREATE UNIQUE INDEX nombre ON tabla (columna) crea el índice y, de paso, impide valores duplicados en esa columna (excepto múltiples NULL).'
    },
    {
      id: 'ex4',
      type: 'mcq',
      prompt: 'Con un índice compuesto <code>(departamento_id, salario)</code>, ¿cuál consulta lo aprovecha según la regla del prefijo izquierdo?',
      options: ['WHERE salario &gt; 4000000', 'WHERE departamento_id = 1, o WHERE departamento_id = 1 AND salario &gt; 4000000', 'Ninguna consulta puede usarlo', 'Solo si se filtra por salario primero'],
      correct: 1,
      explanation: 'Un índice compuesto solo ayuda a consultas que filtran desde su primera columna en adelante; saltarse departamento_id deja el índice sin poder usarse de forma directa.'
    },
    {
      id: 'ex5',
      type: 'mcq',
      prompt: '¿Por qué agregar índices a una tabla no siempre mejora el rendimiento general?',
      options: ['Los índices nunca ayudan en PostgreSQL', 'Cada índice ralentiza INSERT/UPDATE/DELETE y ocupa espacio, y en tablas pequeñas el optimizador puede preferir no usarlo', 'Solo funcionan con SELECT *', 'PostgreSQL limita a un índice por tabla'],
      correct: 1,
      explanation: 'Todo índice debe mantenerse actualizado en cada escritura y ocupa espacio en disco; ese costo solo se justifica cuando de verdad acelera consultas selectivas frecuentes.'
    }
  ];

  window.App = window.App || {};
  window.App.modules = window.App.modules || {};
  window.App.modules['indices'] = {
    id: 'indices',
    topicsMeta: TOPICS_META,
    heroHtml: HERO_HTML,
    schemaHtml: SCHEMA_HTML,
    topicsHtml: TOPICS_HTML,
    exercisesMeta: EXERCISES_META
  };

})();
