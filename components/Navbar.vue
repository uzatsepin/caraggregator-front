<template>
    <div class="py-4">
        <div>
            <NuxtImg src="/images/logo.svg" class="w-auto max-w-36 mx-auto"/>
            <h1 class="font-bold text-2xl text-center">CarService Aggregator</h1>
        </div>
        <h2>test</h2>

        <ul class="flex flex-col gap-2 mt-16">
            <li
                v-for="page in pages"
                :key="page.name">
                <NuxtLink
                    :to="page.link"
                    class="text-lg px-6 py-4 flex items-center gap-4 hover:bg-slate-200 transition-colors duration-300">
                    <Icon :name="page.icon" class="w-6 h-6" />
                    {{ page.name }}
                </NuxtLink>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
const pages = [
    {
        name: "Головна",
        link: "/",
        icon: 'lucide:home'
    },
    {
        name: "АвтоСервіси",
        link: "/services",
        icon: 'lucide:car'
    },
    {
        name: "Заявки",
        link: "/applications",
        icon: 'iconoir:send-mail'
    },
    {
        name: "Клієнти",
        link: "/clients",
        icon: 'lucide:users'
    },
    {
        name: "Бренди та моделі",
        link: "/cars",
        icon: 'lucide:car'
    },
    {
        name: "Логування статусів",
        link: "/logs",
        icon: 'ix:log'
    },
    {
        name: "Логування авто",
        link: "/car-logs",
        icon: 'mdi:car-clock'
    },
];
</script>

<style>
.router-link-exact-active {
    @apply bg-slate-300;
}

.router-link-exact-active:hover {
    @apply bg-slate-300;
}
</style>
