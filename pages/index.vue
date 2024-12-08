<template>
    <div>
        <h1 class="font-bold text-2xl">Головна сторінка</h1>

        <MainChartServices />

        <div class="mt-8">
            <h2 class="font-bold text-slate-700">Топ 3 сервіси за рейтингом</h2>
            <div class="flex gap-8">
                <MainTopService
                    v-for="item in topServices.slice(0, 3)"
                    :key="item.city_name"
                    :item="item"
                    :icon="item.icon" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const { $axios } = useNuxtApp();

export interface ITopService {
    city_name: string;
    rating: string;
    station_name: string;
    total_orders: string;
    icon?: string;
}

const topServices = ref<ITopService[]>([]);

const fetchTopServices = async () => {
    try {
        const { data } = await $axios.get("/top-services");
        
        data.forEach((item: ITopService, index: number) => {
            if (index === 0) {
                item.icon = "fluent-emoji-flat:1st-place-medal";
            } else if (index === 1) {
                item.icon = "fluent-emoji-flat:2nd-place-medal";
            } else if (index === 2) {
                item.icon = "fluent-emoji-flat:3rd-place-medal";
            }
        });
        
        topServices.value = data;
    } catch (e) {
        console.error(e);
    }
};

onMounted(() => {
    fetchTopServices();
});
</script>

<style scoped></style>
