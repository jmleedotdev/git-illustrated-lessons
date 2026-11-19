<!-- THROWAWAY: three staging/commit layouts on one route, selected with ?variant=A|B|C. Not production scaffolding. -->
<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import PrototypeSwitcher from './PrototypeSwitcher.vue';
import InlineText from './InlineText.vue';
const names = {A:'Git workspace · revised',B:'Reading notebook',C:'Scene-first walkthrough'};
type Variant = keyof typeof names;
function readVariant():Variant { const v = new URLSearchParams(location.search).get('variant'); return v === 'B'||v === 'C' ? v : 'A'; }
const variant=ref<Variant>(readVariant());
const step=ref(0);
const replayKey=ref(0);
const courseOpen=ref(false);
const isDev=import.meta.env.DEV;
const steps=[
 {tag:'SETUP',title:'Alice edits her notes.',command:null,body:'Alice is updating notes.txt while Bob sits beside her. She changes the file from A to B. Bob asks whether Git has recorded the update yet. Not yet: B exists only in Alice’s working directory; the staging area still matches the previous commit, A.',insight:'The three spaces show versions of the same file, not three separate projects.',change:'notes.txt now contains version B; the staged version is still A.',working:'B',staged:'A',committed:'A'},
 {tag:'TECHNIQUE',title:'Alice chooses B for the commit.',command:'git add notes.txt',body:'Alice wants the next commit to include B, so she runs git add notes.txt. Git records B in the staging area. Bob notices that the working file has not gone anywhere: staging recorded its contents rather than moving it.',insight:'Staging copies the current contents. It does not remove the file from the working directory.',change:'The staging area now holds version B of notes.txt.',working:'B',staged:'B',committed:'A'},
 {tag:'INSIGHT',title:'Bob spots one more change.',command:null,body:'Before Alice commits, Bob suggests another sentence. Alice adds it, making the working file C. “Will that sentence be in the commit too?” Bob asks. The staging area still holds B: Alice has not staged her latest edit.',insight:'One file can have both staged and unstaged changes at the same time.',change:'notes.txt now contains version C; the staged version is still B.',working:'C',staged:'B',committed:'A'},
 {tag:'RECAP',title:'Alice commits B, not C.',command:'git commit -m "Update notes"',body:'Alice decides to save the staged update first and runs git commit. The new snapshot contains B. Bob’s suggested sentence is still in the working file, C, but is not in this commit. Alice can stage and commit that later edit separately.',insight:'After this commit, the staging area matches the new commit. It is not an empty box.',change:'The new commit contains version B of notes.txt; version C remains unstaged.',working:'C',staged:'B',committed:'B'}
];
const current=computed(()=>steps[step.value]!);
const zones=computed(()=>[
 {label:'WORKING DIRECTORY',version:current.value.working,color:variant.value==='A'?'#f6d2b7':'#fcdcbd',sub:'Alice’s current file'},
 {label:'STAGING AREA',version:current.value.staged,color:variant.value==='A'?'#dce1e3':'#e7ddf5',sub:'Proposed next snapshot'},
 {label:'LATEST COMMIT',version:current.value.committed,color:variant.value==='A'?'#f3ad96':'#cfe3b2',sub:step.value===3?'New snapshot · c2':'Previous snapshot · c1'}
]);
function cycle(delta:number) { const keys:Variant[]=['A','B','C']; variant.value=keys[(keys.indexOf(variant.value)+delta+3)%3]!; const url=new URL(location.href);url.searchParams.set('variant',variant.value);history.replaceState(null,'',url); }
function keydown(e:KeyboardEvent) {if(e.target instanceof HTMLElement && e.target.closest('input,textarea,select,[contenteditable]'))return;if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();cycle(e.key==='ArrowRight'?1:-1);}}
function popstate(){variant.value=readVariant();}
onMounted(()=>{addEventListener('keydown',keydown);addEventListener('popstate',popstate)});
onUnmounted(()=>{removeEventListener('keydown',keydown);removeEventListener('popstate',popstate)});
</script>
<template>
<div :class="['workspace','variant-'+variant]">
 <header><a href="#" @click.prevent="step=0" class="brand"><span class="brand-icon">⌘</span> Git, illustrated</a><span class="header-section">LEARN / LOCAL FUNDAMENTALS</span><button v-if="variant!=='B'" class="lessons-toggle" aria-controls="course-navigation" :aria-expanded="courseOpen" @click="courseOpen=!courseOpen">{{courseOpen?'Close':'Lessons'}}</button><span v-else class="draft">DISPOSABLE STUDY</span></header>
 <aside id="course-navigation" aria-label="Lesson list" :class="['course',{'course-open':courseOpen}]" @keydown.esc="courseOpen=false"><div class="eyebrow">THE LOCAL REPOSITORY</div><h2>A little less magic.</h2><p>Short visual explanations of the Git you use every day.</p><div class="course-list"><span>01 <b>Your working directory</b></span><span class="selected">02 <b>Staging & committing</b> ↗</span><span>03 <b>Reading history</b></span><span>04 <b>Branches & switching</b></span><span>05 <b>A simple merge</b></span></div><small>Navigation is context only.<br>Lesson grouping is not approved.</small></aside>
 <main class="sheet">
  <div class="lesson-heading"><div class="lesson-topline"><div class="eyebrow">LOCAL FUNDAMENTALS / 02</div><div class="metadata"><span>~ 3 MIN</span><span>BEGINNER</span><span>4 STEPS</span></div></div><h1>What goes into Alice’s commit?</h1></div>
  <div class="notebook-intro" v-if="variant==='B'"><span class="eyebrow">THE QUESTION</span><h2>Which version will Git remember?</h2><p>Follow one file through three distinct views of a repository.</p></div>
  <div class="stage">
   <div class="stage-top"><span class="pill">1 FILE · notes.txt</span><span class="pill">BRANCH main</span><button @click="replayKey++" class="replay">Replay</button></div>
   <svg viewBox="0 0 960 500" role="img" aria-labelledby="scene-title scene-desc" :class="{'flat':variant==='B'}">
    <title id="scene-title">Versions of notes.txt, step {{step+1}}</title><desc id="scene-desc">Working directory contains {{current.working}}. Staging area contains {{current.staged}}. Latest commit contains {{current.committed}}. {{current.change}}.</desc>
    <defs><pattern id="grid" width="56" height="28" patternUnits="userSpaceOnUse"><path d="M28 0L56 14 28 28 0 14Z" fill="none" stroke="#c6bbac" stroke-width=".7"/></pattern><radialGradient id="fade"><stop offset="0" stop-color="white"/><stop offset="1" stop-color="black"/></radialGradient><mask id="grid-mask"><rect width="960" height="500" fill="url(#fade)"/></mask><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5 0 10" fill="none" stroke="#6f6961" stroke-width="1.5"/></marker></defs>
    <rect width="960" height="500" fill="url(#grid)" mask="url(#grid-mask)" class="floor"/>
    <g class="transfer" v-if="step===1||step===3" :key="'transfer'+step+replayKey"><path :d="step===1?'M245 247 Q330 170 410 247':'M555 247 Q640 170 720 247'" fill="none" stroke="#6f6961" stroke-dasharray="5 6" marker-end="url(#arrow)"/><text :x="step===1?330:640" y="190" text-anchor="middle" class="diagram-caption">{{step===1?'record B':'snapshot B'}}</text></g>
    <g v-for="(zone,i) in zones" :key="zone.label" :transform="'translate('+(40+i*310)+',115)'">
     <text x="130" y="0" text-anchor="middle" class="zone-label">{{zone.label}}</text>
     <g class="iso-base"><ellipse cx="130" cy="250" rx="125" ry="28" fill="#ddd3c5" opacity=".4"/><path d="M10 201L130 143 250 201 130 259Z" :fill="zone.color" stroke="#34302b"/><path d="M10 201V220L130 278V259Z" fill="#e0d5c7" stroke="#34302b"/><path d="M130 259L250 201V220L130 278Z" fill="#c6bbac" stroke="#34302b"/></g>
     <g class="file" :key="zone.version+replayKey">
      <path d="M80 58H158L185 85V194H80Z" :fill="zone.color" stroke="#34302b" stroke-width="1.7"/><path d="M158 58V85H185" fill="none" stroke="#34302b" stroke-width="1.7"/><path d="M97 102H166M97 113H155M97 124H164" stroke="#34302b" opacity=".4"/><text x="132" y="166" text-anchor="middle" class="version">{{zone.version}}</text>
     </g>
     <text x="132" y="315" text-anchor="middle" class="file-label">notes.txt</text><text x="132" y="339" text-anchor="middle" class="diagram-caption">{{zone.sub}}</text>
    </g>
   </svg>
   <div class="scene-note"><span class="status-dot"></span>{{current.change}}</div>
  </div>
  <div class="timeline" aria-label="Explanation steps"><button v-for="(s,i) in steps" :key="s.title" :class="{active:i===step}" :aria-current="i===step?'step':undefined" @click="step=i"><span>{{i+1}}</span>{{['Edit','Stage','Edit again','Commit'][i]}}</button></div>
 </main>
 <aside class="rail">
  <section class="guide"><div class="guide-meta"><span class="eyebrow">{{current.tag}}</span><span>{{step+1}} / 4</span></div><div class="guide-content" :key="step" aria-live="polite"><h2>{{current.title}}</h2><code v-if="current.command" aria-label="Git command">{{current.command}}</code><div v-else class="editor-action"><span class="eyebrow">IN ALICE’S EDITOR</span><p><InlineText :text="step===0?'Alice edits notes.txt, creating version B from version A.':'Alice edits notes.txt again, creating version C from version B.'"/></p></div><p><InlineText :text="current.body"/></p><div class="insight"><b><svg class="idea-icon" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18h6M10 21h4M9 15c0-2-3-3-3-7a6 6 0 0 1 12 0c0 4-3 5-3 7v1H9z"/></svg> Key idea</b><p><InlineText :text="current.insight"/></p></div><div class="what-changed"><span class="eyebrow">WHAT CHANGED</span><p><InlineText :text="current.change"/></p></div></div><nav class="step-nav" aria-label="Walkthrough"><button :disabled="step===0" @click="step--">← Back</button><button class="primary" :disabled="step===3" @click="step++">Next →</button></nav><small class="keyboard-hint">Click steps to jump · ← → compares layouts</small></section>
  <section class="goals"><div class="eyebrow">THE MENTAL MODEL</div><p>✓ Working files stay in place.</p><p>{{step>=1?'✓':'○'}} Staging records a version.</p><p>{{step===3?'✓':'○'}} Commits use staged contents.</p></section>
 </aside>
 <details class="state"><summary>Prototype state · {{variant}} · step {{step+1}} · working {{current.working}} / staged {{current.staged}} / committed {{current.committed}}</summary><pre>{{JSON.stringify({variant,step:step+1,working:current.working,staged:current.staged,committed:current.committed},null,2)}}</pre><p>Illustrative versions of one tracked file. Other repository files are unchanged and omitted. No Git commands run. No persistence.</p></details>
 <PrototypeSwitcher v-if="isDev" :variant="variant" :name="names[variant]" @cycle="cycle"/>
</div>
</template>
