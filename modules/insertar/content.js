/* ============================================================
   MÓDULO: INSERT (DML: Modificar datos)
   Primera pieza del bloque DML: agregar filas nuevas. Misma forma
   que el resto de módulos (topicsMeta + heroHtml + schemaHtml +
   topicsHtml + exercisesMeta). Usa la misma tabla de referencia
   empleados/departamentos del resto del curso. Los resultados son
   simulados (el motor del Playground es solo de lectura); aquí se
   muestran como tablas pre-renderizadas, igual que en los demás
   módulos.
   ============================================================ */
(function(){
  'use strict';

  var TOPICS_META = [
    { id:'t1', num:'01', title:'INSERT INTO ... VALUES', level:'basico',     search:'insert into values agregar fila nueva' },
    { id:'t2', num:'02', title:'Insertar varias filas',  level:'basico',     search:'insert varias filas multiples values coma' },
    { id:'t3', num:'03', title:'Columnas y DEFAULT',     level:'basico',     search:'columnas default null omitir opcionales' },
    { id:'t4', num:'04', title:'INSERT ... SELECT',      level:'intermedio', search:'insert select copiar desde consulta' },
    { id:'t5', num:'05', title:'RETURNING',              level:'intermedio', search:'returning devolver id generado' },
    { id:'t6', num:'06', title:'ON CONFLICT (UPSERT)',   level:'intermedio', search:'on conflict upsert do update do nothing excluded' }
  ];

  var HERO_HTML = `<header class="hero">
      <h1>INSERT: agregar filas nuevas</h1>
      <p class="sub">Con SELECT ya sabes leer datos; INSERT es el primer paso para <strong>escribirlos</strong>. Aquí verás cómo agregar una o varias filas, apoyarte en los valores por defecto, insertar el resultado de una consulta y resolver choques con UPSERT. Todo sobre <code>empleados</code> y <code>departamentos</code>.</p>
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
                <th>id<span class="type">serial</span></th>
                <th>nombre<span class="type">text</span></th>
                <th>cargo<span class="type">text</span></th>
                <th>salario<span class="type">numeric</span></th>
                <th>ciudad<span class="type">text</span></th>
                <th>departamento_id<span class="type">integer</span></th>
              </tr>
            </thead>
            <tbody>
              <tr><td>1</td><td>Ana Torres</td><td>Ingeniera de Datos</td><td>4 200 000</td><td>Bogotá</td><td>1</td></tr>
              <tr><td>2</td><td>Luis Gómez</td><td>Analista</td><td>3 100 000</td><td>Medellín</td><td>2</td></tr>
              <tr><td>3</td><td>Marta Ruiz</td><td>Ingeniera de Datos</td><td>4 500 000</td><td>Bogotá</td><td>1</td></tr>
              <tr><td>4</td><td>Pedro Sánchez</td><td>Analista Junior</td><td>2 600 000</td><td>Cali</td><td>2</td></tr>
              <tr><td>5</td><td>Carla Díaz</td><td>Gerente</td><td>6 800 000</td><td>Bogotá</td><td class="null">NULL</td></tr>
              <tr><td>6</td><td>Jorge Peña</td><td>Analista</td><td>3 100 000</td><td>Medellín</td><td>2</td></tr>
              <tr><td>7</td><td>Sofía León</td><td>Ingeniera de Datos</td><td>4 200 000</td><td>Sogamoso</td><td>1</td></tr>
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

  var TOPICS_HTML = `<!-- ============ 1. INSERT INTO ... VALUES ============ -->
    <section class="topic" id="t1" data-title="INSERT INTO ... VALUES" data-search="insert into values agregar fila nueva">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">01</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-mod-insert"/></svg>
          <h2>INSERT INTO ... VALUES</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-basico"></span> Básico</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t1"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Agrega <strong>una fila nueva</strong> a una tabla indicando las columnas y los valores que le corresponden.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">INSERT INTO</span> tabla (columna1, columna2)
<span class="k">VALUES</span> (valor1, valor2);</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">INSERT INTO</span> empleados (nombre, cargo, salario, ciudad, departamento_id)
<span class="k">VALUES</span> (<span class="s">'Diego Rojas'</span>, <span class="s">'Analista'</span>, 3500000, <span class="s">'Cali'</span>, 2);</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> empleados: fila agregada (id 8)</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>id</th><th>nombre</th><th>cargo</th><th>salario</th><th>ciudad</th><th>departamento_id</th></tr></thead>
            <tbody>
              <tr><td>8</td><td>Diego Rojas</td><td>Analista</td><td>3 500 000</td><td>Cali</td><td>2</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Inserta exactamente una fila. El <code>id</code> no se escribe: la columna es <code>serial</code> y PostgreSQL asigna el siguiente número disponible automáticamente.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Para dar de alta registros nuevos uno a uno: un empleado que ingresa, un producto que se crea, etc.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Que el número de valores no coincida con el de columnas, o violar una restricción de la tabla (por ejemplo, dejar en NULL una columna <code>NOT NULL</code>).</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Listar siempre las columnas de forma explícita; así el INSERT no se rompe si más adelante cambia el orden físico de las columnas de la tabla.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> el orden de los valores debe seguir el orden en que se escribieron las columnas, no el orden físico de la tabla.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <span></span>
          <a class="next" data-route-link href="#/modulo/insertar/t2"><small>Siguiente</small><strong>Insertar varias filas →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 2. Insertar varias filas ============ -->
    <section class="topic" id="t2" data-title="Insertar varias filas" data-search="insert varias filas multiples values coma">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">02</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-mod-insert"/></svg>
          <h2>Insertar varias filas</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-basico"></span> Básico</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t2"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Un solo <code>INSERT</code> puede agregar <strong>varias filas</strong> a la vez, separando cada grupo de valores con una coma.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">INSERT INTO</span> tabla (col1, col2)
<span class="k">VALUES</span> (a1, a2),
       (b1, b2),
       (c1, c2);</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">INSERT INTO</span> empleados (nombre, cargo, salario, ciudad, departamento_id)
<span class="k">VALUES</span> (<span class="s">'Elena Ruiz'</span>, <span class="s">'Diseñadora'</span>, 3800000, <span class="s">'Bogotá'</span>, 4),
       (<span class="s">'Iván Castro'</span>, <span class="s">'Analista'</span>, 3200000, <span class="s">'Medellín'</span>, 2);</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> empleados: 2 filas agregadas</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>id</th><th>nombre</th><th>cargo</th><th>salario</th><th>ciudad</th><th>departamento_id</th></tr></thead>
            <tbody>
              <tr><td>8</td><td>Elena Ruiz</td><td>Diseñadora</td><td>3 800 000</td><td>Bogotá</td><td>4</td></tr>
              <tr><td>9</td><td>Iván Castro</td><td>Analista</td><td>3 200 000</td><td>Medellín</td><td>2</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Inserta todas las filas en una sola operación; cada una recibe su propio <code>id</code> consecutivo.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Cargas pequeñas o datos iniciales de una tabla (los llamados datos "semilla" o <em>seed</em>).</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Si una sola de las filas viola una restricción, se cancela <strong>todo</strong> el INSERT: es una operación atómica, o entran todas o no entra ninguna.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Para miles de filas conviene usar <code>COPY</code> en lugar de un INSERT gigante: es mucho más rápido para cargas masivas.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> insertar varias filas en un solo comando es más eficiente que ejecutar un INSERT por cada fila, porque es un único viaje a la base de datos.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/insertar/t1"><small>Anterior</small><strong>← INSERT INTO ... VALUES</strong></a>
          <a class="next" data-route-link href="#/modulo/insertar/t3"><small>Siguiente</small><strong>Columnas y DEFAULT →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 3. Columnas y DEFAULT ============ -->
    <section class="topic" id="t3" data-title="Columnas y DEFAULT" data-search="columnas default null omitir opcionales">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">03</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-toggle"/></svg>
          <h2>Columnas y DEFAULT</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-basico"></span> Básico</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t3"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Las columnas que <strong>no</strong> se listan en el INSERT toman su valor por defecto (<code>DEFAULT</code>) o quedan en <code>NULL</code> si la tabla lo permite.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="c">-- solo se nombra lo obligatorio</span>
<span class="k">INSERT INTO</span> tabla (col_obligatoria)
<span class="k">VALUES</span> (valor);

<span class="c">-- DEFAULT explícito para una columna</span>
<span class="k">INSERT INTO</span> tabla (col1, col2)
<span class="k">VALUES</span> (<span class="k">DEFAULT</span>, valor);</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">INSERT INTO</span> empleados (nombre, cargo)
<span class="k">VALUES</span> (<span class="s">'Nora Vega'</span>, <span class="s">'Pasante'</span>);</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> empleados: fila agregada (columnas no listadas en NULL)</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>id</th><th>nombre</th><th>cargo</th><th>salario</th><th>ciudad</th><th>departamento_id</th></tr></thead>
            <tbody>
              <tr><td>8</td><td>Nora Vega</td><td>Pasante</td><td class="null">NULL</td><td class="null">NULL</td><td class="null">NULL</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Asigna solo las columnas nombradas; las demás toman su valor por defecto definido en la tabla o, si no tienen, quedan en <code>NULL</code>.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Cuando muchas columnas son opcionales o ya tienen un <code>DEFAULT</code> razonable (fechas de creación, estados, etc.).</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Omitir una columna <code>NOT NULL</code> que no tenga <code>DEFAULT</code>: PostgreSQL rechaza el INSERT porque esa columna no puede quedar vacía.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Definir <code>DEFAULT</code> en la tabla para columnas frecuentes evita repetir el mismo valor en cada INSERT.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> omitir una columna no es lo mismo que forzar <code>NULL</code>: si la columna tiene <code>DEFAULT</code>, se usa ese valor; el <code>NULL</code> solo aparece cuando no hay DEFAULT y la columna lo permite.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/insertar/t2"><small>Anterior</small><strong>← Insertar varias filas</strong></a>
          <a class="next" data-route-link href="#/modulo/insertar/t4"><small>Siguiente</small><strong>INSERT ... SELECT →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 4. INSERT ... SELECT ============ -->
    <section class="topic" id="t4" data-title="INSERT ... SELECT" data-search="insert select copiar desde consulta">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">04</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-from"/></svg>
          <h2>INSERT ... SELECT</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-intermedio"></span> Intermedio</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t4"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Inserta el <strong>resultado de un SELECT</strong> en vez de valores escritos a mano: perfecto para copiar o archivar datos.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">INSERT INTO</span> tabla_destino (col1, col2)
<span class="k">SELECT</span> colA, colB
<span class="k">FROM</span> tabla_origen
<span class="k">WHERE</span> condicion;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">INSERT INTO</span> empleados_bogota (nombre, cargo, salario)
<span class="k">SELECT</span> nombre, cargo, salario
<span class="k">FROM</span> empleados
<span class="k">WHERE</span> ciudad = <span class="s">'Bogotá'</span>;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> empleados_bogota: 3 filas copiadas</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>nombre</th><th>cargo</th><th>salario</th></tr></thead>
            <tbody>
              <tr><td>Ana Torres</td><td>Ingeniera de Datos</td><td>4 200 000</td></tr>
              <tr><td>Marta Ruiz</td><td>Ingeniera de Datos</td><td>4 500 000</td></tr>
              <tr><td>Carla Díaz</td><td>Gerente</td><td>6 800 000</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Ejecuta el <code>SELECT</code> y agrega cada fila resultante a la tabla destino. Aquí copia los empleados de Bogotá a una tabla aparte.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Archivar registros, poblar tablas derivadas o mover datos de una tabla a otra sin escribirlos a mano.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Que las columnas del <code>SELECT</code> no coincidan en número o tipo con las del destino; el orden importa igual que en un INSERT normal.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Ejecutar primero el <code>SELECT</code> por separado para revisar qué filas se van a insertar antes de escribirlas.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> esta forma no lleva <code>VALUES</code>: las filas provienen directamente del SELECT.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/insertar/t3"><small>Anterior</small><strong>← Columnas y DEFAULT</strong></a>
          <a class="next" data-route-link href="#/modulo/insertar/t5"><small>Siguiente</small><strong>RETURNING →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 5. RETURNING ============ -->
    <section class="topic" id="t5" data-title="RETURNING" data-search="returning devolver id generado">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">05</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-result"/></svg>
          <h2>RETURNING</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-intermedio"></span> Intermedio</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t5"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Devuelve, en la misma operación, datos de las filas insertadas. Su uso más típico es <strong>obtener el <code>id</code> generado</strong> sin hacer otra consulta.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">INSERT INTO</span> tabla (col1)
<span class="k">VALUES</span> (valor)
<span class="k">RETURNING</span> id;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">INSERT INTO</span> empleados (nombre, cargo, salario, ciudad, departamento_id)
<span class="k">VALUES</span> (<span class="s">'Diego Rojas'</span>, <span class="s">'Analista'</span>, 3500000, <span class="s">'Cali'</span>, 2)
<span class="k">RETURNING</span> id, nombre;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Resultado devuelto</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>id</th><th>nombre</th></tr></thead>
            <tbody>
              <tr><td>8</td><td>Diego Rojas</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Después de insertar, devuelve las columnas que le pidas de las filas afectadas, como si fuera un SELECT sobre lo recién insertado.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Cuando necesitas el <code>id</code> autogenerado (u otro valor calculado) para usarlo enseguida, sin lanzar una segunda consulta.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Asumir que <code>RETURNING</code> existe en cualquier motor: es una extensión de PostgreSQL, no forma parte del SQL estándar.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p><code>RETURNING *</code> devuelve la fila completa, pero conviene pedir solo las columnas que realmente vas a usar.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> <code>RETURNING</code> también funciona con <code>UPDATE</code> y <code>DELETE</code>, para ver exactamente qué filas cambiaron o se borraron.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/insertar/t4"><small>Anterior</small><strong>← INSERT ... SELECT</strong></a>
          <a class="next" data-route-link href="#/modulo/insertar/t6"><small>Siguiente</small><strong>ON CONFLICT (UPSERT) →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 6. ON CONFLICT (UPSERT) ============ -->
    <section class="topic" id="t6" data-title="ON CONFLICT (UPSERT)" data-search="on conflict upsert do update do nothing excluded">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">06</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-view-replace"/></svg>
          <h2>ON CONFLICT (UPSERT)</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-intermedio"></span> Intermedio</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t6"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Si la fila choca con una restricción única, en lugar de fallar permite <strong>ignorar el conflicto</strong> o <strong>actualizar</strong> la fila que ya existe. A esto se le llama <em>upsert</em> (update + insert).</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">INSERT INTO</span> tabla (col_unica, col2)
<span class="k">VALUES</span> (v1, v2)
<span class="k">ON CONFLICT</span> (col_unica)
<span class="k">DO UPDATE SET</span> col2 = <span class="k">EXCLUDED</span>.col2;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="c">-- correo es una columna UNIQUE</span>
<span class="k">INSERT INTO</span> empleados (nombre, correo, salario)
<span class="k">VALUES</span> (<span class="s">'Ana Torres'</span>, <span class="s">'ana.torres@empresa.com'</span>, 4600000)
<span class="k">ON CONFLICT</span> (correo)
<span class="k">DO UPDATE SET</span> salario = <span class="k">EXCLUDED</span>.salario;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> empleados: el correo ya existía: se actualizó el salario</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>id</th><th>nombre</th><th>correo</th><th>salario</th></tr></thead>
            <tbody>
              <tr><td>1</td><td>Ana Torres</td><td>ana.torres@empresa.com</td><td>4 600 000</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Intenta insertar; si la fila viola la restricción única indicada, ejecuta el <code>DO</code> (actualizar o no hacer nada) en vez de lanzar un error.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Sincronizar datos donde un registro puede existir o no: "si ya está, actualízalo; si no, créalo".</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>La columna del <code>ON CONFLICT</code> debe tener una restricción <code>UNIQUE</code> o <code>PRIMARY KEY</code>; si no, PostgreSQL no sabe contra qué comparar y da error.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p><code>EXCLUDED</code> representa los valores que se intentaban insertar; úsalo dentro del <code>DO UPDATE</code> para tomar el valor nuevo.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> <code>DO NOTHING</code> inserta si la fila es nueva y no hace nada si ya existe; <code>DO UPDATE</code> la actualiza. Esa es la diferencia entre "ignorar" y "upsert".</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/insertar/t5"><small>Anterior</small><strong>← RETURNING</strong></a>
          <span></span>
        </nav>
      </div>
    </section>`;

  var EXERCISES_META = [
    {
      id: 'ex1',
      type: 'mcq',
      prompt: '¿Qué instrucción se usa para agregar filas nuevas a una tabla?',
      options: ['INSERT', 'UPDATE', 'SELECT', 'CREATE'],
      correct: 0,
      explanation: 'INSERT es la instrucción de DML encargada de agregar filas; UPDATE modifica existentes y SELECT solo lee.'
    },
    {
      id: 'ex2',
      type: 'write',
      prompt: 'Escribe el comando para insertar en <code>empleados</code> una fila solo con <code>nombre</code> = "Nora Vega" y <code>cargo</code> = "Pasante".',
      placeholder: "INSERT INTO empleados (nombre, cargo) VALUES ('Nora Vega', 'Pasante')",
      answers: [
        "insert into empleados (nombre, cargo) values ('nora vega', 'pasante')",
        "insert into empleados (cargo, nombre) values ('pasante', 'nora vega')"
      ],
      explanation: 'Se nombran solo las columnas deseadas y se dan sus valores; las demás columnas toman su DEFAULT o quedan en NULL.'
    },
    {
      id: 'ex3',
      type: 'mcq',
      prompt: 'En un INSERT, ¿qué ocurre con las columnas que no se incluyen en la lista?',
      options: ['Toman su valor DEFAULT, o NULL si la tabla lo permite', 'Se llenan automáticamente con ceros', 'Siempre provocan un error', 'Se copian de la última fila insertada'],
      correct: 0,
      explanation: 'Las columnas omitidas usan su valor por defecto; si no tienen DEFAULT y admiten nulos, quedan en NULL. Una columna NOT NULL sin DEFAULT sí daría error.'
    },
    {
      id: 'ex4',
      type: 'mcq',
      prompt: '¿Para qué sirve la cláusula RETURNING en un INSERT?',
      options: ['Para devolver datos de las filas insertadas, como el id generado', 'Para deshacer la inserción', 'Para ordenar el resultado', 'Para insertar más rápido'],
      correct: 0,
      explanation: 'RETURNING devuelve columnas de las filas afectadas en la misma operación; se usa mucho para obtener el id serial recién creado.'
    },
    {
      id: 'ex5',
      type: 'mcq',
      prompt: '¿Qué hace <code>ON CONFLICT (correo) DO NOTHING</code>?',
      options: ['Inserta la fila si el correo es nuevo y no hace nada si ya existe', 'Borra la fila que choca', 'Lanza siempre un error', 'Actualiza todas las columnas'],
      correct: 0,
      explanation: 'DO NOTHING evita el error de duplicado: si el valor único ya existe, simplemente omite esa fila sin fallar.'
    }
  ];

  window.App = window.App || {};
  window.App.modules = window.App.modules || {};
  window.App.modules['insertar'] = {
    id: 'insertar',
    topicsMeta: TOPICS_META,
    heroHtml: HERO_HTML,
    schemaHtml: SCHEMA_HTML,
    topicsHtml: TOPICS_HTML,
    exercisesMeta: EXERCISES_META
  };

})();
