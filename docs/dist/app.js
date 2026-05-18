var B=e=>{let n=structuredClone(e),t=new Set,o=new Map,a={get(){return n},set(r){let s=n;n=typeof r=="function"?r(s):r,t.forEach(i=>{try{i(n,s)}catch(u){console.error("Listener error:",u)}})},update(r){a.set(r)},setKey(r,s){a.set(i=>({...i,[r]:typeof s=="function"?s(i[r]):s}))},subscribe(r,s=!1){return t.add(r),s&&r(n,n),()=>t.delete(r)},select(r,s){let i=r(n);return a.subscribe(u=>{let d=r(u);Object.is(i,d)||(s(d,i),i=d)})},on(r,s){return o.has(r)||o.set(r,new Set),o.get(r).add(s),()=>a.off(r,s)},once(r,s){let i=a.on(r,(...u)=>{i(),s(...u)});return i},off(r,s){if(!r){o.clear();return}let i=o.get(r);if(i){if(!s){i.clear();return}i.delete(s)}},emit(r,s){let i=o.get(r);if(i)for(let u of i)try{u({type:r,data:s,state:n})}catch(d){console.error(`Event "${r}" error:`,d)}},destroy(){t.clear(),o.clear()}};return a};var ie=`
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
`;function G(e,n){let t=ie.split(";").filter(o=>o.trim());for(let o of t)try{n(o+";")}catch(a){console.warn("Seed statement failed (likely already exists):",a.message)}}function P(){return new Promise((e,n)=>{let t=indexedDB.open("zrow_dbs",1);t.onupgradeneeded=o=>{let a=o.target.result;a.objectStoreNames.contains("dbs")||a.createObjectStore("dbs",{keyPath:"id"})},t.onsuccess=o=>e(o.target.result),t.onerror=()=>n(new Error("Failed to open IndexedDB"))})}async function le(e){let n=await P();return new Promise((t,o)=>{let r=n.transaction("dbs","readonly").objectStore("dbs").get(e);r.onsuccess=()=>{n.close(),t(r.result?.data||null)},r.onerror=()=>{n.close(),o(new Error("Failed to read DB"))}})}async function ce(e,n){let t=await P();return new Promise((o,a)=>{let r=t.transaction("dbs","readwrite");r.objectStore("dbs").put({id:e,data:n,updated:Date.now()}),r.oncomplete=()=>{t.close(),o()},r.onerror=()=>{t.close(),a()}})}var C=class{constructor(){this._db=null,this._SQL=null,this._name=null}async open(n,t){if(this._name=n,this._SQL=await window.initSqlJs({locateFile:o=>(t||"dist/vendor/")+o}),this._db=new this._SQL.Database,n&&n!==":memory:")try{let o=await le(n);o&&(this._db=new this._SQL.Database(o))}catch{}return this}seedIfEmpty(){try{let n=this._db.exec("SELECT count(*) as cnt FROM sqlite_master WHERE type='table'");if(n.length&&n[0].values[0][0]>0)return}catch{}G(this._db,n=>this._db.exec(n))}async save(){if(this._name&&this._name!==":memory:"&&this._db)try{await ce(this._name,this._db.export())}catch{}}exec(n){let t=performance.now(),o=this._db.exec(n),a=[],r=[],s=this._db.getRowsModified();for(let u of o)u.columns?.length&&(a=u.columns.map(d=>({name:d,type:"text"})),r=u.values.map(d=>{let p={};return u.columns.forEach((b,y)=>{p[b]=d[y]}),p}));return/^\s*(INSERT|UPDATE|DELETE|CREATE|DROP|ALTER)/i.test(n)&&this.save(),{columns:a,rows:r,affectedRows:s,duration:Math.round(performance.now()-t)}}getTables(){let n=this._db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name");return n.length?n[0].values.map(t=>{let o=t[0],a=this._db.exec(`PRAGMA table_info("${o}")`),r=a.length?a[0].values.map(s=>({name:s[1],type:s[2],nullable:!s[3],defaultValue:s[4],primaryKey:!!s[5]})):[];return{name:o,type:"table",columns:r}}):[]}getTableData(n,{limit:t=200,offset:o=0}={}){try{let a=this._db.exec(`SELECT * FROM "${n}" LIMIT ${t} OFFSET ${o}`),r=this._db.exec(`SELECT COUNT(*) as cnt FROM "${n}"`),s=r.length?r[0].values[0][0]:0;if(!a.length)return{columns:[],rows:[],total:0};let i=a[0].columns.map(d=>({name:d,type:"text"})),u=a[0].values.map(d=>{let p={};return a[0].columns.forEach((b,y)=>{p[b]=d[y]}),p});return{columns:i,rows:u,total:s}}catch{return{columns:[],rows:[],total:0}}}updateRow(n,t,o){let a=Object.entries(t).filter(([r])=>r!=="id").map(([r,s])=>`"${r}" = ${s===null?"NULL":typeof s=="string"?`'${s.replace(/'/g,"''")}'`:s}`).join(", ");a&&this.exec(`UPDATE "${n}" SET ${a} WHERE id = ${typeof o=="string"&&isNaN(Number(o))?`'${o}'`:o}`)}deleteRow(n,t){this.exec(`DELETE FROM "${n}" WHERE id = ${typeof t=="string"&&isNaN(Number(t))?`'${t}'`:t}`)}updateRowByPk(n,t,o,a){let r=Object.entries(t).filter(([s])=>s!==o).map(([s,i])=>`"${s}" = ${i===null?"NULL":typeof i=="string"?`'${i.replace(/'/g,"''")}'`:i}`).join(", ");r&&this.exec(`UPDATE "${n}" SET ${r} WHERE "${o}" = ${typeof a=="string"&&isNaN(Number(a))?`'${a.replace(/'/g,"''")}'`:a}`)}deleteRowByPk(n,t,o){this.exec(`DELETE FROM "${n}" WHERE "${t}" = ${typeof o=="string"&&isNaN(Number(o))?`'${o.replace(/'/g,"''")}'`:o}`)}insertRow(n,t){let o=Object.keys(t).map(r=>`"${r}"`),a=Object.values(t).map(r=>r==null?"NULL":typeof r=="string"?`'${r.replace(/'/g,"''")}'`:r);this.exec(`INSERT INTO "${n}" (${o.join(", ")}) VALUES (${a.join(", ")})`)}createTable(n,t){let o=t.map(a=>{let r=`"${a.name}" ${a.type}`;return a.primaryKey&&(r+=" PRIMARY KEY"),a.autoIncrement&&(r+=" AUTOINCREMENT"),a.notNull&&(r+=" NOT NULL"),a.defaultValue!=null&&a.defaultValue!==""&&(r+=` DEFAULT ${typeof a.defaultValue=="string"?`'${a.defaultValue}'`:a.defaultValue}`),a.unique&&(r+=" UNIQUE"),r});this.exec(`CREATE TABLE "${n}" (${o.join(", ")})`)}dropTable(n){this.exec(`DROP TABLE IF EXISTS "${n}"`)}addColumn(n,t){let o=`"${t.name}" ${t.type}`;t.notNull&&(o+=" NOT NULL"),t.defaultValue!=null&&t.defaultValue!==""&&(o+=` DEFAULT ${typeof t.defaultValue=="string"?`'${t.defaultValue}'`:t.defaultValue}`),this.exec(`ALTER TABLE "${n}" ADD COLUMN ${o}`)}dropColumn(n,t){this.exec(`ALTER TABLE "${n}" DROP COLUMN "${t}"`)}renameTable(n,t){this.exec(`ALTER TABLE "${n}" RENAME TO "${t}"`)}getTableInfo(n){let t=this._db.exec(`PRAGMA table_info("${n}")`),o=this._db.exec(`PRAGMA index_list("${n}")`),a=this._db.exec(`PRAGMA foreign_key_list("${n}")`);return{columns:t.length?t[0].values.map(r=>({cid:r[0],name:r[1],type:r[2],notNull:!!r[3],defaultValue:r[4],primaryKey:!!r[5]})):[],indexes:o.length?o[0].values.map(r=>({name:r[1],unique:!r[2],origin:r[3]})):[],foreignKeys:a.length?a[0].values.map(r=>({column:r[3],refTable:r[2],refColumn:r[4]})):[]}}};function de(){try{return JSON.parse(localStorage.getItem("zrow_connections")||"[]")}catch{return[]}}function H(e){localStorage.setItem("zrow_connections",JSON.stringify(e))}var ue=Date.now();function pe(){return++ue}var be={theme:localStorage.getItem("zrow_theme")||"dark",connections:de(),activeConnectionId:null,tabs:[],activeTabId:null,statusText:"Ready",results:null,queryRunning:!1,queryError:null,tables:[],currentTable:null,currentTableData:null,currentTableInfo:null,sidebarView:"tables",recordCount:null},l=B(be),w={toggleTheme(){let e=l.get().theme==="dark"?"light":"dark";l.setKey("theme",e),localStorage.setItem("zrow_theme",e),document.documentElement.classList.toggle("dark",e==="dark")},addConnection(e){let{connections:n}=l.get(),t=e.id||"conn_"+Date.now(),o=e.id?n.map(a=>a.id===e.id?{...e}:a):[...n,{...e,id:t}];return l.setKey("connections",o),H(o),t},deleteConnection(e){let{connections:n,activeConnectionId:t,tabs:o}=l.get(),a=n.filter(r=>r.id!==e);l.setKey("connections",a),H(a),l.setKey("tabs",o.filter(r=>r.connectionId!==e)),t===e&&(l.setKey("activeConnectionId",null),l.setKey("tables",[]),l.setKey("currentTable",null),l.setKey("currentTableData",null))},setActiveConnection(e){l.setKey("activeConnectionId",e)},addTab(e="editor",n={}){let{tabs:t,activeConnectionId:o}=l.get(),a=pe(),r={id:a,type:e,name:n.name||(e==="editor"?`Query ${t.filter(s=>s.type==="editor").length+1}`:n.tableName||"Table"),connectionId:n.connectionId||o,sql:n.sql||"",tableName:n.tableName||null};return l.setKey("tabs",[...t,r]),l.setKey("activeTabId",a),a},closeTab(e){let{tabs:n,activeTabId:t}=l.get(),o=n.findIndex(r=>r.id===e),a=n.filter(r=>r.id!==e);if(l.setKey("tabs",a),t===e){let r=Math.min(o,a.length-1);l.setKey("activeTabId",a.length?a[Math.max(0,r)].id:null)}},setActiveTab(e){l.setKey("activeTabId",e)},updateTabSQL(e,n){l.setKey("tabs",l.get().tabs.map(t=>t.id===e?{...t,sql:n}:t))},setStatus(e){l.setKey("statusText",e)},setResults(e){l.setKey("results",e),l.setKey("queryError",null)},setQueryError(e){l.setKey("queryError",e),l.setKey("results",null)},setQueryRunning(e){l.setKey("queryRunning",e)},setTables(e){l.setKey("tables",e)},setCurrentTable(e){l.setKey("currentTable",e)},setCurrentTableData(e){l.setKey("currentTableData",e)},setCurrentTableInfo(e){l.setKey("currentTableInfo",e)},setSidebarView(e){l.setKey("sidebarView",e)},setRecordCount(e){l.setKey("recordCount",e)}};var m=null;function k(){return m}async function $(e){let n=new C;return await n.open(e.database||e.name,e.wasmPath),e.seed!==!1&&n.seedIfEmpty(),m=n,l.setKey("activeConnectionId",e.id),l.setKey("tables",n.getTables()),l.setKey("statusText",`Connected \u2014 ${e.name}`),n}async function j(){m&&await m.save(),m=null,l.setKey("activeConnectionId",null),l.setKey("tables",[]),l.setKey("currentTable",null),l.setKey("currentTableData",null),l.setKey("currentTableInfo",null)}async function F(e){if(!m)throw new Error("Not connected");l.setKey("queryRunning",!0),l.setKey("queryError",null);try{let n=m.exec(e);return l.setKey("results",n),l.setKey("queryRunning",!1),l.setKey("statusText",`${n.rows.length} rows in ${n.duration}ms`),n}catch(n){throw l.setKey("queryError",n.message),l.setKey("queryRunning",!1),l.setKey("statusText","Query failed"),n}}async function S(e){if(m)try{let n=m.getTableData(e),t=m.getTableInfo(e);l.setKey("currentTable",e),l.setKey("currentTableData",n),l.setKey("currentTableInfo",t),l.setKey("statusText",`Table "${e}" \u2014 ${n.total} rows`)}catch{}}function A(){let{currentTable:e}=l.get();e&&S(e)}function N(){m&&l.setKey("tables",m.getTables())}async function D(e,n){m&&(m.insertRow(e,n),l.setKey("statusText",`Row inserted into "${e}"`),A(),N())}async function V(e,n,t,o){m&&(m.updateRowByPk(e,n,t,o),l.setKey("statusText",`Row updated in "${e}"`),A())}async function Y(e,n,t){m&&(m.deleteRowByPk(e,n,t),l.setKey("statusText",`Row deleted from "${e}"`),A(),N())}async function U(e,n){m&&(m.createTable(e,n),l.setKey("statusText",`Table "${e}" created`),N())}async function X(e){m&&(m.dropTable(e),l.get().currentTable===e&&(l.setKey("currentTable",null),l.setKey("currentTableData",null),l.setKey("currentTableInfo",null)),l.setKey("statusText",`Table "${e}" dropped`),N())}async function q(e,n){m&&(m.addColumn(e,n),l.setKey("statusText",`Column "${n.name}" added to "${e}"`),A(),N())}async function Q(e,n){m&&(m.dropColumn(e,n),l.setKey("statusText",`Column "${n}" dropped from "${e}"`),A(),N())}async function W(e,n){m&&(m.renameTable(e,n),l.get().currentTable===e&&l.setKey("currentTable",n),l.setKey("statusText",`Table renamed to "${n}"`),N())}function R(e,n={},...t){let o=document.createElement(e);for(let[a,r]of Object.entries(n))a==="className"?o.className=r:a==="style"&&typeof r=="object"?Object.assign(o.style,r):a.startsWith("on")?o.addEventListener(a.slice(2).toLowerCase(),r):a==="dataset"&&typeof r=="object"?Object.assign(o.dataset,r):a==="html"?o.innerHTML=r:a==="text"?o.textContent=r:o.setAttribute(a,r);for(let a of t)a!=null&&(typeof a=="string"||typeof a=="number"?o.appendChild(document.createTextNode(a)):a instanceof Node&&o.appendChild(a));return o}function c(e,n=document){return n.querySelector(e)}function O(e,n=document){return n.querySelectorAll(e)}function T(e,n,t,o){let a=r=>{let s=r.target.closest(n);s&&e.contains(s)&&o(r,s)};return e.addEventListener(t,a),()=>e.removeEventListener(t,a)}function L(e){for(;e.firstChild;)e.removeChild(e.firstChild)}function E(e){let n=document.createElement("div");return n.textContent=e,n.innerHTML}function x(e){window.lucide&&(e?lucide.createIcons({root:e}):lucide.createIcons())}var ye=new Set(["SELECT","FROM","WHERE","INSERT","INTO","VALUES","UPDATE","SET","DELETE","CREATE","TABLE","ALTER","DROP","INDEX","VIEW","JOIN","LEFT","RIGHT","INNER","OUTER","FULL","CROSS","ON","AND","OR","NOT","IN","NULL","IS","LIKE","BETWEEN","EXISTS","UNION","ALL","DISTINCT","AS","ORDER","BY","GROUP","HAVING","LIMIT","OFFSET","ASC","DESC","CASE","WHEN","THEN","ELSE","END","WITH","RECURSIVE","PRIMARY","KEY","FOREIGN","REFERENCES","CASCADE","CONSTRAINT","DEFAULT","CHECK","UNIQUE","IF","GRANT","REVOKE","COMMIT","ROLLBACK","BEGIN","TRANSACTION","EXPLAIN","ANALYZE","TRUNCATE","RETURNING","USING","NATURAL","EXCEPT","INTERSECT","FETCH","NEXT","ROWS","ONLY","FOR","OF","MERGE","MATCHED","DO","NOTHING"]),me=new Set(["INT","INTEGER","BIGINT","SMALLINT","TINYINT","BOOLEAN","BIT","FLOAT","DOUBLE","REAL","DECIMAL","NUMERIC","MONEY","CHAR","VARCHAR","TEXT","CLOB","NCHAR","NVARCHAR","NTEXT","BINARY","VARBINARY","BLOB","BYTEA","DATE","TIME","TIMESTAMP","DATETIME","YEAR","INTERVAL","JSON","JSONB","UUID","ARRAY","ENUM","SERIAL","BIGSERIAL","GEOMETRY","GEOGRAPHY","POINT","LINESTRING","POLYGON"]),ge=new Set(["COUNT","SUM","AVG","MIN","MAX","COALESCE","NULLIF","CAST","CONVERT","SUBSTRING","UPPER","LOWER","TRIM","LENGTH","REPLACE","CONCAT","NOW","CURRENT_DATE","CURRENT_TIME","CURRENT_TIMESTAMP","EXTRACT","DATE_PART","DATE_TRUNC","ROUND","CEIL","FLOOR","ABS","MOD","POWER","SQRT","EXP","LN","LOG","GREATEST","LEAST","ROW_NUMBER","RANK","DENSE_RANK","LEAD","LAG","FIRST_VALUE","LAST_VALUE","NTH_VALUE","STRING_AGG","ARRAY_AGG","JSON_AGG","GROUP_CONCAT","LISTAGG","TO_CHAR","TO_DATE","TO_NUMBER","LEFT","RIGHT","POSITION","STRPOS","REGEXP_REPLACE","REGEXP_MATCH","SPLIT_PART","MD5","SHA256","RANDOM","GEN_RANDOM_UUID"]),fe=new Set(["TRUE","FALSE","NULL","UNKNOWN","CURRENT_USER","SESSION_USER","CURRENT_DATE","CURRENT_TIME","CURRENT_TIMESTAMP","LOCALTIME","LOCALTIMESTAMP","CURRENT_CATALOG","CURRENT_SCHEMA","DEFAULT"]);function J(e){if(!e)return"";let n=[],t=0,o=e.length;for(;t<o;){if(e[t]===`
`){n.push({type:"text",value:`
`}),t++;continue}if(e[t]===" "||e[t]==="	"){let a="";for(;t<o&&(e[t]===" "||e[t]==="	");)a+=e[t++];n.push({type:"text",value:a});continue}if(e[t]==="-"&&e[t+1]==="-"){let a="";for(t+=2;t<o&&e[t]!==`
`;)a+=e[t++];n.push({type:"comment",value:"--"+a});continue}if(e[t]==="/"&&e[t+1]==="*"){let a="/*";for(t+=2;t<o-1&&!(e[t]==="*"&&e[t+1]==="/");)a+=e[t++];t<o-1&&(a+="*/",t+=2),n.push({type:"comment",value:a});continue}if(e[t]==="'"||e[t]==='"'||e[t]==="`"){let a=e[t],r=a;for(t++;t<o;){if(e[t]==="\\"&&t+1<o){r+=e[t]+e[t+1],t+=2;continue}if(r+=e[t],e[t]===a){t++;break}t++}n.push({type:"string",value:r});continue}if(e[t]==="$"&&t+1<o&&e[t+1]==="$"){let a="$$";for(t+=2;t<o-1&&!(e[t]==="$"&&e[t+1]==="$");)a+=e[t++];t<o-1&&(a+="$$",t+=2),n.push({type:"string",value:a});continue}if(/[0-9]/.test(e[t])&&(t===0||/[\s,()=<>!+\-*/%]/.test(e[t-1]))){let a="";for(;t<o&&/[0-9.]/.test(e[t]);)a+=e[t++];a.endsWith(".")&&(a=a.slice(0,-1),t--),n.push({type:"number",value:a});continue}if(/[a-zA-Z_]/.test(e[t])){let a="";for(;t<o&&/[a-zA-Z0-9_]/.test(e[t]);)a+=e[t++];let r=a.toUpperCase();ye.has(r)?n.push({type:"keyword",value:a}):me.has(r)?n.push({type:"type",value:a}):ge.has(r)?n.push({type:"function",value:a}):fe.has(r)?n.push({type:"builtin",value:a}):n.push({type:"text",value:a});continue}if(/[()]/.test(e[t])){n.push({type:"text",value:e[t]}),t++;continue}if(e[t]===":"&&t+1<o&&/[a-zA-Z]/.test(e[t+1])){let a=":";for(t++;t<o&&/[a-zA-Z0-9_]/.test(e[t]);)a+=e[t++];n.push({type:"variable",value:a});continue}if(/[=<>!+\-*/%,;.]/.test(e[t])){let a=e[t];t++,(a==="<"||a===">"||a==="!"||a==="=")&&t<o&&e[t]==="="&&(a+="=",t++),n.push({type:"operator",value:a});continue}n.push({type:"text",value:e[t]}),t++}return n.map(a=>`<span class="${`sql-${a.type}`}">${xe(a.value)}</span>`).join("")}function xe(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function he(e){return e?e.split(`
`).length:1}function z(e){let n=he(e);return Array.from({length:n},(t,o)=>o+1).join(`
`)}document.addEventListener("DOMContentLoaded",()=>{let{theme:e}=l.get();document.documentElement.classList.toggle("dark",e==="dark"),f(),l.subscribe(()=>{let n=l.get(),t=c("#status-text");t&&(t.textContent=n.statusText);let o=c("#status-icon");o&&(o.className=`w-2 h-2 rounded-full ${n.queryRunning?"bg-amber-400 animate-pulse":n.activeConnectionId?"bg-emerald-400":"bg-gray-600"}`)})});function f(){Ee(),Ne(),Re(),De(),x()}function Ee(){let e=c("#sidebar");L(e);let n=l.get(),{connections:t,activeConnectionId:o,tables:a,currentTable:r}=n;e.innerHTML=`
    <div class="flex items-center gap-2 px-4 h-10 shrink-0 border-b border-gray-800/60">
      <i data-lucide="database" class="w-4 h-4 text-blue-400"></i>
      <span class="text-xs font-semibold text-gray-300">Zrow</span>
      <span class="text-[9px] text-gray-600 ml-auto">v2</span>
    </div>
    <div class="flex-1 overflow-y-auto py-2" id="sidebar-body"></div>
    <div class="px-3 py-2 border-t border-gray-800/60 text-[11px] text-gray-500">
      <div class="flex items-center gap-2">
        <span id="status-icon" class="w-2 h-2 rounded-full ${o?"bg-emerald-400":"bg-gray-600"}"></span>
        <span id="status-text" class="truncate">${n.statusText}</span>
      </div>
    </div>
  `,document.addEventListener("contextmenu",u=>{let d=c("#table-context-menu");d&&d.remove()});let s=c("#sidebar-body");if(!t.length&&!o){s.innerHTML=`
      <div class="flex flex-col items-center gap-3 py-8 px-4 text-center">
        <i data-lucide="database" class="w-8 h-8 text-gray-700"></i>
        <p class="text-xs text-gray-600">No connections yet</p>
        <button id="btn-new-conn" class="px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors">
          <i data-lucide="plus" class="w-3 h-3 inline-block mr-1"></i> New Database
        </button>
      </div>
    `,c("#btn-new-conn")?.addEventListener("click",te),x(s);return}let i="";for(let u of t){let d=u.id===o;if(i+=`
      <div class="conn-item flex items-center gap-2 px-3 py-1.5 mx-1 rounded-lg cursor-pointer text-xs transition-all ${d?"bg-blue-500/10 text-blue-400":"text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"}" data-id="${u.id}">
        <i data-lucide="${d?"plug":"database"}" class="w-3.5 h-3.5 shrink-0"></i>
        <span class="truncate flex-1">${u.name}</span>
        <span class="text-[10px] text-gray-600">SQLite</span>
        <button class="btn-del-conn opacity-0 hover:opacity-100 hover:text-red-400 transition-opacity" data-id="${u.id}">
          <i data-lucide="x" class="w-3 h-3"></i>
        </button>
      </div>
    `,d&&a.length){i+='<div class="ml-2 pl-2 border-l border-gray-800/60 mt-0.5">',i+=`<div class="flex items-center justify-between px-2 py-1 text-[10px] text-gray-600 uppercase tracking-wider font-medium">
        <span><i data-lucide="layers" class="w-3 h-3 mr-1"></i> Tables <span class="font-normal ml-1">(${a.length})</span></span>
        <button id="btn-new-table" class="p-0.5 rounded hover:bg-gray-700/50 hover:text-gray-400 transition-colors" title="New Table">
          <i data-lucide="plus" class="w-3 h-3"></i>
        </button>
      </div>`;for(let p of a){let b=r===p.name;i+=`
          <div class="table-item flex items-center gap-1.5 px-2 py-1 rounded text-xs cursor-pointer transition-all group ${b?"text-blue-400 bg-blue-500/5":"text-gray-400 hover:text-gray-200 hover:bg-gray-800/40"}" data-table="${p.name}">
            <i data-lucide="table" class="w-3 h-3 shrink-0"></i>
            <span class="truncate flex-1">${p.name}</span>
            <span class="ml-1 text-[9px] text-gray-600">${p.columns.length}</span>
            <button class="btn-table-actions ml-auto p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-gray-700/50 hover:text-gray-300 transition-all ${b?"text-blue-400":"text-gray-600"}" data-table="${p.name}" title="Actions">
              <i data-lucide="more-horizontal" class="w-3 h-3"></i>
            </button>
          </div>
        `}i+="</div>"}}s.innerHTML=i,x(s),T(s,".conn-item","click",async(u,d)=>{let p=d.dataset.id,b=t.find(y=>y.id===p);if(b){if(o===p){await j(),f();return}l.setKey("statusText",`Connecting to ${b.name}...`),f();try{await $(b),f()}catch(y){l.setKey("statusText",`Error: ${y.message}`),f()}}}),T(s,".btn-del-conn","click",(u,d)=>{u.stopPropagation(),confirm("Delete this connection?")&&(w.deleteConnection(d.dataset.id),f())}),T(s,".table-item","click",async(u,d)=>{if(u.target.closest(".btn-table-actions"))return;let p=d.dataset.table;l.get().currentTable!==p&&(await S(p),f())}),T(s,".btn-table-actions","click",(u,d)=>{u.stopPropagation(),Te(d,d.dataset.table)}),c("#btn-new-table")?.addEventListener("click",()=>ae()),o||(s.innerHTML+=`
      <div class="px-3 mt-2">
        <button id="btn-new-conn" class="w-full px-3 py-1.5 text-xs font-medium rounded-lg border border-dashed border-gray-700 text-gray-500 hover:text-gray-300 hover:border-gray-600 transition-colors">
          <i data-lucide="plus" class="w-3 h-3 inline-block mr-1"></i> New Connection
        </button>
      </div>
    `,c("#btn-new-conn")?.addEventListener("click",te),x(s))}function Te(e,n){let t=c("#table-context-menu");t&&t.remove();let o=e.getBoundingClientRect(),a=R("div",{id:"table-context-menu",className:"fixed z-50 bg-gray-800 border border-gray-700/60 rounded-lg shadow-xl py-1 text-xs min-w-[140px]",style:{left:o.left+"px",top:o.bottom+4+"px"}}),r=[{label:"Browse",icon:"eye",action:()=>{S(n),f()}},{label:"Add Column",icon:"columns",action:()=>M(n)},{label:"Rename Table",icon:"edit-3",action:()=>$e(n)},{type:"divider"},{label:"Duplicate Schema",icon:"copy",action:()=>ve(n)},{label:"Drop Table",icon:"trash-2",className:"text-red-400 hover:bg-red-500/10",action:()=>re(`Drop table "${n}"? This cannot be undone.`,()=>we(n))}];for(let s of r){if(s.type==="divider"){a.appendChild(R("div",{className:"h-px bg-gray-700/60 my-1"}));continue}let i=R("button",{className:`flex items-center gap-2 w-full px-3 py-1.5 text-left hover:bg-gray-700/50 transition-colors ${s.className||"text-gray-300"}`,onClick:()=>{a.remove(),s.action()}});i.innerHTML=`<i data-lucide="${s.icon}" class="w-3 h-3"></i> ${s.label}`,a.appendChild(i)}document.body.appendChild(a),x(a),setTimeout(()=>{let s=i=>{!a.contains(i.target)&&i.target!==e&&(a.remove(),document.removeEventListener("click",s))};document.addEventListener("click",s)},0)}async function ve(e){let n=k();if(!n)return;let t=e+"_copy",a=n.getTableInfo(e).columns.map(s=>({name:s.name,type:s.type,primaryKey:s.primaryKey,notNull:s.notNull,defaultValue:s.defaultValue}));await U(t,a);let r=n.getTableData(e,{limit:99999});for(let s of r.rows)await D(t,s);l.setKey("statusText",`Table "${e}" duplicated as "${t}"`),Le(),f()}async function we(e){await X(e),f()}function Le(){let e=k();e&&l.setKey("tables",e.getTables())}function Ne(){let e=c("#tab-bar");L(e);let{tabs:n,activeTabId:t}=l.get();if(!n.length){e.innerHTML='<div class="flex items-center px-3 text-[11px] text-gray-600">No tabs</div>';return}for(let o of n){let a=o.id===t,r=R("div",{className:`tab-item flex items-center gap-1.5 px-3 py-1.5 text-xs cursor-pointer border-r border-gray-800/60 select-none whitespace-nowrap transition-all ${a?"text-blue-400 bg-blue-500/5":"text-gray-500 hover:text-gray-300 hover:bg-gray-800/30"}`,dataset:{tabId:o.id}});r.innerHTML=`<i data-lucide="${o.type==="editor"?"terminal":"table"}" class="w-3 h-3"></i>`,r.appendChild(R("span",{className:"truncate max-w-[120px]"},o.name));let s=R("button",{className:"flex items-center justify-center w-3.5 h-3.5 rounded hover:bg-gray-700/60 transition-all ml-0.5",dataset:{tabClose:o.id}});s.innerHTML='<i data-lucide="x" class="w-2.5 h-2.5"></i>',r.appendChild(s),e.appendChild(r)}x(e),T(e,".tab-item","click",(o,a)=>{let r=parseInt(a.dataset.tabId);isNaN(r)||(n.find(i=>i.id===r)?.type==="editor"&&(l.setKey("currentTable",null),l.setKey("currentTableData",null),l.setKey("currentTableInfo",null)),w.setActiveTab(r),f())}),T(e,"[data-tab-close]","click",(o,a)=>{o.stopPropagation();let r=parseInt(a.dataset.tabClose);isNaN(r)||(w.closeTab(r),f())})}function Re(){let e=c("#content-area");L(e);let n=l.get(),{tabs:t,activeTabId:o}=n;if(n.currentTable&&n.currentTableData){Ce(e,n);return}if(!t.length||!o){e.innerHTML=`
      <div class="flex flex-col items-center justify-center h-full gap-4 text-gray-600">
        <i data-lucide="terminal" class="w-12 h-12 opacity-30"></i>
        <p class="text-sm">${n.activeConnectionId?"Open a table or write a query":"Connect to a database to get started"}</p>
        ${n.activeConnectionId?'<button id="btn-new-query" class="px-4 py-2 text-xs font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors"><i data-lucide="plus" class="w-3 h-3 inline-block mr-1"></i> New Query</button>':""}
      </div>
    `,c("#btn-new-query")?.addEventListener("click",()=>{l.setKey("currentTable",null),l.setKey("currentTableData",null),l.setKey("currentTableInfo",null),w.addTab("editor"),f()}),x(e);return}let a=t.find(r=>r.id===o);a?.type==="editor"&&Ae(e,a,n)}function Ae(e,n){let t=l.get();e.innerHTML=`
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
        <textarea class="editor-input" id="editor-input" spellcheck="false" autocomplete="off" placeholder="${t.activeConnectionId?"Enter SQL...":"Connect to a database first"}" ${t.activeConnectionId?"":"disabled"}>${n.sql||""}</textarea>
      </div>
    </div>
    <div id="results-panel" class="flex flex-col overflow-hidden border-t border-gray-800/60" style="min-height:100px;max-height:50%"></div>
  `,x(e);let o=c("#editor-input"),a=c("#editor-highlight"),r=c("#editor-gutter"),s=c("#editor-status");function i(){let d=o.value;a.innerHTML=J(d)+`
`.repeat(Math.max(1,(d.match(/\n/g)||"").length+1)),r.textContent=z(d),w.updateTabSQL(n.id,d)}o.addEventListener("input",i),o.addEventListener("scroll",()=>{a.scrollTop=o.scrollTop,a.scrollLeft=o.scrollLeft,r.scrollTop=o.scrollTop}),o.addEventListener("keydown",d=>{if(d.key==="Tab"){d.preventDefault();let p=o.selectionStart;o.value=o.value.substring(0,p)+"  "+o.value.substring(o.selectionEnd),o.selectionStart=o.selectionEnd=p+2,i()}(d.ctrlKey||d.metaKey)&&d.key==="Enter"&&(d.preventDefault(),ee())}),i(),setTimeout(()=>o.focus(),50),c("#btn-run")?.addEventListener("click",ee),Z(t);let u=l.subscribe(()=>{Z(l.get()),Ie(c("#results-panel"))},!1)}function Z(e){let n=c("#editor-status");n&&(e.queryRunning?n.innerHTML='<i data-lucide="loader-circle" class="w-3 h-3 animate-spin inline-block mr-1"></i> Running...':e.queryError?n.innerHTML=`<i data-lucide="alert-circle" class="w-3 h-3 inline-block mr-1"></i> ${e.queryError}`:e.results?n.textContent=`${e.results.rows.length} rows in ${e.results.duration}ms`:n.textContent="Ready",x(n?.parentElement))}function Ie(e){if(!e)return;let n=l.get();if(n.queryRunning){e.innerHTML='<div class="flex items-center justify-center h-full gap-2 text-sm text-gray-500"><i data-lucide="loader-circle" class="w-4 h-4 animate-spin"></i> Running...</div>',x(e);return}if(n.queryError){e.innerHTML=`<div class="flex items-start gap-2 p-4 text-sm text-red-400"><i data-lucide="alert-circle" class="w-4 h-4 mt-0.5 shrink-0"></i> ${n.queryError}</div>`,x(e);return}if(!n.results?.columns?.length){e.innerHTML='<div class="flex flex-col items-center justify-center h-full gap-3 text-gray-600"><i data-lucide="arrow-up-right" class="w-8 h-8 opacity-30"></i><span class="text-xs">Run a query to see results</span></div>',x(e);return}e.innerHTML=ne(n.results,!0),x(e)}async function ee(){let e=c("#editor-input")?.value?.trim();if(!(!e||!l.get().activeConnectionId))try{await F(e)}catch{}}function Ce(e,n){let t=n.currentTableData,o=n.currentTableInfo,a=n.currentTable;if(!t){e.innerHTML='<div class="flex items-center justify-center h-full text-gray-600 text-sm">Loading...</div>';return}let r=o?.columns?.find(i=>i.primaryKey)?.name||null,s=o?.columns?.map((i,u)=>`<div class="flex items-center gap-2 px-3 py-1.5 text-xs border-b border-gray-800/30 hover:bg-gray-800/20 group">
      <span class="w-28 font-medium text-gray-300">${i.name}</span>
      <span class="w-20 text-blue-400 font-mono">${i.type}</span>
      <span class="w-28 text-gray-500">${i.primaryKey?'<span class="text-amber-400 font-medium">PK</span>':""}${i.notNull?' <span class="text-gray-600">NOT NULL</span>':""}</span>
      <span class="flex-1 text-gray-600 truncate">${i.defaultValue!=null?`default: ${i.defaultValue}`:""}</span>
      <button class="btn-drop-col p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-400 transition-all text-gray-600" data-col="${i.name}" title="Drop column">
        <i data-lucide="x" class="w-3 h-3"></i>
      </button>
    </div>`).join("")||"";e.innerHTML=`
    <div class="flex flex-col h-full">
      <div class="flex items-center gap-2 px-3 py-1.5 border-b border-gray-800/60 bg-gray-900/30 shrink-0">
        <i data-lucide="table" class="w-4 h-4 text-blue-400"></i>
        <span class="text-sm font-medium text-gray-200">${E(a)}</span>
        <span class="text-xs text-gray-500">${t.total||0} rows</span>
        <button id="btn-query-table" class="ml-auto px-2 py-1 text-xs rounded-md bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 transition-colors flex items-center gap-1">
          <i data-lucide="terminal" class="w-3 h-3"></i> Query
        </button>
      </div>
      <div class="flex flex-1 overflow-hidden">
        <div class="flex-1 flex flex-col overflow-hidden">
          ${ne({columns:t.columns,rows:t.rows},!0,r)}
        </div>
        ${o?`<div class="w-56 shrink-0 border-l border-gray-800/60 bg-gray-900/30 overflow-y-auto hidden md:block">
          <div class="flex items-center justify-between px-3 py-2 text-[10px] text-gray-500 uppercase tracking-wider font-medium border-b border-gray-800/60">
            <span>Columns</span>
            <button id="btn-add-col-panel" class="p-0.5 rounded hover:bg-gray-700/50 hover:text-gray-400 transition-colors" title="Add Column">
              <i data-lucide="plus" class="w-3 h-3"></i>
            </button>
          </div>
          ${s}
          ${o.indexes?.length?`<div class="px-3 py-2 text-[10px] text-gray-500 uppercase tracking-wider font-medium border-b border-gray-800/60 mt-2">Indexes</div>
          ${o.indexes.map(i=>`<div class="px-3 py-1 text-xs text-gray-400">${i.name} ${i.unique?"(unique)":""}</div>`).join("")}`:""}
          ${o.foreignKeys?.length?`<div class="px-3 py-2 text-[10px] text-gray-500 uppercase tracking-wider font-medium border-b border-gray-800/60 mt-2">Foreign Keys</div>
          ${o.foreignKeys.map(i=>`<div class="px-3 py-1 text-xs text-gray-400">${i.column} \u2192 ${i.refTable}(${i.refColumn})</div>`).join("")}`:""}
        </div>`:""}
      </div>
    </div>
  `,x(e),c("#btn-query-table")?.addEventListener("click",()=>{w.addTab("editor",{connectionId:l.get().activeConnectionId,name:`Query: ${a}`,sql:`SELECT * FROM "${a}" LIMIT 100`}),f()}),T(e,".btn-add-col-inline","click",()=>M(a)),T(e,".btn-add-row-inline","click",()=>ke(a,o)),c("#btn-add-col-panel")?.addEventListener("click",()=>M(a)),T(e,".btn-drop-col",async(i,u)=>{let d=u.dataset.col;re(`Drop column "${d}" from "${a}"?`,async()=>{await Q(a,d),f()})}),Se(e,a,r,t),Oe(e,a,r)}function Se(e,n,t){T(e,".result-table td[data-col]","dblclick",(r,s)=>{if(s.querySelector("input, select, textarea"))return;let i=s.dataset.col,d=s.closest("tr")?.dataset?.pkVal;!t||!d||i===t||o(s,i,d,n)});function o(r,s,i,u){let p=r.closest("tr")?.closest("tbody"),b=r.querySelector(".text-gray-600.italic"),y=b?"":r.textContent;r.innerHTML=`<input class="cell-edit-input w-full bg-gray-800 border border-blue-500/50 rounded px-1 py-0.5 text-xs text-gray-200 outline-none" value="${E(y)}" />`;let h=r.querySelector("input");h.focus(),h.select();function se(){let _=h.value.trim(),I=_===""?null:_,K={};K[s]=I,r.innerHTML=I===null?'<span class="text-gray-600 italic">NULL</span>':E(I),r.title=I??"",V(u,K,t,i).then(Ue=>{l.setKey("recordCount",(l.get().recordCount||0)+1)}).catch(()=>{r.innerHTML=E(y||"NULL")})}h.addEventListener("blur",se),h.addEventListener("keydown",v=>{v.key==="Enter"?(v.preventDefault(),h.blur(),a(r,"down")):v.key==="Tab"&&!v.shiftKey?(v.preventDefault(),h.blur(),a(r,"right")):v.key==="Tab"&&v.shiftKey?(v.preventDefault(),h.blur(),a(r,"left")):v.key==="Escape"&&(v.preventDefault(),r.innerHTML=b?'<span class="text-gray-600 italic">NULL</span>':E(y))})}function a(r,s){let i=r.closest("tr");if(!i?.closest("tbody")||!i)return;let d=[...i.querySelectorAll("td[data-col]")],p=d.indexOf(r),b=null;if(s==="right"&&p<d.length-1)b=d[p+1];else if(s==="left"&&p>0)b=d[p-1];else if(s==="down"||s==="right"&&p>=d.length-1){let y=i.nextElementSibling;if(y&&y.tagName==="TR"&&!y.classList.contains("btn-add-row-inline")){let h=[...y.querySelectorAll("td[data-col]")];b=h[Math.min(p,h.length-1)]}}if(b&&!b.querySelector("input")){let y=b.dataset.col,h=b.closest("tr")?.dataset?.pkVal;t&&h&&y!==t&&o(b,y,h,n)}}}function Oe(e,n,t){T(e,".btn-del-row",async(o,a)=>{let r=a.dataset.pkVal;!t||!r||confirm("Delete this row?")&&(await Y(n,t,r),f())})}function ne(e,n,t){let o=e.columns||[],a=e.rows||[],r="";n&&(r+=`<div class="flex items-center gap-2 px-3 py-1 border-b border-gray-800/60 bg-gray-900/20 shrink-0 text-[11px]">
      <span class="text-gray-500">${a.length} rows</span>
      <span class="text-gray-700">\xB7</span>
      <span class="text-gray-500">${o.length} cols</span>
      <button class="ml-auto px-2 py-0.5 rounded hover:bg-gray-800 text-gray-500 hover:text-gray-300 flex items-center gap-1" onclick="window.exportJSON()">
        <i data-lucide="download" class="w-3 h-3"></i> JSON
      </button>
      <button class="px-2 py-0.5 rounded hover:bg-gray-800 text-gray-500 hover:text-gray-300 flex items-center gap-1" onclick="window.exportCSV()">
        <i data-lucide="file-text" class="w-3 h-3"></i> CSV
      </button>
    </div>`);let s=o.length+(t?1:0);r+='<div class="flex-1 overflow-auto"><table class="result-table">',r+=`<thead><tr>${o.map(i=>`<th>${i.name||i}</th>`).join("")}<th class="w-9 px-1"><button class="btn-add-col-inline flex items-center justify-center w-full h-full p-0.5 rounded hover:bg-blue-500/20 hover:text-blue-400 transition-colors text-gray-600" title="Add column"><i data-lucide="plus" class="w-3.5 h-3.5"></i></button></th>${t?'<th class="w-8"></th>':""}</tr></thead>`,r+="<tbody>";for(let i=0;i<a.length;i++){let u=a[i],d=t?u[t]:null;r+=`<tr${t?` data-pk-col="${t}" data-pk-val="${d!=null?E(String(d)):""}"`:""} data-row-idx="${i}">`;for(let p of o){let b=p.name||p,y=u[b],h;y==null?h='<span class="text-gray-600 italic">NULL</span>':typeof y=="object"?h=`<span title="${E(String(y))}">${E(JSON.stringify(y))}</span>`:h=E(String(y)),r+=`<td data-col="${b}" title="${E(String(y??""))}" class="cursor-pointer hover:bg-blue-500/5 transition-colors">${h}</td>`}r+='<td class="text-center add-cell"></td>',t&&(r+=`<td class="text-center"><button class="btn-del-row p-0.5 rounded hover:bg-red-500/20 hover:text-red-400 text-gray-600 transition-colors" data-pk-val="${d!=null?E(String(d)):""}" title="Delete row"><i data-lucide="trash-2" class="w-3 h-3"></i></button></td>`),r+="</tr>"}return r+=`<tr class="btn-add-row-inline cursor-pointer hover:bg-blue-500/5 transition-colors"><td colspan="${s+1}" class="text-center py-2 text-gray-600 hover:text-blue-400 text-xs"><span class="flex items-center justify-center gap-1"><i data-lucide="plus" class="w-3.5 h-3.5"></i> Add Row</span></td></tr>`,r+="</tbody></table></div>",r}function ke(e,n){if(!n?.columns)return;let t=c("#modal-overlay");t.classList.remove("hidden");let o=c("#modal-content");L(o);let a=n.columns.find(i=>i.primaryKey),r=n.columns.filter(i=>!i.primaryKey||i.defaultValue===null),s="";for(let i of r){let u=i.notNull&&i.defaultValue==null?"required":"";s+=`
      <div>
        <label class="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1">${i.name} <span class="text-gray-700 normal-case">${i.type}</span> ${i.primaryKey?'<span class="text-amber-400">PK</span>':""}</label>
        <input class="input-add-row w-full text-sm px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 text-gray-200 outline-none placeholder-gray-500 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-colors" name="${i.name}" placeholder="${i.type}" ${u} ${i.defaultValue!=null?`value="${E(String(i.defaultValue))}"`:""}>
      </div>
    `}o.innerHTML=`
    <form id="add-row-form" class="fade-in">
      <div class="flex items-center justify-between px-5 py-3 border-b border-gray-800">
        <h2 class="text-sm font-semibold text-gray-200"><i data-lucide="plus" class="w-4 h-4 text-emerald-400 inline-block mr-1.5"></i> Add Row \u2014 ${E(e)}</h2>
        <button type="button" id="modal-close" class="w-6 h-6 flex items-center justify-center rounded-md text-gray-500 hover:text-gray-200 hover:bg-gray-800 transition-all">
          <i data-lucide="x" class="w-4 h-4"></i>
        </button>
      </div>
      <div class="px-5 py-4 space-y-3 max-h-[50vh] overflow-y-auto">
        ${s}
      </div>
      <div class="flex items-center justify-end gap-2 px-5 py-3 border-t border-gray-800 bg-gray-900/50">
        <button type="button" id="modal-cancel" class="text-xs px-3 py-1.5 rounded-lg border border-gray-700 bg-gray-800 text-gray-400 hover:text-gray-200 transition-all">Cancel</button>
        <button type="submit" class="text-xs font-semibold px-4 py-1.5 rounded-lg text-white bg-emerald-600 hover:bg-emerald-500 transition-all">Insert Row</button>
      </div>
    </form>
  `,x(o),c("#modal-close").addEventListener("click",g),c("#modal-cancel").addEventListener("click",g),t.addEventListener("click",i=>{i.target===t&&g()}),document.addEventListener("keydown",function i(u){u.key==="Escape"&&(g(),document.removeEventListener("keydown",i))}),c("#add-row-form").addEventListener("submit",async i=>{i.preventDefault();let u={};for(let d of O(".input-add-row")){let p=d.value.trim();p===""&&!d.hasAttribute("required")?u[d.name]=null:u[d.name]=p}await D(e,u),g(),f()}),setTimeout(()=>c(".input-add-row")?.focus(),100)}function ae(){let e=c("#modal-overlay");e.classList.remove("hidden");let n=c("#modal-content");L(n),n.innerHTML=`
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
  `,x(n),c("#modal-close").addEventListener("click",g),c("#modal-cancel").addEventListener("click",g),e.addEventListener("click",t=>{t.target===e&&g()}),document.addEventListener("keydown",function t(o){o.key==="Escape"&&(g(),document.removeEventListener("keydown",t))}),c("#ct-add-col").addEventListener("click",()=>{let t=c("#ct-columns"),o=document.createElement("div");o.className="ct-col-row flex items-center gap-2 p-2 rounded-lg bg-gray-800/50 border border-gray-700/50",o.innerHTML=`
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
    `,t.appendChild(o),x(o)}),T(c("#ct-columns"),".ct-remove-col","click",(t,o)=>{let a=o.closest(".ct-col-row");c("#ct-columns").children.length>1&&a.remove()}),c("#create-table-form").addEventListener("submit",async t=>{t.preventDefault();let o=c("#ct-name").value.trim();if(!o)return;let a=[];for(let r of O(".ct-col-row")){let s=r.querySelector(".ct-col-name").value.trim();s&&a.push({name:s,type:r.querySelector(".ct-col-type").value,primaryKey:r.querySelector(".ct-col-pk").checked,autoIncrement:r.querySelector(".ct-col-ai").checked,notNull:r.querySelector(".ct-col-nn").checked})}a.length&&(await U(o,a),g(),f())}),setTimeout(()=>c("#ct-name")?.focus(),100)}function M(e){let n=c("#modal-overlay");n.classList.remove("hidden");let t=c("#modal-content");L(t),t.innerHTML=`
    <form id="add-col-form" class="fade-in">
      <div class="flex items-center justify-between px-5 py-3 border-b border-gray-800">
        <h2 class="text-sm font-semibold text-gray-200"><i data-lucide="columns" class="w-4 h-4 text-blue-400 inline-block mr-1.5"></i> Add Column \u2014 ${E(e)}</h2>
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
  `,x(t),c("#modal-close").addEventListener("click",g),c("#modal-cancel").addEventListener("click",g),n.addEventListener("click",o=>{o.target===n&&g()}),document.addEventListener("keydown",function o(a){a.key==="Escape"&&(g(),document.removeEventListener("keydown",o))}),c("#add-col-form").addEventListener("submit",async o=>{o.preventDefault();let a=c("#ac-name").value.trim(),r=c("#ac-type").value,s=c("#ac-default").value.trim()||null,i=c("#ac-notnull").checked;a&&(await q(e,{name:a,type:r,defaultValue:s,notNull:i}),g(),f())}),setTimeout(()=>c("#ac-name")?.focus(),100)}function $e(e){let n=c("#modal-overlay");n.classList.remove("hidden");let t=c("#modal-content");L(t),t.innerHTML=`
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
          <div class="text-sm px-3 py-2 rounded-lg border border-gray-700 bg-gray-800/50 text-gray-400">${E(e)}</div>
        </div>
        <div>
          <label class="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1">New Name</label>
          <input id="rn-name" class="w-full text-sm px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 text-gray-200 outline-none placeholder-gray-500 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-colors" value="${E(e)}" required autofocus>
        </div>
      </div>
      <div class="flex items-center justify-end gap-2 px-5 py-3 border-t border-gray-800 bg-gray-900/50">
        <button type="button" id="modal-cancel" class="text-xs px-3 py-1.5 rounded-lg border border-gray-700 bg-gray-800 text-gray-400 hover:text-gray-200 transition-all">Cancel</button>
        <button type="submit" class="text-xs font-semibold px-4 py-1.5 rounded-lg text-white bg-blue-600 hover:bg-blue-500 transition-all">Rename</button>
      </div>
    </form>
  `,x(t),c("#modal-close").addEventListener("click",g),c("#modal-cancel").addEventListener("click",g),n.addEventListener("click",o=>{o.target===n&&g()}),document.addEventListener("keydown",function o(a){a.key==="Escape"&&(g(),document.removeEventListener("keydown",o))}),c("#rename-table-form").addEventListener("submit",async o=>{o.preventDefault();let a=c("#rn-name").value.trim();!a||a===e||(await W(e,a),g(),f())}),setTimeout(()=>c("#rn-name")?.focus(),100)}function re(e,n){let t=c("#modal-overlay");t.classList.remove("hidden");let o=c("#modal-content");L(o),o.innerHTML=`
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
  `,x(o);let a=()=>g();c("#modal-close").addEventListener("click",a),c("#modal-cancel").addEventListener("click",a),t.addEventListener("click",r=>{r.target===t&&a()}),document.addEventListener("keydown",function r(s){s.key==="Escape"&&(a(),document.removeEventListener("keydown",r))}),c("#modal-confirm").addEventListener("click",()=>{g(),n()})}function De(){let e=c("#footer"),n=l.get();e.innerHTML=`
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
        <i data-lucide="${n.theme==="dark"?"moon":"sun"}" class="w-2.5 h-2.5"></i>
      </button>
      <a href="https://github.com/anomalyco/zrow" target="_blank" class="flex items-center justify-center hover:text-gray-300 transition-colors py-[1px]">
        <svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
      </a>
      <span class="flex-1"></span>
      <span>${n.activeConnectionId?`${(n.tables||[]).length} tables`:""}</span>
    </div>
  `,c("#btn-new-tab")?.addEventListener("click",()=>{w.addTab("editor"),f()}),c("#btn-new-table-footer")?.addEventListener("click",()=>ae()),c("#btn-theme")?.addEventListener("click",w.toggleTheme),x(e)}function te(e){let n=c("#modal-overlay");n.classList.remove("hidden");let t=c("#modal-content");L(t);let o=e?.database&&e.database!==":memory:";t.innerHTML=`
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
  `,x(t),c("#modal-close").addEventListener("click",g),c("#modal-cancel").addEventListener("click",g),n.addEventListener("click",a=>{a.target===n&&g()}),document.addEventListener("keydown",function a(r){r.key==="Escape"&&(g(),document.removeEventListener("keydown",a))}),O('input[name="conn-storage"]').forEach(a=>{a.addEventListener("change",()=>{c("#db-name-group").classList.toggle("hidden",c('input[name="conn-storage"]:checked')?.value==="memory")})}),c("#conn-form").addEventListener("submit",async a=>{a.preventDefault();let r=c("#conn-name").value.trim();if(!r)return;let s=c('input[name="conn-storage"]:checked')?.value,i=c("#conn-db")?.value?.trim()||r,u=s==="persist"?i:":memory:",d=c("#conn-seed")?.checked!==!1,p=w.addConnection({...e||{},name:r,database:u,seed:d});g(),l.setKey("statusText",`Connecting to ${r}...`),f();try{let b=l.get().connections.find(y=>y.id===p);b&&await $(b),f()}catch(b){l.setKey("statusText",`Error: ${b.message}`),f()}}),setTimeout(()=>c("#conn-name")?.focus(),100)}function g(){c("#modal-overlay").classList.add("hidden")}window.exportJSON=function(){let e=l.get(),n=e.results||(e.currentTableData?{columns:e.currentTableData.columns,rows:e.currentTableData.rows}:null);if(!n)return;let t=n.columns.map(a=>a.name||a),o=n.rows.map(a=>{let r={};return t.forEach(s=>r[s]=a[s]),r});oe(JSON.stringify(o,null,2),"results.json","application/json")};window.exportCSV=function(){let e=l.get(),n=e.results||(e.currentTableData?{columns:e.currentTableData.columns,rows:e.currentTableData.rows}:null);if(!n)return;let t=n.columns.map(r=>r.name||r),o=r=>{let s=r==null?"":String(r);return s.includes(",")||s.includes('"')||s.includes(`
`)?'"'+s.replace(/"/g,'""')+'"':s},a=[t.map(o).join(","),...n.rows.map(r=>t.map(s=>o(r[s])).join(","))];oe(a.join(`
`),"results.csv","text/csv")};function oe(e,n,t){let o=new Blob([e],{type:t}),a=document.createElement("a");a.href=URL.createObjectURL(o),a.download=n,a.click(),URL.revokeObjectURL(a.href)}
