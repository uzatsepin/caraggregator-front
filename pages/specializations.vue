<template>
    <div>
        <h1 class="font-bold text-2xl mb-8">СТО за спеціалізацією</h1>

        <div>
            
        </div>
    </div>
</template>

<script setup lang="ts">
const { $axios } = useNuxtApp();

const fetchSpecializations = async () => {
    const response = await $axios.get('/specializations');
    const data = await response.data;
    console.log(data);
}


onMounted(() => {
    fetchSpecializations();
});
</script>

<style scoped>

</style>