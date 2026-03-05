import { useState, useEffect, useRef } from "react";
const API = "https://inminutes-backend.onrender.com";
const CATS = ["Groceries","Beauty","Food","Beverages","Snacks","Dairy","Bakery","Other"];
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'DM Sans',sans-serif;background:#080B14;color:#E8EDF8}
:root{--bg:#080B14;--s:#0E1220;--s2:#151C2E;--a:#4ECDC4;--a2:#FF6B6B;--g:#00D4AA;--y:#FFB547;--m:#7B85A0;--b:rgba(255,255,255,0.06)}
.wrap{display:flex;min-height:100vh}
.side{width:230px;background:var(--s);border-right:1px solid var(--b);display:flex;flex-direction:column;position:fixed;top:0;left:0;bottom:0;z-index:50}
.slogo{padding:22px 18px;border-bottom:1px solid var(--b)}
.slogo-t{font-family:'Syne',sans-serif;font-weight:800;font-size:18px;color:#E8EDF8}
.slogo-t span{color:var(--a)}
.slogo-b{display:inline-flex;margin-top:4px;background:rgba(78,205,196,.1);border:1px solid rgba(78,205,196,.2);border-radius:20px;padding:2px 10px;font-size:10px;font-weight:700;color:var(--a);letter-spacing:.5px}
.snav{flex:1;padding:12px 10px;overflow-y:auto}
.ni{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:12px;cursor:pointer;color:var(--m);font-size:14px;margin-bottom:2px;transition:all .2s}
.ni:hover{background:rgba(255,255,255,.04);color:#E8EDF8}
.ni.act{background:rgba(78,205,196,.1);color:var(--a);font-weight:600}
.nbdg{margin-left:auto;background:var(--a2);color:#fff;font-size:10px;font-weight:700;padding:2px 7px;border-radius:10px;animation:blink2 1s ease 1}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.6}} @keyframes blink2{0%{opacity:1}25%{opacity:.2}50%{opacity:1}75%{opacity:.2}100%{opacity:1}}
.sbot{padding:14px;border-top:1px solid var(--b)}
.suser{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:12px;background:var(--s2)}
.av{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,var(--a),#2980B9);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;font-family:'Syne',sans-serif;flex-shrink:0}
.main{margin-left:230px;flex:1}
.topbar{background:var(--s);border-bottom:1px solid var(--b);padding:0 24px;height:60px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:40}
.ttl{font-family:'Syne',sans-serif;font-size:18px;font-weight:700}
.con{padding:24px}
.sgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:24px}
.sc{background:var(--s);border:1px solid var(--b);border-radius:16px;padding:18px;position:relative;overflow:hidden}
.sc::before{content:'';position:absolute;top:-15px;right:-15px;width:80px;height:80px;border-radius:50%;filter:blur(28px);opacity:.2}
.sc.t::before{background:var(--a)}.sc.g::before{background:var(--g)}.sc.y::before{background:var(--y)}.sc.r::before{background:var(--a2)}
.slbl{font-size:11px;color:var(--m);font-weight:600;margin-bottom:8px;text-transform:uppercase;letter-spacing:.5px}
.sval{font-family:'Syne',sans-serif;font-size:28px;font-weight:800}
.sc.t .sval{color:var(--a)}.sc.g .sval{color:var(--g)}.sc.y .sval{color:var(--y)}.sc.r .sval{color:var(--a2)}
.sico{position:absolute;bottom:12px;right:14px;font-size:26px;opacity:.3}
.card{background:var(--s);border:1px solid var(--b);border-radius:16px;overflow:hidden;margin-bottom:18px}
.ch{display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid var(--b)}
.ct{font-family:'Syne',sans-serif;font-size:15px;font-weight:700}
table{width:100%;border-collapse:collapse}
thead{background:var(--s2)}
th{text-align:left;padding:10px 18px;font-size:11px;font-weight:700;color:var(--m);text-transform:uppercase;letter-spacing:.8px;white-space:nowrap}
td{padding:12px 18px;border-bottom:1px solid var(--b);font-size:13px;vertical-align:middle}
tr:last-child td{border-bottom:none}
tr:hover td{background:rgba(255,255,255,.012)}
.badge{display:inline-flex;font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px}
.bg{background:rgba(0,212,170,.1);color:var(--g);border:1px solid rgba(0,212,170,.2)}
.br{background:rgba(255,107,107,.1);color:var(--a2);border:1px solid rgba(255,107,107,.2)}
.bt{background:rgba(78,205,196,.1);color:var(--a);border:1px solid rgba(78,205,196,.2)}
.by{background:rgba(255,181,71,.1);color:var(--y);border:1px solid rgba(255,181,71,.2)}
.abtn{padding:5px 10px;border-radius:7px;border:1px solid var(--b);background:var(--s2);color:var(--m);font-size:11px;cursor:pointer;font-weight:600;margin-right:4px;transition:all .2s;font-family:'DM Sans',sans-serif}
.abtn.e:hover{color:var(--a);border-color:var(--a)}.abtn.d:hover{color:var(--a2);border-color:var(--a2)}
.pbtn{background:var(--a);color:#1a1a2e;border:none;border-radius:9px;padding:9px 18px;font-size:13px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif}
.ov{position:fixed;inset:0;background:rgba(0,0,0,.82);z-index:200;display:flex;align-items:center;justify-content:center}
.modal{background:var(--s);border:1px solid var(--b);border-radius:20px;padding:24px;width:480px;max-height:92vh;overflow-y:auto}
.mt{font-family:'Syne',sans-serif;font-size:18px;font-weight:800;margin-bottom:20px}
.fg{margin-bottom:14px}
.fl{font-size:11px;font-weight:700;color:var(--m);text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px;display:block}
.fi{width:100%;background:var(--s2);border:1px solid var(--b);border-radius:10px;padding:10px 14px;color:#E8EDF8;font-size:14px;font-family:'DM Sans',sans-serif;outline:none}
.fi:focus{border-color:var(--a)}
.fsel{width:100%;background:var(--s2);border:1px solid var(--b);border-radius:10px;padding:10px 14px;color:#E8EDF8;font-size:14px;font-family:'DM Sans',sans-serif;outline:none;cursor:pointer}
.frow{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.uzone{border:2px dashed rgba(255,255,255,.1);border-radius:12px;padding:18px;text-align:center;position:relative;cursor:pointer;background:var(--s2);transition:all .2s}
.uzone:hover{border-color:var(--a)}
.uzone input{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%}
.igrid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:10px}
.iitem{position:relative;border-radius:8px;overflow:hidden;aspect-ratio:1}
.iitem img{width:100%;height:100%;object-fit:cover}
.irem{position:absolute;top:3px;right:3px;width:20px;height:20px;border-radius:50%;background:rgba(200,0,0,.9);border:none;color:#fff;font-size:10px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-weight:700}
.mbtns{display:flex;gap:10px;margin-top:20px}
.mbtns button{flex:1;padding:12px;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;font-family:'Syne',sans-serif;border:none}
.lwrap{min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--bg)}
.lbox{background:var(--s);border:1px solid var(--b);border-radius:24px;padding:40px;width:400px}
.ld{display:flex;align-items:center;justify-content:center;padding:60px;color:var(--m);font-size:14px}
.osel{background:var(--s2);border:1px solid var(--b);border-radius:8px;padding:5px 10px;color:#E8EDF8;font-size:12px;cursor:pointer;outline:none;font-family:'DM Sans',sans-serif}
.err{background:rgba(255,107,107,.1);border:1px solid rgba(255,107,107,.2);border-radius:10px;padding:10px 14px;font-size:13px;color:var(--a2);margin-bottom:14px}
.notif-banner{position:fixed;top:20px;right:20px;z-index:999;background:var(--s);border:1px solid rgba(78,205,196,.3);border-radius:16px;padding:16px 20px;max-width:360px;box-shadow:0 8px 40px rgba(0,0,0,.5);animation:slideIn .3s ease,blink2 1s ease 0.3s 1}
@keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
.notif-close{position:absolute;top:10px;right:12px;background:none;border:none;color:var(--m);font-size:16px;cursor:pointer}
.new-dot{width:8px;height:8px;border-radius:50%;background:var(--a2);display:inline-block;margin-right:6px;animation:pulse 1s infinite}
.pc{display:flex;align-items:center;gap:12px}
.pth{width:44px;height:44px;border-radius:10px;object-fit:cover;flex-shrink:0}
.pph{width:44px;height:44px;border-radius:10px;background:var(--s2);display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0}
`;

export default function AdminApp() {
  const [auth, setAuth] = useState(null);
  const [page, setPage] = useState("dashboard");
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
  const [imgFiles, setImgFiles] = useState([]);
  const [imgPrevs, setImgPrevs] = useState([]);
  const [keepImgs, setKeepImgs] = useState([]);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);
  const [newP, setNewP] = useState({ name:"", category:"Groceries", price:"", qty:"", inStock:true, desc:"" });
  const prevOrderCount = useRef(0);
  const audioRef = useRef(null);
  const notifiedIds = useRef(new Set());

  const requestNotifPermission = async () => {
    if ("Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission();
    }
  };

  useEffect(() => { requestNotifPermission(); }, []);

  const playSound = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      // Play 3 beeps
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
        badge: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🛒</text></svg>",
        requireInteraction: true,
        tag: order.id
      });
      n.onclick = () => { window.focus(); n.close(); };
    }
  };

  const loadAll = async () => {
    try {
      const [pr, or, st] = await Promise.all([
        fetch(`${API}/products`).then(r=>r.json()),
        fetch(`${API}/orders`).then(r=>r.json()),
        fetch(`${API}/stats`).then(r=>r.json()),
      ]);
      setProducts(pr); setStats(st);
      // Check for NEW orders - only notify once per order ID
      const newOrders = or.filter(o => o.isNew);
      const unnotified = newOrders.filter(o => !notifiedIds.current.has(o.id));
      if (unnotified.length > 0) {
        const newest = unnotified[unnotified.length - 1];
        notifiedIds.current.add(newest.id);
        setNotification(newest);
        playSound();
        sendBrowserNotification(newest);
        // Notification stays until admin manually dismisses it
      }
      prevOrderCount.current = or.length;
      setOrders(or);
    } catch(e) {}
  };

  useEffect(() => { if (auth) loadAll(); }, [auth]);
  useEffect(() => { if (!auth) return; const t = setInterval(loadAll, 4000); return () => clearInterval(t); }, [auth]);

  const doLogin = async () => {
    try {
      const r = await fetch(`${API}/admins/login`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({email, password:pass}) });
      const d = await r.json();
      if (!r.ok) { setLoginErr(d.error || "Invalid credentials"); return; }
      setAuth(d);
    } catch(e) { setLoginErr("Cannot connect to backend!"); }
  };

  const markSeen = async (orderId) => {
    await fetch(`${API}/orders/${orderId}/seen`, { method:"PUT" });
    setNotification(null);
    loadAll();
  };

  const onImgs = (e) => {
    const files = Array.from(e.target.files);
    if (imgFiles.length + keepImgs.length + files.length > 5) { alert("Max 5 images"); return; }
    setImgFiles(p=>[...p,...files]);
    setImgPrevs(p=>[...p,...files.map(f=>URL.createObjectURL(f))]);
  };

  const saveProd = async () => {
    if (!newP.name||!newP.price||!newP.qty) { alert("Fill Name, Price, Qty"); return; }
    setSaving(true);
    const fd = new FormData();
    fd.append("data", JSON.stringify({ ...newP, price:Number(newP.price), qty:Number(newP.qty), keepImages:keepImgs }));
    imgFiles.forEach(f=>fd.append("images",f));
    try {
      await fetch(editP ? `${API}/products/${editP.id}` : `${API}/products`, { method: editP ? "PUT" : "POST", body:fd });
      await loadAll();
      setModal(null); setNewP({name:"",category:"Groceries",price:"",qty:"",inStock:true,desc:""});
      setImgFiles([]); setImgPrevs([]); setKeepImgs([]); setEditP(null);
    } catch(e) { alert("Error!"); }
    setSaving(false);
  };

  const deleteProd = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await fetch(`${API}/products/${id}`, { method:"DELETE" });
    loadAll();
  };

  const updateStatus = async (id, status) => {
    try {
      const r = await fetch(`${API}/orders/${id}/status`, { method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify({status}) });
      if (!r.ok) { alert("Failed to update status. Is backend running?"); return; }
      await loadAll();
    } catch(e) { alert("Cannot connect to backend!"); }
  };

  const openEdit = (p) => { setEditP(p); setNewP({name:p.name,category:p.category,price:p.price,qty:p.qty,inStock:p.inStock,desc:p.desc||""}); setImgFiles([]); setImgPrevs([]); setKeepImgs(p.images||[]); setModal("prod"); };
  const openAdd = () => { setEditP(null); setNewP({name:"",category:"Groceries",price:"",qty:"",inStock:true,desc:""}); setImgFiles([]); setImgPrevs([]); setKeepImgs([]); setModal("prod"); };
  const newOrderCount = orders.filter(o=>o.isNew).length;
  const filtered = products.filter(p=>p.name.toLowerCase().includes(search.toLowerCase()));
  const revenue = orders.filter(o=>o.status==="Delivered").reduce((s,o)=>s+o.total,0);
  const lowStock = products.filter(p=>p.qty<=5);

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
          <div style={{fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:26,marginBottom:4}}>In <span style={{color:"var(--a)"}}>Minutes</span></div>
          <div className="slogo-b" style={{marginBottom:24}}>ADMIN PANEL</div>
          <div className="fg"><label className="fl">Email</label><input className="fi" type="email" placeholder="your-email@inminutes.in" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doLogin()}/></div>
          <div className="fg"><label className="fl">Password</label><input className="fi" type="password" placeholder="Your password" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doLogin()}/></div>
          {loginErr&&<div className="err">{loginErr}</div>}
          <button className="pbtn" style={{width:"100%",padding:13,fontSize:15,borderRadius:12,fontFamily:"Syne,sans-serif",fontWeight:800,marginBottom:12}} onClick={doLogin}>Sign In →</button>
          <div style={{textAlign:"center",fontSize:12,color:"var(--m)"}}>Your login was given by the Head Admin</div>
        </div>
      </div>
    </>
  );

  const goToOrders = async () => {
    setPage("orders");
    // Dismiss notification when navigating to orders page
    if (notification) {
      await markSeen(notification.id);
    }
  };

  const NAVS = [
    {id:"dashboard",icon:"📊",label:"Dashboard"},
    {id:"orders",icon:"🚀",label:"New Orders",badge:newOrderCount},
    {id:"products",icon:"📦",label:"Products"},
    {id:"inventory",icon:"🗂️",label:"Inventory"},
    {id:"allorders",icon:"📋",label:"All Orders"},
  ];

  return (
    <>
      <style>{CSS}</style>
      <div className="wrap">
        {notification&&<div className="notif-banner">
          <button className="notif-close" onClick={()=>markSeen(notification.id)} title="Mark as read">✕</button>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
            <span className="new-dot"/>
            <strong style={{fontSize:14,color:"var(--a)"}}>New Order Received!</strong>
          </div>
          <div style={{fontSize:13,fontWeight:600,marginBottom:4}}>{notification.id}</div>
          <div style={{fontSize:12,color:"var(--m)",marginBottom:2}}>👤 {notification.userName} · 📞 {notification.userPhone}</div>
          <div style={{fontSize:12,color:"var(--m)",marginBottom:2}}>📍 {notification.address?.line1}, {notification.address?.city}</div>
          <div style={{fontSize:12,color:"var(--m)",marginBottom:8}}>🛒 {notification.items?.map(i=>i.name+" x"+i.quantity).join(", ")}</div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}>
            <strong style={{color:"var(--a)",fontFamily:"Syne,sans-serif"}}>₹{notification.total}</strong>
            <div style={{display:"flex",gap:6}}>
              <button onClick={()=>markSeen(notification.id)} style={{background:"var(--s2)",color:"var(--m)",border:"1px solid var(--b)",borderRadius:8,padding:"6px 12px",fontSize:11,fontWeight:600,cursor:"pointer"}}>✓ Mark as Read</button>
              <button onClick={()=>{markSeen(notification.id);setPage("orders");}} style={{background:"var(--a)",color:"#1a1a2e",border:"none",borderRadius:8,padding:"6px 14px",fontSize:12,fontWeight:700,cursor:"pointer"}}>View Order →</button>
            </div>
          </div>
        </div>}

        <div className="side">
          <div className="slogo">
            <div className="slogo-t">In <span>Minutes</span></div>
            <div className="slogo-b">ADMIN PANEL</div>
          </div>
          <div className="snav">
            {NAVS.map(n=><div key={n.id} className={`ni${page===n.id?" act":""}`} onClick={()=>n.id==="orders"?goToOrders():setPage(n.id)}>
              <span style={{fontSize:16,width:20,textAlign:"center"}}>{n.icon}</span>{n.label}
              {n.badge>0&&<span className="nbdg">{n.badge}</span>}
            </div>)}
          </div>
          <div className="sbot">
            <div className="suser">
              <div className="av">{auth.name[0]}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{auth.name}</div>
                <div style={{fontSize:11,color:"var(--a2)",cursor:"pointer"}} onClick={()=>setAuth(null)}>Logout</div>
              </div>
            </div>
          </div>
        </div>

        <div className="main">
          <div className="topbar">
            <div className="ttl">{{dashboard:"Dashboard",orders:"New Orders",products:"Products",inventory:"Inventory",allorders:"All Orders"}[page]}</div>
            <div style={{display:"flex",gap:10,alignItems:"center"}}>
              {page==="products"&&<><input placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} style={{background:"var(--s2)",border:"1px solid var(--b)",borderRadius:9,padding:"7px 14px",color:"#E8EDF8",fontSize:13,outline:"none",width:180,fontFamily:"DM Sans,sans-serif"}}/><button className="pbtn" onClick={openAdd}>+ Add Product</button></>}
              <button onClick={loadAll} style={{background:"var(--s2)",border:"1px solid var(--b)",borderRadius:8,padding:"7px 12px",color:"var(--m)",cursor:"pointer",fontSize:14}}>🔄</button>
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
              {lowStock.map(p=><div key={p.id} style={{display:"flex",alignItems:"center",gap:12,background:"rgba(255,181,71,.06)",border:"1px solid rgba(255,181,71,.2)",borderRadius:12,padding:"12px 16px",marginBottom:8}}>
                <span>⚠️</span><span style={{fontSize:13,fontWeight:600}}><span style={{color:"var(--y)"}}>{p.name}</span> — only <span style={{color:"var(--y)"}}>{p.qty}</span> left</span>
                <button className="abtn e" style={{marginLeft:"auto"}} onClick={()=>openEdit(p)}>Restock</button>
              </div>)}
              <div className="card">
                <div className="ch"><div className="ct">Recent Orders</div>{newOrderCount>0&&<span style={{fontSize:12,color:"var(--a2)",fontWeight:600}}>🔴 {newOrderCount} new</span>}</div>
                {orders.length===0?<div className="ld">No orders yet</div>:
                <table><thead><tr><th>Order ID</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead>
                  <tbody>{[...orders].reverse().slice(0,5).map(o=><tr key={o.id} style={{background:o.isNew?"rgba(78,205,196,.03)":""}}>
                    <td style={{fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:12}}>{o.isNew&&<span className="new-dot"/>}{o.id}</td>
                    <td><div style={{fontWeight:600,fontSize:13}}>{o.userName}</div><div style={{fontSize:11,color:"var(--m)"}}>{o.userPhone}</div></td>
                    <td style={{fontWeight:700}}>₹{o.total}</td>
                    <td><span className={`badge ${o.status==="Delivered"?"bg":o.status==="Packed"?"by":"bt"}`}>{o.status}</span></td>
                  </tr>)}</tbody>
                </table>}
              </div>
            </>}

            {page==="orders"&&<div className="card">
              <div className="ch"><div className="ct">Active Orders ({orders.filter(o=>o.status!=="Delivered").length})</div></div>
              {orders.filter(o=>o.status!=="Delivered").length===0?<div className="ld">✅ No pending orders right now!</div>:
              [...orders].reverse().filter(o=>o.status!=="Delivered").map(o=>(
                <div key={o.id} style={{padding:"16px 20px",borderBottom:"1px solid var(--b)"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                    <div style={{fontFamily:"Syne,sans-serif",fontWeight:700}}>{o.id}</div>
                    <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
                      <span className={`badge ${o.status==="Delivered"?"bg":o.status==="Out for Delivery"?"by":o.status==="Packed"?"bt":"bv"}`}>{o.status}</span>
                      <span className="badge bt" style={{fontSize:10}}>{o.paymentMethod?.toUpperCase()}</span>
                    </div>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:10}}>
                    <div style={{background:"var(--s2)",borderRadius:10,padding:12}}>
                      <div style={{fontSize:11,color:"var(--m)",marginBottom:4,fontWeight:700,textTransform:"uppercase",letterSpacing:.5}}>Customer</div>
                      <div style={{fontSize:13,fontWeight:600}}>{o.userName}</div>
                      <div style={{fontSize:12,color:"var(--m)"}}>{o.userPhone}</div>
                      <div style={{fontSize:12,color:"var(--m)"}}>{o.userEmail}</div>
                    </div>
                    <div style={{background:"var(--s2)",borderRadius:10,padding:12}}>
                      <div style={{fontSize:11,color:"var(--m)",marginBottom:4,fontWeight:700,textTransform:"uppercase",letterSpacing:.5}}>Delivery Address</div>
                      <div style={{fontSize:13,fontWeight:600}}>{o.address?.label}</div>
                      <div style={{fontSize:12,color:"var(--m)"}}>{o.address?.line1}</div>
                      <div style={{fontSize:12,color:"var(--m)"}}>{o.address?.city} — {o.address?.pincode}</div>
                      {o.address?.phone&&<div style={{fontSize:12,color:"var(--m)"}}>📞 {o.address.phone}</div>}
                    </div>
                  </div>
                  <div style={{background:"var(--s2)",borderRadius:10,padding:12,marginBottom:10}}>
                    <div style={{fontSize:11,color:"var(--m)",marginBottom:6,fontWeight:700,textTransform:"uppercase",letterSpacing:.5}}>Items Ordered</div>
                    {o.items.map((item,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:3}}>
                      <span>{item.name} × {item.quantity}</span>
                      <span style={{fontWeight:700}}>₹{item.price*item.quantity}</span>
                    </div>)}
                    <div style={{borderTop:"1px solid var(--b)",marginTop:8,paddingTop:8,display:"flex",justifyContent:"space-between",fontFamily:"Syne,sans-serif",fontWeight:700}}>
                      <span>Total</span><span style={{color:"var(--a)"}}>₹{o.total}</span>
                    </div>
                  </div>
                  <div style={{marginTop:12,background:"var(--s2)",borderRadius:12,padding:12}}>
                    <div style={{fontSize:11,color:"var(--m)",fontWeight:700,textTransform:"uppercase",letterSpacing:.5,marginBottom:10}}>📋 Update Order Status</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                      {[{s:"Confirmed",icon:"✅"},{s:"Packed",icon:"📦"},{s:"Out for Delivery",icon:"🚚"},{s:"Delivered",icon:"🎉"}].map(({s,icon})=>(
                        <button key={s} onClick={async()=>{ await updateStatus(o.id,s); }} style={{padding:"10px 8px",borderRadius:10,border:"2px solid",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"DM Sans,sans-serif",transition:"all .2s",
                          background:o.status===s?"var(--a)":"transparent",
                          color:o.status===s?"#1a1a2e":"var(--m)",
                          borderColor:o.status===s?"var(--a)":"var(--b)",
                          transform:o.status===s?"scale(1.03)":"scale(1)"}}>
                          {icon} {s}
                        </button>
                      ))}
                    </div>
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
                  <td style={{fontWeight:700,color:p.qty<=5?"#FF6B6B":p.qty<=15?"#FFB547":"#00D4AA"}}>{p.qty} units</td>
                  <td><span className={`badge ${p.inStock?"bg":"br"}`}>{p.inStock?"In Stock":"Out"}</span></td>
                  <td><button className="abtn e" onClick={()=>openEdit(p)}>Edit</button><button className="abtn d" onClick={()=>deleteProd(p.id)}>Delete</button></td>
                </tr>)}</tbody>
              </table>}
            </div>}

            {page==="inventory"&&<div className="card">
              <div className="ch"><div className="ct">Stock Levels</div></div>
              {products.length===0?<div className="ld">No products</div>:
              <table><thead><tr><th>Product</th><th>Stock Bar</th><th>Units</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>{[...products].sort((a,b)=>a.qty-b.qty).map(p=><tr key={p.id}>
                  <td style={{fontWeight:600}}>{p.name}</td>
                  <td style={{width:150}}><div style={{height:6,background:"var(--s2)",borderRadius:3,overflow:"hidden"}}><div style={{width:`${Math.min(100,(p.qty/50)*100)}%`,height:"100%",background:p.qty<=5?"#FF6B6B":p.qty<=15?"#FFB547":"#00D4AA",borderRadius:3}}></div></div></td>
                  <td style={{fontWeight:700,color:p.qty<=5?"#FF6B6B":p.qty<=15?"#FFB547":"#00D4AA"}}>{p.qty}</td>
                  <td><span className={`badge ${p.qty===0?"br":p.qty<=5?"by":"bg"}`}>{p.qty===0?"Out":p.qty<=5?"Low":"Good"}</span></td>
                  <td><button className="abtn e" onClick={()=>openEdit(p)}>Update</button></td>
                </tr>)}</tbody>
              </table>}
            </div>}

            {page==="allorders"&&<div className="card">
              <div className="ch"><div className="ct">All Orders ({orders.length})</div></div>
              {orders.length===0?<div className="ld">No orders yet</div>:
              <table><thead><tr><th>Order ID</th><th>Date</th><th>Customer</th><th>Phone</th><th>Address</th><th>Items</th><th>Total</th><th>Status</th></tr></thead>
                <tbody>{[...orders].reverse().map(o=><tr key={o.id}>
                  <td style={{fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:12}}>{o.id}</td>
                  <td style={{fontSize:11,color:"var(--m)"}}>{new Date(o.createdAt).toLocaleDateString("en-IN")}</td>
                  <td><div style={{fontWeight:600,fontSize:13}}>{o.userName}</div><div style={{fontSize:11,color:"var(--m)"}}>{o.userEmail}</div></td>
                  <td style={{fontSize:12}}>{o.userPhone}</td>
                  <td style={{fontSize:11,color:"var(--m)",maxWidth:140}}>{o.address?.line1}, {o.address?.city}</td>
                  <td style={{fontSize:11,color:"var(--m)",maxWidth:160}}>{o.items.map(i=>i.name+" x"+i.quantity).join(", ")}</td>
                  <td style={{fontWeight:700}}>₹{o.total}</td>
                  <td>
                    <select className="osel" value={o.status} onChange={async e=>{
                      const newStatus = e.target.value;
                      await fetch(`${API}/orders/${o.id}/status`, {method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({status:newStatus})});
                      await loadAll();
                    }}>
                      <option>Confirmed</option>
                      <option>Packed</option>
                      <option>Out for Delivery</option>
                      <option>Delivered</option>
                    </select>
                  </td>
                </tr>)}</tbody>
              </table>}
            </div>}
          </div>
        </div>

        {modal==="prod"&&<div className="ov" onClick={()=>setModal(null)}><div className="modal" onClick={e=>e.stopPropagation()}>
          <div className="mt">{editP?"✏️ Edit Product":"➕ Add Product"}</div>
          <div className="fg"><label className="fl">Images (max 5)</label><ImgSection/></div>
          <div className="fg"><label className="fl">Product Name</label><input className="fi" placeholder="e.g. Fresh Tomatoes 500g" value={newP.name} onChange={e=>setNewP(p=>({...p,name:e.target.value}))}/></div>
          <div className="fg"><label className="fl">Description</label><input className="fi" value={newP.desc} onChange={e=>setNewP(p=>({...p,desc:e.target.value}))}/></div>
          <div className="frow">
            <div className="fg"><label className="fl">Price (₹)</label><input className="fi" type="number" value={newP.price} onChange={e=>setNewP(p=>({...p,price:e.target.value}))}/></div>
            <div className="fg"><label className="fl">Quantity</label><input className="fi" type="number" value={newP.qty} onChange={e=>setNewP(p=>({...p,qty:e.target.value}))}/></div>
          </div>
          <div className="frow">
            <div className="fg"><label className="fl">Category</label><select className="fsel" value={newP.category} onChange={e=>setNewP(p=>({...p,category:e.target.value}))}>{CATS.map(c=><option key={c}>{c}</option>)}</select></div>
            <div className="fg"><label className="fl">Status</label><select className="fsel" value={newP.inStock?"y":"n"} onChange={e=>setNewP(p=>({...p,inStock:e.target.value==="y"}))}><option value="y">In Stock</option><option value="n">Out of Stock</option></select></div>
          </div>
          <div className="mbtns">
            <button style={{background:"var(--s2)",color:"var(--m)",border:"1px solid var(--b)"}} onClick={()=>setModal(null)}>Cancel</button>
            <button style={{background:"var(--a)",color:"#1a1a2e",opacity:saving?.6:1}} onClick={saveProd} disabled={saving}>{saving?"Saving...":editP?"Save Changes":"Add Product"}</button>
          </div>
        </div></div>}
      </div>
    </>
  );
}
