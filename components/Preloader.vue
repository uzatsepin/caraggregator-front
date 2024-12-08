<template>
    <Icon 
        name="svg-spinners:180-ring-with-bg" 
        :class="`w-${width} h-${height} min-w-${width} min-h-${height} max-w-${width} max-h-${height}`"
    />
</template>

<script setup lang="ts">
interface PreloaderProps {
    width?: number;
    height?: number;
}

withDefaults(defineProps<PreloaderProps>(), {
    width: 24,
    height: 24
})
</script>