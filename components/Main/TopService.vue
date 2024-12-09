<template>
    <div>
        <div class="mt-4 border rounded-2xl p-4 w-fit">
            <Icon :name="icon ? icon : ''" class="w-12 h-12 block mx-auto" />
            <h3 class="font-bold text-center text-slate-800 mt-4">{{ item?.station_name }}</h3>
            <p class="flex items-center gap-2 mt-4">
                <Icon name="lucide:navigation" class="w-5 h-5"/>
                <span class="text-slate-600">{{item?.city_name}}</span>
            </p>
            <p class="flex items-center gap-2 mt-4">
                <Icon name="maki:car-repair" class="w-5 h-5" />
                <span class="text-slate-600">Виконано замовлень:</span>
                <span class="text-slate-800">{{item?.total_orders}}</span>
            </p>

            <p class="flex items-center gap-2 mt-4">
                <Icon name="tdesign:money-filled" class="w-5 h-5" />
                <span class="text-slate-600">Всього зароблено:</span>
                <span class="text-slate-800">{{ new Intl.NumberFormat("uk-UA", {
                    style: "currency",
                    currency: "UAH",
                    minimumFractionDigits: 0
                }).format(Number(item?.total_cost)) }}</span>
            </p>

            <p class="flex items-center gap-2 mt-4">
                <Icon name="hugeicons:chart-average" class="w-5 h-5" />
                <span class="text-slate-600">Середня вартість:</span>
                <span class="text-slate-800">{{ new Intl.NumberFormat("uk-UA", {
                    style: "currency",
                    currency: "UAH",
                    minimumFractionDigits: 0
                }).format(Number(item?.avg_order_cost) || 0) }}</span>
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { ITopService } from '~/pages/index.vue';

defineProps<{
    item?: ITopService;
    icon?: string;
}>();
</script>

<style scoped>

</style>