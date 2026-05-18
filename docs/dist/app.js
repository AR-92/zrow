var G=e=>{let a=structuredClone(e),t=new Set,o=new Map,n={get(){return a},set(r){let s=a;a=typeof r=="function"?r(s):r,t.forEach(i=>{try{i(a,s)}catch(u){console.error("Listener error:",u)}})},update(r){n.set(r)},setKey(r,s){n.set(i=>({...i,[r]:typeof s=="function"?s(i[r]):s}))},subscribe(r,s=!1){return t.add(r),s&&r(a,a),()=>t.delete(r)},select(r,s){let i=r(a);return n.subscribe(u=>{let d=r(u);Object.is(i,d)||(s(d,i),i=d)})},on(r,s){return o.has(r)||o.set(r,new Set),o.get(r).add(s),()=>n.off(r,s)},once(r,s){let i=n.on(r,(...u)=>{i(),s(...u)});return i},off(r,s){if(!r){o.clear();return}let i=o.get(r);if(i){if(!s){i.clear();return}i.delete(s)}},emit(r,s){let i=o.get(r);if(i)for(let u of i)try{u({type:r,data:s,state:a})}catch(d){console.error(`Event "${r}" error:`,d)}},destroy(){t.clear(),o.clear()}};return n};var be=`
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
`;function j(e,a){let t=be.split(";").filter(o=>o.trim());for(let o of t)try{a(o+";")}catch(n){console.warn("Seed statement failed (likely already exists):",n.message)}}function V(){return new Promise((e,a)=>{let t=indexedDB.open("zrow_dbs",1);t.onupgradeneeded=o=>{let n=o.target.result;n.objectStoreNames.contains("dbs")||n.createObjectStore("dbs",{keyPath:"id"})},t.onsuccess=o=>e(o.target.result),t.onerror=()=>a(new Error("Failed to open IndexedDB"))})}async function ye(e){let a=await V();return new Promise((t,o)=>{let r=a.transaction("dbs","readonly").objectStore("dbs").get(e);r.onsuccess=()=>{a.close(),t(r.result?.data||null)},r.onerror=()=>{a.close(),o(new Error("Failed to read DB"))}})}async function me(e,a){let t=await V();return new Promise((o,n)=>{let r=t.transaction("dbs","readwrite");r.objectStore("dbs").put({id:e,data:a,updated:Date.now()}),r.oncomplete=()=>{t.close(),o()},r.onerror=()=>{t.close(),n()}})}var D=class{constructor(){this._db=null,this._SQL=null,this._name=null}async open(a,t){if(this._name=a,this._SQL=await window.initSqlJs({locateFile:o=>(t||"dist/vendor/")+o}),this._db=new this._SQL.Database,a&&a!==":memory:")try{let o=await ye(a);o&&(this._db=new this._SQL.Database(o))}catch{}return this}seedIfEmpty(){try{let a=this._db.exec("SELECT count(*) as cnt FROM sqlite_master WHERE type='table'");if(a.length&&a[0].values[0][0]>0)return}catch{}j(this._db,a=>this._db.exec(a))}async save(){if(this._name&&this._name!==":memory:"&&this._db)try{await me(this._name,this._db.export())}catch{}}exec(a){let t=performance.now(),o=this._db.exec(a),n=[],r=[],s=this._db.getRowsModified();for(let u of o)u.columns?.length&&(n=u.columns.map(d=>({name:d,type:"text"})),r=u.values.map(d=>{let p={};return u.columns.forEach((b,y)=>{p[b]=d[y]}),p}));return/^\s*(INSERT|UPDATE|DELETE|CREATE|DROP|ALTER)/i.test(a)&&this.save(),{columns:n,rows:r,affectedRows:s,duration:Math.round(performance.now()-t)}}getTables(){let a=this._db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name");return a.length?a[0].values.map(t=>{let o=t[0],n=this._db.exec(`PRAGMA table_info("${o}")`),r=n.length?n[0].values.map(s=>({name:s[1],type:s[2],nullable:!s[3],defaultValue:s[4],primaryKey:!!s[5]})):[];return{name:o,type:"table",columns:r}}):[]}_escapeId(a){return`"${a.replace(/"/g,'""')}"`}_escapeLike(a){return a.replace(/'/g,"''").replace(/%/g,"\\%").replace(/_/g,"\\_")}getTableData(a,{limit:t=200,offset:o=0,filters:n={},sort:r=null}={}){try{let s="",i=[];for(let[T,R]of Object.entries(n)){if(R===""||R==null)continue;let w=this._escapeId(T);R==="__NULL__"?i.push(`${w} IS NULL`):R==="__NOTNULL__"?i.push(`${w} IS NOT NULL`):i.push(`${w} LIKE '%${this._escapeLike(R)}%' ESCAPE '\\'`)}i.length&&(s=" WHERE "+i.join(" AND "));let u="";if(r&&r.column){let T=r.direction==="desc"?"DESC":"ASC";u=` ORDER BY ${this._escapeId(r.column)} ${T}`}let d=`SELECT * FROM ${this._escapeId(a)}${s}${u} LIMIT ${t} OFFSET ${o}`,p=this._db.exec(d),b=this._db.exec(`SELECT COUNT(*) as cnt FROM ${this._escapeId(a)}${s}`),y=b.length?b[0].values[0][0]:0;if(!p.length)return{columns:[],rows:[],total:0};let h=p[0].columns.map(T=>({name:T,type:"text"})),g=p[0].values.map(T=>{let R={};return p[0].columns.forEach((w,k)=>{R[w]=T[k]}),R});return{columns:h,rows:g,total:y}}catch{return{columns:[],rows:[],total:0}}}updateRow(a,t,o){let n=Object.entries(t).filter(([r])=>r!=="id").map(([r,s])=>`"${r}" = ${s===null?"NULL":typeof s=="string"?`'${s.replace(/'/g,"''")}'`:s}`).join(", ");n&&this.exec(`UPDATE "${a}" SET ${n} WHERE id = ${typeof o=="string"&&isNaN(Number(o))?`'${o}'`:o}`)}deleteRow(a,t){this.exec(`DELETE FROM "${a}" WHERE id = ${typeof t=="string"&&isNaN(Number(t))?`'${t}'`:t}`)}updateRowByPk(a,t,o,n){let r=Object.entries(t).filter(([s])=>s!==o).map(([s,i])=>`"${s}" = ${i===null?"NULL":typeof i=="string"?`'${i.replace(/'/g,"''")}'`:i}`).join(", ");r&&this.exec(`UPDATE "${a}" SET ${r} WHERE "${o}" = ${typeof n=="string"&&isNaN(Number(n))?`'${n.replace(/'/g,"''")}'`:n}`)}deleteRowByPk(a,t,o){this.exec(`DELETE FROM "${a}" WHERE "${t}" = ${typeof o=="string"&&isNaN(Number(o))?`'${o.replace(/'/g,"''")}'`:o}`)}insertRow(a,t){let o=Object.keys(t).map(r=>`"${r}"`),n=Object.values(t).map(r=>r==null?"NULL":typeof r=="string"?`'${r.replace(/'/g,"''")}'`:r);this.exec(`INSERT INTO "${a}" (${o.join(", ")}) VALUES (${n.join(", ")})`)}createTable(a,t){let o=t.map(n=>{let r=`"${n.name}" ${n.type}`;return n.primaryKey&&(r+=" PRIMARY KEY"),n.autoIncrement&&(r+=" AUTOINCREMENT"),n.notNull&&(r+=" NOT NULL"),n.defaultValue!=null&&n.defaultValue!==""&&(r+=` DEFAULT ${typeof n.defaultValue=="string"?`'${n.defaultValue}'`:n.defaultValue}`),n.unique&&(r+=" UNIQUE"),r});this.exec(`CREATE TABLE "${a}" (${o.join(", ")})`)}dropTable(a){this.exec(`DROP TABLE IF EXISTS "${a}"`)}addColumn(a,t){let o=`"${t.name}" ${t.type}`;t.notNull&&(o+=" NOT NULL"),t.defaultValue!=null&&t.defaultValue!==""&&(o+=` DEFAULT ${typeof t.defaultValue=="string"?`'${t.defaultValue}'`:t.defaultValue}`),this.exec(`ALTER TABLE "${a}" ADD COLUMN ${o}`)}dropColumn(a,t){this.exec(`ALTER TABLE "${a}" DROP COLUMN "${t}"`)}renameTable(a,t){this.exec(`ALTER TABLE "${a}" RENAME TO "${t}"`)}getTableInfo(a){let t=this._db.exec(`PRAGMA table_info("${a}")`),o=this._db.exec(`PRAGMA index_list("${a}")`),n=this._db.exec(`PRAGMA foreign_key_list("${a}")`);return{columns:t.length?t[0].values.map(r=>({cid:r[0],name:r[1],type:r[2],notNull:!!r[3],defaultValue:r[4],primaryKey:!!r[5]})):[],indexes:o.length?o[0].values.map(r=>({name:r[1],unique:!r[2],origin:r[3]})):[],foreignKeys:n.length?n[0].values.map(r=>({column:r[3],refTable:r[2],refColumn:r[4]})):[]}}};function fe(){try{return JSON.parse(localStorage.getItem("zrow_connections")||"[]")}catch{return[]}}function X(e){localStorage.setItem("zrow_connections",JSON.stringify(e))}var ge=Date.now();function xe(){return++ge}var he={theme:localStorage.getItem("zrow_theme")||"dark",connections:fe(),activeConnectionId:null,tabs:[],activeTabId:null,statusText:"Ready",results:null,queryRunning:!1,queryError:null,tables:[],currentTable:null,currentTableData:null,currentTableInfo:null,sidebarView:"tables",recordCount:null,tableFilters:{},tableSort:null,sidebarCollapsed:JSON.parse(localStorage.getItem("zrow_sidebar_collapsed")||"false"),schemaPanelCollapsed:!1},l=G(he),N={toggleTheme(){let e=l.get().theme==="dark"?"light":"dark";l.setKey("theme",e),localStorage.setItem("zrow_theme",e),document.documentElement.classList.toggle("dark",e==="dark")},addConnection(e){let{connections:a}=l.get(),t=e.id||"conn_"+Date.now(),o=e.id?a.map(n=>n.id===e.id?{...e}:n):[...a,{...e,id:t}];return l.setKey("connections",o),X(o),t},deleteConnection(e){let{connections:a,activeConnectionId:t,tabs:o}=l.get(),n=a.filter(r=>r.id!==e);l.setKey("connections",n),X(n),l.setKey("tabs",o.filter(r=>r.connectionId!==e)),t===e&&(l.setKey("activeConnectionId",null),l.setKey("tables",[]),l.setKey("currentTable",null),l.setKey("currentTableData",null))},setActiveConnection(e){l.setKey("activeConnectionId",e)},addTab(e="editor",a={}){let{tabs:t,activeConnectionId:o}=l.get(),n=xe(),r={id:n,type:e,name:a.name||(e==="editor"?`Query ${t.filter(s=>s.type==="editor").length+1}`:a.tableName||"Table"),connectionId:a.connectionId||o,sql:a.sql||"",tableName:a.tableName||null};return l.setKey("tabs",[...t,r]),l.setKey("activeTabId",n),n},closeTab(e){let{tabs:a,activeTabId:t}=l.get(),o=a.findIndex(r=>r.id===e),n=a.filter(r=>r.id!==e);if(l.setKey("tabs",n),t===e){let r=Math.min(o,n.length-1);l.setKey("activeTabId",n.length?n[Math.max(0,r)].id:null)}},setActiveTab(e){l.setKey("activeTabId",e)},updateTabSQL(e,a){l.setKey("tabs",l.get().tabs.map(t=>t.id===e?{...t,sql:a}:t))},setStatus(e){l.setKey("statusText",e)},setResults(e){l.setKey("results",e),l.setKey("queryError",null)},setQueryError(e){l.setKey("queryError",e),l.setKey("results",null)},setQueryRunning(e){l.setKey("queryRunning",e)},setTables(e){l.setKey("tables",e)},setCurrentTable(e){l.setKey("currentTable",e)},setCurrentTableData(e){l.setKey("currentTableData",e)},setCurrentTableInfo(e){l.setKey("currentTableInfo",e)},setSidebarView(e){l.setKey("sidebarView",e)},setRecordCount(e){l.setKey("recordCount",e)},setTableFilters(e){l.setKey("tableFilters",e)},setTableSort(e){l.setKey("tableSort",e)},clearTableFilters(){l.setKey("tableFilters",{})},toggleSidebar(){let e=!l.get().sidebarCollapsed;l.setKey("sidebarCollapsed",e),localStorage.setItem("zrow_sidebar_collapsed",JSON.stringify(e))},toggleSchemaPanel(){l.setKey("schemaPanelCollapsed",!l.get().schemaPanelCollapsed)}};var f=null;function _(){return f}async function K(e){let a=new D;return await a.open(e.database||e.name,e.wasmPath),e.seed!==!1&&a.seedIfEmpty(),f=a,l.setKey("activeConnectionId",e.id),l.setKey("tables",a.getTables()),l.setKey("statusText",`Connected \u2014 ${e.name}`),a}async function Y(){f&&await f.save(),f=null,l.setKey("activeConnectionId",null),l.setKey("tables",[]),l.setKey("currentTable",null),l.setKey("currentTableData",null),l.setKey("currentTableInfo",null)}async function q(e){if(!f)throw new Error("Not connected");l.setKey("queryRunning",!0),l.setKey("queryError",null);try{let a=f.exec(e);return l.setKey("results",a),l.setKey("queryRunning",!1),l.setKey("statusText",`${a.rows.length} rows in ${a.duration}ms`),a}catch(a){throw l.setKey("queryError",a.message),l.setKey("queryRunning",!1),l.setKey("statusText","Query failed"),a}}async function U(e){if(f)try{l.setKey("currentTable",e),l.setKey("tableFilters",{}),l.setKey("tableSort",null);let{tableFilters:a,tableSort:t}=l.get(),o=f.getTableData(e,{filters:a,sort:t}),n=f.getTableInfo(e);l.setKey("currentTableData",o),l.setKey("currentTableInfo",n),l.setKey("statusText",`Table "${e}" \u2014 ${o.total} rows`)}catch{}}async function O(){let{currentTable:e,tableFilters:a,tableSort:t}=l.get();if(!(!e||!f||!l.get().activeConnectionId))try{let r=f.getTableData(e,{filters:a,sort:t}),s=f.getTableInfo(e);l.setKey("currentTableData",r),l.setKey("currentTableInfo",s);let i=Object.values(a).filter(d=>d&&d!=="").length,u=[`${r.total} rows`];i&&u.push(`${i} filter${i>1?"s":""}`),t&&u.push(`sorted by ${t.column}`),l.setKey("statusText",`Table "${e}" \u2014 ${u.join(", ")}`)}catch{}}function $(){let{currentTable:e}=l.get();e&&U(e)}function I(){f&&l.setKey("tables",f.getTables())}async function B(e,a){f&&(f.insertRow(e,a),l.setKey("statusText",`Row inserted into "${e}"`),$(),I())}async function W(e,a,t,o){f&&(f.updateRowByPk(e,a,t,o),l.setKey("statusText",`Row updated in "${e}"`),$())}async function Q(e,a,t){f&&(f.deleteRowByPk(e,a,t),l.setKey("statusText",`Row deleted from "${e}"`),$(),I())}async function P(e,a){f&&(f.createTable(e,a),l.setKey("statusText",`Table "${e}" created`),I())}async function J(e){f&&(f.dropTable(e),l.get().currentTable===e&&(l.setKey("currentTable",null),l.setKey("currentTableData",null),l.setKey("currentTableInfo",null)),l.setKey("statusText",`Table "${e}" dropped`),I())}async function F(e,a){f&&(f.addColumn(e,a),l.setKey("statusText",`Column "${a.name}" added to "${e}"`),$(),I())}async function z(e,a){f&&(f.dropColumn(e,a),l.setKey("statusText",`Column "${a}" dropped from "${e}"`),$(),I())}async function Z(e,a){f&&(f.renameTable(e,a),l.get().currentTable===e&&l.setKey("currentTable",a),l.setKey("statusText",`Table renamed to "${a}"`),I())}function C(e,a={},...t){let o=document.createElement(e);for(let[n,r]of Object.entries(a))n==="className"?o.className=r:n==="style"&&typeof r=="object"?Object.assign(o.style,r):n.startsWith("on")?o.addEventListener(n.slice(2).toLowerCase(),r):n==="dataset"&&typeof r=="object"?Object.assign(o.dataset,r):n==="html"?o.innerHTML=r:n==="text"?o.textContent=r:o.setAttribute(n,r);for(let n of t)n!=null&&(typeof n=="string"||typeof n=="number"?o.appendChild(document.createTextNode(n)):n instanceof Node&&o.appendChild(n));return o}function c(e,a=document){return a.querySelector(e)}function M(e,a=document){return a.querySelectorAll(e)}function v(e,a,t,o){let n=r=>{let s=r.target.closest(a);s&&e.contains(s)&&o(r,s)};return e.addEventListener(t,n),()=>e.removeEventListener(t,n)}function A(e){for(;e.firstChild;)e.removeChild(e.firstChild)}function L(e){let a=document.createElement("div");return a.textContent=e,a.innerHTML}function x(e){window.lucide&&(e?lucide.createIcons({root:e}):lucide.createIcons())}var Te=new Set(["SELECT","FROM","WHERE","INSERT","INTO","VALUES","UPDATE","SET","DELETE","CREATE","TABLE","ALTER","DROP","INDEX","VIEW","JOIN","LEFT","RIGHT","INNER","OUTER","FULL","CROSS","ON","AND","OR","NOT","IN","NULL","IS","LIKE","BETWEEN","EXISTS","UNION","ALL","DISTINCT","AS","ORDER","BY","GROUP","HAVING","LIMIT","OFFSET","ASC","DESC","CASE","WHEN","THEN","ELSE","END","WITH","RECURSIVE","PRIMARY","KEY","FOREIGN","REFERENCES","CASCADE","CONSTRAINT","DEFAULT","CHECK","UNIQUE","IF","GRANT","REVOKE","COMMIT","ROLLBACK","BEGIN","TRANSACTION","EXPLAIN","ANALYZE","TRUNCATE","RETURNING","USING","NATURAL","EXCEPT","INTERSECT","FETCH","NEXT","ROWS","ONLY","FOR","OF","MERGE","MATCHED","DO","NOTHING"]),Ee=new Set(["INT","INTEGER","BIGINT","SMALLINT","TINYINT","BOOLEAN","BIT","FLOAT","DOUBLE","REAL","DECIMAL","NUMERIC","MONEY","CHAR","VARCHAR","TEXT","CLOB","NCHAR","NVARCHAR","NTEXT","BINARY","VARBINARY","BLOB","BYTEA","DATE","TIME","TIMESTAMP","DATETIME","YEAR","INTERVAL","JSON","JSONB","UUID","ARRAY","ENUM","SERIAL","BIGSERIAL","GEOMETRY","GEOGRAPHY","POINT","LINESTRING","POLYGON"]),ve=new Set(["COUNT","SUM","AVG","MIN","MAX","COALESCE","NULLIF","CAST","CONVERT","SUBSTRING","UPPER","LOWER","TRIM","LENGTH","REPLACE","CONCAT","NOW","CURRENT_DATE","CURRENT_TIME","CURRENT_TIMESTAMP","EXTRACT","DATE_PART","DATE_TRUNC","ROUND","CEIL","FLOOR","ABS","MOD","POWER","SQRT","EXP","LN","LOG","GREATEST","LEAST","ROW_NUMBER","RANK","DENSE_RANK","LEAD","LAG","FIRST_VALUE","LAST_VALUE","NTH_VALUE","STRING_AGG","ARRAY_AGG","JSON_AGG","GROUP_CONCAT","LISTAGG","TO_CHAR","TO_DATE","TO_NUMBER","LEFT","RIGHT","POSITION","STRPOS","REGEXP_REPLACE","REGEXP_MATCH","SPLIT_PART","MD5","SHA256","RANDOM","GEN_RANDOM_UUID"]),we=new Set(["TRUE","FALSE","NULL","UNKNOWN","CURRENT_USER","SESSION_USER","CURRENT_DATE","CURRENT_TIME","CURRENT_TIMESTAMP","LOCALTIME","LOCALTIMESTAMP","CURRENT_CATALOG","CURRENT_SCHEMA","DEFAULT"]);function ee(e){if(!e)return"";let a=[],t=0,o=e.length;for(;t<o;){if(e[t]===`
`){a.push({type:"text",value:`
`}),t++;continue}if(e[t]===" "||e[t]==="	"){let n="";for(;t<o&&(e[t]===" "||e[t]==="	");)n+=e[t++];a.push({type:"text",value:n});continue}if(e[t]==="-"&&e[t+1]==="-"){let n="";for(t+=2;t<o&&e[t]!==`
`;)n+=e[t++];a.push({type:"comment",value:"--"+n});continue}if(e[t]==="/"&&e[t+1]==="*"){let n="/*";for(t+=2;t<o-1&&!(e[t]==="*"&&e[t+1]==="/");)n+=e[t++];t<o-1&&(n+="*/",t+=2),a.push({type:"comment",value:n});continue}if(e[t]==="'"||e[t]==='"'||e[t]==="`"){let n=e[t],r=n;for(t++;t<o;){if(e[t]==="\\"&&t+1<o){r+=e[t]+e[t+1],t+=2;continue}if(r+=e[t],e[t]===n){t++;break}t++}a.push({type:"string",value:r});continue}if(e[t]==="$"&&t+1<o&&e[t+1]==="$"){let n="$$";for(t+=2;t<o-1&&!(e[t]==="$"&&e[t+1]==="$");)n+=e[t++];t<o-1&&(n+="$$",t+=2),a.push({type:"string",value:n});continue}if(/[0-9]/.test(e[t])&&(t===0||/[\s,()=<>!+\-*/%]/.test(e[t-1]))){let n="";for(;t<o&&/[0-9.]/.test(e[t]);)n+=e[t++];n.endsWith(".")&&(n=n.slice(0,-1),t--),a.push({type:"number",value:n});continue}if(/[a-zA-Z_]/.test(e[t])){let n="";for(;t<o&&/[a-zA-Z0-9_]/.test(e[t]);)n+=e[t++];let r=n.toUpperCase();Te.has(r)?a.push({type:"keyword",value:n}):Ee.has(r)?a.push({type:"type",value:n}):ve.has(r)?a.push({type:"function",value:n}):we.has(r)?a.push({type:"builtin",value:n}):a.push({type:"text",value:n});continue}if(/[()]/.test(e[t])){a.push({type:"text",value:e[t]}),t++;continue}if(e[t]===":"&&t+1<o&&/[a-zA-Z]/.test(e[t+1])){let n=":";for(t++;t<o&&/[a-zA-Z0-9_]/.test(e[t]);)n+=e[t++];a.push({type:"variable",value:n});continue}if(/[=<>!+\-*/%,;.]/.test(e[t])){let n=e[t];t++,(n==="<"||n===">"||n==="!"||n==="=")&&t<o&&e[t]==="="&&(n+="=",t++),a.push({type:"operator",value:n});continue}a.push({type:"text",value:e[t]}),t++}return a.map(n=>`<span class="${`sql-${n.type}`}">${Le(n.value)}</span>`).join("")}function Le(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function Ne(e){return e?e.split(`
`).length:1}function te(e){let a=Ne(e);return Array.from({length:a},(t,o)=>o+1).join(`
`)}document.addEventListener("DOMContentLoaded",()=>{let{theme:e}=l.get();document.documentElement.classList.toggle("dark",e==="dark"),m(),l.subscribe(()=>{let a=l.get(),t=c("#status-text");t&&(t.textContent=a.statusText);let o=c("#status-icon");o&&(o.className=`w-2 h-2 rounded-full ${a.queryRunning?"bg-amber-400 animate-pulse":a.activeConnectionId?"bg-emerald-400":"bg-gray-600"}`)})});function m(){Re(),ke(),Oe(),Ge(),x()}document.addEventListener("DOMContentLoaded",()=>{c("#sidebar-toggle")?.addEventListener("click",()=>{let{toggleSidebar:e}=N;e(),m()})});function Re(){let e=c("#sidebar"),a=l.get(),t=a.sidebarCollapsed;e.style.width=t?"0px":"224px",e.classList.toggle("border-r-0",t);let o=c("#sidebar-toggle");o&&(o.innerHTML=`<i data-lucide="${t?"panel-left-open":"panel-left-close"}" class="w-3 h-3"></i>`,x(o)),A(e);let{connections:n,activeConnectionId:r,tables:s,currentTable:i}=a;e.innerHTML=`
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
  `,document.addEventListener("contextmenu",p=>{let b=c("#table-context-menu");b&&b.remove()});let u=c("#sidebar-body");if(!n.length&&!r){u.innerHTML=`
      <div class="flex flex-col items-center gap-3 py-8 px-4 text-center">
        <i data-lucide="database" class="w-8 h-8 text-gray-700"></i>
        <p class="text-xs text-gray-600">No connections yet</p>
        <button id="btn-new-conn" class="px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors">
          <i data-lucide="plus" class="w-3 h-3 inline-block mr-1"></i> New Database
        </button>
      </div>
    `,c("#btn-new-conn")?.addEventListener("click",re),x(u);return}let d="";for(let p of n){let b=p.id===r;if(d+=`
      <div class="conn-item flex items-center gap-2 px-3 py-1.5 mx-1 rounded-lg cursor-pointer text-xs transition-all ${b?"bg-blue-500/10 text-blue-400":"text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"}" data-id="${p.id}">
        <i data-lucide="${b?"plug":"database"}" class="w-3.5 h-3.5 shrink-0"></i>
        <span class="truncate flex-1">${p.name}</span>
        <span class="text-[10px] text-gray-600">SQLite</span>
        <button class="btn-del-conn opacity-0 hover:opacity-100 hover:text-red-400 transition-opacity" data-id="${p.id}">
          <i data-lucide="x" class="w-3 h-3"></i>
        </button>
      </div>
    `,b&&s.length){d+='<div class="ml-2 pl-2 border-l border-gray-800/60 mt-0.5">',d+=`<div class="flex items-center justify-between px-2 py-1 text-[10px] text-gray-600 uppercase tracking-wider font-medium">
        <span><i data-lucide="layers" class="w-3 h-3 mr-1"></i> Tables <span class="font-normal ml-1">(${s.length})</span></span>
        <button id="btn-new-table" class="p-0.5 rounded hover:bg-gray-700/50 hover:text-gray-400 transition-colors" title="New Table">
          <i data-lucide="plus" class="w-3 h-3"></i>
        </button>
      </div>`;for(let y of s){let h=i===y.name;d+=`
          <div class="table-item flex items-center gap-1.5 px-2 py-1 rounded text-xs cursor-pointer transition-all group ${h?"text-blue-400 bg-blue-500/5":"text-gray-400 hover:text-gray-200 hover:bg-gray-800/40"}" data-table="${y.name}">
            <i data-lucide="table" class="w-3 h-3 shrink-0"></i>
            <span class="truncate flex-1">${y.name}</span>
            <span class="ml-1 text-[9px] text-gray-600">${y.columns.length}</span>
            <button class="btn-table-actions ml-auto p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-gray-700/50 hover:text-gray-300 transition-all ${h?"text-blue-400":"text-gray-600"}" data-table="${y.name}" title="Actions">
              <i data-lucide="more-horizontal" class="w-3 h-3"></i>
            </button>
          </div>
        `}d+="</div>"}}u.innerHTML=d,x(u),v(u,".conn-item","click",async(p,b)=>{let y=b.dataset.id,h=n.find(g=>g.id===y);if(h){if(r===y){await Y(),m();return}l.setKey("statusText",`Connecting to ${h.name}...`),m();try{await K(h),m()}catch(g){l.setKey("statusText",`Error: ${g.message}`),m()}}}),v(u,".btn-del-conn","click",(p,b)=>{p.stopPropagation(),confirm("Delete this connection?")&&(N.deleteConnection(b.dataset.id),m())}),v(u,".table-item","click",async(p,b)=>{if(p.target.closest(".btn-table-actions"))return;let y=b.dataset.table;l.get().currentTable!==y&&(await U(y),m())}),v(u,".btn-table-actions","click",(p,b)=>{p.stopPropagation(),Ce(b,b.dataset.table)}),c("#btn-new-table")?.addEventListener("click",()=>le()),r||(u.innerHTML+=`
      <div class="px-3 mt-2">
        <button id="btn-new-conn" class="w-full px-3 py-1.5 text-xs font-medium rounded-lg border border-dashed border-gray-700 text-gray-500 hover:text-gray-300 hover:border-gray-600 transition-colors">
          <i data-lucide="plus" class="w-3 h-3 inline-block mr-1"></i> New Connection
        </button>
      </div>
    `,c("#btn-new-conn")?.addEventListener("click",re),x(u))}function Ce(e,a){let t=c("#table-context-menu");t&&t.remove();let o=e.getBoundingClientRect(),n=C("div",{id:"table-context-menu",className:"fixed z-50 bg-gray-800 border border-gray-700/60 rounded-lg shadow-xl py-1 text-xs min-w-[140px]",style:{left:o.left+"px",top:o.bottom+4+"px"}}),r=[{label:"Browse",icon:"eye",action:()=>{U(a),m()}},{label:"Add Column",icon:"columns",action:()=>ie(a)},{label:"Rename Table",icon:"edit-3",action:()=>He(a)},{type:"divider"},{label:"Duplicate Schema",icon:"copy",action:()=>Ae(a)},{label:"Drop Table",icon:"trash-2",className:"text-red-400 hover:bg-red-500/10",action:()=>ce(`Drop table "${a}"? This cannot be undone.`,()=>Se(a))}];for(let s of r){if(s.type==="divider"){n.appendChild(C("div",{className:"h-px bg-gray-700/60 my-1"}));continue}let i=C("button",{className:`flex items-center gap-2 w-full px-3 py-1.5 text-left hover:bg-gray-700/50 transition-colors ${s.className||"text-gray-300"}`,onClick:()=>{n.remove(),s.action()}});i.innerHTML=`<i data-lucide="${s.icon}" class="w-3 h-3"></i> ${s.label}`,n.appendChild(i)}document.body.appendChild(n),x(n),setTimeout(()=>{let s=i=>{!n.contains(i.target)&&i.target!==e&&(n.remove(),document.removeEventListener("click",s))};document.addEventListener("click",s)},0)}async function Ae(e){let a=_();if(!a)return;let t=e+"_copy",n=a.getTableInfo(e).columns.map(s=>({name:s.name,type:s.type,primaryKey:s.primaryKey,notNull:s.notNull,defaultValue:s.defaultValue}));await P(t,n);let r=a.getTableData(e,{limit:99999});for(let s of r.rows)await B(t,s);l.setKey("statusText",`Table "${e}" duplicated as "${t}"`),Ie(),m()}async function Se(e){await J(e),m()}function Ie(){let e=_();e&&l.setKey("tables",e.getTables())}function ke(){let e=c("#tab-bar");A(e);let{tabs:a,activeTabId:t}=l.get();if(!a.length){e.innerHTML='<div class="flex items-center px-3 text-[11px] text-gray-600">No tabs</div>';return}for(let o of a){let n=o.id===t,r=C("div",{className:`tab-item flex items-center gap-1.5 px-3 py-1.5 text-xs cursor-pointer border-r border-gray-800/60 select-none whitespace-nowrap transition-all ${n?"text-blue-400 bg-blue-500/5":"text-gray-500 hover:text-gray-300 hover:bg-gray-800/30"}`,dataset:{tabId:o.id}});r.innerHTML=`<i data-lucide="${o.type==="editor"?"terminal":"table"}" class="w-3 h-3"></i>`,r.appendChild(C("span",{className:"truncate max-w-[120px]"},o.name));let s=C("button",{className:"flex items-center justify-center w-3.5 h-3.5 rounded hover:bg-gray-700/60 transition-all ml-0.5",dataset:{tabClose:o.id}});s.innerHTML='<i data-lucide="x" class="w-2.5 h-2.5"></i>',r.appendChild(s),e.appendChild(r)}x(e),v(e,".tab-item","click",(o,n)=>{let r=parseInt(n.dataset.tabId);isNaN(r)||(a.find(i=>i.id===r)?.type==="editor"&&(l.setKey("currentTable",null),l.setKey("currentTableData",null),l.setKey("currentTableInfo",null)),N.setActiveTab(r),m())}),v(e,"[data-tab-close]","click",(o,n)=>{o.stopPropagation();let r=parseInt(n.dataset.tabClose);isNaN(r)||(N.closeTab(r),m())})}function Oe(){let e=c("#content-area");A(e);let a=l.get(),{tabs:t,activeTabId:o}=a;if(a.currentTable&&a.currentTableData){Ue(e,a);return}if(!t.length||!o){e.innerHTML=`
      <div class="flex flex-col items-center justify-center h-full gap-4 text-gray-600">
        <i data-lucide="terminal" class="w-12 h-12 opacity-30"></i>
        <p class="text-sm">${a.activeConnectionId?"Open a table or write a query":"Connect to a database to get started"}</p>
        ${a.activeConnectionId?'<button id="btn-new-query" class="px-4 py-2 text-xs font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors"><i data-lucide="plus" class="w-3 h-3 inline-block mr-1"></i> New Query</button>':""}
      </div>
    `,c("#btn-new-query")?.addEventListener("click",()=>{l.setKey("currentTable",null),l.setKey("currentTableData",null),l.setKey("currentTableInfo",null),N.addTab("editor"),m()}),x(e);return}let n=t.find(r=>r.id===o);n?.type==="editor"&&$e(e,n,a)}function $e(e,a){let t=l.get();e.innerHTML=`
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
  `,x(e);let o=c("#editor-input"),n=c("#editor-highlight"),r=c("#editor-gutter"),s=c("#editor-status");function i(){let d=o.value;n.innerHTML=ee(d)+`
`.repeat(Math.max(1,(d.match(/\n/g)||"").length+1)),r.textContent=te(d),N.updateTabSQL(a.id,d)}o.addEventListener("input",i),o.addEventListener("scroll",()=>{n.scrollTop=o.scrollTop,n.scrollLeft=o.scrollLeft,r.scrollTop=o.scrollTop}),o.addEventListener("keydown",d=>{if(d.key==="Tab"){d.preventDefault();let p=o.selectionStart;o.value=o.value.substring(0,p)+"  "+o.value.substring(o.selectionEnd),o.selectionStart=o.selectionEnd=p+2,i()}(d.ctrlKey||d.metaKey)&&d.key==="Enter"&&(d.preventDefault(),ae())}),i(),setTimeout(()=>o.focus(),50),c("#btn-run")?.addEventListener("click",ae),ne(t);let u=l.subscribe(()=>{ne(l.get()),De(c("#results-panel"))},!1)}function ne(e){let a=c("#editor-status");a&&(e.queryRunning?a.innerHTML='<i data-lucide="loader-circle" class="w-3 h-3 animate-spin inline-block mr-1"></i> Running...':e.queryError?a.innerHTML=`<i data-lucide="alert-circle" class="w-3 h-3 inline-block mr-1"></i> ${e.queryError}`:e.results?a.textContent=`${e.results.rows.length} rows in ${e.results.duration}ms`:a.textContent="Ready",x(a?.parentElement))}function De(e){if(!e)return;let a=l.get();if(a.queryRunning){e.innerHTML='<div class="flex items-center justify-center h-full gap-2 text-sm text-gray-500"><i data-lucide="loader-circle" class="w-4 h-4 animate-spin"></i> Running...</div>',x(e);return}if(a.queryError){e.innerHTML=`<div class="flex items-start gap-2 p-4 text-sm text-red-400"><i data-lucide="alert-circle" class="w-4 h-4 mt-0.5 shrink-0"></i> ${a.queryError}</div>`,x(e);return}if(!a.results?.columns?.length){e.innerHTML='<div class="flex flex-col items-center justify-center h-full gap-3 text-gray-600"><i data-lucide="arrow-up-right" class="w-8 h-8 opacity-30"></i><span class="text-xs">Run a query to see results</span></div>',x(e);return}e.innerHTML=se(a.results,!0),x(e)}async function ae(){let e=c("#editor-input")?.value?.trim();if(!(!e||!l.get().activeConnectionId))try{await q(e)}catch{}}function Ue(e,a){let t=a.currentTableData,o=a.currentTableInfo,n=a.currentTable;if(!t){e.innerHTML='<div class="flex items-center justify-center h-full text-gray-600 text-sm">Loading...</div>';return}let r=o?.columns?.find(u=>u.primaryKey)?.name||null,s=a.schemaPanelCollapsed,i=o?.columns?.map((u,d)=>`<div class="flex items-center gap-2 px-3 py-1.5 text-xs border-b border-gray-800/30 hover:bg-gray-800/20 group">
      <span class="w-28 font-medium text-gray-300">${u.name}</span>
      <span class="w-20 text-blue-400 font-mono">${u.type}</span>
      <span class="w-28 text-gray-500">${u.primaryKey?'<span class="text-amber-400 font-medium">PK</span>':""}${u.notNull?' <span class="text-gray-600">NOT NULL</span>':""}</span>
      <span class="flex-1 text-gray-600 truncate">${u.defaultValue!=null?`default: ${u.defaultValue}`:""}</span>
      <button class="btn-drop-col p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-400 transition-all text-gray-600" data-col="${u.name}" title="Drop column">
        <i data-lucide="x" class="w-3 h-3"></i>
      </button>
    </div>`).join("")||"";e.innerHTML=`
    <div class="flex flex-col h-full">
      <div class="flex items-center gap-2 px-3 py-1.5 border-b border-gray-800/60 bg-gray-900/30 shrink-0">
        <i data-lucide="table" class="w-4 h-4 text-blue-400"></i>
        <span class="text-sm font-medium text-gray-200">${L(n)}</span>
        <span class="text-xs text-gray-500">${t.total||0} rows</span>
        <button id="btn-query-table" class="ml-auto px-2 py-1 text-xs rounded-md bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 transition-colors flex items-center gap-1">
          <i data-lucide="terminal" class="w-3 h-3"></i> Query
        </button>
      </div>
      <div class="flex flex-1 overflow-hidden">
        <div class="flex-1 flex flex-col overflow-hidden">
          ${se({columns:t.columns,rows:t.rows},!0,r,a.tableFilters,a.tableSort)}
        </div>
        ${o?`<div id="schema-panel" class="shrink-0 border-l border-gray-800/60 bg-gray-900/30 overflow-hidden transition-all duration-200 ${s?"w-0 border-l-0":"w-56 hidden md:block"}">
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
          ${o.indexes.map(u=>`<div class="px-3 py-1 text-xs text-gray-400">${u.name} ${u.unique?"(unique)":""}</div>`).join("")}`:""}
          ${o.foreignKeys?.length?`<div class="px-3 py-2 text-[10px] text-gray-500 uppercase tracking-wider font-medium border-b border-gray-800/60 mt-2">Foreign Keys</div>
          ${o.foreignKeys.map(u=>`<div class="px-3 py-1 text-xs text-gray-400">${u.column} \u2192 ${u.refTable}(${u.refColumn})</div>`).join("")}`:""}
          </div>`}
          ${s?'<div class="flex items-center justify-center h-full cursor-pointer hover:bg-gray-800/30 transition-colors" id="btn-expand-schema" title="Show columns"><i data-lucide="chevron-left" class="w-4 h-4 text-gray-600"></i></div>':""}
        </div>`:""}
      </div>
    </div>
  `,x(e),c("#btn-query-table")?.addEventListener("click",()=>{N.addTab("editor",{connectionId:l.get().activeConnectionId,name:`Query: ${n}`,sql:`SELECT * FROM "${n}" LIMIT 100`}),m()}),v(e,".btn-add-col-inline","click",()=>Fe(e,n,r)),v(e,".btn-add-row-inline","click",()=>Pe(e,n,o,r)),c("#btn-add-col-panel")?.addEventListener("click",()=>ie(n)),c("#btn-toggle-schema")?.addEventListener("click",()=>{N.toggleSchemaPanel(),m()}),c("#btn-expand-schema")?.addEventListener("click",()=>{N.toggleSchemaPanel(),m()}),v(e,".btn-drop-col",async(u,d)=>{let p=d.dataset.col;ce(`Drop column "${p}" from "${n}"?`,async()=>{await z(n,p),m()})}),Me(e,n,r,t),_e(e,n,r),Ke(e,n),Be(e,n)}function Me(e,a,t){v(e,".result-table td[data-col]","dblclick",(s,i)=>{if(i.querySelector("input, select, textarea"))return;let u=i.dataset.col,p=i.closest("tr")?.dataset?.pkVal;!t||!p||u===t||o(i,u,p,a)});function o(s,i,u,d){let p=s.closest("tr"),b=p?.closest("tbody"),y=s.querySelector(".text-gray-600.italic"),g=s.dataset.formula||(y?"":s.textContent);s.innerHTML=`<input class="cell-edit-input w-full bg-gray-800 border border-blue-500/50 rounded px-1 py-0.5 text-xs text-gray-200 outline-none" value="${L(g)}" />`;let T=s.querySelector("input");T.focus(),T.select();function R(){let k=T.value.trim(),S=k===""?null:k,H={};if(H[i]=S,S!==null&&S.startsWith("=")){let ue=n(p),pe=oe(S,ue);s.innerHTML=`<span class="formula-result text-emerald-400">${L(pe)}</span>`,s.dataset.formula=S,s.classList.add("formula-cell")}else s.innerHTML=S===null?'<span class="text-gray-600 italic">NULL</span>':L(S),delete s.dataset.formula,s.classList.remove("formula-cell");s.title=S??"",W(d,H,t,u).catch(()=>{s.innerHTML=L(g||"NULL")})}T.addEventListener("blur",R),T.addEventListener("keydown",w=>{w.key==="Enter"?(w.preventDefault(),T.blur(),r(s,"down")):w.key==="Tab"&&!w.shiftKey?(w.preventDefault(),T.blur(),r(s,"right")):w.key==="Tab"&&w.shiftKey?(w.preventDefault(),T.blur(),r(s,"left")):w.key==="Escape"&&(w.preventDefault(),s.innerHTML=y?'<span class="text-gray-600 italic">NULL</span>':L(g))})}function n(s){let i={};if(!s)return i;let u=s.querySelectorAll("td[data-col]");for(let d of u){let p=d.dataset.col,b=d.dataset.formula;if(b)i[p]=b;else{let y=d.querySelector(".text-gray-600.italic");i[p]=y?null:d.textContent}}return i}function r(s,i){let u=s.closest("tr");if(!u?.closest("tbody")||!u)return;let p=[...u.querySelectorAll("td[data-col]")],b=p.indexOf(s),y=null;if(i==="right"&&b<p.length-1)y=p[b+1];else if(i==="left"&&b>0)y=p[b-1];else if(i==="down"||i==="right"&&b>=p.length-1){let h=u.nextElementSibling;if(h&&h.tagName==="TR"&&!h.classList.contains("btn-add-row-inline")){let g=[...h.querySelectorAll("td[data-col]")];y=g[Math.min(b,g.length-1)]}}if(y&&!y.querySelector("input")){let h=y.dataset.col,g=y.closest("tr")?.dataset?.pkVal;t&&g&&h!==t&&o(y,h,g,a)}}}function _e(e,a,t){v(e,".btn-del-row",async(o,n)=>{let r=n.dataset.pkVal;!t||!r||confirm("Delete this row?")&&(await Q(a,t,r),m())})}function Ke(e,a){let t={};v(e,".filter-input","input",(o,n)=>{let r=n.dataset.filterCol,s=n.value;clearTimeout(t[r]),t[r]=setTimeout(()=>{let u={...l.get().tableFilters};s?u[r]=s:delete u[r],N.setTableFilters(u),O().then(()=>m())},250)}),v(e,".filter-input","keydown",(o,n)=>{if(o.key==="Enter"){o.preventDefault(),clearTimeout(t[n.dataset.filterCol]);let s={...l.get().tableFilters},i=n.value;i?s[n.dataset.filterCol]=i:delete s[n.dataset.filterCol],N.setTableFilters(s),O().then(()=>m())}if(o.key==="Escape"){n.value="",n.blur(),clearTimeout(t[n.dataset.filterCol]);let s={...l.get().tableFilters};delete s[n.dataset.filterCol],N.setTableFilters(s),O().then(()=>m())}}),v(e,".btn-clear-filters","click",()=>{N.setTableFilters({}),O().then(()=>m())})}function Be(e,a){v(e,".sort-th","click",(t,o)=>{let n=o.dataset.sortCol;if(t.target.closest(".btn-add-col-inline"))return;let s=l.get().tableSort,i=null;!s||s.column!==n?i={column:n,direction:"asc"}:s.direction==="asc"?i={column:n,direction:"desc"}:i=null,N.setTableSort(i),O().then(()=>m())})}function oe(e,a){if(!e||!e.startsWith("="))return e;try{let t=e.slice(1).trim();if(!t)return"";let o=Object.keys(a),n=o.map(i=>a[i]),s=new Function(...o,`try { return (${t}) } catch(e) { return '#ERR:' + e.message; }`)(...n);return s==null?"":String(s)}catch{return"#ERROR"}}function Pe(e,a,t,o){if(!t?.columns)return;let n=c("#add-row-placeholder");if(!n)return;let r=t.columns,s=r.filter(d=>!d.primaryKey||d.defaultValue===null);n.classList.remove("btn-add-row-inline","cursor-pointer"),n.innerHTML="";for(let d of r){let p=d.primaryKey,b=s.includes(d);if(p&&d.defaultValue==null)n.appendChild(C("td",{className:"text-gray-600 text-xs px-3 py-1"},"PK"));else{let y=C("input",{className:"inline-add-row-input w-full text-xs px-1.5 py-1 rounded border border-gray-700 bg-gray-800/80 text-gray-200 outline-none focus:border-blue-500/40",placeholder:d.type,dataset:{col:d.name}});d.defaultValue!=null&&(y.value=String(d.defaultValue));let h=C("td",{className:"px-1 py-1"});h.appendChild(y),n.appendChild(h)}}let i=C("td",{className:"text-center px-1 py-1"});i.innerHTML=`
    <button class="btn-inline-save-row p-0.5 rounded hover:bg-emerald-500/20 hover:text-emerald-400 text-emerald-500 transition-colors" title="Save"><i data-lucide="check" class="w-3.5 h-3.5"></i></button>
    <button class="btn-inline-cancel-row p-0.5 rounded hover:bg-red-500/20 hover:text-red-400 text-gray-500 transition-colors" title="Cancel"><i data-lucide="x" class="w-3.5 h-3.5"></i></button>
  `,n.appendChild(i),x(n);let u=n.querySelector("input");u&&setTimeout(()=>u.focus(),50),v(n,".btn-inline-save-row","click",async()=>{let d={};for(let p of M(".inline-add-row-input",n)){let b=p.value.trim();d[p.dataset.col]=b===""?null:b}await B(a,d),m()}),v(n,".btn-inline-cancel-row","click",()=>m()),n.querySelectorAll(".inline-add-row-input").forEach(d=>{d.addEventListener("keydown",p=>{if(p.key==="Enter"){p.preventDefault();let b=n.querySelector(".btn-inline-save-row");b&&b.click()}if(p.key==="Escape"){let b=n.querySelector(".btn-inline-cancel-row");b&&b.click()}})})}function Fe(e,a,t){let o=e.querySelector(".btn-add-col-inline")?.closest("th");if(!o)return;o.innerHTML=`
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
  `,x(o);let n=c("#inline-col-name");n&&setTimeout(()=>n.focus(),50),v(o,".btn-inline-save-col","click",async()=>{let r=c("#inline-col-name")?.value?.trim(),s=c("#inline-col-type")?.value||"TEXT";r&&(await F(a,{name:r,type:s,defaultValue:null,notNull:!1}),m())}),v(o,".btn-inline-cancel-col","click",()=>m()),n&&n.addEventListener("keydown",r=>{r.key==="Enter"&&(r.preventDefault(),c(".btn-inline-save-col")?.click()),r.key==="Escape"&&c(".btn-inline-cancel-col")?.click()})}function se(e,a,t,o,n){let r=e.columns||[],s=e.rows||[];o=o||{},n=n||null;let i="";if(a){let d=Object.values(o).filter(p=>p&&p!=="").length;i+=`<div class="flex items-center gap-2 px-3 py-1 border-b border-gray-800/60 bg-gray-900/20 shrink-0 text-[11px]">
      <span class="text-gray-500">${s.length} rows</span>
      <span class="text-gray-700">\xB7</span>
      <span class="text-gray-500">${r.length} cols</span>
      ${d?`<button class="btn-clear-filters px-2 py-0.5 rounded hover:bg-gray-800 text-amber-400 hover:text-amber-300 flex items-center gap-1">
        <i data-lucide="x" class="w-3 h-3"></i> Clear ${d} filter${d>1?"s":""}
      </button>`:""}
      <button class="ml-auto px-2 py-0.5 rounded hover:bg-gray-800 text-gray-500 hover:text-gray-300 flex items-center gap-1" onclick="window.exportJSON()">
        <i data-lucide="download" class="w-3 h-3"></i> JSON
      </button>
      <button class="px-2 py-0.5 rounded hover:bg-gray-800 text-gray-500 hover:text-gray-300 flex items-center gap-1" onclick="window.exportCSV()">
        <i data-lucide="file-text" class="w-3 h-3"></i> CSV
      </button>
    </div>`}let u=r.length+(t?1:0);i+='<div class="flex-1 overflow-auto"><table class="result-table">',i+="<thead>",i+=`<tr class="sort-row">${r.map(d=>{let p=d.name||d,b=n&&n.column===p,y=b?n.direction==="asc"?"&#9650;":"&#9660;":"";return`<th class="sort-th cursor-pointer select-none hover:text-gray-200 transition-colors" data-sort-col="${p}">${p} <span class="sort-arrow text-[10px] ${b?"text-blue-400":"text-transparent"}">${y||"&#9650;"}</span></th>`}).join("")}<th class="w-9 px-1"><button class="btn-add-col-inline flex items-center justify-center w-full h-full p-0.5 rounded hover:bg-blue-500/20 hover:text-blue-400 transition-colors text-gray-600" title="Add column"><i data-lucide="plus" class="w-3.5 h-3.5"></i></button></th>${t?'<th class="w-8"></th>':""}</tr>`,i+=`<tr class="filter-row">${r.map(d=>{let p=d.name||d,b=o[p]||"";return`<td class="filter-td px-1 py-1"><input class="filter-input w-full text-[11px] px-1.5 py-1 rounded border border-gray-700/50 bg-gray-800/50 text-gray-300 outline-none placeholder-gray-600 focus:border-blue-500/40 focus:bg-gray-800 transition-all" data-filter-col="${p}" value="${L(b)}" placeholder="filter" /></td>`}).join("")}<td class="px-1"></td>${t?'<td class="w-8"></td>':""}</tr>`,i+="</thead>",i+="<tbody>";for(let d=0;d<s.length;d++){let p=s[d],b=t?p[t]:null;i+=`<tr${t?` data-pk-col="${t}" data-pk-val="${b!=null?L(String(b)):""}"`:""} data-row-idx="${d}">`;for(let y of r){let h=y.name||y,g=p[h],T,R=!1,w="";if(g!=null&&typeof g=="string"&&g.startsWith("=")){R=!0;let k=oe(g,p);w=` data-formula="${L(g)}"`,T=`<span class="formula-result text-emerald-400">${L(k)}</span>`}else g==null?T='<span class="text-gray-600 italic">NULL</span>':typeof g=="object"?T=`<span title="${L(String(g))}">${L(JSON.stringify(g))}</span>`:T=L(String(g));i+=`<td data-col="${h}"${w} title="${L(String(g??""))}" class="cursor-pointer hover:bg-blue-500/5 transition-colors${R?" formula-cell":""}">${T}</td>`}i+='<td class="text-center add-cell"></td>',t&&(i+=`<td class="text-center"><button class="btn-del-row p-0.5 rounded hover:bg-red-500/20 hover:text-red-400 text-gray-600 transition-colors" data-pk-val="${b!=null?L(String(b)):""}" title="Delete row"><i data-lucide="trash-2" class="w-3 h-3"></i></button></td>`),i+="</tr>"}return i+=`<tr class="btn-add-row-inline cursor-pointer hover:bg-blue-500/5 transition-colors" id="add-row-placeholder"><td colspan="${u+1}" class="text-center py-2 text-gray-600 hover:text-blue-400 text-xs"><span class="flex items-center justify-center gap-1"><i data-lucide="plus" class="w-3.5 h-3.5"></i> Add Row</span></td></tr>`,i+="</tbody></table></div>",i}function le(){let e=c("#modal-overlay");e.classList.remove("hidden");let a=c("#modal-content");A(a),a.innerHTML=`
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
  `,x(a),c("#modal-close").addEventListener("click",E),c("#modal-cancel").addEventListener("click",E),e.addEventListener("click",t=>{t.target===e&&E()}),document.addEventListener("keydown",function t(o){o.key==="Escape"&&(E(),document.removeEventListener("keydown",t))}),c("#ct-add-col").addEventListener("click",()=>{let t=c("#ct-columns"),o=document.createElement("div");o.className="ct-col-row flex items-center gap-2 p-2 rounded-lg bg-gray-800/50 border border-gray-700/50",o.innerHTML=`
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
    `,t.appendChild(o),x(o)}),v(c("#ct-columns"),".ct-remove-col","click",(t,o)=>{let n=o.closest(".ct-col-row");c("#ct-columns").children.length>1&&n.remove()}),c("#create-table-form").addEventListener("submit",async t=>{t.preventDefault();let o=c("#ct-name").value.trim();if(!o)return;let n=[];for(let r of M(".ct-col-row")){let s=r.querySelector(".ct-col-name").value.trim();s&&n.push({name:s,type:r.querySelector(".ct-col-type").value,primaryKey:r.querySelector(".ct-col-pk").checked,autoIncrement:r.querySelector(".ct-col-ai").checked,notNull:r.querySelector(".ct-col-nn").checked})}n.length&&(await P(o,n),E(),m())}),setTimeout(()=>c("#ct-name")?.focus(),100)}function ie(e){let a=c("#modal-overlay");a.classList.remove("hidden");let t=c("#modal-content");A(t),t.innerHTML=`
    <form id="add-col-form" class="fade-in">
      <div class="flex items-center justify-between px-5 py-3 border-b border-gray-800">
        <h2 class="text-sm font-semibold text-gray-200"><i data-lucide="columns" class="w-4 h-4 text-blue-400 inline-block mr-1.5"></i> Add Column \u2014 ${L(e)}</h2>
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
  `,x(t),c("#modal-close").addEventListener("click",E),c("#modal-cancel").addEventListener("click",E),a.addEventListener("click",o=>{o.target===a&&E()}),document.addEventListener("keydown",function o(n){n.key==="Escape"&&(E(),document.removeEventListener("keydown",o))}),c("#add-col-form").addEventListener("submit",async o=>{o.preventDefault();let n=c("#ac-name").value.trim(),r=c("#ac-type").value,s=c("#ac-default").value.trim()||null,i=c("#ac-notnull").checked;n&&(await F(e,{name:n,type:r,defaultValue:s,notNull:i}),E(),m())}),setTimeout(()=>c("#ac-name")?.focus(),100)}function He(e){let a=c("#modal-overlay");a.classList.remove("hidden");let t=c("#modal-content");A(t),t.innerHTML=`
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
          <div class="text-sm px-3 py-2 rounded-lg border border-gray-700 bg-gray-800/50 text-gray-400">${L(e)}</div>
        </div>
        <div>
          <label class="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1">New Name</label>
          <input id="rn-name" class="w-full text-sm px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 text-gray-200 outline-none placeholder-gray-500 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-colors" value="${L(e)}" required autofocus>
        </div>
      </div>
      <div class="flex items-center justify-end gap-2 px-5 py-3 border-t border-gray-800 bg-gray-900/50">
        <button type="button" id="modal-cancel" class="text-xs px-3 py-1.5 rounded-lg border border-gray-700 bg-gray-800 text-gray-400 hover:text-gray-200 transition-all">Cancel</button>
        <button type="submit" class="text-xs font-semibold px-4 py-1.5 rounded-lg text-white bg-blue-600 hover:bg-blue-500 transition-all">Rename</button>
      </div>
    </form>
  `,x(t),c("#modal-close").addEventListener("click",E),c("#modal-cancel").addEventListener("click",E),a.addEventListener("click",o=>{o.target===a&&E()}),document.addEventListener("keydown",function o(n){n.key==="Escape"&&(E(),document.removeEventListener("keydown",o))}),c("#rename-table-form").addEventListener("submit",async o=>{o.preventDefault();let n=c("#rn-name").value.trim();!n||n===e||(await Z(e,n),E(),m())}),setTimeout(()=>c("#rn-name")?.focus(),100)}function ce(e,a){let t=c("#modal-overlay");t.classList.remove("hidden");let o=c("#modal-content");A(o),o.innerHTML=`
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
  `,x(o);let n=()=>E();c("#modal-close").addEventListener("click",n),c("#modal-cancel").addEventListener("click",n),t.addEventListener("click",r=>{r.target===t&&n()}),document.addEventListener("keydown",function r(s){s.key==="Escape"&&(n(),document.removeEventListener("keydown",r))}),c("#modal-confirm").addEventListener("click",()=>{E(),a()})}function Ge(){let e=c("#footer"),a=l.get();e.innerHTML=`
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
  `,c("#btn-new-tab")?.addEventListener("click",()=>{N.addTab("editor"),m()}),c("#btn-new-table-footer")?.addEventListener("click",()=>le()),c("#btn-theme")?.addEventListener("click",N.toggleTheme),x(e)}function re(e){let a=c("#modal-overlay");a.classList.remove("hidden");let t=c("#modal-content");A(t);let o=e?.database&&e.database!==":memory:";t.innerHTML=`
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
  `,x(t),c("#modal-close").addEventListener("click",E),c("#modal-cancel").addEventListener("click",E),a.addEventListener("click",n=>{n.target===a&&E()}),document.addEventListener("keydown",function n(r){r.key==="Escape"&&(E(),document.removeEventListener("keydown",n))}),M('input[name="conn-storage"]').forEach(n=>{n.addEventListener("change",()=>{c("#db-name-group").classList.toggle("hidden",c('input[name="conn-storage"]:checked')?.value==="memory")})}),c("#conn-form").addEventListener("submit",async n=>{n.preventDefault();let r=c("#conn-name").value.trim();if(!r)return;let s=c('input[name="conn-storage"]:checked')?.value,i=c("#conn-db")?.value?.trim()||r,u=s==="persist"?i:":memory:",d=c("#conn-seed")?.checked!==!1,p=N.addConnection({...e||{},name:r,database:u,seed:d});E(),l.setKey("statusText",`Connecting to ${r}...`),m();try{let b=l.get().connections.find(y=>y.id===p);b&&await K(b),m()}catch(b){l.setKey("statusText",`Error: ${b.message}`),m()}}),setTimeout(()=>c("#conn-name")?.focus(),100)}function E(){c("#modal-overlay").classList.add("hidden")}window.exportJSON=function(){let e=l.get(),a=e.results||(e.currentTableData?{columns:e.currentTableData.columns,rows:e.currentTableData.rows}:null);if(!a)return;let t=a.columns.map(n=>n.name||n),o=a.rows.map(n=>{let r={};return t.forEach(s=>r[s]=n[s]),r});de(JSON.stringify(o,null,2),"results.json","application/json")};window.exportCSV=function(){let e=l.get(),a=e.results||(e.currentTableData?{columns:e.currentTableData.columns,rows:e.currentTableData.rows}:null);if(!a)return;let t=a.columns.map(r=>r.name||r),o=r=>{let s=r==null?"":String(r);return s.includes(",")||s.includes('"')||s.includes(`
`)?'"'+s.replace(/"/g,'""')+'"':s},n=[t.map(o).join(","),...a.rows.map(r=>t.map(s=>o(r[s])).join(","))];de(n.join(`
`),"results.csv","text/csv")};function de(e,a,t){let o=new Blob([e],{type:t}),n=document.createElement("a");n.href=URL.createObjectURL(o),n.download=a,n.click(),URL.revokeObjectURL(n.href)}
