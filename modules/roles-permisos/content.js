/* ============================================================
   MÓDULO: Roles y permisos (DCL: Controlar accesos)
   Único módulo del bloque DCL: quién puede hacer qué en la base.
   Cierra las cinco secciones "de lenguaje" (DQL, DML, DDL, TCL,
   DCL). Misma forma que el resto de módulos. Nota: las claves de
   los ejemplos son ilustrativas, no credenciales reales.
   ============================================================ */
(function(){
  'use strict';

  var TOPICS_META = [
    { id:'t1', num:'01', title:'Roles y usuarios',   level:'avanzado', search:'create role user usuario grupo identidad' },
    { id:'t2', num:'02', title:'Atributos de rol',   level:'avanzado', search:'login password superuser createdb atributos alter role' },
    { id:'t3', num:'03', title:'GRANT',              level:'avanzado', search:'grant conceder permisos privilegios select insert' },
    { id:'t4', num:'04', title:'REVOKE',             level:'avanzado', search:'revoke retirar quitar permisos' },
    { id:'t5', num:'05', title:'Roles de grupo y PUBLIC', level:'avanzado', search:'roles de grupo public herencia permisos' }
  ];

  var HERO_HTML = `<header class="hero">
      <h1>Roles y permisos: quién puede hacer qué</h1>
      <p class="sub">El <strong>DCL</strong> controla el acceso: qué usuarios existen y qué pueden hacer sobre cada tabla. Aquí verás cómo crear roles y cómo conceder o retirar permisos con <code>GRANT</code> y <code>REVOKE</code> sobre <code>empleados</code> y <code>departamentos</code>.</p>
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

  var TOPICS_HTML = `<!-- ============ 1. Roles y usuarios ============ -->
    <section class="topic" id="t1" data-title="Roles y usuarios" data-search="create role user usuario grupo identidad">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">01</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-mod-roles"/></svg>
          <h2>Roles y usuarios</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-avanzado"></span> Avanzado</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t1"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">En PostgreSQL, tanto los usuarios como los grupos son <strong>roles</strong>. Un rol puede iniciar sesión (usuario) o solo agrupar permisos (grupo).</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">CREATE ROLE</span> nombre;
<span class="k">CREATE USER</span> nombre;  <span class="c">-- rol que puede iniciar sesión</span></pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">CREATE USER</span> analista
  <span class="k">WITH PASSWORD</span> <span class="s">'clave_ejemplo'</span>;</pre></div>
          </div>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Crea una identidad a la que luego se le asignan permisos sobre las tablas y demás objetos.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Al dar acceso a una persona o a una aplicación que se conecta a la base de datos.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Confundir "rol" y "usuario": en PostgreSQL un <code>USER</code> es simplemente un <code>ROLE</code> con permiso para iniciar sesión.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Un rol por aplicación o perfil, con los permisos mínimos que necesita (principio de menor privilegio).</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> <code>CREATE USER</code> equivale a <code>CREATE ROLE ... WITH LOGIN</code>. La clave del ejemplo es solo ilustrativa; nunca escribas contraseñas reales en scripts compartidos.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <span></span>
          <a class="next" data-route-link href="#/modulo/roles-permisos/t2"><small>Siguiente</small><strong>Atributos de rol →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 2. Atributos de rol ============ -->
    <section class="topic" id="t2" data-title="Atributos de rol" data-search="login password superuser createdb atributos alter role">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">02</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-toggle"/></svg>
          <h2>Atributos de rol</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-avanzado"></span> Avanzado</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t2"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Los roles tienen <strong>atributos</strong> que definen qué pueden hacer a nivel de servidor: iniciar sesión, crear bases, administrar, etc.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Los principales</div>
            <div class="code-block"><pre class="code"><span class="k">LOGIN</span>       <span class="c">-- puede conectarse</span>
<span class="k">PASSWORD</span>    <span class="c">-- clave de acceso</span>
<span class="k">SUPERUSER</span>   <span class="c">-- omite todos los permisos</span>
<span class="k">CREATEDB</span>    <span class="c">-- puede crear bases</span>
<span class="k">CREATEROLE</span>  <span class="c">-- puede crear otros roles</span></pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">ALTER ROLE</span> analista <span class="k">WITH</span> <span class="k">CREATEDB</span>;</pre></div>
          </div>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Define las capacidades del rol; <code>ALTER ROLE</code> permite cambiarlas después de crearlo.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Ajustar qué puede hacer cada rol a nivel administrativo, no solo sobre las tablas.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Otorgar <code>SUPERUSER</code> "por comodidad": ese rol se salta todas las comprobaciones de permisos.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Menor privilegio: da solo los atributos necesarios y reserva <code>SUPERUSER</code> para administración puntual.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> un rol con <code>NOLOGIN</code> no puede conectarse; sirve como rol de grupo para agrupar permisos (último tema).</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/roles-permisos/t1"><small>Anterior</small><strong>← Roles y usuarios</strong></a>
          <a class="next" data-route-link href="#/modulo/roles-permisos/t3"><small>Siguiente</small><strong>GRANT →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 3. GRANT ============ -->
    <section class="topic" id="t3" data-title="GRANT" data-search="grant conceder permisos privilegios select insert">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">03</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-unlock"/></svg>
          <h2>GRANT</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-avanzado"></span> Avanzado</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t3"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def"><strong>Concede</strong> permisos sobre un objeto (una tabla, por ejemplo) a un rol.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">GRANT</span> privilegio <span class="k">ON</span> objeto <span class="k">TO</span> rol;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">GRANT</span> <span class="k">SELECT</span>, <span class="k">INSERT</span> <span class="k">ON</span> empleados <span class="k">TO</span> analista;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> Permisos del rol analista sobre empleados</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>privilegio</th><th>concedido</th></tr></thead>
            <tbody>
              <tr><td>SELECT</td><td>sí</td></tr>
              <tr><td>INSERT</td><td>sí</td></tr>
              <tr><td>UPDATE</td><td class="null">no</td></tr>
              <tr><td>DELETE</td><td class="null">no</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Otorga privilegios concretos: <code>SELECT</code>, <code>INSERT</code>, <code>UPDATE</code>, <code>DELETE</code> o <code>ALL</code>.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Para dar a cada rol exactamente lo que necesita: un rol de solo lectura solo obtiene <code>SELECT</code>.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Usar <code>GRANT ALL</code> cuando bastaba con <code>SELECT</code>: abre más de lo necesario.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Conceder el conjunto mínimo de privilegios por rol; es más fácil ampliar después que descubrir un acceso de más.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> <code>GRANT ALL PRIVILEGES ON empleados TO rol</code> da todos los permisos de una vez; prefiérelo solo cuando de verdad se necesitan todos.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/roles-permisos/t2"><small>Anterior</small><strong>← Atributos de rol</strong></a>
          <a class="next" data-route-link href="#/modulo/roles-permisos/t4"><small>Siguiente</small><strong>REVOKE →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 4. REVOKE ============ -->
    <section class="topic" id="t4" data-title="REVOKE" data-search="revoke retirar quitar permisos">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">04</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-lock"/></svg>
          <h2>REVOKE</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-avanzado"></span> Avanzado</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t4"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def"><strong>Retira</strong> permisos que se habían concedido antes. Es el inverso exacto de <code>GRANT</code>.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">REVOKE</span> privilegio <span class="k">ON</span> objeto <span class="k">FROM</span> rol;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">REVOKE</span> <span class="k">INSERT</span> <span class="k">ON</span> empleados <span class="k">FROM</span> analista;</pre></div>
          </div>
        </div>
        <div class="result-label"><svg aria-hidden="true"><use href="#i-result"/></svg> analista tras el REVOKE: pierde INSERT</div>
        <div class="result-wrap">
          <table class="result">
            <thead><tr><th>privilegio</th><th>concedido</th></tr></thead>
            <tbody>
              <tr><td>SELECT</td><td>sí</td></tr>
              <tr><td>INSERT</td><td class="null">no</td></tr>
            </tbody>
          </table>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>Quita el privilegio indicado; el rol conserva los demás que aún tenga.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Reducir el acceso de un rol: un cambio de responsabilidades, cerrar un permiso temporal, etc.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Olvidar que un permiso heredado de un <em>rol de grupo</em> sigue vigente aunque se revoque el directo.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Revisar los permisos de forma periódica y retirar los que ya no correspondan.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> <code>GRANT</code> y <code>REVOKE</code> son simétricos: lo que uno concede, el otro lo quita.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/roles-permisos/t3"><small>Anterior</small><strong>← GRANT</strong></a>
          <a class="next" data-route-link href="#/modulo/roles-permisos/t5"><small>Siguiente</small><strong>Roles de grupo y PUBLIC →</strong></a>
        </nav>
      </div>
    </section>

    <!-- ============ 5. Roles de grupo y PUBLIC ============ -->
    <section class="topic" id="t5" data-title="Roles de grupo y PUBLIC" data-search="roles de grupo public herencia permisos">
      <div class="topic-head">
        <div class="topic-head__left">
          <span class="num">05</span>
          <svg class="topic-icon" aria-hidden="true"><use href="#i-agg-func"/></svg>
          <h2>Roles de grupo y PUBLIC</h2>
        </div>
        <div class="topic-head__tags">
          <span class="tag-level"><span class="dot lvl-avanzado"></span> Avanzado</span>
          <label class="topic-check"><input type="checkbox" data-topic-check="t5"><svg class="topic-check__icon-off" aria-hidden="true"><use href="#i-empty"/></svg><svg class="topic-check__icon-on" aria-hidden="true"><use href="#i-check"/></svg><span>Marcar como completado</span></label>
        </div>
      </div>
      <div class="topic-body">
        <p class="def">Un rol puede <strong>agrupar</strong> a otros (rol de grupo); <code>PUBLIC</code> representa a <strong>todos</strong> los roles a la vez.</p>
        <div class="grid2">
          <div>
            <div class="block-label">Sintaxis</div>
            <div class="code-block"><pre class="code"><span class="k">GRANT</span> rol_grupo <span class="k">TO</span> usuario;   <span class="c">-- hereda sus permisos</span>
<span class="k">GRANT</span> <span class="k">SELECT</span> <span class="k">ON</span> empleados <span class="k">TO</span> <span class="k">PUBLIC</span>;</pre></div>
          </div>
          <div>
            <div class="block-label">Ejemplo</div>
            <div class="code-block"><pre class="code"><span class="k">CREATE ROLE</span> lectores;
<span class="k">GRANT</span> <span class="k">SELECT</span> <span class="k">ON</span> empleados <span class="k">TO</span> lectores;
<span class="k">GRANT</span> lectores <span class="k">TO</span> analista; <span class="c">-- hereda SELECT</span></pre></div>
          </div>
        </div>
        <div class="info-grid">
          <div class="info-card info-card--brand"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-do"/></svg> Qué hace</div><p>El rol de grupo reúne permisos; quienes pertenecen a él los heredan. <code>PUBLIC</code> los da a absolutamente todos.</p></div>
          <div class="info-card"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-tip"/></svg> Cuándo usarlo</div><p>Cuando muchos usuarios comparten el mismo perfil: das permisos al grupo una vez, no persona por persona.</p></div>
          <div class="info-card info-card--warn"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-warn"/></svg> Errores comunes</div><p>Conceder algo a <code>PUBLIC</code> sin querer: ese permiso queda disponible para cualquier rol de la base.</p></div>
          <div class="info-card info-card--ok"><div class="info-card__label"><svg aria-hidden="true"><use href="#i-check"/></svg> Buena práctica</div><p>Administrar los permisos a través de roles de grupo (por perfil) es mucho más mantenible que hacerlo usuario a usuario.</p></div>
        </div>
        <div class="note"><strong>Observación:</strong> <code>PUBLIC</code> es un pseudo-rol que incluye a todos; úsalo con cuidado, sobre todo al conceder acceso a datos sensibles.</div>
        <nav class="topic-pager" aria-label="Navegación entre temas">
          <a data-route-link href="#/modulo/roles-permisos/t4"><small>Anterior</small><strong>← REVOKE</strong></a>
          <span></span>
        </nav>
      </div>
    </section>`;

  var EXERCISES_META = [
    {
      id: 'ex1',
      type: 'mcq',
      prompt: 'En PostgreSQL, ¿qué es un "usuario"?',
      options: ['Un rol que además puede iniciar sesión', 'Una tabla especial', 'Una base de datos', 'Un tipo de índice'],
      correct: 0,
      explanation: 'Usuarios y grupos son roles; un USER es simplemente un ROLE con el atributo LOGIN.'
    },
    {
      id: 'ex2',
      type: 'mcq',
      prompt: '¿Qué comando concede permisos sobre una tabla?',
      options: ['GRANT', 'REVOKE', 'ALLOW', 'PERMIT'],
      correct: 0,
      explanation: 'GRANT concede privilegios; REVOKE los retira. ALLOW y PERMIT no existen en SQL.'
    },
    {
      id: 'ex3',
      type: 'write',
      prompt: 'Escribe el comando que concede permiso de <code>SELECT</code> sobre <code>empleados</code> al rol <code>analista</code>.',
      placeholder: 'GRANT SELECT ON empleados TO analista',
      answers: ['grant select on empleados to analista'],
      explanation: 'GRANT SELECT ON empleados TO analista da al rol permiso de lectura sobre esa tabla.'
    },
    {
      id: 'ex4',
      type: 'mcq',
      prompt: '¿Qué hace REVOKE?',
      options: ['Retira permisos concedidos antes', 'Concede permisos nuevos', 'Crea un rol', 'Elimina una tabla'],
      correct: 0,
      explanation: 'REVOKE es el inverso de GRANT: quita un privilegio que se había otorgado.'
    },
    {
      id: 'ex5',
      type: 'mcq',
      prompt: '¿A quién representa PUBLIC en un GRANT?',
      options: ['A todos los roles de la base', 'Solo al superusuario', 'A nadie', 'Solo al dueño de la tabla'],
      correct: 0,
      explanation: 'PUBLIC es un pseudo-rol que incluye a todos; conceder a PUBLIC abre el permiso a cualquier rol.'
    }
  ];

  window.App = window.App || {};
  window.App.modules = window.App.modules || {};
  window.App.modules['roles-permisos'] = {
    id: 'roles-permisos',
    topicsMeta: TOPICS_META,
    heroHtml: HERO_HTML,
    schemaHtml: SCHEMA_HTML,
    topicsHtml: TOPICS_HTML,
    exercisesMeta: EXERCISES_META
  };

})();
