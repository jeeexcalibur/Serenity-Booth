<script setup lang="ts">
import { RouterLink } from 'vue-router'
import Badge from '../components/Badge.vue'
import { Camera, Sparkles, Zap, Download, Palette } from 'lucide-vue-next'
</script>

<template>
  <div class="flex-1 flex flex-col">
    <!-- Hero Section -->
    <section class="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      <!-- Animated background elements -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute top-20 left-10 w-72 h-72 bg-purple-200/40 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute bottom-20 right-10 w-96 h-96 bg-pink-200/40 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s;"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-100/30 rounded-full blur-3xl"></div>
      </div>

      <!-- Floating emoji stickers -->
      <div class="absolute top-20 left-[15%] text-4xl animate-float" style="animation-delay: 0s;">✨</div>
      <div class="absolute top-32 right-[20%] text-4xl animate-float" style="animation-delay: 0.5s;">📸</div>
      <div class="absolute bottom-32 left-[20%] text-4xl animate-float" style="animation-delay: 1s;">💜</div>
      <div class="absolute bottom-20 right-[15%] text-4xl animate-float" style="animation-delay: 1.5s;">🎀</div>
      <div class="absolute top-1/2 left-[10%] text-3xl animate-float" style="animation-delay: 0.8s;">🌟</div>
      <div class="absolute top-1/2 right-[10%] text-3xl animate-float" style="animation-delay: 1.2s;">🦋</div>

      <!-- Content -->
      <div class="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <Badge text="FREE PHOTO BOOTH" class="mb-6" />
        
        <h1 class="text-5xl md:text-7xl font-extrabold mb-6">
          <span class="text-gray-800">Capture </span>
          <span class="gradient-text">Memories</span>
          <br />
          <span class="text-gray-800">in Style</span>
        </h1>
        
        <p class="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Create stunning photo strips with our free online photo booth. 
          Add stickers, choose backgrounds, and download your masterpiece instantly.
        </p>

        <RouterLink
          to="/layout"
          class="neon-btn inline-flex items-center gap-3 text-lg px-8 py-4"
        >
          <Camera class="w-6 h-6" />
          Start Photo Session
          <Sparkles class="w-5 h-5" />
        </RouterLink>

        <!-- Feature pills -->
        <div class="flex flex-wrap justify-center gap-4 mt-12">
          <div class="glass-card px-4 py-2 flex items-center gap-2">
            <Zap class="w-4 h-4 text-yellow-500" />
            <span class="text-sm text-gray-700">Instant Capture</span>
          </div>
          <div class="glass-card px-4 py-2 flex items-center gap-2">
            <Palette class="w-4 h-4 text-pink-500" />
            <span class="text-sm text-gray-700">Custom Backgrounds</span>
          </div>
          <div class="glass-card px-4 py-2 flex items-center gap-2">
            <Download class="w-4 h-4 text-cyan-500" />
            <span class="text-sm text-gray-700">Free Download</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 px-4">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-12">
          <span class="gradient-text">Why Choose Serenity Booth?</span>
        </h2>
        
        <div class="grid md:grid-cols-3 gap-6">
          <div class="glass-card p-6 text-center hover:scale-105 transition-transform">
            <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center glow-purple">
              <Camera class="w-8 h-8 text-white" />
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">Easy Capture</h3>
            <p class="text-gray-600">Take photos directly from your browser with our simple interface</p>
          </div>
          
          <div class="glass-card p-6 text-center hover:scale-105 transition-transform">
            <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center glow-cyan">
              <Palette class="w-8 h-8 text-white" />
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">Customize</h3>
            <p class="text-gray-600">Choose from various layouts, colors, and stickers to personalize</p>
          </div>
          
          <div class="glass-card p-6 text-center hover:scale-105 transition-transform">
            <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center glow-magenta">
              <Download class="w-8 h-8 text-white" />
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">Download Free</h3>
            <p class="text-gray-600">Get your photo strip as a high-quality image instantly</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
