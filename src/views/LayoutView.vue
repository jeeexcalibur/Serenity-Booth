<script setup lang="ts">
import { RouterLink } from 'vue-router'
import Badge from '../components/Badge.vue'

const layouts = [
  {
    id: 'classic-four',
    name: 'Classic Four',
    description: '4 photos in a vertical strip - the timeless choice',
    slots: 4,
    grid: 'grid-rows-4',
  },
  {
    id: 'vertical-duo',
    name: 'Vertical Duo',
    description: '2 photos stacked vertically - simple and elegant',
    slots: 2,
    grid: 'grid-rows-2',
  },
  {
    id: 'dynamic-six',
    name: 'Dynamic Six',
    description: '6 photos in a 2x3 grid - more memories',
    slots: 6,
    grid: 'grid-cols-2 grid-rows-3',
  },
  {
    id: 'square-quartet',
    name: 'Square Quartet',
    description: '4 photos in a 2x2 grid - perfect symmetry',
    slots: 4,
    grid: 'grid-cols-2 grid-rows-2',
  },
]
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-12">
    <!-- Header -->
    <div class="text-center mb-12">
      <Badge text="CHOOSE YOUR STYLE" class="mb-4" />
      <h1 class="text-4xl md:text-5xl font-bold mb-4">
        <span class="gradient-text">Select Layout</span>
      </h1>
      <p class="text-gray-600 text-lg max-w-2xl mx-auto">
        Pick the perfect layout for your photo session. Each style creates a unique look for your memories.
      </p>
    </div>

    <!-- Layout Grid -->
    <div class="grid md:grid-cols-2 gap-6">
      <RouterLink
        v-for="layout in layouts"
        :key="layout.id"
        :to="`/session/${layout.id}`"
        class="group glass-card p-6 hover:scale-[1.02] transition-all duration-300 cursor-pointer"
      >
        <div class="flex gap-6">
          <!-- Layout Preview -->
          <div class="w-24 h-32 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 border border-purple-200 p-2 flex-shrink-0">
            <div
              class="w-full h-full grid gap-1"
              :class="layout.grid"
            >
              <div
                v-for="i in layout.slots"
                :key="i"
                class="bg-white/80 rounded border border-purple-100"
              />
            </div>
          </div>

          <!-- Layout Info -->
          <div class="flex-1">
            <h3 class="text-xl font-semibold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
              {{ layout.name }}
            </h3>
            <p class="text-gray-600 text-sm mb-4">{{ layout.description }}</p>
            <div class="inline-flex items-center gap-2 text-purple-600 text-sm font-medium">
              <span>Select this layout</span>
              <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </RouterLink>
    </div>
  </div>
</template>
