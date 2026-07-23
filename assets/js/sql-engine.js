/* ============================================================
   MOTOR SQL DEL PLAYGROUND
   Intérprete propio en JavaScript para un subconjunto de SQL: no es
   PostgreSQL, es un motor educativo que entiende lo que se enseña en
   el curso (SELECT, WHERE, JOIN, GROUP BY, HAVING, ORDER BY, LIMIT,
   DISTINCT, INSERT, UPDATE, DELETE y un puñado de funciones). Estructura
   clásica de tres etapas: tokenizador -> parser recursivo descendente ->
   ejecutor contra los datos en memoria de App.playgroundData. INSERT/
   UPDATE/DELETE mutan esos arrays in-place para que App.playgroundReset()
   pueda restaurarlos a su estado original.

   App.sqlEngine.run(sql, tables) devuelve { columns, rows } o lanza
   un SqlError con un mensaje pensado para mostrarse tal cual al
   usuario.
   ============================================================ */
window.App = window.App || {};

App.sqlEngine = (function(){
  'use strict';

  function SqlError(message){ this.message = message; this.name = 'SqlError'; }
  SqlError.prototype = Object.create(Error.prototype);

  var KEYWORDS = {};
  ['SELECT','DISTINCT','FROM','WHERE','AND','OR','NOT','BETWEEN','IN','LIKE','ILIKE',
   'IS','NULL','JOIN','INNER','LEFT','RIGHT','OUTER','ON','AS','GROUP','BY','HAVING',
   'ORDER','ASC','DESC','LIMIT',
   'INSERT','INTO','VALUES','UPDATE','SET','DELETE','DEFAULT'].forEach(function(k){ KEYWORDS[k] = true; });

  var AGGREGATE_FUNCS = { COUNT:1, SUM:1, AVG:1, MIN:1, MAX:1 };

  /* ---------------------------------------------------------- TOKENIZER */
  function tokenize(sql){
    var tokens = [];
    var i = 0, n = sql.length;

    function isDigit(c){ return c >= '0' && c <= '9'; }
    function isIdentStart(c){ return /[A-Za-z_]/.test(c); }
    function isIdentPart(c){ return /[A-Za-z0-9_]/.test(c); }

    while (i < n){
      var c = sql.charAt(i);

      if (c === ' ' || c === '\t' || c === '\n' || c === '\r'){ i++; continue; }

      if (c === '-' && sql.charAt(i+1) === '-'){
        while (i < n && sql.charAt(i) !== '\n') i++;
        continue;
      }

      if (c === "'"){
        var j = i + 1, str = '';
        while (j < n){
          if (sql.charAt(j) === "'" && sql.charAt(j+1) === "'"){ str += "'"; j += 2; continue; }
          if (sql.charAt(j) === "'") break;
          str += sql.charAt(j); j++;
        }
        if (j >= n) throw new SqlError('Falta cerrar una comilla simple en el texto.');
        tokens.push({ type:'STRING', value: str });
        i = j + 1;
        continue;
      }

      if (isDigit(c) || (c === '.' && isDigit(sql.charAt(i+1)))){
        var j2 = i;
        while (j2 < n && isDigit(sql.charAt(j2))) j2++;
        if (sql.charAt(j2) === '.'){ j2++; while (j2 < n && isDigit(sql.charAt(j2))) j2++; }
        tokens.push({ type:'NUMBER', value: parseFloat(sql.slice(i, j2)) });
        i = j2;
        continue;
      }

      if (isIdentStart(c)){
        var j3 = i;
        while (j3 < n && isIdentPart(sql.charAt(j3))) j3++;
        tokens.push({ type:'IDENT', value: sql.slice(i, j3).toLowerCase() });
        i = j3;
        continue;
      }

      var two = sql.slice(i, i+2);
      if (two === '<=' || two === '>=' || two === '<>' || two === '!=' || two === '||'){
        tokens.push({ type:'OP', value: (two === '!=') ? '<>' : two });
        i += 2;
        continue;
      }

      if (',.();'.indexOf(c) !== -1){
        var typeMap = { ',':'COMMA', '.':'DOT', '(':'LPAREN', ')':'RPAREN', ';':'SEMI' };
        tokens.push({ type: typeMap[c], value: c });
        i++;
        continue;
      }
      if ('=<>+-*/'.indexOf(c) !== -1){
        tokens.push({ type:'OP', value: c });
        i++;
        continue;
      }

      throw new SqlError('Carácter no reconocido: "' + c + '".');
    }

    tokens.push({ type:'EOF', value:null });
    return tokens;
  }

  /* ------------------------------------------------------------ PARSER */
  function Parser(tokens){
    this.tokens = tokens;
    this.pos = 0;
  }
  Parser.prototype.peek = function(offset){ return this.tokens[this.pos + (offset || 0)]; };
  Parser.prototype.next = function(){ return this.tokens[this.pos++]; };
  Parser.prototype.isKeyword = function(tok, kw){ return tok.type === 'IDENT' && tok.value.toUpperCase() === kw; };
  Parser.prototype.acceptKeyword = function(kw){
    if (this.isKeyword(this.peek(), kw)) return this.next();
    return null;
  };
  Parser.prototype.expectKeyword = function(kw){
    var tok = this.next();
    if (!this.isKeyword(tok, kw)) throw new SqlError('Se esperaba "' + kw + '" y se encontró "' + this.describe(tok) + '".');
    return tok;
  };
  Parser.prototype.expectType = function(type){
    var tok = this.next();
    if (tok.type !== type) throw new SqlError('Se esperaba ' + type.toLowerCase() + ' y se encontró "' + this.describe(tok) + '".');
    return tok;
  };
  Parser.prototype.expectOp = function(op){
    var tok = this.next();
    if (!(tok.type === 'OP' && tok.value === op)) throw new SqlError('Se esperaba "' + op + '" y se encontró "' + this.describe(tok) + '".');
    return tok;
  };
  Parser.prototype.describe = function(tok){
    if (tok.type === 'EOF') return 'el final de la consulta';
    return String(tok.value);
  };

  Parser.prototype.parseSelectStatement = function(){
    this.expectKeyword('SELECT');
    var distinct = !!this.acceptKeyword('DISTINCT');
    var columns = this.parseSelectList();
    this.expectKeyword('FROM');
    var from = this.parseTableRef();

    var joins = [];
    while (true){
      var joinType = null;
      if (this.acceptKeyword('JOIN')){ joinType = 'inner'; }
      else if (this.isKeyword(this.peek(), 'INNER')){ this.next(); this.expectKeyword('JOIN'); joinType = 'inner'; }
      else if (this.isKeyword(this.peek(), 'LEFT')){ this.next(); this.acceptKeyword('OUTER'); this.expectKeyword('JOIN'); joinType = 'left'; }
      else if (this.isKeyword(this.peek(), 'RIGHT')){ this.next(); this.acceptKeyword('OUTER'); this.expectKeyword('JOIN'); joinType = 'right'; }
      else break;
      var table = this.parseTableRef();
      this.expectKeyword('ON');
      var on = this.parseExpr();
      joins.push({ type: joinType, table: table.name, alias: table.alias, on: on });
    }

    var where = null;
    if (this.acceptKeyword('WHERE')) where = this.parseExpr();

    var groupBy = [];
    if (this.acceptKeyword('GROUP')){ this.expectKeyword('BY'); groupBy = this.parseExprList(); }

    var having = null;
    if (this.acceptKeyword('HAVING')) having = this.parseExpr();

    var orderBy = [];
    if (this.acceptKeyword('ORDER')){
      this.expectKeyword('BY');
      orderBy = this.parseOrderByList();
    }

    var limit = null;
    if (this.acceptKeyword('LIMIT')) limit = this.expectType('NUMBER').value;

    if (this.peek().type === 'SEMI') this.next();
    if (this.peek().type !== 'EOF') throw new SqlError('Sobra texto después de la consulta, cerca de "' + this.describe(this.peek()) + '".');

    return {
      type: 'select', distinct: distinct, columns: columns, from: from, joins: joins,
      where: where, groupBy: groupBy, having: having, orderBy: orderBy, limit: limit
    };
  };

  Parser.prototype.parseInsertStatement = function(){
    this.expectKeyword('INSERT');
    this.expectKeyword('INTO');
    var table = this.expectType('IDENT').value;

    var columns = null;
    if (this.peek().type === 'LPAREN'){
      this.next();
      columns = [];
      if (this.peek().type !== 'RPAREN'){
        while (true){
          columns.push(this.expectType('IDENT').value);
          if (this.peek().type === 'COMMA'){ this.next(); continue; }
          break;
        }
      }
      this.expectType('RPAREN');
    }

    this.expectKeyword('VALUES');
    var valueRows = [];
    while (true){
      this.expectType('LPAREN');
      var vals = [];
      if (this.peek().type !== 'RPAREN'){
        while (true){
          if (this.acceptKeyword('DEFAULT')){ vals.push({ type:'default' }); }
          else { vals.push(this.parseExpr()); }
          if (this.peek().type === 'COMMA'){ this.next(); continue; }
          break;
        }
      }
      this.expectType('RPAREN');
      valueRows.push(vals);
      if (this.peek().type === 'COMMA'){ this.next(); continue; }
      break;
    }

    if (this.peek().type === 'SEMI') this.next();
    if (this.peek().type !== 'EOF') throw new SqlError('Sobra texto después de la consulta, cerca de "' + this.describe(this.peek()) + '".');

    return { type:'insert', table: table, columns: columns, valueRows: valueRows };
  };

  Parser.prototype.parseUpdateStatement = function(){
    this.expectKeyword('UPDATE');
    var table = this.expectType('IDENT').value;
    this.expectKeyword('SET');

    var assignments = [];
    while (true){
      var col = this.expectType('IDENT').value;
      this.expectOp('=');
      var expr = this.parseExpr();
      assignments.push({ column: col, expr: expr });
      if (this.peek().type === 'COMMA'){ this.next(); continue; }
      break;
    }

    var where = null;
    if (this.acceptKeyword('WHERE')) where = this.parseExpr();

    if (this.peek().type === 'SEMI') this.next();
    if (this.peek().type !== 'EOF') throw new SqlError('Sobra texto después de la consulta, cerca de "' + this.describe(this.peek()) + '".');

    return { type:'update', table: table, assignments: assignments, where: where };
  };

  Parser.prototype.parseDeleteStatement = function(){
    this.expectKeyword('DELETE');
    this.expectKeyword('FROM');
    var table = this.expectType('IDENT').value;

    var where = null;
    if (this.acceptKeyword('WHERE')) where = this.parseExpr();

    if (this.peek().type === 'SEMI') this.next();
    if (this.peek().type !== 'EOF') throw new SqlError('Sobra texto después de la consulta, cerca de "' + this.describe(this.peek()) + '".');

    return { type:'delete', table: table, where: where };
  };

  Parser.prototype.parseTableRef = function(){
    var name = this.expectType('IDENT').value;
    var alias = null;
    this.acceptKeyword('AS');
    var next = this.peek();
    if (next.type === 'IDENT' && !KEYWORDS[next.value.toUpperCase()]) alias = this.next().value;
    return { name: name, alias: alias };
  };

  Parser.prototype.parseSelectList = function(){
    if (this.peek().type === 'OP' && this.peek().value === '*'){
      this.next();
      return [{ expr: { type:'star' }, alias: null }];
    }
    var items = [];
    while (true){
      var expr = this.parseExpr();
      var alias = null;
      if (this.acceptKeyword('AS')){
        alias = this.expectType('IDENT').value;
      } else if (this.peek().type === 'IDENT' && !KEYWORDS[this.peek().value.toUpperCase()]){
        alias = this.next().value;
      }
      items.push({ expr: expr, alias: alias });
      if (this.peek().type === 'COMMA'){ this.next(); continue; }
      break;
    }
    return items;
  };

  Parser.prototype.parseExprList = function(){
    var items = [this.parseExpr()];
    while (this.peek().type === 'COMMA'){ this.next(); items.push(this.parseExpr()); }
    return items;
  };

  Parser.prototype.parseOrderByList = function(){
    var items = [];
    while (true){
      var expr = this.parseExpr();
      var dir = 'asc';
      if (this.acceptKeyword('ASC')) dir = 'asc';
      else if (this.acceptKeyword('DESC')) dir = 'desc';
      items.push({ expr: expr, dir: dir });
      if (this.peek().type === 'COMMA'){ this.next(); continue; }
      break;
    }
    return items;
  };

  Parser.prototype.parseInList = function(){
    this.expectType('LPAREN');
    var items = [];
    if (this.peek().type !== 'RPAREN'){
      items = this.parseExprList();
    }
    this.expectType('RPAREN');
    return items;
  };

  /* expr := or ; or := and (OR and)* ; and := not (AND not)* ; not := NOT? comparison */
  Parser.prototype.parseExpr = function(){ return this.parseOr(); };

  Parser.prototype.parseOr = function(){
    var left = this.parseAnd();
    while (this.acceptKeyword('OR')) left = { type:'or', left:left, right:this.parseAnd() };
    return left;
  };
  Parser.prototype.parseAnd = function(){
    var left = this.parseNot();
    while (this.acceptKeyword('AND')) left = { type:'and', left:left, right:this.parseNot() };
    return left;
  };
  Parser.prototype.parseNot = function(){
    if (this.acceptKeyword('NOT')) return { type:'not', expr:this.parseNot() };
    return this.parseComparison();
  };

  Parser.prototype.parseComparison = function(){
    var left = this.parseAdditive();
    var tok = this.peek();

    if (this.isKeyword(tok, 'BETWEEN')){
      this.next();
      var low = this.parseAdditive();
      this.expectKeyword('AND');
      var high = this.parseAdditive();
      return { type:'between', expr:left, low:low, high:high, negate:false };
    }

    if (this.isKeyword(tok, 'NOT')){
      var save = this.pos;
      this.next();
      if (this.isKeyword(this.peek(), 'BETWEEN')){
        this.next();
        var low2 = this.parseAdditive();
        this.expectKeyword('AND');
        var high2 = this.parseAdditive();
        return { type:'between', expr:left, low:low2, high:high2, negate:true };
      }
      if (this.isKeyword(this.peek(), 'IN')){
        this.next();
        return { type:'in', expr:left, list:this.parseInList(), negate:true };
      }
      if (this.isKeyword(this.peek(), 'LIKE') || this.isKeyword(this.peek(), 'ILIKE')){
        var ci1 = this.isKeyword(this.peek(), 'ILIKE');
        this.next();
        return { type:'like', expr:left, pattern:this.parseAdditive(), ci:ci1, negate:true };
      }
      this.pos = save;
    }

    if (this.isKeyword(tok, 'IN')){
      this.next();
      return { type:'in', expr:left, list:this.parseInList(), negate:false };
    }
    if (this.isKeyword(tok, 'LIKE') || this.isKeyword(tok, 'ILIKE')){
      var ci2 = this.isKeyword(tok, 'ILIKE');
      this.next();
      return { type:'like', expr:left, pattern:this.parseAdditive(), ci:ci2, negate:false };
    }
    if (this.isKeyword(tok, 'IS')){
      this.next();
      var negate = !!this.acceptKeyword('NOT');
      this.expectKeyword('NULL');
      return { type:'isnull', expr:left, negate:negate };
    }
    if (tok.type === 'OP' && (tok.value === '=' || tok.value === '<>' || tok.value === '<' || tok.value === '>' || tok.value === '<=' || tok.value === '>=')){
      this.next();
      return { type:'compare', op:tok.value, left:left, right:this.parseAdditive() };
    }
    return left;
  };

  Parser.prototype.parseAdditive = function(){
    var left = this.parseMultiplicative();
    while (this.peek().type === 'OP' && (this.peek().value === '+' || this.peek().value === '-' || this.peek().value === '||')){
      var op = this.next().value;
      left = { type:'binop', op:op, left:left, right:this.parseMultiplicative() };
    }
    return left;
  };
  Parser.prototype.parseMultiplicative = function(){
    var left = this.parseUnary();
    while (this.peek().type === 'OP' && (this.peek().value === '*' || this.peek().value === '/')){
      var op = this.next().value;
      left = { type:'binop', op:op, left:left, right:this.parseUnary() };
    }
    return left;
  };
  Parser.prototype.parseUnary = function(){
    if (this.peek().type === 'OP' && this.peek().value === '-'){
      this.next();
      return { type:'neg', expr:this.parseUnary() };
    }
    return this.parsePrimary();
  };
  Parser.prototype.parsePrimary = function(){
    var tok = this.peek();

    if (tok.type === 'NUMBER'){ this.next(); return { type:'literal', value: tok.value }; }
    if (tok.type === 'STRING'){ this.next(); return { type:'literal', value: tok.value }; }
    if (this.isKeyword(tok, 'NULL')){ this.next(); return { type:'literal', value: null }; }

    if (tok.type === 'LPAREN'){
      this.next();
      var inner = this.parseExpr();
      this.expectType('RPAREN');
      return inner;
    }

    if (tok.type === 'IDENT'){
      this.next();
      if (this.peek().type === 'LPAREN'){
        this.next();
        var name = tok.value.toUpperCase();
        var args = [];
        if (this.peek().type === 'OP' && this.peek().value === '*'){
          this.next();
          args = [{ type:'star' }];
        } else if (this.peek().type !== 'RPAREN'){
          args = this.parseExprList();
        }
        this.expectType('RPAREN');
        return { type:'func', name:name, args:args };
      }
      if (this.peek().type === 'DOT'){
        this.next();
        var col = this.expectType('IDENT').value;
        return { type:'column', table: tok.value, name: col };
      }
      return { type:'column', table: null, name: tok.value };
    }

    throw new SqlError('No se esperaba "' + this.describe(tok) + '" en esta posición.');
  };

  /* --------------------------------------------------------- EJECUTOR */
  function truthy(v){
    if (v === true) return true;
    if (v === false || v === null || v === undefined) return false;
    return !!v;
  }

  function exprToKey(node){
    switch (node.type){
      case 'star': return '*';
      case 'literal': return JSON.stringify(node.value);
      case 'column': return (node.table ? node.table + '.' : '') + node.name;
      case 'func': return node.name + '(' + node.args.map(exprToKey).join(',') + ')';
      case 'binop': return '(' + exprToKey(node.left) + node.op + exprToKey(node.right) + ')';
      case 'neg': return '-' + exprToKey(node.expr);
      default: return JSON.stringify(node);
    }
  }

  function collectAggregates(node, out){
    if (!node || typeof node !== 'object') return;
    if (node.type === 'func' && AGGREGATE_FUNCS[node.name]){
      var key = exprToKey(node);
      if (!out.some(function(a){ return a.key === key; })) out.push({ key:key, node:node });
      return;
    }
    Object.keys(node).forEach(function(k){
      var v = node[k];
      if (v && typeof v === 'object'){
        if (Array.isArray(v)) v.forEach(function(item){ collectAggregates(item, out); });
        else collectAggregates(v, out);
      }
    });
  }

  function resolveTableSchema(tables, name, schemas){
    var rows = tables[name];
    if (!rows) throw new SqlError('No existe la tabla "' + name + '". Tablas disponibles: ' + Object.keys(tables).join(', ') + '.');
    if (schemas && schemas[name]) return schemas[name];
    return rows.length ? Object.keys(rows[0]) : [];
  }

  function rowContextGet(ctx, table, name, tables){
    if (table){
      var entry = null;
      for (var i = 0; i < ctx.entries.length; i++){
        var e = ctx.entries[i];
        if (e.name === table || e.alias === table){ entry = e; break; }
      }
      if (!entry) throw new SqlError('No existe la tabla o alias "' + table + '" en esta consulta.');
      if (!entry.row) return null;
      if (!(name in entry.row)) throw new SqlError('La columna "' + name + '" no existe en "' + table + '".');
      return entry.row[name];
    }
    for (var j = 0; j < ctx.entries.length; j++){
      var e2 = ctx.entries[j];
      var schemaRow = tables[e2.name] && tables[e2.name][0];
      if (schemaRow && (name in schemaRow)) return e2.row ? e2.row[name] : null;
    }
    throw new SqlError('La columna "' + name + '" no existe en ninguna tabla de la consulta.');
  }

  function likeToRegExp(pattern, ci){
    var escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    escaped = escaped.replace(/%/g, '.*').replace(/_/g, '.');
    return new RegExp('^' + escaped + '$', ci ? 'i' : '');
  }

  function evalExpr(node, ctx, tables, groupInfo){
    switch (node.type){
      case 'literal': return node.value;
      case 'column': return rowContextGet(ctx, node.table, node.name, tables);
      case 'neg': { var v = evalExpr(node.expr, ctx, tables, groupInfo); return v == null ? null : -v; }
      case 'binop': {
        var l = evalExpr(node.left, ctx, tables, groupInfo);
        var r = evalExpr(node.right, ctx, tables, groupInfo);
        if (node.op === '||') return (l == null || r == null) ? null : String(l) + String(r);
        if (l == null || r == null) return null;
        if (node.op === '+') return l + r;
        if (node.op === '-') return l - r;
        if (node.op === '*') return l * r;
        if (node.op === '/'){ if (r === 0) throw new SqlError('División por cero.'); return l / r; }
        return null;
      }
      case 'func': return evalFunc(node, ctx, tables, groupInfo);
      case 'and': return truthy(evalExpr(node.left, ctx, tables, groupInfo)) && truthy(evalExpr(node.right, ctx, tables, groupInfo));
      case 'or': return truthy(evalExpr(node.left, ctx, tables, groupInfo)) || truthy(evalExpr(node.right, ctx, tables, groupInfo));
      case 'not': return !truthy(evalExpr(node.expr, ctx, tables, groupInfo));
      case 'compare': {
        var lv = evalExpr(node.left, ctx, tables, groupInfo);
        var rv = evalExpr(node.right, ctx, tables, groupInfo);
        if (lv === null || rv === null) return false;
        switch (node.op){
          case '=': return lv === rv;
          case '<>': return lv !== rv;
          case '<': return lv < rv;
          case '>': return lv > rv;
          case '<=': return lv <= rv;
          case '>=': return lv >= rv;
          default: return false;
        }
      }
      case 'between': {
        var bv = evalExpr(node.expr, ctx, tables, groupInfo);
        if (bv == null) return false;
        var lo = evalExpr(node.low, ctx, tables, groupInfo);
        var hi = evalExpr(node.high, ctx, tables, groupInfo);
        var res = (bv >= lo && bv <= hi);
        return node.negate ? !res : res;
      }
      case 'in': {
        var iv = evalExpr(node.expr, ctx, tables, groupInfo);
        if (iv == null) return false;
        var found = node.list.some(function(item){ return evalExpr(item, ctx, tables, groupInfo) === iv; });
        return node.negate ? !found : found;
      }
      case 'like': {
        var sv = evalExpr(node.expr, ctx, tables, groupInfo);
        var pat = evalExpr(node.pattern, ctx, tables, groupInfo);
        if (sv == null || pat == null) return false;
        var matched = likeToRegExp(String(pat), node.ci).test(String(sv));
        return node.negate ? !matched : matched;
      }
      case 'isnull': {
        var nv = evalExpr(node.expr, ctx, tables, groupInfo);
        var isN = (nv === null || nv === undefined);
        return node.negate ? !isN : isN;
      }
      default: throw new SqlError('Expresión no soportada por este motor.');
    }
  }

  function evalFunc(node, ctx, tables, groupInfo){
    if (AGGREGATE_FUNCS[node.name]){
      if (!groupInfo) throw new SqlError(node.name + '() es una función de agregación: solo puede usarse en SELECT, HAVING u ORDER BY, y normalmente junto a GROUP BY.');
      var key = exprToKey(node);
      if (!(key in groupInfo.values)) throw new SqlError('No se pudo calcular ' + node.name + '().');
      return groupInfo.values[key];
    }
    var args = node.args.map(function(a){ return a.type === 'star' ? null : evalExpr(a, ctx, tables, groupInfo); });
    switch (node.name){
      case 'UPPER': return args[0] == null ? null : String(args[0]).toUpperCase();
      case 'LOWER': return args[0] == null ? null : String(args[0]).toLowerCase();
      case 'LENGTH': return args[0] == null ? null : String(args[0]).length;
      case 'TRIM': return args[0] == null ? null : String(args[0]).trim();
      case 'ROUND': {
        if (args[0] == null) return null;
        var decimals = args.length > 1 && args[1] != null ? args[1] : 0;
        var f = Math.pow(10, decimals);
        return Math.round(args[0] * f) / f;
      }
      case 'CEIL': case 'CEILING': return args[0] == null ? null : Math.ceil(args[0]);
      case 'FLOOR': return args[0] == null ? null : Math.floor(args[0]);
      case 'ABS': return args[0] == null ? null : Math.abs(args[0]);
      case 'CONCAT': return args.map(function(a){ return a == null ? '' : String(a); }).join('');
      case 'COALESCE': { for (var i = 0; i < args.length; i++){ if (args[i] != null) return args[i]; } return null; }
      default: throw new SqlError('La función ' + node.name + '() no está disponible en este playground.');
    }
  }

  function isGroupedExpr(expr, groupByExprs){
    var key = exprToKey(expr);
    return groupByExprs.some(function(g){ return exprToKey(g) === key; });
  }

  function groupContexts(contexts, groupByExprs, tables){
    if (!groupByExprs.length) return [{ rows: contexts, sample: contexts.length ? contexts[0] : null }];
    var map = {}, order = [];
    contexts.forEach(function(ctx){
      var key = groupByExprs.map(function(expr){
        var v = evalExpr(expr, ctx, tables, null);
        return v === null ? 'null' : String(v);
      }).join('');
      if (!map[key]){ map[key] = { rows: [], sample: ctx }; order.push(key); }
      map[key].rows.push(ctx);
    });
    return order.map(function(k){ return map[k]; });
  }

  function computeAggregate(node, rows, tables){
    if (node.name === 'COUNT'){
      if (node.args.length && node.args[0].type === 'star') return rows.length;
      return rows.filter(function(ctx){ return evalExpr(node.args[0], ctx, tables, null) != null; }).length;
    }
    var nums = rows.map(function(ctx){ return evalExpr(node.args[0], ctx, tables, null); }).filter(function(v){ return v != null; });
    if (!nums.length) return null;
    if (node.name === 'SUM') return nums.reduce(function(a, b){ return a + b; }, 0);
    if (node.name === 'AVG') return nums.reduce(function(a, b){ return a + b; }, 0) / nums.length;
    if (node.name === 'MIN') return nums.reduce(function(a, b){ return a < b ? a : b; });
    if (node.name === 'MAX') return nums.reduce(function(a, b){ return a > b ? a : b; });
    return null;
  }

  function resolveOrderExpr(expr, selectColumns){
    if (expr.type === 'column' && !expr.table){
      var match = selectColumns.filter(function(c){ return c.alias === expr.name; })[0];
      if (match) return match.expr;
    }
    return expr;
  }

  function compareValues(a, b){
    if (a == null && b == null) return 0;
    if (a == null) return 1;
    if (b == null) return -1;
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  }

  function defaultColumnLabel(expr, idx){
    if (expr.type === 'column') return expr.name;
    if (expr.type === 'func') return expr.name.toLowerCase();
    return 'columna' + (idx + 1);
  }

  function execute(ast, tables, schemas){
    var fromRows = tables[ast.from.name];
    if (!fromRows) throw new SqlError('No existe la tabla "' + ast.from.name + '". Tablas disponibles: ' + Object.keys(tables).join(', ') + '.');
    var fromAlias = ast.from.alias || ast.from.name;

    var contexts = fromRows.map(function(row){
      return { entries: [{ name: ast.from.name, alias: fromAlias, row: row }] };
    });

    ast.joins.forEach(function(join){
      var joinRows = tables[join.table];
      if (!joinRows) throw new SqlError('No existe la tabla "' + join.table + '".');
      var joinAlias = join.alias || join.table;
      var next = [];

      contexts.forEach(function(ctx){
        var matched = false;
        joinRows.forEach(function(row){
          var candidate = { entries: ctx.entries.concat([{ name: join.table, alias: joinAlias, row: row }]) };
          if (truthy(evalExpr(join.on, candidate, tables, null))){
            matched = true;
            next.push(candidate);
          }
        });
        if (!matched && join.type === 'left'){
          next.push({ entries: ctx.entries.concat([{ name: join.table, alias: joinAlias, row: null }]) });
        }
      });

      if (join.type === 'right'){
        joinRows.forEach(function(row){
          var hasMatch = contexts.some(function(ctx){
            var candidate = { entries: ctx.entries.concat([{ name: join.table, alias: joinAlias, row: row }]) };
            return truthy(evalExpr(join.on, candidate, tables, null));
          });
          if (!hasMatch){
            var emptyLeft = contexts.length ? contexts[0].entries.map(function(e){ return { name:e.name, alias:e.alias, row:null }; }) : [];
            next.push({ entries: emptyLeft.concat([{ name: join.table, alias: joinAlias, row: row }]) });
          }
        });
      }

      contexts = next;
    });

    if (ast.where){
      contexts = contexts.filter(function(ctx){ return truthy(evalExpr(ast.where, ctx, tables, null)); });
    }

    var aggNodes = [];
    ast.columns.forEach(function(col){ if (col.expr.type !== 'star') collectAggregates(col.expr, aggNodes); });
    if (ast.having) collectAggregates(ast.having, aggNodes);
    ast.orderBy.forEach(function(ob){ collectAggregates(resolveOrderExpr(ob.expr, ast.columns), aggNodes); });

    var isAggregateQuery = ast.groupBy.length > 0 || aggNodes.length > 0;
    var resultItems;

    if (isAggregateQuery){
      ast.columns.forEach(function(col){
        if (col.expr.type === 'star') throw new SqlError('No se puede usar SELECT * junto con GROUP BY o funciones de agregación.');
        var hasAgg = [];
        collectAggregates(col.expr, hasAgg);
        if (!hasAgg.length && !isGroupedExpr(col.expr, ast.groupBy)){
          throw new SqlError('La columna "' + exprToKey(col.expr) + '" debe aparecer en GROUP BY o dentro de una función de agregación.');
        }
      });
      var groups = groupContexts(contexts, ast.groupBy, tables);
      resultItems = groups.map(function(g){
        var values = {};
        aggNodes.forEach(function(a){ values[a.key] = computeAggregate(a.node, g.rows, tables); });
        return { sample: g.sample, values: values };
      });
      if (ast.having){
        resultItems = resultItems.filter(function(item){ return item.sample && truthy(evalExpr(ast.having, item.sample, tables, item)); });
      }
    } else {
      resultItems = contexts.map(function(ctx){ return { sample: ctx, values: {} }; });
    }

    if (ast.orderBy.length){
      resultItems = resultItems.slice().sort(function(a, b){
        for (var i = 0; i < ast.orderBy.length; i++){
          var ob = ast.orderBy[i];
          var realExpr = resolveOrderExpr(ob.expr, ast.columns);
          var av = evalExpr(realExpr, a.sample, tables, a);
          var bv = evalExpr(realExpr, b.sample, tables, b);
          var cmp = compareValues(av, bv);
          if (cmp !== 0) return ob.dir === 'desc' ? -cmp : cmp;
        }
        return 0;
      });
    }

    var outputColumns = [];
    if (ast.columns.length === 1 && ast.columns[0].expr.type === 'star'){
      var sampleCtx = resultItems.length ? resultItems[0].sample : null;
      if (sampleCtx){
        sampleCtx.entries.forEach(function(entry){
          resolveTableSchema(tables, entry.name, schemas).forEach(function(colName){
            outputColumns.push({
              label: colName,
              getter: (function(alias, name){
                return function(item){ return item.sample ? rowContextGet(item.sample, alias, name, tables) : null; };
              })(entry.alias, colName)
            });
          });
        });
      }
    } else {
      ast.columns.forEach(function(col, idx){
        var label = col.alias || defaultColumnLabel(col.expr, idx);
        outputColumns.push({
          label: label,
          getter: (function(expr){ return function(item){ return evalExpr(expr, item.sample, tables, item); }; })(col.expr)
        });
      });
    }

    var projected = resultItems.map(function(item){
      var row = {};
      outputColumns.forEach(function(oc){ row[oc.label] = oc.getter(item); });
      return row;
    });

    if (ast.distinct){
      var seen = {}, deduped = [];
      projected.forEach(function(row){
        var key = outputColumns.map(function(oc){ return String(row[oc.label]); }).join('');
        if (!seen[key]){ seen[key] = true; deduped.push(row); }
      });
      projected = deduped;
    }

    if (ast.limit != null) projected = projected.slice(0, Math.max(0, Math.floor(ast.limit)));

    return { columns: outputColumns.map(function(oc){ return oc.label; }), rows: projected };
  }

  /* ------------------------------------------------- INSERT/UPDATE/DELETE
     Mutan las filas de `tables` en el mismo array (in-place), para que la
     referencia que sostiene App.playgroundData siga siendo válida entre
     ejecuciones sucesivas del playground. */
  function defaultForColumn(col, rows){
    if (col === 'id'){
      var maxId = rows.reduce(function(m, r){ return Math.max(m, (typeof r.id === 'number') ? r.id : 0); }, 0);
      return maxId + 1;
    }
    return null;
  }

  function executeInsert(ast, tables, schemas){
    var rows = tables[ast.table];
    if (!rows) throw new SqlError('No existe la tabla "' + ast.table + '". Tablas disponibles: ' + Object.keys(tables).join(', ') + '.');
    var schemaCols = (schemas && schemas[ast.table]) || (rows.length ? Object.keys(rows[0]) : null);
    if (!schemaCols) throw new SqlError('No se puede insertar en "' + ast.table + '" sin indicar las columnas explícitamente porque la tabla está vacía.');

    var targetCols = ast.columns || schemaCols;
    targetCols.forEach(function(c){
      if (schemaCols.indexOf(c) === -1) throw new SqlError('La columna "' + c + '" no existe en "' + ast.table + '".');
    });

    var inserted = [];
    ast.valueRows.forEach(function(vals){
      if (vals.length !== targetCols.length){
        throw new SqlError('INSERT: se esperaban ' + targetCols.length + ' valores y se encontraron ' + vals.length + '.');
      }
      var newRow = {};
      schemaCols.forEach(function(c){ newRow[c] = null; });
      targetCols.forEach(function(c, i){
        var valNode = vals[i];
        newRow[c] = (valNode.type === 'default') ? defaultForColumn(c, rows) : evalExpr(valNode, { entries: [] }, tables, null);
      });
      if (schemaCols.indexOf('id') !== -1 && targetCols.indexOf('id') === -1){
        newRow.id = defaultForColumn('id', rows);
      }
      rows.push(newRow);
      inserted.push(newRow);
    });

    return {
      columns: schemaCols,
      rows: inserted,
      message: inserted.length + (inserted.length === 1 ? ' fila insertada.' : ' filas insertadas.')
    };
  }

  function executeUpdate(ast, tables, schemas){
    var rows = tables[ast.table];
    if (!rows) throw new SqlError('No existe la tabla "' + ast.table + '". Tablas disponibles: ' + Object.keys(tables).join(', ') + '.');
    var schemaCols = (schemas && schemas[ast.table]) || (rows.length ? Object.keys(rows[0]) : []);
    ast.assignments.forEach(function(a){
      if (schemaCols.indexOf(a.column) === -1) throw new SqlError('La columna "' + a.column + '" no existe en "' + ast.table + '".');
    });

    var updated = [];
    rows.forEach(function(row){
      var ctx = { entries: [{ name: ast.table, alias: ast.table, row: row }] };
      if (ast.where && !truthy(evalExpr(ast.where, ctx, tables, null))) return;
      var newVals = {};
      ast.assignments.forEach(function(a){ newVals[a.column] = evalExpr(a.expr, ctx, tables, null); });
      Object.keys(newVals).forEach(function(c){ row[c] = newVals[c]; });
      updated.push(row);
    });

    return {
      columns: schemaCols,
      rows: updated,
      message: updated.length + (updated.length === 1 ? ' fila actualizada.' : ' filas actualizadas.')
    };
  }

  function executeDelete(ast, tables, schemas){
    var rows = tables[ast.table];
    if (!rows) throw new SqlError('No existe la tabla "' + ast.table + '". Tablas disponibles: ' + Object.keys(tables).join(', ') + '.');
    var schemaCols = (schemas && schemas[ast.table]) || (rows.length ? Object.keys(rows[0]) : []);

    var kept = [], deleted = [];
    rows.forEach(function(row){
      var ctx = { entries: [{ name: ast.table, alias: ast.table, row: row }] };
      var match = ast.where ? truthy(evalExpr(ast.where, ctx, tables, null)) : true;
      if (match) deleted.push(row); else kept.push(row);
    });
    rows.length = 0;
    kept.forEach(function(r){ rows.push(r); });

    return {
      columns: schemaCols,
      rows: deleted,
      message: deleted.length + (deleted.length === 1 ? ' fila eliminada.' : ' filas eliminadas.')
    };
  }

  function run(sql, tables, schemas){
    var trimmed = (sql || '').trim();
    if (!trimmed) throw new SqlError('Escribe una consulta SQL para ejecutar.');
    var tokens = tokenize(trimmed);
    var kind = (tokens[0].type === 'IDENT') ? tokens[0].value.toUpperCase() : null;
    if (kind !== 'SELECT' && kind !== 'INSERT' && kind !== 'UPDATE' && kind !== 'DELETE'){
      throw new SqlError('Este playground admite consultas SELECT, INSERT, UPDATE y DELETE.');
    }
    var parser = new Parser(tokens);
    if (kind === 'SELECT') return execute(parser.parseSelectStatement(), tables, schemas);
    if (kind === 'INSERT') return executeInsert(parser.parseInsertStatement(), tables, schemas);
    if (kind === 'UPDATE') return executeUpdate(parser.parseUpdateStatement(), tables, schemas);
    return executeDelete(parser.parseDeleteStatement(), tables, schemas);
  }

  return { run: run, SqlError: SqlError };
})();
