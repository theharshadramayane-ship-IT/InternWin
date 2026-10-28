import { useState, useEffect } from "react";
import {
  adminLogin,
  fetchInterns,
  createIntern,
  deleteIntern,
  fetchJobs,
  createJob,
  closeJob,
  deleteJob,
  mapIntern,
  mapJob,
} from "./api";

const T = {
  bg:"#07090f", surface:"#0d1117", card:"#111827", border:"#1c2333",
  accent:"#f0a500", blue:"#3b82f6", green:"#22c55e", red:"#ef4444",
  purple:"#a855f7", text:"#f1f5f9", muted:"#64748b", sub:"#94a3b8",
};

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { height: 100%; }
  body { font-family: 'Outfit', sans-serif; background: ${T.bg}; color: ${T.text}; -webkit-font-smoothing: antialiased; }
  ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: #1e2a3a; border-radius: 99px; }
  input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0 1000px ${T.card} inset !important;
    -webkit-text-fill-color: ${T.text} !important; caret-color: ${T.text};
  }
  .mono { font-family: 'IBM Plex Mono', monospace; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  @keyframes spin   { to{transform:rotate(360deg)} }
  @keyframes slideRight { from{transform:translateX(-10px);opacity:0} to{transform:none;opacity:1} }
  .anim-fadeUp    { animation: fadeUp .4s cubic-bezier(.22,.68,0,1.2) both; }
  .anim-fadeIn    { animation: fadeIn .3s ease both; }
  .anim-slideRight{ animation: slideRight .3s ease both; }
  .hover-row:hover { background: #1c233344 !important; }
`;

/* ─── HELPERS ──────────────────────────────────────────────────────────────── */
const css = (...a) => Object.assign({}, ...a);
const Spinner = () => <span style={{display:"inline-block",width:16,height:16,border:`2px solid ${T.accent}44`,borderTopColor:T.accent,borderRadius:"50%",animation:"spin .7s linear infinite"}}/>;

const Badge = ({ children, color=T.accent }) => (
  <span style={{background:color+"1a",color,border:`1px solid ${color}33`,borderRadius:4,padding:"2px 9px",fontSize:11,fontWeight:600,letterSpacing:.3,whiteSpace:"nowrap"}}>{children}</span>
);

const Avatar = ({ name="?", size=36, color=T.accent }) => {
  const initials = name.trim().split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
  return <div style={{width:size,height:size,borderRadius:"50%",background:`linear-gradient(135deg,${color}33,${color}11)`,border:`2px solid ${color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*.36,fontWeight:700,color,flexShrink:0}}>{initials}</div>;
};

const ProgressBar = ({ value, max=100, color=T.accent, height=6 }) => (
  <div style={{background:T.border,borderRadius:99,height,overflow:"hidden",width:"100%"}}>
    <div style={{width:`${Math.min(100,(value/max)*100)}%`,background:`linear-gradient(90deg,${color},${color}88)`,height:"100%",borderRadius:99,transition:"width .6s"}}/>
  </div>
);

const Card = ({ children, style={}, className="" }) => (
  <div className={className} style={css({background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:22},style)}>{children}</div>
);

const StatCard = ({ icon, label, value, sub, color=T.accent, delay=0 }) => (
  <Card className="anim-fadeUp" style={{flex:1,minWidth:150,animationDelay:`${delay}ms`}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
      <div>
        <div style={{fontSize:11,color:T.muted,fontWeight:600,letterSpacing:.8,textTransform:"uppercase",marginBottom:10}}>{label}</div>
        <div style={{fontSize:30,fontWeight:800,color,letterSpacing:-1}}>{value}</div>
        {sub && <div style={{fontSize:12,color:T.sub,marginTop:5}}>{sub}</div>}
      </div>
      <div style={{background:color+"18",borderRadius:12,padding:"10px 12px",fontSize:22}}>{icon}</div>
    </div>
  </Card>
);

/* ─── INPUT ────────────────────────────────────────────────────────────────── */
const Input = ({ label, type="text", value, onChange, placeholder, icon, error, hint, required, options }) => {
  const [focused, setFocused] = useState(false);
  const [show, setShow] = useState(false);
  const isPass = type==="password";
  return (
    <div style={{marginBottom:16}}>
      {label && <label style={{display:"block",fontSize:13,fontWeight:600,color:T.sub,marginBottom:7}}>
        {label}{required && <span style={{color:T.accent,marginLeft:3}}>*</span>}
      </label>}
      <div style={{position:"relative"}}>
        {icon && <span style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",fontSize:15,pointerEvents:"none",opacity:.5}}>{icon}</span>}
        {options ? (
          <select value={value} onChange={onChange} onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
            style={{width:"100%",background:T.surface,border:`1.5px solid ${error?T.red:focused?T.accent:T.border}`,borderRadius:10,padding:`11px 14px 11px ${icon?"40px":"14px"}`,color:value?T.text:T.muted,fontSize:14,fontFamily:"'Outfit',sans-serif",outline:"none",cursor:"pointer",boxShadow:focused?`0 0 0 3px ${T.accent}1a`:"none",transition:"border-color .2s,box-shadow .2s"}}>
            {options.map(o=><option key={o.value} value={o.value} disabled={o.disabled}>{o.label}</option>)}
          </select>
        ) : (
          <input type={isPass?(show?"text":"password"):type} value={value} onChange={onChange} placeholder={placeholder}
            onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
            style={{width:"100%",background:T.surface,border:`1.5px solid ${error?T.red:focused?T.accent:T.border}`,borderRadius:10,padding:`11px ${isPass?"44px":"14px"} 11px ${icon?"40px":"14px"}`,color:T.text,fontSize:14,fontFamily:"'Outfit',sans-serif",outline:"none",transition:"border-color .2s,box-shadow .2s",boxShadow:focused?`0 0 0 3px ${error?T.red:T.accent}1a`:"none"}}/>
        )}
        {isPass && <button type="button" onClick={()=>setShow(s=>!s)} style={{position:"absolute",right:13,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:T.muted,cursor:"pointer",fontSize:15,padding:0}}>{show?"🙈":"👁️"}</button>}
      </div>
      {error && <div style={{fontSize:12,color:T.red,marginTop:4}}>⚠ {error}</div>}
      {hint && !error && <div style={{fontSize:12,color:T.muted,marginTop:4}}>{hint}</div>}
    </div>
  );
};

const Btn = ({ children, onClick, variant="primary", size="md", loading, disabled, full, style={} }) => {
  const base = {display:"inline-flex",alignItems:"center",justifyContent:"center",gap:8,borderRadius:10,fontFamily:"'Outfit',sans-serif",fontWeight:700,cursor:disabled||loading?"not-allowed":"pointer",border:"none",transition:"all .2s",width:full?"100%":"auto",opacity:disabled||loading?.6:1};
  const sizes = {sm:{padding:"7px 14px",fontSize:13},md:{padding:"11px 22px",fontSize:14},lg:{padding:"14px 32px",fontSize:16}};
  const variants = {
    primary:{background:`linear-gradient(135deg,${T.accent},#f0c040)`,color:"#0a0700",boxShadow:`0 4px 18px ${T.accent}33`},
    ghost:{background:"transparent",color:T.sub,border:`1.5px solid ${T.border}`},
    danger:{background:`${T.red}1a`,color:T.red,border:`1.5px solid ${T.red}33`},
    outline:{background:"transparent",color:T.accent,border:`1.5px solid ${T.accent}55`},
    green:{background:`${T.green}1a`,color:T.green,border:`1.5px solid ${T.green}44`},
  };
  return <button onClick={!disabled&&!loading?onClick:undefined} style={css(base,sizes[size],variants[variant],style)}>{loading?<Spinner/>:children}</button>;
};

/* ─── EMPTY STATE ──────────────────────────────────────────────────────────── */
const EmptyState = ({ icon, title, subtitle, action }) => (
  <div style={{textAlign:"center",padding:"60px 20px"}}>
    <div style={{fontSize:56,marginBottom:16}}>{icon}</div>
    <div style={{fontSize:18,fontWeight:700,marginBottom:8}}>{title}</div>
    <div style={{fontSize:14,color:T.muted,marginBottom:24,maxWidth:320,margin:"0 auto 24px"}}>{subtitle}</div>
    {action}
  </div>
);

/* ═══════════════════════════════════════════════════════════════════════════
   LOGIN
═══════════════════════════════════════════════════════════════════════════ */
function LoginPage({ onLogin, goRegister }) {
  const [form, setForm] = useState({email:"",password:""});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const validate = () => {
    const e={};
    if(!form.email) e.email="User ID required";
    if(!form.password) e.password="Password required";
    return e;
  };

  const handleLogin = async () => {
    const e=validate();
    if(Object.keys(e).length){setErrors(e);return;}
    setLoading(true);
    try {
      const res = await adminLogin(form.email, form.password);
      localStorage.setItem("adminToken", res.token);
      onLogin(res.admin);
    } catch (err) {
      setErrors({ password: err.message || "Invalid credentials" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{minHeight:"100vh",display:"flex",background:T.bg}}>
      {/* LEFT */}
      <div style={{flex:1,background:`linear-gradient(160deg,#0d1117,#111827 60%,#0a0f1a)`,display:"flex",flexDirection:"column",justifyContent:"space-between",padding:52,position:"relative",overflow:"hidden",borderRight:`1px solid ${T.border}`}}>
        {[{s:420,x:-120,y:-80,c:T.accent},{s:300,x:220,y:320,c:T.blue},{s:180,x:340,y:-40,c:T.purple}].map((c,i)=>(
          <div key={i} style={{position:"absolute",width:c.s,height:c.s,left:c.x,top:c.y,borderRadius:"50%",background:`radial-gradient(circle,${c.c}0f,transparent 70%)`,pointerEvents:"none"}}/>
        ))}
        <div style={{position:"absolute",inset:0,backgroundImage:`linear-gradient(${T.border}44 1px,transparent 1px),linear-gradient(90deg,${T.border}44 1px,transparent 1px)`,backgroundSize:"48px 48px",opacity:.35}}/>
        <div style={{position:"relative",display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:40,height:40,background:`linear-gradient(135deg,${T.accent},#e8931a)`,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,boxShadow:`0 4px 18px ${T.accent}44`}}>⚡</div>
          <span style={{fontSize:22,fontWeight:800,letterSpacing:-.5}}>SkillGate</span>
        </div>
        <div style={{position:"relative"}}>
          <div className="anim-fadeUp" style={{fontSize:12,color:T.accent,fontWeight:700,letterSpacing:2.5,textTransform:"uppercase",marginBottom:14}}>Company Admin Portal</div>
          <h2 className="anim-fadeUp" style={{fontSize:44,fontWeight:900,lineHeight:1.12,letterSpacing:-1.5,animationDelay:"80ms"}}>
            Manage Your<br/>
            <span style={{background:`linear-gradient(90deg,${T.accent},#f5d020)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Intern Pipeline</span><br/>
            With Precision
          </h2>
          <p className="anim-fadeUp" style={{marginTop:18,fontSize:15,color:T.sub,lineHeight:1.75,maxWidth:380,animationDelay:"160ms"}}>
            Track performance, manage tests, schedule interviews and convert your best interns into full-time employees.
          </p>
        </div>
        <div style={{position:"relative",display:"flex",gap:32}}>
          {[["🎯","Smart Tracking"],["📊","Real Analytics"],["🚀","Fast Hiring"]].map(([ic,lb],i)=>(
            <div key={lb} className="anim-fadeUp" style={{animationDelay:`${220+i*70}ms`,display:"flex",gap:8,alignItems:"center"}}>
              <span style={{fontSize:20}}>{ic}</span>
              <span style={{fontSize:13,color:T.sub,fontWeight:500}}>{lb}</span>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT */}
      <div style={{width:480,display:"flex",alignItems:"center",justifyContent:"center",padding:48}}>
        <div className="anim-fadeUp" style={{width:"100%",maxWidth:380}}>
          <div style={{marginBottom:32}}>
            <h3 style={{fontSize:26,fontWeight:800,letterSpacing:-.5}}>Welcome back 👋</h3>
            <p style={{color:T.muted,fontSize:14,marginTop:6}}>Sign in to your admin account</p>
          </div>
          <Input label="Admin User ID" type="text" value={form.email} onChange={e=>set("email",e.target.value)} placeholder="admin@1111" icon="📧" error={errors.email} required/>
          <Input label="Password" type="password" value={form.password} onChange={e=>set("password",e.target.value)} placeholder="Enter your password" icon="🔒" error={errors.password} required/>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
            <label style={{display:"flex",gap:8,alignItems:"center",cursor:"pointer",fontSize:13,color:T.sub}}>
              <input type="checkbox" defaultChecked style={{accentColor:T.accent}}/>Remember me
            </label>
            <button style={{background:"none",border:"none",color:T.accent,fontSize:13,cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>Forgot password?</button>
          </div>
          <Btn full loading={loading} onClick={handleLogin} size="lg">{!loading&&"Sign In →"}</Btn>
          <div style={{textAlign:"center",marginTop:22,fontSize:13,color:T.muted}}>
            New company?{" "}
            <button onClick={goRegister} style={{background:"none",border:"none",color:T.accent,cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:13}}>Register organization</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   REGISTER
═══════════════════════════════════════════════════════════════════════════ */
function RegisterPage({ onRegister, goLogin }) {
  const [step, setStep]     = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm]     = useState({company:"",industry:"",size:"",adminName:"",email:"",phone:"",password:"",confirm:""});
  const [errors, setErrors] = useState({});
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const v1 = () => {
    const e={};
    if(!form.company.trim()) e.company="Company name required";
    if(!form.industry)       e.industry="Select industry";
    if(!form.size)           e.size="Select size";
    return e;
  };
  const v2 = () => {
    const e={};
    if(!form.adminName.trim())                  e.adminName="Name required";
    if(!form.email)                             e.email="Email required";
    else if(!/\S+@\S+\.\S+/.test(form.email))   e.email="Invalid email";
    if(!form.phone)                             e.phone="Phone required";
    if(!form.password)                          e.password="Password required";
    else if(form.password.length<8)             e.password="Min 8 characters";
    if(form.password!==form.confirm)            e.confirm="Passwords don't match";
    return e;
  };

  const next = () => {
    if(step===1){const e=v1();if(Object.keys(e).length){setErrors(e);return;}setErrors({});setStep(2);}
    else if(step===2){
      const e=v2();if(Object.keys(e).length){setErrors(e);return;}
      // NOTE: self-serve org registration isn't wired to the backend yet — it
      // currently supports a single seeded Admin account only. This just shows
      // the confirmation UI; no account is actually created server-side.
      setErrors({});setStep(3);
    }
    else onRegister();
  };

  const industries=["Technology","Finance","Healthcare","Education","E-commerce","Manufacturing","Consulting","Media","Other"];
  const sizes=["1–10","11–50","51–200","201–500","500+"];

  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:T.bg,padding:24}}>
      <div style={{position:"fixed",width:500,height:500,borderRadius:"50%",background:`radial-gradient(circle,${T.accent}09,transparent 70%)`,top:-100,right:-100,pointerEvents:"none"}}/>
      <div className="anim-fadeUp" style={{width:"100%",maxWidth:520,background:T.card,border:`1px solid ${T.border}`,borderRadius:20,overflow:"hidden"}}>
        {/* header */}
        <div style={{padding:"26px 30px 22px",borderBottom:`1px solid ${T.border}`,background:`linear-gradient(135deg,${T.accent}09,transparent)`}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
            <div style={{width:36,height:36,background:`linear-gradient(135deg,${T.accent},#e8931a)`,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>⚡</div>
            <span style={{fontWeight:800,fontSize:18}}>SkillGate</span>
          </div>
          <h3 style={{fontSize:22,fontWeight:800,letterSpacing:-.5}}>Register Your Organization</h3>
          <p style={{color:T.muted,fontSize:13,marginTop:4}}>Create admin account in 2 simple steps</p>
          {/* stepper */}
          <div style={{display:"flex",alignItems:"center",marginTop:20}}>
            {["Company Info","Admin Account","Done!"].map((s,i)=>{
              const n=i+1,done=step>n,active=step===n;
              return(
                <div key={s} style={{display:"flex",alignItems:"center",flex:i<2?1:"auto"}}>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                    <div style={{width:26,height:26,borderRadius:"50%",background:done?T.green:active?T.accent:T.border,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:(done||active)?"#000":T.muted,transition:"all .3s"}}>
                      {done?"✓":n}
                    </div>
                    <div style={{fontSize:11,color:active?T.accent:done?T.green:T.muted,fontWeight:active?700:400,whiteSpace:"nowrap"}}>{s}</div>
                  </div>
                  {i<2&&<div style={{flex:1,height:2,background:step>n?T.green:T.border,margin:"0 8px",marginBottom:16,transition:"background .3s"}}/>}
                </div>
              );
            })}
          </div>
        </div>

        {/* body */}
        <div style={{padding:"26px 30px"}}>
          {step===1 && (
            <div className="anim-slideRight">
              <Input label="Company Name" value={form.company} onChange={e=>set("company",e.target.value)} placeholder="e.g. TechCorp India Pvt Ltd" icon="🏢" error={errors.company} required/>
              <Input label="Industry" value={form.industry} onChange={e=>set("industry",e.target.value)} icon="🏭" error={errors.industry} required
                options={[{value:"",label:"Select industry...",disabled:true},...industries.map(i=>({value:i,label:i}))]}/>
              <div style={{marginBottom:16}}>
                <label style={{display:"block",fontSize:13,fontWeight:600,color:T.sub,marginBottom:7}}>Company Size <span style={{color:T.accent}}>*</span></label>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  {sizes.map(s=>(
                    <button key={s} onClick={()=>set("size",s)} style={{padding:"8px 16px",borderRadius:8,border:`1.5px solid ${form.size===s?T.accent:T.border}`,background:form.size===s?T.accent+"1a":T.surface,color:form.size===s?T.accent:T.sub,fontFamily:"'Outfit',sans-serif",fontWeight:600,fontSize:13,cursor:"pointer",transition:"all .2s"}}>{s}</button>
                  ))}
                </div>
                {errors.size&&<div style={{fontSize:12,color:T.red,marginTop:4}}>⚠ {errors.size}</div>}
              </div>
            </div>
          )}
          {step===2 && (
            <div className="anim-slideRight">
              <Input label="Admin Full Name" value={form.adminName} onChange={e=>set("adminName",e.target.value)} placeholder="Your full name" icon="👤" error={errors.adminName} required/>
              <Input label="Work Email" type="email" value={form.email} onChange={e=>set("email",e.target.value)} placeholder="admin@company.com" icon="📧" error={errors.email} required/>
              <Input label="Phone Number" value={form.phone} onChange={e=>set("phone",e.target.value)} placeholder="+91 98765 43210" icon="📱" error={errors.phone} required/>
              <Input label="Password" type="password" value={form.password} onChange={e=>set("password",e.target.value)} placeholder="Minimum 8 characters" icon="🔒" error={errors.password} hint="Use uppercase, number & special char" required/>
              <Input label="Confirm Password" type="password" value={form.confirm} onChange={e=>set("confirm",e.target.value)} placeholder="Re-enter password" icon="🔐" error={errors.confirm} required/>
            </div>
          )}
          {step===3 && (
            <div className="anim-fadeIn" style={{textAlign:"center",padding:"16px 0"}}>
              <div style={{fontSize:56,marginBottom:16}}>🎉</div>
              <h4 style={{fontSize:22,fontWeight:800}}>Request received!</h4>
              <p style={{color:T.muted,marginTop:8,fontSize:14,lineHeight:1.7}}>
                Self-serve signup isn't live yet — <strong style={{color:T.accent}}>{form.company}</strong>'s details have been noted.<br/>Contact your system administrator to activate this account, then sign in below.
              </p>
              <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,padding:"14px 18px",marginTop:18,textAlign:"left",display:"flex",flexDirection:"column",gap:7}}>
                {[["Company",form.company],["Admin",form.adminName],["Email",form.email]].map(([k,v])=>(
                  <div key={k} style={{display:"flex",justifyContent:"space-between",fontSize:13}}>
                    <span style={{color:T.muted}}>{k}</span>
                    <span style={{color:T.text,fontWeight:600}}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div style={{display:"flex",gap:10,marginTop:8}}>
            {step>1&&step<3&&<Btn variant="ghost" onClick={()=>setStep(s=>s-1)}>← Back</Btn>}
            <Btn full loading={loading&&step===2} onClick={next}>
              {step===1?"Next →":step===2?(loading?"Creating...":"Create Account →"):"Go to Login →"}
            </Btn>
          </div>
          {step===1&&<div style={{textAlign:"center",marginTop:16,fontSize:13,color:T.muted}}>
            Already registered?{" "}
            <button onClick={goLogin} style={{background:"none",border:"none",color:T.accent,cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:13}}>Sign in</button>
          </div>}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ADD INTERN MODAL
═══════════════════════════════════════════════════════════════════════════ */
function AddInternModal({ onClose, onAdded }) {
  const [form, setForm] = useState({name:"",email:"",phone:"",dept:"",college:"",startDate:"",duration:""});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState(null);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const depts = ["Engineering","Design","Marketing","Finance","HR","Operations","Sales","Data Analytics"];

  const validate = () => {
    const e={};
    if(!form.name.trim())  e.name="Name required";
    if(!form.email)        e.email="Email required";
    else if(!/\S+@\S+\.\S+/.test(form.email)) e.email="Invalid email";
    if(!form.phone)        e.phone="Phone required";
    if(!form.dept)         e.dept="Select department";
    if(!form.college.trim()) e.college="College name required";
    if(!form.startDate)    e.startDate="Start date required";
    if(!form.duration)     e.duration="Select duration";
    return e;
  };

  const handleAdd = async () => {
    const e=validate();
    if(Object.keys(e).length){setErrors(e);return;}
    setLoading(true);
    try {
      const res = await createIntern({
        name: form.name,
        email: form.email,
        phone: form.phone,
        department: form.dept,
        college: form.college,
        startDate: form.startDate,
        duration: form.duration,
      });
      setCredentials(res.credentials);
      onAdded();
    } catch (err) {
      setErrors({ email: err.message || "Failed to add intern" });
    } finally {
      setLoading(false);
    }
  };

  if (credentials) {
    return (
      <div style={{position:"fixed",inset:0,background:"#00000099",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:20}}>
        <div className="anim-fadeUp" style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:18,width:"100%",maxWidth:440,padding:"26px 28px",textAlign:"center"}}>
          <div style={{fontSize:44,marginBottom:12}}>✅</div>
          <h3 style={{fontSize:18,fontWeight:800,marginBottom:6}}>Intern added!</h3>
          <p style={{color:T.muted,fontSize:13,marginBottom:16}}>Share these login credentials — they won't be shown again.</p>
          <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,padding:"14px 18px",textAlign:"left",display:"flex",flexDirection:"column",gap:8}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:13}}><span style={{color:T.muted}}>User ID</span><span className="mono" style={{fontWeight:700}}>{credentials.userId}</span></div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:13}}><span style={{color:T.muted}}>Password</span><span className="mono" style={{fontWeight:700}}>{credentials.password}</span></div>
          </div>
          <Btn full style={{marginTop:18}} onClick={onClose}>Done</Btn>
        </div>
      </div>
    );
  }

  return (
    <div style={{position:"fixed",inset:0,background:"#00000099",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:20}} onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="anim-fadeUp" style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:18,width:"100%",maxWidth:540,maxHeight:"90vh",overflow:"auto"}}>
        <div style={{padding:"22px 26px",borderBottom:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",background:`linear-gradient(135deg,${T.accent}09,transparent)`}}>
          <div>
            <h3 style={{fontSize:18,fontWeight:800,letterSpacing:-.3}}>Add New Intern</h3>
            <p style={{color:T.muted,fontSize:13,marginTop:3}}>Fill in the intern's details</p>
          </div>
          <button onClick={onClose} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:T.muted,fontSize:16}}>✕</button>
        </div>
        <div style={{padding:"22px 26px"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 16px"}}>
            <Input label="Full Name" value={form.name} onChange={e=>set("name",e.target.value)} placeholder="e.g. Rahul Sharma" icon="👤" error={errors.name} required/>
            <Input label="Email Address" type="email" value={form.email} onChange={e=>set("email",e.target.value)} placeholder="intern@email.com" icon="📧" error={errors.email} required/>
            <Input label="Phone Number" value={form.phone} onChange={e=>set("phone",e.target.value)} placeholder="+91 98765 43210" icon="📱" error={errors.phone} required/>
            <Input label="Department" value={form.dept} onChange={e=>set("dept",e.target.value)} icon="🏢" error={errors.dept} required
              options={[{value:"",label:"Select department...",disabled:true},...depts.map(d=>({value:d,label:d}))]}/>
          </div>
          <Input label="College / University" value={form.college} onChange={e=>set("college",e.target.value)} placeholder="e.g. Mumbai University" icon="🎓" error={errors.college} required/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 16px"}}>
            <Input label="Internship Start Date" type="date" value={form.startDate} onChange={e=>set("startDate",e.target.value)} error={errors.startDate} required/>
            <Input label="Duration" value={form.duration} onChange={e=>set("duration",e.target.value)} icon="📅" error={errors.duration} required
              options={[{value:"",label:"Select duration...",disabled:true},...["1 Month","2 Months","3 Months","6 Months"].map(d=>({value:d,label:d}))]}/>
          </div>
          <div style={{display:"flex",gap:10,marginTop:8}}>
            <Btn full loading={loading} onClick={handleAdd}>{!loading&&"Add Intern ✓"}</Btn>
            <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SIDEBAR
═══════════════════════════════════════════════════════════════════════════ */
const NAV = [
  {icon:"📊",label:"Overview",    s:"main"},
  {icon:"👥",label:"Interns",     s:"main"},
  {icon:"🏢",label:"Departments", s:"main"},
  {icon:"📢",label:"Job Postings",s:"main"},
  {icon:"📈",label:"Analytics",   s:"main"},
  {icon:"⚙️",label:"Settings",    s:"bottom"},
  {icon:"🚪",label:"Logout",      s:"bottom"},
];

function Sidebar({ active, setActive, onLogout }) {
  const main   = NAV.filter(n=>n.s==="main");
  const bottom = NAV.filter(n=>n.s==="bottom");
  const NavBtn = ({item}) => (
    <button onClick={()=>item.label==="Logout"?onLogout():setActive(item.label)}
      style={{display:"flex",alignItems:"center",gap:11,padding:"10px 14px",borderRadius:10,background:active===item.label?`${T.accent}18`:"transparent",color:active===item.label?T.accent:item.label==="Logout"?T.red:T.muted,border:"none",cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontSize:13.5,fontWeight:active===item.label?700:500,textAlign:"left",width:"100%",transition:"all .18s",position:"relative"}}>
      {active===item.label&&<div style={{position:"absolute",left:0,top:"18%",height:"64%",width:3,background:T.accent,borderRadius:"0 3px 3px 0"}}/>}
      <span style={{fontSize:16}}>{item.icon}</span><span>{item.label}</span>
    </button>
  );
  return (
    <div style={{width:230,background:T.surface,borderRight:`1px solid ${T.border}`,display:"flex",flexDirection:"column",minHeight:"calc(100vh - 58px)",padding:"16px 12px",flexShrink:0}}>
      <div style={{fontSize:10,color:T.muted,fontWeight:700,letterSpacing:1.2,textTransform:"uppercase",padding:"4px 14px",marginBottom:8}}>Main Menu</div>
      <div style={{display:"flex",flexDirection:"column",gap:2}}>{main.map(i=><NavBtn key={i.label} item={i}/>)}</div>
      <div style={{flex:1}}/>
      <div style={{borderTop:`1px solid ${T.border}`,paddingTop:12,display:"flex",flexDirection:"column",gap:2}}>{bottom.map(i=><NavBtn key={i.label} item={i}/>)}</div>
    </div>
  );
}

/* ─── TOPBAR ───────────────────────────────────────────────────────────── */
function Topbar({ admin }) {
  return (
    <div style={{height:58,background:T.surface,borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 24px",position:"sticky",top:0,zIndex:50}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:34,height:34,background:`linear-gradient(135deg,${T.accent},#e8931a)`,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,boxShadow:`0 2px 12px ${T.accent}33`}}>⚡</div>
        <span style={{fontWeight:800,fontSize:17,letterSpacing:-.5}}>SkillGate</span>
        <span className="mono" style={{fontSize:10,color:T.muted,background:T.border,padding:"2px 7px",borderRadius:4,marginLeft:2}}>Admin</span>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:14}}>
        <div style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}}>
          <Avatar name={admin?.name||"Admin"} size={34} color={T.accent}/>
          <div>
            <div style={{fontSize:13,fontWeight:700,lineHeight:1.2}}>{admin?.name||"Admin"}</div>
            <div style={{fontSize:11,color:T.muted}}>Company Admin</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   OVERVIEW PAGE
═══════════════════════════════════════════════════════════════════════════ */
function OverviewPage({ interns, jobs }) {
  const total    = interns.length;
  const active   = interns.filter(i=>i.status==="Active").length;
  const offered  = interns.filter(i=>i.status==="Offer Extended").length;
  const avgScore = total ? Math.round(interns.reduce((s,i)=>s+i.score,0)/total) : 0;

  return (
    <div className="anim-fadeIn">
      <div style={{marginBottom:26}}>
        <h1 style={{fontSize:24,fontWeight:800,letterSpacing:-.5}}>Dashboard Overview</h1>
        <p style={{color:T.muted,fontSize:13.5,marginTop:5}}>Welcome! Here's your internship program at a glance.</p>
      </div>
      <div style={{display:"flex",gap:14,marginBottom:24,flexWrap:"wrap"}}>
        <StatCard icon="👥" label="Total Interns"   value={total}     sub={total?`${active} currently active`:"No interns yet"} color={T.blue}   delay={0}/>
        <StatCard icon="✅" label="Offers Extended"  value={offered}   sub={offered?"Great retention!":"No offers yet"}          color={T.green}  delay={60}/>
        <StatCard icon="📢" label="Open Positions"   value={jobs.length} sub={`${jobs.reduce((s,j)=>s+j.openings,0)} total openings`} color={T.accent} delay={120}/>
        <StatCard icon="⭐" label="Avg Performance"  value={total?`${avgScore}%`:"—"} sub={total?"Based on all interns":"Add interns to see"} color={T.purple} delay={180}/>
      </div>

      {total===0 ? (
        <Card>
          <EmptyState icon="🚀" title="Your dashboard is empty" subtitle="Start by adding your first intern. All stats, performance & analytics will appear here automatically."/>
        </Card>
      ) : (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <Card>
            <div style={{fontWeight:700,marginBottom:16}}>Department Breakdown</div>
            {Object.entries(interns.reduce((acc,i)=>{acc[i.dept]=(acc[i.dept]||0)+1;return acc},{})).map(([dept,n])=>(
              <div key={dept} style={{marginBottom:13}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:5}}>
                  <span style={{color:T.sub}}>{dept}</span>
                  <span className="mono" style={{color:T.accent,fontWeight:700}}>{n}</span>
                </div>
                <ProgressBar value={n} max={Math.max(...Object.values(interns.reduce((acc,i)=>{acc[i.dept]=(acc[i.dept]||0)+1;return acc},{})))} color={T.accent}/>
              </div>
            ))}
          </Card>
          <Card>
            <div style={{fontWeight:700,marginBottom:16}}>Recent Interns</div>
            {interns.slice(-5).reverse().map((intern,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:11,marginBottom:12}}>
                <Avatar name={intern.name} size={32} color={intern.color}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:600}}>{intern.name}</div>
                  <div style={{fontSize:11,color:T.muted}}>{intern.dept} · {intern.joined}</div>
                </div>
                <Badge color={intern.status==="Active"?T.green:T.accent}>{intern.status}</Badge>
              </div>
            ))}
          </Card>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   INTERNS PAGE
═══════════════════════════════════════════════════════════════════════════ */
function InternsPage({ interns, reloadInterns }) {
  const [search, setSearch]     = useState("");
  const [filter, setFilter]     = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const depts = ["All", ...new Set(interns.map(i=>i.dept))];
  const filtered = interns.filter(i=>
    (filter==="All"||i.dept===filter) &&
    (i.name.toLowerCase().includes(search.toLowerCase())||i.dept.toLowerCase().includes(search.toLowerCase()))
  );

  const handleDelete = async (id) => {
    setDeleting(true);
    try {
      await deleteIntern(id);
      reloadInterns();
    } catch (err) {
      setError(err.message || "Failed to remove intern");
    } finally {
      setDeleting(false);
      setShowDelete(null);
    }
  };
  const statusColor = s => s==="Active"?T.green:s==="Offer Extended"?T.accent:s==="Under Review"?T.blue:T.muted;

  return (
    <div className="anim-fadeIn">
      {error && <div style={{background:T.red+"18",color:T.red,border:`1px solid ${T.red}44`,borderRadius:10,padding:"10px 16px",marginBottom:16,fontSize:13}}>{error}</div>}
      {showModal && <AddInternModal onClose={()=>{setShowModal(false);}} onAdded={reloadInterns}/>}
      {showDelete && (
        <div style={{position:"fixed",inset:0,background:"#00000099",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200}}>
          <div className="anim-fadeUp" style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:28,maxWidth:360,width:"100%",textAlign:"center"}}>
            <div style={{fontSize:44,marginBottom:12}}>🗑️</div>
            <div style={{fontSize:17,fontWeight:700,marginBottom:8}}>Remove Intern?</div>
            <div style={{fontSize:14,color:T.muted,marginBottom:22}}>Are you sure you want to remove <strong style={{color:T.text}}>{showDelete.name}</strong>? This cannot be undone.</div>
            <div style={{display:"flex",gap:10,justifyContent:"center"}}>
              <Btn variant="danger" loading={deleting} onClick={()=>handleDelete(showDelete.id)}>{!deleting&&"Yes, Remove"}</Btn>
              <Btn variant="ghost" onClick={()=>setShowDelete(null)}>Cancel</Btn>
            </div>
          </div>
        </div>
      )}

      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
        <div>
          <h1 style={{fontSize:24,fontWeight:800,letterSpacing:-.5}}>Intern Management</h1>
          <p style={{color:T.muted,fontSize:13,marginTop:4}}>{interns.length} interns enrolled</p>
        </div>
        <Btn onClick={()=>setShowModal(true)}>+ Add Intern</Btn>
      </div>

      {interns.length>0 && (
        <div style={{display:"flex",gap:10,marginBottom:18,alignItems:"center",flexWrap:"wrap"}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍  Search by name or dept..."
            style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:9,padding:"9px 14px",color:T.text,fontSize:13,fontFamily:"'Outfit',sans-serif",outline:"none",width:240}}/>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {depts.map(d=>(
              <button key={d} onClick={()=>setFilter(d)} style={{background:filter===d?T.accent+"1a":"transparent",color:filter===d?T.accent:T.muted,border:`1px solid ${filter===d?T.accent+"44":T.border}`,borderRadius:7,padding:"7px 13px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'Outfit',sans-serif",transition:"all .18s"}}>{d}</button>
            ))}
          </div>
        </div>
      )}

      {interns.length===0 ? (
        <Card>
          <EmptyState icon="👥" title="No interns added yet" subtitle="Click 'Add Intern' to onboard your first intern. Their info, performance and tasks will appear here."
            action={<Btn onClick={()=>setShowModal(true)}>+ Add First Intern</Btn>}/>
        </Card>
      ) : filtered.length===0 ? (
        <Card><EmptyState icon="🔍" title="No results found" subtitle="Try a different name or department filter."/></Card>
      ) : (
        <Card style={{padding:0,overflow:"hidden"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead>
              <tr style={{borderBottom:`1px solid ${T.border}`,background:T.surface}}>
                {["Intern","Department","Email","College","Performance","Status","Actions"].map(h=>(
                  <th key={h} style={{padding:"13px 18px",textAlign:"left",fontSize:11,color:T.muted,fontWeight:700,letterSpacing:.8,textTransform:"uppercase"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((intern,i)=>(
                <tr key={intern.id} className="hover-row" style={{borderBottom:`1px solid ${T.border}44`,transition:"background .15s"}}>
                  <td style={{padding:"14px 18px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:11}}>
                      <Avatar name={intern.name} size={34} color={intern.color}/>
                      <div>
                        <div style={{fontSize:13.5,fontWeight:700}}>{intern.name}</div>
                        <div style={{fontSize:11,color:T.muted}}>Since {intern.joined}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{padding:"14px 18px"}}><Badge color={intern.color}>{intern.dept}</Badge></td>
                  <td style={{padding:"14px 18px",fontSize:13,color:T.sub}}>{intern.email}</td>
                  <td style={{padding:"14px 18px",fontSize:13,color:T.sub,maxWidth:140,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{intern.college}</td>
                  <td style={{padding:"14px 18px",minWidth:140}}>
                    {intern.score>0?(
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <div style={{flex:1}}><ProgressBar value={intern.score} color={intern.score>85?T.green:intern.score>70?T.accent:T.red} height={5}/></div>
                        <span className="mono" style={{fontSize:12,color:intern.score>85?T.green:intern.score>70?T.accent:T.red,fontWeight:700}}>{intern.score}%</span>
                      </div>
                    ):<span style={{fontSize:12,color:T.muted}}>No test yet</span>}
                  </td>
                  <td style={{padding:"14px 18px"}}><Badge color={statusColor(intern.status)}>{intern.status}</Badge></td>
                  <td style={{padding:"14px 18px"}}>
                    <div style={{display:"flex",gap:6}}>
                      <Btn variant="outline" size="sm">View</Btn>
                      <Btn variant="danger"  size="sm" onClick={()=>setShowDelete(intern)}>🗑</Btn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   JOB POSTINGS
═══════════════════════════════════════════════════════════════════════════ */
function JobPostingsPage({ jobs, reloadJobs }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState({title:"",dept:"",openings:"",deadline:""});
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const validate = () => {
    const e={};
    if(!form.title.trim()) e.title="Job title required";
    if(!form.dept.trim())  e.dept="Department required";
    if(!form.openings||isNaN(form.openings)||+form.openings<1) e.openings="Enter valid number";
    if(!form.deadline)     e.deadline="Deadline required";
    return e;
  };

  const handleAdd = async () => {
    const e=validate();
    if(Object.keys(e).length){setErrors(e);return;}
    setLoading(true);
    try {
      await createJob({ title: form.title, department: form.dept, openings: +form.openings, deadline: form.deadline });
      reloadJobs();
      setForm({title:"",dept:"",openings:"",deadline:""});
      setErrors({});
      setShowForm(false);
    } catch (err) {
      setErrors({ title: err.message || "Failed to create posting" });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = async (id) => { await closeJob(id); reloadJobs(); };
  const handleDelete = async (id) => { await deleteJob(id); reloadJobs(); };

  const depts=["Engineering","Design","Marketing","Finance","HR","Operations","Sales","Data Analytics"];

  return (
    <div className="anim-fadeIn">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
        <div>
          <h1 style={{fontSize:24,fontWeight:800,letterSpacing:-.5}}>Job Postings</h1>
          <p style={{color:T.muted,fontSize:13,marginTop:4}}>{jobs.length} active postings</p>
        </div>
        <Btn onClick={()=>setShowForm(s=>!s)}>{showForm?"✕ Cancel":"+ New Posting"}</Btn>
      </div>

      {showForm && (
        <Card className="anim-fadeUp" style={{marginBottom:20,borderColor:T.accent+"44",background:`${T.accent}07`}}>
          <div style={{fontWeight:700,marginBottom:16,color:T.accent}}>📢 Create New Job Posting</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 16px"}}>
            <Input label="Job Title" value={form.title} onChange={e=>set("title",e.target.value)} placeholder="e.g. Frontend Developer" error={errors.title} required/>
            <Input label="Department" value={form.dept} onChange={e=>set("dept",e.target.value)} icon="🏢" error={errors.dept} required
              options={[{value:"",label:"Select department...",disabled:true},...depts.map(d=>({value:d,label:d}))]}/>
            <Input label="Number of Openings" type="number" value={form.openings} onChange={e=>set("openings",e.target.value)} placeholder="e.g. 3" icon="🔢" error={errors.openings} required/>
            <Input label="Application Deadline" type="date" value={form.deadline} onChange={e=>set("deadline",e.target.value)} error={errors.deadline} required/>
          </div>
          <Btn loading={loading} onClick={handleAdd}>{!loading&&"Publish Posting"}</Btn>
        </Card>
      )}

      {jobs.length===0 ? (
        <Card>
          <EmptyState icon="📢" title="No job postings yet" subtitle="Create your first job posting to start receiving intern applications."
            action={<Btn onClick={()=>setShowForm(true)}>+ Create First Posting</Btn>}/>
        </Card>
      ) : (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          {jobs.map((j,i)=>(
            <Card key={j.id} style={{cursor:"default"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                <div>
                  <div style={{fontWeight:800,fontSize:16,letterSpacing:-.3}}>{j.title}</div>
                  <div style={{marginTop:7}}><Badge color={T.purple}>{j.dept}</Badge></div>
                </div>
                <Badge color={j.status==="Active"?T.green:T.muted}>{j.status}</Badge>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:14}}>
                {[["Openings",j.openings,T.accent],["Applied",j.applied,T.blue],["Deadline",j.deadline,T.green]].map(([l,v,c])=>(
                  <div key={l} style={{background:T.surface,borderRadius:9,padding:"10px",textAlign:"center",border:`1px solid ${T.border}`}}>
                    <div style={{fontSize:18,fontWeight:800,color:c}} className="mono">{v}</div>
                    <div style={{fontSize:11,color:T.muted,marginTop:3}}>{l}</div>
                  </div>
                ))}
              </div>
              <ProgressBar value={j.applied} max={j.openings*15} color={T.blue} height={4}/>
              <div style={{display:"flex",gap:8,marginTop:12}}>
                <Btn variant="outline" size="sm" full>View Applicants</Btn>
                {j.status==="Active" && <Btn variant="ghost" size="sm" onClick={()=>handleClose(j.id)}>Close</Btn>}
                <Btn variant="danger" size="sm" onClick={()=>handleDelete(j.id)}>🗑</Btn>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   DEPARTMENTS PAGE
═══════════════════════════════════════════════════════════════════════════ */
function DepartmentsPage({ interns }) {
  const deptMap = interns.reduce((acc,i)=>{
    if(!acc[i.dept]) acc[i.dept]={count:0,scores:[]};
    acc[i.dept].count++;
    if(i.score>0) acc[i.dept].scores.push(i.score);
    return acc;
  },{});
  const depts = Object.entries(deptMap);
  const colors = [T.blue,T.purple,T.accent,T.green,T.red];

  return (
    <div className="anim-fadeIn">
      <div style={{marginBottom:22}}>
        <h1 style={{fontSize:24,fontWeight:800,letterSpacing:-.5}}>Departments</h1>
        <p style={{color:T.muted,fontSize:13,marginTop:4}}>{depts.length} active departments</p>
      </div>
      {depts.length===0 ? (
        <Card>
          <EmptyState icon="🏢" title="No departments yet" subtitle="Departments are created automatically when you add interns. Add interns with different departments to see them here."/>
        </Card>
      ) : (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          {depts.map(([name,data],i)=>{
            const avg = data.scores.length ? Math.round(data.scores.reduce((s,v)=>s+v,0)/data.scores.length) : null;
            const c = colors[i%colors.length];
            return (
              <Card key={name} style={{borderTop:`3px solid ${c}`}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
                  <div style={{fontWeight:800,fontSize:17}}>{name}</div>
                  <Badge color={c}>{data.count} Intern{data.count!==1?"s":""}</Badge>
                </div>
                <div style={{marginBottom:14}}>
                  <ProgressBar value={data.count} max={Math.max(...Object.values(deptMap).map(d=>d.count),1)} color={c}/>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  <div style={{background:T.surface,borderRadius:8,padding:"10px 14px",border:`1px solid ${T.border}`}}>
                    <div style={{fontSize:18,fontWeight:800,color:c}}>{data.count}</div>
                    <div style={{fontSize:11,color:T.muted}}>Total Interns</div>
                  </div>
                  <div style={{background:T.surface,borderRadius:8,padding:"10px 14px",border:`1px solid ${T.border}`}}>
                    <div style={{fontSize:18,fontWeight:800,color:avg?T.green:T.muted}}>{avg?`${avg}%`:"—"}</div>
                    <div style={{fontSize:11,color:T.muted}}>Avg Score</div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ANALYTICS PAGE
═══════════════════════════════════════════════════════════════════════════ */
function AnalyticsPage({ interns }) {
  const total   = interns.length;
  const scored  = interns.filter(i=>i.score>0);
  const avgScore= scored.length ? Math.round(scored.reduce((s,i)=>s+i.score,0)/scored.length) : 0;
  const offered = interns.filter(i=>i.status==="Offer Extended").length;
  const convRate= total ? Math.round((offered/total)*100) : 0;

  const ranges = [["90–100%",interns.filter(i=>i.score>=90).length,T.green],["75–89%",interns.filter(i=>i.score>=75&&i.score<90).length,T.accent],["60–74%",interns.filter(i=>i.score>=60&&i.score<75).length,T.blue],["Below 60%",interns.filter(i=>i.score>0&&i.score<60).length,T.red]];

  return (
    <div className="anim-fadeIn">
      <div style={{marginBottom:22}}>
        <h1 style={{fontSize:24,fontWeight:800,letterSpacing:-.5}}>Analytics</h1>
        <p style={{color:T.muted,fontSize:13,marginTop:4}}>Performance trends & hiring metrics</p>
      </div>
      <div style={{display:"flex",gap:14,marginBottom:24,flexWrap:"wrap"}}>
        <StatCard icon="👥" label="Total Interns"    value={total}            sub="All time"             color={T.blue}   delay={0}/>
        <StatCard icon="📊" label="Avg Performance"  value={avgScore?`${avgScore}%`:"—"} sub={scored.length?`${scored.length} tested`:"No tests yet"} color={T.accent} delay={60}/>
        <StatCard icon="✅" label="Offers Extended"  value={offered}          sub={`${convRate}% conversion`} color={T.green}  delay={120}/>
        <StatCard icon="🎓" label="Colleges"         value={[...new Set(interns.map(i=>i.college))].length} sub="Unique institutions" color={T.purple} delay={180}/>
      </div>
      {total===0 ? (
        <Card><EmptyState icon="📈" title="No data yet" subtitle="Analytics will appear here once you add interns and they start taking tests."/></Card>
      ) : (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <Card>
            <div style={{fontWeight:700,marginBottom:16}}>Score Distribution</div>
            {ranges.map(([range,n,c])=>(
              <div key={range} style={{marginBottom:13}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:5}}>
                  <span style={{color:T.sub}}>{range}</span>
                  <span className="mono" style={{color:c,fontWeight:700}}>{n} intern{n!==1?"s":""}</span>
                </div>
                <ProgressBar value={n} max={Math.max(total,1)} color={c}/>
              </div>
            ))}
          </Card>
          <Card>
            <div style={{fontWeight:700,marginBottom:16}}>Intern Status Breakdown</div>
            {[["Active",interns.filter(i=>i.status==="Active").length,T.green],["Under Review",interns.filter(i=>i.status==="Under Review").length,T.blue],["Offer Extended",interns.filter(i=>i.status==="Offer Extended").length,T.accent]].map(([s,n,c])=>(
              <div key={s} style={{display:"flex",alignItems:"center",gap:12,marginBottom:13}}>
                <div style={{width:10,height:10,borderRadius:"50%",background:c,flexShrink:0}}/>
                <div style={{flex:1,fontSize:13,color:T.sub}}>{s}</div>
                <div style={{flex:2}}><ProgressBar value={n} max={Math.max(total,1)} color={c} height={5}/></div>
                <span className="mono" style={{fontSize:12,color:c,fontWeight:700,minWidth:20}}>{n}</span>
              </div>
            ))}
            <div style={{marginTop:20,padding:"14px 16px",background:T.surface,borderRadius:10,border:`1px solid ${T.border}`}}>
              <div style={{fontSize:12,color:T.muted,marginBottom:4}}>Conversion Rate</div>
              <div style={{fontSize:28,fontWeight:800,color:convRate>20?T.green:convRate>10?T.accent:T.red}}>{convRate}%</div>
              <div style={{fontSize:12,color:T.muted,marginTop:2}}>{offered} of {total} interns received offers</div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SETTINGS PAGE
═══════════════════════════════════════════════════════════════════════════ */
function SettingsPage({ admin }) {
  const [tab, setTab] = useState("Profile");
  return (
    <div className="anim-fadeIn">
      <div style={{marginBottom:22}}>
        <h1 style={{fontSize:24,fontWeight:800,letterSpacing:-.5}}>Settings</h1>
        <p style={{color:T.muted,fontSize:13,marginTop:4}}>Manage your account & company preferences</p>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:20}}>
        {["Profile","Company","Notifications","Security"].map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{padding:"8px 18px",borderRadius:8,border:`1.5px solid ${tab===t?T.accent:T.border}`,background:tab===t?T.accent+"18":"transparent",color:tab===t?T.accent:T.muted,fontFamily:"'Outfit',sans-serif",fontWeight:600,fontSize:13,cursor:"pointer",transition:"all .2s"}}>{t}</button>
        ))}
      </div>
      <Card style={{maxWidth:560}}>
        {tab==="Profile" && (
          <>
            <div style={{display:"flex",gap:16,alignItems:"center",marginBottom:22,paddingBottom:18,borderBottom:`1px solid ${T.border}`}}>
              <Avatar name={admin?.name||"Admin"} size={60} color={T.accent}/>
              <div>
                <div style={{fontWeight:700,fontSize:17}}>{admin?.name||"Admin"}</div>
                <div style={{color:T.muted,fontSize:13}}>{admin?.email||"—"}</div>
                <button style={{marginTop:6,background:T.accent+"18",color:T.accent,border:"none",borderRadius:6,padding:"4px 12px",fontSize:12,cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontWeight:600}}>Change Photo</button>
              </div>
            </div>
            <Input label="Full Name" defaultValue={admin?.name||""}/>
            <Input label="Email" type="email" defaultValue={admin?.email||""}/>
            <Input label="Phone" defaultValue="" placeholder="+91 98765 43210"/>
            <Btn>Save Changes</Btn>
          </>
        )}
        {tab==="Company" && (
          <>
            <Input label="Company Name" placeholder="Your company name" icon="🏢"/>
            <Input label="Industry" placeholder="e.g. Technology"/>
            <Input label="Website" type="url" placeholder="https://yourcompany.com"/>
            <Input label="GST Number" placeholder="e.g. 27AAXCT1234A1Z5" hint="For invoicing & compliance"/>
            <Btn>Update Company Info</Btn>
          </>
        )}
        {tab==="Notifications" && (
          <div style={{display:"flex",flexDirection:"column",gap:2}}>
            {[["New intern application received",true],["Mock test results published",true],["Interview scheduled",true],["Offer acceptance notification",false],["Weekly performance digest",true]].map(([label,def],i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"13px 0",borderBottom:`1px solid ${T.border}44`}}>
                <span style={{fontSize:14}}>{label}</span>
                <input type="checkbox" defaultChecked={def} style={{width:18,height:18,accentColor:T.accent,cursor:"pointer"}}/>
              </div>
            ))}
            <Btn style={{marginTop:16}}>Save Preferences</Btn>
          </div>
        )}
        {tab==="Security" && (
          <>
            <Input label="Current Password" type="password" placeholder="••••••••" icon="🔒"/>
            <Input label="New Password" type="password" placeholder="Min 8 characters" icon="🔑" hint="Uppercase, number & special char"/>
            <Input label="Confirm New Password" type="password" placeholder="Re-enter" icon="🔐"/>
            <div style={{display:"flex",gap:10}}>
              <Btn>Update Password</Btn>
              <Btn variant="danger">Delete Account</Btn>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   DASHBOARD SHELL
═══════════════════════════════════════════════════════════════════════════ */
function AdminDashboard({ admin, onLogout }) {
  const [page, setPage]       = useState("Overview");
  const [interns, setInterns] = useState([]);
  const [jobs, setJobs]       = useState([]);
  const [loadError, setLoadError] = useState("");

  const reloadInterns = () => fetchInterns().then(res=>setInterns(res.data.map(mapIntern))).catch(err=>setLoadError(err.message));
  const reloadJobs = () => fetchJobs().then(res=>setJobs(res.data.map(mapJob))).catch(err=>setLoadError(err.message));

  useEffect(()=>{ reloadInterns(); reloadJobs(); }, []);

  const PAGE = {
    "Overview":     <OverviewPage     interns={interns} jobs={jobs}/>,
    "Interns":      <InternsPage      interns={interns} reloadInterns={reloadInterns}/>,
    "Departments":  <DepartmentsPage  interns={interns}/>,
    "Job Postings": <JobPostingsPage  jobs={jobs} reloadJobs={reloadJobs}/>,
    "Analytics":    <AnalyticsPage    interns={interns}/>,
    "Settings":     <SettingsPage     admin={admin}/>,
  };

  return (
    <div style={{display:"flex",flexDirection:"column",minHeight:"100vh"}}>
      <Topbar admin={admin}/>
      <div style={{display:"flex",flex:1}}>
        <Sidebar active={page} setActive={setPage} onLogout={onLogout}/>
        <div style={{flex:1,padding:"28px",overflowY:"auto",maxHeight:"calc(100vh - 58px)",background:T.bg}}>
          {loadError && <div style={{background:T.red+"18",color:T.red,border:`1px solid ${T.red}44`,borderRadius:10,padding:"10px 16px",marginBottom:16,fontSize:13}}>{loadError}</div>}
          {PAGE[page]||<OverviewPage interns={interns} jobs={jobs}/>}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ROOT
═══════════════════════════════════════════════════════════════════════════ */
export default function App() {
  const [screen, setScreen] = useState("login");
  const [admin,  setAdmin]  = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) { setCheckingSession(false); return; }
    fetch(`${process.env.REACT_APP_API_URL || "http://localhost:5000/api"}/auth/admin/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => {
        if (data?.success) { setAdmin(data.admin); setScreen("dashboard"); }
        else localStorage.removeItem("adminToken");
      })
      .catch(() => localStorage.removeItem("adminToken"))
      .finally(() => setCheckingSession(false));
  }, []);

  if (checkingSession) {
    return <><style>{GLOBAL_CSS}</style><div style={{minHeight:"100vh",background:T.bg}}/></>;
  }

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      {screen==="login"    && <LoginPage    onLogin={a=>{setAdmin(a);setScreen("dashboard");}} goRegister={()=>setScreen("register")}/>}
      {screen==="register" && <RegisterPage onRegister={()=>setScreen("login")} goLogin={()=>setScreen("login")}/>}
      {screen==="dashboard"&& <AdminDashboard admin={admin} onLogout={()=>{localStorage.removeItem("adminToken");setAdmin(null);setScreen("login");}}/>}
    </>
   );
}