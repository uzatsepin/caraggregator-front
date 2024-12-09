<template>
    <div class="rounded-lg border border-slate-300 shadow-xl hover:shadow-2xl transition-all duration-300">
        <div class="p-6">
            <h3 class="text-xl font-bold text-slate-800 mb-4">{{ station.station_name }}</h3>
            <div class="flex items-center space-x-4 mb-4">
                <div class="w-16 h-16 bg-slate-200 rounded-lg p-2 flex items-center justify-center">
                    <img :src="station.brand_logo" :alt="station.brand_name" class="max-h-full object-contain" />
                </div>
                <div>
                    <p class="text-slate-600 font-medium">{{ station.brand_name }}</p>
                    <p class="text-lg font-bold text-emerald-500">
                        {{ formatRevenue(station.total_revenue) }} ₴
                    </p>
                </div>
            </div>
            <div class="w-full bg-slate-50 h-2 rounded-full overflow-hidden">
                <div
                        class="bg-emerald-500 h-full transition-all duration-500"
                        :style="{ width: revenuePercentage + '%' }"
                ></div>
            </div>
            <p class="text-slate-600 text-sm mt-2">
                {{ revenuePercentage }}% від максимального доходу
            </p>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    station: {
        type: Object,
        required: true
    },
    maxRevenue: {
        type: Number,
        required: true
    }
});

const formatRevenue = (revenue) => {
    return parseFloat(revenue).toLocaleString('uk-UA');
};

const revenuePercentage = computed(() => {
    return Math.round((parseFloat(props.station.total_revenue) / props.maxRevenue) * 100);
});
</script>