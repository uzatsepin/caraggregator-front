<template>
    <div
        class="relative w-full"
        @click.stop>
        <label
            :for="id"
            class="block text-sm font-medium text-gray-700 mb-2"
            >{{ label }}</label
        >
        
        <!-- Container for tags and input -->
        <div 
            class="min-h-[42px] w-full border border-gray-300 rounded-md shadow-sm focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500">
            
            <!-- Selected Tags -->
            <div class="flex flex-wrap gap-1.5 p-1.5">
                <span
                    v-for="tagId in selectedTags"
                    :key="tagId"
                    class="inline-flex items-center px-2 py-0.5 rounded-md text-sm bg-blue-100 text-blue-800">
                    {{ getOptionName(tagId) }}
                    <button
                        type="button"
                        @click.stop="removeTag(tagId)"
                        class="ml-1 inline-flex text-blue-400 hover:text-blue-600 focus:outline-none">
                        &times;
                    </button>
                </span>
                
                <!-- Input field -->
                <input
                    :id="id"
                    type="text"
                    v-model="search"
                    @focus="handleFocus"
                    @input="handleInput"
                    @keydown.enter.prevent="handleEnter"
                    @keydown.down.prevent="handleArrowDown"
                    @keydown.up.prevent="handleArrowUp"
                    @keydown.backspace="handleBackspace"
                    class="flex-1 min-w-[120px] outline-none border-0 focus:ring-0 text-sm p-0.5"
                    placeholder="Виберіть або додайте спеціалізацію" />
            </div>
        </div>

        <!-- Dropdown -->
        <div
            v-if="isOpen"
            class="absolute z-10 w-full mt-1 bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
            <div
                v-for="(option, index) in filteredOptions"
                :key="option.brandId"
                @mousedown.prevent="selectOption(option)"
                :class="[
                    'cursor-pointer select-none relative py-2 pl-3 pr-9',
                    index === activeIndex ? 'bg-blue-100' : 'hover:bg-blue-50'
                ]">
                {{ option.brandName }}
            </div>
            <div
                v-if="filteredOptions.length === 0"
                class="py-2 pl-3 pr-9 text-gray-500">
                Нічого не знайдено
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from "vue";

const props = defineProps({
    id: {
        type: String,
        required: true
    },
    label: {
        type: String,
        required: true
    },
    options: {
        type: Array as () => { brandId: number; brandName: string }[],
        required: true
    },
    modelValue: {
        type: Array as () => number[],
        default: () => []
    }
});

const emit = defineEmits(["update:modelValue"]);

// Reactive Data
const search = ref("");
const isOpen = ref(false);
const selectedTags = ref<number[]>([...props.modelValue]);
const activeIndex = ref(-1);

// Computed Properties
const filteredOptions = computed(() => {
    const query = search.value.toLowerCase();
    return props.options.filter(
        (option) => 
            option.brandName.toLowerCase().includes(query) && 
            !selectedTags.value.includes(option.brandId)
    );
});

// Methods
const getOptionName = (id: number): string => {
    const option = props.options.find(opt => opt.brandId === id);
    return option ? option.brandName : '';
};

const handleFocus = () => {
    isOpen.value = true;
};

const handleInput = () => {
    if (!isOpen.value) {
        isOpen.value = true;
    }
    activeIndex.value = -1;
};

const handleEnter = () => {
    if (isOpen.value && activeIndex.value >= 0 && activeIndex.value < filteredOptions.value.length) {
        selectOption(filteredOptions.value[activeIndex.value]);
    }
};

const handleBackspace = (event: KeyboardEvent) => {
    if (search.value === "" && selectedTags.value.length > 0) {
        const lastTagId = selectedTags.value[selectedTags.value.length - 1];
        removeTag(lastTagId);
    }
};

const handleArrowDown = () => {
    if (!isOpen.value) {
        isOpen.value = true;
        return;
    }
    activeIndex.value = Math.min(activeIndex.value + 1, filteredOptions.value.length - 1);
    if (activeIndex.value === -1 && filteredOptions.value.length > 0) {
        activeIndex.value = 0;
    }
};

const handleArrowUp = () => {
    if (!isOpen.value) return;
    activeIndex.value = Math.max(-1, activeIndex.value - 1);
};

const selectOption = (option: { brandId: number; brandName: string }) => {
    if (!selectedTags.value.includes(option.brandId)) {
        selectedTags.value.push(option.brandId);
        emit("update:modelValue", selectedTags.value);
    }
    search.value = "";
    activeIndex.value = -1;
};

const removeTag = (tagId: number) => {
    const index = selectedTags.value.indexOf(tagId);
    if (index > -1) {
        selectedTags.value.splice(index, 1);
        emit("update:modelValue", selectedTags.value);
    }
};

const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest(".relative")) {
        isOpen.value = false;
        search.value = "";
        activeIndex.value = -1;
    }
};

// Watchers
watch(
    () => props.modelValue,
    (newValue) => {
        selectedTags.value = [...newValue];
    }
);

// Lifecycle hooks
onMounted(() => {
    document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener("click", handleClickOutside);
});
</script>