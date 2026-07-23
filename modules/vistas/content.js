/* ============================================================
   MÓDULO: Vistas
   Misma forma que los módulos anteriores. Reutiliza empleados/
   departamentos (de modules/joins) para que CREATE VIEW encapsule
   consultas ya conocidas: el filtro de Filtrado de datos, el JOIN
   del módulo anterior, etc.
   ============================================================ */
(function(){
  'use strict';

  var TOPICS_META = [
    { id:'t1', num:'01', title:'CREATE VIEW',           level:'basico',     search:'create view crear vista' },
    { id:'t2', num:'02', title:'Consultar una vista',    level:'basico',     search:'consultar vista select from' },
    { id:'t3', num:'03', title:'Vistas con JOIN',        level:'intermedio', search:'vista join combinar tablas' },
    { id:'t4', num:'04', title:'CREATE OR REPLACE VIEW', level:'intermedio', search:'create or replace view modificar' },
    { id:'t5', num:'05', title:'DROP VIEW',              level:'basico',     search:'drop view eliminar borrar' }
  ];

  var HERO_HTML = `<header class="hero">
      <h1>Vistas: consultas guardadas con nombre</h1>
      <p class="sub">CREATE VIEW, cómo consultarlas, vistas que combinan tablas con JOIN, cómo modificarlas y cómo eliminarlas. Siguen usando las tablas <code>empleados</code> y <code>departamentos</code> de los módulos anteriores.</p>
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

  var TOPICS_HTML = `<!-- ============ 1. CREATE VIEW ============ -->
    <section class="topic" id="t1" data-title="CREATE VIEW" data-search="create view crear vista">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">01</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-mod-vistas"/></svg>
          <h2>CREATE VIEW</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-basico"></span> Básico</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t1"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Guarda una consulta <strong>SELECT con un nombre</strong>, para poder reutilizarla como si fuera una tabla, sin volver a escribirla cada vez.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">CREATE VIEW</span> nombre_vista <span class="k">AS</span>
<span class="k">SELECT</span> ...;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">CREATE VIEW</span> ingenieros_datos <span class="k">AS</span>
<span class="k">SELECT</span> nombre, salario
<span class="k">FROM</span> empleados
<span class="k">WHERE</span> cargo = <span class="s">'Ingeniera de Datos'</span>;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Contenido de la vista (si se consulta)</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>nombre</th><th>salario</th></tr></thead>
            <tbody>
              <tr><td>Ana Torres</td><td>4 200 000</td></tr>
              <tr><td>Marta Ruiz</td><td>4 500 000</td></tr>
              <tr><td>Sofía León</td><td>4 200 000</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>CREATE VIEW no copia datos ni ejecuta nada de inmediato: solo guarda la definición de la consulta bajo un nombre, en el catálogo de la base de datos.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Cuando una misma consulta (o una parte de ella) se repite en varios reportes o aplicaciones, para no mantener la misma lógica copiada en varios lugares.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Intentar crear una vista con un nombre que ya existe (como tabla o vista) sin usar CREATE OR REPLACE ni eliminarla antes: PostgreSQL lo rechaza.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Nombrar las vistas de forma que se distingan de las tablas a simple vista, por ejemplo con un prefijo o sufijo (<code>vw_</code>, <code>_view</code>) según la convención del equipo.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> CREATE VIEW en PostgreSQL devuelve el mensaje "CREATE VIEW" y ninguna fila; para ver los datos hace falta consultarla, que es justamente el siguiente tema.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <span></span>
          <a class="next" data-route-link href="#/modulo/vistas/t2"><small>Siguiente</small><strong>Consultar una vista →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 2. Consultar una vista ============ -->
    <section class="topic" id="t2" data-title="Consultar una vista" data-search="consultar vista select from">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">02</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-select"/></svg>
          <h2>Consultar una vista</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-basico"></span> Básico</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t2"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Una vez creada, una vista se consulta exactamente igual que una <strong>tabla normal</strong>: con SELECT, WHERE, ORDER BY, JOIN, todo lo aprendido hasta ahora.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> columnas <span class="k">FROM</span> nombre_vista;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> *
<span class="k">FROM</span> ingenieros_datos
<span class="k">ORDER BY</span> salario <span class="k">DESC</span>;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Resultado</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>nombre</th><th>salario</th></tr></thead>
            <tbody>
              <tr><td>Marta Ruiz</td><td>4 500 000</td></tr>
              <tr><td>Ana Torres</td><td>4 200 000</td></tr>
              <tr><td>Sofía León</td><td>4 200 000</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>PostgreSQL sustituye la vista por su definición y ejecuta la consulta combinada contra las tablas reales; el ORDER BY de aquí se suma al de la vista, no lo reemplaza.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Siempre que se necesiten los datos que la vista ya filtra o combina, sin repetir esa lógica en cada consulta.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Suponer que la vista guarda una foto fija de los datos: si la tabla empleados cambia, la próxima consulta a la vista refleja el cambio de inmediato, porque no hay datos "congelados".</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Tratar una vista simple como una tabla más de solo lectura en la mayoría de los casos, aunque algunas vistas sencillas también admiten INSERT/UPDATE bajo ciertas condiciones.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> este resultado es idéntico al que se obtendría escribiendo <code>SELECT nombre, salario FROM empleados WHERE cargo = 'Ingeniera de Datos' ORDER BY salario DESC</code> directamente; la vista solo evita repetir esa lógica.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/vistas/t1"><small>Anterior</small><strong>← CREATE VIEW</strong></a>
          <a class="next" data-route-link href="#/modulo/vistas/t3"><small>Siguiente</small><strong>Vistas con JOIN →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 3. Vistas con JOIN ============ -->
    <section class="topic" id="t3" data-title="Vistas con JOIN" data-search="vista join combinar tablas">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">03</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-mod-joins"/></svg>
          <h2>Vistas con JOIN</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-intermedio"></span> Intermedio</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t3"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Uno de los usos más comunes de las vistas: <strong>esconder un JOIN</strong> detrás de un nombre simple, para que quien consulte la vista no tenga que conocer la relación entre las tablas.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">CREATE VIEW</span> nombre_vista <span class="k">AS</span>
<span class="k">SELECT</span> ... <span class="k">FROM</span> t1 <span class="k">JOIN</span> t2 <span class="k">ON</span> ...;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">CREATE VIEW</span> empleados_departamento <span class="k">AS</span>
<span class="k">SELECT</span> e.nombre, e.salario, d.nombre <span class="k">AS</span> departamento
<span class="k">FROM</span> empleados e
<span class="k">LEFT JOIN</span> departamentos d <span class="k">ON</span> e.departamento_id = d.id;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Resultado: SELECT * FROM empleados_departamento ORDER BY nombre;</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>nombre</th><th>salario</th><th>departamento</th></tr></thead>
            <tbody>
              <tr><td>Ana Torres</td><td>4 200 000</td><td>Tecnología</td></tr>
              <tr><td>Carla Díaz</td><td>6 800 000</td><td class="null">NULL</td></tr>
              <tr><td>Jorge Peña</td><td>3 100 000</td><td>Comercial</td></tr>
              <tr><td>Luis Gómez</td><td>3 100 000</td><td>Comercial</td></tr>
              <tr><td>Marta Ruiz</td><td>4 500 000</td><td>Tecnología</td></tr>
              <tr><td>Pedro Sánchez</td><td>2 600 000</td><td>Comercial</td></tr>
              <tr><td>Sofía León</td><td>4 200 000</td><td>Tecnología</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Quien use <code>empleados_departamento</code> ve una sola "tabla" con columna departamento ya resuelta; no necesita saber que por debajo hay un LEFT JOIN contra otra tabla.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Para simplificar el acceso a datos que siempre se consultan combinados, o para dar a otro equipo (por ejemplo, reportes) una versión más simple del modelo de datos.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Encadenar demasiadas vistas sobre vistas: cada nivel añade complejidad al plan de ejecución y dificulta diagnosticar consultas lentas.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Documentar qué tablas y JOIN usa cada vista (en un comentario o en un README del proyecto), porque su definición queda "oculta" para quien solo la consulta.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> el resultado es exactamente el del LEFT JOIN visto en el módulo de JOINs; la vista no cambia el resultado, solo le pone un nombre reutilizable.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/vistas/t2"><small>Anterior</small><strong>← Consultar una vista</strong></a>
          <a class="next" data-route-link href="#/modulo/vistas/t4"><small>Siguiente</small><strong>CREATE OR REPLACE VIEW →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 4. CREATE OR REPLACE VIEW ============ -->
    <section class="topic" id="t4" data-title="CREATE OR REPLACE VIEW" data-search="create or replace view modificar">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">04</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-view-replace"/></svg>
          <h2>CREATE OR REPLACE VIEW</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-intermedio"></span> Intermedio</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t4"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def"><strong>Actualiza</strong> la definición de una vista existente, sin necesidad de eliminarla primero.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">CREATE OR REPLACE VIEW</span> nombre_vista <span class="k">AS</span>
<span class="k">SELECT</span> ...;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">CREATE OR REPLACE VIEW</span> ingenieros_datos <span class="k">AS</span>
<span class="k">SELECT</span> nombre, cargo, salario
<span class="k">FROM</span> empleados
<span class="k">WHERE</span> cargo <span class="k">LIKE</span> <span class="s">'%Ingeniera%'</span>;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Contenido de la vista actualizada</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>nombre</th><th>cargo</th><th>salario</th></tr></thead>
            <tbody>
              <tr><td>Ana Torres</td><td>Ingeniera de Datos</td><td>4 200 000</td></tr>
              <tr><td>Marta Ruiz</td><td>Ingeniera de Datos</td><td>4 500 000</td></tr>
              <tr><td>Sofía León</td><td>Ingeniera de Datos</td><td>4 200 000</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Reemplaza la definición guardada de <code>ingenieros_datos</code>: ahora agrega la columna cargo y usa LIKE en vez de una igualdad exacta.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Para ajustar una vista ya usada por otras consultas o aplicaciones, sin romper los permisos y dependencias que ya tenía asociados.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>PostgreSQL solo permite agregar columnas al final, o cambiar la lógica interna manteniendo las mismas columnas y tipos; quitar o renombrar una columna existente exige DROP VIEW y CREATE VIEW de nuevo.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Preferir CREATE OR REPLACE VIEW sobre DROP + CREATE cuando la vista tiene permisos otorgados a otros usuarios: reemplazarla los conserva, recrearla desde cero los elimina.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> el resultado no cambió en este caso (sigue habiendo solo Ingenieras de Datos), pero la definición sí: ahora acepta cualquier cargo que contenga "Ingeniera", y trae una columna más.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/vistas/t3"><small>Anterior</small><strong>← Vistas con JOIN</strong></a>
          <a class="next" data-route-link href="#/modulo/vistas/t5"><small>Siguiente</small><strong>DROP VIEW →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 5. DROP VIEW ============ -->
    <section class="topic" id="t5" data-title="DROP VIEW" data-search="drop view eliminar borrar">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">05</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-view-drop"/></svg>
          <h2>DROP VIEW</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-basico"></span> Básico</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t5"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def"><strong>Elimina</strong> una vista de la base de datos. Solo borra la definición guardada; las tablas de origen no se ven afectadas.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">DROP VIEW</span> nombre_vista;
<span class="k">DROP VIEW IF EXISTS</span> nombre_vista;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">DROP VIEW IF EXISTS</span> ingenieros_datos;</pre></div>
          </div>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Borra únicamente el nombre y la definición guardada de la vista; los datos siguen intactos en <code>empleados</code> y <code>departamentos</code>, porque la vista nunca los copió.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Al limpiar vistas temporales o ya no usadas, o antes de recrear una vista con una estructura de columnas distinta a la actual.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Usar DROP VIEW sin <code>IF EXISTS</code> sobre una vista que ya no existe: PostgreSQL lanza error y detiene el script; con IF EXISTS simplemente no hace nada si no la encuentra.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Antes de eliminar una vista en un entorno compartido, verificar si otras vistas o consultas dependen de ella; PostgreSQL avisa con error si algo más la usa, salvo que se use <code>CASCADE</code>.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> <code>DROP VIEW nombre CASCADE</code> elimina también cualquier objeto que dependa de esa vista (como otra vista construida encima); conviene revisar antes qué se va a arrastrar.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/vistas/t4"><small>Anterior</small><strong>← CREATE OR REPLACE VIEW</strong></a>
          <span></span>
        </nav>
      </div>
    </section>`;

  var EXERCISES_META = [
    {
      id: 'ex1',
      type: 'mcq',
      prompt: '¿Qué comando crea una vista llamada <code>resumen</code> a partir de una consulta?',
      options: ['CREATE TABLE resumen AS ...', 'CREATE VIEW resumen AS ...', 'NEW VIEW resumen AS ...', 'MAKE VIEW resumen AS ...'],
      correct: 1,
      explanation: 'CREATE VIEW nombre AS SELECT ... guarda la consulta con ese nombre; CREATE TABLE AS en cambio copiaría los datos a una tabla nueva, algo distinto.'
    },
    {
      id: 'ex2',
      type: 'write',
      prompt: 'Escribe el comando para consultar todas las columnas de una vista llamada <code>ingenieros_datos</code>.',
      placeholder: 'SELECT * FROM ingenieros_datos',
      answers: ['select * from ingenieros_datos'],
      explanation: 'Una vista se consulta exactamente igual que una tabla: SELECT * FROM nombre_vista.'
    },
    {
      id: 'ex3',
      type: 'mcq',
      prompt: '¿Qué guarda realmente una vista normal (no materializada) en PostgreSQL?',
      options: ['Una copia de los datos en el momento de crearla', 'La definición de la consulta; los datos se calculan cada vez que se consulta', 'Un archivo CSV en disco', 'Nada, es solo un comentario'],
      correct: 1,
      explanation: 'Una vista normal no almacena datos: guarda la consulta, y esa consulta se vuelve a ejecutar contra las tablas reales cada vez que alguien la consulta.'
    },
    {
      id: 'ex4',
      type: 'mcq',
      prompt: '¿Qué comando permite modificar la definición de una vista sin eliminarla y volver a crearla?',
      options: ['ALTER VIEW ... RENAME', 'CREATE OR REPLACE VIEW', 'UPDATE VIEW', 'MODIFY VIEW'],
      correct: 1,
      explanation: 'CREATE OR REPLACE VIEW reemplaza la definición existente en un solo paso, conservando los permisos y dependencias que ya tenía la vista.'
    },
    {
      id: 'ex5',
      type: 'write',
      prompt: 'Escribe el comando para eliminar una vista llamada <code>ingenieros_datos</code>.',
      placeholder: 'DROP VIEW ingenieros_datos',
      answers: ['drop view ingenieros_datos'],
      explanation: 'DROP VIEW nombre_vista elimina la definición guardada; las tablas de origen no se ven afectadas.'
    }
  ];

  window.App = window.App || {};
  window.App.modules = window.App.modules || {};
  window.App.modules['vistas'] = {
    id: 'vistas',
    topicsMeta: TOPICS_META,
    heroHtml: HERO_HTML,
    schemaHtml: SCHEMA_HTML,
    topicsHtml: TOPICS_HTML,
    exercisesMeta: EXERCISES_META
  };

})();
