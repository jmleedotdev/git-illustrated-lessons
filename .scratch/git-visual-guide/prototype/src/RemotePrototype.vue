<!-- THROWAWAY: three remote explanation treatments on the existing route. No Git/network mutations. -->
<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import InlineText from './InlineText.vue';
import PrototypeSwitcher from './PrototypeSwitcher.vue';
import './history-prototype.css';
import './remote-prototype.css';
const isDev=import.meta.env.DEV;
const names={A:'Two places, one history',B:'Hosted snapshot inspector',C:'Transfer receipt'};
type Variant=keyof typeof names;
const readVariant=():Variant=>{const v=new URLSearchParams(location.search).get('variant');return v==='B'||v==='C'?v:'A'};
const variant=ref<Variant>(readVariant());
const step=ref(0), replay=ref(0), courseOpen=ref(false), reduced=ref(false);
const media=matchMedia('(prefers-reduced-motion: reduce)');
const exampleUrl='https://github.com/alice-example/git-notes.git';
const steps=[
 {short:'Create empty',lesson:'08 / CREATE A REMOTE',title:'Alice makes a place on GitHub.',command:null,body:'Alice creates git-notes on GitHub. She leaves “Add a README”, .gitignore, and license unselected so the new repository starts empty. Bob sees an address, but no files: Alice’s existing commits are still only on her computer.',idea:'Creating an empty hosted repository does not publish Alice’s local work.',change:'GitHub repository created. No commits have been transferred.'},
 {short:'Name origin',lesson:'09 / CONNECT LOCAL AND REMOTE',title:'An address is not a transfer.',command:`git remote add origin ${exampleUrl}`,body:'In her existing local repository, Alice names this address origin. Bob asks whether her history is on GitHub now. Not yet: this command only stores the connection locally. origin is a conventional name, not a special synchronization service.',idea:'origin names the destination. Adding it sends no commits.',change:'Local connection configured. GitHub is still empty.'},
 {short:'Push main',lesson:'10 / PUSH THE WORK',title:'Now Alice sends recorded history.',command:'git push -u origin main',body:'Alice pushes main. Git sends its needed history, including the ideas commits already merged into main. GitHub’s main now points to c5. The separate local ideas branch name is not published. The -u option establishes main’s upstream as origin/main.',idea:'Push sends committed history—not uncommitted working-directory or staged contents.',change:'GitHub main points to c5. Local main has upstream origin/main.'},
 {short:'Inspect result',lesson:'10 / PUSH THE WORK',title:'Bob opens the recorded files.',command:null,body:'Bob looks at main on GitHub and sees notes.txt and ideas.txt from c5. The file list is the latest committed snapshot, with earlier commits available in its history. If Alice edits or stages something next, GitHub will not update by itself: she must commit and push again.',idea:'Upstream remembers the default destination for later pushes. It does not turn on automatic synchronization.',change:'The hosted snapshot matches c5. Local main and ideas remain in place.'}
];
const current=computed(()=>steps[step.value]!);
const connected=computed(()=>step.value>=1), pushed=computed(()=>step.value>=2);
const state=computed(()=>({variant:variant.value,step:step.value+1,local:{HEAD:'main',branches:{main:'c5',ideas:'c3'},commits:['c1','c2','c3','c4','c5'],working:'matches c5',staging:'matches c5',origin:connected.value?exampleUrl:null,upstream:pushed.value?'origin/main':null},hosted:{branches:pushed.value?{main:'c5'}:{},commits:pushed.value?['c1','c2','c3','c4','c5']:[],files:pushed.value?['notes.txt · D','ideas.txt · added']:[]}}));
// Same shared ancestry in both places; arrows point toward parents.
const nodes=[{id:'c1',x:50,y:170},{id:'c2',x:120,y:170},{id:'c3',x:190,y:85},{id:'c4',x:240,y:230},{id:'c5',x:315,y:170}];
const edges=[[1,0],[2,1],[3,1],[4,3],[4,2]];
function parentPath(edge:number[]){const a=nodes[edge[0]!]!,b=nodes[edge[1]!]!;const dx=b.x-a.x,dy=b.y-a.y,length=Math.hypot(dx,dy);return `M ${a.x+dx/length*25} ${a.y+dy/length*25} L ${b.x-dx/length*26} ${b.y-dy/length*26}`;}
function cycle(d:number){const keys:Variant[]=['A','B','C'];variant.value=keys[(keys.indexOf(variant.value)+d+3)%3]!;const u=new URL(location.href);u.searchParams.set('variant',variant.value);history.replaceState(null,'',u)}
function keys(e:KeyboardEvent){if(e.target instanceof HTMLElement&&e.target.closest('input,textarea,select,[contenteditable]'))return;if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();cycle(e.key==='ArrowRight'?1:-1)}}
function syncMotion(){reduced.value=media.matches}
function pop(){variant.value=readVariant()}
onMounted(()=>{syncMotion();media.addEventListener('change',syncMotion);addEventListener('keydown',keys);addEventListener('popstate',pop)});
onUnmounted(()=>{media.removeEventListener('change',syncMotion);removeEventListener('keydown',keys);removeEventListener('popstate',pop)});
</script>
<template>
<div class="workspace variant-A history-study remote-study">
 <header><a class="brand" href="?study=remote&variant=A"><span class="brand-icon">⌘</span> Git, illustrated</a><span class="header-section">LEARN / LOCAL → GITHUB</span><button class="lessons-toggle" aria-controls="remote-lessons" :aria-expanded="courseOpen" @click="courseOpen=!courseOpen">{{courseOpen?'Close':'Lessons'}}</button></header>
 <aside id="remote-lessons" :class="['course',{'course-open':courseOpen}]" @keydown.esc="courseOpen=false"><h2>From local to hosted.</h2><p>Representative states from the three approved final lessons, not a new four-lesson sequence.</p><div class="course-list"><span>08 Create a remote repository</span><span>09 Connect local and remote</span><span>10 Push the work</span></div><a href="?study=history&variant=A">History comparison</a></aside>
 <main class="sheet">
  <div class="lesson-heading"><div class="lesson-topline"><div class="eyebrow">{{current.lesson}}</div><div class="metadata"><span>BEGINNER</span><span>{{step+1}} / 4</span></div></div><h1>From Alice’s computer to GitHub.</h1></div>
  <div class="stage remote-stage">
   <div class="stage-top"><span class="pill">{{names[variant]}}</span><button class="replay" :disabled="reduced" @click="replay++">Replay</button></div>
   <p v-if="reduced" class="motion-note">Reduced motion: states change immediately; Replay is disabled.</p>
   <div class="remote-visual" :key="variant+'-'+step+'-'+replay">
    <template v-if="variant==='A'">
     <svg class="remote-map" viewBox="0 0 900 420" role="img" aria-labelledby="remote-title remote-desc">
      <title id="remote-title">Local and GitHub repositories, step {{step+1}}</title><desc id="remote-desc">Alice has c1 through c5 locally. {{connected?'origin is configured.':'No remote is configured.'}} {{pushed?'GitHub main points to c5 and includes all five commits. ideas remains a local branch only.':'GitHub has no commits. No history has been transferred.'}} HEAD remains on local main.</desc>
      <defs><pattern id="remote-grid" width="56" height="28" patternUnits="userSpaceOnUse"><path d="M28 0L56 14 28 28 0 14Z" fill="none" stroke="#c6bbac" stroke-width=".65"/></pattern><marker id="remote-parent" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5 0 10" fill="none" stroke="#77675c" stroke-width="2"/></marker><marker id="remote-transfer" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5 0 10" fill="none" stroke="#b33c25" stroke-width="2"/></marker></defs>
      <g v-for="(place,p) in ['ALICE’S COMPUTER','GITHUB · HOSTED REPOSITORY']" :key="place" :transform="`translate(${p?495:25},30)`">
       <rect width="380" height="330" rx="18" :fill="p?'#e8e6df':'#f6e2d1'" fill-opacity=".65"/>
       <rect class="repository-grid" x="10" y="70" width="360" height="245" fill="url(#remote-grid)" aria-hidden="true"/>
       <rect width="380" height="330" rx="18" fill="none" stroke="#a28f80" stroke-width="1.5" stroke-dasharray="1 6" stroke-linecap="round"/>
       <text x="18" y="30" class="remote-zone">{{place}}</text><text x="18" y="54" class="remote-sub">{{p?'alice-example / git-notes':'HEAD → main → c5'}}</text>
       <g v-if="!p||pushed" transform="translate(10,40)">
        <path v-for="(edge,i) in edges" :key="i" :d="parentPath(edge)" stroke="#77675c" stroke-width="2" marker-end="url(#remote-parent)"/>
        <g v-for="n in nodes" :key="n.id" :transform="`translate(${n.x},${n.y})`">
         <ellipse cy="24" cx="4" rx="24" ry="7" fill="#b4a18f"/>
         <circle r="23" :fill="n.id==='c5'?'#f6b49d':'#fff5e8'" stroke="#302923" stroke-width="2.5"/>
         <path d="M -2 -22 A23 23 0 0 1 8 21 Q24 3 -2 -22" fill="#302923" opacity=".14"/>
         <path d="M-13 -9Q-10 -16 -4 -16" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
         <text y="5" text-anchor="middle" class="remote-node">{{n.id}}</text>
        </g>
        <rect x="270" y="109" width="90" height="26" rx="5" :fill="p?'#dce1e3':'#f05032'" stroke="#302923"/><text x="315" y="127" text-anchor="middle" class="remote-label">{{p?'main':'* main'}}</text><path d="M315 135V146" stroke="#302923"/>
        <template v-if="!p"><rect x="143" y="33" width="94" height="26" rx="5" fill="#dce1e3" stroke="#302923"/><text x="190" y="51" text-anchor="middle" class="remote-label">ideas</text><path d="M190 59V62" stroke="#302923"/></template>
       </g>
       <template v-else><rect x="45" y="105" width="290" height="140" rx="9" fill="none" stroke="#a28f80" stroke-dasharray="6 6"/><text x="190" y="168" text-anchor="middle" class="remote-empty">No commits yet</text><text x="190" y="197" text-anchor="middle" class="remote-sub">No files or main branch yet</text></template>
      </g>
      <path v-if="connected" d="M405 140H495" stroke="#77675c" stroke-dasharray="5 5" stroke-width="2"/>
      <text x="450" y="126" text-anchor="middle" class="remote-link-label">{{connected?'origin':'no link'}}</text>
      <template v-if="pushed"><path d="M405 285H490" stroke="#b33c25" stroke-width="3" marker-end="url(#remote-transfer)"/><text x="450" y="312" text-anchor="middle" class="remote-link-label">push</text></template>
     </svg>
     <div class="remote-mobile"><h3>Alice’s computer</h3><p>HEAD → <b>* main → c5</b><br>ideas → c3 · commits c1–c5 remain local.</p><p class="connection">{{connected?'origin → GitHub address':'No origin configured'}}<br>{{pushed?'Push sent main’s history.':'No history sent.'}}</p><h3>GitHub / git-notes</h3><p>{{pushed?'main → c5 · all five commits · no ideas branch':'Empty: no commits, files, or main branch yet.'}}</p></div>
    </template>
    <div v-else-if="variant==='B'" class="hosted-inspector">
     <div class="hosted-address">GITHUB / alice-example / git-notes <span>Illustration</span></div>
     <template v-if="pushed"><h2>main <span>c5 · Merge ideas</span></h2><div class="hosted-file"><b>notes.txt</b><span>Recorded version D</span></div><div class="hosted-file"><b>ideas.txt</b><span>Recorded addition</span></div><p class="hosted-history">5 commits reachable from main · no separate ideas branch</p><p class="hosted-caption">You are inspecting the latest committed snapshot, not Alice’s live working directory.</p></template>
     <template v-else><div class="empty-host"><span class="eyebrow">EMPTY REPOSITORY</span><h2>A place for history.<br>Nothing published yet.</h2><p>No commits · no files · no main branch</p></div><div class="example-address">{{exampleUrl}}</div></template>
     <div class="local-dock"><b>ALICE’S COMPUTER</b><p>HEAD → * main → c5 · ideas → c3</p><p>{{connected?'origin configured':'No origin configured'}} · {{pushed?'upstream origin/main':'no upstream'}}</p><strong>{{pushed?'History sent; local repository retained.':'All five commits still only local.'}}</strong></div>
    </div>
    <div v-else class="transfer-receipt">
     <div class="receipt-heading"><span class="eyebrow">PUBLICATION RECEIPT / {{pushed?'SENT':'NOT SENT'}}</span><h2>{{pushed?'main’s history was published.':'Nothing has crossed yet.'}}</h2></div>
     <dl><div><dt>Destination</dt><dd>{{connected?'origin · GitHub / git-notes':'Not connected locally'}}</dd></div><div><dt>Branch update</dt><dd>{{pushed?'GitHub main → c5':'None · GitHub remains empty'}}</dd></div><div><dt>Included history</dt><dd>{{pushed?'c1, c2, c3, c4, c5 (including merged ideas work)':'None'}}</dd></div><div><dt>Latest snapshot</dt><dd>{{pushed?'notes.txt · D / ideas.txt · added':'No hosted files'}}</dd></div><div><dt>Not published</dt><dd>The separate ideas branch name; any uncommitted edits or staged contents.</dd></div><div><dt>Upstream</dt><dd>{{pushed?'Local main → origin/main; not automatic sync':'Not configured'}}</dd></div></dl>
     <p class="receipt-kept">Still on Alice’s computer: all five commits, * main → c5, ideas → c3.</p>
    </div>
   </div>
   <div class="scene-note">{{current.change}}</div>
  </div>
  <div class="timeline remote-timeline" aria-label="Remote explanation steps"><button v-for="(s,i) in steps" :key="s.short" :class="{active:i===step}" :aria-current="i===step?'step':undefined" @click="step=i"><span>{{i+1}}</span>{{s.short}}</button></div>
 </main>
 <aside class="rail"><section class="guide"><div class="guide-meta"><span class="eyebrow">LOCAL → HOSTED</span><span>{{step+1}} / 4</span></div><div class="guide-content" :key="step" aria-live="polite"><h2>{{current.title}}</h2><code v-if="current.command" aria-label="Git command">{{current.command}}</code><div v-else-if="step===0" class="editor-action"><span class="eyebrow">ON GITHUB · ILLUSTRATED, NOT LIVE</span><p>Create repository → git-notes → leave README, .gitignore, and license unselected.</p></div><p><InlineText :text="current.body"/></p><div class="insight"><b>☼ Key idea</b><p><InlineText :text="current.idea"/></p></div><details class="history-description"><summary>Diagram in words</summary><p>Alice’s local repository keeps five commits. HEAD points to main at c5; ideas stays at c3. {{pushed?'GitHub now has those five commits and a main branch at c5, but no ideas branch.':'GitHub is empty.'}} {{connected?'origin stores the remote address locally.':'origin is not yet configured.'}} {{pushed?'Local main’s upstream is origin/main.':'No upstream exists yet.'}}</p></details><p class="prerequisite">Assumed: Git installed, commit identity set, GitHub account, and working HTTPS authentication. No setup or credential tutorial.</p></div><nav class="step-nav" aria-label="Walkthrough"><button :disabled="step===0" @click="step--">← Back</button><button class="primary" :disabled="step===3" @click="step++">Next →</button></nav><small class="keyboard-hint">Numbered steps jump · ← → compares treatments</small></section></aside>
 <details class="state"><summary>Disposable remote study · {{variant}} · step {{step+1}}</summary><pre>{{JSON.stringify(state,null,2)}}</pre><p>Fixed authored states. No account access, Git commands, persistence, or network mutations. Example URL only. Clean working directory and staging area in this scenario; exclusion of uncommitted contents is explanatory.</p></details>
 <PrototypeSwitcher v-if="isDev" :variant="variant" :name="names[variant]" @cycle="cycle"/>
</div>
</template>
