/* Orbital Scrapbook: asymmetric masonry wall, catalog annotations, and tactile paper-card interactions. */
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Archive, ArrowUpRight, BookOpen, Brain, ChevronDown, CircleHelp, Command, Compass, Copy, ExternalLink,
  FileText, FolderOpen, GitBranch, Hash, Image as ImageIcon, Link2, Menu, MoreHorizontal, MoveUpRight,
  Network, Plus, Search, Send, Share2, Sparkles, Tag, Trash2, Upload, UserRound, X, Zap
} from "lucide-react";

type Idea = { id:number; title:string; description:string; tags:string[]; kind:string; color:string; image?:string; meta:string; note?:string; };
const images = {
  mirror: "/manus-storage/idea-smart-mirror_40d6c372.jpg",
  city: "/manus-storage/idea-circular-city_e7021494.jpg",
  robot: "/manus-storage/idea-robot-arm_145208e4.jpg",
  mushroom: "/manus-storage/idea-mushroom-network_7bcaa3a6.jpg",
};
const seedIdeas: Idea[] = [
  {id:1,title:"The mirror that remembers",description:"What if your mirror could understand your routine — and gently reroute it?",tags:["hardware","AI","IoT"],kind:"FIELD NOTE 014",color:"lime",image:images.mirror,meta:"edited 12 min ago",note:"A softer kind of personal dashboard. No graphs. Just useful timing."},
  {id:2,title:"A city that folds inward",description:"Circular neighborhoods where every errand is a five-minute walk.",tags:["urbanism","future"],kind:"SCRAP 027",color:"coral",image:images.city,meta:"added yesterday"},
  {id:3,title:"Teach a robot to be gentle",description:"Small movements, huge consequences. Exploring compliant joints for home robots.",tags:["robotics","research"],kind:"LAB LOG 203",color:"blue",image:images.robot,meta:"edited 2 days ago"},
  {id:4,title:"A note on impossible things",description:"The best ideas arrive before their vocabulary does.",tags:["writing","mindset"],kind:"MARGIN NOTE",color:"paper",meta:"added 3 days ago",note:"Keep the rough edges. They are probably telling you where to look."},
  {id:5,title:"Mycelium as a network protocol",description:"A living, low-energy internet for soil, roots, and patient machines.",tags:["bio-design","systems"],kind:"WILD CARD 008",color:"violet",image:images.mushroom,meta:"added last week"},
  {id:6,title:"The 8:07 question",description:"Could a morning ritual be designed like an interface?",tags:["ritual","product"],kind:"QUESTION 081",color:"yellow",meta:"added last week"},
];

const nav = [
  {label:"Idea wall", icon:Compass}, {label:"Connections", icon:Network}, {label:"Explore", icon:Sparkles},
  {label:"My brain", icon:Brain}, {label:"Collections", icon:FolderOpen},
];

export default function Home(){
  const [active, setActive] = useState("Idea wall");
  const [ideas, setIdeas] = useState(seedIdeas);
  const [selected, setSelected] = useState<Idea|null>(null);
  const [composer, setComposer] = useState(false);
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState<number[]>([]);
  const [mobileNav, setMobileNav] = useState(false);
  const filtered = useMemo(()=> ideas.filter(i => `${i.title} ${i.description} ${i.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase())),[ideas,query]);

  useEffect(()=>{ const onKey=(e:KeyboardEvent)=>{ if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault(); document.getElementById("search")?.focus();} if(e.key==="Escape"){setComposer(false);setSelected(null);} }; window.addEventListener("keydown",onKey); return()=>window.removeEventListener("keydown",onKey);},[]);
  const dump = (title:string, description:string)=>{ if(!title.trim()) return; const fresh:Idea={id:Date.now(),title,description,tags:["uncatalogued"],kind:"JUST DUMPED",color:"lime",meta:"just now"}; setIdeas([fresh,...ideas]); setComposer(false); toast.success("Thought captured. No filing required."); };

  return <div className="app-shell">
    <aside className={`side-rail ${mobileNav?"is-open":""}`}>
      <div className="brand"><div className="brand-mark"><img src="/manus-storage/saturn-logo_914c509a.png" /></div><span>saturn</span><sup>01</sup></div>
      <div className="rail-caption">YOUR CREATIVE ORBIT</div>
      <nav>{nav.map(({label,icon:Icon})=><button key={label} className={active===label?"nav-item active":"nav-item"} onClick={()=>{setActive(label);setMobileNav(false)}}><Icon size={17}/><span>{label}</span>{label==="Connections"&&<b>4</b>}</button>)}</nav>
      <div className="rail-bottom"><button className="nav-item muted" onClick={()=>toast("Archive is where unfinished ideas wait.")}><Archive size={17}/><span>Idea graveyard</span></button><div className="profile"><div className="avatar">AM</div><div><strong>Alex Morgan</strong><small>@alexm</small></div><MoreHorizontal size={17}/></div></div>
    </aside>
    <main className="main-stage">
      <header className="topbar"><button className="mobile-menu" onClick={()=>setMobileNav(!mobileNav)}><Menu size={20}/></button><div className="breadcrumb"><span>my brain</span><ChevronDown size={14}/><strong>{active.toLowerCase()}</strong></div><div className="top-actions"><div className="search-wrap"><Search size={16}/><input id="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search your orbit"/><kbd><Command size={12}/> K</kbd></div><button className="icon-btn" onClick={()=>toast("Share link copied to clipboard.")}><Share2 size={17}/></button><button className="dump-btn" onClick={()=>setComposer(true)}><Plus size={18}/> dump an idea</button></div></header>
      {active==="Connections" ? <Connections onSelect={setSelected}/> : active==="My brain" ? <BrainView ideas={ideas}/> : <>
      <section className="wall-intro"><div><div className="issue-label"><span className="dot"></span> ISSUE 01 / UNFINISHED BUSINESS</div><h1>Not enough <em>ideas.</em></h1><p>Capture the sparks before they disappear. Give them room to become something else.</p></div><div className="wall-stats"><div><strong>{ideas.length}</strong><span>ideas in orbit</span></div><div><strong>07</strong><span>connected threads</span></div></div></section>
      <div className="filter-row"><div className="filter-tabs"><button className="selected">All thoughts <span>{filtered.length}</span></button><button onClick={()=>toast("Filter saved for later.")}>Recently dumped</button><button onClick={()=>toast("Showing your starred thoughts.")}>Starred</button></div><button className="sort-btn">sort by <strong>freshness</strong><ChevronDown size={14}/></button></div>
      <section className="idea-wall">{filtered.map((idea,index)=><IdeaCard key={idea.id} idea={idea} index={index} saved={saved.includes(idea.id)} onSave={()=>setSaved(saved.includes(idea.id)?saved.filter(x=>x!==idea.id):[...saved,idea.id])} onOpen={()=>setSelected(idea)}/>)}<button className="empty-card" onClick={()=>setComposer(true)}><span><Plus size={22}/></span><strong>make a new orbit</strong><small>or press <kbd>⌘ N</kbd></small></button></section></>}
    </main>
    {selected&&<Detail idea={selected} onClose={()=>setSelected(null)} onDump={()=>{setSelected(null);setComposer(true)}}/>}
    {composer&&<Composer onClose={()=>setComposer(false)} onDump={dump}/>} 
  </div>
}

function IdeaCard({idea,index,saved,onSave,onOpen}:{idea:Idea,index:number,saved:boolean,onSave:()=>void,onOpen:()=>void}){return <article className={`idea-card ${idea.color} card-${index%3}`} onClick={onOpen}><div className="card-top"><span className="card-kind">{idea.kind}</span><button className={`save-btn ${saved?"saved":""}`} onClick={e=>{e.stopPropagation();onSave()}}>{saved?"★":"☆"}</button></div>{idea.image&&<div className="card-image"><img src={idea.image}/><span className="image-index">01 / 01</span></div>}<div className="card-copy"><h2>{idea.title}</h2><p>{idea.description}</p>{idea.note&&<div className="note">“{idea.note}”</div>}<div className="tag-row">{idea.tags.map(t=><span key={t}>#{t}</span>)}</div></div><div className="card-foot"><span>{idea.meta}</span><ArrowUpRight size={16}/></div></article>}

function Composer({onClose,onDump}:{onClose:()=>void;onDump:(title:string,desc:string)=>void}){const [title,setTitle]=useState("");const [desc,setDesc]=useState("");return <div className="overlay"><section className="composer"><header><div className="issue-label"><span className="dot"></span> NEW CAPTURE / AUTOSAVED</div><button className="close-btn" onClick={onClose}><X size={20}/></button></header><div className="composer-body"><p className="eyebrow">A blank page is a kind of permission.</p><h2>What's on your mind?</h2><input autoFocus value={title} onChange={e=>setTitle(e.target.value)} placeholder="Give it a loose title…"/><textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Write something. A question, a hunch, a half-built thing…"/><div className="add-tools"><button><ImageIcon size={16}/> image</button><button><Link2 size={16}/> resource</button><button><FileText size={16}/> file</button><button><Tag size={16}/> tag</button><button><Zap size={16}/> mood</button></div><div className="composer-footer"><span><span className="status-dot"></span> Saved just now</span><button className="capture-btn" onClick={()=>onDump(title,desc)}>capture thought <Send size={16}/></button></div></div></section></div>}

function Detail({idea,onClose,onDump}:{idea:Idea;onClose:()=>void;onDump:()=>void}){return <div className="overlay detail-overlay"><section className="detail-sheet"><button className="close-btn detail-close" onClick={onClose}><X size={20}/></button><div className="detail-grid"><div>{idea.image?<img className="detail-image" src={idea.image}/>:<div className={`detail-placeholder ${idea.color}`}>“{idea.note||idea.description}”</div>}</div><div className="detail-copy"><div className="issue-label"><span className="dot"></span> {idea.kind} / {idea.meta.toUpperCase()}</div><h2>{idea.title}</h2><p className="detail-lead">{idea.description}</p><div className="detail-rule"></div><p>{idea.note||"This is a place for the idea to breathe. Add the loose threads, references, and questions that might give it another life."}</p><div className="tag-row">{idea.tags.map(t=><span key={t}>#{t}</span>)}</div><div className="detail-actions"><button onClick={()=>toast("Idea duplicated.")}><Copy size={15}/> duplicate</button><button onClick={()=>toast("Connection mode ready.")}><GitBranch size={15}/> connect</button><button onClick={()=>toast("Share link copied.")}><Share2 size={15}/> share</button></div><button className="develop-btn" onClick={onDump}><Sparkles size={17}/> develop this idea <ArrowUpRight size={16}/></button></div></div><div className="detail-meta"><span><CircleHelp size={14}/> created from a passing thought</span><span><ExternalLink size={14}/> 2 related ideas nearby</span></div></section></div>}

function Connections({onSelect}:{onSelect:(idea:Idea)=>void}){return <section className="connections-view"><div className="view-heading"><div><div className="issue-label"><span className="dot"></span> RELATIONSHIP MAP / LIVE</div><h1>See what wants<br/><em>to meet.</em></h1></div><p>Ideas become more interesting when they bump into one another. Drag a node, follow a thread, find the unexpected.</p></div><div className="map-canvas"><div className="map-lines"><i className="line l1"></i><i className="line l2"></i><i className="line l3"></i><i className="line l4"></i></div><button className="node node-a" onClick={()=>onSelect(seedIdeas[0])}><span>01</span>Smart mirror</button><button className="node node-b" onClick={()=>onSelect(seedIdeas[2])}><span>02</span>Gentle robots</button><button className="node node-c" onClick={()=>onSelect(seedIdeas[1])}><span>03</span>Folded city</button><button className="node node-d" onClick={()=>onSelect(seedIdeas[4])}><span>04</span>Mycelium protocol</button><div className="map-center"><img src="/manus-storage/saturn-logo_914c509a.png"/><small>your brain<br/>in progress</small></div></div><div className="connection-legend"><span><i className="legend-dot lime"></i> builds on</span><span><i className="legend-dot blue"></i> related to</span><span><i className="legend-dot coral"></i> inspired by</span><button onClick={()=>toast("Connection creation mode is ready.")}>+ connect two ideas</button></div></section>}

function BrainView({ideas}:{ideas:Idea[]}){return <section className="brain-view"><div className="view-heading"><div><div className="issue-label"><span className="dot"></span> PRIVATE INDEX / ALEX MORGAN</div><h1>My <em>brain.</em></h1></div><p>A gentle inventory of what you've been circling lately.</p></div><div className="brain-stats"><div><strong>{ideas.length}</strong><span>total ideas</span><small>↑ 3 this week</small></div><div><strong>12</strong><span>ideas connected</span><small>2 threads active</small></div><div><strong>04</strong><span>in development</span><small>keep going</small></div><div><strong>08</strong><span>in the graveyard</span><small>not gone forever</small></div></div><div className="timeline"><h3>recent activity</h3><p><b>Today</b> You captured <u>“{ideas[0].title}”</u></p><p><b>Yesterday</b> Connected <u>“Folded city”</u> to <u>“Gentle robots”</u></p><p><b>2 days ago</b> Resurfaced an idea from the graveyard</p></div></section>}
