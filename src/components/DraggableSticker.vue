<script setup lang="ts">
import { ref, computed } from 'vue'
import { X, Move, RotateCw } from 'lucide-vue-next'
import type { Sticker } from '../types'

const props = defineProps<{
  sticker: Sticker
  containerBounds?: { width: number; height: number }
}>()

const emit = defineEmits<{
  (e: 'update', sticker: Sticker): void
  (e: 'delete', id: string): void
}>()

const isDragging = ref(false)
const isResizing = ref(false)
const isRotating = ref(false)
const showControls = ref(false)

const dragStart = ref({ x: 0, y: 0 })
const initialPosition = ref({ x: 0, y: 0 })
const initialScale = ref(1)
const initialRotation = ref(0)
const rotateCenter = ref({ x: 0, y: 0 })

// Base size of sticker
const baseSize = 40

// Container styles - includes rotation
const containerStyle = computed(() => ({
  left: props.sticker.x + 'px',
  top: props.sticker.y + 'px',
  transform: `rotate(${props.sticker.rotation}deg) scale(${props.sticker.scale})`,
  transformOrigin: 'center center',
  width: baseSize + 'px',
  height: baseSize + 'px',
}))

// Start dragging
const startDrag = (e: MouseEvent | TouchEvent) => {
  e.preventDefault()
  isDragging.value = true
  
  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
  const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
  
  dragStart.value = { x: clientX, y: clientY }
  initialPosition.value = { x: props.sticker.x, y: props.sticker.y }
  
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
  document.addEventListener('touchmove', onDrag)
  document.addEventListener('touchend', stopDrag)
}

const onDrag = (e: MouseEvent | TouchEvent) => {
  if (!isDragging.value) return
  
  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
  const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
  
  const dx = clientX - dragStart.value.x
  const dy = clientY - dragStart.value.y
  
  const newX = initialPosition.value.x + dx
  const newY = initialPosition.value.y + dy
  
  // No constraint - stickers can be freely positioned anywhere on the photo strip
  emit('update', {
    ...props.sticker,
    x: newX,
    y: newY,
  })
}

const stopDrag = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('touchmove', onDrag)
  document.removeEventListener('touchend', stopDrag)
}

// Start resizing
const startResize = (e: MouseEvent | TouchEvent) => {
  e.preventDefault()
  e.stopPropagation()
  isResizing.value = true
  
  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
  const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
  
  dragStart.value = { x: clientX, y: clientY }
  initialScale.value = props.sticker.scale
  rotateCenter.value = { 
    x: props.sticker.x + (baseSize * props.sticker.scale) / 2, 
    y: props.sticker.y + (baseSize * props.sticker.scale) / 2 
  }
  
  document.addEventListener('mousemove', onResize)
  document.addEventListener('mouseup', stopResize)
  document.addEventListener('touchmove', onResize)
  document.addEventListener('touchend', stopResize)
}

const onResize = (e: MouseEvent | TouchEvent) => {
  if (!isResizing.value) return
  
  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
  const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
  
  // Calculate distance from center
  const dx = clientX - rotateCenter.value.x
  const dy = clientY - rotateCenter.value.y
  const currentDist = Math.sqrt(dx * dx + dy * dy)
  
  const startDx = dragStart.value.x - rotateCenter.value.x
  const startDy = dragStart.value.y - rotateCenter.value.y
  const startDist = Math.sqrt(startDx * startDx + startDy * startDy)
  
  const scaleFactor = currentDist / (startDist || 1)
  const newScale = Math.max(0.5, Math.min(3, initialScale.value * scaleFactor))
  
  emit('update', {
    ...props.sticker,
    scale: newScale,
  })
}

const stopResize = () => {
  isResizing.value = false
  document.removeEventListener('mousemove', onResize)
  document.removeEventListener('mouseup', stopResize)
  document.removeEventListener('touchmove', onResize)
  document.removeEventListener('touchend', stopResize)
}

// Start rotating
const startRotate = (e: MouseEvent | TouchEvent) => {
  e.preventDefault()
  e.stopPropagation()
  isRotating.value = true
  
  rotateCenter.value = { 
    x: props.sticker.x + (baseSize * props.sticker.scale) / 2, 
    y: props.sticker.y + (baseSize * props.sticker.scale) / 2 
  }
  initialRotation.value = props.sticker.rotation
  
  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
  const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
  
  const startAngle = Math.atan2(
    clientY - rotateCenter.value.y,
    clientX - rotateCenter.value.x
  ) * (180 / Math.PI)
  
  dragStart.value = { x: startAngle, y: 0 }
  
  document.addEventListener('mousemove', onRotate)
  document.addEventListener('mouseup', stopRotate)
  document.addEventListener('touchmove', onRotate)
  document.addEventListener('touchend', stopRotate)
}

const onRotate = (e: MouseEvent | TouchEvent) => {
  if (!isRotating.value) return
  
  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
  const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
  
  const currentAngle = Math.atan2(
    clientY - rotateCenter.value.y,
    clientX - rotateCenter.value.x
  ) * (180 / Math.PI)
  
  const angleDiff = currentAngle - dragStart.value.x
  
  emit('update', {
    ...props.sticker,
    rotation: initialRotation.value + angleDiff,
  })
}

const stopRotate = () => {
  isRotating.value = false
  document.removeEventListener('mousemove', onRotate)
  document.removeEventListener('mouseup', stopRotate)
  document.removeEventListener('touchmove', onRotate)
  document.removeEventListener('touchend', stopRotate)
}

// Delete sticker
const deleteSticker = (e: MouseEvent | TouchEvent) => {
  e.preventDefault()
  e.stopPropagation()
  emit('delete', props.sticker.id)
}
</script>

<template>
  <div
    class="absolute cursor-move select-none flex items-center justify-center"
    :style="containerStyle"
    @mousedown="startDrag"
    @touchstart="startDrag"
    @mouseenter="showControls = true"
    @mouseleave="showControls = false"
  >
    <!-- Sticker emoji -->
    <span class="text-3xl leading-none">{{ sticker.emoji }}</span>
    
    <!-- Control border (visible on hover or when active) -->
    <div
      v-show="showControls || isDragging || isResizing || isRotating"
      class="absolute inset-0 border-2 border-dashed border-blue-400 rounded pointer-events-none"
    />
    
    <!-- Delete button (red) -->
    <button
      v-show="showControls || isDragging || isResizing || isRotating"
      @mousedown.stop="deleteSticker"
      @touchstart.stop="deleteSticker"
      class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors z-10"
      style="transform: scale(calc(1 / var(--scale, 1)));"
    >
      <X class="w-2.5 h-2.5" />
    </button>
    
    <!-- Resize handle (blue) with Move icon -->
    <button
      v-show="showControls || isDragging || isResizing || isRotating"
      @mousedown="startResize"
      @touchstart="startResize"
      class="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 text-white rounded-full cursor-se-resize hover:bg-blue-600 transition-colors z-10 flex items-center justify-center"
      style="transform: scale(calc(1 / var(--scale, 1)));"
    >
      <Move class="w-2 h-2" />
    </button>
    
    <!-- Rotate handle (green) with Rotate icon -->
    <button
      v-show="showControls || isDragging || isResizing || isRotating"
      @mousedown="startRotate"
      @touchstart="startRotate"
      class="absolute -bottom-1 -left-1 w-4 h-4 bg-green-500 text-white rounded-full cursor-grab hover:bg-green-600 transition-colors z-10 flex items-center justify-center"
      style="transform: scale(calc(1 / var(--scale, 1)));"
    >
      <RotateCw class="w-2 h-2" />
    </button>
  </div>
</template>

<style scoped>
div[style*="scale"] {
  --scale: v-bind('sticker.scale');
}
</style>
