/* ============================================================
   MÓDULO: DELETE (DML: Modificar datos)
   Tercera pieza del bloque DML: quitar filas. Cierra el trío
   INSERT/UPDATE/DELETE. Insiste en el WHERE y contrasta con
   TRUNCATE. Resultados simulados, como en el resto del curso.
   ============================================================ */
(function(){
  'use strict';

  var TOPICS_META = [
    { id:'t1', num:'01', title:'DELETE ... WHERE',       level:'basico',     search:'delete from where eliminar fila' },
    { id:'t2', num:'02', title:'DELETE con subconsulta', level:'intermedio', search:'delete subconsulta in exists otra tabla' },
    { id:'t3', num:'03', title:'RETURNING',              level:'intermedio', search:'returning delete filas eliminadas log' },
    { id:'t4', num:'04', title:'DELETE vs TRUNCATE',     level:'intermedio', search:'delete truncate vaciar tabla rapido' },
    { id:'t5', num:'05', title:'El riesgo de omitir WHERE', level:'intermedio', search:'sin where borra toda la tabla peligro transaccion rollback' }
  ];

  var HERO_HTML = `<header class="hero">
      <h1>DELETE: eliminar filas</h1>
      <p class="sub">El tercer verbo del DML. <code>DELETE</code> quita filas existentes y, como en <code>UPDATE</code>, el <strong>WHERE</strong> lo es todo: sin él, se vacía la tabla. Además verás en qué se diferencia de <code>TRUNCATE</code>. Todo sobre <code>empleados</code> y <code>departamentos</code>.</p>
      <p style="margin:0 0 14px 0; font-size:12.5px; color:var(--ink-3);">Por Nelson Leonardo Páez Arias</p>
      <div class="hero__meta">
        <span><svg aria-hidden="true"><use href="#i-check"/></svg> <span id="heroCompletedCount">0/5</span> completados</span>
        <span><svg aria-hidden="true"><use href="#i-hash"/></svg> 5 temas</span>
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

  var TOPICS_HTML = `<!-- ============ 1. DELETE ... WHERE ============ -->
    <section class="topic" id="t1" data-title="DELETE ... WHERE" data-search="delete from where eliminar fila">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">01</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-mod-delete"/></svg>
          <h2>DELETE ... WHERE</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-basico"></span> Básico</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t1"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Elimina las filas que cumplan una condición.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">DELETE FROM</span> tabla
<span class="k">WHERE</span> condicion;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">DELETE FROM</span> empleados
<span class="k">WHERE</span> nombre = <span class="s">'Pedro Sánchez'</span>;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> empleados: 1 fila eliminada</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>id</th><th>nombre</th><th>cargo</th><th>ciudad</th></tr></thead>
            <tbody>
              <tr><td>4</td><td>Pedro Sánchez</td><td>Analista Junior</td><td>Cali</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Borra por completo las filas que cumplen el <code>WHERE</code>; el resto de la tabla queda intacto.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Quitar registros que ya no deben existir: un empleado que se retira, un pedido cancelado, etc.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Olvidar el <code>WHERE</code>: sin él se borran <strong>todas</strong> las filas (lo vemos en el último tema).</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Ejecuta antes un <code>SELECT</code> con el mismo <code>WHERE</code>: borrar es difícil de deshacer, así confirmas qué filas desaparecerán.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> <code>DELETE</code> quita filas completas; para vaciar solo una columna (dejarla en NULL) se usa <code>UPDATE ... SET col = NULL</code>, no DELETE.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <span></span>
          <a class="next" data-route-link href="#/modulo/eliminar/t2"><small>Siguiente</small><strong>DELETE con subconsulta →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 2. DELETE con subconsulta ============ -->
    <section class="topic" id="t2" data-title="DELETE con subconsulta" data-search="delete subconsulta in exists otra tabla">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">02</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-mod-subconsultas"/></svg>
          <h2>DELETE con subconsulta</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-intermedio"></span> Intermedio</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t2"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">La condición del <code>DELETE</code> puede depender de <strong>otra tabla</strong> usando una subconsulta con <code>IN</code> o <code>EXISTS</code>.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">DELETE FROM</span> tabla
<span class="k">WHERE</span> columna <span class="k">IN</span> (
      <span class="k">SELECT</span> ... <span class="k">FROM</span> otra <span class="k">WHERE</span> ...);</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="c">-- borra a los empleados de Comercial</span>
<span class="k">DELETE FROM</span> empleados
<span class="k">WHERE</span> departamento_id <span class="k">IN</span> (
      <span class="k">SELECT</span> id <span class="k">FROM</span> departamentos
      <span class="k">WHERE</span> nombre = <span class="s">'Comercial'</span>);</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> empleados: 3 filas eliminadas</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>id</th><th>nombre</th><th>departamento_id</th></tr></thead>
            <tbody>
              <tr><td>2</td><td>Luis Gómez</td><td>2</td></tr>
              <tr><td>4</td><td>Pedro Sánchez</td><td>2</td></tr>
              <tr><td>6</td><td>Jorge Peña</td><td>2</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>La subconsulta obtiene el <code>id</code> de "Comercial" y el DELETE borra a todos los empleados de ese departamento.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Borrar filas según un criterio que vive en otra tabla, sin tener que averiguar antes los ids a mano.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Restricciones de clave foránea: si otras tablas dependen de estas filas, el borrado puede fallar o requerir <code>ON DELETE CASCADE</code>.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Convierte primero la subconsulta en un <code>SELECT</code> completo para ver qué filas se borrarían antes de ejecutar el DELETE.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> también puedes usar <code>EXISTS</code> / <code>NOT EXISTS</code> para borrados que dependen de la existencia de filas relacionadas.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/eliminar/t1"><small>Anterior</small><strong>← DELETE ... WHERE</strong></a>
          <a class="next" data-route-link href="#/modulo/eliminar/t3"><small>Siguiente</small><strong>RETURNING →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 3. RETURNING ============ -->
    <section class="topic" id="t3" data-title="RETURNING" data-search="returning delete filas eliminadas log">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">03</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-result"/></svg>
          <h2>RETURNING</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-intermedio"></span> Intermedio</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t3"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Muestra las filas que se <strong>eliminaron</strong>: es la última oportunidad de verlas antes de que desaparezcan.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">DELETE FROM</span> tabla
<span class="k">WHERE</span> condicion
<span class="k">RETURNING</span> columna;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">DELETE FROM</span> empleados
<span class="k">WHERE</span> salario &lt; 3000000
<span class="k">RETURNING</span> id, nombre, salario;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Filas eliminadas: 1</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>id</th><th>nombre</th><th>salario</th></tr></thead>
            <tbody>
              <tr><td>4</td><td>Pedro Sánchez</td><td>2 600 000</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Devuelve las columnas pedidas de cada fila borrada, en la misma operación de DELETE.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Registrar en un log qué se eliminó, o confirmar exactamente qué filas cayeron con esa condición.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Pensar que <code>RETURNING</code> conserva las filas: solo las <em>muestra</em>; ya fueron eliminadas de la tabla.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Combinar <code>DELETE ... RETURNING</code> con un <code>INSERT</code> en una tabla histórica permite "archivar" lo borrado en un solo paso.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> como con INSERT y UPDATE, <code>RETURNING *</code> devuelve la fila completa borrada.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/eliminar/t2"><small>Anterior</small><strong>← DELETE con subconsulta</strong></a>
          <a class="next" data-route-link href="#/modulo/eliminar/t4"><small>Siguiente</small><strong>DELETE vs TRUNCATE →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 4. DELETE vs TRUNCATE ============ -->
    <section class="topic" id="t4" data-title="DELETE vs TRUNCATE" data-search="delete truncate vaciar tabla rapido">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">04</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-scale"/></svg>
          <h2>DELETE vs TRUNCATE</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-intermedio"></span> Intermedio</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t4"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Para vaciar una tabla <strong>por completo</strong>, <code>TRUNCATE</code> es mucho más rápido que <code>DELETE</code>, pero con diferencias importantes.</p>
        <div class="grid2">
          <div>
            <div class="block-label">DELETE (fila por fila)</div>
            <div class="code-block"><pre class="code"><span class="k">DELETE FROM</span> empleados;
<span class="c">-- recorre y borra cada fila,</span>
<span class="c">-- dispara triggers de DELETE,</span>
<span class="c">-- admite WHERE</span></pre></div>
          </div>
          <div>
            <div class="block-label">TRUNCATE (de golpe)</div>
            <div class="code-block"><pre class="code"><span class="k">TRUNCATE</span> empleados;
<span class="c">-- vacía la tabla al instante,</span>
<span class="c">-- no admite WHERE,</span>
<span class="c">-- puede reiniciar el serial</span></pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> empleados: tabla vacía (0 filas)</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>id</th><th>nombre</th><th>cargo</th></tr></thead>
            <tbody>
              <tr><td colspan="3" style="color:var(--ink-3); font-style:italic;">sin filas</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p><code>TRUNCATE</code> elimina todas las filas reiniciando el almacenamiento de la tabla, sin recorrerlas una a una.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Vaciar por completo tablas grandes (por ejemplo, tablas temporales o de staging) donde el rendimiento importa.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Intentar filtrar <code>TRUNCATE</code> con un <code>WHERE</code>: no lo admite. Además, por defecto no dispara los triggers de <code>DELETE</code> por fila.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p><code>TRUNCATE ... RESTART IDENTITY</code> reinicia también el contador <code>serial</code>, dejando la tabla como recién creada.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> <code>TRUNCATE</code> es en realidad DDL (definición), no DML; lo vemos aquí por su contraste directo con <code>DELETE</code>. Verás más DDL en la sección siguiente.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/eliminar/t3"><small>Anterior</small><strong>← RETURNING</strong></a>
          <a class="next" data-route-link href="#/modulo/eliminar/t5"><small>Siguiente</small><strong>El riesgo de omitir WHERE →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 5. El riesgo de omitir WHERE ============ -->
    <section class="topic" id="t5" data-title="El riesgo de omitir WHERE" data-search="sin where borra toda la tabla peligro transaccion rollback">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">05</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-warn"/></svg>
          <h2>El riesgo de omitir WHERE</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-intermedio"></span> Intermedio</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t5"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def"><code>DELETE</code> sin <code>WHERE</code> borra <strong>todas las filas</strong> de la tabla. Y a diferencia de un SELECT, no hay "deshacer" fuera de una transacción.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Peligro</div>
            <div class="code-block"><pre class="code"><span class="c">-- borra TODA la tabla</span>
<span class="k">DELETE FROM</span> empleados;</pre></div>
          </div>
          <div>
            <div class="block-label">Lo seguro</div>
            <div class="code-block"><pre class="code"><span class="k">BEGIN</span>;
<span class="k">DELETE FROM</span> empleados
  <span class="k">WHERE</span> nombre = <span class="s">'Pedro Sánchez'</span>;
<span class="c">-- revisa cuántas filas cayeron y luego:</span>
<span class="k">ROLLBACK</span>;  <span class="c">-- deshace  |  COMMIT; confirma</span></pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> empleados: 7 filas eliminadas (¡toda la tabla!)</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>id</th><th>nombre</th><th>cargo</th></tr></thead>
            <tbody>
              <tr><td colspan="3" style="color:var(--ink-3); font-style:italic;">sin filas: la tabla quedó vacía</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Sin condición, el DELETE recorre y borra cada fila de la tabla.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Casi nunca a propósito; si de verdad quieres vaciar la tabla completa, <code>TRUNCATE</code> suele ser mejor.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Ejecutar el DELETE antes de escribir el <code>WHERE</code>, o correr solo la primera línea de una consulta por accidente.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Envuelve los borrados en una transacción: si el resultado no es el esperado, un <code>ROLLBACK</code> lo deshace. Lo verás a fondo en el módulo de Transacciones.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> dentro de una transacción sin confirmar, <code>ROLLBACK</code> revierte incluso un DELETE que borró toda la tabla; una vez hecho <code>COMMIT</code>, ya no hay vuelta atrás.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/eliminar/t4"><small>Anterior</small><strong>← DELETE vs TRUNCATE</strong></a>
          <span></span>
        </nav>
      </div>
    </section>`;

  var EXERCISES_META = [
    {
      id: 'ex1',
      type: 'mcq',
      prompt: '¿Qué instrucción de DML elimina filas específicas según una condición?',
      options: ['DELETE', 'DROP', 'TRUNCATE', 'REMOVE'],
      correct: 0,
      explanation: 'DELETE borra filas según el WHERE. DROP elimina objetos completos (tablas, vistas) y TRUNCATE vacía toda la tabla de golpe.'
    },
    {
      id: 'ex2',
      type: 'write',
      prompt: 'Escribe el comando que elimina de <code>empleados</code> la fila de "Pedro Sánchez".',
      placeholder: "DELETE FROM empleados WHERE nombre = 'Pedro Sánchez'",
      answers: [
        "delete from empleados where nombre = 'pedro sánchez'",
        "delete from empleados where nombre='pedro sánchez'"
      ],
      explanation: 'DELETE FROM tabla WHERE condicion. El WHERE limita el borrado a esa fila.'
    },
    {
      id: 'ex3',
      type: 'mcq',
      prompt: '¿Cuál es una diferencia correcta entre DELETE y TRUNCATE?',
      options: ['TRUNCATE vacía toda la tabla más rápido y no admite WHERE', 'Son exactamente iguales', 'DELETE no puede usar WHERE', 'TRUNCATE borra una sola fila'],
      correct: 0,
      explanation: 'TRUNCATE elimina todas las filas de golpe (sin WHERE y normalmente sin disparar triggers de fila); DELETE borra fila por fila y sí admite WHERE.'
    },
    {
      id: 'ex4',
      type: 'mcq',
      prompt: '¿Qué ocurre si ejecutas <code>DELETE FROM empleados;</code> sin WHERE?',
      options: ['Borra todas las filas de la tabla', 'Borra solo la primera fila', 'Da siempre un error', 'No hace nada'],
      correct: 0,
      explanation: 'Sin WHERE, el DELETE elimina todas las filas. Por eso conviene revisar el WHERE o trabajar dentro de una transacción.'
    },
    {
      id: 'ex5',
      type: 'mcq',
      prompt: 'Ejecutaste un DELETE equivocado dentro de una transacción y aún no confirmas. ¿Cómo lo deshaces?',
      options: ['Con ROLLBACK antes del COMMIT', 'Con un comando UNDO', 'Ya no se puede deshacer nunca', 'Con un SELECT'],
      correct: 0,
      explanation: 'Mientras la transacción no se haya confirmado, ROLLBACK revierte todos sus cambios, incluido el DELETE.'
    }
  ];

  window.App = window.App || {};
  window.App.modules = window.App.modules || {};
  window.App.modules['eliminar'] = {
    id: 'eliminar',
    topicsMeta: TOPICS_META,
    heroHtml: HERO_HTML,
    schemaHtml: SCHEMA_HTML,
    topicsHtml: TOPICS_HTML,
    exercisesMeta: EXERCISES_META
  };

})();
