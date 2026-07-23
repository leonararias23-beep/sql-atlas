/* ============================================================
   REGISTRO MAESTRO DE MÓDULOS
   Única fuente de verdad para: catálogo del dashboard, roadmap,
   contadores/estadísticas y sidebar de cada módulo. Agregar un
   módulo nuevo cuando esté terminado = agregar un objeto aquí
   (status:'available') + su archivo modules/<id>/content.js con
   la misma forma que fundamentos-sql. Nada más del shell cambia.

   status:
     'available' -> tiene contenido real, aparece con enlace activo
     'planned'   -> forma parte del temario/roadmap, sin contenido
                    todavía; se muestra como referencia, sin enlace
   ============================================================ */
window.App = window.App || {};

/* ============================================================
   CATEGORÍAS (sublenguajes de SQL) — agrupan los módulos en el
   catálogo y el roadmap. El orden aquí define el orden en que se
   muestran las secciones. Una categoría sin módulos disponibles
   simplemente no se dibuja todavía.
   ============================================================ */
App.categories = [
  { id:'dql',  abbr:'DQL',  name:'Consultar datos',        desc:'Leer y consultar información con SELECT y sus cláusulas.' },
  { id:'dml',  abbr:'DML',  name:'Modificar datos',        desc:'Insertar, actualizar y borrar filas de las tablas.' },
  { id:'ddl',  abbr:'DDL',  name:'Definir estructuras',    desc:'Crear y modificar tablas, vistas, índices y demás objetos.' },
  { id:'tcl',  abbr:'TCL',  name:'Controlar transacciones', desc:'Agrupar operaciones con COMMIT, ROLLBACK y savepoints.' },
  { id:'dcl',  abbr:'DCL',  name:'Controlar accesos',      desc:'Gestionar roles y permisos con GRANT y REVOKE.' },
  { id:'prog', abbr:'PROG', name:'Programación en la base de datos', desc:'Lógica dentro del motor: funciones PL/pgSQL y triggers.' }
];

App.registry = [
  {
    id: 'fundamentos-sql',
    category: 'dql',
    num: '01',
    title: 'Fundamentos SQL',
    desc: 'SELECT, FROM, WHERE, ORDER BY, LIMIT y las cláusulas base de toda consulta.',
    level: 'basico',
    icon: 'i-mod-fundamentos',
    accent: 'accent-green',
    pattern: 'pattern-dots',
    search: 'fundamentos sql select from where order by limit',
    status: 'available',
    topicsCount: 12
  },
  {
    id: 'filtrado-de-datos',
    category: 'dql',
    num: '02',
    title: 'Filtrado de datos',
    desc: 'BETWEEN, IN, LIKE/ILIKE e IS NULL para condiciones más expresivas.',
    level: 'basico',
    icon: 'i-mod-filtros',
    accent: 'accent-cyan',
    pattern: 'pattern-lines',
    search: 'filtrado de datos between in like ilike is null',
    status: 'available',
    topicsCount: 6
  },
  {
    id: 'funciones',
    category: 'dql',
    num: '03',
    title: 'Funciones',
    desc: 'Funciones de texto, fecha, numéricas y de conversión más usadas en PostgreSQL.',
    level: 'intermedio',
    icon: 'i-mod-funciones',
    accent: 'accent-purple',
    pattern: 'pattern-rings',
    search: 'funciones texto fecha matematicas',
    status: 'available',
    topicsCount: 10
  },
  {
    id: 'agrupaciones',
    category: 'dql',
    num: '04',
    title: 'Agrupaciones',
    desc: 'GROUP BY, HAVING y funciones de agregación como COUNT, SUM y AVG.',
    level: 'intermedio',
    icon: 'i-mod-agrupaciones',
    accent: 'accent-amber',
    pattern: 'pattern-grid',
    search: 'agrupaciones group by having agregacion',
    status: 'available',
    topicsCount: 6
  },
  {
    id: 'joins',
    category: 'dql',
    num: '05',
    title: 'JOINs',
    desc: 'Combina tablas con INNER, LEFT, RIGHT y FULL JOIN paso a paso.',
    level: 'intermedio',
    icon: 'i-mod-joins',
    accent: 'accent-blue',
    pattern: 'pattern-lines',
    search: 'joins inner left right full',
    status: 'available',
    topicsCount: 7
  },
  {
    id: 'subconsultas',
    category: 'dql',
    num: '06',
    title: 'Subconsultas',
    desc: 'Consultas anidadas dentro de SELECT, WHERE y FROM.',
    level: 'intermedio',
    icon: 'i-mod-subconsultas',
    accent: 'accent-indigo',
    pattern: 'pattern-rings',
    search: 'subconsultas consultas anidadas',
    status: 'available',
    topicsCount: 6
  },
  {
    id: 'operaciones-conjuntos',
    category: 'dql',
    num: '07',
    title: 'Operaciones de conjuntos',
    desc: 'Combinar el resultado de varias consultas con UNION, INTERSECT y EXCEPT.',
    level: 'intermedio',
    icon: 'i-mod-sets',
    accent: 'accent-cyan',
    pattern: 'pattern-rings',
    search: 'operaciones de conjuntos union union all intersect except combinar consultas',
    status: 'available',
    topicsCount: 5
  },
  {
    id: 'ctes',
    category: 'dql',
    num: '08',
    title: 'CTEs (WITH)',
    desc: 'Consultas con nombre usando WITH, encadenadas y recursivas, para mayor legibilidad.',
    level: 'intermedio',
    icon: 'i-mod-cte',
    accent: 'accent-indigo',
    pattern: 'pattern-dots',
    search: 'cte with common table expression consulta con nombre recursiva',
    status: 'available',
    topicsCount: 4
  },
  {
    id: 'funciones-ventana',
    category: 'dql',
    num: '09',
    title: 'Funciones de ventana',
    desc: 'OVER, PARTITION BY, ROW_NUMBER, RANK, totales acumulados y LAG/LEAD.',
    level: 'avanzado',
    icon: 'i-mod-window',
    accent: 'accent-purple',
    pattern: 'pattern-grid',
    search: 'funciones de ventana window over partition by row_number rank dense_rank lag lead acumulado ranking',
    status: 'available',
    topicsCount: 5
  },
  {
    id: 'insertar',
    category: 'dml',
    num: '10',
    title: 'INSERT',
    desc: 'Agregar filas nuevas con VALUES, DEFAULT, INSERT ... SELECT, RETURNING y UPSERT.',
    level: 'basico',
    icon: 'i-mod-insert',
    accent: 'accent-green',
    pattern: 'pattern-dots',
    search: 'insert insertar agregar filas values returning upsert on conflict',
    status: 'available',
    topicsCount: 6
  },
  {
    id: 'actualizar',
    category: 'dml',
    num: '11',
    title: 'UPDATE',
    desc: 'Modificar filas existentes con SET y WHERE, expresiones, subconsultas y RETURNING.',
    level: 'basico',
    icon: 'i-mod-update',
    accent: 'accent-amber',
    pattern: 'pattern-grid',
    search: 'update actualizar modificar set where returning',
    status: 'available',
    topicsCount: 6
  },
  {
    id: 'eliminar',
    category: 'dml',
    num: '12',
    title: 'DELETE',
    desc: 'Eliminar filas con WHERE, subconsultas y RETURNING; DELETE frente a TRUNCATE.',
    level: 'basico',
    icon: 'i-mod-delete',
    accent: 'accent-red',
    pattern: 'pattern-lines',
    search: 'delete eliminar borrar filas where truncate returning',
    status: 'available',
    topicsCount: 5
  },
  {
    id: 'crear-tablas',
    category: 'ddl',
    num: '13',
    title: 'CREATE TABLE y tipos',
    desc: 'Crear tablas y elegir tipos de datos: numéricos, texto, fechas y booleanos, con DEFAULT.',
    level: 'basico',
    icon: 'i-mod-createtable',
    accent: 'accent-blue',
    pattern: 'pattern-grid',
    search: 'create table tipos de datos integer text date boolean default serial',
    status: 'available',
    topicsCount: 5
  },
  {
    id: 'restricciones',
    category: 'ddl',
    num: '14',
    title: 'Restricciones',
    desc: 'NOT NULL, UNIQUE, PRIMARY KEY, FOREIGN KEY y CHECK para proteger la integridad.',
    level: 'intermedio',
    icon: 'i-mod-constraints',
    accent: 'accent-cyan',
    pattern: 'pattern-dots',
    search: 'restricciones constraints not null unique primary key foreign key check integridad',
    status: 'available',
    topicsCount: 6
  },
  {
    id: 'alterar-tablas',
    category: 'ddl',
    num: '15',
    title: 'ALTER / DROP / TRUNCATE',
    desc: 'Modificar la estructura de una tabla, agregar/quitar columnas y restricciones, y eliminarla.',
    level: 'intermedio',
    icon: 'i-mod-alter',
    accent: 'accent-orange',
    pattern: 'pattern-lines',
    search: 'alter table add drop column rename constraint drop table truncate',
    status: 'available',
    topicsCount: 6
  },
  {
    id: 'vistas',
    category: 'ddl',
    num: '16',
    title: 'Vistas',
    desc: 'Vistas simples y su rol en la organización y reutilización de consultas.',
    level: 'intermedio',
    icon: 'i-mod-vistas',
    accent: 'accent-orange',
    pattern: 'pattern-dots',
    search: 'vistas views',
    status: 'available',
    topicsCount: 5
  },
  {
    id: 'materialized-views',
    category: 'ddl',
    num: '17',
    title: 'Materialized Views',
    desc: 'Vistas materializadas, cuándo usarlas y estrategias de actualización.',
    level: 'avanzado',
    icon: 'i-mod-mvistas',
    accent: 'accent-pink',
    pattern: 'pattern-grid',
    search: 'materialized views vistas materializadas',
    status: 'available',
    topicsCount: 4
  },
  {
    id: 'indices',
    category: 'ddl',
    num: '18',
    title: 'Índices',
    desc: 'Tipos de índices en PostgreSQL y su impacto real en el rendimiento.',
    level: 'avanzado',
    icon: 'i-mod-indices',
    accent: 'accent-lime',
    pattern: 'pattern-lines',
    search: 'indices index performance rendimiento',
    status: 'available',
    topicsCount: 6
  },
  {
    id: 'transacciones',
    category: 'tcl',
    num: '19',
    title: 'Transacciones',
    desc: 'BEGIN, COMMIT y ROLLBACK, savepoints y niveles de aislamiento para agrupar operaciones.',
    level: 'intermedio',
    icon: 'i-mod-transaction',
    accent: 'accent-purple',
    pattern: 'pattern-rings',
    search: 'transacciones begin commit rollback savepoint aislamiento acid atomicidad',
    status: 'available',
    topicsCount: 5
  },
  {
    id: 'roles-permisos',
    category: 'dcl',
    num: '20',
    title: 'Roles y permisos',
    desc: 'Crear roles y usuarios y controlar el acceso con GRANT y REVOKE.',
    level: 'avanzado',
    icon: 'i-mod-roles',
    accent: 'accent-pink',
    pattern: 'pattern-grid',
    search: 'roles usuarios permisos grant revoke privilegios dcl acceso seguridad',
    status: 'available',
    topicsCount: 5
  },
  {
    id: 'plpgsql',
    category: 'prog',
    num: '21',
    title: 'Funciones PL/pgSQL',
    desc: 'Procedimientos y funciones almacenadas con lógica propia del motor.',
    level: 'avanzado',
    icon: 'i-mod-plpgsql',
    accent: 'accent-fuchsia',
    pattern: 'pattern-rings',
    search: 'funciones plpgsql procedimientos almacenados',
    status: 'available',
    topicsCount: 8
  },
  {
    id: 'triggers',
    category: 'prog',
    num: '22',
    title: 'Triggers',
    desc: 'Automatización de acciones ante eventos de inserción, actualización y borrado.',
    level: 'avanzado',
    icon: 'i-mod-triggers',
    accent: 'accent-red',
    pattern: 'pattern-grid',
    search: 'triggers eventos automatizacion',
    status: 'available',
    topicsCount: 5
  }
];

/* Helpers de lectura sobre el registro — evitan repetir .filter/.reduce
   en cada vista que necesita agregados. */
App.registryHelpers = {
  available: function(){ return App.registry.filter(function(m){ return m.status === 'available'; }); },
  planned: function(){ return App.registry.filter(function(m){ return m.status === 'planned'; }); },
  byCategory: function(catId){ return App.registry.filter(function(m){ return m.category === catId; }); },
  get: function(id){ return App.registry.find(function(m){ return m.id === id; }); },
  totalTopics: function(){ return App.registry.reduce(function(sum, m){ return sum + m.topicsCount; }, 0); },

  /* Módulo previo dentro de la ruta de aprendizaje (solo cuenta contra
     otros módulos 'available'; uno 'planned' no bloquea nada porque
     todavía no tiene contenido). Devuelve null si es el primero. */
  lockRequirement: function(id){
    var available = App.registryHelpers.available();
    var idx = -1;
    for (var i = 0; i < available.length; i++){ if (available[i].id === id){ idx = i; break; } }
    if (idx <= 0) return null;
    return available[idx - 1];
  },

  /* Bloqueo progresivo suave: un módulo se considera desbloqueado si
     es el primero, si el módulo anterior está 100% completado, o si
     el propio módulo ya tiene avance guardado (para no "re-bloquear"
     algo que el usuario ya empezó al añadir un módulo nuevo en medio
     de la ruta). Es una guía de la ruta recomendada, no una barrera
     técnica: la vista de módulo sigue siendo accesible por URL directa. */
  isUnlocked: function(id){
    var prev = App.registryHelpers.lockRequirement(id);
    if (!prev) return true;
    var prevPct = App.progress ? App.progress.moduleCompletion(prev.id).pct : 100;
    if (prevPct >= 100) return true;
    var ownProgress = App.state ? App.state.getCompletedTopics(id).length : 0;
    return ownProgress > 0;
  }
};
