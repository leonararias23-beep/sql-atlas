/* ============================================================
   MÓDULO: UPDATE (DML: Modificar datos)
   Segunda pieza del bloque DML: cambiar filas existentes. Misma
   forma que el resto de módulos. Refuerza una y otra vez el papel
   de WHERE (sin él, UPDATE toca toda la tabla). Resultados
   simulados, como en el resto del curso.
   ============================================================ */
(function(){
  'use strict';

  var TOPICS_META = [
    { id:'t1', num:'01', title:'UPDATE ... SET ... WHERE', level:'basico',     search:'update set where modificar fila' },
    { id:'t2', num:'02', title:'Actualizar varias columnas', level:'basico',   search:'update varias columnas set coma' },
    { id:'t3', num:'03', title:'Expresiones en SET',       level:'basico',     search:'expresiones set calculo aumento porcentaje' },
    { id:'t4', num:'04', title:'UPDATE con subconsulta',   level:'intermedio', search:'update subconsulta from otra tabla' },
    { id:'t5', num:'05', title:'RETURNING',                level:'intermedio', search:'returning update filas actualizadas' },
    { id:'t6', num:'06', title:'El riesgo de omitir WHERE', level:'intermedio', search:'sin where actualiza toda la tabla peligro transaccion' }
  ];

  var HERO_HTML = `<header class="hero">
      <h1>UPDATE: modificar filas existentes</h1>
      <p class="sub">Si INSERT agrega filas, <code>UPDATE</code> cambia las que ya existen. La clave de todo el módulo es el <strong>WHERE</strong>: decide a qué filas afecta el cambio, y olvidarlo modifica la tabla entera. Todo sobre <code>empleados</code> y <code>departamentos</code>.</p>
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

  var TOPICS_HTML = `<!-- ============ 1. UPDATE ... SET ... WHERE ============ -->
    <section class="topic" id="t1" data-title="UPDATE ... SET ... WHERE" data-search="update set where modificar fila">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">01</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-mod-update"/></svg>
          <h2>UPDATE ... SET ... WHERE</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-basico"></span> Básico</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t1"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Modifica los valores de las filas <strong>existentes</strong> que cumplan una condición.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">UPDATE</span> tabla
<span class="k">SET</span> columna = nuevo_valor
<span class="k">WHERE</span> condicion;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">UPDATE</span> empleados
<span class="k">SET</span> salario = 3400000
<span class="k">WHERE</span> nombre = <span class="s">'Luis Gómez'</span>;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> empleados: 1 fila afectada</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>id</th><th>nombre</th><th>cargo</th><th>salario</th></tr></thead>
            <tbody>
              <tr><td>2</td><td>Luis Gómez</td><td>Analista</td><td>3 400 000</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Cambia las columnas indicadas en <code>SET</code>, pero solo en las filas que cumplen el <code>WHERE</code>.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Corregir un dato mal cargado, aplicar un cambio de salario, actualizar un estado, etc.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Olvidar el <code>WHERE</code>: el UPDATE se aplica entonces a <strong>todas</strong> las filas de la tabla (lo vemos en el último tema).</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Antes de actualizar, ejecuta un <code>SELECT</code> con el mismo <code>WHERE</code> para confirmar exactamente qué filas vas a tocar.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> el <code>WHERE</code> de un UPDATE se escribe igual que el de un SELECT; toda la potencia de filtrado que ya conoces aplica aquí.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <span></span>
          <a class="next" data-route-link href="#/modulo/actualizar/t2"><small>Siguiente</small><strong>Actualizar varias columnas →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 2. Actualizar varias columnas ============ -->
    <section class="topic" id="t2" data-title="Actualizar varias columnas" data-search="update varias columnas set coma">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">02</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-mod-update"/></svg>
          <h2>Actualizar varias columnas</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-basico"></span> Básico</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t2"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Un solo <code>UPDATE</code> puede cambiar <strong>varias columnas</strong> a la vez, separándolas con comas en el <code>SET</code>.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">UPDATE</span> tabla
<span class="k">SET</span> col1 = v1,
    col2 = v2
<span class="k">WHERE</span> condicion;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">UPDATE</span> empleados
<span class="k">SET</span> cargo = <span class="s">'Analista Senior'</span>,
    salario = 3600000
<span class="k">WHERE</span> nombre = <span class="s">'Luis Gómez'</span>;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> empleados: 1 fila afectada</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>id</th><th>nombre</th><th>cargo</th><th>salario</th></tr></thead>
            <tbody>
              <tr><td>2</td><td>Luis Gómez</td><td>Analista Senior</td><td>3 600 000</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Aplica todos los cambios del <code>SET</code> en la misma pasada sobre las filas filtradas.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Cuando un mismo cambio de negocio toca varias columnas (un ascenso: cambia cargo y salario juntos).</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Separar las asignaciones con <code>AND</code> en lugar de comas; en el <code>SET</code> van con coma, el <code>AND</code> es solo del WHERE.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Agrupar en un solo UPDATE los cambios que ocurren juntos mantiene los datos consistentes y hace un solo viaje a la base.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> el orden en que escribes las columnas dentro del <code>SET</code> no afecta el resultado.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/actualizar/t1"><small>Anterior</small><strong>← UPDATE ... SET ... WHERE</strong></a>
          <a class="next" data-route-link href="#/modulo/actualizar/t3"><small>Siguiente</small><strong>Expresiones en SET →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 3. Expresiones en SET ============ -->
    <section class="topic" id="t3" data-title="Expresiones en SET" data-search="expresiones set calculo aumento porcentaje">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">03</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-func-num"/></svg>
          <h2>Expresiones en SET</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-basico"></span> Básico</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t3"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">El nuevo valor puede ser una <strong>expresión</strong> que use el valor actual de la columna, no solo un número fijo.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">UPDATE</span> tabla
<span class="k">SET</span> columna = columna * factor
<span class="k">WHERE</span> condicion;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="c">-- aumento del 10% a los de Bogotá</span>
<span class="k">UPDATE</span> empleados
<span class="k">SET</span> salario = salario * 1.10
<span class="k">WHERE</span> ciudad = <span class="s">'Bogotá'</span>;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> empleados: 3 filas afectadas</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>id</th><th>nombre</th><th>ciudad</th><th>salario</th></tr></thead>
            <tbody>
              <tr><td>1</td><td>Ana Torres</td><td>Bogotá</td><td>4 620 000</td></tr>
              <tr><td>3</td><td>Marta Ruiz</td><td>Bogotá</td><td>4 950 000</td></tr>
              <tr><td>5</td><td>Carla Díaz</td><td>Bogotá</td><td>7 480 000</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Calcula el nuevo valor a partir del valor previo de cada fila; aquí multiplica cada salario por 1.10.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Ajustes proporcionales: aumentos, descuentos, recargos, correcciones acumulativas.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Que la columna esté en <code>NULL</code>: cualquier operación con NULL da NULL, así que esas filas no obtienen el aumento esperado.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Para cálculos con decimales, usar tipos <code>numeric</code> evita errores de redondeo típicos de los flotantes.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> PostgreSQL usa el valor previo de la fila para calcular el nuevo; el orden de las filas no cambia el resultado.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/actualizar/t2"><small>Anterior</small><strong>← Actualizar varias columnas</strong></a>
          <a class="next" data-route-link href="#/modulo/actualizar/t4"><small>Siguiente</small><strong>UPDATE con subconsulta →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 4. UPDATE con subconsulta ============ -->
    <section class="topic" id="t4" data-title="UPDATE con subconsulta" data-search="update subconsulta from otra tabla">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">04</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-mod-subconsultas"/></svg>
          <h2>UPDATE con subconsulta</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-intermedio"></span> Intermedio</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t4"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">El nuevo valor puede venir de <strong>otra tabla</strong>, usando una subconsulta en el <code>SET</code> (o la cláusula <code>FROM</code>, propia de PostgreSQL).</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">UPDATE</span> tabla
<span class="k">SET</span> col = (<span class="k">SELECT</span> ... <span class="k">FROM</span> otra <span class="k">WHERE</span> ...)
<span class="k">WHERE</span> condicion;

<span class="c">-- estilo FROM (PostgreSQL)</span>
<span class="k">UPDATE</span> tabla t
<span class="k">SET</span> col = o.valor
<span class="k">FROM</span> otra o
<span class="k">WHERE</span> t.fk = o.id;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="c">-- asigna RR. HH. a quien no tiene departamento</span>
<span class="k">UPDATE</span> empleados
<span class="k">SET</span> departamento_id = (
      <span class="k">SELECT</span> id <span class="k">FROM</span> departamentos
      <span class="k">WHERE</span> nombre = <span class="s">'Recursos Humanos'</span>)
<span class="k">WHERE</span> departamento_id <span class="k">IS NULL</span>;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> empleados: 1 fila afectada</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>id</th><th>nombre</th><th>departamento_id</th></tr></thead>
            <tbody>
              <tr><td>5</td><td>Carla Díaz</td><td>3</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Ejecuta la subconsulta para obtener el valor (el <code>id</code> de "Recursos Humanos") y lo asigna a las filas que cumplen el <code>WHERE</code>.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Cuando el valor a asignar depende de otra tabla: buscar un id por nombre, copiar un dato relacionado, etc.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Que la subconsulta del <code>SET</code> devuelva más de una fila: debe devolver un único valor, o PostgreSQL da error.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Cuando necesitas varias columnas de otra tabla, la cláusula <code>FROM</code> es más legible que repetir subconsultas.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> la cláusula <code>FROM</code> en un UPDATE es una extensión de PostgreSQL; en el SQL estándar solo existiría la forma con subconsulta.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/actualizar/t3"><small>Anterior</small><strong>← Expresiones en SET</strong></a>
          <a class="next" data-route-link href="#/modulo/actualizar/t5"><small>Siguiente</small><strong>RETURNING →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 5. RETURNING ============ -->
    <section class="topic" id="t5" data-title="RETURNING" data-search="returning update filas actualizadas">
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
        <p class="def">Igual que en INSERT, <code>RETURNING</code> muestra las filas resultantes <strong>ya con los cambios aplicados</strong>.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">UPDATE</span> tabla
<span class="k">SET</span> columna = valor
<span class="k">WHERE</span> condicion
<span class="k">RETURNING</span> columna;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">UPDATE</span> empleados
<span class="k">SET</span> salario = salario + 200000
<span class="k">WHERE</span> cargo = <span class="s">'Analista'</span>
<span class="k">RETURNING</span> nombre, salario;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Resultado devuelto: 2 filas</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>nombre</th><th>salario</th></tr></thead>
            <tbody>
              <tr><td>Luis Gómez</td><td>3 300 000</td></tr>
              <tr><td>Jorge Peña</td><td>3 300 000</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Devuelve las columnas pedidas de cada fila modificada, con los valores ya actualizados.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Confirmar exactamente qué filas cambió el UPDATE y con qué valores quedaron, en una sola operación.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Esperar los valores <em>anteriores</em>: <code>RETURNING</code> muestra los valores <strong>nuevos</strong>, ya modificados.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Útil en aplicaciones para refrescar la vista con los datos actualizados sin una consulta adicional.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> como el <code>WHERE</code> alcanzó a los dos "Analista", el UPDATE afectó 2 filas y <code>RETURNING</code> devolvió ambas.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/actualizar/t4"><small>Anterior</small><strong>← UPDATE con subconsulta</strong></a>
          <a class="next" data-route-link href="#/modulo/actualizar/t6"><small>Siguiente</small><strong>El riesgo de omitir WHERE →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 6. El riesgo de omitir WHERE ============ -->
    <section class="topic" id="t6" data-title="El riesgo de omitir WHERE" data-search="sin where actualiza toda la tabla peligro transaccion">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">06</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-warn"/></svg>
          <h2>El riesgo de omitir WHERE</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-intermedio"></span> Intermedio</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t6"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Sin <code>WHERE</code>, un <code>UPDATE</code> cambia <strong>todas las filas</strong> de la tabla. Es uno de los errores más caros del DML.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="c">-- PELIGRO: sin WHERE toca toda la tabla</span>
<span class="k">UPDATE</span> empleados
<span class="k">SET</span> salario = 0;</pre></div>
          </div>
          <div>
            <div class="block-label">Lo seguro</div>
            <div class="code-block"><pre class="code"><span class="c">-- envuelve el cambio en una transacción</span>
<span class="k">BEGIN</span>;
<span class="k">UPDATE</span> empleados <span class="k">SET</span> salario = 0
  <span class="k">WHERE</span> nombre = <span class="s">'Pedro Sánchez'</span>;
<span class="c">-- revisa el resultado y luego:</span>
<span class="k">COMMIT</span>;   <span class="c">-- o ROLLBACK; para deshacer</span></pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> empleados: 7 filas afectadas (¡toda la tabla!)</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>id</th><th>nombre</th><th>salario</th></tr></thead>
            <tbody>
              <tr><td>1</td><td>Ana Torres</td><td>0</td></tr>
              <tr><td>2</td><td>Luis Gómez</td><td>0</td></tr>
              <tr><td>…</td><td>… (todas)</td><td>0</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Aplica el <code>SET</code> a cada fila de la tabla, porque no hay condición que limite el alcance.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Casi nunca a propósito. Un UPDATE sin WHERE solo tiene sentido cuando de verdad quieres cambiar toda la tabla.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Ejecutar el comando antes de terminar de escribir el <code>WHERE</code>, o seleccionar y correr solo la primera línea por accidente.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Envolver cambios masivos en una transacción (<code>BEGIN … COMMIT/ROLLBACK</code>) para poder revertir si algo sale mal. Lo verás a fondo en el módulo de Transacciones.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> muchas herramientas piden confirmación al detectar un UPDATE o DELETE sin WHERE; aun así, la mejor red de seguridad sigue siendo una transacción.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/actualizar/t5"><small>Anterior</small><strong>← RETURNING</strong></a>
          <span></span>
        </nav>
      </div>
    </section>`;

  var EXERCISES_META = [
    {
      id: 'ex1',
      type: 'mcq',
      prompt: '¿Qué cláusula decide a qué filas afecta un UPDATE?',
      options: ['WHERE', 'SET', 'FROM', 'LIMIT'],
      correct: 0,
      explanation: 'El WHERE filtra qué filas se modifican; el SET indica qué columnas cambian. Sin WHERE, el cambio alcanza toda la tabla.'
    },
    {
      id: 'ex2',
      type: 'write',
      prompt: 'Escribe el UPDATE que cambia el <code>salario</code> de "Luis Gómez" a 3400000.',
      placeholder: "UPDATE empleados SET salario = 3400000 WHERE nombre = 'Luis Gómez'",
      answers: [
        "update empleados set salario = 3400000 where nombre = 'luis gómez'",
        "update empleados set salario=3400000 where nombre='luis gómez'"
      ],
      explanation: 'UPDATE tabla SET columna = valor WHERE condicion. El WHERE limita el cambio a esa única fila.'
    },
    {
      id: 'ex3',
      type: 'mcq',
      prompt: '¿Qué ocurre si ejecutas un UPDATE sin cláusula WHERE?',
      options: ['Cambia todas las filas de la tabla', 'Cambia solo la primera fila', 'Provoca siempre un error', 'No hace nada'],
      correct: 0,
      explanation: 'Sin WHERE, el SET se aplica a cada fila de la tabla. Por eso conviene revisar el WHERE (o usar una transacción) antes de ejecutar.'
    },
    {
      id: 'ex4',
      type: 'write',
      prompt: 'Escribe la parte <code>SET</code> que aumenta el salario un 10% usando su valor actual (solo la asignación, sin UPDATE ni WHERE).',
      placeholder: 'salario = salario * 1.10',
      answers: [
        'salario = salario * 1.1',
        'salario = salario * 1.10',
        'salario = salario*1.1'
      ],
      explanation: 'El nuevo valor se calcula a partir del actual: salario = salario * 1.10 aplica un aumento del 10%.'
    },
    {
      id: 'ex5',
      type: 'mcq',
      prompt: 'En un UPDATE, ¿qué muestra RETURNING?',
      options: ['Las filas ya actualizadas, con los valores nuevos', 'Las filas tal como estaban antes del cambio', 'Un mensaje de error', 'Nada, RETURNING solo existe en INSERT'],
      correct: 0,
      explanation: 'RETURNING devuelve las filas afectadas con los valores nuevos, y funciona tanto en INSERT como en UPDATE y DELETE.'
    }
  ];

  window.App = window.App || {};
  window.App.modules = window.App.modules || {};
  window.App.modules['actualizar'] = {
    id: 'actualizar',
    topicsMeta: TOPICS_META,
    heroHtml: HERO_HTML,
    schemaHtml: SCHEMA_HTML,
    topicsHtml: TOPICS_HTML,
    exercisesMeta: EXERCISES_META
  };

})();
