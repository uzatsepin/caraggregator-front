<template>
    <div class="mx-auto p-4">
        <h1 class="font-bold text-2xl mb-8">Автомобілі (Бренди/Моделі)</h1>

        <section class="mb-12">
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-semibold">Бренди Автомобілів</h2>
                <Button
                    variant="default"
                    @click="openAddBrandModal">
                    <Icon
                        name="bi:plus-circle"
                        class="w-5 h-5 mr-2" />
                    Додати Бренд
                </Button>
            </div>

            <div class="rounded-lg border shadow-sm overflow-x-auto">
                <table class="w-full table-auto border-collapse">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-4 py-2 text-left font-medium text-gray-700 border-b">Логотип</th>
                            <th class="px-4 py-2 text-left font-medium text-gray-700 border-b">Назва Бренду</th>
                            <th class="px-4 py-2 text-left font-medium text-gray-700 border-b">Країна Виробництва</th>
                            <th class="px-4 py-2 text-center font-medium text-gray-700 border-b">Дії</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white">
                        <tr
                            v-for="brand in carBrands"
                            :key="brand.brandId"
                            class="border-b hover:bg-gray-50 transition-colors">
                            <td class="px-4 py-2 border-b">
                                <img
                                    v-if="brand.brandLogo"
                                    :src="brand.brandLogo"
                                    alt="Логотип"
                                    class="w-16 h-auto object-contain" />
                                <span v-else>-</span>
                            </td>
                            <td class="px-4 py-2 text-gray-600 border-b">{{ brand.brandName }}</td>
                            <td class="px-4 py-2 text-gray-600 border-b">{{ brand.countryOrigin || "-" }}</td>
                            
                            <td class="px-4 py-2 text-center border-b">
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    @click="openDeleteModal('brand', brand.brandId)">
                                    <Icon
                                        name="heroicons:trash"
                                        class="w-4 h-4" />
                                </Button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <section>
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-semibold">Моделі Автомобілів</h2>
                <Button
                    variant="default"
                    @click="openAddModelModal">
                    <Icon
                        name="bi:plus-circle"
                        class="w-5 h-5 mr-2" />
                    Додати Модель
                </Button>
            </div>

            <div class="rounded-lg border shadow-sm overflow-x-auto">
                <table class="w-full table-auto border-collapse">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-4 py-2 text-left font-medium text-gray-700 border-b">ID</th>
                            <th class="px-4 py-2 text-left font-medium text-gray-700 border-b">Назва Моделі</th>
                            <th class="px-4 py-2 text-left font-medium text-gray-700 border-b">Бренд</th>
                            <th class="px-4 py-2 text-left font-medium text-gray-700 border-b">Рік</th>
                            <th class="px-4 py-2 text-center font-medium text-gray-700 border-b">Дії</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white">
                        <tr
                            v-for="model in carModels"
                            :key="model.modelId"
                            class="border-b hover:bg-gray-50 transition-colors">
                            <td class="px-4 py-2 text-gray-600 border-b">{{ model.modelId }}</td>
                            <td class="px-4 py-2 text-gray-600 border-b">{{ model.modelName }}</td>
                            <td class="px-4 py-2 text-gray-600 border-b">{{ getBrandName(model.brandId) }}</td>
                            <td class="px-4 py-2 text-gray-600 border-b">{{ model.modelYear }}</td>
                            <td class="px-4 py-2 text-center border-b">
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    @click="openDeleteModal('model', model.modelId)">
                                    <Icon
                                        name="heroicons:trash"
                                        class="w-4 h-4" />
                                </Button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <Dialog v-model:open="showAddBrandModal">
            <DialogContent class="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Додати Новий Бренд</DialogTitle>
                    <DialogDescription> Заповніть форму для створення нового бренду автомобілів. </DialogDescription>
                </DialogHeader>

                <form
                    @submit.prevent="addCarBrand"
                    class="space-y-4">
                    <div class="space-y-2">
                        <Label for="brandName">Назва Бренду</Label>
                        <Input
                            id="brandName"
                            v-model="newBrand.brandName"
                            placeholder="Введіть назву бренду"
                            required />
                    </div>

                    <div class="space-y-2">
                        <Label for="countryOrigin">Країна Виробництва</Label>
                        <Input
                            id="countryOrigin"
                            v-model="newBrand.countryOrigin"
                            placeholder="Введіть країну виробництва" />
                    </div>

                    <div class="space-y-2">
                        <Label for="brandLogo">Логотип Бренду (URL)</Label>
                        <Input
                            id="brandLogo"
                            v-model="newBrand.brandLogo"
                            placeholder="https://example.com/logo.png" />
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="secondary"
                            @click="closeAddBrandModal">
                            Скасувати
                        </Button>
                        <Button
                            type="submit"
                            :disabled="isAddingBrand">
                            {{ isAddingBrand ? "Додається..." : "Додати" }}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>

        <Dialog v-model:open="showAddModelModal">
            <DialogContent class="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Додати Нову Модель</DialogTitle>
                    <DialogDescription> Заповніть форму для створення нової моделі автомобіля. </DialogDescription>
                </DialogHeader>

                <form
                    @submit.prevent="addCarModel"
                    class="space-y-4">
                    <div class="space-y-2">
                        <Label for="modelName">Назва Моделі</Label>
                        <Input
                            id="modelName"
                            v-model="newModel.modelName"
                            placeholder="Введіть назву моделі"
                            required />
                    </div>
                    <div class="space-y-2">
                        <Label for="modelYear">Рік моделі</Label>
                        <Input
                            id="modelYear"
                            v-model="newModel.modelYear"
                            type="text"
                            placeholder="Введіть рік моделі"
                            required />
                    </div>

                    <div class="space-y-2">
                        <Label for="brandSelect">Бренд</Label>
                        <Select
                            v-model="newModel.brandId"
                            placeholder="Виберіть бренд"
                            required>
                            <SelectTrigger class="w-full">
                                <SelectValue placeholder="Виберіть бренд" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Бренди</SelectLabel>
                                    <SelectItem
                                        v-for="brand in carBrands"
                                        :key="brand.brandId"
                                        :value="brand.brandId.toString()">
                                        {{ brand.brandName }}
                                    </SelectItem>
                                </SelectGroup>
                                <SelectSeparator />
                                    <Button
                                        variant="ghost"
                                        class="w-full text-left" @click="openAddBrandModal">
                                        + Додати Бренд
                                    </Button>
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="secondary"
                            @click="closeAddModelModal">
                            Скасувати
                        </Button>
                        <Button
                            type="submit"
                            :disabled="isAddingModel">
                            {{ isAddingModel ? "Додається..." : "Додати" }}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>

        <Dialog v-model:open="showDeleteModal">
            <DialogContent class="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Підтвердження Видалення</DialogTitle>
                    <DialogDescription>
                        Ви впевнені, що хочете видалити цей {{ deleteType === "brand" ? "бренд" : "модель" }}? Цю дію не можна скасувати.
                    </DialogDescription>
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
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
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

const { $axios } = useNuxtApp();

interface CarBrand {
    brandId: number;
    brandName: string;
    countryOrigin: string | null;
    brandLogo: string | null;
}

interface CarModel {
    modelId: number;
    modelName: string;
    brandId: number;
    modelYear: number
}

const carBrands = ref<CarBrand[]>([]);
const carModels = ref<CarModel[]>([]);

const showAddBrandModal = ref(false);
const showAddModelModal = ref(false);
const showDeleteModal = ref(false);

const newBrand = ref({
    brandName: "",
    countryOrigin: "",
    brandLogo: ""
});

const newModel = ref({
    modelName: "",
    brandId: "",
    modelYear: 1996
});

const deleteType = ref<"brand" | "model">("brand");
const deleteId = ref<number | null>(null);

const isAddingBrand = ref(false);
const isAddingModel = ref(false);
const isDeleting = ref(false);

const fetchCarBrands = async () => {
    try {
        const response = await $axios.get<CarBrand[]>("/car-brands");
        carBrands.value = response.data;
    } catch (error: any) {
        toast.error(`Помилка завантаження брендів: ${error.response?.data?.message || error.message}`);
    }
};

const fetchCarModels = async () => {
    try {
        const response = await $axios.get<CarModel[]>("/car-models");
        carModels.value = response.data;
    } catch (error: any) {
        toast.error(`Помилка завантаження моделей: ${error.response?.data?.message || error.message}`);
    }
};

const addCarBrand = async () => {
    try {
        isAddingBrand.value = true;
        const response = await $axios.post<CarBrand>("/car-brands", newBrand.value);
        carBrands.value.push(response.data);
        toast.success("Бренд успішно додано");
        closeAddBrandModal();
        newBrand.value = { brandName: "", countryOrigin: "", brandLogo: "" };
    } catch (error: any) {
        toast.error(`Помилка при додаванні бренду: ${error.response?.data?.message || error.message}`);
    } finally {
        isAddingBrand.value = false;
    }
};

const addCarModel = async () => {
    try {
        isAddingModel.value = true;
        const response = await $axios.post<CarModel>("/car-models", newModel.value);
        carModels.value.push(response.data);
        toast.success("Модель успішно додана");
        closeAddModelModal();
        newModel.value = { modelName: "", brandId: "", modelYear: 1996 };
    } catch (error: any) {
        toast.error(`Помилка при додаванні моделі: ${error.response?.data?.message || error.message}`);
    } finally {
        isAddingModel.value = false;
    }
};

const openAddBrandModal = () => {
    showAddBrandModal.value = true;
};

const closeAddBrandModal = () => {
    showAddBrandModal.value = false;
    newBrand.value = { brandName: "", countryOrigin: "", brandLogo: "" };
};

const openAddModelModal = () => {
    showAddModelModal.value = true;
};

const closeAddModelModal = () => {
    showAddModelModal.value = false;
    newModel.value = { modelName: "", brandId: "", modelYear: 1996 };
};

const openDeleteModal = (type: "brand" | "model", id: number) => {
    deleteType.value = type;
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
        if (deleteType.value === "brand") {
            await $axios.delete(`/car-brands/${deleteId.value}`);
            carBrands.value = carBrands.value.filter((brand) => brand.brandId !== deleteId.value);
            carModels.value = carModels.value.filter((model) => model.brandId !== deleteId.value);
            toast.success("Бренд успішно видалено");
        } else if (deleteType.value === "model") {
            await $axios.delete(`/car-models/${deleteId.value}`);
            carModels.value = carModels.value.filter((model) => model.modelId !== deleteId.value);
            toast.success("Модель успішно видалено");
        }
        closeDeleteModal();
    } catch (error: any) {
        toast.error(`Помилка при видаленні: ${error.response?.data?.message || error.message}`);
    } finally {
        isDeleting.value = false;
    }
};

const getBrandName = (brandId: number): string => {
    const brand = carBrands.value.find((b) => b.brandId === brandId);
    return brand ? brand.brandName : "-";
};

onMounted(() => {
    fetchCarBrands();
    fetchCarModels();
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
