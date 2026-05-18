var H=e=>{let a=structuredClone(e),t=new Set,r=new Map,n={get(){return a},set(o){let s=a;a=typeof o=="function"?o(s):o,t.forEach(l=>{try{l(a,s)}catch(p){console.error("Listener error:",p)}})},update(o){n.set(o)},setKey(o,s){n.set(l=>({...l,[o]:typeof s=="function"?s(l[o]):s}))},subscribe(o,s=!1){return t.add(o),s&&o(a,a),()=>t.delete(o)},select(o,s){let l=o(a);return n.subscribe(p=>{let c=o(p);Object.is(l,c)||(s(c,l),l=c)})},on(o,s){return r.has(o)||r.set(o,new Set),r.get(o).add(s),()=>n.off(o,s)},once(o,s){let l=n.on(o,(...p)=>{l(),s(...p)});return l},off(o,s){if(!o){r.clear();return}let l=r.get(o);if(l){if(!s){l.clear();return}l.delete(s)}},emit(o,s){let l=r.get(o);if(l)for(let p of l)try{p({type:o,data:s,state:a})}catch(c){console.error(`Event "${o}" error:`,c)}},destroy(){t.clear(),r.clear()}};return n};var be=`
CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT
);

CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price REAL NOT NULL,
  stock INTEGER DEFAULT 0,
  category_id INTEGER REFERENCES categories(id),
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'user',
  avatar TEXT,
  bio TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  status TEXT DEFAULT 'pending',
  total REAL,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL REFERENCES orders(id),
  product_id INTEGER NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price REAL NOT NULL
);

INSERT INTO categories (name, slug, description) VALUES
  ('Electronics', 'electronics', 'Gadgets, devices, and electronic accessories'),
  ('Clothing', 'clothing', 'Apparel, footwear, and fashion accessories'),
  ('Books', 'books', 'Fiction, non-fiction, and technical literature'),
  ('Home & Garden', 'home-garden', 'Furniture, decor, and gardening supplies');

INSERT INTO products (name, slug, description, price, stock, category_id) VALUES
  ('Wireless Headphones', 'wireless-headphones', 'Bluetooth 5.0 noise-canceling headphones with 30hr battery', 89.99, 45, 1),
  ('USB-C Hub', 'usb-c-hub', '7-in-1 USB-C hub with HDMI, SD card, and 3x USB 3.0', 34.99, 120, 1),
  ('Mechanical Keyboard', 'mechanical-keyboard', 'RGB backlit mechanical keyboard with Cherry MX switches', 129.99, 28, 1),
  ('Cotton T-Shirt', 'cotton-tshirt', 'Premium organic cotton crew neck t-shirt', 24.99, 200, 2),
  ('Denim Jacket', 'denim-jacket', 'Classic blue denim jacket with brass buttons', 89.99, 15, 2),
  ('Running Shoes', 'running-shoes', 'Lightweight mesh running shoes with cloud sole', 119.99, 37, 2),
  ('JavaScript: The Good Parts', 'js-good-parts', 'Douglas Crockford classic on JavaScript fundamentals', 29.99, 60, 3),
  ('Designing Data-Intensive Applications', 'ddia', 'Kleppmann guide to distributed systems and data architecture', 49.99, 42, 3),
  ('Clean Code', 'clean-code', 'Robert C. Martin principles of software craftsmanship', 39.99, 55, 3),
  ('Indoor Succulent Set', 'indoor-succulents', 'Set of 5 low-maintenance succulents in ceramic pots', 34.99, 80, 4),
  ('LED Desk Lamp', 'led-desk-lamp', 'Adjustable LED desk lamp with 5 brightness levels', 44.99, 33, 4),
  ('Wool Throw Blanket', 'wool-blanket', 'Merino wool throw blanket, 60x80 inches', 69.99, 22, 4);

INSERT INTO users (name, email, role, bio) VALUES
  ('Alice Johnson', 'alice@example.com', 'admin', 'Platform administrator and power user'),
  ('Bob Smith', 'bob@example.com', 'user', 'Frontend developer from San Francisco'),
  ('Carol Williams', 'carol@example.com', 'user', 'Data scientist who loves SQL'),
  ('David Brown', 'david@example.com', 'moderator', 'Content moderator and community manager'),
  ('Eve Davis', 'eve@example.com', 'user', 'Backend engineer and open source contributor'),
  ('Frank Miller', 'frank@example.com', 'user', 'DevOps engineer exploring database tools'),
  ('Grace Wilson', 'grace@example.com', 'user', 'Product manager analyzing user behavior'),
  ('Henry Taylor', 'henry@example.com', 'admin', 'Co-founder and CTO');

INSERT INTO orders (user_id, status, total, notes) VALUES
  (1, 'delivered', 254.97, 'Express shipping requested'),
  (2, 'shipped', 89.99, NULL),
  (3, 'pending', 149.98, 'Gift wrap please'),
  (1, 'delivered', 34.99, NULL),
  (4, 'shipped', 214.98, 'Office delivery'),
  (5, 'pending', 79.98, NULL),
  (6, 'cancelled', 129.99, 'Changed mind'),
  (2, 'delivered', 69.99, 'Leave at front door'),
  (7, 'pending', 124.98, 'Rush order'),
  (8, 'shipped', 49.99, NULL),
  (3, 'delivered', 159.98, 'Birthday gift'),
  (5, 'pending', 89.99, 'Need by Friday');

INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
  (1, 1, 1, 89.99), (1, 3, 1, 129.99), (1, 4, 1, 24.99),
  (2, 1, 1, 89.99),
  (3, 5, 1, 89.99), (3, 7, 2, 29.99),
  (4, 2, 1, 34.99),
  (5, 8, 3, 49.99), (5, 9, 1, 39.99),
  (6, 10, 1, 34.99), (6, 11, 1, 44.99),
  (7, 3, 1, 129.99),
  (8, 12, 1, 69.99),
  (9, 5, 1, 89.99), (9, 11, 1, 44.99),
  (10, 8, 1, 49.99),
  (11, 2, 1, 34.99), (11, 5, 1, 89.99), (11, 10, 1, 34.99),
  (12, 1, 1, 89.99);

CREATE TABLE reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL REFERENCES products(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

INSERT INTO reviews (product_id, user_id, rating, title, comment) VALUES
  (1, 2, 5, 'Amazing sound quality', 'Best headphones I have ever owned. The noise cancellation is incredible.'),
  (1, 5, 4, 'Great battery life', 'Lasts the full 30 hours as advertised. Sound is crisp and clear.'),
  (3, 1, 5, 'Perfect for coding', 'Cherry MX switches feel amazing. The RGB is a nice bonus.'),
  (3, 6, 3, 'Too loud', 'Great keyboard but the switches are too loud for an open office.'),
  (5, 3, 5, 'Classic fit', 'The denim is high quality and the fit is perfect. True to size.'),
  (7, 4, 4, 'Must read', 'Every developer should read this book. Fundamental concepts explained clearly.'),
  (8, 7, 5, 'The bible of distributed systems', 'Kleppmann is a genius. This book changed how I think about data.'),
  (10, 2, 4, 'Thriving', 'All 5 plants arrived healthy and are doing great a month later.'),
  (12, 8, 5, 'So warm and soft', 'This blanket is incredibly cozy. Best purchase this winter.');
`;function j(e,a){let t=be.split(";").filter(r=>r.trim());for(let r of t)try{a(r+";")}catch(n){console.warn("Seed statement failed (likely already exists):",n.message)}}function V(){return new Promise((e,a)=>{let t=indexedDB.open("zrow_dbs",1);t.onupgradeneeded=r=>{let n=r.target.result;n.objectStoreNames.contains("dbs")||n.createObjectStore("dbs",{keyPath:"id"})},t.onsuccess=r=>e(r.target.result),t.onerror=()=>a(new Error("Failed to open IndexedDB"))})}async function ye(e){let a=await V();return new Promise((t,r)=>{let o=a.transaction("dbs","readonly").objectStore("dbs").get(e);o.onsuccess=()=>{a.close(),t(o.result?.data||null)},o.onerror=()=>{a.close(),r(new Error("Failed to read DB"))}})}async function fe(e,a){let t=await V();return new Promise((r,n)=>{let o=t.transaction("dbs","readwrite");o.objectStore("dbs").put({id:e,data:a,updated:Date.now()}),o.oncomplete=()=>{t.close(),r()},o.onerror=()=>{t.close(),n()}})}var D=class{constructor(){this._db=null,this._SQL=null,this._name=null}async open(a,t){if(this._name=a,this._SQL=await window.initSqlJs({locateFile:r=>(t||"dist/vendor/")+r}),this._db=new this._SQL.Database,a&&a!==":memory:")try{let r=await ye(a);r&&(this._db=new this._SQL.Database(r))}catch{}return this}seedIfEmpty(){try{let a=this._db.exec("SELECT count(*) as cnt FROM sqlite_master WHERE type='table'");if(a.length&&a[0].values[0][0]>0)return}catch{}j(this._db,a=>this._db.exec(a))}async save(){if(this._name&&this._name!==":memory:"&&this._db)try{await fe(this._name,this._db.export())}catch{}}exec(a){let t=performance.now(),r=this._db.exec(a),n=[],o=[],s=this._db.getRowsModified();for(let p of r)p.columns?.length&&(n=p.columns.map(c=>({name:c,type:"text"})),o=p.values.map(c=>{let u={};return p.columns.forEach((b,f)=>{u[b]=c[f]}),u}));return/^\s*(INSERT|UPDATE|DELETE|CREATE|DROP|ALTER)/i.test(a)&&this.save(),{columns:n,rows:o,affectedRows:s,duration:Math.round(performance.now()-t)}}getTables(){let a=this._db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name");return a.length?a[0].values.map(t=>{let r=t[0],n=this._db.exec(`PRAGMA table_info("${r}")`),o=n.length?n[0].values.map(s=>({name:s[1],type:s[2],nullable:!s[3],defaultValue:s[4],primaryKey:!!s[5]})):[];return{name:r,type:"table",columns:o}}):[]}_escapeId(a){return`"${a.replace(/"/g,'""')}"`}_escapeLike(a){return a.replace(/'/g,"''").replace(/%/g,"\\%").replace(/_/g,"\\_")}getTableData(a,{limit:t=200,offset:r=0,filters:n={},sort:o=null}={}){try{let s="",l=[];for(let[h,R]of Object.entries(n)){if(R===""||R==null)continue;let v=this._escapeId(h);R==="__NULL__"?l.push(`${v} IS NULL`):R==="__NOTNULL__"?l.push(`${v} IS NOT NULL`):l.push(`${v} LIKE '%${this._escapeLike(R)}%' ESCAPE '\\'`)}l.length&&(s=" WHERE "+l.join(" AND "));let p="";if(o&&o.column){let h=o.direction==="desc"?"DESC":"ASC";p=` ORDER BY ${this._escapeId(o.column)} ${h}`}let c=`SELECT * FROM ${this._escapeId(a)}${s}${p} LIMIT ${t} OFFSET ${r}`,u=this._db.exec(c),b=this._db.exec(`SELECT COUNT(*) as cnt FROM ${this._escapeId(a)}${s}`),f=b.length?b[0].values[0][0]:0;if(!u.length)return{columns:[],rows:[],total:0};let L=u[0].columns.map(h=>({name:h,type:"text"})),x=u[0].values.map(h=>{let R={};return u[0].columns.forEach((v,k)=>{R[v]=h[k]}),R});return{columns:L,rows:x,total:f}}catch{return{columns:[],rows:[],total:0}}}updateRow(a,t,r){let n=Object.entries(t).filter(([o])=>o!=="id").map(([o,s])=>`"${o}" = ${s===null?"NULL":typeof s=="string"?`'${s.replace(/'/g,"''")}'`:s}`).join(", ");n&&this.exec(`UPDATE "${a}" SET ${n} WHERE id = ${typeof r=="string"&&isNaN(Number(r))?`'${r}'`:r}`)}deleteRow(a,t){this.exec(`DELETE FROM "${a}" WHERE id = ${typeof t=="string"&&isNaN(Number(t))?`'${t}'`:t}`)}updateRowByPk(a,t,r,n){let o=Object.entries(t).filter(([s])=>s!==r).map(([s,l])=>`"${s}" = ${l===null?"NULL":typeof l=="string"?`'${l.replace(/'/g,"''")}'`:l}`).join(", ");o&&this.exec(`UPDATE "${a}" SET ${o} WHERE "${r}" = ${typeof n=="string"&&isNaN(Number(n))?`'${n.replace(/'/g,"''")}'`:n}`)}deleteRowByPk(a,t,r){this.exec(`DELETE FROM "${a}" WHERE "${t}" = ${typeof r=="string"&&isNaN(Number(r))?`'${r.replace(/'/g,"''")}'`:r}`)}insertRow(a,t){let r=Object.keys(t).map(o=>`"${o}"`),n=Object.values(t).map(o=>o==null?"NULL":typeof o=="string"?`'${o.replace(/'/g,"''")}'`:o);this.exec(`INSERT INTO "${a}" (${r.join(", ")}) VALUES (${n.join(", ")})`)}createTable(a,t){let r=t.map(n=>{let o=`"${n.name}" ${n.type}`;return n.primaryKey&&(o+=" PRIMARY KEY"),n.autoIncrement&&(o+=" AUTOINCREMENT"),n.notNull&&(o+=" NOT NULL"),n.defaultValue!=null&&n.defaultValue!==""&&(o+=` DEFAULT ${typeof n.defaultValue=="string"?`'${n.defaultValue}'`:n.defaultValue}`),n.unique&&(o+=" UNIQUE"),o});this.exec(`CREATE TABLE "${a}" (${r.join(", ")})`)}dropTable(a){this.exec(`DROP TABLE IF EXISTS "${a}"`)}addColumn(a,t){let r=`"${t.name}" ${t.type}`;t.notNull&&(r+=" NOT NULL"),t.defaultValue!=null&&t.defaultValue!==""&&(r+=` DEFAULT ${typeof t.defaultValue=="string"?`'${t.defaultValue}'`:t.defaultValue}`),this.exec(`ALTER TABLE "${a}" ADD COLUMN ${r}`)}dropColumn(a,t){this.exec(`ALTER TABLE "${a}" DROP COLUMN "${t}"`)}renameTable(a,t){this.exec(`ALTER TABLE "${a}" RENAME TO "${t}"`)}getTableInfo(a){let t=this._db.exec(`PRAGMA table_info("${a}")`),r=this._db.exec(`PRAGMA index_list("${a}")`),n=this._db.exec(`PRAGMA foreign_key_list("${a}")`);return{columns:t.length?t[0].values.map(o=>({cid:o[0],name:o[1],type:o[2],notNull:!!o[3],defaultValue:o[4],primaryKey:!!o[5]})):[],indexes:r.length?r[0].values.map(o=>({name:o[1],unique:!o[2],origin:o[3]})):[],foreignKeys:n.length?n[0].values.map(o=>({column:o[3],refTable:o[2],refColumn:o[4]})):[]}}};function me(){try{return JSON.parse(localStorage.getItem("zrow_connections")||"[]")}catch{return[]}}function X(e){localStorage.setItem("zrow_connections",JSON.stringify(e))}var ge=Date.now();function xe(){return++ge}var he={theme:localStorage.getItem("zrow_theme")||"dark",connections:me(),activeConnectionId:null,tabs:[],activeTabId:null,statusText:"Ready",results:null,queryRunning:!1,queryError:null,tables:[],currentTable:null,currentTableData:null,currentTableInfo:null,sidebarView:"tables",recordCount:null,tableFilters:{},tableSort:null},i=H(he),N={toggleTheme(){let e=i.get().theme==="dark"?"light":"dark";i.setKey("theme",e),localStorage.setItem("zrow_theme",e),document.documentElement.classList.toggle("dark",e==="dark")},addConnection(e){let{connections:a}=i.get(),t=e.id||"conn_"+Date.now(),r=e.id?a.map(n=>n.id===e.id?{...e}:n):[...a,{...e,id:t}];return i.setKey("connections",r),X(r),t},deleteConnection(e){let{connections:a,activeConnectionId:t,tabs:r}=i.get(),n=a.filter(o=>o.id!==e);i.setKey("connections",n),X(n),i.setKey("tabs",r.filter(o=>o.connectionId!==e)),t===e&&(i.setKey("activeConnectionId",null),i.setKey("tables",[]),i.setKey("currentTable",null),i.setKey("currentTableData",null))},setActiveConnection(e){i.setKey("activeConnectionId",e)},addTab(e="editor",a={}){let{tabs:t,activeConnectionId:r}=i.get(),n=xe(),o={id:n,type:e,name:a.name||(e==="editor"?`Query ${t.filter(s=>s.type==="editor").length+1}`:a.tableName||"Table"),connectionId:a.connectionId||r,sql:a.sql||"",tableName:a.tableName||null};return i.setKey("tabs",[...t,o]),i.setKey("activeTabId",n),n},closeTab(e){let{tabs:a,activeTabId:t}=i.get(),r=a.findIndex(o=>o.id===e),n=a.filter(o=>o.id!==e);if(i.setKey("tabs",n),t===e){let o=Math.min(r,n.length-1);i.setKey("activeTabId",n.length?n[Math.max(0,o)].id:null)}},setActiveTab(e){i.setKey("activeTabId",e)},updateTabSQL(e,a){i.setKey("tabs",i.get().tabs.map(t=>t.id===e?{...t,sql:a}:t))},setStatus(e){i.setKey("statusText",e)},setResults(e){i.setKey("results",e),i.setKey("queryError",null)},setQueryError(e){i.setKey("queryError",e),i.setKey("results",null)},setQueryRunning(e){i.setKey("queryRunning",e)},setTables(e){i.setKey("tables",e)},setCurrentTable(e){i.setKey("currentTable",e)},setCurrentTableData(e){i.setKey("currentTableData",e)},setCurrentTableInfo(e){i.setKey("currentTableInfo",e)},setSidebarView(e){i.setKey("sidebarView",e)},setRecordCount(e){i.setKey("recordCount",e)},setTableFilters(e){i.setKey("tableFilters",e)},setTableSort(e){i.setKey("tableSort",e)},clearTableFilters(){i.setKey("tableFilters",{})}};var m=null;function _(){return m}async function K(e){let a=new D;return await a.open(e.database||e.name,e.wasmPath),e.seed!==!1&&a.seedIfEmpty(),m=a,i.setKey("activeConnectionId",e.id),i.setKey("tables",a.getTables()),i.setKey("statusText",`Connected \u2014 ${e.name}`),a}async function Y(){m&&await m.save(),m=null,i.setKey("activeConnectionId",null),i.setKey("tables",[]),i.setKey("currentTable",null),i.setKey("currentTableData",null),i.setKey("currentTableInfo",null)}async function q(e){if(!m)throw new Error("Not connected");i.setKey("queryRunning",!0),i.setKey("queryError",null);try{let a=m.exec(e);return i.setKey("results",a),i.setKey("queryRunning",!1),i.setKey("statusText",`${a.rows.length} rows in ${a.duration}ms`),a}catch(a){throw i.setKey("queryError",a.message),i.setKey("queryRunning",!1),i.setKey("statusText","Query failed"),a}}async function U(e){if(m)try{i.setKey("currentTable",e),i.setKey("tableFilters",{}),i.setKey("tableSort",null);let{tableFilters:a,tableSort:t}=i.get(),r=m.getTableData(e,{filters:a,sort:t}),n=m.getTableInfo(e);i.setKey("currentTableData",r),i.setKey("currentTableInfo",n),i.setKey("statusText",`Table "${e}" \u2014 ${r.total} rows`)}catch{}}async function O(){let{currentTable:e,tableFilters:a,tableSort:t}=i.get();if(!(!e||!m||!i.get().activeConnectionId))try{let o=m.getTableData(e,{filters:a,sort:t}),s=m.getTableInfo(e);i.setKey("currentTableData",o),i.setKey("currentTableInfo",s);let l=Object.values(a).filter(c=>c&&c!=="").length,p=[`${o.total} rows`];l&&p.push(`${l} filter${l>1?"s":""}`),t&&p.push(`sorted by ${t.column}`),i.setKey("statusText",`Table "${e}" \u2014 ${p.join(", ")}`)}catch{}}function $(){let{currentTable:e}=i.get();e&&U(e)}function S(){m&&i.setKey("tables",m.getTables())}async function B(e,a){m&&(m.insertRow(e,a),i.setKey("statusText",`Row inserted into "${e}"`),$(),S())}async function W(e,a,t,r){m&&(m.updateRowByPk(e,a,t,r),i.setKey("statusText",`Row updated in "${e}"`),$())}async function Q(e,a,t){m&&(m.deleteRowByPk(e,a,t),i.setKey("statusText",`Row deleted from "${e}"`),$(),S())}async function F(e,a){m&&(m.createTable(e,a),i.setKey("statusText",`Table "${e}" created`),S())}async function J(e){m&&(m.dropTable(e),i.get().currentTable===e&&(i.setKey("currentTable",null),i.setKey("currentTableData",null),i.setKey("currentTableInfo",null)),i.setKey("statusText",`Table "${e}" dropped`),S())}async function P(e,a){m&&(m.addColumn(e,a),i.setKey("statusText",`Column "${a.name}" added to "${e}"`),$(),S())}async function z(e,a){m&&(m.dropColumn(e,a),i.setKey("statusText",`Column "${a}" dropped from "${e}"`),$(),S())}async function Z(e,a){m&&(m.renameTable(e,a),i.get().currentTable===e&&i.setKey("currentTable",a),i.setKey("statusText",`Table renamed to "${a}"`),S())}function A(e,a={},...t){let r=document.createElement(e);for(let[n,o]of Object.entries(a))n==="className"?r.className=o:n==="style"&&typeof o=="object"?Object.assign(r.style,o):n.startsWith("on")?r.addEventListener(n.slice(2).toLowerCase(),o):n==="dataset"&&typeof o=="object"?Object.assign(r.dataset,o):n==="html"?r.innerHTML=o:n==="text"?r.textContent=o:r.setAttribute(n,o);for(let n of t)n!=null&&(typeof n=="string"||typeof n=="number"?r.appendChild(document.createTextNode(n)):n instanceof Node&&r.appendChild(n));return r}function d(e,a=document){return a.querySelector(e)}function M(e,a=document){return a.querySelectorAll(e)}function E(e,a,t,r){let n=o=>{let s=o.target.closest(a);s&&e.contains(s)&&r(o,s)};return e.addEventListener(t,n),()=>e.removeEventListener(t,n)}function C(e){for(;e.firstChild;)e.removeChild(e.firstChild)}function w(e){let a=document.createElement("div");return a.textContent=e,a.innerHTML}function g(e){window.lucide&&(e?lucide.createIcons({root:e}):lucide.createIcons())}var Te=new Set(["SELECT","FROM","WHERE","INSERT","INTO","VALUES","UPDATE","SET","DELETE","CREATE","TABLE","ALTER","DROP","INDEX","VIEW","JOIN","LEFT","RIGHT","INNER","OUTER","FULL","CROSS","ON","AND","OR","NOT","IN","NULL","IS","LIKE","BETWEEN","EXISTS","UNION","ALL","DISTINCT","AS","ORDER","BY","GROUP","HAVING","LIMIT","OFFSET","ASC","DESC","CASE","WHEN","THEN","ELSE","END","WITH","RECURSIVE","PRIMARY","KEY","FOREIGN","REFERENCES","CASCADE","CONSTRAINT","DEFAULT","CHECK","UNIQUE","IF","GRANT","REVOKE","COMMIT","ROLLBACK","BEGIN","TRANSACTION","EXPLAIN","ANALYZE","TRUNCATE","RETURNING","USING","NATURAL","EXCEPT","INTERSECT","FETCH","NEXT","ROWS","ONLY","FOR","OF","MERGE","MATCHED","DO","NOTHING"]),Ee=new Set(["INT","INTEGER","BIGINT","SMALLINT","TINYINT","BOOLEAN","BIT","FLOAT","DOUBLE","REAL","DECIMAL","NUMERIC","MONEY","CHAR","VARCHAR","TEXT","CLOB","NCHAR","NVARCHAR","NTEXT","BINARY","VARBINARY","BLOB","BYTEA","DATE","TIME","TIMESTAMP","DATETIME","YEAR","INTERVAL","JSON","JSONB","UUID","ARRAY","ENUM","SERIAL","BIGSERIAL","GEOMETRY","GEOGRAPHY","POINT","LINESTRING","POLYGON"]),ve=new Set(["COUNT","SUM","AVG","MIN","MAX","COALESCE","NULLIF","CAST","CONVERT","SUBSTRING","UPPER","LOWER","TRIM","LENGTH","REPLACE","CONCAT","NOW","CURRENT_DATE","CURRENT_TIME","CURRENT_TIMESTAMP","EXTRACT","DATE_PART","DATE_TRUNC","ROUND","CEIL","FLOOR","ABS","MOD","POWER","SQRT","EXP","LN","LOG","GREATEST","LEAST","ROW_NUMBER","RANK","DENSE_RANK","LEAD","LAG","FIRST_VALUE","LAST_VALUE","NTH_VALUE","STRING_AGG","ARRAY_AGG","JSON_AGG","GROUP_CONCAT","LISTAGG","TO_CHAR","TO_DATE","TO_NUMBER","LEFT","RIGHT","POSITION","STRPOS","REGEXP_REPLACE","REGEXP_MATCH","SPLIT_PART","MD5","SHA256","RANDOM","GEN_RANDOM_UUID"]),we=new Set(["TRUE","FALSE","NULL","UNKNOWN","CURRENT_USER","SESSION_USER","CURRENT_DATE","CURRENT_TIME","CURRENT_TIMESTAMP","LOCALTIME","LOCALTIMESTAMP","CURRENT_CATALOG","CURRENT_SCHEMA","DEFAULT"]);function ee(e){if(!e)return"";let a=[],t=0,r=e.length;for(;t<r;){if(e[t]===`
`){a.push({type:"text",value:`
`}),t++;continue}if(e[t]===" "||e[t]==="	"){let n="";for(;t<r&&(e[t]===" "||e[t]==="	");)n+=e[t++];a.push({type:"text",value:n});continue}if(e[t]==="-"&&e[t+1]==="-"){let n="";for(t+=2;t<r&&e[t]!==`
`;)n+=e[t++];a.push({type:"comment",value:"--"+n});continue}if(e[t]==="/"&&e[t+1]==="*"){let n="/*";for(t+=2;t<r-1&&!(e[t]==="*"&&e[t+1]==="/");)n+=e[t++];t<r-1&&(n+="*/",t+=2),a.push({type:"comment",value:n});continue}if(e[t]==="'"||e[t]==='"'||e[t]==="`"){let n=e[t],o=n;for(t++;t<r;){if(e[t]==="\\"&&t+1<r){o+=e[t]+e[t+1],t+=2;continue}if(o+=e[t],e[t]===n){t++;break}t++}a.push({type:"string",value:o});continue}if(e[t]==="$"&&t+1<r&&e[t+1]==="$"){let n="$$";for(t+=2;t<r-1&&!(e[t]==="$"&&e[t+1]==="$");)n+=e[t++];t<r-1&&(n+="$$",t+=2),a.push({type:"string",value:n});continue}if(/[0-9]/.test(e[t])&&(t===0||/[\s,()=<>!+\-*/%]/.test(e[t-1]))){let n="";for(;t<r&&/[0-9.]/.test(e[t]);)n+=e[t++];n.endsWith(".")&&(n=n.slice(0,-1),t--),a.push({type:"number",value:n});continue}if(/[a-zA-Z_]/.test(e[t])){let n="";for(;t<r&&/[a-zA-Z0-9_]/.test(e[t]);)n+=e[t++];let o=n.toUpperCase();Te.has(o)?a.push({type:"keyword",value:n}):Ee.has(o)?a.push({type:"type",value:n}):ve.has(o)?a.push({type:"function",value:n}):we.has(o)?a.push({type:"builtin",value:n}):a.push({type:"text",value:n});continue}if(/[()]/.test(e[t])){a.push({type:"text",value:e[t]}),t++;continue}if(e[t]===":"&&t+1<r&&/[a-zA-Z]/.test(e[t+1])){let n=":";for(t++;t<r&&/[a-zA-Z0-9_]/.test(e[t]);)n+=e[t++];a.push({type:"variable",value:n});continue}if(/[=<>!+\-*/%,;.]/.test(e[t])){let n=e[t];t++,(n==="<"||n===">"||n==="!"||n==="=")&&t<r&&e[t]==="="&&(n+="=",t++),a.push({type:"operator",value:n});continue}a.push({type:"text",value:e[t]}),t++}return a.map(n=>`<span class="${`sql-${n.type}`}">${Le(n.value)}</span>`).join("")}function Le(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function Ne(e){return e?e.split(`
`).length:1}function te(e){let a=Ne(e);return Array.from({length:a},(t,r)=>r+1).join(`
`)}document.addEventListener("DOMContentLoaded",()=>{let{theme:e}=i.get();document.documentElement.classList.toggle("dark",e==="dark"),y(),i.subscribe(()=>{let a=i.get(),t=d("#status-text");t&&(t.textContent=a.statusText);let r=d("#status-icon");r&&(r.className=`w-2 h-2 rounded-full ${a.queryRunning?"bg-amber-400 animate-pulse":a.activeConnectionId?"bg-emerald-400":"bg-gray-600"}`)})});function y(){Re(),ke(),Oe(),He(),g()}function Re(){let e=d("#sidebar");C(e);let a=i.get(),{connections:t,activeConnectionId:r,tables:n,currentTable:o}=a;e.innerHTML=`
    <div class="flex items-center gap-2 px-4 h-10 shrink-0 border-b border-gray-800/60">
      <i data-lucide="database" class="w-4 h-4 text-blue-400"></i>
      <span class="text-xs font-semibold text-gray-300">Zrow</span>
      <span class="text-[9px] text-gray-600 ml-auto">v2</span>
    </div>
    <div class="flex-1 overflow-y-auto py-2" id="sidebar-body"></div>
    <div class="px-3 py-2 border-t border-gray-800/60 text-[11px] text-gray-500">
      <div class="flex items-center gap-2">
        <span id="status-icon" class="w-2 h-2 rounded-full ${r?"bg-emerald-400":"bg-gray-600"}"></span>
        <span id="status-text" class="truncate">${a.statusText}</span>
      </div>
    </div>
  `,document.addEventListener("contextmenu",p=>{let c=d("#table-context-menu");c&&c.remove()});let s=d("#sidebar-body");if(!t.length&&!r){s.innerHTML=`
      <div class="flex flex-col items-center gap-3 py-8 px-4 text-center">
        <i data-lucide="database" class="w-8 h-8 text-gray-700"></i>
        <p class="text-xs text-gray-600">No connections yet</p>
        <button id="btn-new-conn" class="px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors">
          <i data-lucide="plus" class="w-3 h-3 inline-block mr-1"></i> New Database
        </button>
      </div>
    `,d("#btn-new-conn")?.addEventListener("click",re),g(s);return}let l="";for(let p of t){let c=p.id===r;if(l+=`
      <div class="conn-item flex items-center gap-2 px-3 py-1.5 mx-1 rounded-lg cursor-pointer text-xs transition-all ${c?"bg-blue-500/10 text-blue-400":"text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"}" data-id="${p.id}">
        <i data-lucide="${c?"plug":"database"}" class="w-3.5 h-3.5 shrink-0"></i>
        <span class="truncate flex-1">${p.name}</span>
        <span class="text-[10px] text-gray-600">SQLite</span>
        <button class="btn-del-conn opacity-0 hover:opacity-100 hover:text-red-400 transition-opacity" data-id="${p.id}">
          <i data-lucide="x" class="w-3 h-3"></i>
        </button>
      </div>
    `,c&&n.length){l+='<div class="ml-2 pl-2 border-l border-gray-800/60 mt-0.5">',l+=`<div class="flex items-center justify-between px-2 py-1 text-[10px] text-gray-600 uppercase tracking-wider font-medium">
        <span><i data-lucide="layers" class="w-3 h-3 mr-1"></i> Tables <span class="font-normal ml-1">(${n.length})</span></span>
        <button id="btn-new-table" class="p-0.5 rounded hover:bg-gray-700/50 hover:text-gray-400 transition-colors" title="New Table">
          <i data-lucide="plus" class="w-3 h-3"></i>
        </button>
      </div>`;for(let u of n){let b=o===u.name;l+=`
          <div class="table-item flex items-center gap-1.5 px-2 py-1 rounded text-xs cursor-pointer transition-all group ${b?"text-blue-400 bg-blue-500/5":"text-gray-400 hover:text-gray-200 hover:bg-gray-800/40"}" data-table="${u.name}">
            <i data-lucide="table" class="w-3 h-3 shrink-0"></i>
            <span class="truncate flex-1">${u.name}</span>
            <span class="ml-1 text-[9px] text-gray-600">${u.columns.length}</span>
            <button class="btn-table-actions ml-auto p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-gray-700/50 hover:text-gray-300 transition-all ${b?"text-blue-400":"text-gray-600"}" data-table="${u.name}" title="Actions">
              <i data-lucide="more-horizontal" class="w-3 h-3"></i>
            </button>
          </div>
        `}l+="</div>"}}s.innerHTML=l,g(s),E(s,".conn-item","click",async(p,c)=>{let u=c.dataset.id,b=t.find(f=>f.id===u);if(b){if(r===u){await Y(),y();return}i.setKey("statusText",`Connecting to ${b.name}...`),y();try{await K(b),y()}catch(f){i.setKey("statusText",`Error: ${f.message}`),y()}}}),E(s,".btn-del-conn","click",(p,c)=>{p.stopPropagation(),confirm("Delete this connection?")&&(N.deleteConnection(c.dataset.id),y())}),E(s,".table-item","click",async(p,c)=>{if(p.target.closest(".btn-table-actions"))return;let u=c.dataset.table;i.get().currentTable!==u&&(await U(u),y())}),E(s,".btn-table-actions","click",(p,c)=>{p.stopPropagation(),Ae(c,c.dataset.table)}),d("#btn-new-table")?.addEventListener("click",()=>le()),r||(s.innerHTML+=`
      <div class="px-3 mt-2">
        <button id="btn-new-conn" class="w-full px-3 py-1.5 text-xs font-medium rounded-lg border border-dashed border-gray-700 text-gray-500 hover:text-gray-300 hover:border-gray-600 transition-colors">
          <i data-lucide="plus" class="w-3 h-3 inline-block mr-1"></i> New Connection
        </button>
      </div>
    `,d("#btn-new-conn")?.addEventListener("click",re),g(s))}function Ae(e,a){let t=d("#table-context-menu");t&&t.remove();let r=e.getBoundingClientRect(),n=A("div",{id:"table-context-menu",className:"fixed z-50 bg-gray-800 border border-gray-700/60 rounded-lg shadow-xl py-1 text-xs min-w-[140px]",style:{left:r.left+"px",top:r.bottom+4+"px"}}),o=[{label:"Browse",icon:"eye",action:()=>{U(a),y()}},{label:"Add Column",icon:"columns",action:()=>ie(a)},{label:"Rename Table",icon:"edit-3",action:()=>Ge(a)},{type:"divider"},{label:"Duplicate Schema",icon:"copy",action:()=>Ce(a)},{label:"Drop Table",icon:"trash-2",className:"text-red-400 hover:bg-red-500/10",action:()=>ce(`Drop table "${a}"? This cannot be undone.`,()=>Ie(a))}];for(let s of o){if(s.type==="divider"){n.appendChild(A("div",{className:"h-px bg-gray-700/60 my-1"}));continue}let l=A("button",{className:`flex items-center gap-2 w-full px-3 py-1.5 text-left hover:bg-gray-700/50 transition-colors ${s.className||"text-gray-300"}`,onClick:()=>{n.remove(),s.action()}});l.innerHTML=`<i data-lucide="${s.icon}" class="w-3 h-3"></i> ${s.label}`,n.appendChild(l)}document.body.appendChild(n),g(n),setTimeout(()=>{let s=l=>{!n.contains(l.target)&&l.target!==e&&(n.remove(),document.removeEventListener("click",s))};document.addEventListener("click",s)},0)}async function Ce(e){let a=_();if(!a)return;let t=e+"_copy",n=a.getTableInfo(e).columns.map(s=>({name:s.name,type:s.type,primaryKey:s.primaryKey,notNull:s.notNull,defaultValue:s.defaultValue}));await F(t,n);let o=a.getTableData(e,{limit:99999});for(let s of o.rows)await B(t,s);i.setKey("statusText",`Table "${e}" duplicated as "${t}"`),Se(),y()}async function Ie(e){await J(e),y()}function Se(){let e=_();e&&i.setKey("tables",e.getTables())}function ke(){let e=d("#tab-bar");C(e);let{tabs:a,activeTabId:t}=i.get();if(!a.length){e.innerHTML='<div class="flex items-center px-3 text-[11px] text-gray-600">No tabs</div>';return}for(let r of a){let n=r.id===t,o=A("div",{className:`tab-item flex items-center gap-1.5 px-3 py-1.5 text-xs cursor-pointer border-r border-gray-800/60 select-none whitespace-nowrap transition-all ${n?"text-blue-400 bg-blue-500/5":"text-gray-500 hover:text-gray-300 hover:bg-gray-800/30"}`,dataset:{tabId:r.id}});o.innerHTML=`<i data-lucide="${r.type==="editor"?"terminal":"table"}" class="w-3 h-3"></i>`,o.appendChild(A("span",{className:"truncate max-w-[120px]"},r.name));let s=A("button",{className:"flex items-center justify-center w-3.5 h-3.5 rounded hover:bg-gray-700/60 transition-all ml-0.5",dataset:{tabClose:r.id}});s.innerHTML='<i data-lucide="x" class="w-2.5 h-2.5"></i>',o.appendChild(s),e.appendChild(o)}g(e),E(e,".tab-item","click",(r,n)=>{let o=parseInt(n.dataset.tabId);isNaN(o)||(a.find(l=>l.id===o)?.type==="editor"&&(i.setKey("currentTable",null),i.setKey("currentTableData",null),i.setKey("currentTableInfo",null)),N.setActiveTab(o),y())}),E(e,"[data-tab-close]","click",(r,n)=>{r.stopPropagation();let o=parseInt(n.dataset.tabClose);isNaN(o)||(N.closeTab(o),y())})}function Oe(){let e=d("#content-area");C(e);let a=i.get(),{tabs:t,activeTabId:r}=a;if(a.currentTable&&a.currentTableData){Ue(e,a);return}if(!t.length||!r){e.innerHTML=`
      <div class="flex flex-col items-center justify-center h-full gap-4 text-gray-600">
        <i data-lucide="terminal" class="w-12 h-12 opacity-30"></i>
        <p class="text-sm">${a.activeConnectionId?"Open a table or write a query":"Connect to a database to get started"}</p>
        ${a.activeConnectionId?'<button id="btn-new-query" class="px-4 py-2 text-xs font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors"><i data-lucide="plus" class="w-3 h-3 inline-block mr-1"></i> New Query</button>':""}
      </div>
    `,d("#btn-new-query")?.addEventListener("click",()=>{i.setKey("currentTable",null),i.setKey("currentTableData",null),i.setKey("currentTableInfo",null),N.addTab("editor"),y()}),g(e);return}let n=t.find(o=>o.id===r);n?.type==="editor"&&$e(e,n,a)}function $e(e,a){let t=i.get();e.innerHTML=`
    <div class="flex flex-col h-full">
      <div class="flex items-center gap-2 px-3 py-1.5 border-b border-gray-800/60 bg-gray-900/30 shrink-0">
        <button id="btn-run" class="flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 transition-colors">
          <i data-lucide="play" class="w-3 h-3"></i> Run
        </button>
        <span class="text-[10px] text-gray-600">Ctrl+Enter</span>
        <span id="editor-status" class="text-xs ml-3 flex-1 text-gray-500"></span>
      </div>
      <div class="editor-wrapper relative" style="min-height:120px;flex:1">
        <div class="editor-gutter" id="editor-gutter">1</div>
        <pre class="editor-highlight" id="editor-highlight"></pre>
        <textarea class="editor-input" id="editor-input" spellcheck="false" autocomplete="off" placeholder="${t.activeConnectionId?"Enter SQL...":"Connect to a database first"}" ${t.activeConnectionId?"":"disabled"}>${a.sql||""}</textarea>
      </div>
    </div>
    <div id="results-panel" class="flex flex-col overflow-hidden border-t border-gray-800/60" style="min-height:100px;max-height:50%"></div>
  `,g(e);let r=d("#editor-input"),n=d("#editor-highlight"),o=d("#editor-gutter"),s=d("#editor-status");function l(){let c=r.value;n.innerHTML=ee(c)+`
`.repeat(Math.max(1,(c.match(/\n/g)||"").length+1)),o.textContent=te(c),N.updateTabSQL(a.id,c)}r.addEventListener("input",l),r.addEventListener("scroll",()=>{n.scrollTop=r.scrollTop,n.scrollLeft=r.scrollLeft,o.scrollTop=r.scrollTop}),r.addEventListener("keydown",c=>{if(c.key==="Tab"){c.preventDefault();let u=r.selectionStart;r.value=r.value.substring(0,u)+"  "+r.value.substring(r.selectionEnd),r.selectionStart=r.selectionEnd=u+2,l()}(c.ctrlKey||c.metaKey)&&c.key==="Enter"&&(c.preventDefault(),ae())}),l(),setTimeout(()=>r.focus(),50),d("#btn-run")?.addEventListener("click",ae),ne(t);let p=i.subscribe(()=>{ne(i.get()),De(d("#results-panel"))},!1)}function ne(e){let a=d("#editor-status");a&&(e.queryRunning?a.innerHTML='<i data-lucide="loader-circle" class="w-3 h-3 animate-spin inline-block mr-1"></i> Running...':e.queryError?a.innerHTML=`<i data-lucide="alert-circle" class="w-3 h-3 inline-block mr-1"></i> ${e.queryError}`:e.results?a.textContent=`${e.results.rows.length} rows in ${e.results.duration}ms`:a.textContent="Ready",g(a?.parentElement))}function De(e){if(!e)return;let a=i.get();if(a.queryRunning){e.innerHTML='<div class="flex items-center justify-center h-full gap-2 text-sm text-gray-500"><i data-lucide="loader-circle" class="w-4 h-4 animate-spin"></i> Running...</div>',g(e);return}if(a.queryError){e.innerHTML=`<div class="flex items-start gap-2 p-4 text-sm text-red-400"><i data-lucide="alert-circle" class="w-4 h-4 mt-0.5 shrink-0"></i> ${a.queryError}</div>`,g(e);return}if(!a.results?.columns?.length){e.innerHTML='<div class="flex flex-col items-center justify-center h-full gap-3 text-gray-600"><i data-lucide="arrow-up-right" class="w-8 h-8 opacity-30"></i><span class="text-xs">Run a query to see results</span></div>',g(e);return}e.innerHTML=se(a.results,!0),g(e)}async function ae(){let e=d("#editor-input")?.value?.trim();if(!(!e||!i.get().activeConnectionId))try{await q(e)}catch{}}function Ue(e,a){let t=a.currentTableData,r=a.currentTableInfo,n=a.currentTable;if(!t){e.innerHTML='<div class="flex items-center justify-center h-full text-gray-600 text-sm">Loading...</div>';return}let o=r?.columns?.find(l=>l.primaryKey)?.name||null,s=r?.columns?.map((l,p)=>`<div class="flex items-center gap-2 px-3 py-1.5 text-xs border-b border-gray-800/30 hover:bg-gray-800/20 group">
      <span class="w-28 font-medium text-gray-300">${l.name}</span>
      <span class="w-20 text-blue-400 font-mono">${l.type}</span>
      <span class="w-28 text-gray-500">${l.primaryKey?'<span class="text-amber-400 font-medium">PK</span>':""}${l.notNull?' <span class="text-gray-600">NOT NULL</span>':""}</span>
      <span class="flex-1 text-gray-600 truncate">${l.defaultValue!=null?`default: ${l.defaultValue}`:""}</span>
      <button class="btn-drop-col p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-400 transition-all text-gray-600" data-col="${l.name}" title="Drop column">
        <i data-lucide="x" class="w-3 h-3"></i>
      </button>
    </div>`).join("")||"";e.innerHTML=`
    <div class="flex flex-col h-full">
      <div class="flex items-center gap-2 px-3 py-1.5 border-b border-gray-800/60 bg-gray-900/30 shrink-0">
        <i data-lucide="table" class="w-4 h-4 text-blue-400"></i>
        <span class="text-sm font-medium text-gray-200">${w(n)}</span>
        <span class="text-xs text-gray-500">${t.total||0} rows</span>
        <button id="btn-query-table" class="ml-auto px-2 py-1 text-xs rounded-md bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 transition-colors flex items-center gap-1">
          <i data-lucide="terminal" class="w-3 h-3"></i> Query
        </button>
      </div>
      <div class="flex flex-1 overflow-hidden">
        <div class="flex-1 flex flex-col overflow-hidden">
          ${se({columns:t.columns,rows:t.rows},!0,o,a.tableFilters,a.tableSort)}
        </div>
        ${r?`<div class="w-56 shrink-0 border-l border-gray-800/60 bg-gray-900/30 overflow-y-auto hidden md:block">
          <div class="flex items-center justify-between px-3 py-2 text-[10px] text-gray-500 uppercase tracking-wider font-medium border-b border-gray-800/60">
            <span>Columns</span>
            <button id="btn-add-col-panel" class="p-0.5 rounded hover:bg-gray-700/50 hover:text-gray-400 transition-colors" title="Add Column">
              <i data-lucide="plus" class="w-3 h-3"></i>
            </button>
          </div>
          ${s}
          ${r.indexes?.length?`<div class="px-3 py-2 text-[10px] text-gray-500 uppercase tracking-wider font-medium border-b border-gray-800/60 mt-2">Indexes</div>
          ${r.indexes.map(l=>`<div class="px-3 py-1 text-xs text-gray-400">${l.name} ${l.unique?"(unique)":""}</div>`).join("")}`:""}
          ${r.foreignKeys?.length?`<div class="px-3 py-2 text-[10px] text-gray-500 uppercase tracking-wider font-medium border-b border-gray-800/60 mt-2">Foreign Keys</div>
          ${r.foreignKeys.map(l=>`<div class="px-3 py-1 text-xs text-gray-400">${l.column} \u2192 ${l.refTable}(${l.refColumn})</div>`).join("")}`:""}
        </div>`:""}
      </div>
    </div>
  `,g(e),d("#btn-query-table")?.addEventListener("click",()=>{N.addTab("editor",{connectionId:i.get().activeConnectionId,name:`Query: ${n}`,sql:`SELECT * FROM "${n}" LIMIT 100`}),y()}),E(e,".btn-add-col-inline","click",()=>Pe(e,n,o)),E(e,".btn-add-row-inline","click",()=>Fe(e,n,r,o)),d("#btn-add-col-panel")?.addEventListener("click",()=>ie(n)),E(e,".btn-drop-col",async(l,p)=>{let c=p.dataset.col;ce(`Drop column "${c}" from "${n}"?`,async()=>{await z(n,c),y()})}),Me(e,n,o,t),_e(e,n,o),Ke(e,n),Be(e,n)}function Me(e,a,t){E(e,".result-table td[data-col]","dblclick",(s,l)=>{if(l.querySelector("input, select, textarea"))return;let p=l.dataset.col,u=l.closest("tr")?.dataset?.pkVal;!t||!u||p===t||r(l,p,u,a)});function r(s,l,p,c){let u=s.closest("tr"),b=u?.closest("tbody"),f=s.querySelector(".text-gray-600.italic"),x=s.dataset.formula||(f?"":s.textContent);s.innerHTML=`<input class="cell-edit-input w-full bg-gray-800 border border-blue-500/50 rounded px-1 py-0.5 text-xs text-gray-200 outline-none" value="${w(x)}" />`;let h=s.querySelector("input");h.focus(),h.select();function R(){let k=h.value.trim(),I=k===""?null:k,G={};if(G[l]=I,I!==null&&I.startsWith("=")){let ue=n(u),pe=oe(I,ue);s.innerHTML=`<span class="formula-result text-emerald-400">${w(pe)}</span>`,s.dataset.formula=I,s.classList.add("formula-cell")}else s.innerHTML=I===null?'<span class="text-gray-600 italic">NULL</span>':w(I),delete s.dataset.formula,s.classList.remove("formula-cell");s.title=I??"",W(c,G,t,p).catch(()=>{s.innerHTML=w(x||"NULL")})}h.addEventListener("blur",R),h.addEventListener("keydown",v=>{v.key==="Enter"?(v.preventDefault(),h.blur(),o(s,"down")):v.key==="Tab"&&!v.shiftKey?(v.preventDefault(),h.blur(),o(s,"right")):v.key==="Tab"&&v.shiftKey?(v.preventDefault(),h.blur(),o(s,"left")):v.key==="Escape"&&(v.preventDefault(),s.innerHTML=f?'<span class="text-gray-600 italic">NULL</span>':w(x))})}function n(s){let l={};if(!s)return l;let p=s.querySelectorAll("td[data-col]");for(let c of p){let u=c.dataset.col,b=c.dataset.formula;if(b)l[u]=b;else{let f=c.querySelector(".text-gray-600.italic");l[u]=f?null:c.textContent}}return l}function o(s,l){let p=s.closest("tr");if(!p?.closest("tbody")||!p)return;let u=[...p.querySelectorAll("td[data-col]")],b=u.indexOf(s),f=null;if(l==="right"&&b<u.length-1)f=u[b+1];else if(l==="left"&&b>0)f=u[b-1];else if(l==="down"||l==="right"&&b>=u.length-1){let L=p.nextElementSibling;if(L&&L.tagName==="TR"&&!L.classList.contains("btn-add-row-inline")){let x=[...L.querySelectorAll("td[data-col]")];f=x[Math.min(b,x.length-1)]}}if(f&&!f.querySelector("input")){let L=f.dataset.col,x=f.closest("tr")?.dataset?.pkVal;t&&x&&L!==t&&r(f,L,x,a)}}}function _e(e,a,t){E(e,".btn-del-row",async(r,n)=>{let o=n.dataset.pkVal;!t||!o||confirm("Delete this row?")&&(await Q(a,t,o),y())})}function Ke(e,a){let t={};E(e,".filter-input","input",(r,n)=>{let o=n.dataset.filterCol,s=n.value;clearTimeout(t[o]),t[o]=setTimeout(()=>{let p={...i.get().tableFilters};s?p[o]=s:delete p[o],N.setTableFilters(p),O().then(()=>y())},250)}),E(e,".filter-input","keydown",(r,n)=>{if(r.key==="Enter"){r.preventDefault(),clearTimeout(t[n.dataset.filterCol]);let s={...i.get().tableFilters},l=n.value;l?s[n.dataset.filterCol]=l:delete s[n.dataset.filterCol],N.setTableFilters(s),O().then(()=>y())}if(r.key==="Escape"){n.value="",n.blur(),clearTimeout(t[n.dataset.filterCol]);let s={...i.get().tableFilters};delete s[n.dataset.filterCol],N.setTableFilters(s),O().then(()=>y())}}),E(e,".btn-clear-filters","click",()=>{N.setTableFilters({}),O().then(()=>y())})}function Be(e,a){E(e,".sort-th","click",(t,r)=>{let n=r.dataset.sortCol;if(t.target.closest(".btn-add-col-inline"))return;let s=i.get().tableSort,l=null;!s||s.column!==n?l={column:n,direction:"asc"}:s.direction==="asc"?l={column:n,direction:"desc"}:l=null,N.setTableSort(l),O().then(()=>y())})}function oe(e,a){if(!e||!e.startsWith("="))return e;try{let t=e.slice(1).trim();if(!t)return"";let r=Object.keys(a),n=r.map(l=>a[l]),s=new Function(...r,`try { return (${t}) } catch(e) { return '#ERR:' + e.message; }`)(...n);return s==null?"":String(s)}catch{return"#ERROR"}}function Fe(e,a,t,r){if(!t?.columns)return;let n=d("#add-row-placeholder");if(!n)return;let o=t.columns,s=o.filter(c=>!c.primaryKey||c.defaultValue===null);n.classList.remove("btn-add-row-inline","cursor-pointer"),n.innerHTML="";for(let c of o){let u=c.primaryKey,b=s.includes(c);if(u&&c.defaultValue==null)n.appendChild(A("td",{className:"text-gray-600 text-xs px-3 py-1"},"PK"));else{let f=A("input",{className:"inline-add-row-input w-full text-xs px-1.5 py-1 rounded border border-gray-700 bg-gray-800/80 text-gray-200 outline-none focus:border-blue-500/40",placeholder:c.type,dataset:{col:c.name}});c.defaultValue!=null&&(f.value=String(c.defaultValue));let L=A("td",{className:"px-1 py-1"});L.appendChild(f),n.appendChild(L)}}let l=A("td",{className:"text-center px-1 py-1"});l.innerHTML=`
    <button class="btn-inline-save-row p-0.5 rounded hover:bg-emerald-500/20 hover:text-emerald-400 text-emerald-500 transition-colors" title="Save"><i data-lucide="check" class="w-3.5 h-3.5"></i></button>
    <button class="btn-inline-cancel-row p-0.5 rounded hover:bg-red-500/20 hover:text-red-400 text-gray-500 transition-colors" title="Cancel"><i data-lucide="x" class="w-3.5 h-3.5"></i></button>
  `,n.appendChild(l),g(n);let p=n.querySelector("input");p&&setTimeout(()=>p.focus(),50),E(n,".btn-inline-save-row","click",async()=>{let c={};for(let u of M(".inline-add-row-input",n)){let b=u.value.trim();c[u.dataset.col]=b===""?null:b}await B(a,c),y()}),E(n,".btn-inline-cancel-row","click",()=>y()),n.querySelectorAll(".inline-add-row-input").forEach(c=>{c.addEventListener("keydown",u=>{if(u.key==="Enter"){u.preventDefault();let b=n.querySelector(".btn-inline-save-row");b&&b.click()}if(u.key==="Escape"){let b=n.querySelector(".btn-inline-cancel-row");b&&b.click()}})})}function Pe(e,a,t){let r=e.querySelector(".btn-add-col-inline")?.closest("th");if(!r)return;r.innerHTML=`
    <div class="flex items-center gap-0.5">
      <input id="inline-col-name" class="w-16 text-[10px] px-1 py-0.5 rounded border border-gray-700 bg-gray-800 text-gray-200 outline-none focus:border-blue-500/40" placeholder="name" autofocus />
      <select id="inline-col-type" class="w-14 text-[10px] px-1 py-0.5 rounded border border-gray-700 bg-gray-800 text-gray-200 outline-none">
        <option value="TEXT">TEXT</option>
        <option value="INTEGER">INT</option>
        <option value="REAL">REAL</option>
      </select>
      <button class="btn-inline-save-col p-0.5 rounded hover:bg-emerald-500/20 hover:text-emerald-400 text-emerald-500 transition-colors" title="Save"><i data-lucide="check" class="w-3 h-3"></i></button>
      <button class="btn-inline-cancel-col p-0.5 rounded hover:bg-red-500/20 hover:text-red-400 text-gray-500 transition-colors" title="Cancel"><i data-lucide="x" class="w-3 h-3"></i></button>
    </div>
  `,g(r);let n=d("#inline-col-name");n&&setTimeout(()=>n.focus(),50),E(r,".btn-inline-save-col","click",async()=>{let o=d("#inline-col-name")?.value?.trim(),s=d("#inline-col-type")?.value||"TEXT";o&&(await P(a,{name:o,type:s,defaultValue:null,notNull:!1}),y())}),E(r,".btn-inline-cancel-col","click",()=>y()),n&&n.addEventListener("keydown",o=>{o.key==="Enter"&&(o.preventDefault(),d(".btn-inline-save-col")?.click()),o.key==="Escape"&&d(".btn-inline-cancel-col")?.click()})}function se(e,a,t,r,n){let o=e.columns||[],s=e.rows||[];r=r||{},n=n||null;let l="";if(a){let c=Object.values(r).filter(u=>u&&u!=="").length;l+=`<div class="flex items-center gap-2 px-3 py-1 border-b border-gray-800/60 bg-gray-900/20 shrink-0 text-[11px]">
      <span class="text-gray-500">${s.length} rows</span>
      <span class="text-gray-700">\xB7</span>
      <span class="text-gray-500">${o.length} cols</span>
      ${c?`<button class="btn-clear-filters px-2 py-0.5 rounded hover:bg-gray-800 text-amber-400 hover:text-amber-300 flex items-center gap-1">
        <i data-lucide="x" class="w-3 h-3"></i> Clear ${c} filter${c>1?"s":""}
      </button>`:""}
      <button class="ml-auto px-2 py-0.5 rounded hover:bg-gray-800 text-gray-500 hover:text-gray-300 flex items-center gap-1" onclick="window.exportJSON()">
        <i data-lucide="download" class="w-3 h-3"></i> JSON
      </button>
      <button class="px-2 py-0.5 rounded hover:bg-gray-800 text-gray-500 hover:text-gray-300 flex items-center gap-1" onclick="window.exportCSV()">
        <i data-lucide="file-text" class="w-3 h-3"></i> CSV
      </button>
    </div>`}let p=o.length+(t?1:0);l+='<div class="flex-1 overflow-auto"><table class="result-table">',l+="<thead>",l+=`<tr class="sort-row">${o.map(c=>{let u=c.name||c,b=n&&n.column===u,f=b?n.direction==="asc"?"&#9650;":"&#9660;":"";return`<th class="sort-th cursor-pointer select-none hover:text-gray-200 transition-colors" data-sort-col="${u}">${u} <span class="sort-arrow text-[10px] ${b?"text-blue-400":"text-transparent"}">${f||"&#9650;"}</span></th>`}).join("")}<th class="w-9 px-1"><button class="btn-add-col-inline flex items-center justify-center w-full h-full p-0.5 rounded hover:bg-blue-500/20 hover:text-blue-400 transition-colors text-gray-600" title="Add column"><i data-lucide="plus" class="w-3.5 h-3.5"></i></button></th>${t?'<th class="w-8"></th>':""}</tr>`,l+=`<tr class="filter-row">${o.map(c=>{let u=c.name||c,b=r[u]||"";return`<td class="filter-td px-1 py-1"><input class="filter-input w-full text-[11px] px-1.5 py-1 rounded border border-gray-700/50 bg-gray-800/50 text-gray-300 outline-none placeholder-gray-600 focus:border-blue-500/40 focus:bg-gray-800 transition-all" data-filter-col="${u}" value="${w(b)}" placeholder="filter" /></td>`}).join("")}<td class="px-1"></td>${t?'<td class="w-8"></td>':""}</tr>`,l+="</thead>",l+="<tbody>";for(let c=0;c<s.length;c++){let u=s[c],b=t?u[t]:null;l+=`<tr${t?` data-pk-col="${t}" data-pk-val="${b!=null?w(String(b)):""}"`:""} data-row-idx="${c}">`;for(let f of o){let L=f.name||f,x=u[L],h,R=!1,v="";if(x!=null&&typeof x=="string"&&x.startsWith("=")){R=!0;let k=oe(x,u);v=` data-formula="${w(x)}"`,h=`<span class="formula-result text-emerald-400">${w(k)}</span>`}else x==null?h='<span class="text-gray-600 italic">NULL</span>':typeof x=="object"?h=`<span title="${w(String(x))}">${w(JSON.stringify(x))}</span>`:h=w(String(x));l+=`<td data-col="${L}"${v} title="${w(String(x??""))}" class="cursor-pointer hover:bg-blue-500/5 transition-colors${R?" formula-cell":""}">${h}</td>`}l+='<td class="text-center add-cell"></td>',t&&(l+=`<td class="text-center"><button class="btn-del-row p-0.5 rounded hover:bg-red-500/20 hover:text-red-400 text-gray-600 transition-colors" data-pk-val="${b!=null?w(String(b)):""}" title="Delete row"><i data-lucide="trash-2" class="w-3 h-3"></i></button></td>`),l+="</tr>"}return l+=`<tr class="btn-add-row-inline cursor-pointer hover:bg-blue-500/5 transition-colors" id="add-row-placeholder"><td colspan="${p+1}" class="text-center py-2 text-gray-600 hover:text-blue-400 text-xs"><span class="flex items-center justify-center gap-1"><i data-lucide="plus" class="w-3.5 h-3.5"></i> Add Row</span></td></tr>`,l+="</tbody></table></div>",l}function le(){let e=d("#modal-overlay");e.classList.remove("hidden");let a=d("#modal-content");C(a),a.innerHTML=`
    <form id="create-table-form" class="fade-in">
      <div class="flex items-center justify-between px-5 py-3 border-b border-gray-800">
        <h2 class="text-sm font-semibold text-gray-200"><i data-lucide="layers" class="w-4 h-4 text-blue-400 inline-block mr-1.5"></i> Create Table</h2>
        <button type="button" id="modal-close" class="w-6 h-6 flex items-center justify-center rounded-md text-gray-500 hover:text-gray-200 hover:bg-gray-800 transition-all">
          <i data-lucide="x" class="w-4 h-4"></i>
        </button>
      </div>
      <div class="px-5 py-4 space-y-4">
        <div>
          <label class="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1">Table Name</label>
          <input id="ct-name" class="w-full text-sm px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 text-gray-200 outline-none placeholder-gray-500 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-colors" placeholder="my_table" required autofocus>
        </div>
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Columns</label>
            <button type="button" id="ct-add-col" class="text-xs px-2 py-1 rounded bg-gray-800 text-gray-400 hover:text-gray-200 border border-gray-700 transition-all flex items-center gap-1">
              <i data-lucide="plus" class="w-3 h-3"></i> Add Column
            </button>
          </div>
          <div id="ct-columns" class="space-y-2 max-h-[40vh] overflow-y-auto">
            <div class="ct-col-row flex items-center gap-2 p-2 rounded-lg bg-gray-800/50 border border-gray-700/50">
              <input class="ct-col-name flex-1 text-xs px-2 py-1 rounded border border-gray-700 bg-gray-800/80 text-gray-200 outline-none focus:border-blue-500/50" placeholder="name" value="id" required>
              <select class="ct-col-type text-xs px-2 py-1 rounded border border-gray-700 bg-gray-800/80 text-gray-200 outline-none focus:border-blue-500/50">
                <option value="INTEGER" selected>INTEGER</option>
                <option value="TEXT">TEXT</option>
                <option value="REAL">REAL</option>
                <option value="BLOB">BLOB</option>
                <option value="BOOLEAN">BOOLEAN</option>
                <option value="DATE">DATE</option>
              </select>
              <label class="flex items-center gap-1 text-[10px] text-gray-500 whitespace-nowrap"><input type="checkbox" class="ct-col-pk" checked> PK</label>
              <label class="flex items-center gap-1 text-[10px] text-gray-500 whitespace-nowrap"><input type="checkbox" class="ct-col-ai" checked> AI</label>
              <label class="flex items-center gap-1 text-[10px] text-gray-500 whitespace-nowrap"><input type="checkbox" class="ct-col-nn" checked> NN</label>
              <button type="button" class="ct-remove-col p-1 rounded hover:bg-red-500/20 hover:text-red-400 text-gray-600 transition-all"><i data-lucide="x" class="w-3 h-3"></i></button>
            </div>
            <div class="ct-col-row flex items-center gap-2 p-2 rounded-lg bg-gray-800/50 border border-gray-700/50">
              <input class="ct-col-name flex-1 text-xs px-2 py-1 rounded border border-gray-700 bg-gray-800/80 text-gray-200 outline-none focus:border-blue-500/50" placeholder="name" required>
              <select class="ct-col-type text-xs px-2 py-1 rounded border border-gray-700 bg-gray-800/80 text-gray-200 outline-none focus:border-blue-500/50">
                <option value="TEXT" selected>TEXT</option>
                <option value="INTEGER">INTEGER</option>
                <option value="REAL">REAL</option>
                <option value="BLOB">BLOB</option>
                <option value="BOOLEAN">BOOLEAN</option>
                <option value="DATE">DATE</option>
              </select>
              <label class="flex items-center gap-1 text-[10px] text-gray-500 whitespace-nowrap"><input type="checkbox" class="ct-col-pk"> PK</label>
              <label class="flex items-center gap-1 text-[10px] text-gray-500 whitespace-nowrap"><input type="checkbox" class="ct-col-ai"> AI</label>
              <label class="flex items-center gap-1 text-[10px] text-gray-500 whitespace-nowrap"><input type="checkbox" class="ct-col-nn"> NN</label>
              <button type="button" class="ct-remove-col p-1 rounded hover:bg-red-500/20 hover:text-red-400 text-gray-600 transition-all"><i data-lucide="x" class="w-3 h-3"></i></button>
            </div>
          </div>
        </div>
      </div>
      <div class="flex items-center justify-end gap-2 px-5 py-3 border-t border-gray-800 bg-gray-900/50">
        <button type="button" id="modal-cancel" class="text-xs px-3 py-1.5 rounded-lg border border-gray-700 bg-gray-800 text-gray-400 hover:text-gray-200 transition-all">Cancel</button>
        <button type="submit" class="text-xs font-semibold px-4 py-1.5 rounded-lg text-white bg-blue-600 hover:bg-blue-500 transition-all">Create Table</button>
      </div>
    </form>
  `,g(a),d("#modal-close").addEventListener("click",T),d("#modal-cancel").addEventListener("click",T),e.addEventListener("click",t=>{t.target===e&&T()}),document.addEventListener("keydown",function t(r){r.key==="Escape"&&(T(),document.removeEventListener("keydown",t))}),d("#ct-add-col").addEventListener("click",()=>{let t=d("#ct-columns"),r=document.createElement("div");r.className="ct-col-row flex items-center gap-2 p-2 rounded-lg bg-gray-800/50 border border-gray-700/50",r.innerHTML=`
      <input class="ct-col-name flex-1 text-xs px-2 py-1 rounded border border-gray-700 bg-gray-800/80 text-gray-200 outline-none focus:border-blue-500/50" placeholder="name" required>
      <select class="ct-col-type text-xs px-2 py-1 rounded border border-gray-700 bg-gray-800/80 text-gray-200 outline-none focus:border-blue-500/50">
        <option value="TEXT" selected>TEXT</option>
        <option value="INTEGER">INTEGER</option>
        <option value="REAL">REAL</option>
        <option value="BLOB">BLOB</option>
        <option value="BOOLEAN">BOOLEAN</option>
        <option value="DATE">DATE</option>
      </select>
      <label class="flex items-center gap-1 text-[10px] text-gray-500 whitespace-nowrap"><input type="checkbox" class="ct-col-pk"> PK</label>
      <label class="flex items-center gap-1 text-[10px] text-gray-500 whitespace-nowrap"><input type="checkbox" class="ct-col-ai"> AI</label>
      <label class="flex items-center gap-1 text-[10px] text-gray-500 whitespace-nowrap"><input type="checkbox" class="ct-col-nn"> NN</label>
      <button type="button" class="ct-remove-col p-1 rounded hover:bg-red-500/20 hover:text-red-400 text-gray-600 transition-all"><i data-lucide="x" class="w-3 h-3"></i></button>
    `,t.appendChild(r),g(r)}),E(d("#ct-columns"),".ct-remove-col","click",(t,r)=>{let n=r.closest(".ct-col-row");d("#ct-columns").children.length>1&&n.remove()}),d("#create-table-form").addEventListener("submit",async t=>{t.preventDefault();let r=d("#ct-name").value.trim();if(!r)return;let n=[];for(let o of M(".ct-col-row")){let s=o.querySelector(".ct-col-name").value.trim();s&&n.push({name:s,type:o.querySelector(".ct-col-type").value,primaryKey:o.querySelector(".ct-col-pk").checked,autoIncrement:o.querySelector(".ct-col-ai").checked,notNull:o.querySelector(".ct-col-nn").checked})}n.length&&(await F(r,n),T(),y())}),setTimeout(()=>d("#ct-name")?.focus(),100)}function ie(e){let a=d("#modal-overlay");a.classList.remove("hidden");let t=d("#modal-content");C(t),t.innerHTML=`
    <form id="add-col-form" class="fade-in">
      <div class="flex items-center justify-between px-5 py-3 border-b border-gray-800">
        <h2 class="text-sm font-semibold text-gray-200"><i data-lucide="columns" class="w-4 h-4 text-blue-400 inline-block mr-1.5"></i> Add Column \u2014 ${w(e)}</h2>
        <button type="button" id="modal-close" class="w-6 h-6 flex items-center justify-center rounded-md text-gray-500 hover:text-gray-200 hover:bg-gray-800 transition-all">
          <i data-lucide="x" class="w-4 h-4"></i>
        </button>
      </div>
      <div class="px-5 py-4 space-y-4">
        <div>
          <label class="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1">Column Name</label>
          <input id="ac-name" class="w-full text-sm px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 text-gray-200 outline-none placeholder-gray-500 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-colors" placeholder="column_name" required autofocus>
        </div>
        <div>
          <label class="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1">Type</label>
          <select id="ac-type" class="w-full text-sm px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 text-gray-200 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-colors">
            <option value="TEXT">TEXT</option>
            <option value="INTEGER">INTEGER</option>
            <option value="REAL">REAL</option>
            <option value="BLOB">BLOB</option>
            <option value="BOOLEAN">BOOLEAN</option>
            <option value="DATE">DATE</option>
          </select>
        </div>
        <div>
          <label class="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1">Default Value</label>
          <input id="ac-default" class="w-full text-sm px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 text-gray-200 outline-none placeholder-gray-500 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-colors" placeholder="(none)">
        </div>
        <div class="flex items-center gap-4">
          <label class="flex items-center gap-2 text-xs text-gray-400 cursor-pointer"><input type="checkbox" id="ac-notnull"> NOT NULL</label>
        </div>
      </div>
      <div class="flex items-center justify-end gap-2 px-5 py-3 border-t border-gray-800 bg-gray-900/50">
        <button type="button" id="modal-cancel" class="text-xs px-3 py-1.5 rounded-lg border border-gray-700 bg-gray-800 text-gray-400 hover:text-gray-200 transition-all">Cancel</button>
        <button type="submit" class="text-xs font-semibold px-4 py-1.5 rounded-lg text-white bg-blue-600 hover:bg-blue-500 transition-all">Add Column</button>
      </div>
    </form>
  `,g(t),d("#modal-close").addEventListener("click",T),d("#modal-cancel").addEventListener("click",T),a.addEventListener("click",r=>{r.target===a&&T()}),document.addEventListener("keydown",function r(n){n.key==="Escape"&&(T(),document.removeEventListener("keydown",r))}),d("#add-col-form").addEventListener("submit",async r=>{r.preventDefault();let n=d("#ac-name").value.trim(),o=d("#ac-type").value,s=d("#ac-default").value.trim()||null,l=d("#ac-notnull").checked;n&&(await P(e,{name:n,type:o,defaultValue:s,notNull:l}),T(),y())}),setTimeout(()=>d("#ac-name")?.focus(),100)}function Ge(e){let a=d("#modal-overlay");a.classList.remove("hidden");let t=d("#modal-content");C(t),t.innerHTML=`
    <form id="rename-table-form" class="fade-in">
      <div class="flex items-center justify-between px-5 py-3 border-b border-gray-800">
        <h2 class="text-sm font-semibold text-gray-200"><i data-lucide="edit-3" class="w-4 h-4 text-blue-400 inline-block mr-1.5"></i> Rename Table</h2>
        <button type="button" id="modal-close" class="w-6 h-6 flex items-center justify-center rounded-md text-gray-500 hover:text-gray-200 hover:bg-gray-800 transition-all">
          <i data-lucide="x" class="w-4 h-4"></i>
        </button>
      </div>
      <div class="px-5 py-4 space-y-4">
        <div>
          <label class="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1">Current Name</label>
          <div class="text-sm px-3 py-2 rounded-lg border border-gray-700 bg-gray-800/50 text-gray-400">${w(e)}</div>
        </div>
        <div>
          <label class="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1">New Name</label>
          <input id="rn-name" class="w-full text-sm px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 text-gray-200 outline-none placeholder-gray-500 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-colors" value="${w(e)}" required autofocus>
        </div>
      </div>
      <div class="flex items-center justify-end gap-2 px-5 py-3 border-t border-gray-800 bg-gray-900/50">
        <button type="button" id="modal-cancel" class="text-xs px-3 py-1.5 rounded-lg border border-gray-700 bg-gray-800 text-gray-400 hover:text-gray-200 transition-all">Cancel</button>
        <button type="submit" class="text-xs font-semibold px-4 py-1.5 rounded-lg text-white bg-blue-600 hover:bg-blue-500 transition-all">Rename</button>
      </div>
    </form>
  `,g(t),d("#modal-close").addEventListener("click",T),d("#modal-cancel").addEventListener("click",T),a.addEventListener("click",r=>{r.target===a&&T()}),document.addEventListener("keydown",function r(n){n.key==="Escape"&&(T(),document.removeEventListener("keydown",r))}),d("#rename-table-form").addEventListener("submit",async r=>{r.preventDefault();let n=d("#rn-name").value.trim();!n||n===e||(await Z(e,n),T(),y())}),setTimeout(()=>d("#rn-name")?.focus(),100)}function ce(e,a){let t=d("#modal-overlay");t.classList.remove("hidden");let r=d("#modal-content");C(r),r.innerHTML=`
    <div class="fade-in">
      <div class="flex items-center justify-between px-5 py-3 border-b border-gray-800">
        <h2 class="text-sm font-semibold text-gray-200"><i data-lucide="alert-triangle" class="w-4 h-4 text-amber-400 inline-block mr-1.5"></i> Confirm</h2>
        <button type="button" id="modal-close" class="w-6 h-6 flex items-center justify-center rounded-md text-gray-500 hover:text-gray-200 hover:bg-gray-800 transition-all">
          <i data-lucide="x" class="w-4 h-4"></i>
        </button>
      </div>
      <div class="px-5 py-6 text-sm text-gray-300">${e}</div>
      <div class="flex items-center justify-end gap-2 px-5 py-3 border-t border-gray-800 bg-gray-900/50">
        <button type="button" id="modal-cancel" class="text-xs px-3 py-1.5 rounded-lg border border-gray-700 bg-gray-800 text-gray-400 hover:text-gray-200 transition-all">Cancel</button>
        <button type="button" id="modal-confirm" class="text-xs font-semibold px-4 py-1.5 rounded-lg text-white bg-red-600 hover:bg-red-500 transition-all">Confirm</button>
      </div>
    </div>
  `,g(r);let n=()=>T();d("#modal-close").addEventListener("click",n),d("#modal-cancel").addEventListener("click",n),t.addEventListener("click",o=>{o.target===t&&n()}),document.addEventListener("keydown",function o(s){s.key==="Escape"&&(n(),document.removeEventListener("keydown",o))}),d("#modal-confirm").addEventListener("click",()=>{T(),a()})}function He(){let e=d("#footer"),a=i.get();e.innerHTML=`
    <div class="flex items-center gap-3 px-3 py-[3px] text-[11px] text-gray-500">
      <button id="btn-new-tab" class="flex items-center gap-1 hover:text-gray-300 transition-colors cursor-pointer py-[1px]">
        <i data-lucide="plus" class="w-2.5 h-2.5"></i> New Tab
      </button>
      <span class="w-px h-3 bg-gray-800"></span>
      <button id="btn-new-table-footer" class="flex items-center gap-1 hover:text-gray-300 transition-colors cursor-pointer py-[1px]">
        <i data-lucide="layers" class="w-2.5 h-2.5"></i> New Table
      </button>
      <span class="w-px h-3 bg-gray-800"></span>
      <button id="btn-theme" class="flex items-center justify-center hover:text-gray-300 transition-colors cursor-pointer py-[1px]">
        <i data-lucide="${a.theme==="dark"?"moon":"sun"}" class="w-2.5 h-2.5"></i>
      </button>
      <a href="https://github.com/anomalyco/zrow" target="_blank" class="flex items-center justify-center hover:text-gray-300 transition-colors py-[1px]">
        <svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
      </a>
      <span class="flex-1"></span>
      <span>${a.activeConnectionId?`${(a.tables||[]).length} tables`:""}</span>
    </div>
  `,d("#btn-new-tab")?.addEventListener("click",()=>{N.addTab("editor"),y()}),d("#btn-new-table-footer")?.addEventListener("click",()=>le()),d("#btn-theme")?.addEventListener("click",N.toggleTheme),g(e)}function re(e){let a=d("#modal-overlay");a.classList.remove("hidden");let t=d("#modal-content");C(t);let r=e?.database&&e.database!==":memory:";t.innerHTML=`
    <form id="conn-form" class="fade-in">
      <div class="flex items-center justify-between px-5 py-3 border-b border-gray-800">
        <h2 class="text-sm font-semibold text-gray-200">${e?"Edit":"New"} Database</h2>
        <button type="button" id="modal-close" class="w-6 h-6 flex items-center justify-center rounded-md text-gray-500 hover:text-gray-200 hover:bg-gray-800 transition-all">
          <i data-lucide="x" class="w-4 h-4"></i>
        </button>
      </div>
      <div class="px-5 py-4 space-y-4">
        <div>
          <label class="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1">Name</label>
          <input class="w-full text-sm px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 text-gray-200 outline-none placeholder-gray-500 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-colors" id="conn-name" value="${e?.name||""}" placeholder="My Database" autofocus>
        </div>
        <div>
          <label class="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1">Storage</label>
          <div class="flex gap-3">
            <label class="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 cursor-pointer hover:border-gray-600 transition-colors flex-1">
              <input type="radio" name="conn-storage" value="memory" ${r?"":"checked"}>
              <i data-lucide="cpu" class="w-4 h-4 text-gray-400"></i>
              <span class="text-xs text-gray-300">In-Memory</span>
            </label>
            <label class="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 cursor-pointer hover:border-gray-600 transition-colors flex-1">
              <input type="radio" name="conn-storage" value="persist" ${r?"checked":""}>
              <i data-lucide="hard-drive" class="w-4 h-4 text-gray-400"></i>
              <span class="text-xs text-gray-300">Persistent</span>
            </label>
          </div>
        </div>
        <div id="db-name-group" class="${r?"":"hidden"}">
          <label class="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1">Database Name</label>
          <input class="w-full text-sm px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 text-gray-200 outline-none placeholder-gray-500 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-colors" id="conn-db" value="${r?e.database:"my_database"}" placeholder="my_database">
        </div>
        <div>
          <label class="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1">Auto-seed demo data</label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" id="conn-seed" ${!e||e.seed!==!1?"checked":""}>
            <span class="text-xs text-gray-400">Pre-populate with sample tables and data</span>
          </label>
        </div>
      </div>
      <div class="flex items-center justify-end gap-2 px-5 py-3 border-t border-gray-800 bg-gray-900/50">
        <button type="button" id="modal-cancel" class="text-xs px-3 py-1.5 rounded-lg border border-gray-700 bg-gray-800 text-gray-400 hover:text-gray-200 transition-all">Cancel</button>
        <button type="submit" class="text-xs font-semibold px-4 py-1.5 rounded-lg text-white bg-blue-600 hover:bg-blue-500 transition-all">${e?"Save":"Create"}</button>
      </div>
    </form>
  `,g(t),d("#modal-close").addEventListener("click",T),d("#modal-cancel").addEventListener("click",T),a.addEventListener("click",n=>{n.target===a&&T()}),document.addEventListener("keydown",function n(o){o.key==="Escape"&&(T(),document.removeEventListener("keydown",n))}),M('input[name="conn-storage"]').forEach(n=>{n.addEventListener("change",()=>{d("#db-name-group").classList.toggle("hidden",d('input[name="conn-storage"]:checked')?.value==="memory")})}),d("#conn-form").addEventListener("submit",async n=>{n.preventDefault();let o=d("#conn-name").value.trim();if(!o)return;let s=d('input[name="conn-storage"]:checked')?.value,l=d("#conn-db")?.value?.trim()||o,p=s==="persist"?l:":memory:",c=d("#conn-seed")?.checked!==!1,u=N.addConnection({...e||{},name:o,database:p,seed:c});T(),i.setKey("statusText",`Connecting to ${o}...`),y();try{let b=i.get().connections.find(f=>f.id===u);b&&await K(b),y()}catch(b){i.setKey("statusText",`Error: ${b.message}`),y()}}),setTimeout(()=>d("#conn-name")?.focus(),100)}function T(){d("#modal-overlay").classList.add("hidden")}window.exportJSON=function(){let e=i.get(),a=e.results||(e.currentTableData?{columns:e.currentTableData.columns,rows:e.currentTableData.rows}:null);if(!a)return;let t=a.columns.map(n=>n.name||n),r=a.rows.map(n=>{let o={};return t.forEach(s=>o[s]=n[s]),o});de(JSON.stringify(r,null,2),"results.json","application/json")};window.exportCSV=function(){let e=i.get(),a=e.results||(e.currentTableData?{columns:e.currentTableData.columns,rows:e.currentTableData.rows}:null);if(!a)return;let t=a.columns.map(o=>o.name||o),r=o=>{let s=o==null?"":String(o);return s.includes(",")||s.includes('"')||s.includes(`
`)?'"'+s.replace(/"/g,'""')+'"':s},n=[t.map(r).join(","),...a.rows.map(o=>t.map(s=>r(o[s])).join(","))];de(n.join(`
`),"results.csv","text/csv")};function de(e,a,t){let r=new Blob([e],{type:t}),n=document.createElement("a");n.href=URL.createObjectURL(r),n.download=a,n.click(),URL.revokeObjectURL(n.href)}
