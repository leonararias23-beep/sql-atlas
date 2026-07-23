/* ============================================================
   MÓDULO: Funciones
   Misma forma que fundamentos-sql y filtrado-de-datos: TOPICS_META
   + HERO_HTML + SCHEMA_HTML + TOPICS_HTML, registrados en
   App.modules. Suma EXERCISES_META (opcional, lo consume
   assets/js/exercises.js) para la sección de ejercicios prácticos.
   ============================================================ */
(function(){
  'use strict';

  var TOPICS_META = [
    { id:'t1',  num:'01', title:'UPPER y LOWER',       level:'basico',     search:'upper lower mayusculas minusculas texto' },
    { id:'t2',  num:'02', title:'CONCAT y ||',          level:'basico',     search:'concat concatenar unir texto operador' },
    { id:'t3',  num:'03', title:'LENGTH',               level:'basico',     search:'length longitud caracteres texto' },
    { id:'t4',  num:'04', title:'TRIM',                 level:'basico',     search:'trim espacios recortar texto' },
    { id:'t5',  num:'05', title:'SUBSTRING',            level:'intermedio', search:'substring subcadena extraer texto' },
    { id:'t6',  num:'06', title:'ROUND',                level:'intermedio', search:'round redondear decimales numerico' },
    { id:'t7',  num:'07', title:'CEIL y FLOOR',         level:'intermedio', search:'ceil floor techo piso redondeo numerico' },
    { id:'t8',  num:'08', title:'CURRENT_DATE y NOW()', level:'intermedio', search:'current_date now fecha actual hora' },
    { id:'t9',  num:'09', title:'EXTRACT',              level:'intermedio', search:'extract extraer año mes dia fecha' },
    { id:'t10', num:'10', title:'CAST y ::',            level:'intermedio', search:'cast conversion tipos casting' }
  ];

  var HERO_HTML = `<header class="hero">
      <h1>Funciones en PostgreSQL</h1>
      <p class="sub">Funciones de texto, numéricas, de fecha y de conversión de tipos: las que más se usan al transformar datos dentro de una consulta. Todos los ejemplos usan la misma tabla base de los módulos anteriores.</p>
      <p style="margin:0 0 14px 0; font-size:12.5px; color:var(--ink-3);">Por Nelson Leonardo Páez Arias</p>
      <div class="hero__meta">
        <span><svg aria-hidden="true"><use href="#i-check"/></svg> <span id="heroCompletedCount">0/10</span> completados</span>
        <span><svg aria-hidden="true"><use href="#i-hash"/></svg> 10 temas</span>
        <span><svg aria-hidden="true"><use href="#i-result"/></svg> 1 tabla de referencia</span>
      </div>
    </header>`;

  var SCHEMA_HTML = `<div class="schema" id="schemaTable">
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
              <th>ciudad<span class="type">text</span></th>
              <th>fecha_ingreso<span class="type">date</span></th>
              <th>correo<span class="type">text</span></th>
            </tr>
          </thead>
          <tbody>
            <tr><td>1</td><td>Ana Torres</td><td>Ingeniera de Datos</td><td>4 200 000</td><td>Bogotá</td><td>2022-03-15</td><td>ana.torres@empresa.com</td></tr>
            <tr><td>2</td><td>Luis Gómez</td><td>Analista</td><td>3 100 000</td><td>Medellín</td><td>2023-01-10</td><td class="null">NULL</td></tr>
            <tr><td>3</td><td>Marta Ruiz</td><td>Ingeniera de Datos</td><td>4 500 000</td><td>Bogotá</td><td>2021-11-02</td><td>marta.ruiz@empresa.com</td></tr>
            <tr><td>4</td><td>Pedro Sánchez</td><td>Analista Junior</td><td>2 600 000</td><td>Cali</td><td>2023-06-20</td><td>pedro.sanchez@empresa.com</td></tr>
            <tr><td>5</td><td>Carla Díaz</td><td>Gerente</td><td>6 800 000</td><td>Bogotá</td><td>2019-08-30</td><td>carla.diaz@empresa.com</td></tr>
            <tr><td>6</td><td>Jorge Peña</td><td>Analista</td><td>3 100 000</td><td>Medellín</td><td>2022-09-01</td><td class="null">NULL</td></tr>
            <tr><td>7</td><td>Sofía León</td><td>Ingeniera de Datos</td><td>4 200 000</td><td>Sogamoso</td><td>2023-02-14</td><td>sofia.leon@empresa.com</td></tr>
          </tbody>
        </table>
      </div>
    </div>`;

  var TOPICS_HTML = `<!-- ============ 1. UPPER y LOWER ============ -->
    <section class="topic" id="t1" data-title="UPPER y LOWER" data-search="upper lower mayusculas minusculas texto">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">01</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-func-text"/></svg>
          <h2>UPPER y LOWER</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-basico"></span> Básico</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t1"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Convierten un texto a <strong>mayúsculas</strong> o <strong>minúsculas</strong> por completo.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">UPPER</span>(texto)
<span class="k">LOWER</span>(texto)</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> nombre, <span class="k">UPPER</span>(cargo) <span class="k">AS</span> cargo_mayus
<span class="k">FROM</span> empleados
<span class="k">WHERE</span> ciudad = <span class="s">'Bogotá'</span>;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Resultado</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>nombre</th><th>cargo_mayus</th></tr></thead>
            <tbody>
              <tr><td>Ana Torres</td><td>INGENIERA DE DATOS</td></tr>
              <tr><td>Marta Ruiz</td><td>INGENIERA DE DATOS</td></tr>
              <tr><td>Carla Díaz</td><td>GERENTE</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>UPPER pasa cada letra a mayúscula; LOWER hace exactamente lo contrario. Ninguna cambia el dato guardado, solo el valor devuelto por la consulta.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Para presentar texto con un formato uniforme, o para comparar dos textos ignorando mayúsculas cuando no se tiene ILIKE disponible.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Usarlas sobre columnas numéricas o de fecha, donde no aplican; olvidar que el resultado es un valor nuevo, no modifica la tabla original.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Usar <code>LOWER(columna) = LOWER('valor')</code> como alternativa portable a ILIKE cuando el motor destino no es PostgreSQL.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> ambas funciones respetan acentos y letras propias del español, como en "GÓMEZ" o "peña".</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <span></span>
          <a class="next" data-route-link href="#/modulo/funciones/t2"><small>Siguiente</small><strong>CONCAT y || →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 2. CONCAT y || ============ -->
    <section class="topic" id="t2" data-title="CONCAT y ||" data-search="concat concatenar unir texto operador">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">02</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-func-text"/></svg>
          <h2>CONCAT y ||</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-basico"></span> Básico</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t2"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def"><strong>Unen</strong> dos o más textos en uno solo. PostgreSQL admite la función <code>CONCAT()</code> y el operador <code>||</code>.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">CONCAT</span>(texto1, texto2, ...)
texto1 <span class="k">||</span> texto2</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> nombre <span class="k">||</span> <span class="s">', '</span> <span class="k">||</span> cargo <span class="k">AS</span> ficha
<span class="k">FROM</span> empleados
<span class="k">WHERE</span> ciudad = <span class="s">'Bogotá'</span>;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Resultado</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>ficha</th></tr></thead>
            <tbody>
              <tr><td>Ana Torres, Ingeniera de Datos</td></tr>
              <tr><td>Marta Ruiz, Ingeniera de Datos</td></tr>
              <tr><td>Carla Díaz, Gerente</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Pega los textos en el orden indicado, sin agregar separadores automáticamente: hay que incluirlos a mano, como <code>', '</code>.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Para armar columnas derivadas de presentación: nombres completos, direcciones, etiquetas legibles.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Con <code>||</code>, si cualquiera de los valores es NULL, todo el resultado se vuelve NULL; <code>CONCAT()</code> en cambio trata NULL como texto vacío.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Si alguna columna puede tener NULL, usar <code>CONCAT()</code> o envolverla con <code>COALESCE(columna, '')</code> antes de concatenar con <code>||</code>.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> <code>SELECT correo || ' (verificado)'</code> daría NULL para Luis Gómez y Jorge Peña, porque su columna correo es NULL, justo el comportamiento que describe la tarjeta de errores comunes.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/funciones/t1"><small>Anterior</small><strong>← UPPER y LOWER</strong></a>
          <a class="next" data-route-link href="#/modulo/funciones/t3"><small>Siguiente</small><strong>LENGTH →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 3. LENGTH ============ -->
    <section class="topic" id="t3" data-title="LENGTH" data-search="length longitud caracteres texto">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">03</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-func-text"/></svg>
          <h2>LENGTH</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-basico"></span> Básico</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t3"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Devuelve la <strong>cantidad de caracteres</strong> de un texto.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">LENGTH</span>(texto)</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> nombre, <span class="k">LENGTH</span>(nombre) <span class="k">AS</span> longitud
<span class="k">FROM</span> empleados
<span class="k">WHERE</span> cargo <span class="k">LIKE</span> <span class="s">'%Analista%'</span>;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Resultado</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>nombre</th><th>longitud</th></tr></thead>
            <tbody>
              <tr><td>Luis Gómez</td><td>10</td></tr>
              <tr><td>Pedro Sánchez</td><td>13</td></tr>
              <tr><td>Jorge Peña</td><td>10</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Cuenta caracteres, no bytes: "ñ" o "á" cuentan como un solo carácter aunque ocupen más de un byte en UTF-8.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Para validar longitudes mínimas o máximas, o para detectar datos sospechosamente cortos o largos.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Confundir LENGTH de texto con <code>OCTET_LENGTH</code> (que sí cuenta bytes); aplicarla sobre una columna NULL, cuyo resultado también es NULL.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Combinarla con TRIM cuando el texto puede tener espacios sobrantes, para no contar espacios que el usuario no ve.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> "Pedro Sánchez" mide 13 porque el espacio también cuenta como carácter: P-e-d-r-o-(espacio)-S-á-n-c-h-e-z.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/funciones/t2"><small>Anterior</small><strong>← CONCAT y ||</strong></a>
          <a class="next" data-route-link href="#/modulo/funciones/t4"><small>Siguiente</small><strong>TRIM →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 4. TRIM ============ -->
    <section class="topic" id="t4" data-title="TRIM" data-search="trim espacios recortar texto">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">04</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-func-text"/></svg>
          <h2>TRIM</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-basico"></span> Básico</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t4"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Elimina <strong>espacios sobrantes</strong> al inicio y al final de un texto (u otro carácter indicado).</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">TRIM</span>(texto)
<span class="k">TRIM</span>(<span class="k">LEADING</span> | <span class="k">TRAILING</span> <span class="k">FROM</span> texto)</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> <span class="k">TRIM</span>(<span class="s">'   Bogotá   '</span>) <span class="k">AS</span> ciudad_limpia;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Resultado</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>ciudad_limpia</th></tr></thead>
            <tbody>
              <tr><td>Bogotá</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Por defecto quita espacios de ambos extremos; con LEADING o TRAILING se limita a un solo lado.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Al limpiar datos importados de archivos externos (CSV, formularios), donde suelen colarse espacios invisibles.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Pensar que TRIM también quita espacios del medio del texto; para eso se necesita <code>REPLACE</code> o una expresión regular.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Aplicar TRIM antes de comparar texto con WHERE cuando el origen de los datos no garantiza que vengan sin espacios extra.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> <code>TRIM('xx' FROM 'xxBogotáxx')</code> también funciona: TRIM puede recortar cualquier carácter, no solo espacios, pasándolo como segundo argumento.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/funciones/t3"><small>Anterior</small><strong>← LENGTH</strong></a>
          <a class="next" data-route-link href="#/modulo/funciones/t5"><small>Siguiente</small><strong>SUBSTRING →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 5. SUBSTRING ============ -->
    <section class="topic" id="t5" data-title="SUBSTRING" data-search="substring subcadena extraer texto">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">05</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-func-text"/></svg>
          <h2>SUBSTRING</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-intermedio"></span> Intermedio</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t5"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Extrae una <strong>parte</strong> de un texto a partir de una posición y una longitud dadas.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">SUBSTRING</span>(texto <span class="k">FROM</span> inicio <span class="k">FOR</span> longitud)</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> nombre, <span class="k">SUBSTRING</span>(nombre <span class="k">FROM</span> 1 <span class="k">FOR</span> 4) <span class="k">AS</span> abreviatura
<span class="k">FROM</span> empleados
<span class="k">WHERE</span> ciudad = <span class="s">'Medellín'</span>;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Resultado</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>nombre</th><th>abreviatura</th></tr></thead>
            <tbody>
              <tr><td>Luis Gómez</td><td>Luis</td></tr>
              <tr><td>Jorge Peña</td><td>Jorg</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Cuenta caracteres desde 1 (no desde 0) y devuelve como máximo "longitud" caracteres a partir de ese punto.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Para extraer prefijos, códigos o fragmentos de longitud conocida, como los primeros dígitos de un identificador.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Pensar que el índice empieza en 0 como en muchos lenguajes de programación; en SQL el primer carácter es la posición 1.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Para extraer texto antes o después de un carácter específico (como el usuario de un correo antes de <code>@</code>), combinarla con <code>POSITION()</code> en vez de fijar un número mágico.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> también existe la forma abreviada <code>SUBSTRING(nombre, 1, 4)</code>, equivalente a la sintaxis con FROM/FOR.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/funciones/t4"><small>Anterior</small><strong>← TRIM</strong></a>
          <a class="next" data-route-link href="#/modulo/funciones/t6"><small>Siguiente</small><strong>ROUND →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 6. ROUND ============ -->
    <section class="topic" id="t6" data-title="ROUND" data-search="round redondear decimales numerico">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">06</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-func-num"/></svg>
          <h2>ROUND</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-intermedio"></span> Intermedio</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t6"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def"><strong>Redondea</strong> un número al número de decimales indicado.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">ROUND</span>(numero, decimales)</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> nombre, salario,
       <span class="k">ROUND</span>(salario / 1000000.0, 1) <span class="k">AS</span> salario_millones
<span class="k">FROM</span> empleados
<span class="k">WHERE</span> ciudad = <span class="s">'Bogotá'</span>;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Resultado</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>nombre</th><th>salario</th><th>salario_millones</th></tr></thead>
            <tbody>
              <tr><td>Ana Torres</td><td>4 200 000</td><td>4.2</td></tr>
              <tr><td>Marta Ruiz</td><td>4 500 000</td><td>4.5</td></tr>
              <tr><td>Carla Díaz</td><td>6 800 000</td><td>6.8</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Redondea matemáticamente (al más cercano); si se omite "decimales", redondea a entero.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Para reportes y presentación de cifras: porcentajes, promedios, valores monetarios simplificados.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Dividir enteros sin forzar decimales (<code>salario / 1000000</code> trunca en división entera); por eso el ejemplo usa <code>1000000.0</code>.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Redondear solo en la capa de presentación, no antes de sumar o promediar: redondear primero puede acumular pequeños errores.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> con decimales negativos, <code>ROUND(salario, -3)</code> redondea a miles, útil para cifras aproximadas de reportes.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/funciones/t5"><small>Anterior</small><strong>← SUBSTRING</strong></a>
          <a class="next" data-route-link href="#/modulo/funciones/t7"><small>Siguiente</small><strong>CEIL y FLOOR →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 7. CEIL y FLOOR ============ -->
    <section class="topic" id="t7" data-title="CEIL y FLOOR" data-search="ceil floor techo piso redondeo numerico">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">07</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-func-num"/></svg>
          <h2>CEIL y FLOOR</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-intermedio"></span> Intermedio</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t7"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Redondean siempre en una <strong>dirección fija</strong>: CEIL hacia arriba, FLOOR hacia abajo, sin importar el decimal.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">CEIL</span>(numero)
<span class="k">FLOOR</span>(numero)</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> nombre, salario,
       <span class="k">CEIL</span>(salario / 3000000.0) <span class="k">AS</span> techo,
       <span class="k">FLOOR</span>(salario / 3000000.0) <span class="k">AS</span> piso
<span class="k">FROM</span> empleados
<span class="k">WHERE</span> cargo = <span class="s">'Analista'</span>;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Resultado</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>nombre</th><th>salario</th><th>techo</th><th>piso</th></tr></thead>
            <tbody>
              <tr><td>Luis Gómez</td><td>3 100 000</td><td>2</td><td>1</td></tr>
              <tr><td>Jorge Peña</td><td>3 100 000</td><td>2</td><td>1</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>CEIL(1.03) siempre da 2; FLOOR(1.03) siempre da 1, a diferencia de ROUND que decide según el decimal.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Cálculo de páginas (¿cuántas páginas de 20 registros necesito?), de lotes o de unidades completas que no se pueden fraccionar.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Usar ROUND cuando en realidad se necesita garantizar que el resultado nunca quede corto (por ejemplo, en cálculo de páginas, donde ROUND podría redondear hacia abajo).</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Para "cuántos lotes de N necesito", preferir <code>CEIL(total / N::numeric)</code> en vez de sumar 1 manualmente cuando sobra un resto.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> con números negativos el sentido se mantiene sobre la recta numérica: <code>CEIL(-1.2)</code> es -1 (hacia arriba) y <code>FLOOR(-1.2)</code> es -2 (hacia abajo).</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/funciones/t6"><small>Anterior</small><strong>← ROUND</strong></a>
          <a class="next" data-route-link href="#/modulo/funciones/t8"><small>Siguiente</small><strong>CURRENT_DATE y NOW() →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 8. CURRENT_DATE y NOW() ============ -->
    <section class="topic" id="t8" data-title="CURRENT_DATE y NOW()" data-search="current_date now fecha actual hora">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">08</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-func-date"/></svg>
          <h2>CURRENT_DATE y NOW()</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-intermedio"></span> Intermedio</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t8"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Devuelven el momento <strong>actual</strong>: CURRENT_DATE solo la fecha, NOW() fecha y hora con zona horaria.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">CURRENT_DATE</span>
<span class="k">NOW</span>()</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> <span class="k">CURRENT_DATE</span> <span class="k">AS</span> hoy, <span class="k">NOW</span>() <span class="k">AS</span> marca_temporal;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Resultado ilustrativo (cambia según el momento de ejecución)</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>hoy</th><th>marca_temporal</th></tr></thead>
            <tbody>
              <tr><td>2026-07-21</td><td>2026-07-21 09:14:52.331-05</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Ambas se evalúan una sola vez por consulta (no cambian fila a fila), tomando el reloj del servidor de base de datos.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Marcas de tiempo en INSERT/UPDATE, cálculos de antigüedad (<code>CURRENT_DATE - fecha_ingreso</code>) o filtros relativos a "hoy".</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Escribir <code>CURRENT_DATE()</code> con paréntesis: es una palabra reservada, no una función, y los paréntesis producen error.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Guardar siempre en UTC en la base de datos y convertir a la zona horaria local solo al presentar los datos.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> <code>CURRENT_DATE - fecha_ingreso</code> sobre una columna <code>date</code> devuelve directamente un número de días (tipo integer), sin necesidad de funciones adicionales.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/funciones/t7"><small>Anterior</small><strong>← CEIL y FLOOR</strong></a>
          <a class="next" data-route-link href="#/modulo/funciones/t9"><small>Siguiente</small><strong>EXTRACT →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 9. EXTRACT ============ -->
    <section class="topic" id="t9" data-title="EXTRACT" data-search="extract extraer año mes dia fecha">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">09</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-func-date"/></svg>
          <h2>EXTRACT</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-intermedio"></span> Intermedio</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t9"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Extrae una <strong>parte específica</strong> (año, mes, día, hora...) de una fecha o marca de tiempo.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">EXTRACT</span>(parte <span class="k">FROM</span> fecha)</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> nombre, fecha_ingreso,
       <span class="k">EXTRACT</span>(<span class="k">YEAR</span> <span class="k">FROM</span> fecha_ingreso) <span class="k">AS</span> anio_ingreso
<span class="k">FROM</span> empleados
<span class="k">WHERE</span> ciudad = <span class="s">'Medellín'</span>;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Resultado</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>nombre</th><th>fecha_ingreso</th><th>anio_ingreso</th></tr></thead>
            <tbody>
              <tr><td>Luis Gómez</td><td>2023-01-10</td><td>2023</td></tr>
              <tr><td>Jorge Peña</td><td>2022-09-01</td><td>2022</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Devuelve un número: YEAR, MONTH, DAY, DOW (día de la semana), QUARTER, entre otras partes admitidas.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Para agrupar o filtrar por año, mes o trimestre sin depender de la fecha completa; muy usado junto a GROUP BY.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Filtrar con <code>EXTRACT(YEAR FROM fecha) = 2022</code> sobre tablas grandes: al aplicar una función sobre la columna, el motor no siempre puede usar un índice normal sobre esa columna.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Para filtrar por año en tablas grandes, preferir un rango (<code>fecha &gt;= '2022-01-01' AND fecha &lt; '2023-01-01'</code>), que sí aprovecha índices comunes; reservar EXTRACT para el SELECT o el GROUP BY.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> la función equivalente <code>DATE_PART('year', fecha_ingreso)</code> hace lo mismo que EXTRACT; EXTRACT es la forma estándar SQL, DATE_PART es específica de PostgreSQL.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/funciones/t8"><small>Anterior</small><strong>← CURRENT_DATE y NOW()</strong></a>
          <a class="next" data-route-link href="#/modulo/funciones/t10"><small>Siguiente</small><strong>CAST y :: →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 10. CAST y :: ============ -->
    <section class="topic" id="t10" data-title="CAST y ::" data-search="cast conversion tipos casting">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">10</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-func-cast"/></svg>
          <h2>CAST y ::</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-intermedio"></span> Intermedio</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t10"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Convierte un valor de un <strong>tipo de dato</strong> a otro. <code>CAST()</code> es el estándar SQL; <code>::</code> es el atajo propio de PostgreSQL.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">CAST</span>(valor <span class="k">AS</span> tipo)
valor<span class="k">::</span>tipo</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">SELECT</span> nombre, salario,
       salario<span class="k">::text</span> <span class="k">||</span> <span class="s">' COP'</span> <span class="k">AS</span> salario_texto
<span class="k">FROM</span> empleados
<span class="k">WHERE</span> cargo = <span class="s">'Gerente'</span>;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Resultado</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>nombre</th><th>salario</th><th>salario_texto</th></tr></thead>
            <tbody>
              <tr><td>Carla Díaz</td><td>6 800 000</td><td>6800000 COP</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Reinterpreta el valor en otro tipo compatible: numeric a text, text a integer, text a date, etc.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Al concatenar números con texto (como en el ejemplo), o al comparar columnas de tipos distintos que no se convierten solas.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Intentar convertir texto no numérico a número (<code>'abc'::integer</code> lanza error); asumir que <code>::</code> funciona igual en todos los motores, cuando es exclusivo de PostgreSQL.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Usar <code>CAST()</code> en consultas que deban ser portables a otros motores, y <code>::</code> cuando el código ya es específico de PostgreSQL y se prioriza la brevedad.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> <code>salario::text</code> y <code>CAST(salario AS text)</code> son exactamente equivalentes; PostgreSQL los compila al mismo plan de ejecución.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/funciones/t9"><small>Anterior</small><strong>← EXTRACT</strong></a>
          <span></span>
        </nav>
      </div>
    </section>`;

  var EXERCISES_META = [
    {
      id: 'ex1',
      type: 'mcq',
      prompt: '¿Cuál función convierte un texto a mayúsculas en PostgreSQL?',
      options: ['LOWER(texto)', 'UPPER(texto)', 'LENGTH(texto)', 'TRIM(texto)'],
      correct: 1,
      explanation: 'UPPER() convierte todo el texto a mayúsculas; LOWER() hace exactamente lo contrario.'
    },
    {
      id: 'ex2',
      type: 'write',
      prompt: 'Escribe la expresión (con el operador <code>||</code>) que concatena <code>nombre</code> y <code>cargo</code> separados por una coma y un espacio.',
      placeholder: "nombre || ', ' || cargo",
      answers: ["nombre || ', ' || cargo", "nombre||', '||cargo"],
      explanation: 'El operador || une los tres fragmentos en orden: la columna, el separador entre comillas y la otra columna.'
    },
    {
      id: 'ex3',
      type: 'mcq',
      prompt: '¿Qué devuelve <code>ROUND(salario / 1000000.0, 1)</code> para un salario de 4 500 000?',
      options: ['4', '4.5', '4.50000', '45'],
      correct: 1,
      explanation: 'ROUND(valor, decimales) redondea al número de decimales indicado; aquí el resultado es 4.5, con un decimal.'
    },
    {
      id: 'ex4',
      type: 'write',
      prompt: 'Escribe la expresión completa que extrae solo el año de la columna <code>fecha_ingreso</code>.',
      placeholder: 'EXTRACT(YEAR FROM fecha_ingreso)',
      answers: ['extract(year from fecha_ingreso)'],
      explanation: 'EXTRACT(parte FROM fecha) devuelve la parte solicitada; YEAR extrae únicamente el año como número.'
    },
    {
      id: 'ex5',
      type: 'mcq',
      prompt: '¿Cuál es el operador abreviado de PostgreSQL equivalente a <code>CAST(salario AS text)</code>?',
      options: ['salario::text', 'salario->text', 'salario#text', 'salario=text'],
      correct: 0,
      explanation: 'El operador :: es el atajo de PostgreSQL para convertir tipos: valor::tipo, equivalente a CAST(valor AS tipo).'
    }
  ];

  window.App = window.App || {};
  window.App.modules = window.App.modules || {};
  window.App.modules['funciones'] = {
    id: 'funciones',
    topicsMeta: TOPICS_META,
    heroHtml: HERO_HTML,
    schemaHtml: SCHEMA_HTML,
    topicsHtml: TOPICS_HTML,
    exercisesMeta: EXERCISES_META
  };

})();
