/* ============================================================
   MÓDULO: CREATE TABLE y tipos de datos (DDL: Definir estructuras)
   Primera pieza del bloque DDL base: cómo se crean las tablas y
   qué tipos de datos existen. Es el cimiento que faltaba: hasta
   ahora el curso consultaba y modificaba datos, pero nunca había
   mostrado cómo nace una tabla. Misma forma que el resto de
   módulos; resultados ilustrativos (el Playground es solo lectura).
   ============================================================ */
(function(){
  'use strict';

  var TOPICS_META = [
    { id:'t1', num:'01', title:'CREATE TABLE',        level:'basico',     search:'create table crear tabla columnas estructura' },
    { id:'t2', num:'02', title:'Tipos numéricos',     level:'basico',     search:'integer bigint numeric serial decimal enteros' },
    { id:'t3', num:'03', title:'Tipos de texto',      level:'basico',     search:'text varchar char cadenas texto' },
    { id:'t4', num:'04', title:'Fechas y booleanos',  level:'basico',     search:'date timestamp boolean fecha hora true false' },
    { id:'t5', num:'05', title:'DEFAULT e IF NOT EXISTS', level:'intermedio', search:'default valor por defecto if not exists idempotente' }
  ];

  var HERO_HTML = `<header class="hero">
      <h1>CREATE TABLE y tipos de datos</h1>
      <p class="sub">Hasta ahora consultaste y modificaste datos; aquí empieza el <strong>DDL</strong>: cómo nace una tabla. Verás <code>CREATE TABLE</code> y los tipos de datos más usados (numéricos, texto, fechas y booleanos) con los que se diseña <code>empleados</code> y <code>departamentos</code>.</p>
      <p style="margin:0 0 14px 0; font-size:12.5px; color:var(--ink-3);">Por Nelson Leonardo Páez Arias</p>
      <div class="hero__meta">
        <span><svg aria-hidden="true"><use href="#i-check"/></svg> <span id="heroCompletedCount">0/5</span> completados</span>
        <span><svg aria-hidden="true"><use href="#i-hash"/></svg> 5 temas</span>
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
                <th>fecha_ingreso<span class="type">date</span></th>
                <th>departamento_id<span class="type">integer</span></th>
              </tr>
            </thead>
            <tbody>
              <tr><td>1</td><td>Ana Torres</td><td>Ingeniera de Datos</td><td>4 200 000</td><td>2022-03-15</td><td>1</td></tr>
              <tr><td>2</td><td>Luis Gómez</td><td>Analista</td><td>3 100 000</td><td>2023-01-10</td><td>2</td></tr>
              <tr><td>3</td><td>Marta Ruiz</td><td>Ingeniera de Datos</td><td>4 500 000</td><td>2021-11-02</td><td>1</td></tr>
              <tr><td>4</td><td>Pedro Sánchez</td><td>Analista Junior</td><td>2 600 000</td><td>2023-06-20</td><td>2</td></tr>
              <tr><td>5</td><td>Carla Díaz</td><td>Gerente</td><td>6 800 000</td><td>2019-08-30</td><td class="null">NULL</td></tr>
              <tr><td>6</td><td>Jorge Peña</td><td>Analista</td><td>3 100 000</td><td>2022-09-01</td><td>2</td></tr>
              <tr><td>7</td><td>Sofía León</td><td>Ingeniera de Datos</td><td>4 200 000</td><td>2023-02-14</td><td>1</td></tr>
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

  var TOPICS_HTML = `<!-- ============ 1. CREATE TABLE ============ -->
    <section class="topic" id="t1" data-title="CREATE TABLE" data-search="create table crear tabla columnas estructura">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">01</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-mod-createtable"/></svg>
          <h2>CREATE TABLE</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-basico"></span> Básico</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t1"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Crea una tabla nueva definiendo <strong>sus columnas y el tipo de dato</strong> de cada una.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">CREATE TABLE</span> nombre_tabla (
  columna1 tipo,
  columna2 tipo
);</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">CREATE TABLE</span> departamentos (
  id          <span class="k">integer</span>,
  nombre      <span class="k">text</span>,
  presupuesto <span class="k">numeric</span>
);</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> departamentos: tabla creada (0 filas)</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>columna</th><th>tipo</th></tr></thead>
            <tbody>
              <tr><td>id</td><td>integer</td></tr>
              <tr><td>nombre</td><td>text</td></tr>
              <tr><td>presupuesto</td><td>numeric</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Reserva la estructura de la tabla: nombres de columnas y tipos. Todavía no hay datos dentro.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Al diseñar el modelo de datos: cada entidad del sistema (empleados, productos, pedidos) suele ser una tabla.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Usar un nombre que ya existe (da error), o usar palabras reservadas como nombre de columna sin comillas.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Nombres en minúscula con <code>guion_bajo</code> (<em>snake_case</em>) y consistentes; evita mayúsculas y espacios.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> crear la tabla define solo su estructura; para llenarla con filas se usa <code>INSERT</code>, del bloque anterior.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <span></span>
          <a class="next" data-route-link href="#/modulo/crear-tablas/t2"><small>Siguiente</small><strong>Tipos numéricos →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 2. Tipos numéricos ============ -->
    <section class="topic" id="t2" data-title="Tipos numéricos" data-search="integer bigint numeric serial decimal enteros">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">02</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-func-num"/></svg>
          <h2>Tipos numéricos</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-basico"></span> Básico</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t2"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">PostgreSQL distingue enteros, decimales exactos y una forma cómoda de generar <strong>ids autoincrementales</strong>.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Los principales</div>
            <div class="code-block"><pre class="code"><span class="k">integer</span>        <span class="c">-- enteros normales</span>
<span class="k">bigint</span>         <span class="c">-- enteros muy grandes</span>
<span class="k">numeric</span>(12,2)  <span class="c">-- decimal exacto</span>
<span class="k">serial</span>         <span class="c">-- entero autoincremental</span></pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">CREATE TABLE</span> empleados (
  id      <span class="k">serial</span>,
  salario <span class="k">numeric</span>(12,2)
);</pre></div>
          </div>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p><code>numeric(12,2)</code> guarda hasta 12 dígitos con 2 decimales; <code>serial</code> asigna un número consecutivo en cada INSERT.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p><code>integer</code> para cantidades e ids; <code>numeric</code> para dinero y medidas exactas; <code>serial</code> para claves autogeneradas.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Usar <code>float</code>/<code>real</code> para dinero: los flotantes acumulan errores de redondeo en operaciones.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Para valores monetarios, siempre <code>numeric</code>; es exacto y predecible.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> <code>serial</code> no es un tipo "real": es azúcar sintáctico que crea una secuencia y pone la columna como <code>integer</code> con <code>DEFAULT</code> el siguiente valor.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/crear-tablas/t1"><small>Anterior</small><strong>← CREATE TABLE</strong></a>
          <a class="next" data-route-link href="#/modulo/crear-tablas/t3"><small>Siguiente</small><strong>Tipos de texto →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 3. Tipos de texto ============ -->
    <section class="topic" id="t3" data-title="Tipos de texto" data-search="text varchar char cadenas texto">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">03</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-func-text"/></svg>
          <h2>Tipos de texto</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-basico"></span> Básico</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t3"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Para cadenas de caracteres hay tres opciones según si quieres o no un <strong>límite de longitud</strong>.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Los principales</div>
            <div class="code-block"><pre class="code"><span class="k">text</span>         <span class="c">-- longitud ilimitada</span>
<span class="k">varchar</span>(80)  <span class="c">-- hasta 80 caracteres</span>
<span class="k">char</span>(2)      <span class="c">-- exactamente 2 (rellena)</span></pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">CREATE TABLE</span> empleados (
  nombre <span class="k">varchar</span>(80),
  cargo  <span class="k">text</span>
);</pre></div>
          </div>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p><code>text</code> guarda cadenas de cualquier tamaño; <code>varchar(n)</code> impone un máximo; <code>char(n)</code> fija la longitud exacta rellenando con espacios.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p><code>varchar(n)</code> cuando el límite es una regla real (un código de 3 letras); <code>text</code> para el resto.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Poner límites arbitrarios (<code>varchar(255)</code> "por si acaso") que luego estorban cuando el dato crece.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>En PostgreSQL usa <code>text</code> por defecto; solo agrega <code>varchar(n)</code> cuando el límite aporta una validación de verdad.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> a diferencia de otros motores, en PostgreSQL <code>text</code> y <code>varchar</code> rinden igual; <code>varchar(n)</code> solo añade la comprobación del límite.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/crear-tablas/t2"><small>Anterior</small><strong>← Tipos numéricos</strong></a>
          <a class="next" data-route-link href="#/modulo/crear-tablas/t4"><small>Siguiente</small><strong>Fechas y booleanos →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 4. Fechas y booleanos ============ -->
    <section class="topic" id="t4" data-title="Fechas y booleanos" data-search="date timestamp boolean fecha hora true false">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">04</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-func-date"/></svg>
          <h2>Fechas y booleanos</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-basico"></span> Básico</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t4"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Para momentos en el tiempo y para valores de sí/no, PostgreSQL tiene tipos dedicados.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Los principales</div>
            <div class="code-block"><pre class="code"><span class="k">date</span>         <span class="c">-- 2026-07-23</span>
<span class="k">timestamp</span>    <span class="c">-- 2026-07-23 14:30:00</span>
<span class="k">boolean</span>      <span class="c">-- true / false</span></pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">CREATE TABLE</span> empleados (
  fecha_ingreso <span class="k">date</span>,
  activo        <span class="k">boolean</span>
);</pre></div>
          </div>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p><code>date</code> guarda solo la fecha; <code>timestamp</code>, fecha y hora; <code>boolean</code>, un valor verdadero o falso.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p><code>date</code> para cumpleaños o ingresos; <code>timestamp</code> para eventos con hora; <code>boolean</code> para banderas (activo, pagado).</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Guardar fechas como <code>text</code>: se pierde el orden real y las funciones de fecha dejan de funcionar.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Para eventos reales usa <code>timestamptz</code> (con zona horaria); evita confusiones al mostrar la hora en otro huso.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> <code>CURRENT_DATE</code> y <code>NOW()</code> devuelven la fecha/hora actual y sirven muy bien como valor por defecto (siguiente tema).</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/crear-tablas/t3"><small>Anterior</small><strong>← Tipos de texto</strong></a>
          <a class="next" data-route-link href="#/modulo/crear-tablas/t5"><small>Siguiente</small><strong>DEFAULT e IF NOT EXISTS →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 5. DEFAULT e IF NOT EXISTS ============ -->
    <section class="topic" id="t5" data-title="DEFAULT e IF NOT EXISTS" data-search="default valor por defecto if not exists idempotente">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">05</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-toggle"/></svg>
          <h2>DEFAULT e IF NOT EXISTS</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-intermedio"></span> Intermedio</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t5"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def"><code>DEFAULT</code> da a una columna un valor automático; <code>IF NOT EXISTS</code> evita el error si la tabla ya existe.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">CREATE TABLE IF NOT EXISTS</span> tabla (
  columna tipo <span class="k">DEFAULT</span> valor
);</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">CREATE TABLE IF NOT EXISTS</span> empleados (
  id            <span class="k">serial</span>,
  activo        <span class="k">boolean</span> <span class="k">DEFAULT</span> <span class="k">true</span>,
  fecha_ingreso <span class="k">date</span> <span class="k">DEFAULT</span> <span class="k">CURRENT_DATE</span>
);</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> INSERT que omite las columnas con DEFAULT</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>id</th><th>activo</th><th>fecha_ingreso</th></tr></thead>
            <tbody>
              <tr><td>8</td><td>true</td><td>2026-07-23</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Si un <code>INSERT</code> no da valor a esas columnas, PostgreSQL usa el <code>DEFAULT</code> (aquí <code>true</code> y la fecha de hoy).</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p><code>DEFAULT</code> para banderas y timestamps de creación; <code>IF NOT EXISTS</code> en scripts que se ejecutan varias veces.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Un <code>DEFAULT</code> de tipo incompatible con la columna, o creer que <code>IF NOT EXISTS</code> actualiza una tabla existente (no lo hace: solo evita el error).</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p><code>DEFAULT CURRENT_DATE</code> o <code>DEFAULT now()</code> para registrar automáticamente cuándo se creó cada fila.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> <code>IF NOT EXISTS</code> hace el script <em>idempotente</em>: puedes ejecutarlo varias veces sin que falle porque la tabla ya está.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/crear-tablas/t4"><small>Anterior</small><strong>← Fechas y booleanos</strong></a>
          <span></span>
        </nav>
      </div>
    </section>`;

  var EXERCISES_META = [
    {
      id: 'ex1',
      type: 'mcq',
      prompt: '¿Qué instrucción crea una tabla nueva?',
      options: ['CREATE TABLE', 'INSERT INTO', 'ALTER TABLE', 'MAKE TABLE'],
      correct: 0,
      explanation: 'CREATE TABLE define una tabla y sus columnas. INSERT agrega filas y ALTER modifica una tabla que ya existe.'
    },
    {
      id: 'ex2',
      type: 'write',
      prompt: 'Escribe el tipo de dato recomendado en PostgreSQL para guardar dinero de forma exacta.',
      placeholder: 'numeric',
      answers: ['numeric', 'numeric(12,2)', 'decimal'],
      explanation: 'numeric (o decimal) guarda decimales de forma exacta; los tipos float/real acumulan errores de redondeo y no sirven para dinero.'
    },
    {
      id: 'ex3',
      type: 'mcq',
      prompt: '¿Para qué sirve el tipo <code>serial</code>?',
      options: ['Genera un entero autoincremental (ideal para ids)', 'Guarda texto largo', 'Guarda fechas', 'Guarda valores true/false'],
      correct: 0,
      explanation: 'serial crea una secuencia y usa su siguiente valor como DEFAULT; se usa para claves autogeneradas como el id.'
    },
    {
      id: 'ex4',
      type: 'mcq',
      prompt: '¿Qué hace <code>DEFAULT</code> en la definición de una columna?',
      options: ['Da un valor automático cuando el INSERT no la incluye', 'Obliga a llenarla siempre', 'La convierte en única', 'La elimina'],
      correct: 0,
      explanation: 'DEFAULT define el valor que toma la columna si el INSERT la omite; no obliga a nada, solo rellena.'
    },
    {
      id: 'ex5',
      type: 'mcq',
      prompt: '¿Qué logra <code>CREATE TABLE IF NOT EXISTS</code>?',
      options: ['No da error si la tabla ya existe', 'Crea la tabla dos veces', 'Borra la tabla existente y la recrea', 'Nada, es ignorado'],
      correct: 0,
      explanation: 'IF NOT EXISTS hace el comando idempotente: si la tabla ya está, no la toca ni lanza error.'
    }
  ];

  window.App = window.App || {};
  window.App.modules = window.App.modules || {};
  window.App.modules['crear-tablas'] = {
    id: 'crear-tablas',
    topicsMeta: TOPICS_META,
    heroHtml: HERO_HTML,
    schemaHtml: SCHEMA_HTML,
    topicsHtml: TOPICS_HTML,
    exercisesMeta: EXERCISES_META
  };

})();
