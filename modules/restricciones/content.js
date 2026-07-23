/* ============================================================
   MÓDULO: Restricciones / Constraints (DDL: Definir estructuras)
   Segunda pieza del bloque DDL base: las reglas que protegen la
   integridad de los datos. Se apoya en CREATE TABLE del módulo
   anterior. Misma forma que el resto de módulos.
   ============================================================ */
(function(){
  'use strict';

  var TOPICS_META = [
    { id:'t1', num:'01', title:'NOT NULL',     level:'basico',     search:'not null obligatoria vacia' },
    { id:'t2', num:'02', title:'UNIQUE',       level:'basico',     search:'unique unico duplicados repetidos' },
    { id:'t3', num:'03', title:'PRIMARY KEY',  level:'intermedio', search:'primary key clave primaria identificador' },
    { id:'t4', num:'04', title:'FOREIGN KEY',  level:'intermedio', search:'foreign key clave foranea references integridad referencial relacion' },
    { id:'t5', num:'05', title:'CHECK',        level:'intermedio', search:'check condicion validar regla' },
    { id:'t6', num:'06', title:'Nombrar y combinar', level:'intermedio', search:'constraint nombrar combinar restricciones' }
  ];

  var HERO_HTML = `<header class="hero">
      <h1>Restricciones: reglas que protegen los datos</h1>
      <p class="sub">Una tabla no solo define columnas: también define <strong>qué datos son válidos</strong>. Las restricciones (<em>constraints</em>) impiden guardar información incompleta, duplicada o incoherente. Aquí las verás una a una sobre <code>empleados</code> y <code>departamentos</code>.</p>
      <p style="margin:0 0 14px 0; font-size:12.5px; color:var(--ink-3);">Por Nelson Leonardo Páez Arias</p>
      <div class="hero__meta">
        <span><svg aria-hidden="true"><use href="#i-check"/></svg> <span id="heroCompletedCount">0/6</span> completados</span>
        <span><svg aria-hidden="true"><use href="#i-hash"/></svg> 6 temas</span>
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
                <th>correo<span class="type">text</span></th>
                <th>salario<span class="type">numeric</span></th>
                <th>departamento_id<span class="type">integer</span></th>
              </tr>
            </thead>
            <tbody>
              <tr><td>1</td><td>Ana Torres</td><td>ana.torres@empresa.com</td><td>4 200 000</td><td>1</td></tr>
              <tr><td>2</td><td>Luis Gómez</td><td>luis.gomez@empresa.com</td><td>3 100 000</td><td>2</td></tr>
              <tr><td>3</td><td>Marta Ruiz</td><td>marta.ruiz@empresa.com</td><td>4 500 000</td><td>1</td></tr>
              <tr><td>4</td><td>Pedro Sánchez</td><td>pedro.sanchez@empresa.com</td><td>2 600 000</td><td>2</td></tr>
              <tr><td>5</td><td>Carla Díaz</td><td>carla.diaz@empresa.com</td><td>6 800 000</td><td class="null">NULL</td></tr>
              <tr><td>6</td><td>Jorge Peña</td><td>jorge.pena@empresa.com</td><td>3 100 000</td><td>2</td></tr>
              <tr><td>7</td><td>Sofía León</td><td>sofia.leon@empresa.com</td><td>4 200 000</td><td>1</td></tr>
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

  var TOPICS_HTML = `<!-- ============ 1. NOT NULL ============ -->
    <section class="topic" id="t1" data-title="NOT NULL" data-search="not null obligatoria vacia">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">01</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-isnull"/></svg>
          <h2>NOT NULL</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-basico"></span> Básico</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t1"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Obliga a que una columna <strong>siempre tenga valor</strong>: no puede quedar en <code>NULL</code>.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">CREATE TABLE</span> tabla (
  columna tipo <span class="k">NOT NULL</span>
);</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">CREATE TABLE</span> empleados (
  nombre <span class="k">text</span> <span class="k">NOT NULL</span>,
  cargo  <span class="k">text</span>
);</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> INSERT sin nombre → rechazado</div>
        <div class="code-block"><pre class="code"><span class="k">INSERT INTO</span> empleados (cargo) <span class="k">VALUES</span> (<span class="s">'Analista'</span>);
<span class="c">ERROR: el valor null en la columna «nombre» viola la restricción not-null</span></pre></div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Rechaza cualquier fila que deje esa columna vacía, tanto en <code>INSERT</code> como en <code>UPDATE</code>.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Columnas obligatorias: un empleado sin nombre o un pedido sin fecha no deberían poder existir.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Agregar <code>NOT NULL</code> a una columna de una tabla que ya tiene filas con <code>NULL</code>: la operación falla hasta corregir esos datos.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Definir <code>NOT NULL</code> desde el diseño evita arrastrar datos incompletos que después cuesta limpiar.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> <code>NOT NULL</code> es la restricción más simple y una de las más útiles: define qué información es obligatoria.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <span></span>
          <a class="next" data-route-link href="#/modulo/restricciones/t2"><small>Siguiente</small><strong>UNIQUE →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 2. UNIQUE ============ -->
    <section class="topic" id="t2" data-title="UNIQUE" data-search="unique unico duplicados repetidos">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">02</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-distinct"/></svg>
          <h2>UNIQUE</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-basico"></span> Básico</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t2"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Garantiza que <strong>no haya valores repetidos</strong> en una columna.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">CREATE TABLE</span> tabla (
  columna tipo <span class="k">UNIQUE</span>
);</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">CREATE TABLE</span> empleados (
  correo <span class="k">text</span> <span class="k">UNIQUE</span>
);</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Correo repetido → rechazado</div>
        <div class="code-block"><pre class="code"><span class="k">INSERT INTO</span> empleados (correo) <span class="k">VALUES</span> (<span class="s">'ana.torres@empresa.com'</span>);
<span class="c">ERROR: llave duplicada viola la restricción de unicidad «empleados_correo_key»</span></pre></div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Rechaza insertar o actualizar una fila si el valor ya existe en otra fila de esa columna.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Datos que deben ser irrepetibles: correos, números de documento, códigos de producto.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Esperar que <code>UNIQUE</code> impida varios <code>NULL</code>: no lo hace, porque <code>NULL</code> no se considera igual a otro <code>NULL</code>.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Se puede declarar <code>UNIQUE</code> sobre varias columnas a la vez para exigir que la <em>combinación</em> sea única.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> una columna <code>UNIQUE</code> admite varios <code>NULL</code>; la unicidad solo aplica a valores reales.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/restricciones/t1"><small>Anterior</small><strong>← NOT NULL</strong></a>
          <a class="next" data-route-link href="#/modulo/restricciones/t3"><small>Siguiente</small><strong>PRIMARY KEY →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 3. PRIMARY KEY ============ -->
    <section class="topic" id="t3" data-title="PRIMARY KEY" data-search="primary key clave primaria identificador">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">03</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-mod-constraints"/></svg>
          <h2>PRIMARY KEY</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-intermedio"></span> Intermedio</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t3"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Identifica de forma única cada fila. Combina <code>NOT NULL</code> + <code>UNIQUE</code> y solo puede haber <strong>una por tabla</strong>.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">CREATE TABLE</span> tabla (
  id tipo <span class="k">PRIMARY KEY</span>
);</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">CREATE TABLE</span> empleados (
  id     <span class="k">serial</span> <span class="k">PRIMARY KEY</span>,
  nombre <span class="k">text</span> <span class="k">NOT NULL</span>
);</pre></div>
          </div>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Marca la columna (o columnas) que sirve de <strong>identificador oficial</strong> de cada fila; no admite nulos ni duplicados.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Siempre: toda tabla debería tener una clave primaria para poder referirse a sus filas sin ambigüedad.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Declarar dos <code>PRIMARY KEY</code>: solo se permite una. Si la identidad son varias columnas, se usa una <em>clave compuesta</em>.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Una columna <code>id serial PRIMARY KEY</code> es la clave más simple y estable; no depende de datos que puedan cambiar.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> <code>PRIMARY KEY</code> equivale a <code>NOT NULL</code> + <code>UNIQUE</code>, más el rol semántico de ser el identificador de la fila (y suele crear un índice automáticamente).</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/restricciones/t2"><small>Anterior</small><strong>← UNIQUE</strong></a>
          <a class="next" data-route-link href="#/modulo/restricciones/t4"><small>Siguiente</small><strong>FOREIGN KEY →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 4. FOREIGN KEY ============ -->
    <section class="topic" id="t4" data-title="FOREIGN KEY" data-search="foreign key clave foranea references integridad referencial relacion">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">04</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-mod-joins"/></svg>
          <h2>FOREIGN KEY</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-intermedio"></span> Intermedio</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t4"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Obliga a que el valor de una columna <strong>exista en otra tabla</strong>. Es la base de las relaciones entre tablas.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">CREATE TABLE</span> tabla (
  fk tipo <span class="k">REFERENCES</span> otra_tabla (col)
);</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">CREATE TABLE</span> empleados (
  id              <span class="k">serial</span> <span class="k">PRIMARY KEY</span>,
  departamento_id <span class="k">integer</span>
    <span class="k">REFERENCES</span> departamentos (id)
);</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> departamento_id = 9 (no existe) → rechazado</div>
        <div class="code-block"><pre class="code"><span class="k">INSERT INTO</span> empleados (departamento_id) <span class="k">VALUES</span> (9);
<span class="c">ERROR: inserción viola la llave foránea «empleados_departamento_id_fkey»</span></pre></div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Garantiza la <strong>integridad referencial</strong>: no puedes asignar un <code>departamento_id</code> que no exista en <code>departamentos</code>.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Siempre que una columna apunte a otra tabla: empleado → departamento, pedido → cliente.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Intentar borrar un departamento que todavía tiene empleados: la clave foránea lo impide, salvo que definas <code>ON DELETE CASCADE</code>.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Elegir el comportamiento al borrar el padre: <code>ON DELETE SET NULL</code> o <code>CASCADE</code> según la regla de negocio.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> la clave foránea es lo que da sentido a los <code>JOIN</code>: conecta <code>empleados</code> con <code>departamentos</code> de forma confiable.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/restricciones/t3"><small>Anterior</small><strong>← PRIMARY KEY</strong></a>
          <a class="next" data-route-link href="#/modulo/restricciones/t5"><small>Siguiente</small><strong>CHECK →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 5. CHECK ============ -->
    <section class="topic" id="t5" data-title="CHECK" data-search="check condicion validar regla">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">05</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-do"/></svg>
          <h2>CHECK</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-intermedio"></span> Intermedio</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t5"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Impone una <strong>condición</strong> que cada fila debe cumplir para ser válida.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">CREATE TABLE</span> tabla (
  columna tipo <span class="k">CHECK</span> (condicion)
);</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">CREATE TABLE</span> empleados (
  salario <span class="k">numeric</span> <span class="k">CHECK</span> (salario &gt;= 0)
);</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> salario negativo → rechazado</div>
        <div class="code-block"><pre class="code"><span class="k">INSERT INTO</span> empleados (salario) <span class="k">VALUES</span> (-100000);
<span class="c">ERROR: la fila nueva viola la restricción de verificación «empleados_salario_check»</span></pre></div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Evalúa la condición en cada <code>INSERT</code> y <code>UPDATE</code>; si da falso, rechaza la operación.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Reglas de negocio simples: rangos (<code>salario &gt;= 0</code>), listas de valores permitidos, longitudes mínimas.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Escribir condiciones que dependan de otras filas o tablas: un <code>CHECK</code> solo ve los valores de la fila actual.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Usar <code>CHECK</code> para validaciones sencillas; la lógica compleja o entre tablas va mejor en un <em>trigger</em>.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> el <code>CHECK</code> protege los datos aunque distintos programas escriban en la tabla: la regla vive en la base, no en la aplicación.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/restricciones/t4"><small>Anterior</small><strong>← FOREIGN KEY</strong></a>
          <a class="next" data-route-link href="#/modulo/restricciones/t6"><small>Siguiente</small><strong>Nombrar y combinar →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 6. Nombrar y combinar ============ -->
    <section class="topic" id="t6" data-title="Nombrar y combinar" data-search="constraint nombrar combinar restricciones">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">06</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-idx-composite"/></svg>
          <h2>Nombrar y combinar</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-intermedio"></span> Intermedio</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t6"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Una tabla suele combinar varias restricciones, y conviene <strong>darles nombre</strong> para reconocerlas en los mensajes de error.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">CREATE TABLE</span> tabla (
  columna tipo,
  <span class="k">CONSTRAINT</span> nombre_regla <span class="k">CHECK</span> (condicion)
);</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">CREATE TABLE</span> empleados (
  id      <span class="k">serial</span> <span class="k">PRIMARY KEY</span>,
  nombre  <span class="k">text</span> <span class="k">NOT NULL</span>,
  correo  <span class="k">text</span> <span class="k">UNIQUE</span>,
  salario <span class="k">numeric</span>
    <span class="k">CONSTRAINT</span> salario_positivo <span class="k">CHECK</span> (salario &gt;= 0),
  departamento_id <span class="k">integer</span>
    <span class="k">REFERENCES</span> departamentos (id)
);</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> empleados: reglas de la tabla</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>columna</th><th>restricción</th></tr></thead>
            <tbody>
              <tr><td>id</td><td>PRIMARY KEY</td></tr>
              <tr><td>nombre</td><td>NOT NULL</td></tr>
              <tr><td>correo</td><td>UNIQUE</td></tr>
              <tr><td>salario</td><td>CHECK (salario &gt;= 0)</td></tr>
              <tr><td>departamento_id</td><td>FOREIGN KEY → departamentos</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Reúne todas las reglas de integridad de la tabla en una sola definición coherente.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>En prácticamente cualquier tabla real: casi siempre hay una clave, algún dato obligatorio y alguna regla de validez.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Dejar que PostgreSQL invente el nombre: los errores salen con nombres crípticos difíciles de rastrear.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Nombrar las restricciones con <code>CONSTRAINT nombre ...</code> hace que el mensaje de error diga exactamente qué regla se violó.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> con un nombre claro como <code>salario_positivo</code>, el error es autoexplicativo; también facilita quitar o modificar esa restricción después con <code>ALTER TABLE</code>.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/restricciones/t5"><small>Anterior</small><strong>← CHECK</strong></a>
          <span></span>
        </nav>
      </div>
    </section>`;

  var EXERCISES_META = [
    {
      id: 'ex1',
      type: 'mcq',
      prompt: '¿Qué restricción impide que una columna quede vacía?',
      options: ['NOT NULL', 'UNIQUE', 'CHECK', 'DEFAULT'],
      correct: 0,
      explanation: 'NOT NULL obliga a que la columna siempre tenga un valor. UNIQUE evita duplicados y DEFAULT solo rellena si se omite.'
    },
    {
      id: 'ex2',
      type: 'mcq',
      prompt: '¿Qué garantiza la restricción UNIQUE?',
      options: ['Que no haya valores repetidos en la columna', 'Que la columna no sea nula', 'Que el valor exista en otra tabla', 'Un valor por defecto'],
      correct: 0,
      explanation: 'UNIQUE rechaza valores repetidos. Recuerda que admite varios NULL, porque NULL no se considera igual a otro NULL.'
    },
    {
      id: 'ex3',
      type: 'mcq',
      prompt: 'Una PRIMARY KEY equivale a la combinación de...',
      options: ['NOT NULL + UNIQUE', 'solo UNIQUE', 'solo NOT NULL', 'CHECK + DEFAULT'],
      correct: 0,
      explanation: 'La clave primaria no admite nulos ni duplicados (NOT NULL + UNIQUE) y actúa como identificador oficial de la fila.'
    },
    {
      id: 'ex4',
      type: 'write',
      prompt: 'Escribe la restricción <code>CHECK</code> que garantiza que <code>salario</code> nunca sea negativo.',
      placeholder: 'CHECK (salario >= 0)',
      answers: ['check (salario >= 0)', 'check(salario >= 0)', 'check (salario>=0)'],
      explanation: 'CHECK (salario >= 0) rechaza cualquier fila cuyo salario sea menor que cero.'
    },
    {
      id: 'ex5',
      type: 'mcq',
      prompt: '¿Qué garantiza una FOREIGN KEY (REFERENCES)?',
      options: ['Que el valor exista en la tabla referenciada', 'Que el valor sea único', 'Que el valor no sea nulo', 'Que tenga un valor por defecto'],
      correct: 0,
      explanation: 'La clave foránea asegura la integridad referencial: solo permite valores que existan en la tabla a la que apunta.'
    }
  ];

  window.App = window.App || {};
  window.App.modules = window.App.modules || {};
  window.App.modules['restricciones'] = {
    id: 'restricciones',
    topicsMeta: TOPICS_META,
    heroHtml: HERO_HTML,
    schemaHtml: SCHEMA_HTML,
    topicsHtml: TOPICS_HTML,
    exercisesMeta: EXERCISES_META
  };

})();
