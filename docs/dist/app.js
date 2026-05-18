var U=e=>{let n=structuredClone(e),t=new Set,r=new Map,a={get(){return n},set(o){let s=n;n=typeof o=="function"?o(s):o,t.forEach(l=>{try{l(n,s)}catch(u){console.error("Listener error:",u)}})},update(o){a.set(o)},setKey(o,s){a.set(l=>({...l,[o]:typeof s=="function"?s(l[o]):s}))},subscribe(o,s=!1){return t.add(o),s&&o(n,n),()=>t.delete(o)},select(o,s){let l=o(n);return a.subscribe(u=>{let d=o(u);Object.is(l,d)||(s(d,l),l=d)})},on(o,s){return r.has(o)||r.set(o,new Set),r.get(o).add(s),()=>a.off(o,s)},once(o,s){let l=a.on(o,(...u)=>{l(),s(...u)});return l},off(o,s){if(!o){r.clear();return}let l=r.get(o);if(l){if(!s){l.clear();return}l.delete(s)}},emit(o,s){let l=r.get(o);if(l)for(let u of l)try{u({type:o,data:s,state:n})}catch(d){console.error(`Event "${o}" error:`,d)}},destroy(){t.clear(),r.clear()}};return a};var ne=`
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
`;function M(e,n){let t=ne.split(";").filter(r=>r.trim());for(let r of t)try{n(r+";")}catch(a){console.warn("Seed statement failed (likely already exists):",a.message)}}function _(){return new Promise((e,n)=>{let t=indexedDB.open("zrow_dbs",1);t.onupgradeneeded=r=>{let a=r.target.result;a.objectStoreNames.contains("dbs")||a.createObjectStore("dbs",{keyPath:"id"})},t.onsuccess=r=>e(r.target.result),t.onerror=()=>n(new Error("Failed to open IndexedDB"))})}async function ae(e){let n=await _();return new Promise((t,r)=>{let o=n.transaction("dbs","readonly").objectStore("dbs").get(e);o.onsuccess=()=>{n.close(),t(o.result?.data||null)},o.onerror=()=>{n.close(),r(new Error("Failed to read DB"))}})}async function re(e,n){let t=await _();return new Promise((r,a)=>{let o=t.transaction("dbs","readwrite");o.objectStore("dbs").put({id:e,data:n,updated:Date.now()}),o.oncomplete=()=>{t.close(),r()},o.onerror=()=>{t.close(),a()}})}var R=class{constructor(){this._db=null,this._SQL=null,this._name=null}async open(n,t){if(this._name=n,this._SQL=await window.initSqlJs({locateFile:r=>(t||"dist/vendor/")+r}),this._db=new this._SQL.Database,n&&n!==":memory:")try{let r=await ae(n);r&&(this._db=new this._SQL.Database(r))}catch{}return this}seedIfEmpty(){try{let n=this._db.exec("SELECT count(*) as cnt FROM sqlite_master WHERE type='table'");if(n.length&&n[0].values[0][0]>0)return}catch{}M(this._db,n=>this._db.exec(n))}async save(){if(this._name&&this._name!==":memory:"&&this._db)try{await re(this._name,this._db.export())}catch{}}exec(n){let t=performance.now(),r=this._db.exec(n),a=[],o=[],s=this._db.getRowsModified();for(let u of r)u.columns?.length&&(a=u.columns.map(d=>({name:d,type:"text"})),o=u.values.map(d=>{let p={};return u.columns.forEach((g,x)=>{p[g]=d[x]}),p}));return/^\s*(INSERT|UPDATE|DELETE|CREATE|DROP|ALTER)/i.test(n)&&this.save(),{columns:a,rows:o,affectedRows:s,duration:Math.round(performance.now()-t)}}getTables(){let n=this._db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name");return n.length?n[0].values.map(t=>{let r=t[0],a=this._db.exec(`PRAGMA table_info("${r}")`),o=a.length?a[0].values.map(s=>({name:s[1],type:s[2],nullable:!s[3],defaultValue:s[4],primaryKey:!!s[5]})):[];return{name:r,type:"table",columns:o}}):[]}getTableData(n,{limit:t=200,offset:r=0}={}){try{let a=this._db.exec(`SELECT * FROM "${n}" LIMIT ${t} OFFSET ${r}`),o=this._db.exec(`SELECT COUNT(*) as cnt FROM "${n}"`),s=o.length?o[0].values[0][0]:0;if(!a.length)return{columns:[],rows:[],total:0};let l=a[0].columns.map(d=>({name:d,type:"text"})),u=a[0].values.map(d=>{let p={};return a[0].columns.forEach((g,x)=>{p[g]=d[x]}),p});return{columns:l,rows:u,total:s}}catch{return{columns:[],rows:[],total:0}}}updateRow(n,t,r){let a=Object.entries(t).filter(([o])=>o!=="id").map(([o,s])=>`"${o}" = ${s===null?"NULL":typeof s=="string"?`'${s.replace(/'/g,"''")}'`:s}`).join(", ");a&&this.exec(`UPDATE "${n}" SET ${a} WHERE id = ${typeof r=="string"&&isNaN(Number(r))?`'${r}'`:r}`)}deleteRow(n,t){this.exec(`DELETE FROM "${n}" WHERE id = ${typeof t=="string"&&isNaN(Number(t))?`'${t}'`:t}`)}updateRowByPk(n,t,r,a){let o=Object.entries(t).filter(([s])=>s!==r).map(([s,l])=>`"${s}" = ${l===null?"NULL":typeof l=="string"?`'${l.replace(/'/g,"''")}'`:l}`).join(", ");o&&this.exec(`UPDATE "${n}" SET ${o} WHERE "${r}" = ${typeof a=="string"&&isNaN(Number(a))?`'${a.replace(/'/g,"''")}'`:a}`)}deleteRowByPk(n,t,r){this.exec(`DELETE FROM "${n}" WHERE "${t}" = ${typeof r=="string"&&isNaN(Number(r))?`'${r.replace(/'/g,"''")}'`:r}`)}insertRow(n,t){let r=Object.keys(t).map(o=>`"${o}"`),a=Object.values(t).map(o=>o==null?"NULL":typeof o=="string"?`'${o.replace(/'/g,"''")}'`:o);this.exec(`INSERT INTO "${n}" (${r.join(", ")}) VALUES (${a.join(", ")})`)}createTable(n,t){let r=t.map(a=>{let o=`"${a.name}" ${a.type}`;return a.primaryKey&&(o+=" PRIMARY KEY"),a.autoIncrement&&(o+=" AUTOINCREMENT"),a.notNull&&(o+=" NOT NULL"),a.defaultValue!=null&&a.defaultValue!==""&&(o+=` DEFAULT ${typeof a.defaultValue=="string"?`'${a.defaultValue}'`:a.defaultValue}`),a.unique&&(o+=" UNIQUE"),o});this.exec(`CREATE TABLE "${n}" (${r.join(", ")})`)}dropTable(n){this.exec(`DROP TABLE IF EXISTS "${n}"`)}addColumn(n,t){let r=`"${t.name}" ${t.type}`;t.notNull&&(r+=" NOT NULL"),t.defaultValue!=null&&t.defaultValue!==""&&(r+=` DEFAULT ${typeof t.defaultValue=="string"?`'${t.defaultValue}'`:t.defaultValue}`),this.exec(`ALTER TABLE "${n}" ADD COLUMN ${r}`)}dropColumn(n,t){this.exec(`ALTER TABLE "${n}" DROP COLUMN "${t}"`)}renameTable(n,t){this.exec(`ALTER TABLE "${n}" RENAME TO "${t}"`)}getTableInfo(n){let t=this._db.exec(`PRAGMA table_info("${n}")`),r=this._db.exec(`PRAGMA index_list("${n}")`),a=this._db.exec(`PRAGMA foreign_key_list("${n}")`);return{columns:t.length?t[0].values.map(o=>({cid:o[0],name:o[1],type:o[2],notNull:!!o[3],defaultValue:o[4],primaryKey:!!o[5]})):[],indexes:r.length?r[0].values.map(o=>({name:o[1],unique:!o[2],origin:o[3]})):[],foreignKeys:a.length?a[0].values.map(o=>({column:o[3],refTable:o[2],refColumn:o[4]})):[]}}};function oe(){try{return JSON.parse(localStorage.getItem("zrow_connections")||"[]")}catch{return[]}}function K(e){localStorage.setItem("zrow_connections",JSON.stringify(e))}var se=Date.now();function ie(){return++se}var le={theme:localStorage.getItem("zrow_theme")||"dark",connections:oe(),activeConnectionId:null,tabs:[],activeTabId:null,statusText:"Ready",results:null,queryRunning:!1,queryError:null,tables:[],currentTable:null,currentTableData:null,currentTableInfo:null,sidebarView:"tables",recordCount:null},i=U(le),T={toggleTheme(){let e=i.get().theme==="dark"?"light":"dark";i.setKey("theme",e),localStorage.setItem("zrow_theme",e),document.documentElement.classList.toggle("dark",e==="dark")},addConnection(e){let{connections:n}=i.get(),t=e.id||"conn_"+Date.now(),r=e.id?n.map(a=>a.id===e.id?{...e}:a):[...n,{...e,id:t}];return i.setKey("connections",r),K(r),t},deleteConnection(e){let{connections:n,activeConnectionId:t,tabs:r}=i.get(),a=n.filter(o=>o.id!==e);i.setKey("connections",a),K(a),i.setKey("tabs",r.filter(o=>o.connectionId!==e)),t===e&&(i.setKey("activeConnectionId",null),i.setKey("tables",[]),i.setKey("currentTable",null),i.setKey("currentTableData",null))},setActiveConnection(e){i.setKey("activeConnectionId",e)},addTab(e="editor",n={}){let{tabs:t,activeConnectionId:r}=i.get(),a=ie(),o={id:a,type:e,name:n.name||(e==="editor"?`Query ${t.filter(s=>s.type==="editor").length+1}`:n.tableName||"Table"),connectionId:n.connectionId||r,sql:n.sql||"",tableName:n.tableName||null};return i.setKey("tabs",[...t,o]),i.setKey("activeTabId",a),a},closeTab(e){let{tabs:n,activeTabId:t}=i.get(),r=n.findIndex(o=>o.id===e),a=n.filter(o=>o.id!==e);if(i.setKey("tabs",a),t===e){let o=Math.min(r,a.length-1);i.setKey("activeTabId",a.length?a[Math.max(0,o)].id:null)}},setActiveTab(e){i.setKey("activeTabId",e)},updateTabSQL(e,n){i.setKey("tabs",i.get().tabs.map(t=>t.id===e?{...t,sql:n}:t))},setStatus(e){i.setKey("statusText",e)},setResults(e){i.setKey("results",e),i.setKey("queryError",null)},setQueryError(e){i.setKey("queryError",e),i.setKey("results",null)},setQueryRunning(e){i.setKey("queryRunning",e)},setTables(e){i.setKey("tables",e)},setCurrentTable(e){i.setKey("currentTable",e)},setCurrentTableData(e){i.setKey("currentTableData",e)},setCurrentTableInfo(e){i.setKey("currentTableInfo",e)},setSidebarView(e){i.setKey("sidebarView",e)},setRecordCount(e){i.setKey("recordCount",e)}};var b=null;function I(){return b}async function S(e){let n=new R;return await n.open(e.database||e.name,e.wasmPath),e.seed!==!1&&n.seedIfEmpty(),b=n,i.setKey("activeConnectionId",e.id),i.setKey("tables",n.getTables()),i.setKey("statusText",`Connected \u2014 ${e.name}`),n}async function B(){b&&await b.save(),b=null,i.setKey("activeConnectionId",null),i.setKey("tables",[]),i.setKey("currentTable",null),i.setKey("currentTableData",null),i.setKey("currentTableInfo",null)}async function G(e){if(!b)throw new Error("Not connected");i.setKey("queryRunning",!0),i.setKey("queryError",null);try{let n=b.exec(e);return i.setKey("results",n),i.setKey("queryRunning",!1),i.setKey("statusText",`${n.rows.length} rows in ${n.duration}ms`),n}catch(n){throw i.setKey("queryError",n.message),i.setKey("queryRunning",!1),i.setKey("statusText","Query failed"),n}}async function A(e){if(b)try{let n=b.getTableData(e),t=b.getTableInfo(e);i.setKey("currentTable",e),i.setKey("currentTableData",n),i.setKey("currentTableInfo",t),i.setKey("statusText",`Table "${e}" \u2014 ${n.total} rows`)}catch{}}function N(){let{currentTable:e}=i.get();e&&A(e)}function w(){b&&i.setKey("tables",b.getTables())}async function O(e,n){b&&(b.insertRow(e,n),i.setKey("statusText",`Row inserted into "${e}"`),N(),w())}async function P(e,n,t,r){b&&(b.updateRowByPk(e,n,t,r),i.setKey("statusText",`Row updated in "${e}"`),N())}async function H(e,n,t){b&&(b.deleteRowByPk(e,n,t),i.setKey("statusText",`Row deleted from "${e}"`),N(),w())}async function k(e,n){b&&(b.createTable(e,n),i.setKey("statusText",`Table "${e}" created`),w())}async function F(e){b&&(b.dropTable(e),i.get().currentTable===e&&(i.setKey("currentTable",null),i.setKey("currentTableData",null),i.setKey("currentTableInfo",null)),i.setKey("statusText",`Table "${e}" dropped`),w())}async function j(e,n){b&&(b.addColumn(e,n),i.setKey("statusText",`Column "${n.name}" added to "${e}"`),N(),w())}async function V(e,n){b&&(b.dropColumn(e,n),i.setKey("statusText",`Column "${n}" dropped from "${e}"`),N(),w())}async function Y(e,n){b&&(b.renameTable(e,n),i.get().currentTable===e&&i.setKey("currentTable",n),i.setKey("statusText",`Table renamed to "${n}"`),w())}function L(e,n={},...t){let r=document.createElement(e);for(let[a,o]of Object.entries(n))a==="className"?r.className=o:a==="style"&&typeof o=="object"?Object.assign(r.style,o):a.startsWith("on")?r.addEventListener(a.slice(2).toLowerCase(),o):a==="dataset"&&typeof o=="object"?Object.assign(r.dataset,o):a==="html"?r.innerHTML=o:a==="text"?r.textContent=o:r.setAttribute(a,o);for(let a of t)a!=null&&(typeof a=="string"||typeof a=="number"?r.appendChild(document.createTextNode(a)):a instanceof Node&&r.appendChild(a));return r}function c(e,n=document){return n.querySelector(e)}function C(e,n=document){return n.querySelectorAll(e)}function E(e,n,t,r){let a=o=>{let s=o.target.closest(n);s&&e.contains(s)&&r(o,s)};return e.addEventListener(t,a),()=>e.removeEventListener(t,a)}function v(e){for(;e.firstChild;)e.removeChild(e.firstChild)}function h(e){let n=document.createElement("div");return n.textContent=e,n.innerHTML}function f(e){window.lucide&&(e?lucide.createIcons({root:e}):lucide.createIcons())}var ce=new Set(["SELECT","FROM","WHERE","INSERT","INTO","VALUES","UPDATE","SET","DELETE","CREATE","TABLE","ALTER","DROP","INDEX","VIEW","JOIN","LEFT","RIGHT","INNER","OUTER","FULL","CROSS","ON","AND","OR","NOT","IN","NULL","IS","LIKE","BETWEEN","EXISTS","UNION","ALL","DISTINCT","AS","ORDER","BY","GROUP","HAVING","LIMIT","OFFSET","ASC","DESC","CASE","WHEN","THEN","ELSE","END","WITH","RECURSIVE","PRIMARY","KEY","FOREIGN","REFERENCES","CASCADE","CONSTRAINT","DEFAULT","CHECK","UNIQUE","IF","GRANT","REVOKE","COMMIT","ROLLBACK","BEGIN","TRANSACTION","EXPLAIN","ANALYZE","TRUNCATE","RETURNING","USING","NATURAL","EXCEPT","INTERSECT","FETCH","NEXT","ROWS","ONLY","FOR","OF","MERGE","MATCHED","DO","NOTHING"]),de=new Set(["INT","INTEGER","BIGINT","SMALLINT","TINYINT","BOOLEAN","BIT","FLOAT","DOUBLE","REAL","DECIMAL","NUMERIC","MONEY","CHAR","VARCHAR","TEXT","CLOB","NCHAR","NVARCHAR","NTEXT","BINARY","VARBINARY","BLOB","BYTEA","DATE","TIME","TIMESTAMP","DATETIME","YEAR","INTERVAL","JSON","JSONB","UUID","ARRAY","ENUM","SERIAL","BIGSERIAL","GEOMETRY","GEOGRAPHY","POINT","LINESTRING","POLYGON"]),ue=new Set(["COUNT","SUM","AVG","MIN","MAX","COALESCE","NULLIF","CAST","CONVERT","SUBSTRING","UPPER","LOWER","TRIM","LENGTH","REPLACE","CONCAT","NOW","CURRENT_DATE","CURRENT_TIME","CURRENT_TIMESTAMP","EXTRACT","DATE_PART","DATE_TRUNC","ROUND","CEIL","FLOOR","ABS","MOD","POWER","SQRT","EXP","LN","LOG","GREATEST","LEAST","ROW_NUMBER","RANK","DENSE_RANK","LEAD","LAG","FIRST_VALUE","LAST_VALUE","NTH_VALUE","STRING_AGG","ARRAY_AGG","JSON_AGG","GROUP_CONCAT","LISTAGG","TO_CHAR","TO_DATE","TO_NUMBER","LEFT","RIGHT","POSITION","STRPOS","REGEXP_REPLACE","REGEXP_MATCH","SPLIT_PART","MD5","SHA256","RANDOM","GEN_RANDOM_UUID"]),pe=new Set(["TRUE","FALSE","NULL","UNKNOWN","CURRENT_USER","SESSION_USER","CURRENT_DATE","CURRENT_TIME","CURRENT_TIMESTAMP","LOCALTIME","LOCALTIMESTAMP","CURRENT_CATALOG","CURRENT_SCHEMA","DEFAULT"]);function X(e){if(!e)return"";let n=[],t=0,r=e.length;for(;t<r;){if(e[t]===`
`){n.push({type:"text",value:`
`}),t++;continue}if(e[t]===" "||e[t]==="	"){let a="";for(;t<r&&(e[t]===" "||e[t]==="	");)a+=e[t++];n.push({type:"text",value:a});continue}if(e[t]==="-"&&e[t+1]==="-"){let a="";for(t+=2;t<r&&e[t]!==`
`;)a+=e[t++];n.push({type:"comment",value:"--"+a});continue}if(e[t]==="/"&&e[t+1]==="*"){let a="/*";for(t+=2;t<r-1&&!(e[t]==="*"&&e[t+1]==="/");)a+=e[t++];t<r-1&&(a+="*/",t+=2),n.push({type:"comment",value:a});continue}if(e[t]==="'"||e[t]==='"'||e[t]==="`"){let a=e[t],o=a;for(t++;t<r;){if(e[t]==="\\"&&t+1<r){o+=e[t]+e[t+1],t+=2;continue}if(o+=e[t],e[t]===a){t++;break}t++}n.push({type:"string",value:o});continue}if(e[t]==="$"&&t+1<r&&e[t+1]==="$"){let a="$$";for(t+=2;t<r-1&&!(e[t]==="$"&&e[t+1]==="$");)a+=e[t++];t<r-1&&(a+="$$",t+=2),n.push({type:"string",value:a});continue}if(/[0-9]/.test(e[t])&&(t===0||/[\s,()=<>!+\-*/%]/.test(e[t-1]))){let a="";for(;t<r&&/[0-9.]/.test(e[t]);)a+=e[t++];a.endsWith(".")&&(a=a.slice(0,-1),t--),n.push({type:"number",value:a});continue}if(/[a-zA-Z_]/.test(e[t])){let a="";for(;t<r&&/[a-zA-Z0-9_]/.test(e[t]);)a+=e[t++];let o=a.toUpperCase();ce.has(o)?n.push({type:"keyword",value:a}):de.has(o)?n.push({type:"type",value:a}):ue.has(o)?n.push({type:"function",value:a}):pe.has(o)?n.push({type:"builtin",value:a}):n.push({type:"text",value:a});continue}if(/[()]/.test(e[t])){n.push({type:"text",value:e[t]}),t++;continue}if(e[t]===":"&&t+1<r&&/[a-zA-Z]/.test(e[t+1])){let a=":";for(t++;t<r&&/[a-zA-Z0-9_]/.test(e[t]);)a+=e[t++];n.push({type:"variable",value:a});continue}if(/[=<>!+\-*/%,;.]/.test(e[t])){let a=e[t];t++,(a==="<"||a===">"||a==="!"||a==="=")&&t<r&&e[t]==="="&&(a+="=",t++),n.push({type:"operator",value:a});continue}n.push({type:"text",value:e[t]}),t++}return n.map(a=>`<span class="${`sql-${a.type}`}">${be(a.value)}</span>`).join("")}function be(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function ye(e){return e?e.split(`
`).length:1}function Q(e){let n=ye(e);return Array.from({length:n},(t,r)=>r+1).join(`
`)}document.addEventListener("DOMContentLoaded",()=>{let{theme:e}=i.get();document.documentElement.classList.toggle("dark",e==="dark"),m(),i.subscribe(()=>{let n=i.get(),t=c("#status-text");t&&(t.textContent=n.statusText);let r=c("#status-icon");r&&(r.className=`w-2 h-2 rounded-full ${n.queryRunning?"bg-amber-400 animate-pulse":n.activeConnectionId?"bg-emerald-400":"bg-gray-600"}`)})});function m(){me(),Ee(),Te(),Ie(),f()}function me(){let e=c("#sidebar");v(e);let n=i.get(),{connections:t,activeConnectionId:r,tables:a,currentTable:o}=n;e.innerHTML=`
    <div class="flex items-center gap-2 px-4 h-10 shrink-0 border-b border-gray-800/60">
      <i data-lucide="database" class="w-4 h-4 text-blue-400"></i>
      <span class="text-xs font-semibold text-gray-300">Zrow</span>
      <span class="text-[9px] text-gray-600 ml-auto">v2</span>
    </div>
    <div class="flex-1 overflow-y-auto py-2" id="sidebar-body"></div>
    <div class="px-3 py-2 border-t border-gray-800/60 text-[11px] text-gray-500">
      <div class="flex items-center gap-2">
        <span id="status-icon" class="w-2 h-2 rounded-full ${r?"bg-emerald-400":"bg-gray-600"}"></span>
        <span id="status-text" class="truncate">${n.statusText}</span>
      </div>
    </div>
  `,document.addEventListener("contextmenu",u=>{let d=c("#table-context-menu");d&&d.remove()});let s=c("#sidebar-body");if(!t.length&&!r){s.innerHTML=`
      <div class="flex flex-col items-center gap-3 py-8 px-4 text-center">
        <i data-lucide="database" class="w-8 h-8 text-gray-700"></i>
        <p class="text-xs text-gray-600">No connections yet</p>
        <button id="btn-new-conn" class="px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors">
          <i data-lucide="plus" class="w-3 h-3 inline-block mr-1"></i> New Database
        </button>
      </div>
    `,c("#btn-new-conn")?.addEventListener("click",J),f(s);return}let l="";for(let u of t){let d=u.id===r;if(l+=`
      <div class="conn-item flex items-center gap-2 px-3 py-1.5 mx-1 rounded-lg cursor-pointer text-xs transition-all ${d?"bg-blue-500/10 text-blue-400":"text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"}" data-id="${u.id}">
        <i data-lucide="${d?"plug":"database"}" class="w-3.5 h-3.5 shrink-0"></i>
        <span class="truncate flex-1">${u.name}</span>
        <span class="text-[10px] text-gray-600">SQLite</span>
        <button class="btn-del-conn opacity-0 hover:opacity-100 hover:text-red-400 transition-opacity" data-id="${u.id}">
          <i data-lucide="x" class="w-3 h-3"></i>
        </button>
      </div>
    `,d&&a.length){l+='<div class="ml-2 pl-2 border-l border-gray-800/60 mt-0.5">',l+=`<div class="flex items-center justify-between px-2 py-1 text-[10px] text-gray-600 uppercase tracking-wider font-medium">
        <span><i data-lucide="layers" class="w-3 h-3 mr-1"></i> Tables <span class="font-normal ml-1">(${a.length})</span></span>
        <button id="btn-new-table" class="p-0.5 rounded hover:bg-gray-700/50 hover:text-gray-400 transition-colors" title="New Table">
          <i data-lucide="plus" class="w-3 h-3"></i>
        </button>
      </div>`;for(let p of a){let g=o===p.name;l+=`
          <div class="table-item flex items-center gap-1.5 px-2 py-1 rounded text-xs cursor-pointer transition-all group ${g?"text-blue-400 bg-blue-500/5":"text-gray-400 hover:text-gray-200 hover:bg-gray-800/40"}" data-table="${p.name}">
            <i data-lucide="table" class="w-3 h-3 shrink-0"></i>
            <span class="truncate flex-1">${p.name}</span>
            <span class="ml-1 text-[9px] text-gray-600">${p.columns.length}</span>
            <button class="btn-table-actions ml-auto p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-gray-700/50 hover:text-gray-300 transition-all ${g?"text-blue-400":"text-gray-600"}" data-table="${p.name}" title="Actions">
              <i data-lucide="more-horizontal" class="w-3 h-3"></i>
            </button>
          </div>
        `}l+="</div>"}}s.innerHTML=l,f(s),E(s,".conn-item","click",async(u,d)=>{let p=d.dataset.id,g=t.find(x=>x.id===p);if(g){if(r===p){await B(),m();return}i.setKey("statusText",`Connecting to ${g.name}...`),m();try{await S(g),m()}catch(x){i.setKey("statusText",`Error: ${x.message}`),m()}}}),E(s,".btn-del-conn","click",(u,d)=>{u.stopPropagation(),confirm("Delete this connection?")&&(T.deleteConnection(d.dataset.id),m())}),E(s,".table-item","click",async(u,d)=>{if(u.target.closest(".btn-table-actions"))return;let p=d.dataset.table;i.get().currentTable!==p&&(await A(p),m())}),E(s,".btn-table-actions","click",(u,d)=>{u.stopPropagation(),ge(d,d.dataset.table)}),c("#btn-new-table")?.addEventListener("click",()=>Z()),r||(s.innerHTML+=`
      <div class="px-3 mt-2">
        <button id="btn-new-conn" class="w-full px-3 py-1.5 text-xs font-medium rounded-lg border border-dashed border-gray-700 text-gray-500 hover:text-gray-300 hover:border-gray-600 transition-colors">
          <i data-lucide="plus" class="w-3 h-3 inline-block mr-1"></i> New Connection
        </button>
      </div>
    `,c("#btn-new-conn")?.addEventListener("click",J),f(s))}function ge(e,n){let t=c("#table-context-menu");t&&t.remove();let r=e.getBoundingClientRect(),a=L("div",{id:"table-context-menu",className:"fixed z-50 bg-gray-800 border border-gray-700/60 rounded-lg shadow-xl py-1 text-xs min-w-[140px]",style:{left:r.left+"px",top:r.bottom+4+"px"}}),o=[{label:"Browse",icon:"eye",action:()=>{A(n),m()}},{label:"Add Column",icon:"columns",action:()=>$(n)},{label:"Rename Table",icon:"edit-3",action:()=>Ce(n)},{type:"divider"},{label:"Duplicate Schema",icon:"copy",action:()=>fe(n)},{label:"Drop Table",icon:"trash-2",className:"text-red-400 hover:bg-red-500/10",action:()=>ee(`Drop table "${n}"? This cannot be undone.`,()=>xe(n))}];for(let s of o){if(s.type==="divider"){a.appendChild(L("div",{className:"h-px bg-gray-700/60 my-1"}));continue}let l=L("button",{className:`flex items-center gap-2 w-full px-3 py-1.5 text-left hover:bg-gray-700/50 transition-colors ${s.className||"text-gray-300"}`,onClick:()=>{a.remove(),s.action()}});l.innerHTML=`<i data-lucide="${s.icon}" class="w-3 h-3"></i> ${s.label}`,a.appendChild(l)}document.body.appendChild(a),f(a),setTimeout(()=>{let s=l=>{!a.contains(l.target)&&l.target!==e&&(a.remove(),document.removeEventListener("click",s))};document.addEventListener("click",s)},0)}async function fe(e){let n=I();if(!n)return;let t=e+"_copy",a=n.getTableInfo(e).columns.map(s=>({name:s.name,type:s.type,primaryKey:s.primaryKey,notNull:s.notNull,defaultValue:s.defaultValue}));await k(t,a);let o=n.getTableData(e,{limit:99999});for(let s of o.rows)await O(t,s);i.setKey("statusText",`Table "${e}" duplicated as "${t}"`),he(),m()}async function xe(e){await F(e),m()}function he(){let e=I();e&&i.setKey("tables",e.getTables())}function Ee(){let e=c("#tab-bar");v(e);let{tabs:n,activeTabId:t}=i.get();if(!n.length){e.innerHTML='<div class="flex items-center px-3 text-[11px] text-gray-600">No tabs</div>';return}for(let r of n){let a=r.id===t,o=L("div",{className:`tab-item flex items-center gap-1.5 px-3 py-1.5 text-xs cursor-pointer border-r border-gray-800/60 select-none whitespace-nowrap transition-all ${a?"text-blue-400 bg-blue-500/5":"text-gray-500 hover:text-gray-300 hover:bg-gray-800/30"}`,dataset:{tabId:r.id}});o.innerHTML=`<i data-lucide="${r.type==="editor"?"terminal":"table"}" class="w-3 h-3"></i>`,o.appendChild(L("span",{className:"truncate max-w-[120px]"},r.name));let s=L("button",{className:"flex items-center justify-center w-3.5 h-3.5 rounded hover:bg-gray-700/60 transition-all ml-0.5",dataset:{tabClose:r.id}});s.innerHTML='<i data-lucide="x" class="w-2.5 h-2.5"></i>',o.appendChild(s),e.appendChild(o)}f(e),E(e,".tab-item","click",(r,a)=>{let o=parseInt(a.dataset.tabId);isNaN(o)||(n.find(l=>l.id===o)?.type==="editor"&&(i.setKey("currentTable",null),i.setKey("currentTableData",null),i.setKey("currentTableInfo",null)),T.setActiveTab(o),m())}),E(e,"[data-tab-close]","click",(r,a)=>{r.stopPropagation();let o=parseInt(a.dataset.tabClose);isNaN(o)||(T.closeTab(o),m())})}function Te(){let e=c("#content-area");v(e);let n=i.get(),{tabs:t,activeTabId:r}=n;if(n.currentTable&&n.currentTableData){Le(e,n);return}if(!t.length||!r){e.innerHTML=`
      <div class="flex flex-col items-center justify-center h-full gap-4 text-gray-600">
        <i data-lucide="terminal" class="w-12 h-12 opacity-30"></i>
        <p class="text-sm">${n.activeConnectionId?"Open a table or write a query":"Connect to a database to get started"}</p>
        ${n.activeConnectionId?'<button id="btn-new-query" class="px-4 py-2 text-xs font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors"><i data-lucide="plus" class="w-3 h-3 inline-block mr-1"></i> New Query</button>':""}
      </div>
    `,c("#btn-new-query")?.addEventListener("click",()=>{i.setKey("currentTable",null),i.setKey("currentTableData",null),i.setKey("currentTableInfo",null),T.addTab("editor"),m()}),f(e);return}let a=t.find(o=>o.id===r);a?.type==="editor"&&ve(e,a,n)}function ve(e,n){let t=i.get();e.innerHTML=`
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
  `,f(e);let r=c("#editor-input"),a=c("#editor-highlight"),o=c("#editor-gutter"),s=c("#editor-status");function l(){let d=r.value;a.innerHTML=X(d)+`
`.repeat(Math.max(1,(d.match(/\n/g)||"").length+1)),o.textContent=Q(d),T.updateTabSQL(n.id,d)}r.addEventListener("input",l),r.addEventListener("scroll",()=>{a.scrollTop=r.scrollTop,a.scrollLeft=r.scrollLeft,o.scrollTop=r.scrollTop}),r.addEventListener("keydown",d=>{if(d.key==="Tab"){d.preventDefault();let p=r.selectionStart;r.value=r.value.substring(0,p)+"  "+r.value.substring(r.selectionEnd),r.selectionStart=r.selectionEnd=p+2,l()}(d.ctrlKey||d.metaKey)&&d.key==="Enter"&&(d.preventDefault(),q())}),l(),setTimeout(()=>r.focus(),50),c("#btn-run")?.addEventListener("click",q),W(t);let u=i.subscribe(()=>{W(i.get()),we(c("#results-panel"))},!1)}function W(e){let n=c("#editor-status");n&&(e.queryRunning?n.innerHTML='<i data-lucide="loader-circle" class="w-3 h-3 animate-spin inline-block mr-1"></i> Running...':e.queryError?n.innerHTML=`<i data-lucide="alert-circle" class="w-3 h-3 inline-block mr-1"></i> ${e.queryError}`:e.results?n.textContent=`${e.results.rows.length} rows in ${e.results.duration}ms`:n.textContent="Ready",f(n?.parentElement))}function we(e){if(!e)return;let n=i.get();if(n.queryRunning){e.innerHTML='<div class="flex items-center justify-center h-full gap-2 text-sm text-gray-500"><i data-lucide="loader-circle" class="w-4 h-4 animate-spin"></i> Running...</div>',f(e);return}if(n.queryError){e.innerHTML=`<div class="flex items-start gap-2 p-4 text-sm text-red-400"><i data-lucide="alert-circle" class="w-4 h-4 mt-0.5 shrink-0"></i> ${n.queryError}</div>`,f(e);return}if(!n.results?.columns?.length){e.innerHTML='<div class="flex flex-col items-center justify-center h-full gap-3 text-gray-600"><i data-lucide="arrow-up-right" class="w-8 h-8 opacity-30"></i><span class="text-xs">Run a query to see results</span></div>',f(e);return}e.innerHTML=z(n.results,!0),f(e)}async function q(){let e=c("#editor-input")?.value?.trim();if(!(!e||!i.get().activeConnectionId))try{await G(e)}catch{}}function Le(e,n){let t=n.currentTableData,r=n.currentTableInfo,a=n.currentTable;if(!t){e.innerHTML='<div class="flex items-center justify-center h-full text-gray-600 text-sm">Loading...</div>';return}let o=r?.columns?.find(l=>l.primaryKey)?.name||null,s=r?.columns?.map((l,u)=>`<div class="flex items-center gap-2 px-3 py-1.5 text-xs border-b border-gray-800/30 hover:bg-gray-800/20 group">
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
        <span class="text-sm font-medium text-gray-200">${h(a)}</span>
        <span class="text-xs text-gray-500">${t.total||0} rows</span>
        <div class="ml-auto flex items-center gap-1">
          <button id="btn-add-row" class="px-2 py-1 text-xs rounded-md bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 transition-colors flex items-center gap-1">
            <i data-lucide="plus" class="w-3 h-3"></i> Add Row
          </button>
          <button id="btn-add-col" class="px-2 py-1 text-xs rounded-md bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition-colors flex items-center gap-1">
            <i data-lucide="columns" class="w-3 h-3"></i> Add Column
          </button>
          <button id="btn-query-table" class="px-2 py-1 text-xs rounded-md bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 transition-colors flex items-center gap-1">
            <i data-lucide="terminal" class="w-3 h-3"></i> Query
          </button>
        </div>
      </div>
      <div class="flex flex-1 overflow-hidden">
        <div class="flex-1 flex flex-col overflow-hidden">
          ${z({columns:t.columns,rows:t.rows},!0,o)}
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
  `,f(e),c("#btn-query-table")?.addEventListener("click",()=>{T.addTab("editor",{connectionId:i.get().activeConnectionId,name:`Query: ${a}`,sql:`SELECT * FROM "${a}" LIMIT 100`}),m()}),c("#btn-add-row")?.addEventListener("click",()=>Ae(a,r)),c("#btn-add-col")?.addEventListener("click",()=>$(a)),c("#btn-add-col-panel")?.addEventListener("click",()=>$(a)),E(e,".btn-drop-col",async(l,u)=>{let d=u.dataset.col;ee(`Drop column "${d}" from "${a}"?`,async()=>{await V(a,d),m()})}),Ne(e,a,o,t),Re(e,a,o)}function Ne(e,n,t){E(e,".result-table td[data-col]","dblclick",(r,a)=>{if(a.querySelector("input, select, textarea"))return;let o=a.dataset.col,l=a.closest("tr")?.dataset?.pkVal;if(!t||!l||o===t)return;let u=a.textContent,d=a.querySelector(".text-gray-600.italic");a.innerHTML=`<input class="cell-edit-input w-full bg-gray-800 border border-blue-500/50 rounded px-1 py-0.5 text-xs text-gray-200 outline-none" value="${d?"":h(u)}" />`;let p=a.querySelector("input");p.focus(),p.select();function g(){let x=p.value,D={};D[o]=x===""?null:x,P(n,D,t,l).then(()=>m())}p.addEventListener("blur",g),p.addEventListener("keydown",x=>{x.key==="Enter"&&(x.preventDefault(),p.blur()),x.key==="Escape"&&(x.preventDefault(),m())})})}function Re(e,n,t){E(e,".btn-del-row",async(r,a)=>{let o=a.dataset.pkVal;!t||!o||confirm("Delete this row?")&&(await H(n,t,o),m())})}function z(e,n,t){let r=e.columns||[],a=e.rows||[],o="";n&&(o+=`<div class="flex items-center gap-2 px-3 py-1 border-b border-gray-800/60 bg-gray-900/20 shrink-0 text-[11px]">
      <span class="text-gray-500">${a.length} rows</span>
      <span class="text-gray-700">\xB7</span>
      <span class="text-gray-500">${r.length} cols</span>
      <button class="ml-auto px-2 py-0.5 rounded hover:bg-gray-800 text-gray-500 hover:text-gray-300 flex items-center gap-1" onclick="window.exportJSON()">
        <i data-lucide="download" class="w-3 h-3"></i> JSON
      </button>
      <button class="px-2 py-0.5 rounded hover:bg-gray-800 text-gray-500 hover:text-gray-300 flex items-center gap-1" onclick="window.exportCSV()">
        <i data-lucide="file-text" class="w-3 h-3"></i> CSV
      </button>
    </div>`),o+='<div class="flex-1 overflow-auto"><table class="result-table">',o+=`<thead><tr>${r.map(s=>`<th>${s.name||s}</th>`).join("")}${t?'<th class="w-8"></th>':""}</tr></thead>`,o+="<tbody>";for(let s=0;s<a.length;s++){let l=a[s],u=t?l[t]:null;o+=`<tr${t?` data-pk-col="${t}" data-pk-val="${u!=null?h(String(u)):""}"`:""} data-row-idx="${s}">`;for(let d of r){let p=d.name||d,g=l[p],x;g==null?x='<span class="text-gray-600 italic">NULL</span>':typeof g=="object"?x=`<span title="${h(String(g))}">${h(JSON.stringify(g))}</span>`:x=h(String(g)),o+=`<td data-col="${p}" title="${h(String(g??""))}" class="cursor-pointer hover:bg-blue-500/5 transition-colors">${x}</td>`}t&&(o+=`<td class="text-center"><button class="btn-del-row p-0.5 rounded hover:bg-red-500/20 hover:text-red-400 text-gray-600 transition-colors" data-pk-val="${u!=null?h(String(u)):""}" title="Delete row"><i data-lucide="trash-2" class="w-3 h-3"></i></button></td>`),o+="</tr>"}return o+="</tbody></table></div>",o}function Ae(e,n){if(!n?.columns)return;let t=c("#modal-overlay");t.classList.remove("hidden");let r=c("#modal-content");v(r);let a=n.columns.find(l=>l.primaryKey),o=n.columns.filter(l=>!l.primaryKey||l.defaultValue===null),s="";for(let l of o){let u=l.notNull&&l.defaultValue==null?"required":"";s+=`
      <div>
        <label class="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1">${l.name} <span class="text-gray-700 normal-case">${l.type}</span> ${l.primaryKey?'<span class="text-amber-400">PK</span>':""}</label>
        <input class="input-add-row w-full text-sm px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 text-gray-200 outline-none placeholder-gray-500 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-colors" name="${l.name}" placeholder="${l.type}" ${u} ${l.defaultValue!=null?`value="${h(String(l.defaultValue))}"`:""}>
      </div>
    `}r.innerHTML=`
    <form id="add-row-form" class="fade-in">
      <div class="flex items-center justify-between px-5 py-3 border-b border-gray-800">
        <h2 class="text-sm font-semibold text-gray-200"><i data-lucide="plus" class="w-4 h-4 text-emerald-400 inline-block mr-1.5"></i> Add Row \u2014 ${h(e)}</h2>
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
  `,f(r),c("#modal-close").addEventListener("click",y),c("#modal-cancel").addEventListener("click",y),t.addEventListener("click",l=>{l.target===t&&y()}),document.addEventListener("keydown",function l(u){u.key==="Escape"&&(y(),document.removeEventListener("keydown",l))}),c("#add-row-form").addEventListener("submit",async l=>{l.preventDefault();let u={};for(let d of C(".input-add-row")){let p=d.value.trim();p===""&&!d.hasAttribute("required")?u[d.name]=null:u[d.name]=p}await O(e,u),y(),m()}),setTimeout(()=>c(".input-add-row")?.focus(),100)}function Z(){let e=c("#modal-overlay");e.classList.remove("hidden");let n=c("#modal-content");v(n),n.innerHTML=`
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
  `,f(n),c("#modal-close").addEventListener("click",y),c("#modal-cancel").addEventListener("click",y),e.addEventListener("click",t=>{t.target===e&&y()}),document.addEventListener("keydown",function t(r){r.key==="Escape"&&(y(),document.removeEventListener("keydown",t))}),c("#ct-add-col").addEventListener("click",()=>{let t=c("#ct-columns"),r=document.createElement("div");r.className="ct-col-row flex items-center gap-2 p-2 rounded-lg bg-gray-800/50 border border-gray-700/50",r.innerHTML=`
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
    `,t.appendChild(r),f(r)}),E(c("#ct-columns"),".ct-remove-col","click",(t,r)=>{let a=r.closest(".ct-col-row");c("#ct-columns").children.length>1&&a.remove()}),c("#create-table-form").addEventListener("submit",async t=>{t.preventDefault();let r=c("#ct-name").value.trim();if(!r)return;let a=[];for(let o of C(".ct-col-row")){let s=o.querySelector(".ct-col-name").value.trim();s&&a.push({name:s,type:o.querySelector(".ct-col-type").value,primaryKey:o.querySelector(".ct-col-pk").checked,autoIncrement:o.querySelector(".ct-col-ai").checked,notNull:o.querySelector(".ct-col-nn").checked})}a.length&&(await k(r,a),y(),m())}),setTimeout(()=>c("#ct-name")?.focus(),100)}function $(e){let n=c("#modal-overlay");n.classList.remove("hidden");let t=c("#modal-content");v(t),t.innerHTML=`
    <form id="add-col-form" class="fade-in">
      <div class="flex items-center justify-between px-5 py-3 border-b border-gray-800">
        <h2 class="text-sm font-semibold text-gray-200"><i data-lucide="columns" class="w-4 h-4 text-blue-400 inline-block mr-1.5"></i> Add Column \u2014 ${h(e)}</h2>
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
  `,f(t),c("#modal-close").addEventListener("click",y),c("#modal-cancel").addEventListener("click",y),n.addEventListener("click",r=>{r.target===n&&y()}),document.addEventListener("keydown",function r(a){a.key==="Escape"&&(y(),document.removeEventListener("keydown",r))}),c("#add-col-form").addEventListener("submit",async r=>{r.preventDefault();let a=c("#ac-name").value.trim(),o=c("#ac-type").value,s=c("#ac-default").value.trim()||null,l=c("#ac-notnull").checked;a&&(await j(e,{name:a,type:o,defaultValue:s,notNull:l}),y(),m())}),setTimeout(()=>c("#ac-name")?.focus(),100)}function Ce(e){let n=c("#modal-overlay");n.classList.remove("hidden");let t=c("#modal-content");v(t),t.innerHTML=`
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
          <div class="text-sm px-3 py-2 rounded-lg border border-gray-700 bg-gray-800/50 text-gray-400">${h(e)}</div>
        </div>
        <div>
          <label class="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1">New Name</label>
          <input id="rn-name" class="w-full text-sm px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 text-gray-200 outline-none placeholder-gray-500 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-colors" value="${h(e)}" required autofocus>
        </div>
      </div>
      <div class="flex items-center justify-end gap-2 px-5 py-3 border-t border-gray-800 bg-gray-900/50">
        <button type="button" id="modal-cancel" class="text-xs px-3 py-1.5 rounded-lg border border-gray-700 bg-gray-800 text-gray-400 hover:text-gray-200 transition-all">Cancel</button>
        <button type="submit" class="text-xs font-semibold px-4 py-1.5 rounded-lg text-white bg-blue-600 hover:bg-blue-500 transition-all">Rename</button>
      </div>
    </form>
  `,f(t),c("#modal-close").addEventListener("click",y),c("#modal-cancel").addEventListener("click",y),n.addEventListener("click",r=>{r.target===n&&y()}),document.addEventListener("keydown",function r(a){a.key==="Escape"&&(y(),document.removeEventListener("keydown",r))}),c("#rename-table-form").addEventListener("submit",async r=>{r.preventDefault();let a=c("#rn-name").value.trim();!a||a===e||(await Y(e,a),y(),m())}),setTimeout(()=>c("#rn-name")?.focus(),100)}function ee(e,n){let t=c("#modal-overlay");t.classList.remove("hidden");let r=c("#modal-content");v(r),r.innerHTML=`
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
  `,f(r);let a=()=>y();c("#modal-close").addEventListener("click",a),c("#modal-cancel").addEventListener("click",a),t.addEventListener("click",o=>{o.target===t&&a()}),document.addEventListener("keydown",function o(s){s.key==="Escape"&&(a(),document.removeEventListener("keydown",o))}),c("#modal-confirm").addEventListener("click",()=>{y(),n()})}function Ie(){let e=c("#footer"),n=i.get();e.innerHTML=`
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
  `,c("#btn-new-tab")?.addEventListener("click",()=>{T.addTab("editor"),m()}),c("#btn-new-table-footer")?.addEventListener("click",()=>Z()),c("#btn-theme")?.addEventListener("click",T.toggleTheme),f(e)}function J(e){let n=c("#modal-overlay");n.classList.remove("hidden");let t=c("#modal-content");v(t);let r=e?.database&&e.database!==":memory:";t.innerHTML=`
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
  `,f(t),c("#modal-close").addEventListener("click",y),c("#modal-cancel").addEventListener("click",y),n.addEventListener("click",a=>{a.target===n&&y()}),document.addEventListener("keydown",function a(o){o.key==="Escape"&&(y(),document.removeEventListener("keydown",a))}),C('input[name="conn-storage"]').forEach(a=>{a.addEventListener("change",()=>{c("#db-name-group").classList.toggle("hidden",c('input[name="conn-storage"]:checked')?.value==="memory")})}),c("#conn-form").addEventListener("submit",async a=>{a.preventDefault();let o=c("#conn-name").value.trim();if(!o)return;let s=c('input[name="conn-storage"]:checked')?.value,l=c("#conn-db")?.value?.trim()||o,u=s==="persist"?l:":memory:",d=c("#conn-seed")?.checked!==!1,p=T.addConnection({...e||{},name:o,database:u,seed:d});y(),i.setKey("statusText",`Connecting to ${o}...`),m();try{let g=i.get().connections.find(x=>x.id===p);g&&await S(g),m()}catch(g){i.setKey("statusText",`Error: ${g.message}`),m()}}),setTimeout(()=>c("#conn-name")?.focus(),100)}function y(){c("#modal-overlay").classList.add("hidden")}window.exportJSON=function(){let e=i.get(),n=e.results||(e.currentTableData?{columns:e.currentTableData.columns,rows:e.currentTableData.rows}:null);if(!n)return;let t=n.columns.map(a=>a.name||a),r=n.rows.map(a=>{let o={};return t.forEach(s=>o[s]=a[s]),o});te(JSON.stringify(r,null,2),"results.json","application/json")};window.exportCSV=function(){let e=i.get(),n=e.results||(e.currentTableData?{columns:e.currentTableData.columns,rows:e.currentTableData.rows}:null);if(!n)return;let t=n.columns.map(o=>o.name||o),r=o=>{let s=o==null?"":String(o);return s.includes(",")||s.includes('"')||s.includes(`
`)?'"'+s.replace(/"/g,'""')+'"':s},a=[t.map(r).join(","),...n.rows.map(o=>t.map(s=>r(o[s])).join(","))];te(a.join(`
`),"results.csv","text/csv")};function te(e,n,t){let r=new Blob([e],{type:t}),a=document.createElement("a");a.href=URL.createObjectURL(r),a.download=n,a.click(),URL.revokeObjectURL(a.href)}
