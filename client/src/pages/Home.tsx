/* Orbital Scrapbook / IdeaVault: a studio-like idea wall with tactile cards, fast capture, status flow, and an interactive board. */
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Archive, ArrowDownAZ, ArrowUpRight, Brain, Check, ChevronDown, CircleHelp, Command, Compass, Copy,
  ExternalLink, FileText, FolderOpen, GitBranch, Image as ImageIcon, Link2, Menu, MoreHorizontal, Move,
  Network, Plus, Search, Send, Share2, Sparkles, Tag, Upload, UserRound, X, Zap
} from "lucide-react";

type Status = "Raw" | "Developing" | "Building" | "Archived";
type Idea = {
  id: number; title: string; description: string; tags: string[]; kind: string; color: string;
  image?: string; meta: string; note?: string; status: Status; resource?: string; resourceLabel?: string;
};

const images = {
  mirror: "/manus-storage/idea-smart-mirror_40d6c372.jpg",
  city: "/manus-storage/idea-circular-city_e7021494.jpg",
  robot: "/manus-storage/idea-robot-arm_145208e4.jpg",
  mushroom: "/manus-storage/idea-mushroom-network_7bcaa3a6.jpg",
};
const seedIdeas: Idea[] = [
  { id: 1, title: "The mirror that remembers", description: "What if your mirror could understand your routine — and gently reroute it?", tags: ["hardware", "AI", "IoT"], kind: "FIELD NOTE 014", color: "lime", image: images.mirror, meta: "edited 12 min ago", note: "A softer kind of personal dashboard. No graphs. Just useful timing.", status: "Developing", resource: "https://www.are.na", resourceLabel: "Are.na / visual research" },
  { id: 2, title: "A city that folds inward", description: "Circular neighborhoods where every errand is a five-minute walk.", tags: ["urbanism", "future"], kind: "SCRAP 027", color: "coral", image: images.city, meta: "added yesterday", status: "Raw" },
  { id: 3, title: "Teach a robot to be gentle", description: "Small movements, huge consequences. Exploring compliant joints for home robots.", tags: ["robotics", "research"], kind: "LAB LOG 203", color: "blue", image: images.robot, meta: "edited 2 days ago", status: "Building", resource: "https://github.com", resourceLabel: "GitHub / soft robotics" },
  { id: 4, title: "A note on impossible things", description: "The best ideas arrive before their vocabulary does.", tags: ["writing", "mindset"], kind: "MARGIN NOTE", color: "paper", meta: "added 3 days ago", note: "Keep the rough edges. They are probably telling you where to look.", status: "Raw" },
  { id: 5, title: "Mycelium as a network protocol", description: "A living, low-energy internet for soil, roots, and patient machines.", tags: ["bio-design", "systems"], kind: "WILD CARD 008", color: "violet", image: images.mushroom, meta: "added last week", status: "Developing" },
  { id: 6, title: "The 8:07 question", description: "Could a morning ritual be designed like an interface?", tags: ["ritual", "product"], kind: "QUESTION 081", color: "yellow", meta: "added last week", status: "Archived" },
];
const nav = [
  { label: "Idea wall", icon: Compass }, { label: "Connections", icon: Network }, { label: "Explore", icon: Sparkles },
  { label: "My brain", icon: Brain }, { label: "Collections", icon: FolderOpen },
];
const statuses: Status[] = ["Raw", "Developing", "Building", "Archived"];

export default function Home() {
  const [active, setActive] = useState("Idea wall");
  const [ideas, setIdeas] = useState<Idea[]>(seedIdeas);
  const [selected, setSelected] = useState<Idea | null>(null);
  const [composer, setComposer] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "All">("All");
  const [saved, setSaved] = useState<number[]>([]);
  const [mobileNav, setMobileNav] = useState(false);
  const [sortNewest, setSortNewest] = useState(true);
  const [ideaOfDayOpen, setIdeaOfDayOpen] = useState(false);

  const filtered = useMemo(() => {
    const result = ideas.filter((idea) => {
      const haystack = `${idea.title} ${idea.description} ${idea.tags.join(" ")} ${idea.status}`.toLowerCase();
      return haystack.includes(query.toLowerCase()) && (statusFilter === "All" || idea.status === statusFilter);
    });
    return sortNewest ? result : [...result].reverse();
  }, [ideas, query, statusFilter, sortNewest]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault(); document.getElementById("search")?.focus();
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "n") {
        event.preventDefault(); setComposer(true);
      }
      if (event.key === "Escape") { setComposer(false); setSelected(null); setIdeaOfDayOpen(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const updateIdea = (id: number, patch: Partial<Idea>) => {
    setIdeas((current) => current.map((idea) => idea.id === id ? { ...idea, ...patch } : idea));
    setSelected((current) => current && current.id === id ? { ...current, ...patch } : current);
  };
  const dump = (payload: Omit<Idea, "id" | "kind" | "meta">) => {
    const fresh: Idea = { ...payload, id: Date.now(), kind: "JUST DUMPED", meta: "just now" };
    setIdeas((current) => [fresh, ...current]); setComposer(false); setStatusFilter("All");
    toast.success("Thought captured. No filing required.");
  };
  const reorder = (fromId: number, toId: number) => {
    setIdeas((current) => {
      const from = current.findIndex((idea) => idea.id === fromId); const to = current.findIndex((idea) => idea.id === toId);
      if (from < 0 || to < 0 || from === to) return current;
      const next = [...current]; const [moved] = next.splice(from, 1); next.splice(to, 0, moved); return next;
    });
  };

  return <div className="app-shell">
    <aside className={`side-rail ${mobileNav ? "is-open" : ""}`}>
      <div className="brand"><div className="brand-mark"><img src="/manus-storage/saturn-logo_914c509a.png" /></div><span>ideavault</span><sup>01</sup></div>
      <div className="rail-caption">YOUR CREATIVE ORBIT</div>
      <nav>{nav.map(({ label, icon: Icon }) => <button key={label} className={active === label ? "nav-item active" : "nav-item"} onClick={() => { setActive(label); setMobileNav(false); }}><Icon size={17} /><span>{label}</span>{label === "Connections" && <b>4</b>}</button>)}</nav>
      <div className="rail-status-key"><p>STATUS FLOW</p>{statuses.map((status) => <button key={status} onClick={() => { setActive("Idea wall"); setStatusFilter(status); setMobileNav(false); }}><span className={`status-swatch ${status.toLowerCase()}`}></span>{status}<small>{ideas.filter((idea) => idea.status === status).length}</small></button>)}</div>
      <div className="rail-bottom"><button className="nav-item muted" onClick={() => { setStatusFilter("Archived"); setActive("Idea wall"); }}><Archive size={17} /><span>Idea graveyard</span></button><div className="profile"><div className="avatar">AM</div><div><strong>Alex Morgan</strong><small>@alexm</small></div><MoreHorizontal size={17} /></div></div>
    </aside>
    <main className="main-stage">
      <header className="topbar"><button className="mobile-menu" onClick={() => setMobileNav(!mobileNav)} aria-label="Open navigation"><Menu size={20} /></button><div className="breadcrumb"><span>my brain</span><ChevronDown size={14} /><strong>{active.toLowerCase()}</strong></div><div className="top-actions"><div className="search-wrap"><Search size={16} /><input id="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search your orbit"/><kbd><Command size={12} /> K</kbd></div><button className="icon-btn" onClick={() => toast("Share link copied to clipboard.")} aria-label="Share"><Share2 size={17} /></button><button className="dump-btn" onClick={() => setComposer(true)}><Plus size={18} /> dump an idea</button></div></header>
      {active === "Connections" ? <Connections ideas={ideas} updateIdea={updateIdea} onSelect={setSelected} /> : active === "My brain" ? <BrainView ideas={ideas} /> : active === "Explore" ? <ExploreView ideas={ideas} onSelect={setSelected} onIdeaOfDay={() => setIdeaOfDayOpen(true)} /> : active === "Collections" ? <CollectionsView ideas={ideas} onSelect={setSelected} /> : <>
        <section className="wall-intro"><div><div className="issue-label"><span className="dot"></span> VAULT 01 / UNFINISHED BUSINESS</div><h1>Not enough <em>ideas.</em></h1><p>Capture the sparks before they disappear. Give them room to become something else.</p></div><div className="wall-stats"><div><strong>{ideas.length.toString().padStart(2, "0")}</strong><span>ideas in orbit</span></div><div><strong>07</strong><span>connected threads</span></div></div></section>
        <section className="daily-strip"><div className="daily-orbit"><span>✳</span><div><p>IDEA OF THE DAY / 03 SEP</p><strong>What if your best ideas are hiding in your discarded ones?</strong></div></div><button onClick={() => setIdeaOfDayOpen(true)}>open the prompt <ArrowUpRight size={15} /></button></section>
        <div className="filter-row"><div className="filter-tabs"><button className={statusFilter === "All" ? "selected" : ""} onClick={() => setStatusFilter("All")}>All thoughts <span>{ideas.length}</span></button>{statuses.map((status) => <button key={status} className={statusFilter === status ? "selected" : ""} onClick={() => setStatusFilter(status)}><i className={`status-swatch ${status.toLowerCase()}`}></i>{status}<span>{ideas.filter((idea) => idea.status === status).length}</span></button>)}</div><button className="sort-btn" onClick={() => setSortNewest(!sortNewest)}><ArrowDownAZ size={13} /> {sortNewest ? "freshest first" : "oldest first"}</button></div>
        <section className="idea-wall">{filtered.map((idea, index) => <IdeaCard key={idea.id} idea={idea} index={index} saved={saved.includes(idea.id)} onSave={() => setSaved(saved.includes(idea.id) ? saved.filter((id) => id !== idea.id) : [...saved, idea.id])} onOpen={() => setSelected(idea)} onReorder={reorder} />)}<button className="empty-card" onClick={() => setComposer(true)}><span><Plus size={22} /></span><strong>make a new orbit</strong><small>or press <kbd>⌘ N</kbd></small></button></section>
      </>}
    </main>
    <button className="floating-dump" onClick={() => setComposer(true)} aria-label="Dump an idea"><Plus size={22} /><span>dump</span></button>
    {selected && <Detail idea={selected} onClose={() => setSelected(null)} onUpdate={(patch) => updateIdea(selected.id, patch)} onDump={() => { setSelected(null); setComposer(true); }} />}
    {composer && <Composer onClose={() => setComposer(false)} onDump={dump} />}
    {ideaOfDayOpen && <IdeaOfDay onClose={() => setIdeaOfDayOpen(false)} onDump={() => { setIdeaOfDayOpen(false); setComposer(true); }} />}
  </div>;
}

function IdeaCard({ idea, index, saved, onSave, onOpen, onReorder }: { idea: Idea; index: number; saved: boolean; onSave: () => void; onOpen: () => void; onReorder: (from: number, to: number) => void }) {
  const [dragging, setDragging] = useState(false);
  return <article className={`idea-card ${idea.color} card-${index % 3} ${dragging ? "is-dragging" : ""}`} draggable onDragStart={(event) => { event.dataTransfer.setData("idea-id", String(idea.id)); event.dataTransfer.effectAllowed = "move"; setDragging(true); }} onDragEnd={() => setDragging(false)} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.stopPropagation(); const from = Number(event.dataTransfer.getData("idea-id")); if (from) onReorder(from, idea.id); setDragging(false); }} onClick={onOpen}>
    <div className="card-top"><span className="card-kind"><Move size={11} /> {idea.kind}</span><div className="card-top-actions"><span className={`status-pill ${idea.status.toLowerCase()}`}>{idea.status}</span><button className={`save-btn ${saved ? "saved" : ""}`} onClick={(event) => { event.stopPropagation(); onSave(); }} aria-label={saved ? "Unsave idea" : "Save idea"}>{saved ? "★" : "☆"}</button></div></div>
    {idea.image && <div className="card-image"><img src={idea.image} alt="" /><span className="image-index">01 / 01</span></div>}
    <div className="card-copy"><h2>{idea.title}</h2><p>{idea.description}</p>{idea.note && <div className="note">“{idea.note}”</div>}{idea.resource && <a className="resource-chip" href={idea.resource} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}><Link2 size={12} /> {idea.resourceLabel || "attached resource"}<ExternalLink size={11} /></a>}<div className="tag-row">{idea.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div></div>
    <div className="card-foot"><span>{idea.meta}</span><ArrowUpRight size={16} /></div>
    <span className="drag-hint"><Move size={11} /> drag to rearrange</span>
  </article>;
}

function Composer({ onClose, onDump }: { onClose: () => void; onDump: (payload: Omit<Idea, "id" | "kind" | "meta">) => void }) {
  const [title, setTitle] = useState(""); const [description, setDescription] = useState(""); const [tagText, setTagText] = useState(""); const [status, setStatus] = useState<Status>("Raw"); const [resource, setResource] = useState(""); const [image, setImage] = useState<string | undefined>(); const fileRef = useRef<HTMLInputElement>(null);
  const submit = () => { if (!title.trim()) { toast.error("Give the thought a loose title first."); return; } onDump({ title: title.trim(), description: description.trim() || "A fresh thought, still finding its shape.", tags: tagText.split(",").map((tag) => tag.trim().replace(/^#/, "")).filter(Boolean).slice(0, 5).length ? tagText.split(",").map((tag) => tag.trim().replace(/^#/, "")).filter(Boolean).slice(0, 5) : ["uncatalogued"], color: "lime", status, resource: resource || undefined, resourceLabel: resource ? "attached resource" : undefined, image }); };
  const onFile = (event: React.ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => setImage(String(reader.result)); reader.readAsDataURL(file); };
  return <div className="overlay"><section className="composer"><header><div className="issue-label"><span className="dot"></span> NEW CAPTURE / AUTOSAVED</div><button className="close-btn" onClick={onClose} aria-label="Close"><X size={20} /></button></header><div className="composer-body"><p className="eyebrow">A blank page is a kind of permission.</p><h2>What's on your mind?</h2><input autoFocus value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Give it a loose title…"/><textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Write something. A question, a hunch, a half-built thing…"/><div className="capture-grid"><label><span>status</span><select value={status} onChange={(event) => setStatus(event.target.value as Status)}>{statuses.map((item) => <option key={item}>{item}</option>)}</select></label><label><span>tags <small>comma separated</small></span><input id="tag-input" value={tagText} onChange={(event) => setTagText(event.target.value)} placeholder="robotics, curious" /></label></div><div className="add-tools"><button onClick={() => fileRef.current?.click()}><ImageIcon size={16} /> {image ? "image added" : "image"}</button><button onClick={() => document.getElementById("resource-input")?.focus()}><Link2 size={16} /> resource</button><button onClick={() => toast("File attachments are ready for the Firebase layer.")}><FileText size={16} /> file</button><button onClick={() => document.getElementById("tag-input")?.focus()}><Tag size={16} /> tag</button><button onClick={() => toast("Mood metadata will be available in your personal brain.")}><Zap size={16} /> mood</button><input ref={fileRef} type="file" accept="image/*" onChange={onFile} hidden /></div><div className="resource-input-wrap"><Link2 size={14} /><input id="resource-input" value={resource} onChange={(event) => setResource(event.target.value)} placeholder="Paste a link or resource URL…" /></div>{image && <div className="composer-preview"><img src={image} alt="Selected idea" /><button onClick={() => setImage(undefined)}><X size={14} /></button></div>}<div className="composer-footer"><span><span className="status-dot"></span> Saved just now</span><button className="capture-btn" onClick={submit}>capture thought <Send size={16} /></button></div></div></section></div>;
}

function Detail({ idea, onClose, onUpdate, onDump }: { idea: Idea; onClose: () => void; onUpdate: (patch: Partial<Idea>) => void; onDump: () => void }) {
  return <div className="overlay detail-overlay"><section className="detail-sheet"><button className="close-btn detail-close" onClick={onClose} aria-label="Close"><X size={20} /></button><div className="detail-grid"><div>{idea.image ? <img className="detail-image" src={idea.image} alt="" /> : <div className={`detail-placeholder ${idea.color}`}>“{idea.note || idea.description}”</div>}</div><div className="detail-copy"><div className="issue-label"><span className="dot"></span> {idea.kind} / {idea.meta.toUpperCase()}</div><h2>{idea.title}</h2><p className="detail-lead">{idea.description}</p><div className="detail-status-row"><span>current orbit</span><select value={idea.status} onChange={(event) => { onUpdate({ status: event.target.value as Status }); toast.success(`Moved to ${event.target.value}.`); }}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></div><div className="detail-rule"></div><p>{idea.note || "This is a place for the idea to breathe. Add the loose threads, references, and questions that might give it another life."}</p><div className="tag-row">{idea.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div>{idea.resource && <a className="detail-resource" href={idea.resource} target="_blank" rel="noreferrer"><Link2 size={14} /> {idea.resourceLabel || idea.resource}<ExternalLink size={13} /></a>}<div className="detail-actions"><button onClick={() => toast("Idea duplicated.")}><Copy size={15} /> duplicate</button><button onClick={() => toast("Connection mode ready.")}><GitBranch size={15} /> connect</button><button onClick={() => toast("Share link copied.")}><Share2 size={15} /> share</button></div><button className="develop-btn" onClick={onDump}><Sparkles size={17} /> develop this idea <ArrowUpRight size={16} /></button></div></div><div className="detail-meta"><span><CircleHelp size={14} /> created from a passing thought</span><span><ExternalLink size={14} /> 2 related ideas nearby</span></div></section></div>;
}

function IdeaOfDay({ onClose, onDump }: { onClose: () => void; onDump: () => void }) {
  return <div className="overlay"><section className="daily-modal"><button className="close-btn" onClick={onClose} aria-label="Close"><X size={20} /></button><div className="daily-modal-mark">✳</div><div className="issue-label"><span className="dot"></span> IDEA OF THE DAY / 03 SEP</div><h2>What if your best ideas are hiding in your discarded ones?</h2><p>Take one thing you nearly deleted. Put it beside something you are building. What changes when they share a table?</p><div className="daily-prompts"><span>01 / RESURRECT</span><span>02 / COMBINE</span><span>03 / FOLLOW THE THREAD</span></div><button className="capture-btn" onClick={onDump}>write into this prompt <ArrowUpRight size={16} /></button></section></div>;
}

function Connections({ ideas, updateIdea, onSelect }: { ideas: Idea[]; updateIdea: (id: number, patch: Partial<Idea>) => void; onSelect: (idea: Idea) => void }) {
  const [positions, setPositions] = useState<Record<number, { x: number; y: number }>>({ 1: { x: 17, y: 22 }, 3: { x: 70, y: 18 }, 2: { x: 18, y: 69 }, 5: { x: 69, y: 70 } });
  const [dragNode, setDragNode] = useState<number | null>(null); const boardRef = useRef<HTMLDivElement>(null);
  useEffect(() => { const move = (event: PointerEvent) => { if (dragNode === null || !boardRef.current) return; const rect = boardRef.current.getBoundingClientRect(); setPositions((current) => ({ ...current, [dragNode]: { x: Math.min(86, Math.max(6, ((event.clientX - rect.left) / rect.width) * 100)), y: Math.min(83, Math.max(8, ((event.clientY - rect.top) / rect.height) * 100)) } })); }; const up = () => setDragNode(null); window.addEventListener("pointermove", move); window.addEventListener("pointerup", up); return () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); }; }, [dragNode]);
  const mapIdeas = ideas.filter((idea) => [1, 2, 3, 5].includes(idea.id));
  return <section className="connections-view"><div className="view-heading"><div><div className="issue-label"><span className="dot"></span> RELATIONSHIP MAP / LIVE</div><h1>See what wants<br /><em>to meet.</em></h1></div><p>Ideas become more interesting when they bump into one another. Drag a node, follow a thread, find the unexpected.</p></div><div className="map-canvas" ref={boardRef}><svg className="map-svg" viewBox="0 0 100 100" preserveAspectRatio="none"><line x1="25" y1="33" x2="72" y2="30" /><line x1="25" y1="33" x2="26" y2="75" /><line x1="72" y1="30" x2="74" y2="75" /><line x1="26" y1="75" x2="74" y2="75" /></svg>{mapIdeas.map((idea, index) => { const position = positions[idea.id] || { x: 50, y: 50 }; return <button key={idea.id} className={`node node-${index}`} style={{ left: `${position.x}%`, top: `${position.y}%` }} onPointerDown={(event) => { event.stopPropagation(); setDragNode(idea.id); }} onClick={() => onSelect(idea)}><span>{String(index + 1).padStart(2, "0")}</span>{idea.title}<small>{idea.status}</small></button>; })}<div className="map-center"><img src="/manus-storage/saturn-logo_914c509a.png" alt="" /><small>your brain<br />in progress</small></div><div className="map-board-note"><Move size={12} /> drag nodes to re-orbit</div></div><div className="connection-legend"><span><i className="legend-dot lime"></i> builds on</span><span><i className="legend-dot blue"></i> related to</span><span><i className="legend-dot coral"></i> inspired by</span><button onClick={() => toast("Connection creation mode is ready.")}>+ connect two ideas</button></div><div className="board-lanes"><p>DRAG TO ORGANIZE BY STATUS</p>{statuses.slice(0, 3).map((status) => <div className="board-lane" key={status} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { const ideaId = Number(event.dataTransfer.getData("idea-id")); if (ideaId) { updateIdea(ideaId, { status }); toast.success(`Moved to ${status}.`); } }}><strong>{status}</strong><span>{ideas.filter((idea) => idea.status === status).length} ideas</span></div>)}</div></section>;
}

function BrainView({ ideas }: { ideas: Idea[] }) { const counts = statuses.map((status) => ideas.filter((idea) => idea.status === status).length); return <section className="brain-view"><div className="view-heading"><div><div className="issue-label"><span className="dot"></span> PRIVATE INDEX / ALEX MORGAN</div><h1>My <em>brain.</em></h1></div><p>A gentle inventory of what you've been circling lately.</p></div><div className="brain-stats"><div><strong>{ideas.length.toString().padStart(2, "0")}</strong><span>total ideas</span><small>↑ 3 this week</small></div><div><strong>{counts[1] + counts[2]}</strong><span>in motion</span><small>developing + building</small></div><div><strong>{counts[2]}</strong><span>being built</span><small>keep going</small></div><div><strong>{counts[3]}</strong><span>in the graveyard</span><small>not gone forever</small></div></div><div className="status-progress"><p>THE CURRENT WEATHER OF YOUR BRAIN</p>{statuses.map((status, index) => <div key={status}><span>{status}</span><i><b style={{ width: `${Math.max(12, (counts[index] / Math.max(ideas.length, 1)) * 100)}%` }}></b></i><small>{counts[index]}</small></div>)}</div><div className="timeline"><h3>recent activity</h3><p><b>Today</b> You captured <u>“{ideas[0]?.title}”</u></p><p><b>Yesterday</b> Connected <u>“Folded city”</u> to <u>“Gentle robots”</u></p><p><b>2 days ago</b> Resurfaced an idea from the graveyard</p></div></section>; }

function ExploreView({ ideas, onSelect, onIdeaOfDay }: { ideas: Idea[]; onSelect: (idea: Idea) => void; onIdeaOfDay: () => void }) { return <section className="explore-view"><div className="view-heading"><div><div className="issue-label"><span className="dot"></span> PUBLIC ORBIT / DISCOVER</div><h1>Find a thread<br /><em>to pull.</em></h1></div><p>Public sparks, strange combinations, and the ideas that keep showing up in the margins.</p></div><div className="explore-feature" onClick={onIdeaOfDay}><span>DAILY PROMPT</span><strong>Rescue an almost-idea.</strong><button>open prompt <ArrowUpRight size={14} /></button></div><div className="explore-grid">{ideas.slice(0, 4).map((idea) => <button key={idea.id} onClick={() => onSelect(idea)}><span>#{idea.tags[0]}</span><strong>{idea.title}</strong><small>{idea.status} / {idea.meta}</small></button>)}</div></section>; }

function CollectionsView({ ideas, onSelect }: { ideas: Idea[]; onSelect: (idea: Idea) => void }) { const collections = [{ name: "Things I want to build", tag: "hardware", color: "lime" }, { name: "Weird, but maybe", tag: "future", color: "coral" }, { name: "Soft systems", tag: "systems", color: "blue" }]; return <section className="collections-view"><div className="view-heading"><div><div className="issue-label"><span className="dot"></span> PERSONAL INDEX / COLLECTIONS</div><h1>Give ideas<br /><em>a room.</em></h1></div><p>Loose groupings for thoughts that keep orbiting the same question.</p></div><div className="collection-grid">{collections.map((collection) => <button className={`collection-tile ${collection.color}`} key={collection.name} onClick={() => { const idea = ideas.find((item) => item.tags.includes(collection.tag)); if (idea) onSelect(idea); }}><span>COLLECTION / 0{collections.indexOf(collection) + 1}</span><strong>{collection.name}</strong><small>{ideas.filter((idea) => idea.tags.includes(collection.tag)).length || 2} ideas nearby <ArrowUpRight size={15} /></small></button>)}</div></section>; }
