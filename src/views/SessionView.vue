<script setup lang="ts">
import { ref, onUnmounted, computed, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { Download, Upload, X, Grid3x3, Sparkles, ImageIcon, Camera, Move } from 'lucide-vue-next'
import Badge from '../components/Badge.vue'
import DraggableSticker from '../components/DraggableSticker.vue'
import type { Photo, Sticker, ColorOption } from '../types'

const route = useRoute()
const layoutType = computed(() => route.params.layout as string)

// Camera modal state
const showCameraModal = ref(false)

// Camera state
const videoRef = ref<HTMLVideoElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const stream = ref<MediaStream | null>(null)
const cameraActive = ref(false)
const cameraError = ref('')

// Photo strip container ref for sticker bounds
const photoStripRef = ref<HTMLDivElement | null>(null)
const containerBounds = computed(() => {
  if (!photoStripRef.value) return { width: 180, height: 400 }
  return {
    width: photoStripRef.value.offsetWidth,
    height: photoStripRef.value.offsetHeight
  }
})

// Photos
const photos = ref<Photo[]>([])
const maxPhotos = computed(() => {
  const counts: Record<string, number> = {
    'classic-four': 4,
    'vertical-duo': 2,
    'dynamic-six': 6,
    'square-quartet': 4,
  }
  return counts[layoutType.value] || 4
})

// Helper to get photo by index
const getPhoto = (index: number): Photo | undefined => {
  return photos.value[index]
}

// Delete photo by index
const deletePhoto = (index: number) => {
  photos.value.splice(index, 1)
}

// Timer countdown
const timerOptions = [1, 3, 5, 10]
const selectedTimer = ref(3)
const countdown = ref(0)
const isCountingDown = ref(false)

// Stickers
const stickers = ref<Sticker[]>([])
const availableStickers = [
  '🐱', '🌸', '💖', '🐻', '❤️', '🌺', '👀', '💕',
  '⭐', '🦋', '🌈', '☁️', '🍓', '🧸', '✨', '🎀'
]

// Colors/Backgrounds
const selectedColor = ref<string>('#ffffff')
const colorOptions: ColorOption[] = [
  { id: 'white', color: '#ffffff' },
  { id: 'yellow', color: '#fcd34d' },
  { id: 'orange', color: '#fb923c' },
  { id: 'pink', color: '#f472b6' },
  { id: 'blue', color: '#60a5fa' },
  { id: 'green', color: '#4ade80' },
  { id: 'teal', color: '#2dd4bf' },
  { id: 'purple', color: '#c084fc' },
  { id: 'gray', color: '#6b7280' },
  { id: 'brown', color: '#92400e' },
  { id: 'pattern1', color: 'linear-gradient(45deg, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%), linear-gradient(45deg, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%)', isPattern: true },
  { id: 'pattern2', color: 'linear-gradient(135deg, #f5d0fe 25%, #fce7f3 50%, #fdf2f8 75%)', isPattern: true },
  { id: 'pattern3', color: 'linear-gradient(to right, #bfdbfe, #ddd6fe)', isPattern: true },
  { id: 'pattern4', color: 'repeating-linear-gradient(45deg, #e5e7eb, #e5e7eb 10px, #f3f4f6 10px, #f3f4f6 20px)', isPattern: true },
  { id: 'pattern5', color: 'linear-gradient(to bottom right, #fecaca, #fef3c7)', isPattern: true },
  // Custom image backgrounds
  { id: 'custom1', color: 'url(/custom1.png)', isPattern: true },
  { id: 'custom2', color: 'url(/custom2.png)', isPattern: true },
  { id: 'custom3', color: 'url(/custom3.png)', isPattern: true },
  { id: 'custom4', color: 'url(/custom4.png)', isPattern: true },
  { id: 'custom5', color: 'url(/custom5.png)', isPattern: true },
  { id: 'custom6', color: 'url(/custom6.png)', isPattern: true },
]

// Flash effect
const showFlash = ref(false)

// Open camera modal
const openCameraModal = async () => {
  showCameraModal.value = true
  await nextTick()
  startCamera()
}

// Close camera modal
const closeCameraModal = () => {
  stopCamera()
  showCameraModal.value = false
}

// Camera functions
const startCamera = async () => {
  try {
    cameraError.value = ''
    stream.value = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }
    })
    if (videoRef.value) {
      videoRef.value.srcObject = stream.value
      cameraActive.value = true
    }
  } catch (err) {
    cameraError.value = 'Could not access camera. Please allow camera permissions.'
    console.error('Camera error:', err)
  }
}

const stopCamera = () => {
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop())
    stream.value = null
    cameraActive.value = false
  }
}

const capturePhoto = () => {
  if (!videoRef.value || !canvasRef.value) return
  if (photos.value.length >= maxPhotos.value) return

  const video = videoRef.value
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  
  if (!ctx) return

  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  
  // Mirror the image
  ctx.translate(canvas.width, 0)
  ctx.scale(-1, 1)
  ctx.drawImage(video, 0, 0)
  
  // Flash effect
  showFlash.value = true
  setTimeout(() => { showFlash.value = false }, 150)

  const dataUrl = canvas.toDataURL('image/jpeg', 0.9)
  photos.value.push({
    id: Date.now().toString(),
    dataUrl,
    timestamp: Date.now(),
    offsetX: 50,  // Center by default
    offsetY: 50   // Center by default
  })

  // Auto close if all photos captured
  if (photos.value.length >= maxPhotos.value) {
    setTimeout(() => closeCameraModal(), 500)
  }
}

// Capture with timer
const startCaptureWithTimer = () => {
  if (isCountingDown.value) return
  if (photos.value.length >= maxPhotos.value) return
  
  isCountingDown.value = true
  countdown.value = selectedTimer.value
  
  const interval = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(interval)
      isCountingDown.value = false
      capturePhoto()
    }
  }, 1000)
}

const resetPhotos = () => {
  photos.value = []
  stickers.value = []
}

// Sticker functions
const addSticker = (emoji: string) => {
  stickers.value.push({
    id: Date.now().toString(),
    emoji,
    x: 50 + Math.random() * 100,
    y: 50 + Math.random() * 100,
    scale: 1,
    rotation: 0
  })
}

const removeSticker = (stickerId: string) => {
  stickers.value = stickers.value.filter(s => s.id !== stickerId)
}

const updateSticker = (updatedSticker: Sticker) => {
  const index = stickers.value.findIndex(s => s.id === updatedSticker.id)
  if (index !== -1) {
    stickers.value[index] = updatedSticker
  }
}

// Photo position adjustment
const adjustingPhotoIndex = ref<number | null>(null)
const adjustStartPos = ref({ x: 0, y: 0 })
const adjustStartOffset = ref({ x: 50, y: 50 })

const startPhotoAdjust = (index: number, e: MouseEvent | TouchEvent) => {
  e.preventDefault()
  e.stopPropagation()
  
  if (!photos.value[index]) return
  
  adjustingPhotoIndex.value = index
  
  let clientX: number, clientY: number
  if ('touches' in e && e.touches.length > 0) {
    clientX = e.touches[0].clientX
    clientY = e.touches[0].clientY
  } else {
    const mouseE = e as MouseEvent
    clientX = mouseE.clientX
    clientY = mouseE.clientY
  }
  
  adjustStartPos.value = { x: clientX, y: clientY }
  const photo = photos.value[index]
  if (photo) {
    adjustStartOffset.value = { x: photo.offsetX, y: photo.offsetY }
  }
  
  document.addEventListener('mousemove', onPhotoAdjust)
  document.addEventListener('mouseup', stopPhotoAdjust)
  document.addEventListener('touchmove', onPhotoAdjust)
  document.addEventListener('touchend', stopPhotoAdjust)
}

const onPhotoAdjust = (e: MouseEvent | TouchEvent) => {
  if (adjustingPhotoIndex.value === null) return
  
  let clientX: number, clientY: number
  if ('touches' in e && e.touches.length > 0) {
    clientX = e.touches[0].clientX
    clientY = e.touches[0].clientY
  } else {
    const mouseE = e as MouseEvent
    clientX = mouseE.clientX
    clientY = mouseE.clientY
  }
  
  const dx = clientX - adjustStartPos.value.x
  const dy = clientY - adjustStartPos.value.y
  
  // Convert pixel movement to percentage (sensitivity)
  const newOffsetX = Math.max(0, Math.min(100, adjustStartOffset.value.x - (dx * 0.5)))
  const newOffsetY = Math.max(0, Math.min(100, adjustStartOffset.value.y - (dy * 0.5)))
  
  const photo = photos.value[adjustingPhotoIndex.value]
  if (photo) {
    photo.offsetX = newOffsetX
    photo.offsetY = newOffsetY
  }
}

const stopPhotoAdjust = () => {
  adjustingPhotoIndex.value = null
  document.removeEventListener('mousemove', onPhotoAdjust)
  document.removeEventListener('mouseup', stopPhotoAdjust)
  document.removeEventListener('touchmove', onPhotoAdjust)
  document.removeEventListener('touchend', stopPhotoAdjust)
}

// Upload alternative
const fileInputRef = ref<HTMLInputElement | null>(null)
const handleUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return
  
  Array.from(input.files).slice(0, maxPhotos.value - photos.value.length).forEach(file => {
    const reader = new FileReader()
    reader.onload = (e) => {
      photos.value.push({
        id: Date.now().toString() + Math.random(),
        dataUrl: e.target?.result as string,
        timestamp: Date.now(),
        offsetX: 50,  // Center by default
        offsetY: 50   // Center by default
      })
    }
    reader.readAsDataURL(file)
  })
}

// Download
const downloadStrip = () => {
  const stripCanvas = document.createElement('canvas')
  const ctx = stripCanvas.getContext('2d')
  if (!ctx) return

  // Calculate dimensions
  const footerHeight = 60 // Space for watermark
  const cols = layoutType.value === 'dynamic-six' ? 2 : (layoutType.value === 'square-quartet' ? 2 : 1)
  const rows = Math.ceil(maxPhotos.value / cols)
  
  // Set base width
  let canvasWidth = 800 // High resolution base
  if (layoutType.value === 'classic-four' || layoutType.value === 'vertical-duo') {
    canvasWidth = 400
  }

  const cellWidth = canvasWidth / cols
  const cellHeight = cellWidth * 0.75 // 4:3 aspect ratio
  const photoAreaHeight = cellHeight * rows
  
  stripCanvas.width = canvasWidth
  stripCanvas.height = photoAreaHeight + footerHeight

  // Create rounded corners clipping path
  if (photoStripRef.value) {
    const scale = canvasWidth / photoStripRef.value.offsetWidth
    const radius = 12 * scale // 12px is rounded-xl radius

    ctx.beginPath()
    ctx.roundRect(0, 0, stripCanvas.width, stripCanvas.height, radius)
    ctx.clip()
  }

  // Draw background
  const drawBackground = new Promise<void>((resolve) => {
    if (selectedColor.value.startsWith('url')) {
      const imgUrl = selectedColor.value.slice(4, -1).replace(/["']/g, '')
      const bgImg = new Image()
      bgImg.crossOrigin = 'anonymous'
      bgImg.onload = () => {
        // Draw background image covering the canvas (simulating background-size: cover)
        const targetAspect = stripCanvas.width / stripCanvas.height
        const imgAspect = bgImg.width / bgImg.height
        
        let drawX = 0, drawY = 0, drawW = stripCanvas.width, drawH = stripCanvas.height
        
        if (imgAspect > targetAspect) {
          // Image is wider than canvas
          const scale = stripCanvas.height / bgImg.height
          const scaledW = bgImg.width * scale
          drawX = (stripCanvas.width - scaledW) / 2
          drawW = scaledW
          drawH = stripCanvas.height
          ctx.drawImage(bgImg, drawX, 0, drawW, drawH)
        } else {
          // Image is taller than canvas
          const scale = stripCanvas.width / bgImg.width
          const scaledH = bgImg.height * scale
          drawY = (stripCanvas.height - scaledH) / 2
          drawW = stripCanvas.width
          drawH = scaledH
          ctx.drawImage(bgImg, 0, drawY, drawW, drawH)
        }
        resolve()
      }
      bgImg.onerror = () => {
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, stripCanvas.width, stripCanvas.height)
        resolve()
      }
      bgImg.src = imgUrl
    } else if (selectedColor.value.startsWith('linear') || selectedColor.value.startsWith('repeating')) {
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, stripCanvas.width, stripCanvas.height)
      resolve()
    } else {
      ctx.fillStyle = selectedColor.value
      ctx.fillRect(0, 0, stripCanvas.width, stripCanvas.height)
      resolve()
    }
  })

  // Draw photos with position offset (object-fit: cover simulation)
  drawBackground.then(() => {
    const photoPromises = photos.value.map((photo, index) => {
      return new Promise<void>((resolve) => {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => {
          const x = (index % cols) * cellWidth + 10
          const y = Math.floor(index / cols) * cellHeight + 10
          const w = cellWidth - 20
          const h = cellHeight - 20

          // Calculate source crop based on offset (simulating object-fit: cover with object-position)
          const targetAspect = w / h
          const imgAspect = img.width / img.height
          
          let srcX = 0, srcY = 0, srcW = img.width, srcH = img.height
          
          if (imgAspect > targetAspect) {
            // Image is wider than target - crop horizontally
            srcW = img.height * targetAspect
            srcX = (img.width - srcW) * (photo.offsetX / 100)
          } else {
            // Image is taller than target - crop vertically
            srcH = img.width / targetAspect
            srcY = (img.height - srcH) * (photo.offsetY / 100)
          }

          ctx.drawImage(img, srcX, srcY, srcW, srcH, x, y, w, h)
          resolve()
        }
        img.src = photo.dataUrl
      })
    })

    Promise.all(photoPromises).then(() => {
      // Draw stickers
      if (photoStripRef.value) {
        const scale = canvasWidth / photoStripRef.value.offsetWidth
        
        stickers.value.forEach(sticker => {
          ctx.save()
          
          // Translate to sticker position
          ctx.translate(sticker.x * scale, sticker.y * scale)
          
          // Rotate
          ctx.rotate((sticker.rotation * Math.PI) / 180)
          
          // Scale
          const fontSize = 40 * sticker.scale * scale // 40px base size * sticker scale * canvas scale
          ctx.font = `${fontSize}px serif`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          
          // Draw emoji
          ctx.fillText(sticker.emoji, (20 * sticker.scale * scale), (20 * sticker.scale * scale)) // Offset by half size to center
          
          ctx.restore()
        })
      }

      // Draw watermark
      ctx.font = 'bold 24px Inter, sans-serif'
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('Serenity Booth', stripCanvas.width / 2, photoAreaHeight + (footerHeight / 2))

      const link = document.createElement('a')
      link.download = `serenity-booth-${Date.now()}.png`
      link.href = stripCanvas.toDataURL('image/png')
      link.click()
    })
  })
}

onUnmounted(() => {
  stopCamera()
})
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-6">
    <!-- Header -->
    <div class="text-center mb-6">
      <Badge text="PHOTO SESSION" class="mb-4" />
      <h1 class="text-2xl md:text-3xl font-bold gradient-text">Capture your set</h1>
    </div>

    <div class="grid gap-6" :class="layoutType === 'dynamic-six' || layoutType === 'square-quartet' ? 'lg:grid-cols-[280px_1fr]' : 'lg:grid-cols-[200px_1fr]'">
      <!-- Photo Strip Preview -->
      <div class="flex flex-col items-center">
        <div
          ref="photoStripRef"
          class="relative rounded-xl shadow-lg overflow-hidden border border-white/10"
          :style="{
            background: selectedColor,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding: '8px',
            width: layoutType === 'classic-four' || layoutType === 'vertical-duo' ? '180px' : '240px',
          }"
        >
          <!-- Classic Four - Vertical Strip -->
          <div
            v-if="layoutType === 'classic-four'"
            class="flex flex-col gap-2"
          >
            <div
              v-for="i in 4"
              :key="i"
              class="relative bg-gray-50 rounded-md flex items-center justify-center overflow-hidden border border-dashed border-gray-300"
              style="aspect-ratio: 4/3;"
            >
              <template v-if="getPhoto(i - 1)">
                <img
                  :src="getPhoto(i - 1)?.dataUrl"
                  class="w-full h-full object-cover cursor-move"
                  :style="{ objectPosition: `${getPhoto(i - 1)?.offsetX}% ${getPhoto(i - 1)?.offsetY}%` }"
                  @mousedown="startPhotoAdjust(i - 1, $event)"
                  @touchstart="startPhotoAdjust(i - 1, $event)"
                />
                <button
                  @click="deletePhoto(i - 1)"
                  class="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors z-10"
                >
                  <X class="w-3 h-3" />
                </button>
                <div class="absolute bottom-1 left-1 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1 pointer-events-none">
                  <Move class="w-2.5 h-2.5" />
                  drag to adjust
                </div>
              </template>
              <ImageIcon v-else class="w-6 h-6 text-gray-300" />
            </div>
          </div>

          <!-- Vertical Duo -->
          <div
            v-else-if="layoutType === 'vertical-duo'"
            class="flex flex-col gap-2"
          >
            <div
              v-for="i in 2"
              :key="i"
              class="relative bg-gray-50 rounded-md flex items-center justify-center overflow-hidden border border-dashed border-gray-300"
              style="aspect-ratio: 4/3;"
            >
              <template v-if="getPhoto(i - 1)">
                <img
                  :src="getPhoto(i - 1)?.dataUrl"
                  class="w-full h-full object-cover cursor-move"
                  :style="{ objectPosition: `${getPhoto(i - 1)?.offsetX}% ${getPhoto(i - 1)?.offsetY}%` }"
                  @mousedown="startPhotoAdjust(i - 1, $event)"
                  @touchstart="startPhotoAdjust(i - 1, $event)"
                />
                <button
                  @click="deletePhoto(i - 1)"
                  class="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors z-10"
                >
                  <X class="w-3 h-3" />
                </button>
                <div class="absolute bottom-1 left-1 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1 pointer-events-none">
                  <Move class="w-2.5 h-2.5" />
                  drag to adjust
                </div>
              </template>
              <ImageIcon v-else class="w-6 h-6 text-slate-300" />
            </div>
          </div>

          <!-- Dynamic Six - 2 columns x 3 rows -->
          <div
            v-else-if="layoutType === 'dynamic-six'"
            class="grid grid-cols-2 grid-rows-3 gap-2"
          >
            <div
              v-for="i in 6"
              :key="i"
              class="relative bg-gray-50 rounded-md flex items-center justify-center overflow-hidden border border-dashed border-gray-300"
              style="aspect-ratio: 4/3;"
            >
              <template v-if="getPhoto(i - 1)">
                <img
                  :src="getPhoto(i - 1)?.dataUrl"
                  class="w-full h-full object-cover cursor-move"
                  :style="{ objectPosition: `${getPhoto(i - 1)?.offsetX}% ${getPhoto(i - 1)?.offsetY}%` }"
                  @mousedown="startPhotoAdjust(i - 1, $event)"
                  @touchstart="startPhotoAdjust(i - 1, $event)"
                />
                <button
                  @click="deletePhoto(i - 1)"
                  class="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors z-10"
                >
                  <X class="w-3 h-3" />
                </button>
                <div class="absolute bottom-1 left-1 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1 pointer-events-none">
                  <Move class="w-2.5 h-2.5" />
                  drag
                </div>
              </template>
              <ImageIcon v-else class="w-6 h-6 text-gray-300" />
            </div>
          </div>

          <!-- Square Quartet - 2x2 grid -->
          <div
            v-else-if="layoutType === 'square-quartet'"
            class="grid grid-cols-2 grid-rows-2 gap-2"
          >
            <div
              v-for="i in 4"
              :key="i"
              class="relative bg-gray-50 rounded-md flex items-center justify-center overflow-hidden border border-dashed border-gray-300"
              style="aspect-ratio: 4/3;"
            >
              <template v-if="getPhoto(i - 1)">
                <img
                  :src="getPhoto(i - 1)?.dataUrl"
                  class="w-full h-full object-cover cursor-move"
                  :style="{ objectPosition: `${getPhoto(i - 1)?.offsetX}% ${getPhoto(i - 1)?.offsetY}%` }"
                  @mousedown="startPhotoAdjust(i - 1, $event)"
                  @touchstart="startPhotoAdjust(i - 1, $event)"
                />
                <button
                  @click="deletePhoto(i - 1)"
                  class="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors z-10"
                >
                  <X class="w-3 h-3" />
                </button>
                <div class="absolute bottom-1 left-1 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1 pointer-events-none">
                  <Move class="w-2.5 h-2.5" />
                  drag
                </div>
              </template>
              <ImageIcon v-else class="w-6 h-6 text-gray-300" />
            </div>
          </div>

          <!-- Stickers overlay -->
          <DraggableSticker
            v-for="sticker in stickers"
            :key="sticker.id"
            :sticker="sticker"
            :container-bounds="containerBounds"
            @update="updateSticker"
            @delete="removeSticker"
          />

          <!-- Serenity Booth watermark -->
          <div class="text-center text-xs text-gray-400 mt-2">Serenity Booth</div>
        </div>

        <div class="flex items-center gap-3 mt-4">
          <button
            @click="downloadStrip"
            :disabled="photos.length === 0"
            class="neon-btn inline-flex items-center gap-2 px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download class="w-4 h-4" />
            Download
          </button>
          <button
            @click="resetPhotos"
            class="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 text-sm rounded-full hover:bg-red-500/30 transition-colors border border-red-500/30"
          >
            Retake
          </button>
        </div>
      </div>

      <!-- Right Panel - Controls -->
      <div class="space-y-4">
        <!-- Take Photos Button -->
        <button
          @click="openCameraModal"
          :disabled="photos.length >= maxPhotos"
          class="neon-btn inline-flex items-center gap-2 px-6 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Camera class="w-5 h-5" />
          Take Photos
        </button>

        <!-- Instructions -->
        <div class="glass-card p-6">
          <h3 class="font-semibold text-gray-800 mb-3">Instructions</h3>
          <ol class="space-y-2">
            <li class="flex items-start gap-3">
              <span class="flex-shrink-0 w-5 h-5 bg-purple-100 text-purple-600 text-xs font-semibold rounded-full flex items-center justify-center">1</span>
              <span class="text-sm text-gray-600">Position yourself in front of the camera.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="flex-shrink-0 w-5 h-5 bg-purple-100 text-purple-600 text-xs font-semibold rounded-full flex items-center justify-center">2</span>
              <span class="text-sm text-gray-600">Click the capture button to take a photo. Stay still until the flash disappears.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="flex-shrink-0 w-5 h-5 bg-purple-100 text-purple-600 text-xs font-semibold rounded-full flex items-center justify-center">3</span>
              <span class="text-sm text-gray-600">Add stickers by clicking them, then drag to move, use blue handle to resize, green handle to rotate.</span>
            </li>
            <li class="flex items-start gap-3">
              <span class="flex-shrink-0 w-5 h-5 bg-purple-100 text-purple-600 text-xs font-semibold rounded-full flex items-center justify-center">4</span>
              <span class="text-sm text-gray-600">Download your photo strip when finished!</span>
            </li>
          </ol>
        </div>

        <!-- Upload Option -->
        <div class="text-center">
          <p class="text-gray-500 text-sm mb-2">Or upload existing photos</p>
          <input
            ref="fileInputRef"
            type="file"
            accept="image/*"
            multiple
            class="hidden"
            @change="handleUpload"
          />
          <button
            @click="fileInputRef?.click()"
            :disabled="photos.length >= maxPhotos"
            class="inline-flex items-center gap-2 px-4 py-2 border border-purple-500/50 text-purple-400 text-sm rounded-full hover:bg-purple-500/10 disabled:opacity-50 transition-colors"
          >
            <Upload class="w-4 h-4" />
            Upload Image
          </button>
        </div>

        <!-- Color Picker -->
        <div class="glass-card p-6">
          <h3 class="font-semibold text-gray-800 mb-4 text-center">Choose a color:</h3>
          <div class="flex flex-wrap justify-center gap-3">
            <button
              v-for="color in colorOptions"
              :key="color.id"
              @click="selectedColor = color.color"
              class="w-10 h-10 rounded-full border-2 transition-all hover:scale-110"
              :class="[
                selectedColor === color.color ? 'border-purple-500 ring-2 ring-purple-500/50' : 'border-white/20'
              ]"
              :style="{ background: color.color }"
            />
          </div>
        </div>

        <!-- Stickers -->
        <div class="glass-card p-6">
          <h3 class="font-semibold text-gray-800 mb-4 text-center">Add stickers:</h3>
          <div class="flex flex-wrap justify-center gap-2">
            <button
              v-for="sticker in availableStickers"
              :key="sticker"
              @click="addSticker(sticker)"
              class="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xl transition-colors hover:scale-110"
            >
              {{ sticker }}
            </button>
          </div>
          <p class="text-center text-xs text-purple-400 mt-4">
            Click a sticker to add it to your photo strip.
          </p>
          <p class="text-center text-xs text-gray-500 mt-1">
            Hover to show controls • <span class="text-blue-400">Blue</span> = Resize • <span class="text-green-400">Green</span> = Rotate • <span class="text-red-400">Red</span> = Delete
          </p>
        </div>
      </div>
    </div>

    <!-- Camera Modal -->
    <Teleport to="body">
      <div
        v-if="showCameraModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
        @click.self="closeCameraModal"
      >
        <div class="relative w-full max-w-3xl bg-black rounded-2xl overflow-hidden">
          <!-- Camera Error -->
          <div v-if="cameraError" class="aspect-video flex items-center justify-center text-white text-center p-4">
            <div>
              <p class="mb-2">{{ cameraError }}</p>
              <button @click="startCamera" class="text-blue-400 underline">Try again</button>
            </div>
          </div>
          
          <!-- Video Preview -->
          <video
            v-else
            ref="videoRef"
            autoplay
            playsinline
            muted
            class="w-full aspect-video object-cover transform -scale-x-100"
          />
          
          <!-- Flash Effect -->
          <div
            v-if="showFlash"
            class="absolute inset-0 bg-white"
          />

          <!-- Countdown Overlay -->
          <div
            v-if="isCountingDown"
            class="absolute inset-0 flex items-center justify-center bg-black/50"
          >
            <span class="text-8xl font-bold text-white">{{ countdown }}</span>
          </div>

          <!-- Close Button -->
          <button
            @click="closeCameraModal"
            class="absolute top-3 right-3 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            <X class="w-5 h-5" />
          </button>

          <!-- Photo Counter -->
          <div class="absolute top-3 left-3 bg-black/50 text-white text-sm px-3 py-1 rounded-full">
            {{ photos.length }}/{{ maxPhotos }}
          </div>

          <!-- Bottom Controls -->
          <div class="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-6">
            <!-- Timer Options -->
            <div class="flex items-center gap-1 bg-slate-800/80 rounded-full px-2 py-1">
              <button
                v-for="t in timerOptions"
                :key="t"
                @click="selectedTimer = t"
                class="px-2 py-1 text-xs text-white rounded-full transition-colors"
                :class="selectedTimer === t ? 'bg-white/20' : 'hover:bg-white/10'"
              >
                {{ t }}s
              </button>
            </div>

            <!-- Capture Button -->
            <button
              @click="startCaptureWithTimer"
              :disabled="photos.length >= maxPhotos || isCountingDown"
              class="w-14 h-14 rounded-full border-4 border-white flex items-center justify-center disabled:opacity-50 transition-all hover:scale-105"
            >
              <div class="w-10 h-10 bg-white rounded-full" />
            </button>

            <!-- Right Side Icons -->
            <div class="flex items-center gap-2">
              <button class="w-8 h-8 bg-slate-800/80 text-white rounded-full flex items-center justify-center hover:bg-slate-700/80 transition-colors">
                <Sparkles class="w-4 h-4" />
              </button>
              <button class="w-8 h-8 bg-slate-800/80 text-white rounded-full flex items-center justify-center hover:bg-slate-700/80 transition-colors">
                <Grid3x3 class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Hidden canvas for capture -->
    <canvas ref="canvasRef" class="hidden" />
  </div>
</template>
