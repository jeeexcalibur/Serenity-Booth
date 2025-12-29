<script setup lang="ts">
import Badge from '../components/Badge.vue'
import { Shield, Camera, Database, RefreshCw } from 'lucide-vue-next'
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-12">
    <!-- Header -->
    <div class="text-center mb-12">
      <Badge text="LEGAL" class="mb-4" />
      <h1 class="text-4xl md:text-5xl font-bold mb-4">
        <span class="gradient-text">Privacy Policy</span>
      </h1>
      <p class="text-gray-600 text-lg">Your privacy matters to us</p>
    </div>

    <!-- Camera Usage -->
    <section class="glass-card p-8 mb-8">
      <div class="flex items-start gap-4">
        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 glow-purple">
          <Camera class="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 class="text-2xl font-semibold text-gray-800 mb-3">Camera Permission</h2>
          <p class="text-gray-600 leading-relaxed">
            Serenity Booth requests access to your camera solely for the purpose of capturing photos 
            for your photo strip. Camera access is only activated when you explicitly click 
            the "Take Photos" button, and the video feed is never recorded or stored.
          </p>
        </div>
      </div>
    </section>

    <!-- Data Storage -->
    <section class="glass-card p-8 mb-8">
      <div class="flex items-start gap-4">
        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center flex-shrink-0 glow-cyan">
          <Database class="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 class="text-2xl font-semibold text-gray-800 mb-3">Data Storage</h2>
          <div class="space-y-3 text-gray-600">
            <p>
              <strong class="text-gray-800">Local Processing:</strong> All photo processing happens 
              entirely in your browser. Your photos never leave your device.
            </p>
            <p>
              <strong class="text-gray-800">No Cloud Storage:</strong> We do not upload, store, or 
              transmit your photos to any server.
            </p>
            <p>
              <strong class="text-gray-800">No Account Required:</strong> You can use Serenity Booth without 
              creating an account or providing any personal information.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Security -->
    <section class="glass-card p-8 mb-8">
      <div class="flex items-start gap-4">
        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
          <Shield class="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 class="text-2xl font-semibold text-gray-800 mb-3">Your Privacy is Protected</h2>
          <ul class="space-y-2 text-gray-600">
            <li class="flex items-center gap-2">
              <div class="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              No tracking or analytics
            </li>
            <li class="flex items-center gap-2">
              <div class="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              No cookies for advertising
            </li>
            <li class="flex items-center gap-2">
              <div class="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              No data collection or selling
            </li>
            <li class="flex items-center gap-2">
              <div class="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              100% client-side processing
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Changes -->
    <section class="glass-card p-8">
      <div class="flex items-start gap-4">
        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center flex-shrink-0">
          <RefreshCw class="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 class="text-2xl font-semibold text-gray-800 mb-3">Changes to This Policy</h2>
          <p class="text-gray-600 leading-relaxed">
            We may update this privacy policy from time to time. Any changes will be posted 
            on this page. We encourage you to review this policy periodically for any updates.
          </p>
          <p class="text-gray-400 text-sm mt-4">Last updated: December 2024</p>
        </div>
      </div>
    </section>
  </div>
</template>
