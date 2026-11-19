<!-- THROWAWAY: compare snapshot spheres, pointer graph, and history ledger in the approved host layout. ?study=history&variant=A|B|C. -->
<script setup lang="ts">
import {computed,onMounted,onUnmounted,ref} from 'vue';
import PrototypeSwitcher from './PrototypeSwitcher.vue';
import InlineText from './InlineText.vue';
import './history-prototype.css';
type Variant='A'|'B'|'C';
type Commit={id:string;parents:string[];notes:string;ideas:boolean;title:string;x:number;y:number};
const isDev=import.meta.env.DEV;
const names={A:'Comic snapshot spheres',B:'Pointer graph',C:'History ledger'};
const commits:Commit[]=[
 {id:'c1',parents:[],notes:'B',ideas:false,title:'Record notes',x:115,y:260},
 {id:'c2',parents:['c1'],notes:'C',ideas:false,title:'Add Bob’s sentence',x:305,y:260},
 {id:'c3',parents:['c2'],notes:'C',ideas:true,title:'Add ideas',x:485,y:50},
 {id:'c4',parents:['c2'],notes:'D',ideas:false,title:'Revise notes',x:610,y:260},
 {id:'c5',parents:['c4','c3'],notes:'D',ideas:true,title:'Merge ideas',x:835,y:260}
];
const steps=[
 {short:'First commit',title:'A history with a beginning.',command:'git commit -m "Record notes"',count:1,main:'c1',ideas:null,head:'main',working:'C',staged:'B',files:false,body:'Alice records the staged contents of notes.txt as her first commit. Bob’s later sentence stays in her working directory. There is no older baseline commit hiding behind c1.',idea:'The first commit has no parent. Its snapshot contains B, while the newer working file still contains C.'},
 {short:'Second commit',title:'A snapshot, linked to its parent.',command:'git add notes.txt\ngit commit -m "Add Bob’s sentence"',count:2,main:'c2',ideas:null,head:'main',working:'C',staged:'C',files:false,body:'Alice stages the remaining edit and records a second commit. Bob can follow its parent link back to the first. Each commit records a snapshot, not just the sentence that changed.',idea:'c2 has one parent: c1. The working directory and staging area now match c2.'},
 {short:'Create branch',title:'A new name. The same commit.',command:'git branch ideas',count:2,main:'c2',ideas:'c2',head:'main',working:'C',staged:'C',files:false,body:'Alice creates ideas. Both names now point to c2; no commits or project folders are copied. Bob notices that HEAD still points to main: creating a branch did not switch to it.',idea:'A branch is a movable name for a commit. Creating ideas does not move HEAD.'},
 {short:'Switch',title:'HEAD follows the chosen branch.',command:'git switch ideas',count:2,main:'c2',ideas:'c2',head:'ideas',working:'C',staged:'C',files:false,body:'Alice switches to ideas with a clean working directory. HEAD now points to ideas. Because both branches name c2, the checked-out contents do not change yet.',idea:'Switching changes the current branch. Here, both names still select the same snapshot.'},
 {short:'Commit on ideas',title:'Only the current branch moves.',command:'git add ideas.txt\ngit commit -m "Add ideas"',count:3,main:'c2',ideas:'c3',head:'ideas',working:'C',staged:'C',files:true,body:'Alice creates ideas.txt in her editor, stages it, and commits on ideas. The new snapshot contains both files. The ideas label advances to c3, while main stays at c2.',idea:'One shared history, not two repositories. c3 has c2 as its parent.'},
 {short:'Back to main',title:'The files follow the checkout.',command:'git switch main',count:3,main:'c2',ideas:'c3',head:'main',working:'C',staged:'C',files:false,body:'With no uncommitted changes, Alice switches back to main. ideas.txt disappears from her working directory because c2 does not contain it. Bob can still find the file in the recorded snapshot c3.',idea:'Switching does not delete c3. It restores main’s tracked snapshot into the working directory and staging area.'},
 {short:'Diverge',title:'Two lines from one shared past.',command:'git add notes.txt\ngit commit -m "Revise notes"',count:4,main:'c4',ideas:'c3',head:'main',working:'D',staged:'D',files:false,body:'Alice revises notes.txt in her editor and commits on main. Now c4 and c3 share c2 as an ancestor, but neither is the other’s ancestor. Bob sees why joining them will need more than moving a label forward.',idea:'main and ideas have diverged. main changed notes.txt; ideas added ideas.txt.'},
 {short:'Merge',title:'One result. Two parents.',command:'git merge ideas',count:5,main:'c5',ideas:'c3',head:'main',working:'D',staged:'D',files:true,body:'Alice merges ideas while on main. Git combines the non-conflicting changes into c5: revised notes.txt and the added ideas.txt. main advances, ideas stays at c3, and HEAD remains on main.',idea:'The merge commit has two parents: c4 first, c3 second. It records the combined snapshot; it does not erase either history.'}
];
function readVariant():Variant{const v=new URLSearchParams(location.search).get('variant');return v==='B'||v==='C'?v:'A'}
const variant=ref<Variant>(readVariant()), step=ref(0), replay=ref(0),courseOpen=ref(false),inspect=ref<string|null>(null),reduced=ref(false);
const current=computed(()=>steps[step.value]!);
const visible=computed(()=>commits.slice(0,current.value.count));
const selected=computed(()=>visible.value.find(c=>c.id===inspect.value)||visible.value[visible.value.length-1]!);
const links=computed(()=>visible.value.flatMap(c=>c.parents.map((id,i)=>({from:c,to:commits.find(p=>p.id===id)!,order:i+1}))));
// Label geometry follows the actual arrow endpoints, not commit-center estimates.
function parentEdge(from:Commit,to:Commit){
 const inset=variant.value==='A'?46:33;
 const dx=to.x-from.x,dy=to.y-from.y,length=Math.hypot(dx,dy);
 const start={x:from.x+dx/length*inset,y:from.y+dy/length*inset};
 const end={x:to.x-dx/length*inset,y:to.y-dy/length*inset};
 const angle=Math.atan2(start.y-end.y,start.x-end.x)*180/Math.PI;
 return {path:`M${start.x} ${start.y} L${end.x} ${end.y}`,label:`translate(${(start.x+end.x)/2},${(start.y+end.y)/2}) rotate(${angle})`};
}
const headCommit=computed(()=>current.value.head==='main'?current.value.main:current.value.ideas);
const description=computed(()=>`HEAD points to ${current.value.head}, which points to ${headCommit.value}. main points to ${current.value.main}.${current.value.ideas?' ideas points to '+current.value.ideas+'.':''} ${visible.value.map(c=>c.id+' has '+(c.parents.length?'parent'+(c.parents.length>1?'s ':' ')+c.parents.join(', '):'no parent')+'.').join(' ')} Working directory: notes.txt ${current.value.working}${current.value.files?', ideas.txt present':', ideas.txt absent'}. Staging area: notes.txt ${current.value.staged}${current.value.files?', ideas.txt present':', ideas.txt absent'}.`);
function go(i:number){step.value=i;inspect.value=null;replay.value++}
function cycle(delta:number){const keys:Variant[]=['A','B','C'];variant.value=keys[(keys.indexOf(variant.value)+delta+3)%3]!;const url=new URL(location.href);url.searchParams.set('variant',variant.value);history.replaceState(null,'',url)}
function keydown(e:KeyboardEvent){if(e.target instanceof HTMLElement&&e.target.closest('input,textarea,select,[contenteditable]'))return;if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();cycle(e.key==='ArrowRight'?1:-1)}}
function popstate(){variant.value=readVariant()}
let media:MediaQueryList;
function motion(){reduced.value=media.matches}
onMounted(()=>{media=matchMedia('(prefers-reduced-motion: reduce)');motion();media.addEventListener('change',motion);addEventListener('keydown',keydown);addEventListener('popstate',popstate)});
onUnmounted(()=>{media.removeEventListener('change',motion);removeEventListener('keydown',keydown);removeEventListener('popstate',popstate)});
</script>
<template>
<div class="workspace variant-A history-study">
 <header><a class="brand" href="/?variant=A"><span class="brand-icon">⌘</span> Git, illustrated</a><span class="header-section">DISPOSABLE / HISTORY STUDY</span><button class="lessons-toggle" :aria-expanded="courseOpen" aria-controls="history-lessons" @click="courseOpen=!courseOpen">{{courseOpen?'Close':'Lessons'}}</button></header>
 <aside v-if="courseOpen" id="history-lessons" class="course course-open" @keydown.esc="courseOpen=false"><div class="eyebrow">PROTOTYPE CONTEXT</div><h2>One shared history.</h2><p>Selected states from the approved history, branch, and merge lessons; not a single eight-step production lesson.</p><a href="/?variant=A">Return to approved staging study</a><p>Remote setup is a separate decision.</p></aside>
 <main class="sheet">
  <div class="lesson-heading"><div class="lesson-topline"><div class="eyebrow">LOCAL HISTORY / VISUAL STUDY</div><div class="metadata"><span>{{variant}} · {{names[variant]}}</span><span>{{step+1}} / {{steps.length}}</span></div></div><h1>Different names. One shared history.</h1></div>
  <section class="stage history-stage" aria-label="History comparison">
   <div class="stage-top"><span class="pill">ALICE’S LOCAL REPOSITORY</span><button class="replay" :disabled="reduced" :title="reduced?'Unavailable with reduced motion':undefined" @click="replay++">Replay</button></div>
   <p class="head-readout"><b>HEAD</b> → <strong>{{current.head}}</strong> → {{headCommit}} <small><strong>*</strong> current branch · arrows point to parents · c1–c5 are illustrative IDs<span v-if="reduced"> · Replay unavailable with reduced motion</span></small></p>
   <div v-if="variant!=='C'" class="history-graph" :class="'graph-'+variant" :key="variant+':'+step+':'+replay">
    <svg :viewBox="variant==='A'?'-50 -65 1060 475':'0 -50 960 440'" role="img" aria-labelledby="history-title history-desc">
     <title id="history-title">{{names[variant]}}: {{current.short}}</title><desc id="history-desc">{{description}}</desc>
     <defs><clipPath id="comic-sphere-clip"><circle r="42"/></clipPath><pattern id="history-grid" width="56" height="28" patternUnits="userSpaceOnUse"><path d="M28 0L56 14 28 28 0 14Z" fill="none" stroke="#c6bbac" stroke-width=".65"/></pattern><marker id="parent-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5 0 10" fill="#5b514a"/></marker></defs>
     <rect x="-65" y="-95" width="1090" height="500" :fill="variant==='A'?'url(#history-grid)':'#faf4ec'" :opacity="variant==='A'?.45:1"/>
     <g v-if="variant==='B'" class="history-lanes"><path d="M50 260H930M330 50H700" stroke="#d5c4b3" stroke-dasharray="3 8"/><text x="50" y="380">SHARED PAST → NEWER SNAPSHOTS</text></g>
     <g v-for="link in links" :key="link.from.id+link.to.id"><path :d="parentEdge(link.from,link.to).path" fill="none" stroke="#5b514a" stroke-width="2" marker-end="url(#parent-arrow)"/><text v-if="link.from.id==='c5'" :transform="parentEdge(link.from,link.to).label" y="-6" class="parent-number" text-anchor="middle">parent {{link.order}}</text></g>
     <g v-for="c in visible" :key="c.id" :transform="`translate(${c.x},${c.y})`">
      <template v-if="variant==='A'"><ellipse cx="5" cy="49" rx="31" ry="6" fill="#cbbba6"/><circle class="commit-sphere" r="42" :fill="c.id===headCommit?'#f7b296':'#f3e3c9'"/><path d="M20-45C36-12 20 26-29 40L-29 60H60V-45Z" clip-path="url(#comic-sphere-clip)" :fill="c.id===headCommit?'#d87855':'#c4aa86'"/><circle r="42" fill="none" stroke="#302923" stroke-width="3"/><path d="M-28-12Q-25-27-11-30" fill="none" stroke="#fff8eb" stroke-width="5" stroke-linecap="round"/><text x="0" y="8" text-anchor="middle" class="commit-id">{{c.id}}</text><text x="0" y="80" text-anchor="middle" class="snapshot-text">notes.txt · {{c.notes}}</text><text v-if="c.ideas" x="0" y="101" text-anchor="middle" class="snapshot-text">ideas.txt</text></template>
      <template v-else><circle r="29" :fill="c.id===headCommit?'#f6c5b0':'#f7ecdf'" stroke="#34302b" stroke-width="2"/><text y="6" text-anchor="middle" class="commit-id">{{c.id}}</text><text y="57" text-anchor="middle" class="snapshot-text">{{c.title}}</text></template>
      <text v-if="!c.parents.length" :y="variant==='A'?125:100" text-anchor="middle" class="root-caption">root · no parent</text>
      <g v-if="current.main===c.id" :class="{'active-branch':current.head==='main'}" :transform="`translate(-86,${variant==='A'?-96:-90})`"><rect width="80" height="30" rx="4" :fill="current.head==='main'?'#f05032':'#dce1e3'" stroke="#34302b"/><text x="40" y="20" text-anchor="middle" class="branch-text">{{current.head==='main'?'* main':'main'}}</text><path :d="`M40 30L86 ${variant==='A'?50:61}`" stroke="#302923"/></g>
      <g v-if="current.ideas===c.id" :class="{'active-branch':current.head==='ideas'}" :transform="`translate(3,${variant==='A'?-96:-90})`"><rect width="86" height="30" rx="4" :fill="current.head==='ideas'?'#f05032':'#dce1e3'" stroke="#34302b"/><text x="43" y="20" text-anchor="middle" class="branch-text">{{current.head==='ideas'?'* ideas':'ideas'}}</text><path :d="`M43 30L-3 ${variant==='A'?50:61}`" stroke="#302923"/></g>
     </g>
    </svg>
   </div>
   <div v-else class="history-ledger" :key="variant+':'+step+':'+replay"><div class="ledger-heading">COMMIT / RECORDED SNAPSHOT / PARENTS</div><article v-for="c in [...visible].reverse()" :key="c.id"><b>{{c.id}}</b><div><strong>{{c.title}}</strong><p>notes.txt · {{c.notes}} {{c.ideas?' + ideas.txt':''}}</p></div><div class="ledger-parents">{{c.parents.length?'Parents: '+c.parents.join(' + '):'Root: no parent'}}<p><span v-if="current.main===c.id" class="branch-label" :class="{'is-current':current.head==='main'}">{{current.head==='main'?'* main':'main'}}</span> <span v-if="current.ideas===c.id" class="branch-label ideas-label" :class="{'is-current':current.head==='ideas'}">{{current.head==='ideas'?'* ideas':'ideas'}}</span></p></div></article></div>
   <div class="mobile-history" v-if="variant!=='C'"><p v-for="c in [...visible].reverse()" :key="c.id"><b>{{c.id}}</b> · notes.txt {{c.notes}}{{c.ideas?' + ideas.txt':''}}<br><small>{{c.parents.length?'Parents: '+c.parents.join(' + '):'Root: no parent'}}<span v-if="current.main===c.id"> · <strong v-if="current.head==='main'">* main</strong><template v-else>main</template></span><span v-if="current.ideas===c.id"> · <strong v-if="current.head==='ideas'">* ideas</strong><template v-else>ideas</template></span></small></p></div>
   <div class="checkout-strip"><div><b>WORKING DIRECTORY</b><p>notes.txt · {{current.working}}</p><p>ideas.txt · {{current.files?'present':'absent'}}</p></div><div><b>STAGING AREA</b><p>notes.txt · {{current.staged}}</p><p>ideas.txt · {{current.files?'present':'absent'}}</p></div><div><b>RECORDED SNAPSHOT</b><div class="snapshot-picker"><button v-for="c in visible" :key="c.id" :aria-pressed="selected.id===c.id" @click="inspect=c.id">{{c.id}}</button></div><p>{{selected.id}}: notes.txt {{selected.notes}}{{selected.ideas?' + ideas.txt':''}}</p></div></div>
   <div class="scene-note">{{step===0?'Unstaged edit remains; first commit has no parent.':'Clean checkout · working directory and staging area match '+headCommit+'.'}}</div>
  </section>
  <nav class="timeline history-timeline" aria-label="Illustrative states"><button v-for="(s,i) in steps" :key="s.short" :class="{active:step===i}" :aria-current="step===i?'step':undefined" @click="go(i)"><span>{{i+1}}</span>{{s.short}}</button></nav>
 </main>
 <aside class="rail"><section class="guide"><div class="guide-meta"><span class="eyebrow">{{step<2?'HISTORY':step<6?'BRANCHES':'MERGING'}}</span><span>{{step+1}} / {{steps.length}}</span></div><div class="guide-content" :key="step" aria-live="polite"><h2>{{current.title}}</h2><div v-if="step===4||step===6" class="editor-action"><span class="eyebrow">IN ALICE’S EDITOR</span><p>{{step===4?'Alice creates ideas.txt.':'Alice changes notes.txt from C to D.'}}</p></div><code aria-label="Git commands">{{current.command}}</code><p><InlineText :text="current.body"/></p><div class="insight"><b><svg class="idea-icon" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18h6M10 21h4M9 15c0-2-3-3-3-7a6 6 0 0 1 12 0c0 4-3 5-3 7v1H9z"/></svg> Key idea</b><p><InlineText :text="current.idea"/></p></div><details class="history-description"><summary>Read the diagram</summary><p>{{description}}</p><p>Each node represents a commit snapshot; the labels below it list its recorded files. Snapshot labels B, C, and D are illustrative file-content versions, not commit IDs. ideas.txt contains Alice’s new idea.</p></details></div><nav class="step-nav" aria-label="Walkthrough"><button :disabled="step===0" @click="go(step-1)">← Back</button><button class="primary" :disabled="step===steps.length-1" @click="go(step+1)">Next →</button></nav><small class="keyboard-hint">← → compares treatments, retaining the step</small></section></aside>
 <details class="state"><summary>Prototype state · {{variant}} · {{current.short}}</summary><pre>{{JSON.stringify({variant,step:step+1,HEAD:current.head,main:current.main,ideas:current.ideas,commits:visible,working:{notes:current.working,ideas:current.files},staging:{notes:current.staged,ideas:current.files} },null,2)}}</pre><p>Fixed authored states. Snapshot buttons inspect history, not checkout. No commands execute. No persistence.</p></details>
 <PrototypeSwitcher v-if="isDev" :variant="variant" :name="names[variant]" @cycle="cycle"/>
</div>
</template>
