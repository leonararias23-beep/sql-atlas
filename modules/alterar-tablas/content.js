/* ============================================================
   MÓDULO: ALTER / DROP / TRUNCATE (DDL: Definir estructuras)
   Tercera pieza del bloque DDL base: cambiar una tabla ya creada,
   agregar o quitar columnas y restricciones, y eliminar o vaciar
   tablas. Cierra el trío CREATE / restricciones / ALTER. Misma
   forma que el resto de módulos.
   ============================================================ */
(function(){
  'use strict';

  var TOPICS_META = [
    { id:'t1', num:'01', title:'ADD COLUMN',        level:'basico',     search:'alter table add column agregar columna' },
    { id:'t2', num:'02', title:'ALTER COLUMN',      level:'intermedio', search:'alter column type set default set not null cambiar tipo' },
    { id:'t3', num:'03', title:'DROP y RENAME',     level:'intermedio', search:'drop column rename renombrar eliminar columna tabla' },
    { id:'t4', num:'04', title:'ADD / DROP CONSTRAINT', level:'intermedio', search:'add drop constraint agregar quitar restriccion' },
    { id:'t5', num:'05', title:'DROP TABLE',        level:'intermedio', search:'drop table eliminar tabla completa cascade' },
    { id:'t6', num:'06', title:'TRUNCATE',          level:'intermedio', search:'truncate vaciar tabla restart identity rapido' }
  ];

  var HERO_HTML = `<header class="hero">
      <h1>ALTER, DROP y TRUNCATE: cambiar y eliminar tablas</h1>
      <p class="sub">Las tablas evolucionan: se agregan columnas, se corrigen tipos, se añaden reglas y, a veces, se eliminan. Aquí verás cómo <strong>modificar la estructura</strong> de una tabla ya creada y cómo borrarla o vaciarla, siempre sobre <code>empleados</code> y <code>departamentos</code>.</p>
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

  var TOPICS_HTML = `<!-- ============ 1. ADD COLUMN ============ -->
    <section class="topic" id="t1" data-title="ADD COLUMN" data-search="alter table add column agregar columna">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">01</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-mod-insert"/></svg>
          <h2>ADD COLUMN</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-basico"></span> Básico</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t1"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Agrega una <strong>columna nueva</strong> a una tabla que ya existe, sin recrearla.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">ALTER TABLE</span> tabla
<span class="k">ADD COLUMN</span> columna tipo;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">ALTER TABLE</span> empleados
<span class="k">ADD COLUMN</span> activo <span class="k">boolean</span> <span class="k">DEFAULT</span> <span class="k">true</span>;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> empleados: nueva columna con el DEFAULT aplicado</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>id</th><th>nombre</th><th>activo</th></tr></thead>
            <tbody>
              <tr><td>1</td><td>Ana Torres</td><td>true</td></tr>
              <tr><td>2</td><td>Luis Gómez</td><td>true</td></tr>
              <tr><td>…</td><td>… (todas)</td><td>true</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Agrega la columna a la tabla; las filas existentes toman el <code>DEFAULT</code>, o <code>NULL</code> si no hay uno.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Cuando el modelo crece: aparece un dato nuevo que hay que empezar a guardar.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Agregar una columna <code>NOT NULL</code> sin <code>DEFAULT</code> a una tabla con filas: no sabría qué poner en las existentes y falla.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Si la columna es obligatoria, agrégala con <code>DEFAULT</code> para que las filas actuales queden válidas de una vez.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> <code>ADD COLUMN IF NOT EXISTS</code> evita el error si la columna ya estaba, útil en scripts repetibles.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <span></span>
          <a class="next" data-route-link href="#/modulo/alterar-tablas/t2"><small>Siguiente</small><strong>ALTER COLUMN →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 2. ALTER COLUMN ============ -->
    <section class="topic" id="t2" data-title="ALTER COLUMN" data-search="alter column type set default set not null cambiar tipo">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">02</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-mod-update"/></svg>
          <h2>ALTER COLUMN</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-intermedio"></span> Intermedio</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t2"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Cambia las propiedades de una columna existente: su <strong>tipo</strong>, su <strong>valor por defecto</strong> o si <strong>admite nulos</strong>.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">ALTER TABLE</span> t <span class="k">ALTER COLUMN</span> col <span class="k">TYPE</span> nuevo_tipo;
<span class="k">ALTER TABLE</span> t <span class="k">ALTER COLUMN</span> col <span class="k">SET DEFAULT</span> valor;
<span class="k">ALTER TABLE</span> t <span class="k">ALTER COLUMN</span> col <span class="k">SET NOT NULL</span>;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">ALTER TABLE</span> empleados
<span class="k">ALTER COLUMN</span> salario <span class="k">TYPE</span> <span class="k">numeric</span>(12,2);</pre></div>
          </div>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Redefine la columna sin borrarla: cambia su tipo, su default o su obligatoriedad, conservando los datos cuando es compatible.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Corregir decisiones de diseño: dar más precisión a un número, poner un default que faltaba, volver obligatoria una columna.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p><code>SET NOT NULL</code> falla si ya hay filas con <code>NULL</code>; un cambio de <code>TYPE</code> falla si los datos no caben en el tipo nuevo.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Para conversiones no obvias usa <code>TYPE nuevo_tipo USING col::nuevo_tipo</code>, que indica cómo transformar los datos.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> antes de <code>SET NOT NULL</code>, limpia las filas con <code>NULL</code> (por ejemplo, con un <code>UPDATE</code>), o el cambio será rechazado.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/alterar-tablas/t1"><small>Anterior</small><strong>← ADD COLUMN</strong></a>
          <a class="next" data-route-link href="#/modulo/alterar-tablas/t3"><small>Siguiente</small><strong>DROP y RENAME →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 3. DROP y RENAME ============ -->
    <section class="topic" id="t3" data-title="DROP y RENAME" data-search="drop column rename renombrar eliminar columna tabla">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">03</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-view-replace"/></svg>
          <h2>DROP y RENAME</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-intermedio"></span> Intermedio</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t3"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Elimina una columna, o cambia el nombre de una columna o de la tabla completa.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">ALTER TABLE</span> t <span class="k">DROP COLUMN</span> col;
<span class="k">ALTER TABLE</span> t <span class="k">RENAME COLUMN</span> col <span class="k">TO</span> nuevo;
<span class="k">ALTER TABLE</span> t <span class="k">RENAME TO</span> nueva_tabla;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">ALTER TABLE</span> empleados
<span class="k">RENAME COLUMN</span> correo <span class="k">TO</span> email;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> empleados: columna renombrada</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>id</th><th>nombre</th><th>email</th></tr></thead>
            <tbody>
              <tr><td>1</td><td>Ana Torres</td><td>ana.torres@empresa.com</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p><code>DROP COLUMN</code> quita la columna <strong>y sus datos</strong> (irreversible); <code>RENAME</code> solo cambia el nombre y no toca los datos.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Limpiar columnas obsoletas o ajustar nombres poco claros a medida que el proyecto madura.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p><code>DROP COLUMN</code> de una columna usada por una vista, índice o clave foránea: puede fallar o requerir <code>CASCADE</code>.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Antes de <code>DROP COLUMN</code>, revisa qué depende de esa columna; renombrar es reversible, borrar no.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> <code>RENAME</code> no rompe los datos, pero sí cualquier consulta o aplicación que use el nombre viejo; hay que actualizarlas.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/alterar-tablas/t2"><small>Anterior</small><strong>← ALTER COLUMN</strong></a>
          <a class="next" data-route-link href="#/modulo/alterar-tablas/t4"><small>Siguiente</small><strong>ADD / DROP CONSTRAINT →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 4. ADD / DROP CONSTRAINT ============ -->
    <section class="topic" id="t4" data-title="ADD / DROP CONSTRAINT" data-search="add drop constraint agregar quitar restriccion">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">04</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-mod-constraints"/></svg>
          <h2>ADD / DROP CONSTRAINT</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-intermedio"></span> Intermedio</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t4"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Agrega o quita <strong>restricciones</strong> a una tabla que ya existe, sin volver a crearla.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">ALTER TABLE</span> t
<span class="k">ADD CONSTRAINT</span> nombre <span class="k">CHECK</span> (condicion);

<span class="k">ALTER TABLE</span> t <span class="k">DROP CONSTRAINT</span> nombre;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">ALTER TABLE</span> empleados
<span class="k">ADD CONSTRAINT</span> salario_positivo
  <span class="k">CHECK</span> (salario &gt;= 0);</pre></div>
          </div>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Aplica una regla nueva a la tabla; PostgreSQL valida los datos existentes contra ella antes de aceptarla.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Endurecer las reglas después: agregar una clave foránea, exigir un rango, marcar algo como único.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p><code>ADD CONSTRAINT</code> falla si los datos actuales ya violan la regla; primero hay que corregirlos.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Ponerle nombre a la restricción es lo que permite quitarla después con <code>DROP CONSTRAINT nombre</code>.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> para una clave foránea: <code>ADD CONSTRAINT fk FOREIGN KEY (departamento_id) REFERENCES departamentos (id)</code>.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/alterar-tablas/t3"><small>Anterior</small><strong>← DROP y RENAME</strong></a>
          <a class="next" data-route-link href="#/modulo/alterar-tablas/t5"><small>Siguiente</small><strong>DROP TABLE →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 5. DROP TABLE ============ -->
    <section class="topic" id="t5" data-title="DROP TABLE" data-search="drop table eliminar tabla completa cascade">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">05</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-view-drop"/></svg>
          <h2>DROP TABLE</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-intermedio"></span> Intermedio</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t5"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Elimina una tabla <strong>por completo</strong>: su estructura y todos sus datos.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">DROP TABLE</span> tabla;
<span class="k">DROP TABLE IF EXISTS</span> tabla;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">DROP TABLE</span> empleados_bogota;</pre></div>
          </div>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Borra la tabla entera del esquema: no quedan ni las columnas ni los datos. Es irreversible.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Eliminar tablas temporales, de pruebas o que ya no forman parte del modelo.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Borrar una tabla referenciada por una clave foránea de otra: PostgreSQL lo impide salvo que uses <code>CASCADE</code> (que también borra lo dependiente).</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p><code>DROP TABLE IF EXISTS</code> en scripts para que no fallen si la tabla ya no está; usa <code>CASCADE</code> con mucha cautela.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> <code>DROP TABLE</code> elimina estructura y datos; si solo quieres vaciar la tabla conservándola, usa <code>TRUNCATE</code> (siguiente tema).</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/alterar-tablas/t4"><small>Anterior</small><strong>← ADD / DROP CONSTRAINT</strong></a>
          <a class="next" data-route-link href="#/modulo/alterar-tablas/t6"><small>Siguiente</small><strong>TRUNCATE →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 6. TRUNCATE ============ -->
    <section class="topic" id="t6" data-title="TRUNCATE" data-search="truncate vaciar tabla restart identity rapido">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">06</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-empty"/></svg>
          <h2>TRUNCATE</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-intermedio"></span> Intermedio</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t6"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Vacía una tabla por completo, mucho más rápido que <code>DELETE</code>, pero <strong>conservando su estructura</strong>.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">TRUNCATE</span> tabla;
<span class="k">TRUNCATE</span> tabla <span class="k">RESTART IDENTITY</span>;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">TRUNCATE</span> empleados <span class="k">RESTART IDENTITY</span>;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> empleados: tabla vacía, el id vuelve a empezar en 1</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>id</th><th>nombre</th><th>salario</th></tr></thead>
            <tbody>
              <tr><td colspan="3" style="color:var(--ink-3); font-style:italic;">sin filas: la estructura sigue intacta</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Elimina todas las filas de golpe reiniciando el almacenamiento; la tabla y sus columnas siguen existiendo.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Vaciar por completo tablas grandes, temporales o de <em>staging</em>, donde el rendimiento importa.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Intentar filtrar con <code>WHERE</code>: <code>TRUNCATE</code> no lo admite. Por defecto tampoco dispara los <em>triggers</em> de <code>DELETE</code> por fila.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p><code>RESTART IDENTITY</code> reinicia el contador <code>serial</code>, dejando la tabla como recién creada.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> recordatorio del módulo DELETE: <code>DELETE</code> borra fila por fila (y admite <code>WHERE</code>); <code>TRUNCATE</code> vacía de golpe y es DDL.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/alterar-tablas/t5"><small>Anterior</small><strong>← DROP TABLE</strong></a>
          <span></span>
        </nav>
      </div>
    </section>`;

  var EXERCISES_META = [
    {
      id: 'ex1',
      type: 'mcq',
      prompt: '¿Qué comando agrega una columna a una tabla que ya existe?',
      options: ['ALTER TABLE ... ADD COLUMN', 'CREATE COLUMN', 'INSERT COLUMN', 'ADD TABLE'],
      correct: 0,
      explanation: 'ALTER TABLE modifica la estructura; ADD COLUMN incorpora una columna nueva sin recrear la tabla.'
    },
    {
      id: 'ex2',
      type: 'write',
      prompt: 'Escribe el comando que agrega a <code>empleados</code> una columna <code>activo</code> de tipo <code>boolean</code> con valor por defecto <code>true</code>.',
      placeholder: 'ALTER TABLE empleados ADD COLUMN activo boolean DEFAULT true',
      answers: [
        'alter table empleados add column activo boolean default true',
        'alter table empleados add activo boolean default true'
      ],
      explanation: 'ALTER TABLE empleados ADD COLUMN activo boolean DEFAULT true; las filas existentes toman el DEFAULT.'
    },
    {
      id: 'ex3',
      type: 'mcq',
      prompt: '¿Cuál es la diferencia entre DROP TABLE y TRUNCATE?',
      options: ['DROP TABLE elimina la tabla entera; TRUNCATE solo borra sus filas y conserva la estructura', 'Son exactamente iguales', 'TRUNCATE borra la estructura', 'DROP TABLE conserva los datos'],
      correct: 0,
      explanation: 'DROP TABLE elimina estructura y datos; TRUNCATE vacía las filas pero deja la tabla lista para volver a usarse.'
    },
    {
      id: 'ex4',
      type: 'mcq',
      prompt: 'Al ejecutar ADD CONSTRAINT sobre datos que ya violan la regla, ¿qué ocurre?',
      options: ['Falla hasta que corrijas los datos existentes', 'Se aplica igual e ignora los datos', 'Borra las filas que no cumplen', 'No hace nada'],
      correct: 0,
      explanation: 'PostgreSQL valida los datos actuales contra la nueva restricción; si alguno la incumple, rechaza el ALTER.'
    },
    {
      id: 'ex5',
      type: 'mcq',
      prompt: '¿Para qué sirve RESTART IDENTITY en TRUNCATE?',
      options: ['Reinicia el contador de la columna serial', 'Conserva los datos', 'Crea un índice', 'Elimina la tabla'],
      correct: 0,
      explanation: 'RESTART IDENTITY reinicia la secuencia asociada, de modo que el próximo id vuelve a empezar en 1.'
    }
  ];

  window.App = window.App || {};
  window.App.modules = window.App.modules || {};
  window.App.modules['alterar-tablas'] = {
    id: 'alterar-tablas',
    topicsMeta: TOPICS_META,
    heroHtml: HERO_HTML,
    schemaHtml: SCHEMA_HTML,
    topicsHtml: TOPICS_HTML,
    exercisesMeta: EXERCISES_META
  };

})();
