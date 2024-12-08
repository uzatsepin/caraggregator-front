<template>
    <div class="mx-auto">
        <!-- Header with Global Filter and Add Service Station Button -->
        <div class="flex items-center justify-between mb-6">
            <Input
                v-model="globalFilter"
                placeholder="Пошук..."
                class="max-w-sm" />

            <Dialog v-model:open="showAddServiceStationModal">
                <DialogTrigger asChild>
                    <Button variant="default">
                        <Icon
                            name="bi:plus-circle"
                            class="w-5 h-5 mr-2" />
                        Додати станцію
                    </Button>
                </DialogTrigger>

                <DialogContent class="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Додати нову станцію</DialogTitle>
                        <DialogDescription> Заповніть форму для створення нової станції обслуговування. </DialogDescription>
                    </DialogHeader>

                    <form
                        @submit.prevent="handleAddSubmit"
                        class="space-y-4">
                        <div class="space-y-2">
                            <Label for="stationName">Назва станції</Label>
                            <Input
                                id="stationName"
                                v-model="addFormData.stationName"
                                placeholder="Введіть назву станції"
                                required />
                        </div>

                        <div class="space-y-2">
                            <Label for="city">Місто</Label>
                            <Select
                                v-model="addFormData.cityId"
                                v-model:open="isCitySelectOpen"
                                placeholder="Виберіть місто"
                                required
                                @update:open="handleSelectOpen">
                                <SelectTrigger class="w-full">
                                    <SelectValue placeholder="Виберіть місто" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Міста</SelectLabel>
                                        <SelectItem
                                            v-for="city in cities"
                                            :key="city.cityId"
                                            :value="city.cityId.toString()">
                                            {{ city.cityName }}
                                        </SelectItem>
                                    </SelectGroup>
                                    <SelectSeparator />
                                    <Button
                                        variant="ghost"
                                        class="w-full text-left"
                                        @click="openAddCityModal">
                                        + Додати місто
                                    </Button>
                                </SelectContent>
                            </Select>
                        </div>

                        <div class="space-y-2">
                            <Label for="address">Адреса</Label>
                            <Input
                                id="address"
                                v-model="addFormData.address"
                                placeholder="Введіть адресу"
                                required />
                        </div>

                        <div class="space-y-2">
                            <Label for="phone">Телефон</Label>
                            <Input
                                id="phone"
                                type="tel"
                                v-model="addFormData.phone"
                                placeholder="+380..."
                                required />
                        </div>

                        <div class="space-y-2">
                            <Label for="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                v-model="addFormData.email"
                                placeholder="email@example.com" />
                        </div>

                        <div class="space-y-2">
                            <Label for="rating">Рейтинг</Label>
                            <Input
                                id="rating"
                                type="number"
                                v-model="addFormData.rating"
                                placeholder="0.00"
                                min="0"
                                max="5"
                                step="0.01" />
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

        <!-- Service Stations Table -->
        <div
            v-if="serviceStations.length > 0"
            class="rounded-lg border shadow-sm overflow-x-auto">
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
                                        @click="handleOpenDeletePopup(row.original.stationId)">
                                        <Icon
                                            name="heroicons:trash"
                                            class="w-5 h-5" />
                                    </button>
                                    <button
                                        class="p-2 w-[36px] h-[36px] text-green-600 hover:text-green-800 rounded-full hover:bg-green-100 transition-all duration-300"
                                        @click="handleOpenViewPopup(row.original.stationId)">
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
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div
            v-else
            class="flex items-center justify-center">
            <p
                v-if="loading"
                class="text-gray-600">
                Завантаження...
            </p>
            <p
                v-else
                class="text-slate-600 font-bold text-3xl text-center mt-12">
                Дані відсутні
            </p>
        </div>

        <Dialog v-model:open="showAddCityModal">
            <DialogTrigger asChild>
                <Button class="hidden">Додати місто</Button>
            </DialogTrigger>

            <DialogContent class="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Додати нове місто</DialogTitle>
                    <DialogDescription> Заповніть форму для створення нового міста. </DialogDescription>
                </DialogHeader>

                <form
                    @submit.prevent="handleAddCity"
                    class="space-y-4">
                    <div class="space-y-2">
                        <Label for="cityName">Назва міста</Label>
                        <Input
                            id="cityName"
                            v-model="newCityName"
                            placeholder="Введіть назву міста"
                            required />
                        <Input
                            id="cityName"
                            v-model="newRegionName"
                            placeholder="Введіть назву області"
                            required />
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="secondary"
                            @click="closeAddCityModal">
                            Скасувати
                        </Button>
                        <Button
                            type="submit"
                            :disabled="isAddingCity">
                            {{ isAddingCity ? "Додається..." : "Додати" }}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>

        <Dialog v-model:open="showDeleteServiceStationModal">
            <DialogContent class="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Підтвердження видалення</DialogTitle>
                    <DialogDescription> Ви впевнені, що хочете видалити цю станцію? Цю дію не можна скасувати. </DialogDescription>
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
                        variant="destructive"
                        @click="handleDelete"
                        :disabled="isLoading">
                        {{ isLoading ? "Видалення..." : "Видалити" }}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        <Dialog v-model:open="showEditServiceStationModal">
            <DialogContent class="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Редагувати станцію</DialogTitle>
                    <DialogDescription> Внесіть зміни до інформації станції обслуговування. </DialogDescription>
                </DialogHeader>

                <form
                    @submit.prevent="handleEditSubmit"
                    class="space-y-4">
                    <div class="space-y-2">
                        <Label for="editStationName">Назва станції</Label>
                        <Input
                            id="editStationName"
                            v-model="editFormData.stationName"
                            placeholder="Введіть назву станції"
                            required />
                    </div>

                    <div class="space-y-2">
                        <Label for="editCity">Місто</Label>
                        <select
                            id="editCity"
                            v-model="editFormData.cityId"
                            required
                            class="block w-full p-2 border border-gray-300 rounded">
                            <option
                                disabled
                                value="">
                                Виберіть місто
                            </option>
                            <option
                                v-for="city in cities"
                                :key="city.cityId"
                                :value="city.cityId">
                                {{ city.cityName }}
                            </option>
                        </select>
                    </div>

                    <div class="space-y-2">
                        <Label for="editAddress">Адреса</Label>
                        <Input
                            id="editAddress"
                            v-model="editFormData.address"
                            placeholder="Введіть адресу"
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

                    <div class="space-y-2">
                        <Label for="editRating">Рейтинг</Label>
                        <Input
                            id="editRating"
                            type="number"
                            v-model="editFormData.rating"
                            placeholder="0.00"
                            min="0"
                            max="5"
                            step="0.01" />
                    </div>

                    <div class="space-y-2">
                        <ServicesMultiSelect
                            id="specializations"
                            label="Спеціалізації"
                            :options="carBrands"
                            v-model="specializationsData"
                        />
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

        <Dialog v-model:open="showViewPopup">
            <DialogContent class="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Деталі СТО {{ viewPopupData?.stationName }}</DialogTitle>
                    <DialogDescription> інформація про станцію технічного обслуговування {{ viewPopupData?.stationName }} </DialogDescription>
                </DialogHeader>

                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell class="font-medium w-1/3 bg-slate-50">Назва СТО</TableCell>
                            <TableCell>{{ viewPopupData?.stationName }}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell class="font-medium w-1/3 bg-slate-50">Рейтинг</TableCell>
                            <TableCell>{{ viewPopupData?.rating }}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell class="font-medium bg-slate-50">Місто\область</TableCell>
                            <TableCell>{{ viewPopupData?.city.cityName }} \ {{ viewPopupData?.city.region }}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell class="font-medium bg-slate-50">Адреса</TableCell>
                            <TableCell>{{viewPopupData?.address}}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell class="font-medium bg-slate-50">Спеціалізації (бренди)</TableCell>
                            <TableCell>{{ viewPopupData?.specializations.map(item => item.brand.brandName).join(', ') || '-'}}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell class="font-medium bg-slate-50">Замовлень</TableCell>
                            <TableCell>{{ viewPopupData?.serviceOrders.length}}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="secondary"
                        @click="handleCloseViewPopup">
                        Закрити
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
import { ref, watchEffect, onMounted } from "vue";
import { toast } from "vue-sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const { $axios } = useNuxtApp();

interface ServiceStation {
    stationId: number;
    stationName: string;
    cityId: number;
    address: string;
    phone: string;
    email: string | null;
    rating: string | null;
    specializations: Array<{
        id: number;
        stationId: number;
        brandId: number;
        brand: {
            brandId: number;
            brandName: string;
            brandLogo: string;
        };
    }>;
    city: {
        cityId: number;
        cityName: string;
        region: string;
    };
    serviceOrders: Array<{
        orderId: number;
        orderDate: string;
        orderStatus: string;
        car: {
            carId: number;
            carBrand: string;
            carModel: string;
            carYear: number;
            carNumber: string;
        };
    }>;
}

interface City {
    cityId: number;
    cityName: string;
}

const globalFilter = ref("");
const serviceStations = ref<ServiceStation[]>([]);
const cities = ref<City[]>([]);
const loading = ref(false);
const selectedServiceStationId = ref<number | null>(null);
const showAddServiceStationModal = ref(false);
const showDeleteServiceStationModal = ref(false);
const showEditServiceStationModal = ref(false);
const isLoading = ref(false);

const addFormData = ref({
    stationName: "",
    cityId: "",
    address: "",
    phone: "",
    email: "",
    rating: "",
});

const editFormData = ref({
    stationId: 0,
    stationName: "",
    cityId: "",
    address: "",
    phone: "",
    email: "",
    rating: ""
});

const specializationsData = ref<number[]>([]);

const columns: ColumnDef<ServiceStation>[] = [
    {
        accessorKey: "stationName",
        header: "Назва станції",
        enableSorting: true
    },
    {
        accessorKey: "cityId",
        header: "Місто",
        enableSorting: true,
        cell: ({ row }) => {
            const city = cities.value.find((c) => c.cityId === row.original.cityId);
            return city ? city.cityName : "-";
        }
    },
    {
        accessorKey: "address",
        header: "Адреса",
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
        cell: ({ row }) => row.original.email || "-"
    },
    {
        accessorKey: "rating",
        header: "Рейтинг",
        enableSorting: true,
        cell: ({ row }) => (row.original.rating ? parseFloat(row.original.rating).toFixed(2) : "-")
    },
    {
        id: "specializations",
        header: "Бренди",
        enableSorting: true,
        cell: ({ row }) => row.original.specializations.length || 0
    },
    {
        id: "actions",
        header: "Дії",
        enableSorting: false
    }
];

const table = useVueTable({
    get data() {
        return serviceStations.value;
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

const fetchServiceStations = async () => {
    try {
        loading.value = true;
        const { data } = await $axios.get("/service-stations");
        serviceStations.value = data;
    } catch (error: any) {
        toast.error("Помилка завантаження станцій");
    } finally {
        loading.value = false;
    }
};

const fetchCities = async () => {
    try {
        const { data } = await $axios.get("/cities");
        cities.value = data;
    } catch (error: any) {
        toast.error("Помилка завантаження міст");
    }
};

const handleCloseAddPopup = () => {
    showAddServiceStationModal.value = false;
    addFormData.value = {
        stationName: "",
        cityId: "",
        address: "",
        phone: "",
        email: "",
        rating: ""
    };
};

const handleAddSubmit = async () => {
    try {
        isLoading.value = true;
        await $axios.post("/service-stations", addFormData.value);
        await fetchServiceStations();
        toast.success("Станція успішно додана");
        handleCloseAddPopup();
        addFormData.value = {
            stationName: "",
            cityId: "",
            address: "",
            phone: "",
            email: "",
            rating: "",
        };
    } catch (error: any) {
        toast.error(`Помилка при створенні станції: ${error.response?.data?.errorMessage || error.message}`);
    } finally {
        isLoading.value = false;
    }
};

const handleDelete = async () => {
    if (selectedServiceStationId.value === null) return;
    try {
        isLoading.value = true;
        await $axios.delete(`/service-stations/${selectedServiceStationId.value}`);
        toast.success("Станцію успішно видалено");
        await fetchServiceStations();
    } catch (error: any) {
        toast.error(`Помилка при видаленні станції: ${error.response?.data?.message || error.message}`);
    } finally {
        isLoading.value = false;
        handleCloseDeletePopup();
    }
};

const handleOpenDeletePopup = (id: number) => {
    selectedServiceStationId.value = id;
    showDeleteServiceStationModal.value = true;
};

const handleCloseDeletePopup = () => {
    selectedServiceStationId.value = null;
    showDeleteServiceStationModal.value = false;
};

const handleOpenEditPopup = (station: ServiceStation) => {
    specializationsData.value = [...new Set(
        station.specializations.map(spec => spec.brandId)
    )];

    editFormData.value = {
        ...station,
        cityId: station.cityId.toString(),
        email: station.email || "",
        rating: station.rating || ""
    };
    showEditServiceStationModal.value = true;
};

const handleCloseEditPopup = () => {
    showEditServiceStationModal.value = false;
    editFormData.value = {
        stationId: 0,
        stationName: "",
        cityId: "",
        address: "",
        phone: "",
        email: "",
        rating: ""
    };
    specializationsData.value = [];
};

const handleEditSubmit = async () => {
    try {
        isLoading.value = true;
        const { stationId, stationName, cityId, address, phone, email, rating } = editFormData.value;
        await $axios.put(`/service-stations/${stationId}`, { stationName, cityId, address, phone, email, rating });
        await fetchServiceStations();
        handleSubmitSpecializations();
        toast.success("Станцію успішно оновлено");
        handleCloseEditPopup();
    } catch (error: any) {
        toast.error(`Помилка при оновленні станції: ${error.response?.data?.message || error.message}`);
    } finally {
        isLoading.value = false;
    }
};

const handleSubmitSpecializations = async () => {
    
    
    try {
        const specializations = specializationsData.value.map(carBrandId => ({
            stationId: editFormData.value.stationId,
            brandId: carBrandId
        }));

        if (specializations.length > 0) {
            const promises = specializations.map(spec => 
                $axios.post('/specializations', spec)
            );
            
            await Promise.all(promises);

            fetchServiceStations();
            
            toast.success('Спеціалізації успішно оновлено');
        }
    } catch (error: any) {
        toast.error(`Помилка при оновленні спеціалізацій: ${error.response?.data?.message || error.message}`);
    }
};

const showAddCityModal = ref(false);
const newCityName = ref("");
const newRegionName = ref("");
const isAddingCity = ref(false);
const isCitySelectOpen = ref(false);
const showViewPopup = ref(false);
const viewPopupData = ref<ServiceStation | null>(null);

const handleCloseViewPopup = () => {
    showViewPopup.value = false;
    selectedServiceStationId.value = null;
};

const handleSelectOpen = (isOpen: boolean) => {
    isCitySelectOpen.value = isOpen;
};

const openAddCityModal = () => {
    isCitySelectOpen.value = false;
    showAddCityModal.value = true;
};

const closeAddCityModal = () => {
    showAddCityModal.value = false;
    newCityName.value = "";
    newRegionName.value = "";
};

const handleAddCity = async () => {
    try {
        isAddingCity.value = true;
        const { data } = await $axios.post("/cities", { cityName: newCityName.value, region: newRegionName.value });
        cities.value.push(data);
        toast.success("Місто успішно додано");
        closeAddCityModal();
    } catch (error: any) {
        toast.error(`Помилка при додаванні міста: ${error.response?.data?.errorMessage || error.message}`);
    } finally {
        isAddingCity.value = false;
    }
};

const handleOpenViewPopup = async (id: number) => {
    try {
        selectedServiceStationId.value = id;
        showViewPopup.value = true;
        const { data } = await $axios.get(`/service-stations/${id}`);
        viewPopupData.value = data;
    } catch (error: any) {
        toast.error(`Помилка при завантаженні станції: ${error.response?.data?.errorMessage || error.message}`);
    }
};

const carBrands = ref<{ brandId: number; brandName: string }[]>([]);

const fetchCarBrands = async () => {
  try {
    const response = await $axios.get('/car-brands');
    carBrands.value = response.data;
  } catch (error) {
    console.error('Ошибка при получении брендов автомобилей:', error);
  }
};

onMounted(() => {
    fetchServiceStations();
    fetchCities();
    fetchCarBrands();
});

watchEffect(() => {
    table.setPageSize(20);
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
