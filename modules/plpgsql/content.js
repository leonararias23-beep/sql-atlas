/* ============================================================
   MÓDULO: Funciones PL/pgSQL
   Misma forma que los módulos anteriores. Sigue usando empleados/
   departamentos; cada función encapsula algo que ya se calculó a
   mano en módulos previos (promedio por departamento, conteos),
   ahora como lógica reutilizable dentro de la base de datos.
   ============================================================ */
(function(){
  'use strict';

  var TOPICS_META = [
    { id:'t1', num:'01', title:'CREATE FUNCTION',        level:'basico',     search:'create function crear funcion returns language plpgsql' },
    { id:'t2', num:'02', title:'DECLARE y variables',    level:'basico',     search:'declare variables asignacion' },
    { id:'t3', num:'03', title:'IF / ELSIF / ELSE',      level:'intermedio', search:'if elsif else condicional' },
    { id:'t4', num:'04', title:'LOOP y FOR',             level:'intermedio', search:'loop for bucle iterar' },
    { id:'t5', num:'05', title:'RETURNS TABLE',          level:'intermedio', search:'returns table setof return query tabla' },
    { id:'t6', num:'06', title:'Parámetros OUT',         level:'intermedio', search:'parametros in out default' },
    { id:'t7', num:'07', title:'Manejo de excepciones',  level:'avanzado',   search:'exception raise notice division by zero' },
    { id:'t8', num:'08', title:'CALL y procedimientos',  level:'avanzado',   search:'call procedure procedimiento almacenado commit' }
  ];

  var HERO_HTML = `<header class="hero">
      <h1>Funciones PL/pgSQL: lógica dentro de la base de datos</h1>
      <p class="sub">CREATE FUNCTION, variables, condicionales, bucles, funciones que devuelven tablas, parámetros de salida, manejo de excepciones y procedimientos con CALL. Sigue usando <code>empleados</code> y <code>departamentos</code>.</p>
      <p style="margin:0 0 14px 0; font-size:12.5px; color:var(--ink-3);">Por Nelson Leonardo Páez Arias</p>
      <div class="hero__meta">
        <span><svg aria-hidden="true"><use href="#i-check"/></svg> <span id="heroCompletedCount">0/8</span> completados</span>
        <span><svg aria-hidden="true"><use href="#i-hash"/></svg> 8 temas</span>
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
              </tr>
            </thead>
            <tbody>
              <tr><td>1</td><td>Ana Torres</td><td>Ingeniera de Datos</td><td>4 200 000</td><td>1</td></tr>
              <tr><td>2</td><td>Luis Gómez</td><td>Analista</td><td>3 100 000</td><td>2</td></tr>
              <tr><td>3</td><td>Marta Ruiz</td><td>Ingeniera de Datos</td><td>4 500 000</td><td>1</td></tr>
              <tr><td>4</td><td>Pedro Sánchez</td><td>Analista Junior</td><td>2 600 000</td><td>2</td></tr>
              <tr><td>5</td><td>Carla Díaz</td><td>Gerente</td><td>6 800 000</td><td class="null">NULL</td></tr>
              <tr><td>6</td><td>Jorge Peña</td><td>Analista</td><td>3 100 000</td><td>2</td></tr>
              <tr><td>7</td><td>Sofía León</td><td>Ingeniera de Datos</td><td>4 200 000</td><td>1</td></tr>
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

  var TOPICS_HTML = `<!-- ============ 1. CREATE FUNCTION ============ -->
    <section class="topic" id="t1" data-title="CREATE FUNCTION" data-search="create function crear funcion returns language plpgsql">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">01</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-mod-plpgsql"/></svg>
          <h2>CREATE FUNCTION</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-basico"></span> Básico</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t1"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Guarda un bloque de <strong>lógica reutilizable</strong> dentro de la base de datos, con un nombre, parámetros de entrada y un tipo de dato de retorno.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">CREATE FUNCTION</span> nombre(parametros)
<span class="k">RETURNS</span> tipo <span class="k">AS</span> $$
<span class="k">BEGIN</span>
  ...
<span class="k">END</span>;
$$ <span class="k">LANGUAGE</span> plpgsql;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">CREATE FUNCTION</span> salario_promedio_departamento(dept_id <span class="k">INTEGER</span>)
<span class="k">RETURNS NUMERIC AS</span> $$
<span class="k">BEGIN</span>
  <span class="k">RETURN</span> (<span class="k">SELECT ROUND</span>(<span class="k">AVG</span>(salario))
          <span class="k">FROM</span> empleados
          <span class="k">WHERE</span> departamento_id = dept_id);
<span class="k">END</span>;
$$ <span class="k">LANGUAGE</span> plpgsql;

<span class="k">SELECT</span> salario_promedio_departamento(1);</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Resultado</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>salario_promedio_departamento</th></tr></thead>
            <tbody>
              <tr><td>4 300 000</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Encapsula la misma consulta que ya se escribió a mano en el módulo de Agrupaciones, pero ahora reutilizable con un solo nombre y un parámetro.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Cuando una lógica de cálculo se repite en varias consultas, aplicaciones o reportes, y conviene mantenerla en un solo lugar.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Olvidar que <code>$$</code> delimita el cuerpo de la función (permite escribir comillas simples dentro sin escaparlas); usar comillas simples normales en su lugar complica la sintaxis.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Preferir SQL puro (una vista, una subconsulta) cuando alcanza; reservar PL/pgSQL para cuando de verdad se necesita lógica de control (condicionales, bucles, manejo de errores).</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> 4 300 000 es el mismo promedio de Tecnología calculado con GROUP BY en el módulo de Agrupaciones y de nuevo con una subconsulta en FROM; aquí queda guardado como una función que cualquiera puede llamar con solo el id del departamento.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <span></span>
          <a class="next" data-route-link href="#/modulo/plpgsql/t2"><small>Siguiente</small><strong>DECLARE y variables →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 2. DECLARE y variables ============ -->
    <section class="topic" id="t2" data-title="DECLARE y variables" data-search="declare variables asignacion">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">02</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-mod-plpgsql"/></svg>
          <h2>DECLARE y variables</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-basico"></span> Básico</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t2"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">El bloque <strong>DECLARE</strong> define variables locales que existen solo mientras se ejecuta la función; se asignan con <code>:=</code>.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">DECLARE</span>
  variable tipo;
<span class="k">BEGIN</span>
  variable <span class="k">:=</span> valor;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">CREATE FUNCTION</span> calcular_bono(salario_base <span class="k">NUMERIC</span>)
<span class="k">RETURNS NUMERIC AS</span> $$
<span class="k">DECLARE</span>
  bono <span class="k">NUMERIC</span>;
<span class="k">BEGIN</span>
  bono <span class="k">:=</span> salario_base * 0.10;
  <span class="k">RETURN</span> bono;
<span class="k">END</span>;
$$ <span class="k">LANGUAGE</span> plpgsql;

<span class="k">SELECT</span> calcular_bono(4200000);</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Resultado</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>calcular_bono</th></tr></thead>
            <tbody>
              <tr><td>420 000</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Reserva un espacio temporal llamado "bono", con tipo NUMERIC, que solo existe durante esta ejecución de la función.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Para guardar resultados intermedios, acumular valores en un bucle, o evitar repetir la misma expresión varias veces dentro del cuerpo de la función.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Confundir <code>:=</code> (asignación dentro de PL/pgSQL) con <code>=</code> (comparación e igualdad en SQL); son símbolos distintos con usos distintos.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Declarar variables con nombres claros y, cuando sea posible, con <code>%TYPE</code> (por ejemplo <code>empleados.salario%TYPE</code>) para que el tipo siga automáticamente al de la columna real.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> también se puede declarar con valor inicial en la misma línea, como <code>bono NUMERIC := 0;</code>, en vez de asignarlo después dentro del BEGIN.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/plpgsql/t1"><small>Anterior</small><strong>← CREATE FUNCTION</strong></a>
          <a class="next" data-route-link href="#/modulo/plpgsql/t3"><small>Siguiente</small><strong>IF / ELSIF / ELSE →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 3. IF / ELSIF / ELSE ============ -->
    <section class="topic" id="t3" data-title="IF / ELSIF / ELSE" data-search="if elsif else condicional">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">03</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-plpgsql-if"/></svg>
          <h2>IF / ELSIF / ELSE</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-intermedio"></span> Intermedio</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t3"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Ejecuta un bloque de código u otro según se cumplan una o varias <strong>condiciones</strong>, en orden, deteniéndose en la primera que sea verdadera.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">IF</span> condición <span class="k">THEN</span>
  ...
<span class="k">ELSIF</span> otra_condición <span class="k">THEN</span>
  ...
<span class="k">ELSE</span>
  ...
<span class="k">END IF</span>;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">CREATE FUNCTION</span> nivel_salarial(salario <span class="k">NUMERIC</span>)
<span class="k">RETURNS TEXT AS</span> $$
<span class="k">BEGIN</span>
  <span class="k">IF</span> salario &lt; 3000000 <span class="k">THEN</span>
    <span class="k">RETURN</span> <span class="s">'Bajo'</span>;
  <span class="k">ELSIF</span> salario &lt; 5000000 <span class="k">THEN</span>
    <span class="k">RETURN</span> <span class="s">'Medio'</span>;
  <span class="k">ELSE</span>
    <span class="k">RETURN</span> <span class="s">'Alto'</span>;
  <span class="k">END IF</span>;
<span class="k">END</span>;
$$ <span class="k">LANGUAGE</span> plpgsql;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Resultado: SELECT nombre, salario, nivel_salarial(salario) FROM empleados ORDER BY salario;</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>nombre</th><th>salario</th><th>nivel_salarial</th></tr></thead>
            <tbody>
              <tr><td>Pedro Sánchez</td><td>2 600 000</td><td>Bajo</td></tr>
              <tr><td>Luis Gómez</td><td>3 100 000</td><td>Medio</td></tr>
              <tr><td>Jorge Peña</td><td>3 100 000</td><td>Medio</td></tr>
              <tr><td>Ana Torres</td><td>4 200 000</td><td>Medio</td></tr>
              <tr><td>Sofía León</td><td>4 200 000</td><td>Medio</td></tr>
              <tr><td>Marta Ruiz</td><td>4 500 000</td><td>Medio</td></tr>
              <tr><td>Carla Díaz</td><td>6 800 000</td><td>Alto</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Evalúa las condiciones de arriba hacia abajo; en cuanto una es verdadera, ejecuta ese bloque y sale, sin revisar las siguientes.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Clasificaciones, validaciones y cualquier lógica de "si esto entonces aquello" que no se resuelve bien con un simple CASE en SQL puro.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Olvidar el <code>END IF;</code> final, o escribir <code>ELSE IF</code> (dos palabras) en vez de <code>ELSIF</code> (una sola palabra en PL/pgSQL).</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Si la lógica es puramente "clasificar un valor" sin nada más, evaluar si un <code>CASE WHEN</code> directamente en el SELECT no sería más simple que crear una función completa.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> Luis Gómez y Jorge Peña (3 100 000) caen en "Medio" porque ya no son menores a 3 000 000; el límite exacto pertenece al siguiente tramo, no al anterior.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/plpgsql/t2"><small>Anterior</small><strong>← DECLARE y variables</strong></a>
          <a class="next" data-route-link href="#/modulo/plpgsql/t4"><small>Siguiente</small><strong>LOOP y FOR →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 4. LOOP y FOR ============ -->
    <section class="topic" id="t4" data-title="LOOP y FOR" data-search="loop for bucle iterar">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">04</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-view-replace"/></svg>
          <h2>LOOP y FOR</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-intermedio"></span> Intermedio</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t4"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Repite un bloque de código varias veces. <code>FOR ... IN</code> es la forma más común para recorrer el resultado de una consulta, fila por fila.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">FOR</span> fila <span class="k">IN</span> <span class="k">SELECT</span> ... <span class="k">LOOP</span>
  ...
<span class="k">END LOOP</span>;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">CREATE FUNCTION</span> contar_empleados_departamento(dept_id <span class="k">INTEGER</span>)
<span class="k">RETURNS INTEGER AS</span> $$
<span class="k">DECLARE</span>
  contador <span class="k">INTEGER</span> <span class="k">:=</span> 0;
  fila <span class="k">RECORD</span>;
<span class="k">BEGIN</span>
  <span class="k">FOR</span> fila <span class="k">IN</span> <span class="k">SELECT</span> id <span class="k">FROM</span> empleados <span class="k">WHERE</span> departamento_id = dept_id <span class="k">LOOP</span>
    contador <span class="k">:=</span> contador + 1;
  <span class="k">END LOOP</span>;
  <span class="k">RETURN</span> contador;
<span class="k">END</span>;
$$ <span class="k">LANGUAGE</span> plpgsql;

<span class="k">SELECT</span> contar_empleados_departamento(2);</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Resultado</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>contar_empleados_departamento</th></tr></thead>
            <tbody>
              <tr><td>3</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>La variable <code>fila</code>, de tipo RECORD, toma el valor de cada fila devuelta por la consulta interna, una a la vez, hasta que no quedan más.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Cuando el procesamiento fila por fila necesita lógica que un SELECT simple no puede expresar: llamadas a otras funciones, acumulación con condiciones complejas.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Usar un bucle para contar o sumar filas, como en este mismo ejemplo, cuando <code>SELECT COUNT(*)</code> o <code>SELECT SUM(...)</code> harían exactamente lo mismo en una sola línea y mucho más rápido.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Antes de escribir un bucle sobre una consulta, preguntarse si una función de agregación, un JOIN o una subconsulta no resolvería lo mismo en SQL puro, casi siempre más eficiente.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> este ejemplo es intencionalmente el "camino largo" para calcular algo que ya se sabe hacer con <code>COUNT(*)</code>; existe para mostrar la mecánica del bucle, no porque sea la mejor forma de contar filas.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/plpgsql/t3"><small>Anterior</small><strong>← IF / ELSIF / ELSE</strong></a>
          <a class="next" data-route-link href="#/modulo/plpgsql/t5"><small>Siguiente</small><strong>RETURNS TABLE →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 5. RETURNS TABLE ============ -->
    <section class="topic" id="t5" data-title="RETURNS TABLE" data-search="returns table setof return query tabla">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">05</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-from"/></svg>
          <h2>RETURNS TABLE</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-intermedio"></span> Intermedio</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t5"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Permite que una función devuelva <strong>varias filas y columnas</strong>, para poder consultarla igual que a una tabla, con <code>SELECT * FROM función(...)</code>.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">CREATE FUNCTION</span> nombre(parametros)
<span class="k">RETURNS TABLE</span>(col1 tipo, col2 tipo) <span class="k">AS</span> $$
<span class="k">BEGIN</span>
  <span class="k">RETURN QUERY SELECT</span> ...;
<span class="k">END</span>;
$$ <span class="k">LANGUAGE</span> plpgsql;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">CREATE FUNCTION</span> empleados_por_departamento(dept_id <span class="k">INTEGER</span>)
<span class="k">RETURNS TABLE</span>(nombre <span class="k">TEXT</span>, salario <span class="k">NUMERIC</span>) <span class="k">AS</span> $$
<span class="k">BEGIN</span>
  <span class="k">RETURN QUERY</span>
  <span class="k">SELECT</span> e.nombre, e.salario
  <span class="k">FROM</span> empleados e
  <span class="k">WHERE</span> e.departamento_id = dept_id
  <span class="k">ORDER BY</span> e.nombre;
<span class="k">END</span>;
$$ <span class="k">LANGUAGE</span> plpgsql;

<span class="k">SELECT</span> * <span class="k">FROM</span> empleados_por_departamento(1);</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Resultado</div>
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
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p><code>RETURN QUERY</code> ejecuta el SELECT interno y entrega todas sus filas como salida de la función, en vez de un único valor con <code>RETURN</code>.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Para encapsular una consulta parametrizable que otras partes del sistema necesitan tratar como si fuera una tabla o una vista.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Que los nombres o tipos de columnas del SELECT interno no coincidan con los declarados en <code>RETURNS TABLE(...)</code>: PostgreSQL exige que calcen exactamente.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Si la función solo envuelve un SELECT sin condicionales ni bucles, considerar una vista parametrizada con seguridad a nivel de fila, o simplemente una vista normal más un WHERE externo, en vez de una función.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> el resultado es idéntico al de la vista <code>empleados_por_departamento</code> imaginable del módulo de Vistas; la diferencia es que una función admite parámetros (aquí, dept_id) y una vista normal no.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/plpgsql/t4"><small>Anterior</small><strong>← LOOP y FOR</strong></a>
          <a class="next" data-route-link href="#/modulo/plpgsql/t6"><small>Siguiente</small><strong>Parámetros OUT →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 6. Parámetros OUT ============ -->
    <section class="topic" id="t6" data-title="Parámetros OUT" data-search="parametros in out default">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">06</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-mod-plpgsql"/></svg>
          <h2>Parámetros OUT</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-intermedio"></span> Intermedio</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t6"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Los parámetros son <code>IN</code> por defecto (solo entrada). Un parámetro <code>OUT</code> se convierte automáticamente en parte de lo que la función devuelve, sin necesidad de RETURNS TABLE.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">CREATE FUNCTION</span> nombre(
  parametro <span class="k">IN</span> tipo,
  <span class="k">OUT</span> salida1 tipo,
  <span class="k">OUT</span> salida2 tipo
) <span class="k">AS</span> $$ ... $$ <span class="k">LANGUAGE</span> plpgsql;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">CREATE FUNCTION</span> resumen_departamento(
  dept_id <span class="k">INTEGER</span>,
  <span class="k">OUT</span> cantidad <span class="k">INTEGER</span>,
  <span class="k">OUT</span> promedio <span class="k">NUMERIC</span>
) <span class="k">AS</span> $$
<span class="k">BEGIN</span>
  <span class="k">SELECT COUNT</span>(*), <span class="k">ROUND</span>(<span class="k">AVG</span>(salario))
  <span class="k">INTO</span> cantidad, promedio
  <span class="k">FROM</span> empleados <span class="k">WHERE</span> departamento_id = dept_id;
<span class="k">END</span>;
$$ <span class="k">LANGUAGE</span> plpgsql;

<span class="k">SELECT</span> * <span class="k">FROM</span> resumen_departamento(2);</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Resultado</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>cantidad</th><th>promedio</th></tr></thead>
            <tbody>
              <tr><td>3</td><td>2 933 333</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p><code>SELECT ... INTO</code> asigna cada columna del resultado a las variables OUT indicadas; la función devuelve ambas a la vez, como si fuera una fila de dos columnas.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Cuando una función necesita devolver varios valores relacionados de una sola llamada, sin crear una tabla completa de resultados.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Que la subconsulta detrás de <code>INTO</code> devuelva cero filas: en ese caso las variables OUT quedan en NULL, no en un error, así que conviene validar el resultado si eso es posible.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Los parámetros también admiten valores por defecto (<code>dept_id INTEGER DEFAULT 1</code>), permitiendo llamar la función sin ese argumento cuando aplica un valor razonable.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> el resultado (3, 2 933 333) coincide exactamente con el promedio de Comercial calculado en el módulo de Materialized Views; aquí se obtiene con una sola llamada a función en vez de una consulta agregada completa.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/plpgsql/t5"><small>Anterior</small><strong>← RETURNS TABLE</strong></a>
          <a class="next" data-route-link href="#/modulo/plpgsql/t7"><small>Siguiente</small><strong>Manejo de excepciones →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 7. Manejo de excepciones ============ -->
    <section class="topic" id="t7" data-title="Manejo de excepciones" data-search="exception raise notice division by zero">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">07</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-warn"/></svg>
          <h2>Manejo de excepciones</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-avanzado"></span> Avanzado</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t7"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Captura errores que ocurrirían durante la ejecución, para responder de forma controlada en vez de que la función simplemente falle.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">BEGIN</span>
  ...
<span class="k">EXCEPTION</span>
  <span class="k">WHEN</span> nombre_del_error <span class="k">THEN</span>
    ...
<span class="k">END</span>;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">CREATE FUNCTION</span> salario_por_persona(salario <span class="k">NUMERIC</span>, num_personas <span class="k">INTEGER</span>)
<span class="k">RETURNS NUMERIC AS</span> $$
<span class="k">BEGIN</span>
  <span class="k">RETURN</span> salario / num_personas;
<span class="k">EXCEPTION</span>
  <span class="k">WHEN</span> division_by_zero <span class="k">THEN</span>
    <span class="k">RAISE NOTICE</span> <span class="s">'num_personas no puede ser cero, se devuelve NULL'</span>;
    <span class="k">RETURN NULL</span>;
<span class="k">END</span>;
$$ <span class="k">LANGUAGE</span> plpgsql;

<span class="k">SELECT</span> salario_por_persona(4200000, 0);</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Resultado</div>
        <div class="code-block"><pre class="code">NOTICE:  num_personas no puede ser cero, se devuelve NULL

 salario_por_persona
----------------------
 NULL</pre></div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>La división por cero lanzaría el error <code>division_by_zero</code>; el bloque EXCEPTION lo intercepta, avisa con RAISE NOTICE y devuelve NULL en vez de detener la ejecución con un error.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Cuando un error esperable (división por cero, valor no encontrado, tipo de dato inválido) no debería tumbar toda la operación que llama a la función.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Capturar <code>WHEN OTHERS</code> de forma genérica y silenciar el error sin registrar nada: esconde problemas reales que deberían investigarse.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Capturar excepciones específicas (como <code>division_by_zero</code>) en vez de <code>OTHERS</code> siempre que se pueda anticipar cuál error es esperable.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> <code>RAISE NOTICE</code> solo informa (aparece en el log, no interrumpe nada); <code>RAISE EXCEPTION</code> sí detiene la función y propaga un error real, útil por ejemplo para validaciones que deben impedir una operación.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/plpgsql/t6"><small>Anterior</small><strong>← Parámetros OUT</strong></a>
          <a class="next" data-route-link href="#/modulo/plpgsql/t8"><small>Siguiente</small><strong>CALL y procedimientos →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 8. CALL y procedimientos ============ -->
    <section class="topic" id="t8" data-title="CALL y procedimientos" data-search="call procedure procedimiento almacenado commit">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">08</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-arrow"/></svg>
          <h2>CALL y procedimientos</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-avanzado"></span> Avanzado</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t8"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Un <strong>PROCEDURE</strong> se invoca con CALL en vez de SELECT, no devuelve un valor como una función, y puede controlar transacciones (COMMIT/ROLLBACK) desde dentro.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">CREATE PROCEDURE</span> nombre(parametros)
<span class="k">LANGUAGE</span> plpgsql <span class="k">AS</span> $$
<span class="k">BEGIN</span>
  ...
<span class="k">END</span>;
$$;

<span class="k">CALL</span> nombre(argumentos);</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">CREATE PROCEDURE</span> aumentar_salario(dept_id <span class="k">INTEGER</span>, porcentaje <span class="k">NUMERIC</span>)
<span class="k">LANGUAGE</span> plpgsql <span class="k">AS</span> $$
<span class="k">BEGIN</span>
  <span class="k">UPDATE</span> empleados
  <span class="k">SET</span> salario = salario * (1 + porcentaje / 100)
  <span class="k">WHERE</span> departamento_id = dept_id;
  <span class="k">COMMIT</span>;
<span class="k">END</span>;
$$;

<span class="k">CALL</span> aumentar_salario(2, 5);</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Comercial, antes y después de CALL aumentar_salario(2, 5)</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>nombre</th><th>salario antes</th><th>salario después</th></tr></thead>
            <tbody>
              <tr><td>Luis Gómez</td><td>3 100 000</td><td>3 255 000</td></tr>
              <tr><td>Pedro Sánchez</td><td>2 600 000</td><td>2 730 000</td></tr>
              <tr><td>Jorge Peña</td><td>3 100 000</td><td>3 255 000</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Actualiza los salarios de Comercial un 5% y confirma el cambio con COMMIT; una función normal no puede ejecutar COMMIT por sí sola, porque corre dentro de la transacción de quien la llama.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Rutinas de mantenimiento o procesos por lotes que necesitan confirmar avances parciales, en vez de todo o nada al final.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Intentar usar <code>SELECT nombre_procedimiento(...)</code> como con una función: los procedimientos se invocan con <code>CALL</code>, no con SELECT.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Usar FUNCTION cuando el objetivo es calcular y devolver un valor dentro de una consulta; usar PROCEDURE cuando el objetivo es ejecutar una tarea con efectos secundarios (UPDATE, INSERT, DELETE) de forma independiente.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> 3 100 000 × 1.05 = 3 255 000 y 2 600 000 × 1.05 = 2 730 000; solo cambian los tres empleados de Comercial (departamento_id = 2), el resto de la tabla queda igual.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/plpgsql/t7"><small>Anterior</small><strong>← Manejo de excepciones</strong></a>
          <span></span>
        </nav>
      </div>
    </section>`;

  var EXERCISES_META = [
    {
      id: 'ex1',
      type: 'mcq',
      prompt: '¿Qué bloque se usa para declarar variables locales dentro de una función PL/pgSQL?',
      options: ['VAR', 'DECLARE', 'LET', 'LOCAL'],
      correct: 1,
      explanation: 'DECLARE va antes de BEGIN y define las variables que la función usará internamente, junto con su tipo de dato.'
    },
    {
      id: 'ex2',
      type: 'write',
      prompt: 'Escribe la línea que asigna el valor <code>420000</code> a una variable llamada <code>bono</code> dentro del cuerpo de una función.',
      placeholder: 'bono := 420000;',
      answers: ['bono := 420000', 'bono := 420000;'],
      explanation: 'La asignación en PL/pgSQL usa := (dos puntos seguidos de igual), distinto del = que se usa para comparar.'
    },
    {
      id: 'ex3',
      type: 'mcq',
      prompt: '¿Qué cláusula permite que una función devuelva múltiples filas, como si fuera una tabla?',
      options: ['RETURNS NUMERIC', 'RETURNS TABLE', 'RETURNS VOID', 'RETURNS TEXT'],
      correct: 1,
      explanation: 'RETURNS TABLE(columnas) combinado con RETURN QUERY permite consultar la función con SELECT * FROM función(...), igual que una tabla.'
    },
    {
      id: 'ex4',
      type: 'mcq',
      prompt: '¿Cuál es la diferencia principal entre una FUNCTION y un PROCEDURE en PostgreSQL?',
      options: ['No hay diferencia real', 'Un PROCEDURE se invoca con CALL y puede controlar transacciones (COMMIT/ROLLBACK) internamente; una FUNCTION no', 'Las funciones no pueden recibir parámetros', 'Los procedimientos siempre son más rápidos'],
      correct: 1,
      explanation: 'Los procedimientos existen específicamente para tareas con efectos secundarios que a veces necesitan confirmar cambios parciales con COMMIT, algo que una función no puede hacer.'
    },
    {
      id: 'ex5',
      type: 'mcq',
      prompt: '¿Qué bloque de una función PL/pgSQL permite capturar errores y evitar que la ejecución se detenga con un fallo?',
      options: ['DECLARE', 'LOOP', 'EXCEPTION', 'RETURN'],
      correct: 2,
      explanation: 'El bloque EXCEPTION, con cláusulas WHEN, intercepta errores específicos (como division_by_zero) y permite responder de forma controlada.'
    }
  ];

  window.App = window.App || {};
  window.App.modules = window.App.modules || {};
  window.App.modules['plpgsql'] = {
    id: 'plpgsql',
    topicsMeta: TOPICS_META,
    heroHtml: HERO_HTML,
    schemaHtml: SCHEMA_HTML,
    topicsHtml: TOPICS_HTML,
    exercisesMeta: EXERCISES_META
  };

})();
