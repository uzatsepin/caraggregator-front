<template>
    <div>
        <h1 class="font-bold text-2xl">Головна сторінка</h1>

        <MainChartServices />

        <div class="mt-8">
            <h2 class="text-3xl font-bold text-slate-800">3 найкращих станції обслуговування</h2>
            <p class="mt-2 text-slate-700">Станції, які за прибутковістю та сумою замолень вважаються найкращими</p>
            <div class="flex gap-8">
                <MainTopService
                    v-for="item in topServices.slice(0, 3)"
                    :key="item.city_name"
                    :item="item"
                    :icon="item.icon" />
            </div>
        </div>

        <MainCarPopularity />

        <MainBrandsCost />

        <MainStationPerformance />

        <MainStationBrandRevenue />
    </div>
</template>

<script setup lang="ts">
const { $axios } = useNuxtApp();

export interface ITopService {
    station_name: string;
    city_name: string;
    total_cost: number;
    total_orders: number;
    icon?: string;
    avg_order_cost: number;
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
