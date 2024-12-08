<template>
    <div class="mt-8 grid grid-cols-3">
        <div class="border border-slate-300 p-4 rounded-2xl w-fit">
            <h2 class="text-xl font-bold">
                Сума замовлень –
                <span class="text-slate-700">{{ chartData.reduce((prev, curr) => prev + curr.total, 0).toLocaleString("uk-UA") }} ₴</span>
            </h2>
            <AreaChart
                class="h-[100px] w-[400px] mt-6"
                index="name"
                :data="chartData"
                :categories="['total']"
                :show-grid-line="false"
                :show-legend="false"
                :show-x-axis="false"
                :show-y-axis="false"
                :curve-type="CurveType.Linear"
                :colors="['#22c55e']" />
        </div>
        <div class="border border-slate-300 p-4 rounded-2xl w-fit">
            <h2 class="text-xl font-bold">
                Зареєстровано сервісів –
                <span class="text-slate-700"
                    >{{ servicesChart.reduce((prev, curr) => prev + curr.total, 0).toLocaleString("uk-UA") }}
                </span>
            </h2>
            <AreaChart
                class="h-[100px] w-[400px] mt-6"
                index="name"
                :data="servicesChart"
                :categories="['total']"
                :show-grid-line="false"
                :show-legend="false"
                :show-x-axis="false"
                :show-y-axis="false"
                :curve-type="CurveType.Linear"
                :colors="['#F1C232']" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { CurveType } from "@unovis/ts";
import type { AxiosResponse } from "axios";
const { $axios } = useNuxtApp();

interface IOrder {
    carModel: {
        modelId: string;
        brandId: string;
        modelName: string;
        modelYear: string;
    };
    carModelId: number;
    client: {
        clientId: number;
        firstName: string;
        lastName: string;
        phoneNumber: string;
        registrationDate: string;
    };
    clientId: number;
    orderDate: string;
    orderId: number;
    serviceType: string;
    station: {
        stationId: number;
        stationName: string;
        cityId: number;
        address: string;
        email: string;
        phone: string;
        rating: string;
    };
    stationId: number;
    status: string;
    totalCost: string;
}

const chartData = ref<{ name: string; total: number }[]>([]);
const servicesChart = ref<{ name: string; total: number }[]>([]);

const fetchServiceOrders = async () => {
    try {
        const response: AxiosResponse<IOrder[]> = await $axios.get("/service-orders");
        const orders = response.data;

        const dailyTotals: { [key: string]: number } = {};

        orders.forEach((order) => {
            const orderDate = new Date(order.orderDate);
            const day = orderDate.toISOString().split("T")[0];
            dailyTotals[day] = (dailyTotals[day] || 0) + parseFloat(order.totalCost);
        });

        chartData.value = Object.keys(dailyTotals).map((day) => ({
            name: day,
            total: dailyTotals[day]
        }));
    } catch (error) {
        console.error(error);
    }
};

const fetchServices = async () => {
    try {
        const response: AxiosResponse<any[]> = await $axios.get("/service-stations");
        const services = response.data;

        const dailyRegistrations: { [key: string]: number } = {};

        services.forEach((service) => {
            const registrationDate = new Date(service.registrationDate);
            const day = registrationDate.toISOString().split("T")[0];

            dailyRegistrations[day] = (dailyRegistrations[day] || 0) + 1;
        });

        servicesChart.value = Object.keys(dailyRegistrations).map((day) => ({
            name: day,
            total: dailyRegistrations[day]
        }));
    } catch (error) {
        console.error(error);
    }
};

onMounted(() => {
    fetchServiceOrders();
    fetchServices();
});
</script>

<style scoped></style>
