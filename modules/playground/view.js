/* ============================================================
   VISTA: PLAYGROUND SQL
   Editor + botón Ejecutar + resultado, contra App.sqlEngine y
   App.playgroundData. No es una vista de módulo (no tiene topics),
   así que no usa module-view.js; es su propia vista de nivel
   superior, igual que el dashboard.
   ============================================================ */
window.App = window.App || {};
App.views = App.views || {};

App.views.playground = (function(){

  var EXAMPLES = [
    { label: 'Todos los empleados', sql: 'SELECT *\nFROM empleados;' },
    { label: 'Filtrar y ordenar', sql: 'SELECT nombre, cargo, salario\nFROM empleados\nWHERE ciudad = \'Bogotá\'\nORDER BY salario DESC;' },
    { label: 'Promedio de salario', sql: 'SELECT ROUND(AVG(salario)) AS salario_promedio\nFROM empleados;' },
    { label: 'Empleados por departamento', sql: 'SELECT d.nombre AS departamento, COUNT(*) AS cantidad\nFROM empleados e\nJOIN departamentos d ON e.departamento_id = d.id\nGROUP BY d.nombre\nORDER BY cantidad DESC;' },
    { label: 'Sin departamento asignado', sql: 'SELECT nombre, cargo\nFROM empleados\nWHERE departamento_id IS NULL;' },
    { label: 'Buscar por nombre', sql: 'SELECT nombre, correo\nFROM empleados\nWHERE nombre LIKE \'A%\';' },
    { label: 'LEFT JOIN completo', sql: 'SELECT e.nombre, d.nombre AS departamento\nFROM empleados e\nLEFT JOIN departamentos d ON e.departamento_id = d.id\nORDER BY e.nombre;' },
    { label: 'Insertar empleado', sql: 'INSERT INTO empleados (nombre, cargo, salario, ciudad, departamento_id)\nVALUES (\'Diana Ríos\', \'Analista\', 3200000, \'Bogotá\', 2);' },
    { label: 'Actualizar salario', sql: 'UPDATE empleados\nSET salario = salario * 1.1\nWHERE cargo = \'Analista\';' },
    { label: 'Eliminar empleado', sql: 'DELETE FROM empleados\nWHERE nombre = \'Diana Ríos\';' }
  ];

  var DEFAULT_SQL = EXAMPLES[0].sql;
  var lastQuery = null; // conserva lo escrito si se navega fuera y se vuelve, solo durante esta sesión

  function escapeHtml(str){
    return String(str).replace(/[&<>"']/g, function(c){
      return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c];
    });
  }

  var SCHEMA_HTML = '<div class="playground-side__header">' +
      '<h3>Datos de la sesión</h3>' +
      '<button type="button" id="pgReset" class="btn btn-secondary" title="Vuelve empleados y departamentos a sus datos originales">↺ Reiniciar datos</button>' +
    '</div>' +
    '<div class="schema">' +
      '<div class="schema-head"><span>tabla &nbsp;<span class="tag">empleados</span></span><span class="tag" id="pgCountEmpleados">7 filas</span></div>' +
      '<div class="schema-scroll"><table class="data">' +
        '<thead><tr><th>id</th><th>nombre</th><th>cargo</th><th>salario</th><th>ciudad</th><th>fecha_ingreso</th><th>correo</th><th>departamento_id</th><th>jefe_id</th></tr></thead>' +
        '<tbody>' +
          '<tr><td>1</td><td>Ana Torres</td><td>Ingeniera de Datos</td><td>4 200 000</td><td>Bogotá</td><td>2022-03-15</td><td>ana.torres@empresa.com</td><td>1</td><td>5</td></tr>' +
          '<tr><td>2</td><td>Luis Gómez</td><td>Analista</td><td>3 100 000</td><td>Medellín</td><td>2023-01-10</td><td class="null">NULL</td><td>2</td><td>5</td></tr>' +
          '<tr><td>3</td><td>Marta Ruiz</td><td>Ingeniera de Datos</td><td>4 500 000</td><td>Bogotá</td><td>2021-11-02</td><td>marta.ruiz@empresa.com</td><td>1</td><td>1</td></tr>' +
          '<tr><td>4</td><td>Pedro Sánchez</td><td>Analista Junior</td><td>2 600 000</td><td>Cali</td><td>2023-06-20</td><td>pedro.sanchez@empresa.com</td><td>2</td><td>2</td></tr>' +
          '<tr><td>5</td><td>Carla Díaz</td><td>Gerente</td><td>6 800 000</td><td>Bogotá</td><td>2019-08-30</td><td>carla.diaz@empresa.com</td><td class="null">NULL</td><td class="null">NULL</td></tr>' +
          '<tr><td>6</td><td>Jorge Peña</td><td>Analista</td><td>3 100 000</td><td>Medellín</td><td>2022-09-01</td><td class="null">NULL</td><td>2</td><td>5</td></tr>' +
          '<tr><td>7</td><td>Sofía León</td><td>Ingeniera de Datos</td><td>4 200 000</td><td>Sogamoso</td><td>2023-02-14</td><td>sofia.leon@empresa.com</td><td>1</td><td>1</td></tr>' +
        '</tbody>' +
      '</table></div>' +
    '</div>' +
    '<div class="schema" style="margin-top:14px;">' +
      '<div class="schema-head"><span>tabla &nbsp;<span class="tag">departamentos</span></span><span class="tag" id="pgCountDepartamentos">4 filas</span></div>' +
      '<div class="schema-scroll"><table class="data">' +
        '<thead><tr><th>id</th><th>nombre</th><th>presupuesto</th></tr></thead>' +
        '<tbody>' +
          '<tr><td>1</td><td>Tecnología</td><td>50 000 000</td></tr>' +
          '<tr><td>2</td><td>Comercial</td><td>30 000 000</td></tr>' +
          '<tr><td>3</td><td>Recursos Humanos</td><td>12 000 000</td></tr>' +
          '<tr><td>4</td><td>Marketing</td><td>18 000 000</td></tr>' +
        '</tbody>' +
      '</table></div>' +
    '</div>';

  function render(){
    var chips = EXAMPLES.map(function(ex, i){
      return '<button type="button" class="playground-chip" data-example="' + i + '">' + escapeHtml(ex.label) + '</button>';
    }).join('');

    return '' +
    '<section class="section playground" style="padding-top:26px;">' +
      '<div class="wrap">' +
        '<header class="hero" style="margin-bottom:20px;">' +
          '<div class="hero__eyebrow">🧪 Laboratorio interactivo</div>' +
          '<h1>Playground SQL</h1>' +
          '<p class="sub">Escribe tu propia consulta y ejecútala contra las mismas tablas de ejemplo del curso. Corre por completo en tu navegador, sin conexión a una base de datos real. Admite <code>SELECT</code>, <code>INSERT</code>, <code>UPDATE</code> y <code>DELETE</code>: tus cambios solo existen en esta sesión y puedes deshacerlos en cualquier momento con "Reiniciar datos".</p>' +
        '</header>' +

        '<div class="playground-grid">' +
          '<div class="playground-main">' +
            '<div class="panel playground-editor">' +
              '<div class="playground-editor__toolbar">' +
                '<span class="playground-editor__label">SQL</span>' +
                '<div class="playground-editor__actions">' +
                  '<button type="button" id="pgClear" class="btn btn-secondary">Limpiar</button>' +
                  '<button type="button" id="pgRun" class="btn btn-primary"><svg aria-hidden="true"><use href="#i-arrow"/></svg> Ejecutar</button>' +
                '</div>' +
              '</div>' +
              '<textarea id="pgInput" class="playground-editor__input" spellcheck="false" autocomplete="off" autocapitalize="off"></textarea>' +
              '<div class="playground-editor__hint">Atajo: <kbd>Ctrl</kbd>+<kbd>Enter</kbd> para ejecutar.</div>' +
            '</div>' +

            '<div class="playground-examples">' +
              '<span class="playground-examples__label">Prueba:</span>' +
              chips +
            '</div>' +

            '<div id="pgResult" class="playground-result"></div>' +
          '</div>' +

          '<aside class="playground-side">' +
            SCHEMA_HTML +
            '<div class="panel playground-help">' +
              '<h3>Qué entiende este motor</h3>' +
              '<ul>' +
                '<li>SELECT, DISTINCT, alias con AS</li>' +
                '<li>Funciones: COUNT, SUM, AVG, MIN, MAX, UPPER, LOWER, LENGTH, ROUND, TRIM, CEIL, FLOOR, ABS, CONCAT, COALESCE</li>' +
                '<li>Un JOIN por consulta (INNER, LEFT o RIGHT) con alias de tabla</li>' +
                '<li>WHERE con AND, OR, NOT, BETWEEN, IN, LIKE/ILIKE, IS [NOT] NULL</li>' +
                '<li>GROUP BY, HAVING, ORDER BY (ASC/DESC), LIMIT</li>' +
                '<li>INSERT INTO ... VALUES (varias filas, columnas opcionales, DEFAULT)</li>' +
                '<li>UPDATE ... SET ... WHERE</li>' +
                '<li>DELETE FROM ... WHERE</li>' +
              '</ul>' +
              '<p class="playground-help__note">Es un intérprete propio en JavaScript, no PostgreSQL real: cubre lo enseñado en el curso, no todo el estándar SQL. No soporta subconsultas, RETURNING ni ON CONFLICT (UPSERT).</p>' +
            '</div>' +
          '</aside>' +
        '</div>' +
      '</div>' +
    '</section>';
  }

  function formatCell(v){
    if (typeof v === 'number' && !Number.isInteger(v)){
      return Math.round(v * 1e6) / 1e6;
    }
    return v;
  }

  function resultTableHtml(result){
    var count = result.rows.length;
    var summary = result.message || (count + ' fila' + (count === 1 ? '' : 's'));

    if (!count){
      var emptyText = result.message || 'La consulta se ejecutó correctamente, pero no devolvió filas.';
      return '<div class="playground-empty"><svg aria-hidden="true"><use href="#i-search"/></svg><p>' + escapeHtml(emptyText) + '</p></div>';
    }
    var head = '<tr>' + result.columns.map(function(c){ return '<th>' + escapeHtml(c) + '</th>'; }).join('') + '</tr>';
    var body = result.rows.map(function(row){
      return '<tr>' + result.columns.map(function(c){
        var v = formatCell(row[c]);
        return (v === null || v === undefined) ? '<td class="null">NULL</td>' : '<td>' + escapeHtml(v) + '</td>';
      }).join('') + '</tr>';
    }).join('');
    return '<div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> ' + escapeHtml(summary) + '</div>' +
      '<div class="result-wrap"><table class="result"><thead>' + head + '</thead><tbody>' + body + '</tbody></table></div>';
  }

  function errorHtml(message){
    return '<div class="alert playground-alert">' +
      '<svg aria-hidden="true"><use href="#i-warn"/></svg>' +
      '<span><strong>No se pudo ejecutar la consulta:</strong> ' + escapeHtml(message) + '</span>' +
    '</div>';
  }

  function emptyStateHtml(){
    return '<div class="playground-empty"><svg aria-hidden="true"><use href="#i-select"/></svg><p>Escribe una consulta SELECT y presiona Ejecutar.</p></div>';
  }

  function afterRender(root){
    var input = root.querySelector('#pgInput');
    var resultEl = root.querySelector('#pgResult');
    var runBtn = root.querySelector('#pgRun');
    var clearBtn = root.querySelector('#pgClear');
    var resetBtn = root.querySelector('#pgReset');
    var countEmpleados = root.querySelector('#pgCountEmpleados');
    var countDepartamentos = root.querySelector('#pgCountDepartamentos');
    if (!input) return;

    input.value = lastQuery !== null ? lastQuery : DEFAULT_SQL;

    function updateCounts(){
      if (countEmpleados) countEmpleados.textContent = App.playgroundData.empleados.length + ' filas';
      if (countDepartamentos) countDepartamentos.textContent = App.playgroundData.departamentos.length + ' filas';
    }

    function runQuery(){
      lastQuery = input.value;
      if (!input.value.trim()){
        resultEl.innerHTML = emptyStateHtml();
        return;
      }
      try {
        var result = App.sqlEngine.run(input.value, App.playgroundData, App.playgroundSchema);
        resultEl.innerHTML = resultTableHtml(result);
        updateCounts();
      } catch (err){
        resultEl.innerHTML = errorHtml(err && err.message ? err.message : 'Ocurrió un error inesperado al ejecutar la consulta.');
      }
    }

    runBtn.addEventListener('click', runQuery);
    clearBtn.addEventListener('click', function(){
      input.value = '';
      lastQuery = '';
      resultEl.innerHTML = emptyStateHtml();
      input.focus();
    });
    if (resetBtn){
      resetBtn.addEventListener('click', function(){
        App.playgroundReset();
        updateCounts();
        resultEl.innerHTML = '<div class="playground-empty"><svg aria-hidden="true"><use href="#i-check"/></svg><p>Los datos se reiniciaron a su estado original.</p></div>';
      });
    }
    input.addEventListener('keydown', function(e){
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter'){
        e.preventDefault();
        runQuery();
      }
    });
    root.querySelectorAll('[data-example]').forEach(function(btn){
      btn.addEventListener('click', function(){
        var ex = EXAMPLES[Number(btn.getAttribute('data-example'))];
        if (!ex) return;
        input.value = ex.sql;
        input.focus();
        runQuery();
      });
    });

    updateCounts();
    runQuery();
  }

  return { render: render, afterRender: afterRender };
})();
