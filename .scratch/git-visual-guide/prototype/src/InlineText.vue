<!-- THROWAWAY: emphasize known filenames and commands without rendering HTML. -->
<script setup lang="ts">
import { computed } from 'vue';
const props=defineProps<{text:string}>();
const parts=computed(()=>props.text.split(/(git add notes\.txt|git commit|notes\.txt|ideas\.txt|\B-u\b)/g).map((text,i)=>({text,code:i%2===1})));
</script>
<template><template v-for="(part,i) in parts" :key="i"><code v-if="part.code" class="inline-code">{{part.text}}</code><template v-else>{{part.text}}</template></template></template>
