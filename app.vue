<template>
  <div class="min-h-screen flex">
    <aside class="w-[300px] bg-slate-100 border-r border-slate-300">
      <Navbar />
    </aside>

    <main class="flex-1 overflow-auto p-8">
      <NuxtPage />
    </main>

    <Toaster />
  </div>
</template>

<style>
main {
  height: 100vh;
  overflow-y: auto;
  padding: 0 48px 48px;
}

aside {
  height: 100vh;
  overflow-y: auto;
}
</style>

<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner'

useSeoMeta({
  title: 'Курсова | Dashboard | CarService Agregator',
  description: 'Курсова робота з дисципліни РБД'
})
</script>