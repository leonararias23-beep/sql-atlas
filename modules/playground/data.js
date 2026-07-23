/* ============================================================
   DATOS DEL PLAYGROUND
   Exactamente la misma tabla empleados/departamentos usada desde el
   módulo de JOINs en adelante. INITIAL_DATA es el estado original de
   referencia (nunca se muta); App.playgroundData es una copia de
   trabajo que INSERT/UPDATE/DELETE sí modifican in-place, y que
   App.playgroundReset() puede restaurar a partir de INITIAL_DATA.
   App.playgroundSchema fija el orden de columnas de cada tabla de
   forma independiente de las filas actuales, para que el motor SQL
   siga sabiendo qué columnas existen aunque una tabla quede vacía.
   ============================================================ */
window.App = window.App || {};

(function(){
  'use strict';

  var INITIAL_DATA = {
    empleados: [
      { id:1, nombre:'Ana Torres',    cargo:'Ingeniera de Datos', salario:4200000, ciudad:'Bogotá',    fecha_ingreso:'2022-03-15', correo:'ana.torres@empresa.com',    departamento_id:1,    jefe_id:5 },
      { id:2, nombre:'Luis Gómez',    cargo:'Analista',           salario:3100000, ciudad:'Medellín',  fecha_ingreso:'2023-01-10', correo:null,                        departamento_id:2,    jefe_id:5 },
      { id:3, nombre:'Marta Ruiz',    cargo:'Ingeniera de Datos', salario:4500000, ciudad:'Bogotá',    fecha_ingreso:'2021-11-02', correo:'marta.ruiz@empresa.com',    departamento_id:1,    jefe_id:1 },
      { id:4, nombre:'Pedro Sánchez', cargo:'Analista Junior',    salario:2600000, ciudad:'Cali',      fecha_ingreso:'2023-06-20', correo:'pedro.sanchez@empresa.com', departamento_id:2,    jefe_id:2 },
      { id:5, nombre:'Carla Díaz',    cargo:'Gerente',            salario:6800000, ciudad:'Bogotá',    fecha_ingreso:'2019-08-30', correo:'carla.diaz@empresa.com',    departamento_id:null, jefe_id:null },
      { id:6, nombre:'Jorge Peña',    cargo:'Analista',           salario:3100000, ciudad:'Medellín',  fecha_ingreso:'2022-09-01', correo:null,                        departamento_id:2,    jefe_id:5 },
      { id:7, nombre:'Sofía León',    cargo:'Ingeniera de Datos', salario:4200000, ciudad:'Sogamoso',  fecha_ingreso:'2023-02-14', correo:'sofia.leon@empresa.com',    departamento_id:1,    jefe_id:1 }
    ],
    departamentos: [
      { id:1, nombre:'Tecnología',        presupuesto:50000000 },
      { id:2, nombre:'Comercial',         presupuesto:30000000 },
      { id:3, nombre:'Recursos Humanos',  presupuesto:12000000 },
      { id:4, nombre:'Marketing',         presupuesto:18000000 }
    ]
  };

  function cloneRows(rows){
    return rows.map(function(row){
      var copy = {};
      Object.keys(row).forEach(function(k){ copy[k] = row[k]; });
      return copy;
    });
  }

  App.playgroundSchema = {
    empleados: Object.keys(INITIAL_DATA.empleados[0]),
    departamentos: Object.keys(INITIAL_DATA.departamentos[0])
  };

  App.playgroundData = {
    empleados: cloneRows(INITIAL_DATA.empleados),
    departamentos: cloneRows(INITIAL_DATA.departamentos)
  };

  /* Restaura las tablas de trabajo a su estado original, mutando los
     mismos arrays in-place (no los reasigna) para que cualquier vista
     que ya sostenga una referencia a App.playgroundData.<tabla> vea el
     cambio de inmediato. */
  App.playgroundReset = function(){
    Object.keys(INITIAL_DATA).forEach(function(table){
      var target = App.playgroundData[table];
      target.length = 0;
      cloneRows(INITIAL_DATA[table]).forEach(function(row){ target.push(row); });
    });
  };
})();
