<template>
    <div>
        <div class="mt-4 border rounded-2xl p-4 w-fit">
            <Icon :name="icon ? icon : ''" class="w-12 h-12 block mx-auto" />
            <h3 class="font-bold text-center text-slate-800 mt-4">{{ item?.station_name }}</h3>
            <p class="flex items-center gap-2 mt-4">
                <Icon name="lucide:navigation" class="w-5 h-5"/>
                <span class="text-slate-600">{{item?.city_name}}</span>
            </p>
            <!-- <p class="flex items-center gap-2 mt-4">
                <Icon name="lucide:message-circle-heart" class="w-5 h-5" />
                <span class="text-slate-600">Рейтинг:</span>
                <span class="text-slate-800">{{item?.rating}}</span>
            </p> -->
            <p class="flex items-center gap-2 mt-4">
                <Icon name="maki:car-repair" class="w-5 h-5" />
                <span class="text-slate-600">Виконано замовлень:</span>
                <span class="text-slate-800">{{item?.total_orders}}</span>
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