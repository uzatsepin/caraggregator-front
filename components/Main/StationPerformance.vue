<template>
    <div class="mt-8">
        <h2 class="font-bold text-slate-700 text-xl">Статистика СТО</h2>

        <div class="w-full">
            <div class="flex items-center py-4">
                <input
                    type="text"
                    v-model="globalFilter"
                    placeholder="Пошук..."
                    class="max-w-sm block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2" />
            </div>

            <div class="rounded-md border">
                <table class="w-full">
                    <thead>
                        <tr class="border-b bg-muted/50">
                            <th
                                v-for="header in table.getFlatHeaders()"
                                :key="header.id"
                                class="h-12 px-4 text-left align-middle font-medium"
                                :class="{ 'cursor-pointer select-none': header.column.getCanSort() }"
                                @click="header.column.toggleSorting()">
                                {{ header.column.columnDef.header as string }}
                                <span v-if="header.column.getIsSorted()">
                                    <Icon
                                        v-if="header.column.getIsSorted() === 'desc'"
                                        name="lucide:arrow-down"
                                        class="inline-block w-4 h-4" />
                                    <Icon
                                        v-else
                                        name="lucide:arrow-up"
                                        class="inline-block w-4 h-4" />
                                </span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="row in table.getRowModel().rows"
                            :key="row.id"
                            class="border-b transition-colors hover:bg-muted/50">
                            <td
                                v-for="cell in row.getVisibleCells()"
                                :key="cell.id"
                                class="p-4">
                                <FlexRender
                                    :render="cell.column.columnDef.cell"
                                    :props="cell.getContext()" />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="flex items-center justify-between py-4">
                <span class="text-sm text-gray-700">
                    Сторінка {{ table.getState().pagination.pageIndex + 1 }} з
                    {{ table.getPageCount() }}
                </span>
                <div class="space-x-2">
                    <button
                        class="rounded-md px-3 py-2 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                        :disabled="!table.getCanPreviousPage()"
                        @click="table.previousPage()">
                        Попередня
                    </button>
                    <button
                        class="rounded-md px-3 py-2 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                        :disabled="!table.getCanNextPage()"
                        @click="table.nextPage()">
                        Наступна
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {
    FlexRender,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    useVueTable,
    type ColumnDef
} from "@tanstack/vue-table";
import { ref, watchEffect, onMounted, h } from "vue";
import { toast } from "vue-sonner";

interface Performance {
    station_name: string;
    city_name: string;
    brand_name: string;
    total_orders: string;
    unique_clients: string;
    avg_service_cost: string;
    total_revenue: string;
    completed_services: string;
}

const { $axios } = useNuxtApp();
const performance = ref<Performance[]>([]);
const loading = ref(false);

const fetchLogs = async () => {
    loading.value = true;
    try {
        const response = await $axios.get<Performance[]>("/performance");
        performance.value = response.data;
    } catch (error: any) {
        toast.error(`Помилка завантаження заявок: ${error.response?.data?.message || error.message}`);
    } finally {
        loading.value = false;
    }
};

const globalFilter = ref("");

onMounted(async () => {
    try {
        await fetchLogs();
    } catch (error) {
        console.error("Failed to fetch logs:", error);
    }
});

const columns: ColumnDef<Performance>[] = [
    {
        accessorKey: "station_name",
        header: "Назва станції"
    },
    {
        accessorKey: "city_name",
        header: "Місто"
    },
    {
        accessorKey: "total_orders",
        header: "Замовлень"
    },
    {
        accessorKey: "unique_clients",
        header: "Унікальних клієнтів"
    },
    {
        accessorKey: "avg_service_cost",
        header: "Середня вартість",
        cell: ({ row }) => h("span", `${new Intl.NumberFormat("uk-UA", {
                                        style: "currency",
                                        currency: "UAH",
                                        minimumFractionDigits: 0
                                    }).format(Number(row.original.avg_service_cost))}`)
    },
    {
        accessorKey: "total_revenue",
        header: "Заробіток",
        cell: ({ row }) => h("span", `${new Intl.NumberFormat("uk-UA", {
                                        style: "currency",
                                        currency: "UAH",
                                        minimumFractionDigits: 0
                                    }).format(Number(row.original.total_revenue))}`)
    },
    {
        accessorKey: "completed_services",
        header: "Завершено робіт"
    },
];

const table = useVueTable({
    get data() {
        return performance.value;
    },
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
        get globalFilter() {
            return globalFilter.value;
        }
    },
    onGlobalFilterChange: setGlobalFilter
});

function setGlobalFilter(value: string) {
    globalFilter.value = value;
}

watchEffect(() => {
    table.setPageSize(10);
});
</script>

<style scoped></style>
