<template>
    <div class="mx-auto">
        <div class="flex items-center justify-between mb-6">
            <Input
                v-model="globalFilter"
                placeholder="Пошук..."
                class="max-w-sm" />

            <Dialog v-model:open="showAddClientModal">
                <DialogTrigger asChild>
                    <Button variant="default">
                        <Icon
                            name="bi:person-add"
                            class="w-5 h-5 mr-2" />
                        Додати клієнта
                    </Button>
                </DialogTrigger>

                <DialogContent class="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Додати нового клієнта</DialogTitle>
                        <DialogDescription> Заповніть форму для створення нового клієнта. </DialogDescription>
                    </DialogHeader>

                    <form
                        @submit.prevent="handleSubmit"
                        class="space-y-4">
                        <div class="space-y-2">
                            <Label for="firstName">Ім'я</Label>
                            <Input
                                id="firstName"
                                v-model="formData.firstName"
                                placeholder="Введіть ім'я"
                                required />
                        </div>

                        <div class="space-y-2">
                            <Label for="lastName">Прізвище</Label>
                            <Input
                                id="lastName"
                                v-model="formData.lastName"
                                placeholder="Введіть прізвище"
                                required />
                        </div>

                        <div class="space-y-2">
                            <Label for="phone">Телефон</Label>
                            <Input
                                id="phone"
                                type="tel"
                                v-model="formData.phone"
                                placeholder="+380..."
                                required />
                        </div>

                        <div class="space-y-2">
                            <Label for="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                v-model="formData.email"
                                placeholder="email@example.com" />
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="secondary"
                                @click="handleCloseAddPopup">
                                Скасувати
                            </Button>
                            <Button
                                type="submit"
                                :disabled="isLoading">
                                {{ isLoading ? "Збереження..." : "Зберегти" }}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>

        <div class="rounded-lg border shadow-sm overflow-x-auto" v-if="!loading">
            <table class="w-full table-auto border-collapse">
                <thead class="bg-gray-50">
                    <tr>
                        <th
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
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white">
                    <tr
                        v-for="row in table.getRowModel().rows"
                        :key="row.id"
                        class="border-b hover:bg-gray-50 transition-colors">
                        <td
                            v-for="cell in row.getVisibleCells()"
                            :key="cell.id"
                            class="px-4 py-2 text-gray-600 border-b">
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
                                        @click="handleOpenDeletePopup(row.original.clientId)">
                                        <Icon
                                            name="heroicons:trash"
                                            class="w-5 h-5" />
                                    </button>
                                    <button
                                        class="p-2 w-[36px] h-[36px] text-green-600 hover:text-green-800 rounded-full hover:bg-green-100 transition-all duration-300"
                                        @click="handleOpenViewPopup(row.original.clientId)">
                                        <Icon
                                            name="heroicons:eye"
                                            class="w-5 h-5" />
                                    </button>
                                </div>
                            </template>
                            <template v-if="cell.column.id === 'car'">
                                <div
                                    v-if="
                                        row.original.clientCars[0]?.carBrand?.brandName && row.original.clientCars[0]?.carModel.modelName
                                    ">
                                    <Button
                                        @click="handleOpenCarPopup(row.original)"
                                        variant="secondary">
                                        {{ row.original.clientCars[0]?.carBrand?.brandName }}
                                        {{ row.original.clientCars[0]?.carModel.modelName }}
                                        <Icon
                                            name="mingcute:car-fill"
                                            class="w-5 h-5" />
                                    </Button>
                                </div>
                                <div v-else>
                                    <Button @click="handleOpenCarPopup(row.original)">
                                        Додати авто
                                        <Icon
                                            name="mingcute:car-fill"
                                            class="w-5 h-5" />
                                    </Button>
                                </div>
                            </template>
                            <template v-else>
                                <FlexRender
                                    :render="cell.column.columnDef.cell"
                                    :props="cell.getContext()" />
                            </template>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-else class="flex items-center justify-center">
            <Preloader />
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
                    @click="table.previousPage()"
                >
                    Попередня
                </button>
                <button
                    class="rounded-md px-3 py-2 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                    :disabled="!table.getCanNextPage()"
                    @click="table.nextPage()"
                >
                    Наступна
                </button>
            </div>
        </div>

        <Dialog v-model:open="showDeleteClientModal">
            <DialogContent class="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Підтвердження видалення</DialogTitle>
                    <DialogDescription> Ви впевнені, що хочете видалити цього клієнта? Цю дію не можна скасувати. </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="secondary"
                        @click="handleCloseDeletePopup">
                        Скасувати
                    </Button>
                    <Button
                        type="button"
                        @click="handleDelete"
                        variant="destructive"
                        :disabled="isLoading">
                        {{ isLoading ? "Видалення..." : "Видалити" }}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        <Dialog v-model:open="showEditClientModal">
            <DialogContent class="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Редагувати клієнта</DialogTitle>
                    <DialogDescription> Внесіть зміни до інформації клієнта. </DialogDescription>
                </DialogHeader>

                <form
                    @submit.prevent="handleEditSubmit"
                    class="space-y-4">
                    <div class="space-y-2">
                        <Label for="editFirstName">Ім'я</Label>
                        <Input
                            id="editFirstName"
                            v-model="editFormData.firstName"
                            placeholder="Введіть ім'я"
                            required />
                    </div>

                    <div class="space-y-2">
                        <Label for="editLastName">Прізвище</Label>
                        <Input
                            id="editLastName"
                            v-model="editFormData.lastName"
                            placeholder="Введіть прізвище"
                            required />
                    </div>

                    <div class="space-y-2">
                        <Label for="editPhone">Телефон</Label>
                        <Input
                            id="editPhone"
                            type="tel"
                            v-model="editFormData.phone"
                            placeholder="+380..."
                            required />
                    </div>

                    <div class="space-y-2">
                        <Label for="editEmail">Email</Label>
                        <Input
                            id="editEmail"
                            type="email"
                            v-model="editFormData.email"
                            placeholder="email@example.com" />
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="secondary"
                            @click="handleCloseEditPopup">
                            Скасувати
                        </Button>
                        <Button
                            type="submit"
                            :disabled="isLoading">
                            {{ isLoading ? "Збереження..." : "Зберегти" }}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>

        <Dialog v-model:open="showCarInfoPopup">
            <DialogScrollContent class="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle v-if="carInfoPopupData?.clientCars.length">Інформація про автомобіль</DialogTitle>
                    <DialogTitle v-else>Додати автомобіль для {{ carInfoPopupData?.firstName }} {{ carInfoPopupData?.lastName }}</DialogTitle>
                </DialogHeader>

                <div v-if="carInfoPopupData?.clientCars.length">
                    <div class="mt-4">
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell class="font-medium w-1/3 bg-slate-50">Номер авто</TableCell>
                                    <TableCell>{{ carInfoPopupData?.clientCars[0]?.licensePlate }}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell class="font-medium w-1/3 bg-slate-50">VIN-код</TableCell>
                                    <TableCell>{{ carInfoPopupData?.clientCars[0]?.vin }}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell class="font-medium bg-slate-50">Бренд</TableCell>
                                    <TableCell>{{ carInfoPopupData?.clientCars[0]?.carBrand.brandName }}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell class="font-medium bg-slate-50">Модель</TableCell>
                                    <TableCell>{{ carInfoPopupData?.clientCars[0]?.carModel.modelName }}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell class="font-medium bg-slate-50">Пробіг</TableCell>
                                    <TableCell>{{ carInfoPopupData?.clientCars[0]?.mileage }} км</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                    <div class="mt-4" v-if="carInfoPopupData.serviceOrders.length">
                        <h2 class="font-semibold text-slate-600">Записи на сервіс</h2>

                        <Table class="mt-4" v-for="item in carInfoPopupData.serviceOrders" :key="item.orderId">
                            <TableBody>
                                <TableRow>
                                    <TableHead class="font-medium bg-slate-50">Дата запису</TableHead>
                                    <TableCell>
                                        {{  new Date(item.orderDate).toLocaleString("uk-UA", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            timeZone: "Europe/Kiev"
                                        }) }}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableHead class="font-medium bg-slate-50">Назва сервісу</TableHead>
                                    <TableCell>
                                        {{ item.station.stationName }}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableHead class="font-medium bg-slate-50">Адреса</TableHead>
                                    <TableCell>
                                        {{ item.station.address }}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableHead class="font-medium bg-slate-50">Тип запису</TableHead>
                                    <TableCell>
                                        {{ item.serviceType }}
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableHead class="font-medium bg-slate-50">Статус</TableHead>
                                    <TableCell>
                                        {{ item.status }}
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableHead class="font-medium bg-slate-50">Ціна</TableHead>
                                    <TableCell>
                                        {{ item.totalCost }} ₴
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </div>
                <div
                    v-else
                    class="flex flex-col gap-4">
                    <div class="space-y-2">
                        <Label for="licensePlate">Номер авто</Label>
                        <Input
                            id="licensePlate"
                            type="text"
                            v-model="newCar.licensePlate"
                            required />
                    </div>
                    <div class="space-y-2">
                        <Label for="vin">VIN-код</Label>
                        <Input
                            id="vin"
                            type="text"
                            v-model="newCar.vin"
                            required />
                    </div>
                    <div class="space-y-2">
                        <Label for="vin">Пробіг</Label>
                        <Input
                            id="vin"
                            type="text"
                            v-model="newCar.mileage"
                            required />
                    </div>

                    <div class="space-y-2">
                        <Label for="carBrandSelect">Бренд Автомобіля</Label>
                        <Select
                            v-model="newCar.brand_id"
                            placeholder="Виберіть бренд"
                            required
                            @update:modelValue="onBrandSelect(Number(newCar.brand_id))">
                            <SelectTrigger class="w-full">
                                <SelectValue placeholder="Виберіть бренд" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Бренд Авто</SelectLabel>
                                    <SelectItem
                                        v-for="brand in carBrands"
                                        :key="brand.brandId"
                                        :value="brand.brandId.toString()">
                                        {{ brand.brandName }}
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div class="space-y-2">
                        <Label for="carModelSelect">Модель Автомобіля</Label>
                        <Select
                            v-model="newCar.model_id"
                            placeholder="Виберіть модель"
                            required
                            :disabled="!newCar.brand_id">
                            <SelectTrigger class="w-full">
                                <SelectValue placeholder="Виберіть модель" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Моделі Авто</SelectLabel>
                                    <SelectItem
                                        v-for="model in carModels"
                                        :key="model.modelId"
                                        :value="model.modelId.toString()">
                                        {{ model.modelName }} {{ model.modelYear }}
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        type="button"
                        variant="secondary"
                        @click="handleCloseCarPopup">
                        Закрити
                    </Button>
                    <Button
                        type="button"
                        @click="handleAddClientCar"
                        class="flex items-center justify-center"
                        :disabled="newCar.brand_id === undefined || newCar.model_id === undefined"
                        v-if="!carInfoPopupData?.clientCars.length">
                        <span v-if="isLoading"
                            ><Preloader
                                :width="5"
                                :height="5"
                        /></span>
                        <span v-else>Додати авто</span>
                    </Button>
                </DialogFooter>
            </DialogScrollContent>
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
import { ref, watchEffect, onMounted } from "vue";
import { toast } from "vue-sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const { $axios } = useNuxtApp();

interface ServiceOrder {
    orderId: number;
    clientId: number;
    stationId: number;
    carModelId: number;
    orderDate: string;
    serviceType: string;
    status: string;
    totalCost: string;
    station: Station;
}

interface CarBrand {
    brandId: number;
    brandName: string;
    brandLogo: string;
    countryOrigin: string;
    carModels: CarModel[];
}

interface CarModel {
    modelId: number;
    brandId: number;
    modelName: string;
    modelYear: string;
}

export interface ClientCar {
    id: number;
    licensePlate: string;
    vin: string;
    createdAt: string;
    updatedAt: string;
    carBrand: CarBrand;
    carModel: CarModel;
    mileage: string;
}

interface Station {
    address: string
    cityId: number
    email: string
    phone: string;
    rating: string;
    registrationDate: string;
    stationId: number;
    stationName: string;
}

interface Client {
    clientId: number;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    registrationDate: string;
    serviceOrders: ServiceOrder[];
    clientCars: ClientCar[];
}

const globalFilter = ref("");
const clients = ref<Client[]>([]);
const loading = ref(false);
const selectedClientId = ref<number | null>(null);
const showAddClientModal = ref(false);
const showDeleteClientModal = ref(false);
const showEditClientModal = ref(false);
const isLoading = ref(false);
const showCarInfoPopup = ref(false);
const carInfoPopupData = ref<Client | null>(null);
const carBrands = ref<CarBrand[]>([]);
const carModels = ref<CarModel[]>([]);

const onBrandSelect = (brandId: number) => {
    const selectedBrand = carBrands.value.find((brand) => brand.brandId === brandId);

    if (selectedBrand) {
        carModels.value = selectedBrand.carModels;
    } else {
        carModels.value = [];
    }
    newCar.value.model_id = undefined;
};

const newCar = ref({
    licensePlate: "",
    vin: "",
    clientId: 0,
    brand_id: undefined,
    model_id: undefined,
    mileage: undefined
});

const formData = ref({
    firstName: "",
    lastName: "",
    phone: "",
    email: ""
});

const editFormData = ref({
    clientId: 0,
    firstName: "",
    lastName: "",
    phone: "",
    email: ""
});

const columns: ColumnDef<Client>[] = [
    {
        accessorKey: "firstName",
        header: "Ім'я",
        enableSorting: true
    },
    {
        accessorKey: "lastName",
        header: "Прізвище",
        enableSorting: true
    },
    {
        accessorKey: "phone",
        header: "Телефон",
        enableSorting: true
    },
    {
        accessorKey: "email",
        header: "Email",
        enableSorting: true,
        cell: ({ row }) => {
            return h(
                "span",
                {
                    class: "text-gray-800 line-clamp-1"
                },
                `${row.original.email}`
            );
        }
    },
    {
        accessorKey: "car",
        header: "Автомобіль"
    },
    {
        accessorKey: "registrationDate",
        header: "Дата реєстрації",
        enableSorting: true,
        cell: ({ row }) =>
            row.original.registrationDate
                ? new Date(row.original.registrationDate).toLocaleString("uk-UA", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZone: "Europe/Kiev"
                  })
                : "-"
    },
    {
        id: "actions",
        header: "Дії",
        enableSorting: false
    }
];

const table = useVueTable({
    get data() {
        return clients.value;
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

const fetchClients = async () => {
    try {
        loading.value = true;
        const { data } = await $axios.get("/clients");
        clients.value = data;
    } catch (error: any) {
        toast.error("Помилка завантаження клієнтів");
    } finally {
        loading.value = false;
    }
};

const fetchCarBrands = async () => {
    try {
        const response = await $axios.get("/car-brands");
        carBrands.value = response.data;
    } catch (error) {
        console.error("Ошибка при получении брендов автомобилей:", error);
    }
};

const handleSubmit = async () => {
    try {
        isLoading.value = true;
        await $axios.post("/clients", formData.value);
        await fetchClients();
        toast.success("Клієнт успішно доданий");
        showAddClientModal.value = false;
        formData.value = {
            firstName: "",
            lastName: "",
            phone: "",
            email: ""
        };
    } catch (error: any) {
        toast.error(`Помилка при створенні клієнта: ${error.response?.data?.errorMessage || error.message}`);
    } finally {
        isLoading.value = false;
    }
};

const handleDelete = async () => {
    if (selectedClientId.value === null) return;
    try {
        isLoading.value = true;
        await $axios.delete(`/clients/${selectedClientId.value}`);
        toast.success("Клієнт успішно видалений");
        await fetchClients();
    } catch (error: any) {
        toast.error(`Помилка при видаленні клієнта: ${error.response?.data?.message || error.message}`);
    } finally {
        isLoading.value = false;
        handleCloseDeletePopup();
    }
};

const handleAddClientCar = async () => {
    if (!newCar.value.brand_id || !newCar.value.model_id) {
        toast.error("Виберіть бренд та модель автомобіля");
        return;
    }
    try {
        isLoading.value = true;
        await $axios.post(`/client-car`, {
            brand_id: Number(newCar.value.brand_id),
            client_id: carInfoPopupData.value?.clientId,
            licensePlate: newCar.value.licensePlate,
            model_id: Number(newCar.value.model_id),
            vin: newCar.value.vin,
            mileage: newCar.value.mileage
        });
        await fetchClients();
        toast.success("Автомобіль успішно доданий");
        newCar.value = {
            licensePlate: "",
            vin: "",
            clientId: 0,
            brand_id: undefined,
            model_id: undefined,
            mileage: undefined
        };
        handleCloseCarPopup();
    } catch (error: any) {
        toast.error(`Помилка при додаванні автомобіля: ${error.response?.data?.errorMessage || error.message}`);
    } finally {
        isLoading.value = false;
    }
};

const handleOpenDeletePopup = (id: number) => {
    selectedClientId.value = id;
    showDeleteClientModal.value = true;
};

const handleCloseDeletePopup = () => {
    selectedClientId.value = null;
    showDeleteClientModal.value = false;
};

const handleOpenEditPopup = (client: Client) => {
    editFormData.value = {
        clientId: client.clientId,
        firstName: client.firstName,
        lastName: client.lastName,
        phone: client.phone,
        email: client.email || ""
    };
    showEditClientModal.value = true;
};

const handleCloseEditPopup = () => {
    showEditClientModal.value = false;
    editFormData.value = {
        clientId: 0,
        firstName: "",
        lastName: "",
        phone: "",
        email: ""
    };
};

const handleCloseAddPopup = () => {
    showAddClientModal.value = false;
    formData.value = {
        firstName: "",
        lastName: "",
        phone: "",
        email: ""
    };
};

const handleEditSubmit = async () => {
    try {
        isLoading.value = true;
        const { clientId, firstName, lastName, phone, email } = editFormData.value;
        await $axios.put(`/clients/${clientId}`, { firstName, lastName, phone, email });
        await fetchClients();
        handleCloseEditPopup();
        toast.success("Клієнт успішно оновлений");
    } catch (error: any) {
        toast.error(`Помилка при оновленні клієнта: ${error.response?.data?.message || error.message}`);
    } finally {
        isLoading.value = false;
    }
};

const handleOpenViewPopup = (id: number) => {
    toast.info("Перегляд клієнта ще не реалізовано");
};

const handleOpenCarPopup = async (client: Client) => {
    try {
        await fetchCarBrands();
        carInfoPopupData.value = client;
        showCarInfoPopup.value = true;
    } catch (error: any) {
        toast.error(`Помилка при відкритті інформації про авто: ${error.response?.data?.message || error.message}`);
    }
};

const handleCloseCarPopup = () => {
    showCarInfoPopup.value = false;
    carInfoPopupData.value = null;
};

onMounted(fetchClients);

watchEffect(() => {
    table.setPageSize(10);
});
</script>

<style scoped>
table {
    border-collapse: collapse;
}

th,
td {
    border: 1px solid #e5e7eb;
}

th {
    background-color: #f9fafb;
}

th:hover {
    background-color: #f3f4f6;
}

button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}
</style>
