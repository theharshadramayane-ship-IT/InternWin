import { useState, useEffect } from "react";
import {
  studentLogin,
  fetchMe,
  updateProfile,
  changePassword,
  fetchTasks,
  createTask,
  updateTaskStatus,
  deleteTask,
  fetchTests,
  submitTest,
  fetchActiveJobs,
  applyToJob,
  mapTask,
  mapTest,
  mapJob,
} from "./api";

/* ─── TOKENS ──────────────────────────────────────────────────────────────── */
const T = {
  bg:"#07090f", surface:"#0d1117", card:"#111827", border:"#1c2333",
  accent:"#22c55e", blue:"#3b82f6", yellow:"#f59e0b", red:"#ef4444",
  purple:"#a855f7", text:"#f1f5f9", muted:"#64748b", sub:"#94a3b8",
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  html, body, #root { height:100%; }
  body { font-family:'Outfit',sans-serif; background:${T.bg}; color:${T.text}; -webkit-font-smoothing:antialiased; }
  ::-webkit-scrollbar{width:5px} ::-webkit-scrollbar-track{background:transparent} ::-webkit-scrollbar-thumb{background:#1e2a3a;border-radius:99px}
  input:-webkit-autofill,input:-webkit-autofill:hover,input:-webkit-autofill:focus{
    -webkit-box-shadow:0 0 0 1000px ${T.card} inset!important;
    -webkit-text-fill-color:${T.text}!important;caret-color:${T.text};}
  .mono{font-family:'IBM Plex Mono',monospace;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes slideR{from{transform:translateX(-10px);opacity:0}to{transform:none;opacity:1}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
  .fu{animation:fadeUp .4s cubic-bezier(.22,.68,0,1.2) both}
  .fi{animation:fadeIn .3s ease both}
  .sr{animation:slideR .3s ease both}
  .hrow:hover{background:#1c233355!important}
`;

const mx = (...a) => Object.assign({}, ...a);
const Spin = () => <span style={{display:"inline-block",width:16,height:16,border:`2px solid ${T.accent}44`,borderTopColor:T.accent,borderRadius:"50%",animation:"spin .7s linear infinite"}}/>;

const Badge = ({ children, color=T.accent }) => (
  <span style={{background:color+"1a",color,border:`1px solid ${color}33`,borderRadius:4,padding:"2px 9px",fontSize:11,fontWeight:600,whiteSpace:"nowrap"}}>{children}</span>
);

const Avatar = ({ name="?", size=36, color=T.accent }) => {
  const ini = name.trim().split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
  return <div style={{width:size,height:size,borderRadius:"50%",background:`linear-gradient(135deg,${color}33,${color}11)`,border:`2px solid ${color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*.36,fontWeight:700,color,flexShrink:0}}>{ini}</div>;
};

const Bar = ({ value, max=100, color=T.accent, h=6 }) => (
  <div style={{background:T.border,borderRadius:99,height:h,overflow:"hidden",width:"100%"}}>
    <div style={{width:`${Math.min(100,(value/max)*100)}%`,background:`linear-gradient(90deg,${color},${color}88)`,height:"100%",borderRadius:99,transition:"width .6s"}}/>
  </div>
);

const Card = ({ children, style={}, className="" }) => (
  <div className={className} style={mx({background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:22},style)}>{children}</div>
);

const StatCard = ({ icon, label, value, sub, color=T.accent, delay=0 }) => (
  <Card className="fu" style={{flex:1,minWidth:140,animationDelay:`${delay}ms`}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
      <div>
        <div style={{fontSize:11,color:T.muted,fontWeight:600,letterSpacing:.8,textTransform:"uppercase",marginBottom:10}}>{label}</div>
        <div style={{fontSize:28,fontWeight:800,color,letterSpacing:-1}}>{value}</div>
        {sub&&<div style={{fontSize:12,color:T.sub,marginTop:5}}>{sub}</div>}
      </div>
      <div style={{background:color+"18",borderRadius:12,padding:"10px 12px",fontSize:20}}>{icon}</div>
    </div>
  </Card>
);

const Empty = ({ icon, title, sub, action }) => (
  <div style={{textAlign:"center",padding:"48px 20px"}}>
    <div style={{fontSize:50,marginBottom:14}}>{icon}</div>
    <div style={{fontSize:17,fontWeight:700,marginBottom:8}}>{title}</div>
    <div style={{fontSize:14,color:T.muted,marginBottom:22,maxWidth:300,margin:"0 auto 22px"}}>{sub}</div>
    {action}
  </div>
);

/* ─── INPUT ───────────────────────────────────────────────────────────────── */
const Input = ({ label, type="text", value, onChange, placeholder, icon, error, hint, required, options, readOnly }) => {
  const [focused, setFocused] = useState(false);
  const [show, setShow] = useState(false);
  const isP = type==="password";
  return (
    <div style={{marginBottom:15}}>
      {label&&<label style={{display:"block",fontSize:13,fontWeight:600,color:T.sub,marginBottom:6}}>
        {label}{required&&<span style={{color:T.accent,marginLeft:3}}>*</span>}
      </label>}
      <div style={{position:"relative"}}>
        {icon&&<span style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",fontSize:15,pointerEvents:"none",opacity:.5}}>{icon}</span>}
        {options
          ? <select value={value} onChange={onChange} onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
              style={{width:"100%",background:T.surface,border:`1.5px solid ${error?T.red:focused?T.accent:T.border}`,borderRadius:10,padding:`11px 14px 11px ${icon?"40px":"14px"}`,color:value?T.text:T.muted,fontSize:14,fontFamily:"'Outfit',sans-serif",outline:"none",cursor:"pointer",transition:"all .2s"}}>
              {options.map(o=><option key={o.value} value={o.value} disabled={o.disabled}>{o.label}</option>)}
            </select>
          : <input type={isP?(show?"text":"password"):type} value={value} onChange={onChange} placeholder={placeholder}
              onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)} readOnly={readOnly}
              style={{width:"100%",background:readOnly?T.border:T.surface,border:`1.5px solid ${error?T.red:focused?T.accent:T.border}`,borderRadius:10,padding:`11px ${isP?"44px":"14px"} 11px ${icon?"40px":"14px"}`,color:T.text,fontSize:14,fontFamily:"'Outfit',sans-serif",outline:"none",transition:"all .2s",boxShadow:focused&&!readOnly?`0 0 0 3px ${error?T.red:T.accent}1a`:"none"}}/>
        }
        {isP&&<button type="button" onClick={()=>setShow(s=>!s)} style={{position:"absolute",right:13,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:T.muted,cursor:"pointer",fontSize:15,padding:0}}>{show?"🙈":"👁️"}</button>}
      </div>
      {error&&<div style={{fontSize:12,color:T.red,marginTop:4}}>⚠ {error}</div>}
      {hint&&!error&&<div style={{fontSize:12,color:T.muted,marginTop:4}}>{hint}</div>}
    </div>
  );
};

const Btn = ({ children, onClick, variant="primary", size="md", loading, disabled, full, style={} }) => {
  const base={display:"inline-flex",alignItems:"center",justifyContent:"center",gap:8,borderRadius:10,fontFamily:"'Outfit',sans-serif",fontWeight:700,cursor:disabled||loading?"not-allowed":"pointer",border:"none",transition:"all .2s",width:full?"100%":"auto",opacity:disabled||loading?.6:1};
  const sz={sm:{padding:"7px 14px",fontSize:13},md:{padding:"11px 22px",fontSize:14},lg:{padding:"14px 32px",fontSize:16}};
  const vr={
    primary:{background:`linear-gradient(135deg,${T.accent},#16a34a)`,color:"#fff",boxShadow:`0 4px 18px ${T.accent}33`},
    ghost:{background:"transparent",color:T.sub,border:`1.5px solid ${T.border}`},
    danger:{background:`${T.red}1a`,color:T.red,border:`1.5px solid ${T.red}33`},
    outline:{background:"transparent",color:T.accent,border:`1.5px solid ${T.accent}55`},
    blue:{background:`linear-gradient(135deg,${T.blue},#2563eb)`,color:"#fff",boxShadow:`0 4px 18px ${T.blue}33`},
    yellow:{background:`${T.yellow}1a`,color:T.yellow,border:`1.5px solid ${T.yellow}44`},
  };
  return <button onClick={!disabled&&!loading?onClick:undefined} style={mx(base,sz[size],vr[variant],style)}>{loading?<Spin/>:children}</button>;
};

/* ═══════════════════════════════════════════════════════════════════════════
   LOGIN
═══════════════════════════════════════════════════════════════════════════ */
function LoginPage({ onLogin, goRegister }) {
  const [form, setForm] = useState({email:"",password:""});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const handle = async () => {
    const e={};
    if(!form.email) e.email="User ID required";
    if(!form.password) e.password="Password required";
    if(Object.keys(e).length){setErrors(e);return;}
    setLoading(true);
    try {
      const res = await studentLogin(form.email, form.password);
      localStorage.setItem("studentToken", res.token);
      onLogin(res.student);
    } catch (err) {
      setErrors({ password: err.message || "Invalid credentials" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{minHeight:"100vh",display:"flex",background:T.bg}}>
      <div style={{flex:1,background:`linear-gradient(160deg,#0d1117,#071007 60%,#050d05)`,display:"flex",flexDirection:"column",justifyContent:"space-between",padding:52,position:"relative",overflow:"hidden",borderRight:`1px solid ${T.border}`}}>
        {[{s:420,x:-100,y:-60,c:T.accent},{s:280,x:240,y:340,c:T.blue},{s:200,x:360,y:-30,c:T.purple}].map((c,i)=>(
          <div key={i} style={{position:"absolute",width:c.s,height:c.s,left:c.x,top:c.y,borderRadius:"50%",background:`radial-gradient(circle,${c.c}0f,transparent 70%)`,pointerEvents:"none"}}/>
        ))}
        <div style={{position:"absolute",inset:0,backgroundImage:`linear-gradient(${T.border}44 1px,transparent 1px),linear-gradient(90deg,${T.border}44 1px,transparent 1px)`,backgroundSize:"48px 48px",opacity:.3}}/>
        <div style={{position:"relative",display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:40,height:40,background:`linear-gradient(135deg,${T.accent},#16a34a)`,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,boxShadow:`0 4px 18px ${T.accent}44`}}>⚡</div>
          <span style={{fontSize:22,fontWeight:800,letterSpacing:-.5}}>SkillGate</span>
        </div>
        <div style={{position:"relative"}}>
          <div className="fu" style={{fontSize:12,color:T.accent,fontWeight:700,letterSpacing:2.5,textTransform:"uppercase",marginBottom:14}}>Student Portal</div>
          <h2 className="fu" style={{fontSize:42,fontWeight:900,lineHeight:1.12,letterSpacing:-1.5,animationDelay:"80ms"}}>
            Your Internship<br/>
            <span style={{background:`linear-gradient(90deg,${T.accent},#86efac)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Career Starts</span><br/>
            Right Here
          </h2>
          <p className="fu" style={{marginTop:18,fontSize:15,color:T.sub,lineHeight:1.75,maxWidth:380,animationDelay:"160ms"}}>
            Track your tasks, attempt mock tests, ace your interviews and land your dream job — all from one place.
          </p>
        </div>
        <div style={{position:"relative",display:"flex",gap:28}}>
          {[["🎯","Mock Tests"],["💼","Job Board"],["📊","Live Progress"]].map(([ic,lb],i)=>(
            <div key={lb} className="fu" style={{animationDelay:`${220+i*70}ms`,display:"flex",gap:8,alignItems:"center"}}>
              <span style={{fontSize:20}}>{ic}</span>
              <span style={{fontSize:13,color:T.sub,fontWeight:500}}>{lb}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{width:480,display:"flex",alignItems:"center",justifyContent:"center",padding:48}}>
        <div className="fu" style={{width:"100%",maxWidth:380}}>
          <div style={{marginBottom:32}}>
            <h3 style={{fontSize:26,fontWeight:800,letterSpacing:-.5}}>Student Login 🎓</h3>
            <p style={{color:T.muted,fontSize:14,marginTop:6}}>Sign in to your student account</p>
          </div>
          <Input label="Student User ID" type="text" value={form.email} onChange={e=>set("email",e.target.value)} placeholder="Provided by your admin" icon="📧" error={errors.email} required/>
          <Input label="Password" type="password" value={form.password} onChange={e=>set("password",e.target.value)} placeholder="Your password" icon="🔒" error={errors.password} required/>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
            <label style={{display:"flex",gap:8,alignItems:"center",cursor:"pointer",fontSize:13,color:T.sub}}>
              <input type="checkbox" defaultChecked style={{accentColor:T.accent}}/>Remember me
            </label>
            <button style={{background:"none",border:"none",color:T.accent,fontSize:13,cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>Forgot password?</button>
          </div>
          <Btn full loading={loading} onClick={handle} size="lg">{!loading&&"Sign In →"}</Btn>
          <div style={{textAlign:"center",marginTop:22,fontSize:13,color:T.muted}}>
            New student?{" "}
            <button onClick={goRegister} style={{background:"none",border:"none",color:T.accent,cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:13}}>Create account</button>
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
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({name:"",email:"",phone:"",college:"",course:"",year:"",dept:"",password:"",confirm:""});
  const [errors, setErrors] = useState({});
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const v1 = () => {
    const e={};
    if(!form.name.trim()) e.name="Name required";
    if(!form.email)       e.email="Email required";
    else if(!/\S+@\S+\.\S+/.test(form.email)) e.email="Invalid email";
    if(!form.phone)       e.phone="Phone required";
    if(!form.college.trim()) e.college="College required";
    return e;
  };
  const v2 = () => {
    const e={};
    if(!form.course.trim()) e.course="Course required";
    if(!form.year)          e.year="Select year";
    if(!form.dept)          e.dept="Select department";
    if(!form.password)      e.password="Password required";
    else if(form.password.length<8) e.password="Min 8 characters";
    if(form.password!==form.confirm) e.confirm="Passwords don't match";
    return e;
  };

  const next = () => {
    if(step===1){const e=v1();if(Object.keys(e).length){setErrors(e);return;}setErrors({});setStep(2);}
    else if(step===2){
      const e=v2();if(Object.keys(e).length){setErrors(e);return;}
      // NOTE: self-serve student signup isn't wired to the backend — student
      // accounts are created by an Admin (Interns → Add Intern) or via the
      // public "Apply" form. This just shows the confirmation UI.
      setErrors({});setStep(3);
    }
    else onRegister();
  };

  const years=["1st Year","2nd Year","3rd Year","4th Year","Final Year"];
  const depts=["Engineering","Design","Marketing","Finance","HR","Operations","Sales","Data Analytics"];

  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:T.bg,padding:24}}>
      <div style={{position:"fixed",width:500,height:500,borderRadius:"50%",background:`radial-gradient(circle,${T.accent}09,transparent 70%)`,top:-100,right:-100,pointerEvents:"none"}}/>
      <div className="fu" style={{width:"100%",maxWidth:540,background:T.card,border:`1px solid ${T.border}`,borderRadius:20,overflow:"hidden"}}>
        <div style={{padding:"24px 30px 20px",borderBottom:`1px solid ${T.border}`,background:`linear-gradient(135deg,${T.accent}09,transparent)`}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
            <div style={{width:36,height:36,background:`linear-gradient(135deg,${T.accent},#16a34a)`,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>⚡</div>
            <span style={{fontWeight:800,fontSize:18}}>SkillGate</span>
          </div>
          <h3 style={{fontSize:22,fontWeight:800,letterSpacing:-.5}}>Student Registration</h3>
          <p style={{color:T.muted,fontSize:13,marginTop:4}}>Create your account in 2 steps</p>
          <div style={{display:"flex",alignItems:"center",marginTop:20}}>
            {["Personal Info","Internship Details","Done!"].map((s,i)=>{
              const n=i+1,done=step>n,active=step===n;
              return(
                <div key={s} style={{display:"flex",alignItems:"center",flex:i<2?1:"auto"}}>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                    <div style={{width:26,height:26,borderRadius:"50%",background:done?T.accent:active?T.blue:T.border,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:(done||active)?"#fff":T.muted,transition:"all .3s"}}>{done?"✓":n}</div>
                    <div style={{fontSize:11,color:active?T.blue:done?T.accent:T.muted,fontWeight:active?700:400,whiteSpace:"nowrap"}}>{s}</div>
                  </div>
                  {i<2&&<div style={{flex:1,height:2,background:step>n?T.accent:T.border,margin:"0 8px",marginBottom:16,transition:"background .3s"}}/>}
                </div>
              );
            })}
          </div>
        </div>
        <div style={{padding:"24px 30px"}}>
          {step===1&&(
            <div className="sr">
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 16px"}}>
                <Input label="Full Name" value={form.name} onChange={e=>set("name",e.target.value)} placeholder="Your full name" icon="👤" error={errors.name} required/>
                <Input label="Phone" value={form.phone} onChange={e=>set("phone",e.target.value)} placeholder="+91 98765 43210" icon="📱" error={errors.phone} required/>
              </div>
              <Input label="Email Address" type="email" value={form.email} onChange={e=>set("email",e.target.value)} placeholder="student@email.com" icon="📧" error={errors.email} required/>
              <Input label="College / University" value={form.college} onChange={e=>set("college",e.target.value)} placeholder="e.g. Mumbai University" icon="🎓" error={errors.college} required/>
            </div>
          )}
          {step===2&&(
            <div className="sr">
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 16px"}}>
                <Input label="Course" value={form.course} onChange={e=>set("course",e.target.value)} placeholder="e.g. B.Tech CSE" icon="📚" error={errors.course} required/>
                <Input label="Year" value={form.year} onChange={e=>set("year",e.target.value)} icon="🗓️" error={errors.year} required
                  options={[{value:"",label:"Select year...",disabled:true},...years.map(y=>({value:y,label:y}))]}/>
              </div>
              <Input label="Internship Department" value={form.dept} onChange={e=>set("dept",e.target.value)} icon="🏢" error={errors.dept} required
                options={[{value:"",label:"Select department...",disabled:true},...depts.map(d=>({value:d,label:d}))]}/>
              <Input label="Password" type="password" value={form.password} onChange={e=>set("password",e.target.value)} placeholder="Minimum 8 characters" icon="🔒" error={errors.password} hint="Uppercase, number & special char" required/>
              <Input label="Confirm Password" type="password" value={form.confirm} onChange={e=>set("confirm",e.target.value)} placeholder="Re-enter password" icon="🔐" error={errors.confirm} required/>
            </div>
          )}
          {step===3&&(
            <div className="fi" style={{textAlign:"center",padding:"12px 0"}}>
              <div style={{fontSize:54,marginBottom:14}}>🎉</div>
              <h4 style={{fontSize:22,fontWeight:800}}>Request received!</h4>
              <p style={{color:T.muted,marginTop:8,fontSize:14,lineHeight:1.7}}>Self-serve signup isn't live yet, <strong style={{color:T.accent}}>{form.name}</strong> — apply via the careers page or ask your program admin to add you as an intern. You'll get a User ID and password to sign in below.</p>
              <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,padding:"14px 18px",marginTop:18,textAlign:"left",display:"flex",flexDirection:"column",gap:7}}>
                {[["Name",form.name],["Email",form.email],["College",form.college],["Department",form.dept]].map(([k,v])=>(
                  <div key={k} style={{display:"flex",justifyContent:"space-between",fontSize:13}}>
                    <span style={{color:T.muted}}>{k}</span><span style={{color:T.text,fontWeight:600}}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div style={{display:"flex",gap:10,marginTop:10}}>
            {step>1&&step<3&&<Btn variant="ghost" onClick={()=>setStep(s=>s-1)}>← Back</Btn>}
            <Btn full loading={loading&&step===2} onClick={next}>
              {step===1?"Next →":step===2?"Submit Request →":"Go to Login →"}
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
   TOPBAR + SIDEBAR
═══════════════════════════════════════════════════════════════════════════ */
function Topbar({ student, onLogout }) {
  return (
    <div style={{height:58,background:T.surface,borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 24px",position:"sticky",top:0,zIndex:50}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:34,height:34,background:`linear-gradient(135deg,${T.accent},#16a34a)`,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17}}>⚡</div>
        <span style={{fontWeight:800,fontSize:17,letterSpacing:-.5}}>SkillGate</span>
        <span className="mono" style={{fontSize:10,color:T.muted,background:T.border,padding:"2px 7px",borderRadius:4,marginLeft:2}}>Student</span>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:14}}>
        <Avatar name={student?.name||"S"} size={34} color={T.accent}/>
        <div>
          <div style={{fontSize:13,fontWeight:700,lineHeight:1.2}}>{student?.name||"Student"}</div>
          <div style={{fontSize:11,color:T.muted}}>Active Intern</div>
        </div>
        <button onClick={onLogout} style={{background:T.red+"18",color:T.red,border:`1px solid ${T.red}33`,borderRadius:8,padding:"6px 14px",fontSize:12,cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>Logout</button>
      </div>
    </div>
  );
}

const NAV=[
  {icon:"🏠",label:"Dashboard"}, {icon:"📋",label:"My Tasks"},
  {icon:"🎯",label:"Mock Tests"},{icon:"💼",label:"Job Board"},
  {icon:"📊",label:"My Progress"},{icon:"👤",label:"Profile"},
];

function Sidebar({ active, setActive }) {
  return (
    <div style={{width:220,background:T.surface,borderRight:`1px solid ${T.border}`,display:"flex",flexDirection:"column",minHeight:"calc(100vh - 58px)",padding:"16px 12px",flexShrink:0}}>
      <div style={{fontSize:10,color:T.muted,fontWeight:700,letterSpacing:1.2,textTransform:"uppercase",padding:"4px 14px",marginBottom:8}}>Menu</div>
      {NAV.map(item=>(
        <button key={item.label} onClick={()=>setActive(item.label)}
          style={{display:"flex",alignItems:"center",gap:11,padding:"10px 14px",borderRadius:10,background:active===item.label?`${T.accent}18`:"transparent",color:active===item.label?T.accent:T.muted,border:"none",cursor:"pointer",fontFamily:"'Outfit',sans-serif",fontSize:13.5,fontWeight:active===item.label?700:500,textAlign:"left",width:"100%",transition:"all .18s",position:"relative",marginBottom:2}}>
          {active===item.label&&<div style={{position:"absolute",left:0,top:"18%",height:"64%",width:3,background:T.accent,borderRadius:"0 3px 3px 0"}}/>}
          <span style={{fontSize:16}}>{item.icon}</span><span>{item.label}</span>
        </button>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   DASHBOARD HOME
═══════════════════════════════════════════════════════════════════════════ */
function DashboardHome({ student, tasks, tests, jobs, setPage }) {
  const done    = tasks.filter(t=>t.status==="Done").length;
  const passed  = tests.filter(t=>t.score!==null&&t.score>=60).length;
  const scored  = tests.filter(t=>t.score!==null);
  const avg     = scored.length?Math.round(scored.reduce((s,t)=>s+t.score,0)/scored.length):0;

  return (
    <div className="fi">
      <div style={{marginBottom:24}}>
        <h1 style={{fontSize:24,fontWeight:800,letterSpacing:-.5}}>Welcome, {student?.name||"Student"} 👋</h1>
        <p style={{color:T.muted,fontSize:13.5,marginTop:5}}>Here's your internship overview for today.</p>
      </div>

      {tasks.filter(t=>t.status==="Pending").length>0&&(
        <div className="fu" style={{background:`${T.yellow}12`,border:`1px solid ${T.yellow}44`,borderRadius:12,padding:"14px 18px",marginBottom:20,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontSize:13,color:T.yellow,fontWeight:700}}>⚠️ Pending Tasks</div>
            <div style={{fontSize:13,marginTop:3}}>You have <strong>{tasks.filter(t=>t.status==="Pending").length} pending task(s)</strong> — complete them on time!</div>
          </div>
          <Btn variant="yellow" size="sm" onClick={()=>setPage("My Tasks")}>View Tasks</Btn>
        </div>
      )}

      <div style={{display:"flex",gap:14,marginBottom:24,flexWrap:"wrap"}}>
        <StatCard icon="✅" label="Tasks Done"     value={`${done}/${tasks.length}`}   sub={tasks.length?"Keep it up!":"No tasks yet"}    color={T.accent} delay={0}/>
        <StatCard icon="🎯" label="Tests Passed"   value={`${passed}/${tests.length}`} sub={tests.length?"Good progress!":"No tests yet"}  color={T.blue}   delay={60}/>
        <StatCard icon="⭐" label="Avg Score"      value={avg?`${avg}%`:"—"}            sub={avg?"Overall performance":"No tests yet"}     color={T.yellow} delay={120}/>
        <StatCard icon="💼" label="Jobs Available" value={jobs.length}                  sub={jobs.length?"Apply now!":"Check back soon"}   color={T.purple} delay={180}/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <Card>
          <div style={{fontWeight:700,marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            Recent Tasks
            <button onClick={()=>setPage("My Tasks")} style={{background:"none",border:"none",color:T.accent,fontSize:12,cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>View all →</button>
          </div>
          {tasks.length===0
            ? <Empty icon="📋" title="No tasks yet" sub="Your assigned tasks will appear here"/>
            : tasks.slice(-4).reverse().map((t,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,marginBottom:11}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:t.status==="Done"?T.accent:t.status==="In Progress"?T.blue:T.yellow,flexShrink:0}}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:500}}>{t.title}</div>
                  <div style={{fontSize:11,color:T.muted}}>Due: {t.dueDate}</div>
                </div>
                <Badge color={t.status==="Done"?T.accent:t.status==="In Progress"?T.blue:T.yellow}>{t.status}</Badge>
              </div>
            ))
          }
        </Card>
        <Card>
          <div style={{fontWeight:700,marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            Test Results
            <button onClick={()=>setPage("Mock Tests")} style={{background:"none",border:"none",color:T.accent,fontSize:12,cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>View all →</button>
          </div>
          {tests.length===0
            ? <Empty icon="🎯" title="No tests yet" sub="Assigned mock tests will appear here"/>
            : tests.slice(-4).reverse().map((t,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                <div style={{background:T.surface,borderRadius:8,padding:"8px 10px",fontSize:15}}>🎯</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:600}}>{t.title}</div>
                  <div style={{fontSize:11,color:T.muted}}>{t.questions.length} questions · {t.duration} min</div>
                </div>
                {t.score!==null
                  ? <span className="mono" style={{fontSize:14,fontWeight:800,color:t.score>=75?T.accent:t.score>=60?T.yellow:T.red}}>{t.score}%</span>
                  : <Badge color={t.status==="Live"?T.blue:T.muted}>{t.status}</Badge>
                }
              </div>
            ))
          }
        </Card>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MY TASKS
═══════════════════════════════════════════════════════════════════════════ */
function MyTasksPage({ tasks, reloadTasks }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({title:"",dueDate:"",priority:"Medium",note:""});
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const addTask = async () => {
    if(!form.title.trim()){setErrors({title:"Task title required"});return;}
    if(!form.dueDate){setErrors({dueDate:"Due date required"});return;}
    setSaving(true);
    try {
      await createTask(form);
      reloadTasks();
      setForm({title:"",dueDate:"",priority:"Medium",note:""});setErrors({});setShowForm(false);
    } catch (err) {
      setErrors({ title: err.message || "Failed to add task" });
    } finally {
      setSaving(false);
    }
  };

  const upd = async (id,s) => { await updateTaskStatus(id,s); reloadTasks(); };
  const del = async (id)   => { await deleteTask(id); reloadTasks(); };
  const pc  = p => p==="High"?T.red:p==="Medium"?T.yellow:T.accent;

  return (
    <div className="fi">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
        <div>
          <h1 style={{fontSize:24,fontWeight:800,letterSpacing:-.5}}>My Tasks</h1>
          <p style={{color:T.muted,fontSize:13,marginTop:4}}>{tasks.length} total · {tasks.filter(t=>t.status==="Done").length} completed</p>
        </div>
        <Btn onClick={()=>setShowForm(s=>!s)}>{showForm?"✕ Cancel":"+ Add Task"}</Btn>
      </div>

      {showForm&&(
        <Card className="fu" style={{marginBottom:20,borderColor:T.accent+"44",background:`${T.accent}07`}}>
          <div style={{fontWeight:700,marginBottom:14,color:T.accent}}>📋 Add New Task</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 16px"}}>
            <Input label="Task Title" value={form.title} onChange={e=>set("title",e.target.value)} placeholder="What do you need to do?" error={errors.title} required/>
            <Input label="Due Date" type="date" value={form.dueDate} onChange={e=>set("dueDate",e.target.value)} error={errors.dueDate} required/>
          </div>
          <Input label="Priority" value={form.priority} onChange={e=>set("priority",e.target.value)}
            options={["High","Medium","Low"].map(p=>({value:p,label:`${p==="High"?"🔴":p==="Medium"?"🟡":"🟢"} ${p} Priority`}))}/>
          <Input label="Notes (optional)" value={form.note} onChange={e=>set("note",e.target.value)} placeholder="Any extra details..."/>
          <Btn loading={saving} onClick={addTask}>{!saving&&"Save Task ✓"}</Btn>
        </Card>
      )}

      {tasks.length===0
        ? <Card><Empty icon="📋" title="No tasks yet" sub="Add your first task to start tracking your work." action={<Btn onClick={()=>setShowForm(true)}>+ Add First Task</Btn>}/></Card>
        : <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {tasks.map((t,i)=>(
              <Card key={t.id} className="fu" style={{animationDelay:`${i*40}ms`,padding:"16px 20px"}}>
                <div style={{display:"flex",alignItems:"flex-start",gap:14}}>
                  <button onClick={()=>upd(t.id,t.status==="Done"?"Pending":"Done")}
                    style={{width:20,height:20,borderRadius:5,border:`2px solid ${t.status==="Done"?T.accent:T.border}`,background:t.status==="Done"?T.accent:"transparent",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:11,color:"#fff",flexShrink:0,marginTop:2,transition:"all .2s"}}>
                    {t.status==="Done"&&"✓"}
                  </button>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14,fontWeight:600,textDecoration:t.status==="Done"?"line-through":"none",color:t.status==="Done"?T.muted:T.text}}>{t.title}</div>
                    {t.note&&<div style={{fontSize:12,color:T.muted,marginTop:3}}>{t.note}</div>}
                    <div style={{fontSize:12,color:T.muted,marginTop:5}}>📅 Due: {t.dueDate}</div>
                  </div>
                  <Badge color={pc(t.priority)}>{t.priority}</Badge>
                  <div style={{display:"flex",gap:6}}>
                    {t.status!=="Done"&&<button onClick={()=>upd(t.id,"In Progress")} style={{background:T.blue+"18",color:T.blue,border:"none",borderRadius:6,padding:"5px 10px",fontSize:11,cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>In Progress</button>}
                    <button onClick={()=>del(t.id)} style={{background:T.red+"18",color:T.red,border:"none",borderRadius:6,padding:"5px 8px",fontSize:12,cursor:"pointer"}}>🗑</button>
                  </div>
                </div>
                {t.status==="In Progress"&&<div style={{marginTop:10,marginLeft:34}}><Bar value={50} color={T.blue} h={4}/></div>}
              </Card>
            ))}
          </div>
      }
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LIVE TEST
═══════════════════════════════════════════════════════════════════════════ */
function LiveTest({ test, onFinish }) {
  const [qIdx, setQIdx]       = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTime]   = useState(test.duration*60);
  const [submitted, setSub]   = useState(false);

  useEffect(()=>{
    if(submitted) return;
    const t=setInterval(()=>setTime(s=>{if(s<=1){clearInterval(t);submit();return 0;}return s-1;}),1000);
    return ()=>clearInterval(t);
  },[submitted]);

  const submit = () => {
    setSub(true);
    onFinish(answers);
  };

  const mm=String(Math.floor(timeLeft/60)).padStart(2,"0");
  const ss=String(timeLeft%60).padStart(2,"0");
  const tc=timeLeft<60?T.red:timeLeft<180?T.yellow:T.accent;
  const q=test.questions[qIdx];

  if(submitted) return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"60vh"}}>
      <div style={{fontSize:64,marginBottom:16}}>⏳</div>
      <div style={{fontSize:20,fontWeight:800}}>Submitting...</div>
    </div>
  );

  return (
    <div className="fi" style={{maxWidth:680,margin:"0 auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
        <div>
          <h2 style={{fontSize:20,fontWeight:800}}>{test.title}</h2>
          <div style={{color:T.muted,fontSize:13,marginTop:3}}>{test.questions.length} questions · {test.duration} min</div>
        </div>
        <div style={{background:T.card,border:`1.5px solid ${tc}44`,borderRadius:10,padding:"10px 18px",textAlign:"center"}}>
          <div className="mono" style={{fontSize:22,fontWeight:800,color:tc}}>{mm}:{ss}</div>
          <div style={{fontSize:11,color:T.muted}}>remaining</div>
        </div>
      </div>
      <div style={{marginBottom:20}}>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:T.muted,marginBottom:6}}>
          <span>Question {qIdx+1} of {test.questions.length}</span>
          <span>{Object.keys(answers).length} answered</span>
        </div>
        <Bar value={qIdx+1} max={test.questions.length} color={T.blue} h={5}/>
      </div>
      <Card style={{marginBottom:16}}>
        <div style={{fontSize:11,color:T.blue,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:12}}>Question {qIdx+1}</div>
        <div style={{fontSize:17,fontWeight:600,lineHeight:1.55,marginBottom:22}}>{q.question}</div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {q.options.map((opt,i)=>(
            <button key={i} onClick={()=>setAnswers(a=>({...a,[qIdx]:i}))}
              style={{display:"flex",alignItems:"center",gap:12,padding:"13px 16px",borderRadius:10,border:`1.5px solid ${answers[qIdx]===i?T.blue:T.border}`,background:answers[qIdx]===i?T.blue+"18":T.surface,cursor:"pointer",textAlign:"left",transition:"all .18s",fontFamily:"'Outfit',sans-serif"}}>
              <div style={{width:28,height:28,borderRadius:"50%",border:`2px solid ${answers[qIdx]===i?T.blue:T.border}`,background:answers[qIdx]===i?T.blue:"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:answers[qIdx]===i?"#fff":T.muted,flexShrink:0}}>
                {String.fromCharCode(65+i)}
              </div>
              <span style={{fontSize:14,color:answers[qIdx]===i?T.text:T.sub}}>{opt}</span>
            </button>
          ))}
        </div>
      </Card>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <Btn variant="ghost" onClick={()=>setQIdx(q=>Math.max(0,q-1))} disabled={qIdx===0}>← Previous</Btn>
        <div style={{display:"flex",gap:5,flexWrap:"wrap",maxWidth:300}}>
          {test.questions.map((_,i)=>(
            <button key={i} onClick={()=>setQIdx(i)}
              style={{width:28,height:28,borderRadius:6,border:`1.5px solid ${answers[i]!==undefined?T.accent:i===qIdx?T.blue:T.border}`,background:answers[i]!==undefined?T.accent+"22":i===qIdx?T.blue+"22":"transparent",color:answers[i]!==undefined?T.accent:i===qIdx?T.blue:T.muted,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>
              {i+1}
            </button>
          ))}
        </div>
        {qIdx<test.questions.length-1
          ? <Btn variant="blue" onClick={()=>setQIdx(q=>q+1)}>Next →</Btn>
          : <Btn onClick={submit}>Submit ✓</Btn>
        }
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MOCK TESTS PAGE
═══════════════════════════════════════════════════════════════════════════ */
function MockTestsPage({ tests, reloadTests }) {
  const [active, setActive] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const onFinish = async (answers) => {
    try {
      const res = await submitTest(active.id, answers);
      setResult({test:active,score:res.score});
      setActive(null);
      reloadTests();
    } catch (err) {
      setError(err.message || "Failed to submit test");
      setActive(null);
    }
  };

  if(active) return <LiveTest test={active} onFinish={onFinish}/>;

  if(result) return (
    <div className="fi" style={{maxWidth:440,margin:"0 auto",textAlign:"center",paddingTop:40}}>
      <Card>
        <div style={{fontSize:56,marginBottom:16}}>{result.score>=75?"🏆":result.score>=60?"👍":"💪"}</div>
        <div style={{fontSize:22,fontWeight:800,marginBottom:6}}>{result.test.title}</div>
        <div style={{fontSize:52,fontWeight:900,color:result.score>=75?T.accent:result.score>=60?T.yellow:T.red,margin:"20px 0"}} className="mono">{result.score}%</div>
        <div style={{fontSize:14,color:T.muted,marginBottom:16}}>
          {result.score>=75?"Excellent! You passed with distinction 🎉":result.score>=60?"Good job! You passed.":"Keep practicing! Better luck next time."}
        </div>
        <div style={{background:T.surface,borderRadius:10,padding:"12px 16px",marginBottom:20,border:`1px solid ${T.border}`}}>
          <div style={{fontSize:12,color:T.muted}}>Pass Cutoff</div>
          <div style={{fontSize:20,fontWeight:700,color:T.blue}}>60%</div>
        </div>
        <Btn full onClick={()=>setResult(null)}>← Back to Tests</Btn>
      </Card>
    </div>
  );

  return (
    <div className="fi">
      {error && <div style={{background:T.red+"18",color:T.red,border:`1px solid ${T.red}44`,borderRadius:10,padding:"10px 16px",marginBottom:16,fontSize:13}}>{error}</div>}
      <div style={{marginBottom:22}}>
        <h1 style={{fontSize:24,fontWeight:800,letterSpacing:-.5}}>Mock Tests</h1>
        <p style={{color:T.muted,fontSize:13,marginTop:4}}>{tests.filter(t=>t.status==="Live").length} test(s) available · {tests.filter(t=>t.score!==null).length} completed</p>
      </div>
      {tests.length===0
        ? <Card><Empty icon="🎯" title="No tests assigned yet" sub="Your HR will assign mock tests. They will appear here once they go live."/></Card>
        : <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            {tests.map((t,i)=>(
              <Card key={t.id} className="fu" style={{animationDelay:`${i*60}ms`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                  <div style={{fontWeight:800,fontSize:16}}>{t.title}</div>
                  <Badge color={t.status==="Live"?T.accent:t.status==="Completed"?T.blue:T.muted}>{t.status}</Badge>
                </div>
                <div style={{display:"flex",gap:14,color:T.muted,fontSize:12,marginBottom:16}}>
                  <span>📝 {t.questions.length} Qs</span>
                  <span>⏱️ {t.duration} min</span>
                </div>
                {t.score!==null
                  ? <>
                      <div style={{marginBottom:8}}>
                        <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:5}}>
                          <span style={{color:T.muted}}>Your Score</span>
                          <span className="mono" style={{fontWeight:700,color:t.score>=75?T.accent:t.score>=60?T.yellow:T.red}}>{t.score}%</span>
                        </div>
                        <Bar value={t.score} color={t.score>=75?T.accent:t.score>=60?T.yellow:T.red}/>
                      </div>
                      <div style={{fontSize:12,color:t.score>=60?T.accent:T.red}}>{t.score>=60?"✅ Passed":"❌ Below cutoff (60%)"}</div>
                    </>
                  : <Btn full variant={t.status==="Live"?"primary":"ghost"} disabled={t.status!=="Live"} onClick={()=>t.status==="Live"&&setActive(t)}>
                      {t.status==="Live"?"Start Test →":"Not Available Yet"}
                    </Btn>
                }
              </Card>
            ))}
          </div>
      }
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   JOB BOARD
═══════════════════════════════════════════════════════════════════════════ */
function JobBoardPage({ jobs }) {
  const [search, setSearch] = useState("");
  const [applied, setApplied] = useState([]);
  const [applying, setApplying] = useState(null);

  const filtered = jobs.filter(j=>
    j.title.toLowerCase().includes(search.toLowerCase())||
    j.dept.toLowerCase().includes(search.toLowerCase())
  );

  const apply = async (id) => {
    setApplying(id);
    try {
      await applyToJob(id);
      setApplied(a=>[...a,id]);
    } catch { /* ignore — Apply stays clickable so the student can retry */ }
    finally { setApplying(null); }
  };

  return (
    <div className="fi">
      <div style={{marginBottom:22}}>
        <h1 style={{fontSize:24,fontWeight:800,letterSpacing:-.5}}>Job Board 💼</h1>
        <p style={{color:T.muted,fontSize:13,marginTop:4}}>{jobs.length} opportunit{jobs.length===1?"y":"ies"} · {applied.length} applied</p>
      </div>
      {jobs.length>0&&(
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍  Search jobs..."
          style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:9,padding:"9px 14px",color:T.text,fontSize:13,fontFamily:"'Outfit',sans-serif",outline:"none",width:260,marginBottom:18,display:"block"}}/>
      )}
      {jobs.length===0
        ? <Card><Empty icon="💼" title="No jobs posted yet" sub="Your company admin will post job openings here. Check back soon!"/></Card>
        : filtered.length===0
          ? <Card><Empty icon="🔍" title="No results" sub="Try a different search."/></Card>
          : <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {filtered.map((j,i)=>{
                const isApplied=applied.includes(j.id);
                return (
                  <Card key={j.id} className="fu" style={{animationDelay:`${i*50}ms`,display:"flex",alignItems:"center",gap:18}}>
                    <div style={{width:50,height:50,background:T.purple+"22",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>💼</div>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:800,fontSize:15}}>{j.title}</div>
                      <div style={{fontSize:13,color:T.muted,marginTop:3}}>{j.openings} opening{j.openings===1?"":"s"}</div>
                      <div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap"}}>
                        <Badge color={T.purple}>{j.dept}</Badge>
                      </div>
                    </div>
                    <div style={{textAlign:"center",minWidth:90}}>
                      <div style={{fontSize:11,color:T.muted,marginBottom:3}}>Deadline</div>
                      <div style={{fontSize:13,fontWeight:700,color:T.yellow}}>{j.deadline}</div>
                    </div>
                    <Btn variant={isApplied?"ghost":"primary"} disabled={isApplied} loading={applying===j.id} onClick={()=>apply(j.id)}>
                      {isApplied?"✓ Applied":!applying&&"Apply Now"}
                    </Btn>
                  </Card>
                );
              })}
            </div>
      }
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MY PROGRESS
═══════════════════════════════════════════════════════════════════════════ */
function MyProgressPage({ tasks, tests }) {
  const done    = tasks.filter(t=>t.status==="Done").length;
  const total   = tasks.length;
  const scored  = tests.filter(t=>t.score!==null);
  const avg     = scored.length?Math.round(scored.reduce((s,t)=>s+t.score,0)/scored.length):0;
  const passed  = scored.filter(t=>t.score>=60).length;
  const pct     = total?Math.round((done/total)*100):0;
  const circ    = 2*Math.PI*45;

  return (
    <div className="fi">
      <div style={{marginBottom:22}}>
        <h1 style={{fontSize:24,fontWeight:800,letterSpacing:-.5}}>My Progress 📊</h1>
        <p style={{color:T.muted,fontSize:13,marginTop:4}}>Your overall internship performance</p>
      </div>
      <div style={{display:"flex",gap:14,marginBottom:24,flexWrap:"wrap"}}>
        <StatCard icon="✅" label="Tasks Done"     value={`${done}/${total}`}              sub={total?`${pct}% done`:"No tasks"}          color={T.accent} delay={0}/>
        <StatCard icon="🎯" label="Tests Taken"    value={scored.length}                   sub={`${passed} passed`}                       color={T.blue}   delay={60}/>
        <StatCard icon="⭐" label="Avg Score"      value={avg?`${avg}%`:"—"}               sub={avg>=75?"Excellent!":avg?"Keep going!":"No tests"} color={T.yellow} delay={120}/>
        <StatCard icon="🏆" label="Pass Rate"      value={scored.length?`${Math.round((passed/scored.length)*100)}%`:"—"} sub="60% cutoff" color={T.purple} delay={180}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <Card>
          <div style={{fontWeight:700,marginBottom:16}}>Task Completion</div>
          {total===0
            ? <Empty icon="📋" title="No tasks yet" sub="Add tasks to track progress"/>
            : <>
                <div style={{display:"flex",justifyContent:"center",marginBottom:18}}>
                  <div style={{position:"relative",width:120,height:120}}>
                    <svg width="120" height="120" style={{transform:"rotate(-90deg)"}}>
                      <circle cx="60" cy="60" r="45" fill="none" stroke={T.border} strokeWidth="10"/>
                      <circle cx="60" cy="60" r="45" fill="none" stroke={T.accent} strokeWidth="10"
                        strokeDasharray={circ} strokeDashoffset={circ-(circ*(done/total))}
                        strokeLinecap="round" style={{transition:"stroke-dashoffset .8s"}}/>
                    </svg>
                    <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                      <div className="mono" style={{fontSize:22,fontWeight:800,color:T.accent}}>{pct}%</div>
                      <div style={{fontSize:10,color:T.muted}}>Done</div>
                    </div>
                  </div>
                </div>
                {[["Done",tasks.filter(t=>t.status==="Done").length,T.accent],["In Progress",tasks.filter(t=>t.status==="In Progress").length,T.blue],["Pending",tasks.filter(t=>t.status==="Pending").length,T.yellow]].map(([l,n,c])=>(
                  <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                    <div style={{display:"flex",gap:8,alignItems:"center"}}>
                      <div style={{width:8,height:8,borderRadius:"50%",background:c}}/>
                      <span style={{fontSize:13,color:T.sub}}>{l}</span>
                    </div>
                    <span className="mono" style={{fontSize:13,fontWeight:700,color:c}}>{n}</span>
                  </div>
                ))}
              </>
          }
        </Card>
        <Card>
          <div style={{fontWeight:700,marginBottom:16}}>Test Scores</div>
          {scored.length===0
            ? <Empty icon="🎯" title="No scores yet" sub="Complete tests to see your performance"/>
            : <>
                {scored.map((t,i)=>(
                  <div key={i} style={{marginBottom:14}}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:5}}>
                      <span style={{color:T.sub,maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.title}</span>
                      <span className="mono" style={{fontWeight:700,color:t.score>=75?T.accent:t.score>=60?T.yellow:T.red}}>{t.score}%</span>
                    </div>
                    <Bar value={t.score} color={t.score>=75?T.accent:t.score>=60?T.yellow:T.red} h={5}/>
                  </div>
                ))}
                <div style={{marginTop:16,background:T.surface,borderRadius:10,padding:"12px 14px",border:`1px solid ${T.border}`}}>
                  <div style={{fontSize:12,color:T.muted}}>Overall Average</div>
                  <div style={{fontSize:26,fontWeight:800,color:avg>=75?T.accent:avg>=60?T.yellow:T.red}} className="mono">{avg}%</div>
                </div>
              </>
          }
        </Card>
      </div>
    </div>
  ); 
}

/* ═══════════════════════════════════════════════════════════════════════════
   PROFILE
═══════════════════════════════════════════════════════════════════════════ */
function ProfilePage({ student }) {
  const [tab, setTab] = useState("Profile");
  const [name, setName] = useState(student?.name||"");
  const [phone, setPhone] = useState(student?.phone||"");
  const [college, setCollege] = useState(student?.college||"");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState("");
  const [errors, setErrors] = useState({});

  const [pw, setPw] = useState({current:"",next:"",confirm:""});
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState("");

  const saveProfile = async () => {
    setSaving(true); setSaved("");
    try {
      await updateProfile({ name, phone, college });
      setSaved("Profile updated ✓");
    } catch (err) {
      setErrors({ save: err.message || "Failed to update profile" });
    } finally {
      setSaving(false);
    }
  };

  const savePassword = async () => {
    if(pw.next!==pw.confirm){setPwMsg("New passwords don't match");return;}
    if(pw.next.length<8){setPwMsg("New password must be 8+ characters");return;}
    setPwSaving(true); setPwMsg("");
    try {
      await changePassword(pw.current, pw.next);
      setPwMsg("Password updated ✓");
      setPw({current:"",next:"",confirm:""});
    } catch (err) {
      setPwMsg(err.message || "Failed to update password");
    } finally {
      setPwSaving(false);
    }
  };

  return (
    <div className="fi">
      <div style={{marginBottom:22}}>
        <h1 style={{fontSize:24,fontWeight:800,letterSpacing:-.5}}>My Profile</h1>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:20}}>
        {["Profile","Security"].map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{padding:"8px 18px",borderRadius:8,border:`1.5px solid ${tab===t?T.accent:T.border}`,background:tab===t?T.accent+"18":"transparent",color:tab===t?T.accent:T.muted,fontFamily:"'Outfit',sans-serif",fontWeight:600,fontSize:13,cursor:"pointer",transition:"all .2s"}}>{t}</button>
        ))}
      </div>
      <Card style={{maxWidth:520}}>
        {tab==="Profile"&&(
          <>
            <div style={{display:"flex",gap:16,alignItems:"center",marginBottom:22,paddingBottom:18,borderBottom:`1px solid ${T.border}`}}>
              <Avatar name={student?.name||"S"} size={64} color={T.accent}/>
              <div>
                <div style={{fontWeight:700,fontSize:18}}>{student?.name||"Student"}</div>
                <div style={{color:T.muted,fontSize:13}}>{student?.email}</div>
                <div style={{marginTop:6}}><Badge color={T.accent}>Active Intern</Badge></div>
              </div>
            </div>
            {saved && <div style={{background:T.accent+"18",color:T.accent,border:`1px solid ${T.accent}44`,borderRadius:10,padding:"10px 16px",marginBottom:16,fontSize:13}}>{saved}</div>}
            {errors.save && <div style={{background:T.red+"18",color:T.red,border:`1px solid ${T.red}44`,borderRadius:10,padding:"10px 16px",marginBottom:16,fontSize:13}}>{errors.save}</div>}
            <Input label="Full Name"  value={name} onChange={e=>setName(e.target.value)} icon="👤"/>
            <Input label="Email"      type="email" value={student?.email||""} onChange={()=>{}} icon="📧" readOnly/>
            <Input label="Phone"      value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+91 98765 43210" icon="📱"/>
            <Input label="College"    value={college} onChange={e=>setCollege(e.target.value)} placeholder="Your college name" icon="🎓"/>
            <Btn loading={saving} onClick={saveProfile}>{!saving&&"Save Changes"}</Btn>
          </>
        )}
        {tab==="Security"&&(
          <>
            {pwMsg && <div style={{background:pwMsg.includes("✓")?T.accent+"18":T.red+"18",color:pwMsg.includes("✓")?T.accent:T.red,border:`1px solid ${pwMsg.includes("✓")?T.accent:T.red}44`,borderRadius:10,padding:"10px 16px",marginBottom:16,fontSize:13}}>{pwMsg}</div>}
            <Input label="Current Password" type="password" value={pw.current} onChange={e=>setPw(p=>({...p,current:e.target.value}))} placeholder="••••••••" icon="🔒"/>
            <Input label="New Password" type="password" value={pw.next} onChange={e=>setPw(p=>({...p,next:e.target.value}))} placeholder="Min 8 characters" icon="🔑" hint="Uppercase, number & special char"/>
            <Input label="Confirm Password" type="password" value={pw.confirm} onChange={e=>setPw(p=>({...p,confirm:e.target.value}))} placeholder="Re-enter" icon="🔐"/>
            <Btn loading={pwSaving} onClick={savePassword}>{!pwSaving&&"Update Password"}</Btn>
          </>
        )}
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   STUDENT DASHBOARD SHELL
═══════════════════════════════════════════════════════════════════════════ */
function StudentDashboard({ student, onLogout }) {
  const [page, setPage]     = useState("Dashboard");
  const [tasks, setTasks]   = useState([]);
  const [tests, setTests]   = useState([]);
  const [jobs, setJobs]     = useState([]);
  const [loadError, setLoadError] = useState("");

  const reloadTasks = () => fetchTasks().then(res=>setTasks(res.data.map(mapTask))).catch(err=>setLoadError(err.message));
  const reloadTests = () => fetchTests().then(res=>setTests(res.data.map(mapTest))).catch(err=>setLoadError(err.message));
  const reloadJobs  = () => fetchActiveJobs().then(res=>setJobs(res.data.map(mapJob))).catch(err=>setLoadError(err.message));

  useEffect(()=>{ reloadTasks(); reloadTests(); reloadJobs(); }, []);

  const PAGE = {
    "Dashboard":   <DashboardHome  student={student} tasks={tasks} tests={tests} jobs={jobs} setPage={setPage}/>,
    "My Tasks":    <MyTasksPage    tasks={tasks} reloadTasks={reloadTasks}/>,
    "Mock Tests":  <MockTestsPage  tests={tests} reloadTests={reloadTests}/>,
    "Job Board":   <JobBoardPage   jobs={jobs}/>,
    "My Progress": <MyProgressPage tasks={tasks} tests={tests}/>,
    "Profile":     <ProfilePage    student={student}/>,
  };

  return (
    <div style={{display:"flex",flexDirection:"column",minHeight:"100vh"}}>
      <Topbar student={student} onLogout={onLogout}/>
      <div style={{display:"flex",flex:1}}>
        <Sidebar active={page} setActive={setPage}/>
        <div style={{flex:1,padding:28,overflowY:"auto",maxHeight:"calc(100vh - 58px)",background:T.bg}}>
          {loadError && <div style={{background:T.red+"18",color:T.red,border:`1px solid ${T.red}44`,borderRadius:10,padding:"10px 16px",marginBottom:16,fontSize:13}}>{loadError}</div>}
          {PAGE[page]}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ROOT
═══════════════════════════════════════════════════════════════════════════ */
export default function App() {
  const [screen, setScreen]   = useState("login");
  const [student, setStudent] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("studentToken");
    if (!token) { setCheckingSession(false); return; }
    fetchMe()
      .then(res => { setStudent(res.student); setScreen("dashboard"); })
      .catch(() => localStorage.removeItem("studentToken"))
      .finally(() => setCheckingSession(false));
  }, []);

  if (checkingSession) {
    return <><style>{CSS}</style><div style={{minHeight:"100vh",background:T.bg}}/></>;
  }

  return (
    <>
      <style>{CSS}</style>
      {screen==="login"    && <LoginPage    onLogin={s=>{setStudent(s);setScreen("dashboard");}} goRegister={()=>setScreen("register")}/>}
      {screen==="register" && <RegisterPage onRegister={()=>setScreen("login")} goLogin={()=>setScreen("login")}/>}
      {screen==="dashboard"&& <StudentDashboard student={student} onLogout={()=>{localStorage.removeItem("studentToken");setStudent(null);setScreen("login");}}/>}
    </>
  );
}