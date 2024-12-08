<template>
    <Icon 
        name="svg-spinners:180-ring-with-bg" 
        class="w-24 h-24"
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