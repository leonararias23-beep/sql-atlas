/* ============================================================
   MÓDULO: Triggers (último módulo)
   Misma forma que los módulos anteriores. Introduce una tabla nueva,
   empleados_auditoria, pensada específicamente para que los 5 temas
   cuenten una sola historia: registrar automáticamente qué cambia
   en empleados. Reutiliza empleados de los módulos anteriores.
   ============================================================ */
(function(){
  'use strict';

  var TOPICS_META = [
    { id:'t1', num:'01', title:'Función de trigger (NEW / OLD)', level:'basico',     search:'returns trigger new old funcion trigger' },
    { id:'t2', num:'02', title:'CREATE TRIGGER',                level:'basico',     search:'create trigger crear disparador for each row' },
    { id:'t3', num:'03', title:'BEFORE vs AFTER',                level:'intermedio', search:'before after validar rechazar' },
    { id:'t4', num:'04', title:'Trigger en DELETE',              level:'intermedio', search:'trigger delete old eliminacion' },
    { id:'t5', num:'05', title:'DISABLE y DROP TRIGGER',         level:'intermedio', search:'disable enable drop trigger desactivar eliminar' }
  ];

  var HERO_HTML = `<header class="hero">
      <h1>Triggers: reaccionar automáticamente a los cambios</h1>
      <p class="sub">Funciones de trigger con NEW y OLD, CREATE TRIGGER, la diferencia entre BEFORE y AFTER, triggers en DELETE y cómo desactivarlos o eliminarlos. Los cinco temas arman, en conjunto, un registro de auditoría automático sobre <code>empleados</code>.</p>
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
              </tr>
            </thead>
            <tbody>
              <tr><td>1</td><td>Ana Torres</td><td>Ingeniera de Datos</td><td>4 200 000</td></tr>
              <tr><td>2</td><td>Luis Gómez</td><td>Analista</td><td>3 100 000</td></tr>
              <tr><td>3</td><td>Marta Ruiz</td><td>Ingeniera de Datos</td><td>4 500 000</td></tr>
              <tr><td>4</td><td>Pedro Sánchez</td><td>Analista Junior</td><td>2 600 000</td></tr>
              <tr><td>5</td><td>Carla Díaz</td><td>Gerente</td><td>6 800 000</td></tr>
              <tr><td>6</td><td>Jorge Peña</td><td>Analista</td><td>3 100 000</td></tr>
              <tr><td>7</td><td>Sofía León</td><td>Ingeniera de Datos</td><td>4 200 000</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="schema">
        <div class="schema-head">
          <span>tabla nueva &nbsp;<span class="tag">empleados_auditoria</span></span>
          <span class="tag">vacía al inicio</span>
        </div>
        <div class="schema-scroll">
          <table class="data">
            <thead>
              <tr>
                <th>id<span class="type">integer</span></th>
                <th>empleado_id<span class="type">integer</span></th>
                <th>accion<span class="type">text</span></th>
                <th>fecha<span class="type">timestamp</span></th>
                <th>salario_anterior<span class="type">numeric</span></th>
                <th>salario_nuevo<span class="type">numeric</span></th>
              </tr>
            </thead>
            <tbody>
              <tr><td colspan="6" style="text-align:center; color:var(--ink-3); font-style:italic;">sin filas: se llena sola cuando los triggers de este módulo se disparan</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>`;

  var TOPICS_HTML = `<!-- ============ 1. Función de trigger (NEW / OLD) ============ -->
    <section class="topic" id="t1" data-title="Función de trigger (NEW / OLD)" data-search="returns trigger new old funcion trigger">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">01</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-mod-triggers"/></svg>
          <h2>Función de trigger (NEW / OLD)</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-basico"></span> Básico</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t1"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Un trigger siempre ejecuta una <strong>función especial</strong> que devuelve tipo <code>TRIGGER</code>, con acceso a variables automáticas: <code>NEW</code> (la fila nueva) y <code>OLD</code> (la fila anterior).</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">CREATE FUNCTION</span> nombre()
<span class="k">RETURNS TRIGGER AS</span> $$
<span class="k">BEGIN</span>
  ...
  <span class="k">RETURN NEW</span>;
<span class="k">END</span>;
$$ <span class="k">LANGUAGE</span> plpgsql;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">CREATE FUNCTION</span> registrar_cambio_salario()
<span class="k">RETURNS TRIGGER AS</span> $$
<span class="k">BEGIN</span>
  <span class="k">INSERT INTO</span> empleados_auditoria
    (empleado_id, accion, fecha, salario_anterior, salario_nuevo)
  <span class="k">VALUES</span>
    (<span class="k">NEW</span>.id, <span class="s">'actualización'</span>, <span class="k">NOW</span>(), <span class="k">OLD</span>.salario, <span class="k">NEW</span>.salario);
  <span class="k">RETURN NEW</span>;
<span class="k">END</span>;
$$ <span class="k">LANGUAGE</span> plpgsql;</pre></div>
          </div>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Esta función todavía no está conectada a ningún evento (eso lo hace CREATE TRIGGER, siguiente tema); solo define qué debe pasar cuando algo la dispare.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Auditoría de cambios, validaciones automáticas, mantenimiento de columnas calculadas: cualquier reacción que deba ocurrir siempre que cambien ciertos datos.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Olvidar <code>RETURN NEW;</code> al final: en un trigger BEFORE, si no se devuelve la fila, PostgreSQL cancela la operación original sin avisar con un error claro.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Mantener las funciones de trigger simples y rápidas: se ejecutan en el camino crítico de cada INSERT/UPDATE/DELETE, así que un trigger lento hace lenta a toda la tabla.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> en un trigger de UPDATE existen tanto NEW como OLD (el antes y el después); en INSERT solo existe NEW (no hay fila "anterior"); en DELETE solo existe OLD (no hay fila "nueva"). Este último caso vuelve en el tema 4.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <span></span>
          <a class="next" data-route-link href="#/modulo/triggers/t2"><small>Siguiente</small><strong>CREATE TRIGGER →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 2. CREATE TRIGGER ============ -->
    <section class="topic" id="t2" data-title="CREATE TRIGGER" data-search="create trigger crear disparador for each row">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">02</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-mod-triggers"/></svg>
          <h2>CREATE TRIGGER</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-basico"></span> Básico</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t2"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def"><strong>Conecta</strong> una función de trigger con un evento concreto (INSERT, UPDATE o DELETE) sobre una tabla específica.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">CREATE TRIGGER</span> nombre
<span class="k">AFTER</span> evento <span class="k">ON</span> tabla
<span class="k">FOR EACH ROW</span>
<span class="k">EXECUTE FUNCTION</span> funcion_trigger();</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">CREATE TRIGGER</span> trg_auditoria_salario
<span class="k">AFTER UPDATE ON</span> empleados
<span class="k">FOR EACH ROW</span>
<span class="k">WHEN</span> (<span class="k">OLD</span>.salario <span class="k">IS DISTINCT FROM NEW</span>.salario)
<span class="k">EXECUTE FUNCTION</span> registrar_cambio_salario();

<span class="k">UPDATE</span> empleados <span class="k">SET</span> salario = 4500000 <span class="k">WHERE</span> nombre = <span class="s">'Luis Gómez'</span>;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Resultado: SELECT * FROM empleados_auditoria;</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>empleado_id</th><th>accion</th><th>salario_anterior</th><th>salario_nuevo</th></tr></thead>
            <tbody>
              <tr><td>2</td><td>actualización</td><td>3 100 000</td><td>4 500 000</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p><code>FOR EACH ROW</code> hace que la función se ejecute una vez por cada fila afectada; el <code>WHEN</code> agrega una condición extra para disparar el trigger solo si el salario realmente cambió.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Cada vez que un cambio en una tabla deba disparar una acción automática, sin depender de que la aplicación recuerde hacerlo manualmente.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Omitir el <code>WHEN</code> cuando solo interesa reaccionar a un cambio específico: sin él, el trigger se dispararía en cada UPDATE de empleados, aunque solo cambiara, por ejemplo, el cargo.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Usar <code>IS DISTINCT FROM</code> en vez de <code>&lt;&gt;</code> al comparar OLD y NEW: a diferencia de <code>&lt;&gt;</code>, maneja bien el caso donde alguno de los dos valores es NULL.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> también existe <code>FOR EACH STATEMENT</code> (se ejecuta una sola vez por sentencia, sin importar cuántas filas afecte), útil cuando la lógica no necesita conocer fila por fila.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/triggers/t1"><small>Anterior</small><strong>← Función de trigger (NEW / OLD)</strong></a>
          <a class="next" data-route-link href="#/modulo/triggers/t3"><small>Siguiente</small><strong>BEFORE vs AFTER →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 3. BEFORE vs AFTER ============ -->
    <section class="topic" id="t3" data-title="BEFORE vs AFTER" data-search="before after validar rechazar">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">03</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-scale"/></svg>
          <h2>BEFORE vs AFTER</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-intermedio"></span> Intermedio</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t3"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def"><strong>BEFORE</strong> se ejecuta antes de aplicar el cambio (y puede modificarlo o cancelarlo); <strong>AFTER</strong> se ejecuta cuando el cambio ya es un hecho.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">BEFORE INSERT OR UPDATE ON</span> tabla
<span class="k">FOR EACH ROW EXECUTE FUNCTION</span> validacion();</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">CREATE FUNCTION</span> validar_salario()
<span class="k">RETURNS TRIGGER AS</span> $$
<span class="k">BEGIN</span>
  <span class="k">IF NEW</span>.salario &lt; 0 <span class="k">THEN</span>
    <span class="k">RAISE EXCEPTION</span> <span class="s">'El salario no puede ser negativo'</span>;
  <span class="k">END IF</span>;
  <span class="k">RETURN NEW</span>;
<span class="k">END</span>;
$$ <span class="k">LANGUAGE</span> plpgsql;

<span class="k">CREATE TRIGGER</span> trg_validar_salario
<span class="k">BEFORE INSERT OR UPDATE ON</span> empleados
<span class="k">FOR EACH ROW EXECUTE FUNCTION</span> validar_salario();

<span class="k">UPDATE</span> empleados <span class="k">SET</span> salario = -1000 <span class="k">WHERE</span> nombre = <span class="s">'Pedro Sánchez'</span>;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Resultado</div>
        <div class="code-block"><pre class="code">ERROR:  El salario no puede ser negativo
CONTEXT:  PL/pgSQL function validar_salario() line 3 at RAISE</pre></div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Como el trigger es BEFORE, alcanza a revisar NEW.salario antes de que la fila se escriba; al lanzar la excepción, el UPDATE completo se cancela y la tabla queda sin cambios.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>BEFORE: validar o normalizar datos antes de guardarlos (rechazar valores inválidos, poner texto en mayúsculas). AFTER: reaccionar a algo que ya ocurrió, como registrar auditoría (tema 2) o notificar a otro sistema.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Intentar modificar NEW dentro de un trigger AFTER esperando que afecte la fila guardada: en AFTER ya es tarde, la fila ya quedó escrita tal como estaba en el BEFORE (o en el INSERT/UPDATE original).</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Usar BEFORE para todo lo que sea "impedir o corregir" y AFTER para todo lo que sea "informar o propagar"; mezclar ambas responsabilidades en un solo trigger suele complicar el mantenimiento.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> si este mismo trigger fuera AFTER en vez de BEFORE, el salario negativo ya se habría guardado en la tabla antes de que la función alcanzara a quejarse; por eso las validaciones van en BEFORE.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/triggers/t2"><small>Anterior</small><strong>← CREATE TRIGGER</strong></a>
          <a class="next" data-route-link href="#/modulo/triggers/t4"><small>Siguiente</small><strong>Trigger en DELETE →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 4. Trigger en DELETE ============ -->
    <section class="topic" id="t4" data-title="Trigger en DELETE" data-search="trigger delete old eliminacion">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">04</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-view-drop"/></svg>
          <h2>Trigger en DELETE</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-intermedio"></span> Intermedio</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t4"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">En un trigger de DELETE solo existe <code>OLD</code> (la fila que se está borrando); no hay <code>NEW</code>, porque no queda ninguna fila nueva.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">AFTER DELETE ON</span> tabla
<span class="k">FOR EACH ROW EXECUTE FUNCTION</span> funcion_trigger();</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">CREATE FUNCTION</span> registrar_eliminacion()
<span class="k">RETURNS TRIGGER AS</span> $$
<span class="k">BEGIN</span>
  <span class="k">INSERT INTO</span> empleados_auditoria
    (empleado_id, accion, fecha, salario_anterior, salario_nuevo)
  <span class="k">VALUES</span>
    (<span class="k">OLD</span>.id, <span class="s">'eliminación'</span>, <span class="k">NOW</span>(), <span class="k">OLD</span>.salario, <span class="k">NULL</span>);
  <span class="k">RETURN OLD</span>;
<span class="k">END</span>;
$$ <span class="k">LANGUAGE</span> plpgsql;

<span class="k">CREATE TRIGGER</span> trg_auditoria_eliminacion
<span class="k">AFTER DELETE ON</span> empleados
<span class="k">FOR EACH ROW EXECUTE FUNCTION</span> registrar_eliminacion();

<span class="k">DELETE FROM</span> empleados <span class="k">WHERE</span> nombre = <span class="s">'Jorge Peña'</span>;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Resultado: SELECT * FROM empleados_auditoria WHERE accion = 'eliminación';</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>empleado_id</th><th>accion</th><th>salario_anterior</th><th>salario_nuevo</th></tr></thead>
            <tbody>
              <tr><td>6</td><td>eliminación</td><td>3 100 000</td><td class="null">NULL</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Antes de que la fila de Jorge Peña desaparezca de empleados, el trigger AFTER DELETE guarda su rastro en empleados_auditoria; queda registrado que existió y con qué salario.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Auditoría de bajas, borrado lógico complementario, o cualquier caso donde se necesite conservar evidencia de qué se eliminó y cuándo.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Escribir <code>NEW.id</code> por costumbre en un trigger de DELETE: NEW no existe en este contexto, y PostgreSQL lo rechaza con un error de variable no encontrada.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>En DELETE, devolver <code>RETURN OLD;</code> (no NEW, que no existe) al final de un trigger BEFORE DELETE; en AFTER DELETE el valor de retorno se ignora, pero mantener la costumbre evita errores al copiar código entre triggers.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> la fila de Jorge Peña ya no está en empleados, pero su historia queda completa en empleados_auditoria: esta tabla ahora tiene dos registros, uno de la actualización de Luis Gómez (tema 2) y este de la eliminación.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/triggers/t3"><small>Anterior</small><strong>← BEFORE vs AFTER</strong></a>
          <a class="next" data-route-link href="#/modulo/triggers/t5"><small>Siguiente</small><strong>DISABLE y DROP TRIGGER →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 5. DISABLE y DROP TRIGGER ============ -->
    <section class="topic" id="t5" data-title="DISABLE y DROP TRIGGER" data-search="disable enable drop trigger desactivar eliminar">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">05</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-toggle"/></svg>
          <h2>DISABLE y DROP TRIGGER</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-intermedio"></span> Intermedio</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t5"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Un trigger se puede <strong>apagar temporalmente</strong> sin borrarlo, o <strong>eliminarlo</strong> por completo si ya no hace falta.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">ALTER TABLE</span> tabla <span class="k">DISABLE TRIGGER</span> nombre;
<span class="k">ALTER TABLE</span> tabla <span class="k">ENABLE TRIGGER</span> nombre;
<span class="k">DROP TRIGGER</span> nombre <span class="k">ON</span> tabla;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="c">-- carga masiva: no queremos auditar cada fila una por una</span>
<span class="k">ALTER TABLE</span> empleados <span class="k">DISABLE TRIGGER</span> trg_auditoria_salario;

<span class="c">-- ... aquí iría la carga masiva de datos ...</span>

<span class="k">ALTER TABLE</span> empleados <span class="k">ENABLE TRIGGER</span> trg_auditoria_salario;

<span class="c">-- si el trigger ya no se necesita nunca más:</span>
<span class="k">DROP TRIGGER</span> trg_auditoria_salario <span class="k">ON</span> empleados;</pre></div>
          </div>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>DISABLE deja el trigger definido pero inactivo (no se dispara); ENABLE lo reactiva sin necesidad de volver a crearlo; DROP lo borra de forma permanente.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>DISABLE/ENABLE: cargas masivas de datos, migraciones o mantenimientos donde el trigger solo estorbaría. DROP: cuando la lógica de negocio detrás del trigger ya no aplica.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Deshabilitar un trigger para una carga masiva y olvidar volver a habilitarlo: los cambios posteriores dejarían de auditarse (o de validarse) sin que nadie lo note de inmediato.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Envolver el DISABLE y el ENABLE en el mismo script o transacción que la operación que los necesita, para que sea imposible dejar el trigger apagado por error.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> a diferencia de DROP VIEW en el módulo de Vistas, DROP TRIGGER no elimina la función asociada (registrar_cambio_salario sigue existiendo); si también se quiere borrar la función, hace falta un <code>DROP FUNCTION</code> aparte.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/triggers/t4"><small>Anterior</small><strong>← Trigger en DELETE</strong></a>
          <span></span>
        </nav>
      </div>
    </section>`;

  var EXERCISES_META = [
    {
      id: 'ex1',
      type: 'mcq',
      prompt: 'Dentro de una función de trigger para un evento INSERT, ¿qué variable especial contiene la fila que se está insertando?',
      options: ['OLD', 'NEW', 'ROW', 'THIS'],
      correct: 1,
      explanation: 'NEW representa la fila que se está insertando (o el nuevo valor en un UPDATE); en INSERT no existe OLD porque no hay fila previa.'
    },
    {
      id: 'ex2',
      type: 'mcq',
      prompt: '¿Qué variable especial está disponible en un trigger de DELETE pero NO en uno de INSERT?',
      options: ['NEW', 'OLD', 'ROW', 'CURRENT'],
      correct: 1,
      explanation: 'En DELETE solo existe OLD (la fila que se elimina); no hay NEW porque no queda ninguna fila nueva tras el borrado.'
    },
    {
      id: 'ex3',
      type: 'write',
      prompt: 'Escribe la cláusula que hace que un trigger se ejecute una vez por cada fila afectada (en vez de una sola vez por sentencia).',
      placeholder: 'FOR EACH ROW',
      answers: ['for each row'],
      explanation: 'FOR EACH ROW dispara la función de trigger por cada fila que cambia; la alternativa FOR EACH STATEMENT la dispara solo una vez por sentencia.'
    },
    {
      id: 'ex4',
      type: 'mcq',
      prompt: '¿Cuál es la diferencia principal entre un trigger BEFORE y uno AFTER?',
      options: ['No hay diferencia real', 'BEFORE puede modificar o cancelar la fila antes de guardarla; AFTER reacciona después de que el cambio ya ocurrió', 'AFTER siempre es más rápido', 'BEFORE solo funciona con DELETE'],
      correct: 1,
      explanation: 'BEFORE se ejecuta con tiempo de intervenir (validar, corregir, cancelar); AFTER se ejecuta cuando el cambio ya es un hecho, típico para auditoría o notificaciones.'
    },
    {
      id: 'ex5',
      type: 'mcq',
      prompt: '¿Qué comando desactiva temporalmente un trigger sin eliminarlo?',
      options: ['DROP TRIGGER', 'ALTER TABLE ... DISABLE TRIGGER ...', 'PAUSE TRIGGER', 'STOP TRIGGER'],
      correct: 1,
      explanation: 'ALTER TABLE tabla DISABLE TRIGGER nombre; deja el trigger definido pero inactivo; ENABLE TRIGGER lo reactiva sin volver a crearlo.'
    }
  ];

  window.App = window.App || {};
  window.App.modules = window.App.modules || {};
  window.App.modules['triggers'] = {
    id: 'triggers',
    topicsMeta: TOPICS_META,
    heroHtml: HERO_HTML,
    schemaHtml: SCHEMA_HTML,
    topicsHtml: TOPICS_HTML,
    exercisesMeta: EXERCISES_META
  };

})();
