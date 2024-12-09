<template>
    <div class="mt-8">
        <div class="">
            <div class="mb-12">
                <h2 class="text-3xl font-bold text-slate-800">Аналіз доходів автосервісів</h2>
                <p class="mt-2 text-slate-700">Порівняння доходів за брендами</p>
            </div>

            <div class="grid grid-cols-4 gap-6">
                <MainStationBrandRevenueCard
                        v-for="station in sortedStations"
                        :key="station.station_name"
                        :station="station"
                        :maxRevenue="maxRevenue"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface IStations {
    station_name: string;
    brand_name: string;
    brand_logo: string;
    total_revenue: string;
}

const { $axios } = useNuxtApp();

const stations = ref<IStations[]>([]);

const fetchStationsRevenue = async () => {
    try {
        const { data } = await $axios.get<IStations[]>("/station-revenue");
        stations.value = data;
    } catch (e) {
        console.error(e);
    }
};

const maxRevenue = computed(() => {
    return Math.max(...stations.value.map(station => parseFloat(station.total_revenue)));
});

const sortedStations = computed(() => {
    return [...stations.value].sort((a, b) =>
            parseFloat(b.total_revenue) - parseFloat(a.total_revenue)
    );
});

onMounted(() => {
    fetchStationsRevenue();
});
</script>