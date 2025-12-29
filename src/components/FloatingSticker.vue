<script setup lang="ts">
import { onMounted, ref } from 'vue'
import gsap from 'gsap'

defineProps<{
  emoji: string
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}>()

const stickerRef = ref<HTMLElement | null>(null)

onMounted(() => {
  if (stickerRef.value) {
    // Random floating animation
    gsap.to(stickerRef.value, {
      y: 'random(-20, 20)',
      x: 'random(-10, 10)',
      rotation: 'random(-15, 15)',
      duration: 'random(3, 5)',
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    })
  }
})

const positionClasses = {
  'top-left': 'top-24 left-8',
  'top-right': 'top-16 right-8',
  'bottom-left': 'bottom-32 left-12',
  'bottom-right': 'bottom-24 right-16',
}
</script>

<template>
  <div
    ref="stickerRef"
    class="fixed text-4xl md:text-5xl select-none pointer-events-none z-10"
    :class="positionClasses[position]"
  >
    {{ emoji }}
  </div>
</template>
