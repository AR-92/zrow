var L=e=>{let n=structuredClone(e),t=new Set,s=new Map,a={get(){return n},set(r){let o=n;n=typeof r=="function"?r(o):r,t.forEach(c=>{try{c(n,o)}catch(u){console.error("Listener error:",u)}})},update(r){a.set(r)},setKey(r,o){a.set(c=>({...c,[r]:typeof o=="function"?o(c[r]):o}))},subscribe(r,o=!1){return t.add(r),o&&r(n,n),()=>t.delete(r)},select(r,o){let c=r(n);return a.subscribe(u=>{let l=r(u);Object.is(c,l)||(o(l,c),c=l)})},on(r,o){return s.has(r)||s.set(r,new Set),s.get(r).add(o),()=>a.off(r,o)},once(r,o){let c=a.on(r,(...u)=>{c(),o(...u)});return c},off(r,o){if(!r){s.clear();return}let c=s.get(r);if(c){if(!o){c.clear();return}c.delete(o)}},emit(r,o){let c=s.get(r);if(c)for(let u of c)try{u({type:r,data:o,state:n})}catch(l){console.error(`Event "${r}" error:`,l)}},destroy(){t.clear(),s.clear()}};return a};var P=`
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
`;function w(e,n){let t=P.split(";").filter(s=>s.trim());for(let s of t)try{n(s+";")}catch(a){console.warn("Seed statement failed (likely already exists):",a.message)}}function I(){return new Promise((e,n)=>{let t=indexedDB.open("zrow_dbs",1);t.onupgradeneeded=s=>{let a=s.target.result;a.objectStoreNames.contains("dbs")||a.createObjectStore("dbs",{keyPath:"id"})},t.onsuccess=s=>e(s.target.result),t.onerror=()=>n(new Error("Failed to open IndexedDB"))})}async function F(e){let n=await I();return new Promise((t,s)=>{let r=n.transaction("dbs","readonly").objectStore("dbs").get(e);r.onsuccess=()=>{n.close(),t(r.result?.data||null)},r.onerror=()=>{n.close(),s(new Error("Failed to read DB"))}})}async function H(e,n){let t=await I();return new Promise((s,a)=>{let r=t.transaction("dbs","readwrite");r.objectStore("dbs").put({id:e,data:n,updated:Date.now()}),r.oncomplete=()=>{t.close(),s()},r.onerror=()=>{t.close(),a()}})}var v=class{constructor(){this._db=null,this._SQL=null,this._name=null}async open(n,t){if(this._name=n,this._SQL=await window.initSqlJs({locateFile:s=>(t||"dist/vendor/")+s}),this._db=new this._SQL.Database,n&&n!==":memory:")try{let s=await F(n);s&&(this._db=new this._SQL.Database(s))}catch{}return this}seedIfEmpty(){try{let n=this._db.exec("SELECT count(*) as cnt FROM sqlite_master WHERE type='table'");if(n.length&&n[0].values[0][0]>0)return}catch{}w(this._db,n=>this._db.exec(n))}async save(){if(this._name&&this._name!==":memory:"&&this._db)try{await H(this._name,this._db.export())}catch{}}exec(n){let t=performance.now(),s=this._db.exec(n),a=[],r=[],o=this._db.getRowsModified();for(let u of s)u.columns?.length&&(a=u.columns.map(l=>({name:l,type:"text"})),r=u.values.map(l=>{let p={};return u.columns.forEach((g,y)=>{p[g]=l[y]}),p}));return/^\s*(INSERT|UPDATE|DELETE|CREATE|DROP|ALTER)/i.test(n)&&this.save(),{columns:a,rows:r,affectedRows:o,duration:Math.round(performance.now()-t)}}getTables(){let n=this._db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name");return n.length?n[0].values.map(t=>{let s=t[0],a=this._db.exec(`PRAGMA table_info("${s}")`),r=a.length?a[0].values.map(o=>({name:o[1],type:o[2],nullable:!o[3],defaultValue:o[4],primaryKey:!!o[5]})):[];return{name:s,type:"table",columns:r}}):[]}getTableData(n,{limit:t=200,offset:s=0}={}){try{let a=this._db.exec(`SELECT * FROM "${n}" LIMIT ${t} OFFSET ${s}`),r=this._db.exec(`SELECT COUNT(*) as cnt FROM "${n}"`),o=r.length?r[0].values[0][0]:0;if(!a.length)return{columns:[],rows:[],total:0};let c=a[0].columns.map(l=>({name:l,type:"text"})),u=a[0].values.map(l=>{let p={};return a[0].columns.forEach((g,y)=>{p[g]=l[y]}),p});return{columns:c,rows:u,total:o}}catch{return{columns:[],rows:[],total:0}}}updateRow(n,t,s){let a=Object.entries(t).filter(([r])=>r!=="id").map(([r,o])=>`"${r}" = ${o===null?"NULL":typeof o=="string"?`'${o.replace(/'/g,"''")}'`:o}`).join(", ");a&&this.exec(`UPDATE "${n}" SET ${a} WHERE id = ${typeof s=="string"&&isNaN(Number(s))?`'${s}'`:s}`)}deleteRow(n,t){this.exec(`DELETE FROM "${n}" WHERE id = ${typeof t=="string"&&isNaN(Number(t))?`'${t}'`:t}`)}getTableInfo(n){let t=this._db.exec(`PRAGMA table_info("${n}")`),s=this._db.exec(`PRAGMA index_list("${n}")`),a=this._db.exec(`PRAGMA foreign_key_list("${n}")`);return{columns:t.length?t[0].values.map(r=>({cid:r[0],name:r[1],type:r[2],notNull:!!r[3],defaultValue:r[4],primaryKey:!!r[5]})):[],indexes:s.length?s[0].values.map(r=>({name:r[1],unique:!r[2],origin:r[3]})):[],foreignKeys:a.length?a[0].values.map(r=>({column:r[3],refTable:r[2],refColumn:r[4]})):[]}}};function B(){try{return JSON.parse(localStorage.getItem("zrow_connections")||"[]")}catch{return[]}}function S(e){localStorage.setItem("zrow_connections",JSON.stringify(e))}var j=Date.now();function Y(){return++j}var V={theme:localStorage.getItem("zrow_theme")||"dark",connections:B(),activeConnectionId:null,tabs:[],activeTabId:null,statusText:"Ready",results:null,queryRunning:!1,queryError:null,tables:[],currentTable:null,currentTableData:null,currentTableInfo:null,sidebarView:"tables",recordCount:null},i=L(V),f={toggleTheme(){let e=i.get().theme==="dark"?"light":"dark";i.setKey("theme",e),localStorage.setItem("zrow_theme",e),document.documentElement.classList.toggle("dark",e==="dark")},addConnection(e){let{connections:n}=i.get(),t=e.id||"conn_"+Date.now(),s=e.id?n.map(a=>a.id===e.id?{...e}:a):[...n,{...e,id:t}];return i.setKey("connections",s),S(s),t},deleteConnection(e){let{connections:n,activeConnectionId:t,tabs:s}=i.get(),a=n.filter(r=>r.id!==e);i.setKey("connections",a),S(a),i.setKey("tabs",s.filter(r=>r.connectionId!==e)),t===e&&(i.setKey("activeConnectionId",null),i.setKey("tables",[]),i.setKey("currentTable",null),i.setKey("currentTableData",null))},setActiveConnection(e){i.setKey("activeConnectionId",e)},addTab(e="editor",n={}){let{tabs:t,activeConnectionId:s}=i.get(),a=Y(),r={id:a,type:e,name:n.name||(e==="editor"?`Query ${t.filter(o=>o.type==="editor").length+1}`:n.tableName||"Table"),connectionId:n.connectionId||s,sql:n.sql||"",tableName:n.tableName||null};return i.setKey("tabs",[...t,r]),i.setKey("activeTabId",a),a},closeTab(e){let{tabs:n,activeTabId:t}=i.get(),s=n.findIndex(r=>r.id===e),a=n.filter(r=>r.id!==e);if(i.setKey("tabs",a),t===e){let r=Math.min(s,a.length-1);i.setKey("activeTabId",a.length?a[Math.max(0,r)].id:null)}},setActiveTab(e){i.setKey("activeTabId",e)},updateTabSQL(e,n){i.setKey("tabs",i.get().tabs.map(t=>t.id===e?{...t,sql:n}:t))},setStatus(e){i.setKey("statusText",e)},setResults(e){i.setKey("results",e),i.setKey("queryError",null)},setQueryError(e){i.setKey("queryError",e),i.setKey("results",null)},setQueryRunning(e){i.setKey("queryRunning",e)},setTables(e){i.setKey("tables",e)},setCurrentTable(e){i.setKey("currentTable",e)},setCurrentTableData(e){i.setKey("currentTableData",e)},setCurrentTableInfo(e){i.setKey("currentTableInfo",e)},setSidebarView(e){i.setKey("sidebarView",e)},setRecordCount(e){i.setKey("recordCount",e)}};var E=null;async function R(e){let n=new v;return await n.open(e.database||e.name,e.wasmPath),e.seed!==!1&&n.seedIfEmpty(),E=n,i.setKey("activeConnectionId",e.id),i.setKey("tables",n.getTables()),i.setKey("statusText",`Connected \u2014 ${e.name}`),n}async function C(){E&&await E.save(),E=null,i.setKey("activeConnectionId",null),i.setKey("tables",[]),i.setKey("currentTable",null),i.setKey("currentTableData",null),i.setKey("currentTableInfo",null)}async function A(e){if(!E)throw new Error("Not connected");i.setKey("queryRunning",!0),i.setKey("queryError",null);try{let n=E.exec(e);return i.setKey("results",n),i.setKey("queryRunning",!1),i.setKey("statusText",`${n.rows.length} rows in ${n.duration}ms`),n}catch(n){throw i.setKey("queryError",n.message),i.setKey("queryRunning",!1),i.setKey("statusText","Query failed"),n}}async function O(e){if(E)try{let n=E.getTableData(e),t=E.getTableInfo(e);i.setKey("currentTable",e),i.setKey("currentTableData",n),i.setKey("currentTableInfo",t),i.setKey("statusText",`Table "${e}" \u2014 ${n.total} rows`)}catch{}}function N(e,n={},...t){let s=document.createElement(e);for(let[a,r]of Object.entries(n))a==="className"?s.className=r:a==="style"&&typeof r=="object"?Object.assign(s.style,r):a.startsWith("on")?s.addEventListener(a.slice(2).toLowerCase(),r):a==="dataset"&&typeof r=="object"?Object.assign(s.dataset,r):a==="html"?s.innerHTML=r:a==="text"?s.textContent=r:s.setAttribute(a,r);for(let a of t)a!=null&&(typeof a=="string"||typeof a=="number"?s.appendChild(document.createTextNode(a)):a instanceof Node&&s.appendChild(a));return s}function d(e,n=document){return n.querySelector(e)}function U(e,n=document){return n.querySelectorAll(e)}function T(e,n,t,s){let a=r=>{let o=r.target.closest(n);o&&e.contains(o)&&s(r,o)};return e.addEventListener(t,a),()=>e.removeEventListener(t,a)}function h(e){for(;e.firstChild;)e.removeChild(e.firstChild)}function b(e){window.lucide&&(e?lucide.createIcons({root:e}):lucide.createIcons())}var X=new Set(["SELECT","FROM","WHERE","INSERT","INTO","VALUES","UPDATE","SET","DELETE","CREATE","TABLE","ALTER","DROP","INDEX","VIEW","JOIN","LEFT","RIGHT","INNER","OUTER","FULL","CROSS","ON","AND","OR","NOT","IN","NULL","IS","LIKE","BETWEEN","EXISTS","UNION","ALL","DISTINCT","AS","ORDER","BY","GROUP","HAVING","LIMIT","OFFSET","ASC","DESC","CASE","WHEN","THEN","ELSE","END","WITH","RECURSIVE","PRIMARY","KEY","FOREIGN","REFERENCES","CASCADE","CONSTRAINT","DEFAULT","CHECK","UNIQUE","IF","GRANT","REVOKE","COMMIT","ROLLBACK","BEGIN","TRANSACTION","EXPLAIN","ANALYZE","TRUNCATE","RETURNING","USING","NATURAL","EXCEPT","INTERSECT","FETCH","NEXT","ROWS","ONLY","FOR","OF","MERGE","MATCHED","DO","NOTHING"]),Q=new Set(["INT","INTEGER","BIGINT","SMALLINT","TINYINT","BOOLEAN","BIT","FLOAT","DOUBLE","REAL","DECIMAL","NUMERIC","MONEY","CHAR","VARCHAR","TEXT","CLOB","NCHAR","NVARCHAR","NTEXT","BINARY","VARBINARY","BLOB","BYTEA","DATE","TIME","TIMESTAMP","DATETIME","YEAR","INTERVAL","JSON","JSONB","UUID","ARRAY","ENUM","SERIAL","BIGSERIAL","GEOMETRY","GEOGRAPHY","POINT","LINESTRING","POLYGON"]),W=new Set(["COUNT","SUM","AVG","MIN","MAX","COALESCE","NULLIF","CAST","CONVERT","SUBSTRING","UPPER","LOWER","TRIM","LENGTH","REPLACE","CONCAT","NOW","CURRENT_DATE","CURRENT_TIME","CURRENT_TIMESTAMP","EXTRACT","DATE_PART","DATE_TRUNC","ROUND","CEIL","FLOOR","ABS","MOD","POWER","SQRT","EXP","LN","LOG","GREATEST","LEAST","ROW_NUMBER","RANK","DENSE_RANK","LEAD","LAG","FIRST_VALUE","LAST_VALUE","NTH_VALUE","STRING_AGG","ARRAY_AGG","JSON_AGG","GROUP_CONCAT","LISTAGG","TO_CHAR","TO_DATE","TO_NUMBER","LEFT","RIGHT","POSITION","STRPOS","REGEXP_REPLACE","REGEXP_MATCH","SPLIT_PART","MD5","SHA256","RANDOM","GEN_RANDOM_UUID"]),J=new Set(["TRUE","FALSE","NULL","UNKNOWN","CURRENT_USER","SESSION_USER","CURRENT_DATE","CURRENT_TIME","CURRENT_TIMESTAMP","LOCALTIME","LOCALTIMESTAMP","CURRENT_CATALOG","CURRENT_SCHEMA","DEFAULT"]);function D(e){if(!e)return"";let n=[],t=0,s=e.length;for(;t<s;){if(e[t]===`
`){n.push({type:"text",value:`
`}),t++;continue}if(e[t]===" "||e[t]==="	"){let a="";for(;t<s&&(e[t]===" "||e[t]==="	");)a+=e[t++];n.push({type:"text",value:a});continue}if(e[t]==="-"&&e[t+1]==="-"){let a="";for(t+=2;t<s&&e[t]!==`
`;)a+=e[t++];n.push({type:"comment",value:"--"+a});continue}if(e[t]==="/"&&e[t+1]==="*"){let a="/*";for(t+=2;t<s-1&&!(e[t]==="*"&&e[t+1]==="/");)a+=e[t++];t<s-1&&(a+="*/",t+=2),n.push({type:"comment",value:a});continue}if(e[t]==="'"||e[t]==='"'||e[t]==="`"){let a=e[t],r=a;for(t++;t<s;){if(e[t]==="\\"&&t+1<s){r+=e[t]+e[t+1],t+=2;continue}if(r+=e[t],e[t]===a){t++;break}t++}n.push({type:"string",value:r});continue}if(e[t]==="$"&&t+1<s&&e[t+1]==="$"){let a="$$";for(t+=2;t<s-1&&!(e[t]==="$"&&e[t+1]==="$");)a+=e[t++];t<s-1&&(a+="$$",t+=2),n.push({type:"string",value:a});continue}if(/[0-9]/.test(e[t])&&(t===0||/[\s,()=<>!+\-*/%]/.test(e[t-1]))){let a="";for(;t<s&&/[0-9.]/.test(e[t]);)a+=e[t++];a.endsWith(".")&&(a=a.slice(0,-1),t--),n.push({type:"number",value:a});continue}if(/[a-zA-Z_]/.test(e[t])){let a="";for(;t<s&&/[a-zA-Z0-9_]/.test(e[t]);)a+=e[t++];let r=a.toUpperCase();X.has(r)?n.push({type:"keyword",value:a}):Q.has(r)?n.push({type:"type",value:a}):W.has(r)?n.push({type:"function",value:a}):J.has(r)?n.push({type:"builtin",value:a}):n.push({type:"text",value:a});continue}if(/[()]/.test(e[t])){n.push({type:"text",value:e[t]}),t++;continue}if(e[t]===":"&&t+1<s&&/[a-zA-Z]/.test(e[t+1])){let a=":";for(t++;t<s&&/[a-zA-Z0-9_]/.test(e[t]);)a+=e[t++];n.push({type:"variable",value:a});continue}if(/[=<>!+\-*/%,;.]/.test(e[t])){let a=e[t];t++,(a==="<"||a===">"||a==="!"||a==="=")&&t<s&&e[t]==="="&&(a+="=",t++),n.push({type:"operator",value:a});continue}n.push({type:"text",value:e[t]}),t++}return n.map(a=>`<span class="${`sql-${a.type}`}">${z(a.value)}</span>`).join("")}function z(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function q(e){return e?e.split(`
`).length:1}function _(e){let n=q(e);return Array.from({length:n},(t,s)=>s+1).join(`
`)}document.addEventListener("DOMContentLoaded",()=>{let{theme:e}=i.get();document.documentElement.classList.toggle("dark",e==="dark"),m(),i.subscribe(()=>{let n=i.get(),t=d("#status-text");t&&(t.textContent=n.statusText);let s=d("#status-icon");s&&(s.className=`w-2 h-2 rounded-full ${n.queryRunning?"bg-amber-400 animate-pulse":n.activeConnectionId?"bg-emerald-400":"bg-gray-600"}`)})});function m(){Z(),ee(),te(),se(),b()}function Z(){let e=d("#sidebar");h(e);let n=i.get(),{connections:t,activeConnectionId:s,tables:a,currentTable:r}=n;e.innerHTML=`
    <div class="flex items-center gap-2 px-4 h-10 shrink-0 border-b border-gray-800/60">
      <i data-lucide="database" class="w-4 h-4 text-blue-400"></i>
      <span class="text-xs font-semibold text-gray-300">Zrow</span>
      <span class="text-[9px] text-gray-600 ml-auto">v2</span>
    </div>
    <div class="flex-1 overflow-y-auto py-2" id="sidebar-body"></div>
    <div class="px-3 py-2 border-t border-gray-800/60 text-[11px] text-gray-500">
      <div class="flex items-center gap-2">
        <span id="status-icon" class="w-2 h-2 rounded-full ${s?"bg-emerald-400":"bg-gray-600"}"></span>
        <span id="status-text" class="truncate">${n.statusText}</span>
      </div>
    </div>
  `;let o=d("#sidebar-body");if(!t.length&&!s){o.innerHTML=`
      <div class="flex flex-col items-center gap-3 py-8 px-4 text-center">
        <i data-lucide="database" class="w-8 h-8 text-gray-700"></i>
        <p class="text-xs text-gray-600">No connections yet</p>
        <button id="btn-new-conn" class="px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors">
          <i data-lucide="plus" class="w-3 h-3 inline-block mr-1"></i> New Database
        </button>
      </div>
    `,d("#btn-new-conn")?.addEventListener("click",$),b(o);return}let c="";for(let u of t){let l=u.id===s;if(c+=`
      <div class="conn-item flex items-center gap-2 px-3 py-1.5 mx-1 rounded-lg cursor-pointer text-xs transition-all ${l?"bg-blue-500/10 text-blue-400":"text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"}" data-id="${u.id}">
        <i data-lucide="${l?"plug":"database"}" class="w-3.5 h-3.5 shrink-0"></i>
        <span class="truncate flex-1">${u.name}</span>
        <span class="text-[10px] text-gray-600">SQLite</span>
        <button class="btn-del-conn opacity-0 hover:opacity-100 hover:text-red-400 transition-opacity" data-id="${u.id}">
          <i data-lucide="x" class="w-3 h-3"></i>
        </button>
      </div>
    `,l&&a.length){c+='<div class="ml-2 pl-2 border-l border-gray-800/60 mt-0.5">',c+=`<div class="flex items-center px-2 py-1 text-[10px] text-gray-600 uppercase tracking-wider font-medium">
        <i data-lucide="layers" class="w-3 h-3 mr-1"></i> Tables <span class="font-normal ml-1">(${a.length})</span>
      </div>`;for(let p of a)c+=`
          <div class="table-item flex items-center gap-1.5 px-2 py-1 rounded text-xs cursor-pointer transition-all ${r===p.name?"text-blue-400 bg-blue-500/5":"text-gray-400 hover:text-gray-200 hover:bg-gray-800/40"}" data-table="${p.name}">
            <i data-lucide="table" class="w-3 h-3 shrink-0"></i>
            <span class="truncate">${p.name}</span>
            <span class="ml-auto text-[9px] text-gray-600">${p.columns.length}</span>
          </div>
        `;c+="</div>"}}o.innerHTML=c,b(o),T(o,".conn-item","click",async(u,l)=>{let p=l.dataset.id,g=t.find(y=>y.id===p);if(g){if(s===p){await C(),m();return}i.setKey("statusText",`Connecting to ${g.name}...`),m();try{await R(g),m()}catch(y){i.setKey("statusText",`Error: ${y.message}`),m()}}}),T(o,".btn-del-conn","click",(u,l)=>{u.stopPropagation(),confirm("Delete this connection?")&&(f.deleteConnection(l.dataset.id),m())}),T(o,".table-item","click",async(u,l)=>{let p=l.dataset.table;r!==p&&(await O(p),m())}),s||(o.innerHTML+=`
      <div class="px-3 mt-2">
        <button id="btn-new-conn" class="w-full px-3 py-1.5 text-xs font-medium rounded-lg border border-dashed border-gray-700 text-gray-500 hover:text-gray-300 hover:border-gray-600 transition-colors">
          <i data-lucide="plus" class="w-3 h-3 inline-block mr-1"></i> New Connection
        </button>
      </div>
    `,d("#btn-new-conn")?.addEventListener("click",$),b(o))}function ee(){let e=d("#tab-bar");h(e);let{tabs:n,activeTabId:t}=i.get();if(!n.length){e.innerHTML='<div class="flex items-center px-3 text-[11px] text-gray-600">No tabs</div>';return}for(let s of n){let a=s.id===t,r=N("div",{className:`tab-item flex items-center gap-1.5 px-3 py-1.5 text-xs cursor-pointer border-r border-gray-800/60 select-none whitespace-nowrap transition-all ${a?"text-blue-400 bg-blue-500/5":"text-gray-500 hover:text-gray-300 hover:bg-gray-800/30"}`,dataset:{tabId:s.id}});r.innerHTML=`<i data-lucide="${s.type==="editor"?"terminal":"table"}" class="w-3 h-3"></i>`,r.appendChild(N("span",{className:"truncate max-w-[120px]"},s.name));let o=N("button",{className:"flex items-center justify-center w-3.5 h-3.5 rounded hover:bg-gray-700/60 transition-all ml-0.5",dataset:{tabClose:s.id}});o.innerHTML='<i data-lucide="x" class="w-2.5 h-2.5"></i>',r.appendChild(o),e.appendChild(r)}b(e),T(e,".tab-item","click",(s,a)=>{let r=parseInt(a.dataset.tabId);isNaN(r)||(n.find(c=>c.id===r)?.type==="editor"&&(i.setKey("currentTable",null),i.setKey("currentTableData",null),i.setKey("currentTableInfo",null)),f.setActiveTab(r),m())}),T(e,"[data-tab-close]","click",(s,a)=>{s.stopPropagation();let r=parseInt(a.dataset.tabClose);isNaN(r)||(f.closeTab(r),m())})}function te(){let e=d("#content-area");h(e);let n=i.get(),{tabs:t,activeTabId:s}=n;if(n.currentTable&&n.currentTableData){re(e,n);return}if(!t.length||!s){e.innerHTML=`
      <div class="flex flex-col items-center justify-center h-full gap-4 text-gray-600">
        <i data-lucide="terminal" class="w-12 h-12 opacity-30"></i>
        <p class="text-sm">${n.activeConnectionId?"Open a table or write a query":"Connect to a database to get started"}</p>
        ${n.activeConnectionId?'<button id="btn-new-query" class="px-4 py-2 text-xs font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors"><i data-lucide="plus" class="w-3 h-3 inline-block mr-1"></i> New Query</button>':""}
      </div>
    `,d("#btn-new-query")?.addEventListener("click",()=>{i.setKey("currentTable",null),i.setKey("currentTableData",null),i.setKey("currentTableInfo",null),f.addTab("editor"),m()}),b(e);return}let a=t.find(r=>r.id===s);a?.type==="editor"&&ne(e,a,n)}function ne(e,n){let t=i.get();e.innerHTML=`
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
  `,b(e);let s=d("#editor-input"),a=d("#editor-highlight"),r=d("#editor-gutter"),o=d("#editor-status");function c(){let l=s.value;a.innerHTML=D(l)+`
`.repeat(Math.max(1,(l.match(/\n/g)||"").length+1)),r.textContent=_(l),f.updateTabSQL(n.id,l)}s.addEventListener("input",c),s.addEventListener("scroll",()=>{a.scrollTop=s.scrollTop,a.scrollLeft=s.scrollLeft,r.scrollTop=s.scrollTop}),s.addEventListener("keydown",l=>{if(l.key==="Tab"){l.preventDefault();let p=s.selectionStart;s.value=s.value.substring(0,p)+"  "+s.value.substring(s.selectionEnd),s.selectionStart=s.selectionEnd=p+2,c()}(l.ctrlKey||l.metaKey)&&l.key==="Enter"&&(l.preventDefault(),k())}),c(),setTimeout(()=>s.focus(),50),d("#btn-run")?.addEventListener("click",k),M(t);let u=i.subscribe(()=>{M(i.get()),ae(d("#results-panel"))},!1)}function M(e){let n=d("#editor-status");n&&(e.queryRunning?n.innerHTML='<i data-lucide="loader-circle" class="w-3 h-3 animate-spin inline-block mr-1"></i> Running...':e.queryError?n.innerHTML=`<i data-lucide="alert-circle" class="w-3 h-3 inline-block mr-1"></i> ${e.queryError}`:e.results?n.textContent=`${e.results.rows.length} rows in ${e.results.duration}ms`:n.textContent="Ready",b(n?.parentElement))}function ae(e){if(!e)return;let n=i.get();if(n.queryRunning){e.innerHTML='<div class="flex items-center justify-center h-full gap-2 text-sm text-gray-500"><i data-lucide="loader-circle" class="w-4 h-4 animate-spin"></i> Running...</div>',b(e);return}if(n.queryError){e.innerHTML=`<div class="flex items-start gap-2 p-4 text-sm text-red-400"><i data-lucide="alert-circle" class="w-4 h-4 mt-0.5 shrink-0"></i> ${n.queryError}</div>`,b(e);return}if(!n.results?.columns?.length){e.innerHTML='<div class="flex flex-col items-center justify-center h-full gap-3 text-gray-600"><i data-lucide="arrow-up-right" class="w-8 h-8 opacity-30"></i><span class="text-xs">Run a query to see results</span></div>',b(e);return}e.innerHTML=K(n.results,!0),b(e)}async function k(){let e=d("#editor-input")?.value?.trim();if(!(!e||!i.get().activeConnectionId))try{await A(e)}catch{}}function re(e,n){let t=n.currentTableData,s=n.currentTableInfo,a=n.currentTable;if(!t){e.innerHTML='<div class="flex items-center justify-center h-full text-gray-600 text-sm">Loading...</div>';return}let r=s?.columns?.map(o=>`<div class="flex items-center gap-2 px-3 py-1.5 text-xs border-b border-gray-800/30 hover:bg-gray-800/20">
      <span class="w-28 font-medium text-gray-300">${o.name}</span>
      <span class="w-20 text-blue-400 font-mono">${o.type}</span>
      <span class="w-28 text-gray-500">${o.primaryKey?'<span class="text-amber-400 font-medium">PK</span>':""}${o.notNull?' <span class="text-gray-600">NOT NULL</span>':""}</span>
      <span class="text-gray-600 truncate">${o.defaultValue!=null?`default: ${o.defaultValue}`:""}</span>
    </div>`).join("")||"";e.innerHTML=`
    <div class="flex flex-col h-full">
      <div class="flex items-center gap-2 px-3 py-1.5 border-b border-gray-800/60 bg-gray-900/30 shrink-0">
        <i data-lucide="table" class="w-4 h-4 text-blue-400"></i>
        <span class="text-sm font-medium text-gray-200">${a}</span>
        <span class="text-xs text-gray-500">${t.total||0} rows</span>
        <button id="btn-query-table" class="ml-auto px-2 py-1 text-xs rounded-md bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition-colors">
          <i data-lucide="terminal" class="w-3 h-3 inline-block mr-1"></i> Query
        </button>
      </div>
      <div class="flex flex-1 overflow-hidden">
        <div class="flex-1 flex flex-col overflow-hidden">
          ${K(t,!0)}
        </div>
        ${s?`<div class="w-56 shrink-0 border-l border-gray-800/60 bg-gray-900/30 overflow-y-auto hidden md:block">
          <div class="px-3 py-2 text-[10px] text-gray-500 uppercase tracking-wider font-medium border-b border-gray-800/60">Columns</div>
          ${r}
          ${s.indexes?.length?`<div class="px-3 py-2 text-[10px] text-gray-500 uppercase tracking-wider font-medium border-b border-gray-800/60 mt-2">Indexes</div>
          ${s.indexes.map(o=>`<div class="px-3 py-1 text-xs text-gray-400">${o.name} ${o.unique?"(unique)":""}</div>`).join("")}`:""}
          ${s.foreignKeys?.length?`<div class="px-3 py-2 text-[10px] text-gray-500 uppercase tracking-wider font-medium border-b border-gray-800/60 mt-2">Foreign Keys</div>
          ${s.foreignKeys.map(o=>`<div class="px-3 py-1 text-xs text-gray-400">${o.column} \u2192 ${o.refTable}(${o.refColumn})</div>`).join("")}`:""}
        </div>`:""}
      </div>
    </div>
  `,b(e),d("#btn-query-table")?.addEventListener("click",()=>{f.addTab("editor",{connectionId:i.get().activeConnectionId,name:`Query: ${a}`,sql:`SELECT * FROM "${a}" LIMIT 100`}),m()})}function K(e,n){let t=e.columns||[],s=e.rows||[],a="";n&&(a+=`<div class="flex items-center gap-2 px-3 py-1 border-b border-gray-800/60 bg-gray-900/20 shrink-0 text-[11px]">
      <span class="text-gray-500">${s.length} rows</span>
      <span class="text-gray-700">\xB7</span>
      <span class="text-gray-500">${t.length} cols</span>
      <button class="ml-auto px-2 py-0.5 rounded hover:bg-gray-800 text-gray-500 hover:text-gray-300 flex items-center gap-1" onclick="window.exportJSON(${s.length})">
        <i data-lucide="download" class="w-3 h-3"></i> JSON
      </button>
      <button class="px-2 py-0.5 rounded hover:bg-gray-800 text-gray-500 hover:text-gray-300 flex items-center gap-1" onclick="window.exportCSV(${s.length})">
        <i data-lucide="file-text" class="w-3 h-3"></i> CSV
      </button>
    </div>`),a+='<div class="flex-1 overflow-auto"><table class="result-table">',a+=`<thead><tr>${t.map(r=>`<th>${r.name||r}</th>`).join("")}</tr></thead>`,a+="<tbody>";for(let r of s)a+=`<tr>${t.map(o=>{let c=r[o.name||o];return c==null?'<td><span class="text-gray-600 italic">NULL</span></td>':typeof c=="object"?`<td title="${String(c)}">${JSON.stringify(c)}</td>`:`<td title="${String(c)}">${String(c)}</td>`}).join("")}</tr>`;return a+="</tbody></table></div>",a}window.exportJSON=function(){let e=i.get(),n=e.results||(e.currentTableData?{columns:e.currentTableData.columns,rows:e.currentTableData.rows}:null);if(!n)return;let t=n.columns.map(a=>a.name||a),s=n.rows.map(a=>{let r={};return t.forEach(o=>r[o]=a[o]),r});G(JSON.stringify(s,null,2),"results.json","application/json")};window.exportCSV=function(){let e=i.get(),n=e.results||(e.currentTableData?{columns:e.currentTableData.columns,rows:e.currentTableData.rows}:null);if(!n)return;let t=n.columns.map(r=>r.name||r),s=r=>{let o=r==null?"":String(r);return o.includes(",")||o.includes('"')||o.includes(`
`)?'"'+o.replace(/"/g,'""')+'"':o},a=[t.map(s).join(","),...n.rows.map(r=>t.map(o=>s(r[o])).join(","))];G(a.join(`
`),"results.csv","text/csv")};function G(e,n,t){let s=new Blob([e],{type:t}),a=document.createElement("a");a.href=URL.createObjectURL(s),a.download=n,a.click(),URL.revokeObjectURL(a.href)}function se(){let e=d("#footer"),n=i.get();e.innerHTML=`
    <div class="flex items-center gap-3 px-3 py-[3px] text-[11px] text-gray-500">
      <button id="btn-new-tab" class="flex items-center gap-1 hover:text-gray-300 transition-colors cursor-pointer py-[1px]">
        <i data-lucide="plus" class="w-2.5 h-2.5"></i> New Tab
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
  `,d("#btn-new-tab")?.addEventListener("click",()=>{f.addTab("editor"),m()}),d("#btn-theme")?.addEventListener("click",f.toggleTheme),b(e)}function $(e){let n=d("#modal-overlay");n.classList.remove("hidden");let t=d("#modal-content");h(t);let s=e?.database&&e.database!==":memory:";t.innerHTML=`
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
              <input type="radio" name="conn-storage" value="memory" ${s?"":"checked"}>
              <i data-lucide="cpu" class="w-4 h-4 text-gray-400"></i>
              <span class="text-xs text-gray-300">In-Memory</span>
            </label>
            <label class="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 cursor-pointer hover:border-gray-600 transition-colors flex-1">
              <input type="radio" name="conn-storage" value="persist" ${s?"checked":""}>
              <i data-lucide="hard-drive" class="w-4 h-4 text-gray-400"></i>
              <span class="text-xs text-gray-300">Persistent</span>
            </label>
          </div>
        </div>
        <div id="db-name-group" class="${s?"":"hidden"}">
          <label class="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1">Database Name</label>
          <input class="w-full text-sm px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 text-gray-200 outline-none placeholder-gray-500 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-colors" id="conn-db" value="${s?e.database:"my_database"}" placeholder="my_database">
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
  `,b(t),d("#modal-close").addEventListener("click",x),d("#modal-cancel").addEventListener("click",x),n.addEventListener("click",a=>{a.target===n&&x()}),document.addEventListener("keydown",function a(r){r.key==="Escape"&&(x(),document.removeEventListener("keydown",a))}),U('input[name="conn-storage"]').forEach(a=>{a.addEventListener("change",()=>{d("#db-name-group").classList.toggle("hidden",d('input[name="conn-storage"]:checked')?.value==="memory")})}),d("#conn-form").addEventListener("submit",async a=>{a.preventDefault();let r=d("#conn-name").value.trim();if(!r)return;let o=d('input[name="conn-storage"]:checked')?.value,c=d("#conn-db")?.value?.trim()||r,u=o==="persist"?c:":memory:",l=d("#conn-seed")?.checked!==!1,p=f.addConnection({...e||{},name:r,database:u,seed:l});x(),i.setKey("statusText",`Connecting to ${r}...`),m();try{let g=i.get().connections.find(y=>y.id===p);g&&await R(g),m()}catch(g){i.setKey("statusText",`Error: ${g.message}`),m()}}),setTimeout(()=>d("#conn-name")?.focus(),100)}function x(){d("#modal-overlay").classList.add("hidden")}
