<template>
    <div class="mx-auto">
        <!-- Applications Section -->
        <section class="mb-12">
            <div class="flex items-center justify-between mb-8">
                <h2 class="text-xl font-semibold">Список Заявок</h2>
                <Button
                    variant="default"
                    @click="openAddApplicationModal">
                    <Icon
                        name="bi:plus-circle"
                        class="w-5 h-5 mr-2" />
                    Додати Заявку
                </Button>
            </div>
            <div class="mb-6">
                <Input
                    v-model="globalFilter"
                    placeholder="Пошук..."
                    class="max-w-sm" />
            </div>

            <div class="rounded-lg border shadow-sm overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead
                                v-for="header in table.getFlatHeaders()"
                                :key="header.id"
                                :class="[
                                    'px-4 py-2 text-left font-medium text-gray-700 border-b',
                                    header.column.getCanSort() ? 'cursor-pointer select-none' : ''
                                ]"
                                @click="header.column.getCanSort() && header.column.toggleSorting()">
                                <div class="flex items-center gap-2">
                                    {{ header.column.columnDef.header }}
                                    <template v-if="header.column.getCanSort()">
                                        <Icon
                                            v-if="header.column.getIsSorted() === 'asc'"
                                            name="heroicons:chevron-up"
                                            class="h-4 w-4" />
                                        <Icon
                                            v-else-if="header.column.getIsSorted() === 'desc'"
                                            name="heroicons:chevron-down"
                                            class="h-4 w-4" />
                                        <Icon
                                            v-else
                                            name="heroicons:chevron-up-down"
                                            class="h-4 w-4 opacity-50" />
                                    </template>
                                </div>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow
                            v-for="row in table.getRowModel().rows"
                            :key="row.id">
                            <TableCell
                                v-for="cell in row.getVisibleCells()"
                                :key="cell.id">
                                <template v-if="cell.column.id === 'actions'">
                                    <div class="flex items-center gap-2">
                                        <button
                                            class="p-2 w-[36px] h-[36px] text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-100 transition-all duration-300"
                                            @click="handleOpenEditPopup(row.original)">
                                            <Icon
                                                name="cuida:edit-outline"
                                                class="w-5 h-5" />
                                        </button>
                                        <button
                                            class="p-2 w-[36px] h-[36px] text-red-600 hover:text-red-800 rounded-full hover:bg-red-100 transition-all duration-300"
                                            @click="openDeleteModal(row.original.orderId)">
                                            <Icon
                                                name="heroicons:trash"
                                                class="w-5 h-5" />
                                        </button>
                                        <button
                                            class="p-2 w-[36px] h-[36px] text-green-600 hover:text-green-800 rounded-full hover:bg-green-100 transition-all duration-300"
                                            @click="handleOpenViewPopup(row.original)">
                                            <Icon
                                                name="heroicons:eye"
                                                class="w-5 h-5" />
                                        </button>
                                    </div>
                                </template>
                                <template v-else>
                                    <FlexRender
                                        :render="cell.column.columnDef.cell"
                                        :props="cell.getContext()" />
                                </template>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </section>

        <!-- Add Application Modal -->
        <Dialog v-model:open="showAddApplicationModal">
            <DialogContent class="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Додати Нову Заявку</DialogTitle>
                    <DialogDescription> Заповніть форму для створення нової заявки на обслуговування автомобіля. </DialogDescription>
                </DialogHeader>

                <form
                    @submit.prevent="addApplication"
                    class="space-y-4">
                    <div class="space-y-2">
                        <Label for="clientSelect">Клієнт</Label>
                        <Select
                            v-model="newApplication.clientId"
                            placeholder="Виберіть клієнта"
                            @update:modelValue="onClientSelect(Number(newApplication.clientId))"
                            required>
                            <SelectTrigger class="w-full">
                                <SelectValue placeholder="Виберіть клієнта" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Клієнти</SelectLabel>
                                    <SelectItem
                                        v-for="client in clients"
                                        :key="client.clientId"
                                        :value="client.clientId.toString()">
                                        {{ client.firstName }} {{ client.lastName }}
                                    </SelectItem>
                                </SelectGroup>
                                <SelectSeparator />
                                <NuxtLink to="/clients">
                                    <Button
                                        variant="ghost"
                                        class="w-full text-left">
                                        + Додати Клієнта
                                    </Button>
                                </NuxtLink>
                            </SelectContent>
                        </Select>
                    </div>

                    <div class="space-y-2">
                        <Label for="carModelSelect">Авто клієнта</Label>
                        <Select
                            v-model="newApplication.carModelId"
                            placeholder="Авто клієнта"
                            required>
                            <SelectTrigger class="w-full">
                                <SelectValue placeholder="Виберіть авто" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Авто клієнта</SelectLabel>
                                    <SelectItem
                                        v-for="car in selectedCarClient?.clientCars"
                                        :key="car.vin"
                                        :value="car?.carModel?.modelId?.toString()"
                                        v-if="selectedCarClient?.clientCars?.length">
                                        {{ car?.carModel?.modelName }} {{ car?.carModel?.modelYear }}
                                    </SelectItem>
                                    <div
                                        class="text-gray-400 text-center"
                                        v-else
                                        value="0">
                                        Немає доступних станцій для вашого авто
                                    </div>
                                </SelectGroup>
                                <SelectSeparator />
                                <NuxtLink to="/cars">
                                    <Button
                                        variant="ghost"
                                        class="w-full text-left">
                                        + Додати Модель
                                    </Button>
                                </NuxtLink>
                            </SelectContent>
                        </Select>
                    </div>

                    <div class="space-y-2">
                        <Label for="stationSelect">Станція Обслуговування</Label>
                        <Select
                            v-model="newApplication.stationId"
                            placeholder="Виберіть станцію"
                            required>
                            <SelectTrigger class="w-full">
                                <SelectValue placeholder="Виберіть станцію" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Станції</SelectLabel>
                                    <SelectItem
                                        v-for="station in selectedServicesByBrand"
                                        :key="station.stationId"
                                        :value="station.stationId.toString()"
                                        v-if="selectedServicesByBrand?.length">
                                        {{ station.stationName }}
                                    </SelectItem>
                                    <div
                                        class="text-gray-400 text-center"
                                        v-else
                                        value="0">
                                        Немає доступних станцій для вашого авто
                                    </div>
                                </SelectGroup>
                                <SelectSeparator />
                                <NuxtLink to="/services">
                                    <Button
                                        variant="ghost"
                                        class="w-full text-left">
                                        + Додати Станцію
                                    </Button>
                                </NuxtLink>
                            </SelectContent>
                        </Select>
                    </div>

                    <div class="space-y-2">
                        <Label for="orderDate">Дата Замовлення</Label>
                        <Input
                            id="orderDate"
                            type="date"
                            v-model="newApplication.orderDate"
                            required />
                    </div>

                    <div class="space-y-2">
                        <Label for="serviceType">Тип Обслуговування</Label>
                        <Input
                            id="serviceType"
                            v-model="newApplication.serviceType"
                            placeholder="Наприклад, ТО, ремонт двигуна"
                            required />
                    </div>

                    <div class="space-y-2">
                        <Label for="status">Статус</Label>
                        <Select
                            v-model="newApplication.status"
                            placeholder="Виберіть статус"
                            required>
                            <SelectTrigger class="w-full">
                                <SelectValue placeholder="Виберіть статус" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Статуси</SelectLabel>
                                    <SelectItem value="Очікування">Очікування</SelectItem>
                                    <SelectItem value="В роботі">В роботі</SelectItem>
                                    <SelectItem value="Завершено">Завершено</SelectItem>
                                    <SelectItem value="Скасовано">Скасовано</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div class="space-y-2">
                        <Label for="totalCost">Загальна Вартість (₴)</Label>
                        <Input
                            id="totalCost"
                            type="number"
                            step="0.01"
                            v-model="newApplication.totalCost"
                            placeholder="Наприклад, 250.00"
                            required />
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="secondary"
                            @click="closeAddApplicationModal">
                            Скасувати
                        </Button>
                        <Button
                            type="submit"
                            :disabled="isAddingApplication">
                            {{ isAddingApplication ? "Додається..." : "Додати" }}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>

        <!-- Delete Confirmation Modal -->
        <Dialog v-model:open="showDeleteModal">
            <DialogContent class="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Підтвердження Видалення</DialogTitle>
                    <DialogDescription> Ви впевнені, що хочете видалити цю заявку? Цю дію не можна скасувати. </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="secondary"
                        @click="closeDeleteModal">
                        Скасувати
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        @click="confirmDelete"
                        :disabled="isDeleting">
                        {{ isDeleting ? "Видаляється..." : "Видалити" }}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        <Dialog v-model:open="showViewPopup">
            <DialogScrollContent class="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Перегляд заявки # {{ showPopupData?.orderId }}</DialogTitle>
                </DialogHeader>

                <div v-if="showPopupData">
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell class="font-medium w-1/3 bg-slate-50">Дата запису</TableCell>
                                <TableCell>{{
                                    new Intl.DateTimeFormat("uk-UA", {
                                        timeZone: "Europe/Kiev",
                                        dateStyle: "full",
                                        timeStyle: "short"
                                    }).format(new Date(showPopupData?.orderDate ?? Date.now()))
                                }}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell class="font-medium w-1/3 bg-slate-50">Тип запису</TableCell>
                                <TableCell>{{ showPopupData.serviceType }}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell class="font-medium bg-slate-50">Статус</TableCell>
                                <TableCell>{{ showPopupData.status }}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell class="font-medium bg-slate-50">Ціна</TableCell>
                                <TableCell>{{
                                    new Intl.NumberFormat("uk-UA", {
                                        style: "currency",
                                        currency: "UAH",
                                        minimumFractionDigits: 0
                                    }).format(Number(showPopupData.totalCost))
                                }}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell class="font-medium bg-slate-50">Авто</TableCell>
                                <TableCell>{{ showPopupData.carModel.modelName }} – {{ showPopupData.carModel.modelYear }}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell class="font-medium bg-slate-50">СТО</TableCell>
                                <TableCell>{{ showPopupData.station.stationName }}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell class="font-medium bg-slate-50">Адреса СТО</TableCell>
                                <TableCell>{{ showPopupData.station.address }}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell class="font-medium bg-slate-50">Телефон СТО</TableCell>
                                <TableCell>{{ showPopupData.station.phone }}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="secondary"
                        @click="handleCloseViewPopup">
                        Скасувати
                    </Button>
                </DialogFooter>
            </DialogScrollContent>
        </Dialog>

        <Dialog v-model:open="showEditStatusModal">
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Редагування заявки</DialogTitle>
                </DialogHeader>

                <div class="grid gap-4 py-4">
                    <div class="grid gap-2">
                        <Label>Статус</Label>
                        <Select
                            v-model="editedStatus"
                            placeholder="Виберіть статус"
                            required>
                            <SelectTrigger class="w-full">
                                <SelectValue placeholder="Виберіть статус" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Статуси</SelectLabel>
                                    <SelectItem value="Очікування">Очікування</SelectItem>
                                    <SelectItem value="В роботі">В роботі</SelectItem>
                                    <SelectItem value="Завершено">Завершено</SelectItem>
                                    <SelectItem value="Скасовано">Скасовано</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div class="grid gap-2">
                        <Label for="serviceType">Тип Обслуговування</Label>
                        <Input
                            id="serviceType"
                            v-model="editedServiceType"
                            placeholder="Наприклад, ТО, ремонт двигуна" />
                    </div>

                    <div class="grid gap-2">
                        <Label for="totalCost">Загальна Вартість (₴)</Label>
                        <Input
                            id="totalCost"
                            type="number"
                            step="0.01"
                            v-model="editedTotalCost"
                            placeholder="Наприклад, 250.00" />
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        @click="handleCloseEditStatusPopup">
                        Скасувати
                    </Button>
                    <Button
                        type="submit"
                        @click="handleStatusSubmit">
                        Зберегти
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
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
    type ColumnDef,
    type SortingState
} from "@tanstack/vue-table";
import { ref, onMounted, watchEffect } from "vue";
import { toast } from "vue-sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectGroup,
    SelectLabel,
    SelectItem,
    SelectSeparator
} from "@/components/ui/select";
import type { ClientCar } from "./Clients.vue";

const { $axios } = useNuxtApp();

interface Application {
    orderId: number;
    clientId: number;
    stationId: number;
    carModelId: number;
    orderDate: string | null;
    serviceType: string;
    status: string;
    totalCost: string;
    carModel: CarModel;
    station: {
        stationId: number;
        stationName: string;
        cityId: number;
        address: string;
        phone: string;
        email: string;
        rating: string;
        registrationDate: string;
    };
}

interface Client {
    clientId: number;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    registrationDate: string;
    serviceOrders: Application[];
    clientCars?: ClientCar[];
}

interface selectedCarClient extends Client {
    clientCars: ClientCar[];
}

interface ServiceStation {
    stationId: number;
    stationName: string;
    specializations: Array<{ brandId: number }>;
}

export interface CarModel {
    modelId: number;
    modelName: string;
    modelYear: string;
}

const globalFilter = ref("");
const applications = ref<Application[]>([]);
const clients = ref<Client[]>([]);
const serviceStations = ref<ServiceStation[]>([]);
const showAddApplicationModal = ref(false);
const showDeleteModal = ref(false);
const selectedCarClient = ref<selectedCarClient>() || {};
const selectedServicesByBrand = ref();
const showEditStatusModal = ref(false);
const editedStatus = ref("");
const selectedApplicationId = ref<number | null>(null);
    const editedServiceType = ref('');
const editedTotalCost = ref<string>('');


const onClientSelect = (clientId: number) => {
    const selectedBrand = clients.value.find((client) => client.clientId === clientId);

    if (selectedBrand) {
        selectedCarClient.value = {
            ...selectedBrand,
            clientCars: selectedBrand.clientCars || []
        };

        selectedServicesByBrand.value = serviceStations.value.filter((station) => {
            return station.specializations.some((service) => {
                return (
                    selectedCarClient.value?.clientCars?.some((car) => car.carBrand && car.carBrand.brandId === service.brandId) || false
                );
            });
        });
    } else {
        selectedCarClient.value = {
            clientId: 0,
            firstName: "",
            lastName: "",
            phone: "",
            email: "",
            registrationDate: "",
            serviceOrders: [],
            clientCars: []
        };
    }
};
const newApplication = ref({
    clientId: "",
    stationId: "",
    carModelId: "",
    orderDate: "",
    serviceType: "",
    status: "",
    totalCost: ""
});

const deleteId = ref<number | null>(null);
const isAddingApplication = ref(false);
const isDeleting = ref(false);
const showViewPopup = ref(false);
const showPopupData = ref<Application | null>(null);

const columns: ColumnDef<Application>[] = [
    {
        accessorKey: "orderId",
        header: "# Заявки",
        enableSorting: true
    },
    {
        accessorKey: "clientId",
        header: "Клієнт",
        enableSorting: true,
        cell: ({ row }) => getClientName(row.getValue("clientId"))
    },
    {
        accessorKey: "stationId",
        header: "Станція",
        enableSorting: true,
        cell: ({ row }) => getStationName(row.getValue("stationId"))
    },
    {
        accessorKey: "carModelId",
        header: "Модель Авто",
        enableSorting: true,
        cell: ({ row }) => `${row.original.carModel.modelName} ${row.original.carModel.modelYear}`
    },
    {
        accessorKey: "orderDate",
        header: "Дата",
        enableSorting: true,
        cell: ({ row }) => formatDate(row.getValue("orderDate"))
    },
    {
        accessorKey: "serviceType",
        header: "Послуга",
        enableSorting: true
    },
    {
        accessorKey: "status",
        header: "Статус",
        enableSorting: true
    },
    {
        accessorKey: "totalCost",
        header: "Вартість",
        enableSorting: true,
        cell: ({ row }) => `${Number(row.original.totalCost).toFixed(0)} ₴`
    },
    {
        id: "actions",
        header: "Дії",
        enableSorting: false
    }
];

const table = useVueTable({
    get data() {
        return applications.value;
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

const fetchApplications = async () => {
    try {
        const response = await $axios.get<Application[]>("/service-orders");
        applications.value = response.data;
    } catch (error: any) {
        toast.error(`Помилка завантаження заявок: ${error.response?.data?.message || error.message}`);
    }
};

const fetchClients = async () => {
    try {
        const response = await $axios.get<Client[]>("/clients");
        clients.value = response.data;
    } catch (error: any) {
        toast.error(`Помилка завантаження клієнтів: ${error.response?.data?.message || error.message}`);
    }
};

const fetchServiceStations = async () => {
    try {
        const response = await $axios.get<ServiceStation[]>("/service-stations");
        serviceStations.value = response.data;
    } catch (error: any) {
        toast.error(`Помилка завантаження станцій: ${error.response?.data?.message || error.message}`);
    }
};

const addApplication = async () => {
    try {
        isAddingApplication.value = true;
        const payload = { ...newApplication.value };
        const response = await $axios.post<Application>("/service-orders", payload);
        applications.value.push(response.data);
        toast.success("Заявку успішно додано");
        closeAddApplicationModal();
        newApplication.value = {
            clientId: "",
            stationId: "",
            carModelId: "",
            orderDate: "",
            serviceType: "",
            status: "",
            totalCost: ""
        };
        fetchApplications();
    } catch (error: any) {
        toast.error(`Помилка при додаванні заявки: ${error.response?.data?.message || error.message}`);
    } finally {
        isAddingApplication.value = false;
    }
};

const openAddApplicationModal = () => {
    showAddApplicationModal.value = true;
};

const closeAddApplicationModal = () => {
    showAddApplicationModal.value = false;
    newApplication.value = {
        clientId: "",
        stationId: "",
        carModelId: "",
        orderDate: "",
        serviceType: "",
        status: "",
        totalCost: ""
    };
};

const openDeleteModal = (id: number) => {
    deleteId.value = id;
    showDeleteModal.value = true;
};

const closeDeleteModal = () => {
    showDeleteModal.value = false;
    deleteId.value = null;
};

const confirmDelete = async () => {
    if (deleteId.value === null) return;
    try {
        isDeleting.value = true;
        await $axios.delete(`/service-orders/${deleteId.value}`);
        applications.value = applications.value.filter((app) => app.orderId !== deleteId.value);
        toast.success("Заявку успішно видалено");
        closeDeleteModal();
    } catch (error: any) {
        toast.error(`Помилка при видаленні заявки: ${error.response?.data?.message || error.message}`);
    } finally {
        isDeleting.value = false;
    }
};

const handleOpenViewPopup = (applicationData: Application) => {
    showViewPopup.value = true;
    showPopupData.value = applicationData;
};

const handleCloseViewPopup = () => {
    showViewPopup.value = false;
    showPopupData.value = null;
};

const handleOpenEditPopup = (application: Application) => {
    selectedApplicationId.value = application.orderId;
    editedStatus.value = application.status;
    editedServiceType.value = application.serviceType;
    editedTotalCost.value = application.totalCost;
    showEditStatusModal.value = true;
};

const handleCloseEditStatusPopup = () => {
    showEditStatusModal.value = false;
    editedStatus.value = '';
    editedServiceType.value = '';
    editedTotalCost.value = '';
    selectedApplicationId.value = null;
};

const handleStatusSubmit = async () => {
    try {
        if (!selectedApplicationId.value) return;
        
        const updateData: any = {
            status: editedStatus.value
        };

        if (editedServiceType.value) {
            updateData.serviceType = editedServiceType.value;
        }

        if (editedTotalCost.value !== null) {
            updateData.totalCost = editedTotalCost.value;
        }

        await $axios.patch(`/service-orders/${selectedApplicationId.value}`, updateData);
        
        await fetchApplications();
        toast.success('Заявку успішно оновлено');
        handleCloseEditStatusPopup();
    } catch (error: any) {
        toast.error(`Помилка при оновленні заявки: ${error.response?.data?.message || error.message}`);
    }
};

const getClientName = (clientId: number): string => {
    const client = clients.value.find((c) => c.clientId === clientId);
    return client ? `${client.firstName} ${client.lastName}` : "-";
};

const getStationName = (stationId: number): string => {
    const station = serviceStations.value.find((s) => s.stationId === stationId);
    return station ? station.stationName : "-";
};

const formatDate = (date: string | null): string => {
    if (!date) return "-";
    const d = new Date(date);
    return d.toLocaleDateString();
};

onMounted(() => {
    fetchApplications();
    fetchClients();
    fetchServiceStations();
});

watchEffect(() => {
    table.setPageSize(20);
});
</script>

<style scoped></style>
