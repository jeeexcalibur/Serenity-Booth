<script setup lang="ts">
defineProps<{
  text: string
  variant?: 'primary' | 'secondary'
}>()
</script>

<template>
  <span
    class="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase"
    :class="[
      variant === 'secondary'
        ? 'bg-gray-100 text-gray-600 border border-gray-200'
        : 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border border-purple-200'
    ]"
  >
    {{ text }}
  </span>
</template>
