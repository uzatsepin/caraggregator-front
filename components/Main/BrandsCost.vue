<template>
    <div class="mt-6">
        <h2 class="text-3xl font-bold text-slate-800">Вартість ремонту по брендам</h2>
        <p class="mt-2 text-slate-700">Статистика вартості ремонту по брендам, для визначення який бренд частіше за все потрапляє на
            сервіс</p>

        <div class="mt-6 flex flex-nowrap overflow-x-scroll gap-6">
            <div class="px-4 py-6 border border-slate-200 rounded-2xl shadow-md min-w-[350px]" v-for="(brand, index) in brandsCost"
                 :key="index">
                <img :src="brand.brand_logo" alt="Brand" class="w-auto h-24 mx-auto" />
                <h3 class="font-bold text-xl text-center mt-4">{{ brand?.brand_name }}</h3>

                <div class="flex flex-col gap-4 mt-4">
                    <div class="flex gap-2">
                        <Icon name="material-symbols-light:order-approve" class="w-6 h-6" />
                        <p>Всього замовлень: <span class="font-bold">{{ brand.total_orders }}</span></p>
                    </div>
                    <div class="flex gap-2">
                        <Icon name="qlementine-icons:money-16" class="w-6 h-6" />
                        <p>Середня ціна: <span class="font-bold">{{ new Intl.NumberFormat("uk-UA", {
                                        style: "currency",
                                        currency: "UAH",
                                        minimumFractionDigits: 0
                                    }).format(Number(brand.avg_service_cost)) }}</span></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { toast } from "vue-sonner";

interface BrandCost {
    brand_name: string;
    brand_logo: string;
    total_orders: number;
    avg_service_cost: number;
}

const loading = ref<boolean>(false);
const brandsCost = ref<BrandCost[]>([]);
const { $axios } = useNuxtApp();


const fetchLogs = async () => {
    loading.value = true;
    try {
        const response = await $axios.get<BrandCost[]>("/stats");
        brandsCost.value = response.data;
    } catch (error: any) {
        toast.error(`Помилка завантаження заявок: ${error.response?.data?.message || error.message}`);
    } finally {
        loading.value = false;
    }
};


onMounted(async () => {
    try {
        await fetchLogs();
    } catch (error) {
        console.error("Failed to fetch logs:", error);
    }
});
</script>

<style scoped>

</style>