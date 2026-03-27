import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client"; 

const API = "https://inminutes-backend.onrender.com";
const CATS = ["Groceries","Beauty","Food","Beverages","Snacks","Dairy","Bakery","Other"];

// --- UPDATED CSS WITH TOAST, CHART, AND PAGINATION STYLES ---
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'DM Sans',sans-serif;background:#121212;color:#F5F5F5}
:root{
  --bg: #121212;
  --s: #1E1E1E;
  --s2: #2A2A2A;
  --a: #F97316; 
  --a2: #E11D48; 
  --g: #8EF264; 
  --ui: #166534; 
  --y: #F59E0B; 
  --m: #A1A1AA; 
  --b: rgba(255,255,255,0.08); 
}
.wrap{display:flex;min-height:100vh}
.side{width:230px;background:var(--s);border-right:1px solid var(--b);display:flex;flex-direction:column;position:fixed;top:0;left:0;bottom:0;z-index:50}
.slogo{padding:22px 18px;border-bottom:1px solid var(--b)}
.slogo-t{font-family:'Syne',sans-serif;font-weight:800;font-size:22px;color:#F5F5F5}
.slogo-t span{color:var(--a)}
.slogo-b{display:inline-flex;margin-top:4px;background:rgba(249,115,22,0.15);border:1px solid rgba(249,115,22,0.3);border-radius:20px;padding:3px 10px;font-size:10px;font-weight:800;color:var(--a);letter-spacing:.5px}
.snav{flex:1;padding:12px 10px;overflow-y:auto}
.ni{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:12px;cursor:pointer;color:var(--m);font-size:14px;margin-bottom:4px;transition:all .2s}
.ni:hover{background:rgba(255,255,255,.04);color:#F5F5F5}
.ni.act{background:var(--ui);color:#fff;font-weight:600;box-shadow:0 2px 8px rgba(22,101,52,0.4)}
.nbdg{margin-left:auto;background:var(--a2);color:#fff;font-size:10px;font-weight:800;padding:2px 7px;border-radius:10px;animation:blink2 1s ease 1}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.6}} @keyframes blink2{0%{opacity:1}25%{opacity:.2}50%{opacity:1}75%{opacity:.2}100%{opacity:1}}
.sbot{padding:14px;border-top:1px solid var(--b)}
.suser{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:12px;background:var(--s2)}
.av{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg, var(--a), #D946EF);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;font-family:'Syne',sans-serif;flex-shrink:0;color:#fff}
.main{margin-left:230px;flex:1;background:var(--bg);display:flex;flex-direction:column;height:100vh;overflow:hidden;}
.topbar{background:var(--bg);padding:0 24px;height:64px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0}
.ttl{font-family:'Syne',sans-serif;font-size:18px;font-weight:700}
.con{padding:24px;flex:1;overflow-y:auto;}
.sgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px}
.sc{background:var(--s);border:1px solid var(--b);border-radius:16px;padding:20px;position:relative;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.2)}
.sc::before{content:'';position:absolute;top:-15px;right:-15px;width:80px;height:80px;border-radius:50%;filter:blur(28px);opacity:.15}
.sc.t::before{background:var(--a)}.sc.g::before{background:var(--ui)}.sc.y::before{background:var(--y)}.sc.r::before{background:var(--a2)}
.slbl{font-size:11px;color:var(--m);font-weight:700;margin-bottom:8px;text-transform:uppercase;letter-spacing:.5px}
.sval{font-family:'Syne',sans-serif;font-size:28px;font-weight:800}
.sc.t .sval{color:var(--a)}.sc.g .sval{color:var(--g)}.sc.y .sval{color:var(--y)}.sc.r .sval{color:var(--a2)}
.sico{position:absolute;bottom:14px;right:16px;font-size:28px;opacity:.2}
.card{background:var(--s);border:1px solid var(--b);border-radius:16px;overflow:hidden;margin-bottom:20px;box-shadow:0 4px 12px rgba(0,0,0,0.2)}
.ch{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid var(--b);background:rgba(255,255,255,0.02)}
.ct{font-family:'Syne',sans-serif;font-size:15px;font-weight:700}
table{width:100%;border-collapse:collapse}
thead{background:var(--s2)}
th{text-align:left;padding:12px 20px;font-size:11px;font-weight:700;color:var(--m);text-transform:uppercase;letter-spacing:.8px;white-space:nowrap;border-bottom:1px solid var(--b)}
td{padding:14px 20px;border-bottom:1px solid var(--b);font-size:13px;vertical-align:middle}
tr:last-child td{border-bottom:none}
tr:hover td{background:rgba(255,255,255,.02)}
.badge{display:inline-flex;font-size:11px;font-weight:700;padding:4px 10px;border-radius:20px}
.bg{background:rgba(142,242,100,.15);color:var(--g);border:1px solid rgba(142,242,100,.3)}
.br{background:rgba(225,29,72,.15);color:var(--a2);border:1px solid rgba(225,29,72,.3)}
.bt{background:rgba(249,115,22,.15);color:var(--a);border:1px solid rgba(249,115,22,.3)}
.by{background:rgba(245,158,11,.15);color:var(--y);border:1px solid rgba(245,158,11,.3)}
.abtn{padding:6px 12px;border-radius:8px;border:1px solid var(--b);background:var(--s2);color:#F5F5F5;font-size:12px;cursor:pointer;font-weight:600;margin-right:6px;transition:all .2s;font-family:'DM Sans',sans-serif}
.abtn.e:hover{color:var(--a);border-color:var(--a);background:rgba(249,115,22,0.1)}.abtn.d:hover{color:var(--a2);border-color:var(--a2);background:rgba(225,29,72,0.1)}
.pbtn{background:var(--a);color:#121212;border:none;border-radius:10px;padding:9px 20px;font-size:13px;font-weight:800;cursor:pointer;font-family:'DM Sans',sans-serif;transition:opacity 0.2s}
.pbtn:hover{opacity:0.9}
.ov{position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:200;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px)}
.modal{background:var(--s);border:1px solid var(--b);border-radius:24px;padding:30px;width:520px;max-height:92vh;overflow-y:auto;box-shadow:0 24px 48px rgba(0,0,0,0.5)}
.mt{font-family:'Syne',sans-serif;font-size:20px;font-weight:800;margin-bottom:24px}
.fg{margin-bottom:16px}
.fl{font-size:11px;font-weight:700;color:var(--m);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px;display:block}
.fi{width:100%;background:var(--bg);border:1px solid var(--b);border-radius:12px;padding:12px 16px;color:#F5F5F5;font-size:14px;font-family:'DM Sans',sans-serif;outline:none;transition:border 0.2s}
.fi:focus{border-color:var(--a)}
.fsel{width:100%;background:var(--bg);border:1px solid var(--b);border-radius:12px;padding:12px 16px;color:#F5F5F5;font-size:14px;font-family:'DM Sans',sans-serif;outline:none;cursor:pointer}
.frow{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.uzone{border:2px dashed rgba(255,255,255,.2);border-radius:16px;padding:24px;text-align:center;position:relative;cursor:pointer;background:rgba(255,255,255,0.02);transition:all .2s}
.uzone:hover{border-color:var(--a);background:rgba(249,115,22,0.05)}
.uzone input{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%}
.igrid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:12px}
.iitem{position:relative;border-radius:10px;overflow:hidden;aspect-ratio:1;border:1px solid var(--b)}
.iitem img{width:100%;height:100%;object-fit:cover}
.irem{position:absolute;top:4px;right:4px;width:22px;height:22px;border-radius:50%;background:rgba(225,29,72,.9);border:none;color:#fff;font-size:12px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-weight:800}
.mbtns{display:flex;gap:12px;margin-top:24px}
.mbtns button{flex:1;padding:14px;border-radius:12px;font-size:14px;font-weight:800;cursor:pointer;font-family:'Syne',sans-serif;border:none}
.lwrap{min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--bg)}
.lbox{background:var(--s);border:1px solid var(--b);border-radius:24px;padding:48px 40px;width:420px;box-shadow:0 12px 32px rgba(0,0,0,0.4)}
.ld{display:flex;align-items:center;justify-content:center;padding:60px;color:var(--m);font-size:14px}
.osel{background:var(--bg);border:1px solid var(--b);border-radius:8px;padding:6px 12px;color:#F5F5F5;font-size:13px;cursor:pointer;outline:none;font-family:'DM Sans',sans-serif}
.osel:focus{border-color:var(--a)}
.err{background:rgba(225,29,72,.1);border:1px solid rgba(225,29,72,.2);border-radius:12px;padding:12px 16px;font-size:13px;color:var(--a2);margin-bottom:16px;font-weight:600}

/* ── TOAST NOTIFICATIONS ── */
.toast-container { position: fixed; bottom: 24px; right: 24px; z-index: 1000; display: flex; flex-direction: column; gap: 10px; }
.toast { background: var(--s); border-radius: 12px; padding: 14px 20px; font-size: 14px; font-weight: 700; color: #fff; display: flex; align-items: center; gap: 10px; box-shadow: 0 8px 24px rgba(0,0,0,0.4); animation: slideUp 0.3s ease forwards; }
.toast.success { border-left: 4px solid var(--g); }
.toast.error { border-left: 4px solid var(--a2); }
@keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

/* ── NOTIFICATION BANNER ── */
.notif-banner{position:fixed;top:24px;right:24px;z-index:999;background:var(--s);border:1px solid var(--a);border-radius:16px;padding:20px;max-width:380px;box-shadow:0 12px 40px rgba(0,0,0,.6);animation:slideIn .4s cubic-bezier(0.16, 1, 0.3, 1),blink2 1s ease 0.4s 1}
@keyframes slideIn{from{transform:translateX(120%);opacity:0}to{transform:translateX(0);opacity:1}}
.notif-close{position:absolute;top:12px;right:14px;background:none;border:none;color:var(--m);font-size:18px;cursor:pointer}
.new-dot{width:10px;height:10px;border-radius:50%;background:var(--a2);display:inline-block;margin-right:8px;animation:pulse 1s infinite}
.pc{display:flex;align-items:center;gap:14px}
.pth{width:48px;height:48px;border-radius:12px;object-fit:cover;flex-shrink:0;border:1px solid var(--b)}
.pph{width:48px;height:48px;border-radius:12px;background:var(--bg);display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0;border:1px solid var(--b)}

/* ── KANBAN BOARD STYLES ── */
.kanban-wrap { display: flex; gap: 16px; height: calc(100vh - 120px); overflow-x: auto; padding-bottom: 12px; align-items: stretch; scrollbar-width: thin; }
.k-col { flex: 1; min-width: 320px; background: rgba(255,255,255,0.02); border: 1px dashed var(--b); border-radius: 16px; display: flex; flex-direction: column; transition: background 0.2s;}
.k-col.drag-over { background: rgba(142,242,100,0.05); border: 1px dashed var(--g); }
.k-head { padding: 16px; border-bottom: 1px solid var(--b); display: flex; justify-content: space-between; align-items: center; }
.k-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 15px; color: var(--t); display: flex; alignItems: center; gap: 8px;}
.k-body { padding: 12px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 12px; min-height: 150px; }
.k-card { background: var(--s); border: 1px solid var(--b); border-radius: 12px; padding: 16px; cursor: grab; box-shadow: 0 4px 12px rgba(0,0,0,0.1); transition: transform 0.2s, border-color 0.2s; position: relative;}
.k-card:hover { border-color: var(--ui); transform: translateY(-2px); }
.k-card:active { cursor: grabbing; transform: scale(0.98); }
.k-card.new { border-left: 3px solid var(--a2); }
.k-cid { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 14px; margin-bottom: 8px; color: var(--t); }
.k-user { font-size: 13px; font-weight: 600; color: var(--t); margin-bottom: 2px; }
.k-det { font-size: 11px; color: var(--m); line-height: 1.4; margin-bottom: 10px; }
.k-foot { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--b); padding-top: 10px; margin-top: 6px;}
.k-tot { font-family: 'Syne', sans-serif; font-weight: 800; color: var(--g); font-size: 15px; }

/* ── RESPONSIVE MOBILE FIXES ── */
.ham { display: none; background: transparent; border: none; color: #F5F5F5; font-size: 26px; cursor: pointer; padding-right: 12px; }
.mob-ov { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 45; backdrop-filter: blur(3px); opacity: 0; transition: opacity 0.3s; pointer-events: none; }
.mob-ov.open { display: block; opacity: 1; pointer-events: auto; }

/* ── REFRESH SPINNER ── */
.spin-icon { display: inline-block; transition: transform 0.2s; }
.spin-icon.spinning { animation: spin 1s linear infinite; }
@keyframes spin { 100% { transform: rotate(360deg); } }

/* ── CHART STYLES ── */
.chart-bar { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; gap: 6px; transition: opacity 0.2s; }
.chart-bar:hover { opacity: 0.8; }
.chart-fill { width: 100%; background: linear-gradient(to top, var(--ui), var(--ui2)); border-radius: 6px 6px 0 0; transition: height 0.5s ease-out; min-height: 4px; }
.chart-val { font-size: 11px; font-weight: 700; color: var(--a); }
.chart-date { font-size: 10px; color: var(--m); text-transform: uppercase; font-weight: 600;}

@media (max-width: 800px) {
  .side { transform: translateX(-100%); transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: none; z-index: 50; }
  .side.open { transform: translateX(0); box-shadow: 4px 0 24px rgba(0,0,0,0.5); }
  .main { margin-left: 0; width: 100vw; }
  .ham { display: block; }
  .mob-ov.open { display: block; }
  .sgrid { grid-template-columns: 1fr 1fr; gap: 12px; }
  .con { padding: 16px; }
  .k-col { min-width: 85vw; }
  table { display: block; overflow-x: auto; white-space: nowrap; }
}
@media (max-width: 500px) {
  .sgrid { grid-template-columns: 1fr; }
  .topbar { padding: 0 16px; height: 60px; }
  .modal { width: 90vw; padding: 20px; }
  .frow { grid-template-columns: 1fr; }
  .igrid { grid-template-columns: repeat(3, 1fr); }
}
`;

export default function AdminApp() {
  const [auth, setAuth] = useState(()=>{
    try { const s=localStorage.getItem('inminutes_admin'); return s?JSON.parse(s):null; } catch(e){ return null; }
  });
  const [page, setPage] = useState("dashboard");
  const [mobMenu, setMobMenu] = useState(false); 
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [modal, setModal] = useState(null);
  const [editP, setEditP] = useState(null);
  const [search, setSearch] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loginErr, setLoginErr] = useState("");
  
  // --- NEW: TOAST STATE ---
  const [toasts, setToasts] = useState([]);
  
  // --- NEW: REFRESH STATE ---
  const [isRefreshing, setIsRefreshing] = useState(false);

  // --- NEW: PAGINATION STATE FOR "ALL ORDERS" ---
  const [orderPage, setOrderPage] = useState(1);
  const ORDERS_PER_PAGE = 50;

  const [imgFiles, setImgFiles] = useState([]);
  const [imgPrevs, setImgPrevs] = useState([]);
  const [keepImgs, setKeepImgs] = useState([]);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);
  const [newP, setNewP] = useState({ name:"", category:"Groceries", price:"", qty:"", inStock:true, desc:"" });
  const [dragOverCol, setDragOverCol] = useState(null);

  const audioRef = useRef(null);
  const notifiedIds = useRef(new Set());

  // --- CUSTOM TOAST FUNCTION ---
  const showToast = (msg, type = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const requestNotifPermission = async () => {
    if ("Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission();
    }
  };

  useEffect(() => { requestNotifPermission(); }, []);

  const playSound = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      [0, 0.25, 0.5].forEach(delay => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.type = 'sine';
        o.frequency.setValueAtTime(880, ctx.currentTime + delay);
        o.frequency.setValueAtTime(1200, ctx.currentTime + delay + 0.08);
        g.gain.setValueAtTime(0.4, ctx.currentTime + delay);
        g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.2);
        o.start(ctx.currentTime + delay);
        o.stop(ctx.currentTime + delay + 0.2);
      });
    } catch(e) {}
  };

  const sendBrowserNotification = (order) => {
    if ("Notification" in window && Notification.permission === "granted") {
      const n = new Notification("🛒 New Order — In Minutes!", {
        body: `${order.id} · ${order.userName} · ₹${order.total}\n📍 ${order.address?.line1}, ${order.address?.city}\n📞 ${order.userPhone}`,
        icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🛒</text></svg>",
        requireInteraction: true,
        tag: order.id
      });
      n.onclick = () => { window.focus(); n.close(); };
    }
  };

  useEffect(() => {
    if (!auth) return;
    loadAll();
    const socket = io(API);
    socket.on('newOrderReceived', (newOrder) => {
      if (!notifiedIds.current.has(newOrder.id)) {
        notifiedIds.current.add(newOrder.id);
        setNotification(newOrder);
        playSound();
        sendBrowserNotification(newOrder);
      }
      loadAll(); 
    });
    socket.on('orderStatusUpdated', () => { loadAll(); });
    const interval = setInterval(loadAll, 60000); 
    return () => { socket.disconnect(); clearInterval(interval); };
  }, [auth]);


  // --- UPDATED LOAD ALL (Handles Spin State) ---
  const loadAll = async () => {
    try {
      setIsRefreshing(true);
      const headers = { "Authorization": `Bearer ${auth?.token}` };
      const [pr, or, st] = await Promise.all([
        fetch(`${API}/products`, { headers }).then(r=>r.json()),
        fetch(`${API}/orders`, { headers }).then(r=>r.json()),
        fetch(`${API}/stats`, { headers }).then(r=>r.json()),
      ]);
      if(Array.isArray(pr)) setProducts(pr); 
      if(st && !st.error) setStats(st);
      if(Array.isArray(or)) setOrders(or);
    } catch(e) {
      // showToast("Failed to sync data", "error");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleManualRefresh = async () => {
    await loadAll();
    showToast("Data synced successfully!", "success");
  };

  const doLogin = async () => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      const r = await fetch(`${API}/admins/login`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({email, password:pass}), signal: controller.signal });
      clearTimeout(timeout);
      const d = await r.json();
      if (!r.ok) { setLoginErr(d.error || "Invalid credentials"); return; }
      localStorage.setItem('inminutes_admin', JSON.stringify(d));
      setAuth(d);
      showToast("Welcome back!", "success");
    } catch(e) { 
      if (e.name === 'AbortError') { setLoginErr("Request timed out. Try again."); } 
      else { setLoginErr("Error: " + e.message); }
    }
  };

  const markSeen = async (orderId) => {
    await fetch(`${API}/orders/${orderId}/seen`, { 
      method:"PUT",
      headers: { "Authorization": `Bearer ${auth.token}` } 
    });
    setNotification(null);
    loadAll();
  };

  const onImgs = (e) => {
    const files = Array.from(e.target.files);
    if (imgFiles.length + keepImgs.length + files.length > 5) { showToast("Maximum 5 images allowed", "error"); return; }
    setImgFiles(p=>[...p,...files]);
    setImgPrevs(p=>[...p,...files.map(f=>URL.createObjectURL(f))]);
  };

  const saveProd = async () => {
    if (!newP.name||!newP.price||!newP.qty) { showToast("Please fill Name, Price, and Qty", "error"); return; }
    setSaving(true);
    const fd = new FormData();
    fd.append("data", JSON.stringify({ ...newP, price:Number(newP.price), qty:Number(newP.qty), keepImages:keepImgs }));
    imgFiles.forEach(f=>fd.append("images",f));
    try {
      await fetch(editP ? `${API}/products/${editP.id}` : `${API}/products`, { 
        method: editP ? "PUT" : "POST", 
        headers: { "Authorization": `Bearer ${auth.token}` },
        body:fd 
      });
      await loadAll();
      setModal(null); setNewP({name:"",category:"Groceries",price:"",qty:"",inStock:true,desc:""});
      setImgFiles([]); setImgPrevs([]); setKeepImgs([]); setEditP(null);
      showToast(editP ? "Product updated!" : "Product added!", "success");
    } catch(e) { showToast("Error saving product", "error"); }
    setSaving(false);
  };

  const deleteProd = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await fetch(`${API}/products/${id}`, { 
      method:"DELETE",
      headers: { "Authorization": `Bearer ${auth.token}` } 
    });
    loadAll();
    showToast("Product deleted", "success");
  };

  const updateStatus = async (id, status) => {
    try {
      const r = await fetch(`${API}/orders/${encodeURIComponent(id)}/status`, { 
        method:"PUT", 
        headers:{
          "Content-Type":"application/json",
          "Authorization": `Bearer ${auth.token}`
        }, 
        body:JSON.stringify({status}) 
      });
      if (!r.ok) { showToast("Failed to update status", "error"); return; }
      showToast(`Order marked as ${status}`, "success");
    } catch(e) { showToast("Cannot connect to backend!", "error"); }
  };

  const claimOrder = async (id) => {
    try {
      const r = await fetch(`${API}/orders/${encodeURIComponent(id)}/claim`, { 
        method:"PUT", 
        headers:{
          "Content-Type":"application/json",
          "Authorization": `Bearer ${auth.token}`
        }, 
        body:JSON.stringify({ adminId: auth.id, adminName: auth.name }) 
      });
      const d = await r.json();
      if (!r.ok) { showToast(d.error, "error"); return; }
      await loadAll();
      showToast("Order accepted!", "success");
    } catch(e) { showToast("Cannot connect to backend!", "error"); }
  };

  const unclaimOrder = async (id) => {
    try {
      await fetch(`${API}/orders/${encodeURIComponent(id)}/unclaim`, { 
        method:"PUT", 
        headers:{
          "Content-Type":"application/json",
          "Authorization": `Bearer ${auth.token}`
        }, 
        body:JSON.stringify({}) 
      });
      await loadAll();
      showToast("Order released", "success");
    } catch(e) { showToast("Cannot connect to backend!", "error"); }
  };

  const handleDragStart = (e, orderId) => {
    e.dataTransfer.setData("orderId", orderId);
  };

  const handleDragOver = (e, columnStatus) => {
    e.preventDefault(); 
    setDragOverCol(columnStatus);
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    setDragOverCol(null);
    const orderId = e.dataTransfer.getData("orderId");
    if (!orderId) return;

    const order = orders.find(o => o.id === orderId);
    if (order && order.status !== newStatus) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      await updateStatus(orderId, newStatus);
    }
  };

  const openEdit = (p) => { setEditP(p); setNewP({name:p.name,category:p.category,price:p.price,qty:p.qty,inStock:p.inStock,desc:p.desc||""}); setImgFiles([]); setImgPrevs([]); setKeepImgs(p.images||[]); setModal("prod"); };
  const openAdd = () => { setEditP(null); setNewP({name:"",category:"Groceries",price:"",qty:"",inStock:true,desc:""}); setImgFiles([]); setImgPrevs([]); setKeepImgs([]); setModal("prod"); };
  
  const activeOrders = orders.filter(o=>o.status!=="Delivered"&&o.status!=="Cancelled");
  const newOrderCount = activeOrders.filter(o=>o.isNew).length;
  const filtered = products.filter(p=>p.name.toLowerCase().includes(search.toLowerCase()));
  const revenue = orders.filter(o=>o.status==="Delivered").reduce((s,o)=>s+o.total,0);
  const lowStock = products.filter(p=>p.qty<=5);

  // --- PAGINATION LOGIC FOR ALL ORDERS ---
  const totalOrderPages = Math.ceil(orders.length / ORDERS_PER_PAGE) || 1;
  const paginatedOrders = [...orders].reverse().slice((orderPage - 1) * ORDERS_PER_PAGE, orderPage * ORDERS_PER_PAGE);

  // --- 7-DAY REVENUE CHART LOGIC ---
  const getLast7DaysData = () => {
    const data = [];
    let maxRev = 100; // default to prevent division by zero

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = d.toISOString().split('T')[0]; // YYYY-MM-DD
      const shortDate = `${d.getDate()}/${d.getMonth()+1}`;

      // Sum revenue for this specific date
      const dayRev = orders
        .filter(o => o.status === "Delivered" && o.createdAt.startsWith(dateString))
        .reduce((sum, o) => sum + o.total, 0);

      if (dayRev > maxRev) maxRev = dayRev;
      data.push({ date: shortDate, rev: dayRev });
    }
    return { data, maxRev };
  };
  const chartData = getLast7DaysData();


  const ImgSection = () => (
    <div>
      {(keepImgs.length+imgPrevs.length)>0&&<div className="igrid">
        {keepImgs.map((u,i)=><div key={"k"+i} className="iitem"><img src={u} alt=""/><button className="irem" onClick={()=>setKeepImgs(p=>p.filter((_,j)=>j!==i))}>✕</button></div>)}
        {imgPrevs.map((u,i)=><div key={"n"+i} className="iitem"><img src={u} alt=""/><button className="irem" onClick={()=>{setImgFiles(p=>p.filter((_,j)=>j!==i));setImgPrevs(p=>p.filter((_,j)=>j!==i));}}>✕</button></div>)}
      </div>}
      {(keepImgs.length+imgPrevs.length)<5&&<div className="uzone"><input type="file" accept="image/*" multiple onChange={onImgs}/><div style={{fontSize:32,marginBottom:6}}>📸</div><div style={{fontSize:13,color:"var(--m)"}}>Click to upload images (max 5)</div></div>}
    </div>
  );

  if (!auth) return (
    <>
      <style>{CSS}</style>
      <div className="lwrap">
        <div className="lbox">
          <div style={{fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:32,marginBottom:8}}>In<span style={{color:"var(--a)"}}>Minutes</span></div>
          <div className="slogo-b" style={{marginBottom:32}}>SECURE ADMIN PORTAL</div>
          <div className="fg"><label className="fl">Email</label><input className="fi" type="email" placeholder="your-email@inminutes.in" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doLogin()}/></div>
          <div className="fg"><label className="fl">Password</label><input className="fi" type="password" placeholder="Your password" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doLogin()}/></div>
          {loginErr&&<div className="err">{loginErr}</div>}
          <button className="pbtn" style={{width:"100%",padding:14,fontSize:15,borderRadius:12,fontFamily:"Syne,sans-serif",fontWeight:800,marginBottom:16,marginTop:8}} onClick={doLogin}>Access Portal →</button>
          <div style={{textAlign:"center",fontSize:12,color:"var(--m)"}}>Your login was provided by the Head Admin</div>
        </div>
      </div>
      {/* RENDER TOASTS */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}`}>
            <span>{t.type === 'success' ? '✅' : '⚠️'}</span> {t.msg}
          </div>
        ))}
      </div>
    </>
  );

  const goToOrders = async () => {
    setPage("orders");
    if (notification) {
      await markSeen(notification.id);
    }
  };

  const NAVS = [
    {id:"dashboard",icon:"📊",label:"Dashboard"},
    {id:"orders",icon:"📋",label:"Kanban Board",badge:newOrderCount},
    {id:"products",icon:"📦",label:"Products"},
    {id:"inventory",icon:"🗂️",label:"Inventory"},
    {id:"allorders",icon:"📝",label:"Order History"},
  ];

  const KANBAN_COLS = [
    { id: "Confirmed", label: "New / Confirmed", icon: "🔴" },
    { id: "Packed", label: "Packing", icon: "📦" },
    { id: "Out for Delivery", label: "Out for Delivery", icon: "🚚" },
    { id: "Delivered", label: "Delivered", icon: "🎉" }
  ];

  return (
    <>
      <style>{CSS}</style>
      <div className="wrap">
        
        {/* TOAST SYSTEM */}
        <div className="toast-container">
          {toasts.map(t => (
            <div key={t.id} className={`toast ${t.type}`}>
              <span>{t.type === 'success' ? '✅' : '⚠️'}</span> {t.msg}
            </div>
          ))}
        </div>

        {/* 📱 MOBILE OVERLAY */}
        <div className={`mob-ov ${mobMenu ? "open" : ""}`} onClick={() => setMobMenu(false)}></div>

        {notification&&<div className="notif-banner">
          <button className="notif-close" onClick={()=>markSeen(notification.id)} title="Mark as read">✕</button>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
            <span className="new-dot"/>
            <strong style={{fontSize:15,color:"var(--a)",fontFamily:"Syne,sans-serif"}}>New Order Received!</strong>
          </div>
          <div style={{fontSize:14,fontWeight:700,marginBottom:6}}>{notification.id}</div>
          <div style={{fontSize:12,color:"var(--m)",marginBottom:4}}>👤 {notification.userName} · 📞 {notification.userPhone}</div>
          <div style={{fontSize:12,color:"var(--m)",marginBottom:4}}>📍 {notification.address?.line1}, {notification.address?.city}</div>
          <div style={{fontSize:12,color:"var(--m)",marginBottom:12}}>🛒 {notification.items?.map(i=>i.name+" x"+i.quantity).join(", ")}</div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,paddingTop:12,borderTop:"1px solid var(--b)"}}>
            <strong style={{color:"var(--g)",fontFamily:"Syne,sans-serif",fontSize:16}}>₹{notification.total}</strong>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>markSeen(notification.id)} style={{background:"var(--s2)",color:"#F5F5F5",border:"1px solid var(--b)",borderRadius:10,padding:"8px 14px",fontSize:12,fontWeight:600,cursor:"pointer",transition:"background 0.2s"}} onMouseOver={e=>e.target.style.background='rgba(255,255,255,0.05)'} onMouseOut={e=>e.target.style.background='var(--s2)'}>✓ Dismiss</button>
              <button onClick={()=>{markSeen(notification.id);setPage("orders");}} style={{background:"var(--a)",color:"#121212",border:"none",borderRadius:10,padding:"8px 16px",fontSize:13,fontWeight:800,cursor:"pointer",transition:"opacity 0.2s"}} onMouseOver={e=>e.target.style.opacity='0.9'} onMouseOut={e=>e.target.style.opacity='1'}>View Board →</button>
            </div>
          </div>
        </div>}

        <div className={`side ${mobMenu ? "open" : ""}`}>
          <div className="slogo">
            <div className="slogo-t">In<span style={{color:"var(--a)"}}>Minutes</span></div>
            <div className="slogo-b">ADMIN PANEL</div>
          </div>
          <div className="snav">
            {NAVS.map(n=><div key={n.id} className={`ni${page===n.id?" act":""}`} onClick={()=>{
                n.id==="orders"?goToOrders():setPage(n.id);
                setMobMenu(false); 
              }}>
              <span style={{fontSize:16,width:24,textAlign:"center"}}>{n.icon}</span>{n.label}
              {n.badge>0&&<span className="nbdg">{n.badge}</span>}
            </div>)}
          </div>
          <div className="sbot">
            <div className="suser">
              <div className="av">{auth.name[0]}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{auth.name}</div>
                <div style={{fontSize:11,color:"var(--a2)",cursor:"pointer",fontWeight:600,marginTop:2}} onClick={()=>{localStorage.removeItem("inminutes_admin");setAuth(null);}}>Logout</div>
              </div>
            </div>
          </div>
        </div>

        <div className="main">
          <div className="topbar">
            <div style={{display:"flex", alignItems:"center"}}>
              <button className="ham" onClick={() => setMobMenu(true)}>☰</button>
              <div className="ttl">{{dashboard:"Dashboard",orders:"Live Kanban Board",products:"Products",inventory:"Inventory",allorders:"Order History"}[page]}</div>
            </div>
            
            <div style={{display:"flex",gap:12,alignItems:"center"}}>
              {page==="products"&&<><input placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} style={{background:"var(--bg)",border:"1px solid var(--b)",borderRadius:10,padding:"8px 16px",color:"#F5F5F5",fontSize:13,outline:"none",width:200,fontFamily:"DM Sans,sans-serif", display:"none"}} className="m-hide"/><button className="pbtn" onClick={openAdd}>+ Add</button></>}
              <button onClick={handleManualRefresh} disabled={isRefreshing} style={{background:"var(--s2)",border:"1px solid var(--b)",borderRadius:10,padding:"8px 14px",color:isRefreshing?"var(--a)":"var(--m)",cursor:isRefreshing?"not-allowed":"pointer",fontSize:14,transition:"all 0.2s"}} onMouseOver={e=>e.target.style.background='rgba(255,255,255,0.05)'} onMouseOut={e=>e.target.style.background='var(--s2)'}>
                <span className={`spin-icon ${isRefreshing ? "spinning" : ""}`}>🔄</span> {isRefreshing ? "Syncing..." : "Refresh"}
              </button>
            </div>
          </div>
          
          <div className="con">
            {page==="dashboard"&&<>
              <div className="sgrid">
                <div className="sc t"><div className="slbl">Products</div><div className="sval">{products.length}</div><div className="sico">📦</div></div>
                <div className="sc g"><div className="slbl">Orders</div><div className="sval">{orders.length}</div><div className="sico">🚀</div></div>
                <div className="sc y"><div className="slbl">Revenue</div><div className="sval">₹{revenue}</div><div className="sico">💰</div></div>
                <div className="sc r"><div className="slbl">Low Stock</div><div className="sval">{lowStock.length}</div><div className="sico">⚠️</div></div>
              </div>

              {/* 📊 NEW 7-DAY REVENUE CHART */}
              <div className="card" style={{padding: "24px"}}>
                <div className="ct" style={{marginBottom: "20px"}}>Revenue (Last 7 Days)</div>
                <div style={{display: 'flex', alignItems: 'flex-end', height: '160px', gap: '12px', paddingBottom: '10px', borderBottom: '1px solid var(--b)'}}>
                  {chartData.data.map(d => (
                    <div key={d.date} className="chart-bar">
                      <div className="chart-val">₹{d.rev}</div>
                      <div className="chart-fill" style={{height: `${Math.max((d.rev / chartData.maxRev) * 120, 4)}px`, opacity: d.rev === 0 ? 0.3 : 1}}></div>
                      <div className="chart-date">{d.date}</div>
                    </div>
                  ))}
                </div>
              </div>

              {lowStock.map(p=><div key={p.id} style={{display:"flex",alignItems:"center",gap:12,background:"rgba(245,158,11,0.05)",border:"1px solid rgba(245,158,11,0.2)",borderRadius:12,padding:"14px 20px",marginBottom:12}}>
                <span style={{fontSize:18}}>⚠️</span><span style={{fontSize:14,fontWeight:600}}><span style={{color:"var(--y)"}}>{p.name}</span> — only <span style={{color:"var(--y)",fontWeight:800}}>{p.qty}</span> left</span>
                <button className="abtn e" style={{marginLeft:"auto",background:"rgba(249,115,22,0.1)",color:"var(--a)",borderColor:"rgba(249,115,22,0.3)"}} onClick={()=>openEdit(p)}>Restock</button>
              </div>)}
            </>}

            {page==="orders"&&<div className="kanban-wrap">
              {KANBAN_COLS.map(col => (
                <div 
                  key={col.id} 
                  className={`k-col ${dragOverCol === col.id ? "drag-over" : ""}`}
                  onDragOver={(e) => handleDragOver(e, col.id)}
                  onDragLeave={() => setDragOverCol(null)}
                  onDrop={(e) => handleDrop(e, col.id)}
                >
                  <div className="k-head">
                    <div className="k-title">{col.icon} {col.label}</div>
                    <span className="badge" style={{background:"var(--s2)", color:"var(--m)"}}>{orders.filter(o=>o.status===col.id).length}</span>
                  </div>
                  <div className="k-body">
                    {orders.filter(o=>o.status===col.id).map(o => (
                      <div 
                        key={o.id} 
                        className={`k-card ${o.isNew ? "new" : ""}`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, o.id)}
                      >
                        {o.isNew && <div style={{position:"absolute", top:10, right:10, width:8, height:8, borderRadius:"50%", background:"var(--a2)"}} />}
                        <div className="k-cid">{o.id}</div>
                        <div className="k-user">{o.userName}</div>
                        <div className="k-det">{o.address?.line1}, {o.address?.city}</div>
                        
                        <div style={{background:"rgba(255,255,255,0.03)", padding:"8px", borderRadius:"8px", marginBottom:"8px"}}>
                          {o.items.map((i, idx) => (
                            <div key={idx} style={{fontSize:11, color:"var(--m)", display:"flex", justifyContent:"space-between", marginBottom:2}}>
                              <span>{i.name.length > 20 ? i.name.substring(0, 20) + "..." : i.name}</span>
                              <span>x{i.quantity}</span>
                            </div>
                          ))}
                        </div>

                        {!o.claimedBy ? (
                          <button onClick={()=>claimOrder(o.id)} style={{width:"100%", background:"rgba(249,115,22,0.15)", color:"var(--a)", border:"1px solid rgba(249,115,22,0.3)", borderRadius:"8px", padding:"6px", fontSize:11, fontWeight:700, cursor:"pointer", marginBottom:8}}>
                            Assign to me
                          </button>
                        ) : o.claimedBy === auth.id ? (
                          <div style={{fontSize:10, color:"var(--g)", marginBottom:8, display:"flex", justifyContent:"space-between"}}>
                            <span>✅ Claimed by you</span>
                            <span style={{color:"var(--a2)", cursor:"pointer"}} onClick={()=>unclaimOrder(o.id)}>Release</span>
                          </div>
                        ) : (
                          <div style={{fontSize:10, color:"var(--y)", marginBottom:8}}>
                            🔒 Claimed by {o.claimedByName}
                          </div>
                        )}

                        <div className="k-foot">
                          <span style={{fontSize:10, color:"var(--m)", background:"var(--bg)", padding:"2px 6px", borderRadius:"4px", border:"1px solid var(--b)"}}>{o.paymentMethod}</span>
                          <span className="k-tot">₹{o.total}</span>
                        </div>
                      </div>
                    ))}
                    {orders.filter(o=>o.status===col.id).length === 0 && (
                      <div style={{textAlign:"center", padding:"40px 0", color:"var(--b)", fontSize:12, fontStyle:"italic"}}>Drop orders here</div>
                    )}
                  </div>
                </div>
              ))}
            </div>}

            {page==="products"&&<div className="card">
              <div className="ch"><div className="ct">Products ({filtered.length})</div></div>
              {filtered.length===0?<div className="ld">{products.length===0?"No products yet":"No results"}</div>:
              <table><thead><tr><th>Product</th><th>Photos</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>{filtered.map(p=><tr key={p.id}>
                  <td><div className="pc">{p.images?.[0]?<img src={p.images[0]} className="pth" alt=""/>:<div className="pph">📦</div>}<div><div style={{fontWeight:600}}>{p.name}</div><div style={{fontSize:11,color:"var(--m)"}}>{p.desc?.slice(0,25)||"—"}</div></div></div></td>
                  <td style={{fontSize:12,color:"var(--m)"}}>{(p.images||[]).length} 📷</td>
                  <td style={{fontSize:12}}>{p.category}</td>
                  <td style={{fontFamily:"Syne,sans-serif",fontWeight:700}}>₹{p.price}</td>
                  <td style={{fontWeight:700,color:p.qty<=5?"var(--a2)":p.qty<=15?"var(--y)":"var(--g)"}}>{p.qty} units</td>
                  <td><span className={`badge ${p.inStock?"bg":"br"}`}>{p.inStock?"In Stock":"Out"}</span></td>
                  <td><button className="abtn e" onClick={()=>openEdit(p)}>Edit</button><button className="abtn d" onClick={()=>deleteProd(p.id)}>Delete</button></td>
                </tr>)}</tbody>
              </table>}
            </div>}

            {page==="inventory"&&<div className="card">
              <div className="ch">
                <div className="ct">Stock Levels</div>
                <button onClick={async()=>{
                  await fetch(`${API}/ping`);
                  showToast("Inventory alert email dispatched!", "success");
                }} style={{background:"var(--a)",color:"#121212",border:"none",borderRadius:10,padding:"8px 16px",fontSize:13,fontWeight:800,cursor:"pointer",transition:"opacity 0.2s"}} onMouseOver={e=>e.target.style.opacity='0.9'} onMouseOut={e=>e.target.style.opacity='1'}>⚠️ Send Alert Email</button>
              </div>
              {products.filter(p=>p.qty<=5).length>0&&<div style={{background:"rgba(245,158,11,0.1)",border:"1px solid rgba(245,158,11,0.3)",borderRadius:12,padding:"16px 20px",margin:"16px",display:"flex",alignItems:"center",gap:14}}>
                <span style={{fontSize:24}}>⚠️</span>
                <div>
                  <div style={{fontWeight:800,fontSize:14,color:"var(--y)"}}>{products.filter(p=>p.qty===0).length} out of stock, {products.filter(p=>p.qty>0&&p.qty<=5).length} low stock</div>
                  <div style={{fontSize:12,color:"var(--m)",marginTop:4}}>Automatic alert email sent to all admins every 6 hours</div>
                </div>
              </div>}
              {products.length===0?<div className="ld">No products</div>:
              <table><thead><tr><th>Product</th><th>Stock Bar</th><th>Units</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>{[...products].sort((a,b)=>a.qty-b.qty).map(p=><tr key={p.id}>
                  <td style={{fontWeight:600}}>{p.name}</td>
                  <td style={{width:150}}><div style={{height:8,background:"var(--bg)",borderRadius:4,overflow:"hidden",border:"1px solid var(--b)"}}><div style={{width:`${Math.min(100,(p.qty/50)*100)}%`,height:"100%",background:p.qty<=5?"var(--a2)":p.qty<=15?"var(--y)":"var(--g)",borderRadius:4}}></div></div></td>
                  <td style={{fontWeight:800,color:p.qty<=5?"var(--a2)":p.qty<=15?"var(--y)":"var(--g)"}}>{p.qty}</td>
                  <td><span className={`badge ${p.qty===0?"br":p.qty<=5?"by":"bg"}`}>{p.qty===0?"Out":p.qty<=5?"Low":"Good"}</span></td>
                  <td><button className="abtn e" onClick={()=>openEdit(p)}>Update</button></td>
                </tr>)}</tbody>
              </table>}
            </div>}

            {page==="allorders"&&<div className="card">
              <div className="ch"><div className="ct">All Orders History ({orders.length})</div></div>
              {orders.length===0?<div className="ld">No orders yet</div>:
              <>
                <table><thead><tr><th>Order ID</th><th>Date</th><th>Customer</th><th>Phone</th><th>Address</th><th>Total</th><th>Status</th></tr></thead>
                  <tbody>{paginatedOrders.map(o=><tr key={o.id}>
                    <td style={{fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:13}}>{o.id}</td>
                    <td style={{fontSize:12,color:"var(--m)"}}>{new Date(o.createdAt).toLocaleDateString("en-IN")}</td>
                    <td><div style={{fontWeight:600,fontSize:13}}>{o.userName}</div></td>
                    <td style={{fontSize:12}}>{o.userPhone}</td>
                    <td style={{fontSize:11,color:"var(--m)",maxWidth:160}}>{o.address?.line1}, {o.address?.city}</td>
                    <td style={{fontWeight:800}}>₹{o.total}</td>
                    <td>
                      <select className="osel" value={o.status} onChange={async e=>{
                        const newStatus = e.target.value;
                        await fetch(`${API}/orders/${encodeURIComponent(o.id)}/status`, {
                          method:"PUT",
                          headers:{"Content-Type":"application/json", "Authorization": `Bearer ${auth.token}`},
                          body:JSON.stringify({status:newStatus})
                        });
                        showToast(`Status updated to ${newStatus}`);
                      }}>
                        <option>Confirmed</option>
                        <option>Packed</option>
                        <option>Out for Delivery</option>
                        <option>Delivered</option>
                        <option>Cancelled</option>
                      </select>
                    </td>
                  </tr>)}</tbody>
                </table>
                
                {/* --- PAGINATION CONTROLS --- */}
                {totalOrderPages > 1 && (
                  <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 20px", borderTop:"1px solid var(--b)"}}>
                    <button 
                      onClick={() => setOrderPage(p => Math.max(1, p - 1))}
                      disabled={orderPage === 1}
                      style={{background:"var(--s2)", color: orderPage === 1 ? "var(--m)" : "#fff", border:"1px solid var(--b)", borderRadius:8, padding:"6px 16px", cursor: orderPage === 1 ? "not-allowed" : "pointer"}}
                    >
                      ← Previous
                    </button>
                    <span style={{fontSize:13, color:"var(--m)", fontWeight:700}}>Page {orderPage} of {totalOrderPages}</span>
                    <button 
                      onClick={() => setOrderPage(p => Math.min(totalOrderPages, p + 1))}
                      disabled={orderPage === totalOrderPages}
                      style={{background:"var(--s2)", color: orderPage === totalOrderPages ? "var(--m)" : "#fff", border:"1px solid var(--b)", borderRadius:8, padding:"6px 16px", cursor: orderPage === totalOrderPages ? "not-allowed" : "pointer"}}
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
              }
            </div>}
          </div>
        </div>

        {modal==="prod"&&<div className="ov" onClick={()=>setModal(null)}><div className="modal" onClick={e=>e.stopPropagation()}>
          <div className="mt">{editP?"✏️ Edit Product":"➕ Add Product"}</div>
          <div className="fg"><label className="fl">Images (max 5)</label><ImgSection/></div>
          <div className="fg"><label className="fl">Product Name</label><input className="fi" placeholder="e.g. Fresh Tomatoes 500g" value={newP.name} onChange={e=>setNewP(p=>({...p,name:e.target.value}))}/></div>
          <div className="fg"><label className="fl">Description</label><input className="fi" placeholder="Brief product description..." value={newP.desc} onChange={e=>setNewP(p=>({...p,desc:e.target.value}))}/></div>
          <div className="frow">
            <div className="fg"><label className="fl">Price (₹)</label><input className="fi" type="number" value={newP.price} onChange={e=>setNewP(p=>({...p,price:e.target.value}))}/></div>
            <div className="fg"><label className="fl">Quantity</label><input className="fi" type="number" value={newP.qty} onChange={e=>setNewP(p=>({...p,qty:e.target.value}))}/></div>
          </div>
          <div className="frow">
            <div className="fg"><label className="fl">Category</label><select className="fsel" value={newP.category} onChange={e=>setNewP(p=>({...p,category:e.target.value}))}>{CATS.map(c=><option key={c}>{c}</option>)}</select></div>
            <div className="fg"><label className="fl">Status</label><select className="fsel" value={newP.inStock?"y":"n"} onChange={e=>setNewP(p=>({...p,inStock:e.target.value==="y"}))}><option value="y">In Stock</option><option value="n">Out of Stock</option></select></div>
          </div>
          <div className="mbtns">
            <button style={{background:"var(--s2)",color:"#F5F5F5",border:"1px solid var(--b)"}} onClick={()=>setModal(null)}>Cancel</button>
            <button style={{background:"var(--a)",color:"#121212",opacity:saving?.6:1}} onClick={saveProd} disabled={saving}>{saving?"Saving...":editP?"Save Changes":"Add Product"}</button>
          </div>
        </div></div>}
      </div>
    </>
  );
}