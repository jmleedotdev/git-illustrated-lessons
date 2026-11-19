<script setup lang="ts">
defineProps<{variant: string; name: string}>();
defineEmits<{cycle:[delta:number]}>();
</script>
<template><div class="prototype-switcher" aria-label="Prototype variants"><button aria-label="Previous variant" @click="$emit('cycle',-1)">←</button><span>PROTOTYPE · {{variant}} / {{name}}</span><button aria-label="Next variant" @click="$emit('cycle',1)">→</button></div></template>
