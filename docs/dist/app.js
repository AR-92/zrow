var j=e=>{let a=structuredClone(e),n=new Set,o=new Map,t={get(){return a},set(r){let s=a;a=typeof r=="function"?r(s):r,n.forEach(i=>{try{i(a,s)}catch(d){console.error("Listener error:",d)}})},update(r){t.set(r)},setKey(r,s){t.set(i=>({...i,[r]:typeof s=="function"?s(i[r]):s}))},subscribe(r,s=!1){return n.add(r),s&&r(a,a),()=>n.delete(r)},select(r,s){let i=r(a);return t.subscribe(d=>{let p=r(d);Object.is(i,p)||(s(p,i),i=p)})},on(r,s){return o.has(r)||o.set(r,new Set),o.get(r).add(s),()=>t.off(r,s)},once(r,s){let i=t.on(r,(...d)=>{i(),s(...d)});return i},off(r,s){if(!r){o.clear();return}let i=o.get(r);if(i){if(!s){i.clear();return}i.delete(s)}},emit(r,s){let i=o.get(r);if(i)for(let d of i)try{d({type:r,data:s,state:a})}catch(p){console.error(`Event "${r}" error:`,p)}},destroy(){n.clear(),o.clear()}};return t};var ye=`
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
`;function V(e,a){let n=ye.split(";").filter(o=>o.trim());for(let o of n)try{a(o+";")}catch(t){console.warn("Seed statement failed (likely already exists):",t.message)}}function X(){return new Promise((e,a)=>{let n=indexedDB.open("zrow_dbs",1);n.onupgradeneeded=o=>{let t=o.target.result;t.objectStoreNames.contains("dbs")||t.createObjectStore("dbs",{keyPath:"id"})},n.onsuccess=o=>e(o.target.result),n.onerror=()=>a(new Error("Failed to open IndexedDB"))})}async function me(e){let a=await X();return new Promise((n,o)=>{let r=a.transaction("dbs","readonly").objectStore("dbs").get(e);r.onsuccess=()=>{a.close(),n(r.result?.data||null)},r.onerror=()=>{a.close(),o(new Error("Failed to read DB"))}})}async function fe(e,a){let n=await X();return new Promise((o,t)=>{let r=n.transaction("dbs","readwrite");r.objectStore("dbs").put({id:e,data:a,updated:Date.now()}),r.oncomplete=()=>{n.close(),o()},r.onerror=()=>{n.close(),t()}})}var D=class{constructor(){this._db=null,this._SQL=null,this._name=null}async open(a,n){if(this._name=a,this._SQL=await window.initSqlJs({locateFile:o=>(n||"dist/vendor/")+o}),this._db=new this._SQL.Database,a&&a!==":memory:")try{let o=await me(a);o&&(this._db=new this._SQL.Database(o))}catch{}return this}seedIfEmpty(){try{let a=this._db.exec("SELECT count(*) as cnt FROM sqlite_master WHERE type='table'");if(a.length&&a[0].values[0][0]>0)return}catch{}V(this._db,a=>this._db.exec(a))}async save(){if(this._name&&this._name!==":memory:"&&this._db)try{await fe(this._name,this._db.export())}catch{}}exec(a){let n=performance.now(),o=this._db.exec(a),t=[],r=[],s=this._db.getRowsModified();for(let d of o)d.columns?.length&&(t=d.columns.map(p=>({name:p,type:"text"})),r=d.values.map(p=>{let u={};return d.columns.forEach((b,y)=>{u[b]=p[y]}),u}));return/^\s*(INSERT|UPDATE|DELETE|CREATE|DROP|ALTER)/i.test(a)&&this.save(),{columns:t,rows:r,affectedRows:s,duration:Math.round(performance.now()-n)}}getTables(){let a=this._db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name");return a.length?a[0].values.map(n=>{let o=n[0],t=this._db.exec(`PRAGMA table_info("${o}")`),r=t.length?t[0].values.map(s=>({name:s[1],type:s[2],nullable:!s[3],defaultValue:s[4],primaryKey:!!s[5]})):[];return{name:o,type:"table",columns:r}}):[]}_escapeId(a){return`"${a.replace(/"/g,'""')}"`}_escapeLike(a){return a.replace(/'/g,"''").replace(/%/g,"\\%").replace(/_/g,"\\_")}getTableData(a,{limit:n=200,offset:o=0,filters:t={},sort:r=null}={}){try{let s="",i=[];for(let[v,R]of Object.entries(t)){if(R===""||R==null)continue;let L=this._escapeId(v);R==="__NULL__"?i.push(`${L} IS NULL`):R==="__NOTNULL__"?i.push(`${L} IS NOT NULL`):i.push(`${L} LIKE '%${this._escapeLike(R)}%' ESCAPE '\\'`)}i.length&&(s=" WHERE "+i.join(" AND "));let d="";if(r&&r.column){let v=r.direction==="desc"?"DESC":"ASC";d=` ORDER BY ${this._escapeId(r.column)} ${v}`}let p=`SELECT * FROM ${this._escapeId(a)}${s}${d} LIMIT ${n} OFFSET ${o}`,u=this._db.exec(p),b=this._db.exec(`SELECT COUNT(*) as cnt FROM ${this._escapeId(a)}${s}`),y=b.length?b[0].values[0][0]:0;if(!u.length)return{columns:[],rows:[],total:0};let x=u[0].columns.map(v=>({name:v,type:"text"})),f=u[0].values.map(v=>{let R={};return u[0].columns.forEach((L,k)=>{R[L]=v[k]}),R});return{columns:x,rows:f,total:y}}catch{return{columns:[],rows:[],total:0}}}updateRow(a,n,o){let t=Object.entries(n).filter(([r])=>r!=="id").map(([r,s])=>`"${r}" = ${s===null?"NULL":typeof s=="string"?`'${s.replace(/'/g,"''")}'`:s}`).join(", ");t&&this.exec(`UPDATE "${a}" SET ${t} WHERE id = ${typeof o=="string"&&isNaN(Number(o))?`'${o}'`:o}`)}deleteRow(a,n){this.exec(`DELETE FROM "${a}" WHERE id = ${typeof n=="string"&&isNaN(Number(n))?`'${n}'`:n}`)}updateRowByPk(a,n,o,t){let r=Object.entries(n).filter(([s])=>s!==o).map(([s,i])=>`"${s}" = ${i===null?"NULL":typeof i=="string"?`'${i.replace(/'/g,"''")}'`:i}`).join(", ");r&&this.exec(`UPDATE "${a}" SET ${r} WHERE "${o}" = ${typeof t=="string"&&isNaN(Number(t))?`'${t.replace(/'/g,"''")}'`:t}`)}deleteRowByPk(a,n,o){this.exec(`DELETE FROM "${a}" WHERE "${n}" = ${typeof o=="string"&&isNaN(Number(o))?`'${o.replace(/'/g,"''")}'`:o}`)}insertRow(a,n){let o=Object.keys(n).map(r=>`"${r}"`),t=Object.values(n).map(r=>r==null?"NULL":typeof r=="string"?`'${r.replace(/'/g,"''")}'`:r);this.exec(`INSERT INTO "${a}" (${o.join(", ")}) VALUES (${t.join(", ")})`)}createTable(a,n){let o=n.map(t=>{let r=`"${t.name}" ${t.type}`;return t.primaryKey&&(r+=" PRIMARY KEY"),t.autoIncrement&&(r+=" AUTOINCREMENT"),t.notNull&&(r+=" NOT NULL"),t.defaultValue!=null&&t.defaultValue!==""&&(r+=` DEFAULT ${typeof t.defaultValue=="string"?`'${t.defaultValue}'`:t.defaultValue}`),t.unique&&(r+=" UNIQUE"),r});this.exec(`CREATE TABLE "${a}" (${o.join(", ")})`)}dropTable(a){this.exec(`DROP TABLE IF EXISTS "${a}"`)}addColumn(a,n){let o=`"${n.name}" ${n.type}`;n.notNull&&(o+=" NOT NULL"),n.defaultValue!=null&&n.defaultValue!==""&&(o+=` DEFAULT ${typeof n.defaultValue=="string"?`'${n.defaultValue}'`:n.defaultValue}`),this.exec(`ALTER TABLE "${a}" ADD COLUMN ${o}`)}dropColumn(a,n){this.exec(`ALTER TABLE "${a}" DROP COLUMN "${n}"`)}renameTable(a,n){this.exec(`ALTER TABLE "${a}" RENAME TO "${n}"`)}getTableInfo(a){let n=this._db.exec(`PRAGMA table_info("${a}")`),o=this._db.exec(`PRAGMA index_list("${a}")`),t=this._db.exec(`PRAGMA foreign_key_list("${a}")`);return{columns:n.length?n[0].values.map(r=>({cid:r[0],name:r[1],type:r[2],notNull:!!r[3],defaultValue:r[4],primaryKey:!!r[5]})):[],indexes:o.length?o[0].values.map(r=>({name:r[1],unique:!r[2],origin:r[3]})):[],foreignKeys:t.length?t[0].values.map(r=>({column:r[3],refTable:r[2],refColumn:r[4]})):[]}}};function ge(){try{return JSON.parse(localStorage.getItem("zrow_connections")||"[]")}catch{return[]}}function Y(e){localStorage.setItem("zrow_connections",JSON.stringify(e))}var xe=Date.now();function he(){return++xe}var ve={theme:localStorage.getItem("zrow_theme")||"dark",connections:ge(),activeConnectionId:null,tabs:[],activeTabId:null,statusText:"Ready",results:null,queryRunning:!1,queryError:null,tables:[],currentTable:null,currentTableData:null,currentTableInfo:null,sidebarView:"tables",recordCount:null,tableFilters:{},tableSort:null,sidebarCollapsed:JSON.parse(localStorage.getItem("zrow_sidebar_collapsed")||"false"),sidebarWidth:parseInt(localStorage.getItem("zrow_sidebar_width")||"224"),schemaPanelWidth:224,resultsPanelHeight:200,schemaPanelCollapsed:!1},l=j(ve),T={toggleTheme(){let e=l.get().theme==="dark"?"light":"dark";l.setKey("theme",e),localStorage.setItem("zrow_theme",e),document.documentElement.classList.toggle("dark",e==="dark")},addConnection(e){let{connections:a}=l.get(),n=e.id||"conn_"+Date.now(),o=e.id?a.map(t=>t.id===e.id?{...e}:t):[...a,{...e,id:n}];return l.setKey("connections",o),Y(o),n},deleteConnection(e){let{connections:a,activeConnectionId:n,tabs:o}=l.get(),t=a.filter(r=>r.id!==e);l.setKey("connections",t),Y(t),l.setKey("tabs",o.filter(r=>r.connectionId!==e)),n===e&&(l.setKey("activeConnectionId",null),l.setKey("tables",[]),l.setKey("currentTable",null),l.setKey("currentTableData",null))},setActiveConnection(e){l.setKey("activeConnectionId",e)},addTab(e="editor",a={}){let{tabs:n,activeConnectionId:o}=l.get(),t=he(),r={id:t,type:e,name:a.name||(e==="editor"?`Query ${n.filter(s=>s.type==="editor").length+1}`:a.tableName||"Table"),connectionId:a.connectionId||o,sql:a.sql||"",tableName:a.tableName||null};return l.setKey("tabs",[...n,r]),l.setKey("activeTabId",t),t},closeTab(e){let{tabs:a,activeTabId:n}=l.get(),o=a.findIndex(r=>r.id===e),t=a.filter(r=>r.id!==e);if(l.setKey("tabs",t),n===e){let r=Math.min(o,t.length-1);l.setKey("activeTabId",t.length?t[Math.max(0,r)].id:null)}},setActiveTab(e){l.setKey("activeTabId",e)},updateTabSQL(e,a){l.setKey("tabs",l.get().tabs.map(n=>n.id===e?{...n,sql:a}:n))},setStatus(e){l.setKey("statusText",e)},setResults(e){l.setKey("results",e),l.setKey("queryError",null)},setQueryError(e){l.setKey("queryError",e),l.setKey("results",null)},setQueryRunning(e){l.setKey("queryRunning",e)},setTables(e){l.setKey("tables",e)},setCurrentTable(e){l.setKey("currentTable",e)},setCurrentTableData(e){l.setKey("currentTableData",e)},setCurrentTableInfo(e){l.setKey("currentTableInfo",e)},setSidebarView(e){l.setKey("sidebarView",e)},setRecordCount(e){l.setKey("recordCount",e)},setTableFilters(e){l.setKey("tableFilters",e)},setTableSort(e){l.setKey("tableSort",e)},clearTableFilters(){l.setKey("tableFilters",{})},toggleSidebar(){let e=!l.get().sidebarCollapsed;l.setKey("sidebarCollapsed",e),localStorage.setItem("zrow_sidebar_collapsed",JSON.stringify(e))},toggleSchemaPanel(){l.setKey("schemaPanelCollapsed",!l.get().schemaPanelCollapsed)},setSidebarWidth(e){l.setKey("sidebarWidth",e),localStorage.setItem("zrow_sidebar_width",String(e))},setSchemaPanelWidth(e){l.setKey("schemaPanelWidth",e)},setResultsPanelHeight(e){l.setKey("resultsPanelHeight",e)}};var g=null;function _(){return g}async function K(e){let a=new D;return await a.open(e.database||e.name,e.wasmPath),e.seed!==!1&&a.seedIfEmpty(),g=a,l.setKey("activeConnectionId",e.id),l.setKey("tables",a.getTables()),l.setKey("statusText",`Connected \u2014 ${e.name}`),a}async function W(){g&&await g.save(),g=null,l.setKey("activeConnectionId",null),l.setKey("tables",[]),l.setKey("currentTable",null),l.setKey("currentTableData",null),l.setKey("currentTableInfo",null)}async function q(e){if(!g)throw new Error("Not connected");l.setKey("queryRunning",!0),l.setKey("queryError",null);try{let a=g.exec(e);return l.setKey("results",a),l.setKey("queryRunning",!1),l.setKey("statusText",`${a.rows.length} rows in ${a.duration}ms`),a}catch(a){throw l.setKey("queryError",a.message),l.setKey("queryRunning",!1),l.setKey("statusText","Query failed"),a}}async function U(e){if(g)try{l.setKey("currentTable",e),l.setKey("tableFilters",{}),l.setKey("tableSort",null);let{tableFilters:a,tableSort:n}=l.get(),o=g.getTableData(e,{filters:a,sort:n}),t=g.getTableInfo(e);l.setKey("currentTableData",o),l.setKey("currentTableInfo",t),l.setKey("statusText",`Table "${e}" \u2014 ${o.total} rows`)}catch{}}async function $(){let{currentTable:e,tableFilters:a,tableSort:n}=l.get();if(!(!e||!g||!l.get().activeConnectionId))try{let r=g.getTableData(e,{filters:a,sort:n}),s=g.getTableInfo(e);l.setKey("currentTableData",r),l.setKey("currentTableInfo",s);let i=Object.values(a).filter(p=>p&&p!=="").length,d=[`${r.total} rows`];i&&d.push(`${i} filter${i>1?"s":""}`),n&&d.push(`sorted by ${n.column}`),l.setKey("statusText",`Table "${e}" \u2014 ${d.join(", ")}`)}catch{}}function O(){let{currentTable:e}=l.get();e&&U(e)}function I(){g&&l.setKey("tables",g.getTables())}async function B(e,a){g&&(g.insertRow(e,a),l.setKey("statusText",`Row inserted into "${e}"`),O(),I())}async function z(e,a,n,o){g&&(g.updateRowByPk(e,a,n,o),l.setKey("statusText",`Row updated in "${e}"`),O())}async function Q(e,a,n){g&&(g.deleteRowByPk(e,a,n),l.setKey("statusText",`Row deleted from "${e}"`),O(),I())}async function P(e,a){g&&(g.createTable(e,a),l.setKey("statusText",`Table "${e}" created`),I())}async function J(e){g&&(g.dropTable(e),l.get().currentTable===e&&(l.setKey("currentTable",null),l.setKey("currentTableData",null),l.setKey("currentTableInfo",null)),l.setKey("statusText",`Table "${e}" dropped`),I())}async function H(e,a){g&&(g.addColumn(e,a),l.setKey("statusText",`Column "${a.name}" added to "${e}"`),O(),I())}async function Z(e,a){g&&(g.dropColumn(e,a),l.setKey("statusText",`Column "${a}" dropped from "${e}"`),O(),I())}async function ee(e,a){g&&(g.renameTable(e,a),l.get().currentTable===e&&l.setKey("currentTable",a),l.setKey("statusText",`Table renamed to "${a}"`),I())}function S(e,a={},...n){let o=document.createElement(e);for(let[t,r]of Object.entries(a))t==="className"?o.className=r:t==="style"&&typeof r=="object"?Object.assign(o.style,r):t.startsWith("on")?o.addEventListener(t.slice(2).toLowerCase(),r):t==="dataset"&&typeof r=="object"?Object.assign(o.dataset,r):t==="html"?o.innerHTML=r:t==="text"?o.textContent=r:o.setAttribute(t,r);for(let t of n)t!=null&&(typeof t=="string"||typeof t=="number"?o.appendChild(document.createTextNode(t)):t instanceof Node&&o.appendChild(t));return o}function c(e,a=document){return a.querySelector(e)}function M(e,a=document){return a.querySelectorAll(e)}function w(e,a,n,o){let t=r=>{let s=r.target.closest(a);s&&e.contains(s)&&o(r,s)};return e.addEventListener(n,t),()=>e.removeEventListener(n,t)}function A(e){for(;e.firstChild;)e.removeChild(e.firstChild)}function N(e){let a=document.createElement("div");return a.textContent=e,a.innerHTML}function h(e){window.lucide&&(e?lucide.createIcons({root:e}):lucide.createIcons())}var Ee=new Set(["SELECT","FROM","WHERE","INSERT","INTO","VALUES","UPDATE","SET","DELETE","CREATE","TABLE","ALTER","DROP","INDEX","VIEW","JOIN","LEFT","RIGHT","INNER","OUTER","FULL","CROSS","ON","AND","OR","NOT","IN","NULL","IS","LIKE","BETWEEN","EXISTS","UNION","ALL","DISTINCT","AS","ORDER","BY","GROUP","HAVING","LIMIT","OFFSET","ASC","DESC","CASE","WHEN","THEN","ELSE","END","WITH","RECURSIVE","PRIMARY","KEY","FOREIGN","REFERENCES","CASCADE","CONSTRAINT","DEFAULT","CHECK","UNIQUE","IF","GRANT","REVOKE","COMMIT","ROLLBACK","BEGIN","TRANSACTION","EXPLAIN","ANALYZE","TRUNCATE","RETURNING","USING","NATURAL","EXCEPT","INTERSECT","FETCH","NEXT","ROWS","ONLY","FOR","OF","MERGE","MATCHED","DO","NOTHING"]),Te=new Set(["INT","INTEGER","BIGINT","SMALLINT","TINYINT","BOOLEAN","BIT","FLOAT","DOUBLE","REAL","DECIMAL","NUMERIC","MONEY","CHAR","VARCHAR","TEXT","CLOB","NCHAR","NVARCHAR","NTEXT","BINARY","VARBINARY","BLOB","BYTEA","DATE","TIME","TIMESTAMP","DATETIME","YEAR","INTERVAL","JSON","JSONB","UUID","ARRAY","ENUM","SERIAL","BIGSERIAL","GEOMETRY","GEOGRAPHY","POINT","LINESTRING","POLYGON"]),we=new Set(["COUNT","SUM","AVG","MIN","MAX","COALESCE","NULLIF","CAST","CONVERT","SUBSTRING","UPPER","LOWER","TRIM","LENGTH","REPLACE","CONCAT","NOW","CURRENT_DATE","CURRENT_TIME","CURRENT_TIMESTAMP","EXTRACT","DATE_PART","DATE_TRUNC","ROUND","CEIL","FLOOR","ABS","MOD","POWER","SQRT","EXP","LN","LOG","GREATEST","LEAST","ROW_NUMBER","RANK","DENSE_RANK","LEAD","LAG","FIRST_VALUE","LAST_VALUE","NTH_VALUE","STRING_AGG","ARRAY_AGG","JSON_AGG","GROUP_CONCAT","LISTAGG","TO_CHAR","TO_DATE","TO_NUMBER","LEFT","RIGHT","POSITION","STRPOS","REGEXP_REPLACE","REGEXP_MATCH","SPLIT_PART","MD5","SHA256","RANDOM","GEN_RANDOM_UUID"]),Le=new Set(["TRUE","FALSE","NULL","UNKNOWN","CURRENT_USER","SESSION_USER","CURRENT_DATE","CURRENT_TIME","CURRENT_TIMESTAMP","LOCALTIME","LOCALTIMESTAMP","CURRENT_CATALOG","CURRENT_SCHEMA","DEFAULT"]);function te(e){if(!e)return"";let a=[],n=0,o=e.length;for(;n<o;){if(e[n]===`
`){a.push({type:"text",value:`
`}),n++;continue}if(e[n]===" "||e[n]==="	"){let t="";for(;n<o&&(e[n]===" "||e[n]==="	");)t+=e[n++];a.push({type:"text",value:t});continue}if(e[n]==="-"&&e[n+1]==="-"){let t="";for(n+=2;n<o&&e[n]!==`
`;)t+=e[n++];a.push({type:"comment",value:"--"+t});continue}if(e[n]==="/"&&e[n+1]==="*"){let t="/*";for(n+=2;n<o-1&&!(e[n]==="*"&&e[n+1]==="/");)t+=e[n++];n<o-1&&(t+="*/",n+=2),a.push({type:"comment",value:t});continue}if(e[n]==="'"||e[n]==='"'||e[n]==="`"){let t=e[n],r=t;for(n++;n<o;){if(e[n]==="\\"&&n+1<o){r+=e[n]+e[n+1],n+=2;continue}if(r+=e[n],e[n]===t){n++;break}n++}a.push({type:"string",value:r});continue}if(e[n]==="$"&&n+1<o&&e[n+1]==="$"){let t="$$";for(n+=2;n<o-1&&!(e[n]==="$"&&e[n+1]==="$");)t+=e[n++];n<o-1&&(t+="$$",n+=2),a.push({type:"string",value:t});continue}if(/[0-9]/.test(e[n])&&(n===0||/[\s,()=<>!+\-*/%]/.test(e[n-1]))){let t="";for(;n<o&&/[0-9.]/.test(e[n]);)t+=e[n++];t.endsWith(".")&&(t=t.slice(0,-1),n--),a.push({type:"number",value:t});continue}if(/[a-zA-Z_]/.test(e[n])){let t="";for(;n<o&&/[a-zA-Z0-9_]/.test(e[n]);)t+=e[n++];let r=t.toUpperCase();Ee.has(r)?a.push({type:"keyword",value:t}):Te.has(r)?a.push({type:"type",value:t}):we.has(r)?a.push({type:"function",value:t}):Le.has(r)?a.push({type:"builtin",value:t}):a.push({type:"text",value:t});continue}if(/[()]/.test(e[n])){a.push({type:"text",value:e[n]}),n++;continue}if(e[n]===":"&&n+1<o&&/[a-zA-Z]/.test(e[n+1])){let t=":";for(n++;n<o&&/[a-zA-Z0-9_]/.test(e[n]);)t+=e[n++];a.push({type:"variable",value:t});continue}if(/[=<>!+\-*/%,;.]/.test(e[n])){let t=e[n];n++,(t==="<"||t===">"||t==="!"||t==="=")&&n<o&&e[n]==="="&&(t+="=",n++),a.push({type:"operator",value:t});continue}a.push({type:"text",value:e[n]}),n++}return a.map(t=>`<span class="${`sql-${t.type}`}">${Ne(t.value)}</span>`).join("")}function Ne(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function Re(e){return e?e.split(`
`).length:1}function ne(e){let a=Re(e);return Array.from({length:a},(n,o)=>o+1).join(`
`)}function F(e,a,n,o={}){let t=document.getElementById(e),r=document.getElementById(a);if(!t||!r)return;let{min:s=60,max:i=1/0,onResize:d}=o,p,u;function b(f){f.preventDefault(),p=n==="h"?f.clientX:f.clientY,u=n==="h"?r.offsetWidth:r.offsetHeight,r.classList.add("no-transition"),document.body.style.cursor=n==="h"?"col-resize":"row-resize",document.body.style.userSelect="none",document.addEventListener("mousemove",y),document.addEventListener("mouseup",x)}function y(f){let v=n==="h"?f.clientX-p:f.clientY-p,R=u+v;R=Math.max(s,Math.min(i,R)),n==="h"?r.style.width=R+"px":r.style.height=R+"px"}function x(){r.classList.remove("no-transition"),document.body.style.cursor="",document.body.style.userSelect="",document.removeEventListener("mousemove",y),document.removeEventListener("mouseup",x),d&&d(n==="h"?r.offsetWidth:r.offsetHeight)}t.addEventListener("mousedown",b)}document.addEventListener("DOMContentLoaded",()=>{let{theme:e}=l.get();document.documentElement.classList.toggle("dark",e==="dark"),m(),l.subscribe(()=>{let a=l.get(),n=c("#status-text");n&&(n.textContent=a.statusText);let o=c("#status-icon");o&&(o.className=`w-2 h-2 rounded-full ${a.queryRunning?"bg-amber-400 animate-pulse":a.activeConnectionId?"bg-emerald-400":"bg-gray-600"}`)}),c("#sidebar-toggle")?.addEventListener("click",()=>{T.toggleSidebar(),m()}),F("sidebar-drag","sidebar","h",{min:120,max:500,onResize:a=>T.setSidebarWidth(a)})});function m(){Se(),$e(),Oe(),je(),h()}function Se(){let e=c("#sidebar"),a=l.get(),n=a.sidebarCollapsed;e.style.width=n?"0px":a.sidebarWidth+"px",e.classList.toggle("border-r-0",n);let o=c("#sidebar-toggle");o&&(o.innerHTML=`<i data-lucide="${n?"panel-left-open":"panel-left-close"}" class="w-3 h-3"></i>`,h(o)),A(e);let{connections:t,activeConnectionId:r,tables:s,currentTable:i}=a;e.innerHTML=`
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
  `,document.addEventListener("contextmenu",u=>{let b=c("#table-context-menu");b&&b.remove()});let d=c("#sidebar-body");if(!t.length&&!r){d.innerHTML=`
      <div class="flex flex-col items-center gap-3 py-8 px-4 text-center">
        <i data-lucide="database" class="w-8 h-8 text-gray-700"></i>
        <p class="text-xs text-gray-600">No connections yet</p>
        <button id="btn-new-conn" class="px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors">
          <i data-lucide="plus" class="w-3 h-3 inline-block mr-1"></i> New Database
        </button>
      </div>
    `,c("#btn-new-conn")?.addEventListener("click",oe),h(d);return}let p="";for(let u of t){let b=u.id===r;if(p+=`
      <div class="conn-item flex items-center gap-2 px-3 py-1.5 mx-1 rounded-lg cursor-pointer text-xs transition-all ${b?"bg-blue-500/10 text-blue-400":"text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"}" data-id="${u.id}">
        <i data-lucide="${b?"plug":"database"}" class="w-3.5 h-3.5 shrink-0"></i>
        <span class="truncate flex-1">${u.name}</span>
        <span class="text-[10px] text-gray-600">SQLite</span>
        <button class="btn-del-conn opacity-0 hover:opacity-100 hover:text-red-400 transition-opacity" data-id="${u.id}">
          <i data-lucide="x" class="w-3 h-3"></i>
        </button>
      </div>
    `,b&&s.length){p+='<div class="ml-2 pl-2 border-l border-gray-800/60 mt-0.5">',p+=`<div class="flex items-center justify-between px-2 py-1 text-[10px] text-gray-600 uppercase tracking-wider font-medium">
        <span><i data-lucide="layers" class="w-3 h-3 mr-1"></i> Tables <span class="font-normal ml-1">(${s.length})</span></span>
        <button id="btn-new-table" class="p-0.5 rounded hover:bg-gray-700/50 hover:text-gray-400 transition-colors" title="New Table">
          <i data-lucide="plus" class="w-3 h-3"></i>
        </button>
      </div>`;for(let y of s){let x=i===y.name;p+=`
          <div class="table-item flex items-center gap-1.5 px-2 py-1 rounded text-xs cursor-pointer transition-all group ${x?"text-blue-400 bg-blue-500/5":"text-gray-400 hover:text-gray-200 hover:bg-gray-800/40"}" data-table="${y.name}">
            <i data-lucide="table" class="w-3 h-3 shrink-0"></i>
            <span class="truncate flex-1">${y.name}</span>
            <span class="ml-1 text-[9px] text-gray-600">${y.columns.length}</span>
            <button class="btn-table-actions ml-auto p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-gray-700/50 hover:text-gray-300 transition-all ${x?"text-blue-400":"text-gray-600"}" data-table="${y.name}" title="Actions">
              <i data-lucide="more-horizontal" class="w-3 h-3"></i>
            </button>
          </div>
        `}p+="</div>"}}d.innerHTML=p,h(d),w(d,".conn-item","click",async(u,b)=>{let y=b.dataset.id,x=t.find(f=>f.id===y);if(x){if(r===y){await W(),m();return}l.setKey("statusText",`Connecting to ${x.name}...`),m();try{await K(x),m()}catch(f){l.setKey("statusText",`Error: ${f.message}`),m()}}}),w(d,".btn-del-conn","click",(u,b)=>{u.stopPropagation(),confirm("Delete this connection?")&&(T.deleteConnection(b.dataset.id),m())}),w(d,".table-item","click",async(u,b)=>{if(u.target.closest(".btn-table-actions"))return;let y=b.dataset.table;l.get().currentTable!==y&&(await U(y),m())}),w(d,".btn-table-actions","click",(u,b)=>{u.stopPropagation(),Ae(b,b.dataset.table)}),c("#btn-new-table")?.addEventListener("click",()=>ie()),r||(d.innerHTML+=`
      <div class="px-3 mt-2">
        <button id="btn-new-conn" class="w-full px-3 py-1.5 text-xs font-medium rounded-lg border border-dashed border-gray-700 text-gray-500 hover:text-gray-300 hover:border-gray-600 transition-colors">
          <i data-lucide="plus" class="w-3 h-3 inline-block mr-1"></i> New Connection
        </button>
      </div>
    `,c("#btn-new-conn")?.addEventListener("click",oe),h(d))}function Ae(e,a){let n=c("#table-context-menu");n&&n.remove();let o=e.getBoundingClientRect(),t=S("div",{id:"table-context-menu",className:"fixed z-50 bg-gray-800 border border-gray-700/60 rounded-lg shadow-xl py-1 text-xs min-w-[140px]",style:{left:o.left+"px",top:o.bottom+4+"px"}}),r=[{label:"Browse",icon:"eye",action:()=>{U(a),m()}},{label:"Add Column",icon:"columns",action:()=>ce(a)},{label:"Rename Table",icon:"edit-3",action:()=>Ge(a)},{type:"divider"},{label:"Duplicate Schema",icon:"copy",action:()=>Ce(a)},{label:"Drop Table",icon:"trash-2",className:"text-red-400 hover:bg-red-500/10",action:()=>de(`Drop table "${a}"? This cannot be undone.`,()=>Ie(a))}];for(let s of r){if(s.type==="divider"){t.appendChild(S("div",{className:"h-px bg-gray-700/60 my-1"}));continue}let i=S("button",{className:`flex items-center gap-2 w-full px-3 py-1.5 text-left hover:bg-gray-700/50 transition-colors ${s.className||"text-gray-300"}`,onClick:()=>{t.remove(),s.action()}});i.innerHTML=`<i data-lucide="${s.icon}" class="w-3 h-3"></i> ${s.label}`,t.appendChild(i)}document.body.appendChild(t),h(t),setTimeout(()=>{let s=i=>{!t.contains(i.target)&&i.target!==e&&(t.remove(),document.removeEventListener("click",s))};document.addEventListener("click",s)},0)}async function Ce(e){let a=_();if(!a)return;let n=e+"_copy",t=a.getTableInfo(e).columns.map(s=>({name:s.name,type:s.type,primaryKey:s.primaryKey,notNull:s.notNull,defaultValue:s.defaultValue}));await P(n,t);let r=a.getTableData(e,{limit:99999});for(let s of r.rows)await B(n,s);l.setKey("statusText",`Table "${e}" duplicated as "${n}"`),ke(),m()}async function Ie(e){await J(e),m()}function ke(){let e=_();e&&l.setKey("tables",e.getTables())}function $e(){let e=c("#tab-bar");A(e);let{tabs:a,activeTabId:n}=l.get();if(!a.length){e.innerHTML='<div class="flex items-center px-3 text-[11px] text-gray-600">No tabs</div>';return}for(let o of a){let t=o.id===n,r=S("div",{className:`tab-item flex items-center gap-1.5 px-3 py-1.5 text-xs cursor-pointer border-r border-gray-800/60 select-none whitespace-nowrap transition-all ${t?"text-blue-400 bg-blue-500/5":"text-gray-500 hover:text-gray-300 hover:bg-gray-800/30"}`,dataset:{tabId:o.id}});r.innerHTML=`<i data-lucide="${o.type==="editor"?"terminal":"table"}" class="w-3 h-3"></i>`,r.appendChild(S("span",{className:"truncate max-w-[120px]"},o.name));let s=S("button",{className:"flex items-center justify-center w-3.5 h-3.5 rounded hover:bg-gray-700/60 transition-all ml-0.5",dataset:{tabClose:o.id}});s.innerHTML='<i data-lucide="x" class="w-2.5 h-2.5"></i>',r.appendChild(s),e.appendChild(r)}h(e),w(e,".tab-item","click",(o,t)=>{let r=parseInt(t.dataset.tabId);isNaN(r)||(a.find(i=>i.id===r)?.type==="editor"&&(l.setKey("currentTable",null),l.setKey("currentTableData",null),l.setKey("currentTableInfo",null)),T.setActiveTab(r),m())}),w(e,"[data-tab-close]","click",(o,t)=>{o.stopPropagation();let r=parseInt(t.dataset.tabClose);isNaN(r)||(T.closeTab(r),m())})}function Oe(){let e=c("#content-area");A(e);let a=l.get(),{tabs:n,activeTabId:o}=a;if(a.currentTable&&a.currentTableData){Me(e,a);return}if(!n.length||!o){e.innerHTML=`
      <div class="flex flex-col items-center justify-center h-full gap-4 text-gray-600">
        <i data-lucide="terminal" class="w-12 h-12 opacity-30"></i>
        <p class="text-sm">${a.activeConnectionId?"Open a table or write a query":"Connect to a database to get started"}</p>
        ${a.activeConnectionId?'<button id="btn-new-query" class="px-4 py-2 text-xs font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors"><i data-lucide="plus" class="w-3 h-3 inline-block mr-1"></i> New Query</button>':""}
      </div>
    `,c("#btn-new-query")?.addEventListener("click",()=>{l.setKey("currentTable",null),l.setKey("currentTableData",null),l.setKey("currentTableInfo",null),T.addTab("editor"),m()}),h(e);return}let t=n.find(r=>r.id===o);t?.type==="editor"&&De(e,t,a)}function De(e,a){let n=l.get(),o=n.resultsPanelHeight;e.innerHTML=`
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
        <textarea class="editor-input" id="editor-input" spellcheck="false" autocomplete="off" placeholder="${n.activeConnectionId?"Enter SQL...":"Connect to a database first"}" ${n.activeConnectionId?"":"disabled"}>${a.sql||""}</textarea>
      </div>
      <div id="results-drag" class="shrink-0 h-1 bg-transparent hover:bg-blue-500/30 cursor-row-resize transition-colors relative"></div>
      <div id="results-panel" class="flex flex-col overflow-hidden border-t border-gray-800/60" style="height:${o}px;min-height:60px;max-height:80%"></div>
    </div>
  `,h(e);let t=c("#editor-input"),r=c("#editor-highlight"),s=c("#editor-gutter"),i=c("#editor-status");function d(){let u=t.value;r.innerHTML=te(u)+`
`.repeat(Math.max(1,(u.match(/\n/g)||"").length+1)),s.textContent=ne(u),T.updateTabSQL(a.id,u)}t.addEventListener("input",d),t.addEventListener("scroll",()=>{r.scrollTop=t.scrollTop,r.scrollLeft=t.scrollLeft,s.scrollTop=t.scrollTop}),t.addEventListener("keydown",u=>{if(u.key==="Tab"){u.preventDefault();let b=t.selectionStart;t.value=t.value.substring(0,b)+"  "+t.value.substring(t.selectionEnd),t.selectionStart=t.selectionEnd=b+2,d()}(u.ctrlKey||u.metaKey)&&u.key==="Enter"&&(u.preventDefault(),re())}),d(),setTimeout(()=>t.focus(),50),c("#btn-run")?.addEventListener("click",re),ae(n);let p=l.subscribe(()=>{ae(l.get()),Ue(c("#results-panel"))},!1);F("results-drag","results-panel","v",{min:60,max:window.innerHeight*.8,onResize:u=>T.setResultsPanelHeight(u)})}function ae(e){let a=c("#editor-status");a&&(e.queryRunning?a.innerHTML='<i data-lucide="loader-circle" class="w-3 h-3 animate-spin inline-block mr-1"></i> Running...':e.queryError?a.innerHTML=`<i data-lucide="alert-circle" class="w-3 h-3 inline-block mr-1"></i> ${e.queryError}`:e.results?a.textContent=`${e.results.rows.length} rows in ${e.results.duration}ms`:a.textContent="Ready",h(a?.parentElement))}function Ue(e){if(!e)return;let a=l.get();if(a.queryRunning){e.innerHTML='<div class="flex items-center justify-center h-full gap-2 text-sm text-gray-500"><i data-lucide="loader-circle" class="w-4 h-4 animate-spin"></i> Running...</div>',h(e);return}if(a.queryError){e.innerHTML=`<div class="flex items-start gap-2 p-4 text-sm text-red-400"><i data-lucide="alert-circle" class="w-4 h-4 mt-0.5 shrink-0"></i> ${a.queryError}</div>`,h(e);return}if(!a.results?.columns?.length){e.innerHTML='<div class="flex flex-col items-center justify-center h-full gap-3 text-gray-600"><i data-lucide="arrow-up-right" class="w-8 h-8 opacity-30"></i><span class="text-xs">Run a query to see results</span></div>',h(e);return}e.innerHTML=le(a.results,!0),h(e)}async function re(){let e=c("#editor-input")?.value?.trim();if(!(!e||!l.get().activeConnectionId))try{await q(e)}catch{}}function Me(e,a){let n=a.currentTableData,o=a.currentTableInfo,t=a.currentTable;if(!n){e.innerHTML='<div class="flex items-center justify-center h-full text-gray-600 text-sm">Loading...</div>';return}let r=o?.columns?.find(d=>d.primaryKey)?.name||null,s=a.schemaPanelCollapsed,i=o?.columns?.map((d,p)=>`<div class="flex items-center gap-2 px-3 py-1.5 text-xs border-b border-gray-800/30 hover:bg-gray-800/20 group">
      <span class="w-28 font-medium text-gray-300">${d.name}</span>
      <span class="w-20 text-blue-400 font-mono">${d.type}</span>
      <span class="w-28 text-gray-500">${d.primaryKey?'<span class="text-amber-400 font-medium">PK</span>':""}${d.notNull?' <span class="text-gray-600">NOT NULL</span>':""}</span>
      <span class="flex-1 text-gray-600 truncate">${d.defaultValue!=null?`default: ${d.defaultValue}`:""}</span>
      <button class="btn-drop-col p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-400 transition-all text-gray-600" data-col="${d.name}" title="Drop column">
        <i data-lucide="x" class="w-3 h-3"></i>
      </button>
    </div>`).join("")||"";e.innerHTML=`
    <div class="flex flex-col h-full">
      <div class="flex items-center gap-2 px-3 py-1.5 border-b border-gray-800/60 bg-gray-900/30 shrink-0">
        <i data-lucide="table" class="w-4 h-4 text-blue-400"></i>
        <span class="text-sm font-medium text-gray-200">${N(t)}</span>
        <span class="text-xs text-gray-500">${n.total||0} rows</span>
        <button id="btn-query-table" class="ml-auto px-2 py-1 text-xs rounded-md bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 transition-colors flex items-center gap-1">
          <i data-lucide="terminal" class="w-3 h-3"></i> Query
        </button>
      </div>
      <div class="flex flex-1 overflow-hidden">
        <div class="flex-1 flex flex-col overflow-hidden">
          ${le({columns:n.columns,rows:n.rows},!0,r,a.tableFilters,a.tableSort)}
        </div>
        ${o?`<div id="schema-drag" class="shrink-0 w-1 bg-transparent hover:bg-blue-500/30 cursor-col-resize transition-colors ${s?"hidden":""}"></div>
        <div id="schema-panel" class="shrink-0 border-l border-gray-800/60 bg-gray-900/30 overflow-hidden transition-all duration-200 ${s?"w-0 border-l-0":"hidden md:block"}" style="${s?"":`width:${a.schemaPanelWidth}px`}">
          <div class="flex items-center justify-between px-3 py-2 text-[10px] text-gray-500 uppercase tracking-wider font-medium border-b border-gray-800/60 ${s?"hidden":""}">
            <span>Columns</span>
            <div class="flex items-center gap-1">
              <button id="btn-add-col-panel" class="p-0.5 rounded hover:bg-gray-700/50 hover:text-gray-400 transition-colors" title="Add Column">
                <i data-lucide="plus" class="w-3 h-3"></i>
              </button>
              <button id="btn-toggle-schema" class="p-0.5 rounded hover:bg-gray-700/50 hover:text-gray-400 transition-colors" title="Collapse">
                <i data-lucide="chevron-right" class="w-3 h-3"></i>
              </button>
            </div>
          </div>
          ${s?"":`<div class="overflow-y-auto">${i}
          ${o.indexes?.length?`<div class="px-3 py-2 text-[10px] text-gray-500 uppercase tracking-wider font-medium border-b border-gray-800/60 mt-2">Indexes</div>
          ${o.indexes.map(d=>`<div class="px-3 py-1 text-xs text-gray-400">${d.name} ${d.unique?"(unique)":""}</div>`).join("")}`:""}
          ${o.foreignKeys?.length?`<div class="px-3 py-2 text-[10px] text-gray-500 uppercase tracking-wider font-medium border-b border-gray-800/60 mt-2">Foreign Keys</div>
          ${o.foreignKeys.map(d=>`<div class="px-3 py-1 text-xs text-gray-400">${d.column} \u2192 ${d.refTable}(${d.refColumn})</div>`).join("")}`:""}
          </div>`}
          ${s?'<div class="flex items-center justify-center h-full cursor-pointer hover:bg-gray-800/30 transition-colors" id="btn-expand-schema" title="Show columns"><i data-lucide="chevron-left" class="w-4 h-4 text-gray-600"></i></div>':""}
        </div>`:""}
      </div>
    </div>
  `,h(e),c("#btn-query-table")?.addEventListener("click",()=>{T.addTab("editor",{connectionId:l.get().activeConnectionId,name:`Query: ${t}`,sql:`SELECT * FROM "${t}" LIMIT 100`}),m()}),w(e,".btn-add-col-inline","click",()=>Fe(e,t,r)),w(e,".btn-add-row-inline","click",()=>He(e,t,o,r)),c("#btn-add-col-panel")?.addEventListener("click",()=>ce(t)),c("#btn-toggle-schema")?.addEventListener("click",()=>{T.toggleSchemaPanel(),m()}),c("#btn-expand-schema")?.addEventListener("click",()=>{T.toggleSchemaPanel(),m()}),s||F("schema-drag","schema-panel","h",{min:120,max:500,onResize:d=>T.setSchemaPanelWidth(d)}),w(e,".btn-drop-col",async(d,p)=>{let u=p.dataset.col;de(`Drop column "${u}" from "${t}"?`,async()=>{await Z(t,u),m()})}),_e(e,t,r,n),Ke(e,t,r),Be(e,t),Pe(e,t)}function _e(e,a,n){w(e,".result-table td[data-col]","dblclick",(s,i)=>{if(i.querySelector("input, select, textarea"))return;let d=i.dataset.col,u=i.closest("tr")?.dataset?.pkVal;!n||!u||d===n||o(i,d,u,a)});function o(s,i,d,p){let u=s.closest("tr"),b=u?.closest("tbody"),y=s.querySelector(".text-gray-600.italic"),f=s.dataset.formula||(y?"":s.textContent);s.innerHTML=`<input class="cell-edit-input w-full bg-gray-800 border border-blue-500/50 rounded px-1 py-0.5 text-xs text-gray-200 outline-none" value="${N(f)}" />`;let v=s.querySelector("input");v.focus(),v.select();function R(){let k=v.value.trim(),C=k===""?null:k,G={};if(G[i]=C,C!==null&&C.startsWith("=")){let pe=t(u),be=se(C,pe);s.innerHTML=`<span class="formula-result text-emerald-400">${N(be)}</span>`,s.dataset.formula=C,s.classList.add("formula-cell")}else s.innerHTML=C===null?'<span class="text-gray-600 italic">NULL</span>':N(C),delete s.dataset.formula,s.classList.remove("formula-cell");s.title=C??"",z(p,G,n,d).catch(()=>{s.innerHTML=N(f||"NULL")})}v.addEventListener("blur",R),v.addEventListener("keydown",L=>{L.key==="Enter"?(L.preventDefault(),v.blur(),r(s,"down")):L.key==="Tab"&&!L.shiftKey?(L.preventDefault(),v.blur(),r(s,"right")):L.key==="Tab"&&L.shiftKey?(L.preventDefault(),v.blur(),r(s,"left")):L.key==="Escape"&&(L.preventDefault(),s.innerHTML=y?'<span class="text-gray-600 italic">NULL</span>':N(f))})}function t(s){let i={};if(!s)return i;let d=s.querySelectorAll("td[data-col]");for(let p of d){let u=p.dataset.col,b=p.dataset.formula;if(b)i[u]=b;else{let y=p.querySelector(".text-gray-600.italic");i[u]=y?null:p.textContent}}return i}function r(s,i){let d=s.closest("tr");if(!d?.closest("tbody")||!d)return;let u=[...d.querySelectorAll("td[data-col]")],b=u.indexOf(s),y=null;if(i==="right"&&b<u.length-1)y=u[b+1];else if(i==="left"&&b>0)y=u[b-1];else if(i==="down"||i==="right"&&b>=u.length-1){let x=d.nextElementSibling;if(x&&x.tagName==="TR"&&!x.classList.contains("btn-add-row-inline")){let f=[...x.querySelectorAll("td[data-col]")];y=f[Math.min(b,f.length-1)]}}if(y&&!y.querySelector("input")){let x=y.dataset.col,f=y.closest("tr")?.dataset?.pkVal;n&&f&&x!==n&&o(y,x,f,a)}}}function Ke(e,a,n){w(e,".btn-del-row",async(o,t)=>{let r=t.dataset.pkVal;!n||!r||confirm("Delete this row?")&&(await Q(a,n,r),m())})}function Be(e,a){let n={};w(e,".filter-input","input",(o,t)=>{let r=t.dataset.filterCol,s=t.value;clearTimeout(n[r]),n[r]=setTimeout(()=>{let d={...l.get().tableFilters};s?d[r]=s:delete d[r],T.setTableFilters(d),$().then(()=>m())},250)}),w(e,".filter-input","keydown",(o,t)=>{if(o.key==="Enter"){o.preventDefault(),clearTimeout(n[t.dataset.filterCol]);let s={...l.get().tableFilters},i=t.value;i?s[t.dataset.filterCol]=i:delete s[t.dataset.filterCol],T.setTableFilters(s),$().then(()=>m())}if(o.key==="Escape"){t.value="",t.blur(),clearTimeout(n[t.dataset.filterCol]);let s={...l.get().tableFilters};delete s[t.dataset.filterCol],T.setTableFilters(s),$().then(()=>m())}}),w(e,".btn-clear-filters","click",()=>{T.setTableFilters({}),$().then(()=>m())})}function Pe(e,a){w(e,".sort-th","click",(n,o)=>{let t=o.dataset.sortCol;if(n.target.closest(".btn-add-col-inline"))return;let s=l.get().tableSort,i=null;!s||s.column!==t?i={column:t,direction:"asc"}:s.direction==="asc"?i={column:t,direction:"desc"}:i=null,T.setTableSort(i),$().then(()=>m())})}function se(e,a){if(!e||!e.startsWith("="))return e;try{let n=e.slice(1).trim();if(!n)return"";let o=Object.keys(a),t=o.map(i=>a[i]),s=new Function(...o,`try { return (${n}) } catch(e) { return '#ERR:' + e.message; }`)(...t);return s==null?"":String(s)}catch{return"#ERROR"}}function He(e,a,n,o){if(!n?.columns)return;let t=c("#add-row-placeholder");if(!t)return;let r=n.columns,s=r.filter(p=>!p.primaryKey||p.defaultValue===null);t.classList.remove("btn-add-row-inline","cursor-pointer"),t.innerHTML="";for(let p of r){let u=p.primaryKey,b=s.includes(p);if(u&&p.defaultValue==null)t.appendChild(S("td",{className:"text-gray-600 text-xs px-3 py-1"},"PK"));else{let y=S("input",{className:"inline-add-row-input w-full text-xs px-1.5 py-1 rounded border border-gray-700 bg-gray-800/80 text-gray-200 outline-none focus:border-blue-500/40",placeholder:p.type,dataset:{col:p.name}});p.defaultValue!=null&&(y.value=String(p.defaultValue));let x=S("td",{className:"px-1 py-1"});x.appendChild(y),t.appendChild(x)}}let i=S("td",{className:"text-center px-1 py-1"});i.innerHTML=`
    <button class="btn-inline-save-row p-0.5 rounded hover:bg-emerald-500/20 hover:text-emerald-400 text-emerald-500 transition-colors" title="Save"><i data-lucide="check" class="w-3.5 h-3.5"></i></button>
    <button class="btn-inline-cancel-row p-0.5 rounded hover:bg-red-500/20 hover:text-red-400 text-gray-500 transition-colors" title="Cancel"><i data-lucide="x" class="w-3.5 h-3.5"></i></button>
  `,t.appendChild(i),h(t);let d=t.querySelector("input");d&&setTimeout(()=>d.focus(),50),w(t,".btn-inline-save-row","click",async()=>{let p={};for(let u of M(".inline-add-row-input",t)){let b=u.value.trim();p[u.dataset.col]=b===""?null:b}await B(a,p),m()}),w(t,".btn-inline-cancel-row","click",()=>m()),t.querySelectorAll(".inline-add-row-input").forEach(p=>{p.addEventListener("keydown",u=>{if(u.key==="Enter"){u.preventDefault();let b=t.querySelector(".btn-inline-save-row");b&&b.click()}if(u.key==="Escape"){let b=t.querySelector(".btn-inline-cancel-row");b&&b.click()}})})}function Fe(e,a,n){let o=e.querySelector(".btn-add-col-inline")?.closest("th");if(!o)return;o.innerHTML=`
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
  `,h(o);let t=c("#inline-col-name");t&&setTimeout(()=>t.focus(),50),w(o,".btn-inline-save-col","click",async()=>{let r=c("#inline-col-name")?.value?.trim(),s=c("#inline-col-type")?.value||"TEXT";r&&(await H(a,{name:r,type:s,defaultValue:null,notNull:!1}),m())}),w(o,".btn-inline-cancel-col","click",()=>m()),t&&t.addEventListener("keydown",r=>{r.key==="Enter"&&(r.preventDefault(),c(".btn-inline-save-col")?.click()),r.key==="Escape"&&c(".btn-inline-cancel-col")?.click()})}function le(e,a,n,o,t){let r=e.columns||[],s=e.rows||[];o=o||{},t=t||null;let i="";if(a){let p=Object.values(o).filter(u=>u&&u!=="").length;i+=`<div class="flex items-center gap-2 px-3 py-1 border-b border-gray-800/60 bg-gray-900/20 shrink-0 text-[11px]">
      <span class="text-gray-500">${s.length} rows</span>
      <span class="text-gray-700">\xB7</span>
      <span class="text-gray-500">${r.length} cols</span>
      ${p?`<button class="btn-clear-filters px-2 py-0.5 rounded hover:bg-gray-800 text-amber-400 hover:text-amber-300 flex items-center gap-1">
        <i data-lucide="x" class="w-3 h-3"></i> Clear ${p} filter${p>1?"s":""}
      </button>`:""}
      <button class="ml-auto px-2 py-0.5 rounded hover:bg-gray-800 text-gray-500 hover:text-gray-300 flex items-center gap-1" onclick="window.exportJSON()">
        <i data-lucide="download" class="w-3 h-3"></i> JSON
      </button>
      <button class="px-2 py-0.5 rounded hover:bg-gray-800 text-gray-500 hover:text-gray-300 flex items-center gap-1" onclick="window.exportCSV()">
        <i data-lucide="file-text" class="w-3 h-3"></i> CSV
      </button>
    </div>`}let d=r.length+(n?1:0);i+='<div class="flex-1 overflow-auto"><table class="result-table">',i+="<thead>",i+=`<tr class="sort-row">${r.map(p=>{let u=p.name||p,b=t&&t.column===u,y=b?t.direction==="asc"?"&#9650;":"&#9660;":"";return`<th class="sort-th cursor-pointer select-none hover:text-gray-200 transition-colors" data-sort-col="${u}">${u} <span class="sort-arrow text-[10px] ${b?"text-blue-400":"text-transparent"}">${y||"&#9650;"}</span></th>`}).join("")}<th class="w-9 px-1"><button class="btn-add-col-inline flex items-center justify-center w-full h-full p-0.5 rounded hover:bg-blue-500/20 hover:text-blue-400 transition-colors text-gray-600" title="Add column"><i data-lucide="plus" class="w-3.5 h-3.5"></i></button></th>${n?'<th class="w-8"></th>':""}</tr>`,i+=`<tr class="filter-row">${r.map(p=>{let u=p.name||p,b=o[u]||"";return`<td class="filter-td px-1 py-1"><input class="filter-input w-full text-[11px] px-1.5 py-1 rounded border border-gray-700/50 bg-gray-800/50 text-gray-300 outline-none placeholder-gray-600 focus:border-blue-500/40 focus:bg-gray-800 transition-all" data-filter-col="${u}" value="${N(b)}" placeholder="filter" /></td>`}).join("")}<td class="px-1"></td>${n?'<td class="w-8"></td>':""}</tr>`,i+="</thead>",i+="<tbody>";for(let p=0;p<s.length;p++){let u=s[p],b=n?u[n]:null;i+=`<tr${n?` data-pk-col="${n}" data-pk-val="${b!=null?N(String(b)):""}"`:""} data-row-idx="${p}">`;for(let y of r){let x=y.name||y,f=u[x],v,R=!1,L="";if(f!=null&&typeof f=="string"&&f.startsWith("=")){R=!0;let k=se(f,u);L=` data-formula="${N(f)}"`,v=`<span class="formula-result text-emerald-400">${N(k)}</span>`}else f==null?v='<span class="text-gray-600 italic">NULL</span>':typeof f=="object"?v=`<span title="${N(String(f))}">${N(JSON.stringify(f))}</span>`:v=N(String(f));i+=`<td data-col="${x}"${L} title="${N(String(f??""))}" class="cursor-pointer hover:bg-blue-500/5 transition-colors${R?" formula-cell":""}">${v}</td>`}i+='<td class="text-center add-cell"></td>',n&&(i+=`<td class="text-center"><button class="btn-del-row p-0.5 rounded hover:bg-red-500/20 hover:text-red-400 text-gray-600 transition-colors" data-pk-val="${b!=null?N(String(b)):""}" title="Delete row"><i data-lucide="trash-2" class="w-3 h-3"></i></button></td>`),i+="</tr>"}return i+=`<tr class="btn-add-row-inline cursor-pointer hover:bg-blue-500/5 transition-colors" id="add-row-placeholder"><td colspan="${d+1}" class="text-center py-2 text-gray-600 hover:text-blue-400 text-xs"><span class="flex items-center justify-center gap-1"><i data-lucide="plus" class="w-3.5 h-3.5"></i> Add Row</span></td></tr>`,i+="</tbody></table></div>",i}function ie(){let e=c("#modal-overlay");e.classList.remove("hidden");let a=c("#modal-content");A(a),a.innerHTML=`
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
  `,h(a),c("#modal-close").addEventListener("click",E),c("#modal-cancel").addEventListener("click",E),e.addEventListener("click",n=>{n.target===e&&E()}),document.addEventListener("keydown",function n(o){o.key==="Escape"&&(E(),document.removeEventListener("keydown",n))}),c("#ct-add-col").addEventListener("click",()=>{let n=c("#ct-columns"),o=document.createElement("div");o.className="ct-col-row flex items-center gap-2 p-2 rounded-lg bg-gray-800/50 border border-gray-700/50",o.innerHTML=`
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
    `,n.appendChild(o),h(o)}),w(c("#ct-columns"),".ct-remove-col","click",(n,o)=>{let t=o.closest(".ct-col-row");c("#ct-columns").children.length>1&&t.remove()}),c("#create-table-form").addEventListener("submit",async n=>{n.preventDefault();let o=c("#ct-name").value.trim();if(!o)return;let t=[];for(let r of M(".ct-col-row")){let s=r.querySelector(".ct-col-name").value.trim();s&&t.push({name:s,type:r.querySelector(".ct-col-type").value,primaryKey:r.querySelector(".ct-col-pk").checked,autoIncrement:r.querySelector(".ct-col-ai").checked,notNull:r.querySelector(".ct-col-nn").checked})}t.length&&(await P(o,t),E(),m())}),setTimeout(()=>c("#ct-name")?.focus(),100)}function ce(e){let a=c("#modal-overlay");a.classList.remove("hidden");let n=c("#modal-content");A(n),n.innerHTML=`
    <form id="add-col-form" class="fade-in">
      <div class="flex items-center justify-between px-5 py-3 border-b border-gray-800">
        <h2 class="text-sm font-semibold text-gray-200"><i data-lucide="columns" class="w-4 h-4 text-blue-400 inline-block mr-1.5"></i> Add Column \u2014 ${N(e)}</h2>
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
  `,h(n),c("#modal-close").addEventListener("click",E),c("#modal-cancel").addEventListener("click",E),a.addEventListener("click",o=>{o.target===a&&E()}),document.addEventListener("keydown",function o(t){t.key==="Escape"&&(E(),document.removeEventListener("keydown",o))}),c("#add-col-form").addEventListener("submit",async o=>{o.preventDefault();let t=c("#ac-name").value.trim(),r=c("#ac-type").value,s=c("#ac-default").value.trim()||null,i=c("#ac-notnull").checked;t&&(await H(e,{name:t,type:r,defaultValue:s,notNull:i}),E(),m())}),setTimeout(()=>c("#ac-name")?.focus(),100)}function Ge(e){let a=c("#modal-overlay");a.classList.remove("hidden");let n=c("#modal-content");A(n),n.innerHTML=`
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
          <div class="text-sm px-3 py-2 rounded-lg border border-gray-700 bg-gray-800/50 text-gray-400">${N(e)}</div>
        </div>
        <div>
          <label class="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1">New Name</label>
          <input id="rn-name" class="w-full text-sm px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 text-gray-200 outline-none placeholder-gray-500 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-colors" value="${N(e)}" required autofocus>
        </div>
      </div>
      <div class="flex items-center justify-end gap-2 px-5 py-3 border-t border-gray-800 bg-gray-900/50">
        <button type="button" id="modal-cancel" class="text-xs px-3 py-1.5 rounded-lg border border-gray-700 bg-gray-800 text-gray-400 hover:text-gray-200 transition-all">Cancel</button>
        <button type="submit" class="text-xs font-semibold px-4 py-1.5 rounded-lg text-white bg-blue-600 hover:bg-blue-500 transition-all">Rename</button>
      </div>
    </form>
  `,h(n),c("#modal-close").addEventListener("click",E),c("#modal-cancel").addEventListener("click",E),a.addEventListener("click",o=>{o.target===a&&E()}),document.addEventListener("keydown",function o(t){t.key==="Escape"&&(E(),document.removeEventListener("keydown",o))}),c("#rename-table-form").addEventListener("submit",async o=>{o.preventDefault();let t=c("#rn-name").value.trim();!t||t===e||(await ee(e,t),E(),m())}),setTimeout(()=>c("#rn-name")?.focus(),100)}function de(e,a){let n=c("#modal-overlay");n.classList.remove("hidden");let o=c("#modal-content");A(o),o.innerHTML=`
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
  `,h(o);let t=()=>E();c("#modal-close").addEventListener("click",t),c("#modal-cancel").addEventListener("click",t),n.addEventListener("click",r=>{r.target===n&&t()}),document.addEventListener("keydown",function r(s){s.key==="Escape"&&(t(),document.removeEventListener("keydown",r))}),c("#modal-confirm").addEventListener("click",()=>{E(),a()})}function je(){let e=c("#footer"),a=l.get();e.innerHTML=`
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
  `,c("#btn-new-tab")?.addEventListener("click",()=>{T.addTab("editor"),m()}),c("#btn-new-table-footer")?.addEventListener("click",()=>ie()),c("#btn-theme")?.addEventListener("click",T.toggleTheme),h(e)}function oe(e){let a=c("#modal-overlay");a.classList.remove("hidden");let n=c("#modal-content");A(n);let o=e?.database&&e.database!==":memory:";n.innerHTML=`
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
              <input type="radio" name="conn-storage" value="memory" ${o?"":"checked"}>
              <i data-lucide="cpu" class="w-4 h-4 text-gray-400"></i>
              <span class="text-xs text-gray-300">In-Memory</span>
            </label>
            <label class="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 cursor-pointer hover:border-gray-600 transition-colors flex-1">
              <input type="radio" name="conn-storage" value="persist" ${o?"checked":""}>
              <i data-lucide="hard-drive" class="w-4 h-4 text-gray-400"></i>
              <span class="text-xs text-gray-300">Persistent</span>
            </label>
          </div>
        </div>
        <div id="db-name-group" class="${o?"":"hidden"}">
          <label class="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1">Database Name</label>
          <input class="w-full text-sm px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 text-gray-200 outline-none placeholder-gray-500 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-colors" id="conn-db" value="${o?e.database:"my_database"}" placeholder="my_database">
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
  `,h(n),c("#modal-close").addEventListener("click",E),c("#modal-cancel").addEventListener("click",E),a.addEventListener("click",t=>{t.target===a&&E()}),document.addEventListener("keydown",function t(r){r.key==="Escape"&&(E(),document.removeEventListener("keydown",t))}),M('input[name="conn-storage"]').forEach(t=>{t.addEventListener("change",()=>{c("#db-name-group").classList.toggle("hidden",c('input[name="conn-storage"]:checked')?.value==="memory")})}),c("#conn-form").addEventListener("submit",async t=>{t.preventDefault();let r=c("#conn-name").value.trim();if(!r)return;let s=c('input[name="conn-storage"]:checked')?.value,i=c("#conn-db")?.value?.trim()||r,d=s==="persist"?i:":memory:",p=c("#conn-seed")?.checked!==!1,u=T.addConnection({...e||{},name:r,database:d,seed:p});E(),l.setKey("statusText",`Connecting to ${r}...`),m();try{let b=l.get().connections.find(y=>y.id===u);b&&await K(b),m()}catch(b){l.setKey("statusText",`Error: ${b.message}`),m()}}),setTimeout(()=>c("#conn-name")?.focus(),100)}function E(){c("#modal-overlay").classList.add("hidden")}window.exportJSON=function(){let e=l.get(),a=e.results||(e.currentTableData?{columns:e.currentTableData.columns,rows:e.currentTableData.rows}:null);if(!a)return;let n=a.columns.map(t=>t.name||t),o=a.rows.map(t=>{let r={};return n.forEach(s=>r[s]=t[s]),r});ue(JSON.stringify(o,null,2),"results.json","application/json")};window.exportCSV=function(){let e=l.get(),a=e.results||(e.currentTableData?{columns:e.currentTableData.columns,rows:e.currentTableData.rows}:null);if(!a)return;let n=a.columns.map(r=>r.name||r),o=r=>{let s=r==null?"":String(r);return s.includes(",")||s.includes('"')||s.includes(`
`)?'"'+s.replace(/"/g,'""')+'"':s},t=[n.map(o).join(","),...a.rows.map(r=>n.map(s=>o(r[s])).join(","))];ue(t.join(`
`),"results.csv","text/csv")};function ue(e,a,n){let o=new Blob([e],{type:n}),t=document.createElement("a");t.href=URL.createObjectURL(o),t.download=a,t.click(),URL.revokeObjectURL(t.href)}
