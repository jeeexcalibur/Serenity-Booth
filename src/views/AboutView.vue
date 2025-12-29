<script setup lang="ts">
import Badge from '../components/Badge.vue'
import { Mail, ExternalLink, ChevronDown } from 'lucide-vue-next'
import { ref } from 'vue'

const openFaq = ref<number | null>(null)

const faqs = [
  {
    question: 'Is Serenity Booth really free?',
    answer: 'Yes! Serenity Booth is completely free to use. No hidden fees, no subscriptions, no watermarks on your downloads.',
  },
  {
    question: 'How do I save my photos?',
    answer: 'After taking your photos and customizing your strip, click the "Download" button to save it as an image file to your device.',
  },
  {
    question: 'Can I use my own background images?',
    answer: 'Yes! You can select from our preset colors and patterns, or we support custom background images in the color picker section.',
  },
  {
    question: 'Does it work on mobile?',
    answer: 'Yes! Serenity Booth is fully responsive and works on smartphones, tablets, and desktop computers.',
  },
]

const toggleFaq = (index: number) => {
  openFaq.value = openFaq.value === index ? null : index
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-12">
    <!-- Header -->
    <div class="text-center mb-12">
      <Badge text="ABOUT US" class="mb-4" />
      <h1 class="text-4xl md:text-5xl font-bold mb-4">
        <span class="gradient-text">About Serenity Booth</span>
      </h1>
      <p class="text-gray-600 text-lg">Your free online photo booth experience</p>
    </div>

    <!-- Description -->
    <section class="glass-card p-8 mb-8">
      <h2 class="text-2xl font-semibold text-gray-800 mb-4">What is Serenity Booth?</h2>
      <p class="text-gray-600 leading-relaxed">
        Serenity Booth is a free, browser-based photo booth application that lets you create 
        beautiful photo strips just like the ones from classic photo booths. Take photos 
        using your webcam, customize with colors, backgrounds, and stickers, then download 
        your creation instantly — no account required!
      </p>
    </section>

    <!-- How to Use -->
    <section class="glass-card p-8 mb-8">
      <h2 class="text-2xl font-semibold text-gray-800 mb-6">How to Use</h2>
      <div class="space-y-4">
        <div class="flex items-start gap-4">
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 font-bold text-white">1</div>
          <div>
            <h3 class="font-semibold text-gray-800">Choose a Layout</h3>
            <p class="text-gray-600">Select from our available photo strip layouts</p>
          </div>
        </div>
        <div class="flex items-start gap-4">
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 font-bold text-white">2</div>
          <div>
            <h3 class="font-semibold text-gray-800">Take Photos</h3>
            <p class="text-gray-600">Use your camera or upload existing photos</p>
          </div>
        </div>
        <div class="flex items-start gap-4">
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 font-bold text-white">3</div>
          <div>
            <h3 class="font-semibold text-gray-800">Customize</h3>
            <p class="text-gray-600">Add colors, backgrounds, and stickers</p>
          </div>
        </div>
        <div class="flex items-start gap-4">
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 font-bold text-white">4</div>
          <div>
            <h3 class="font-semibold text-gray-800">Download</h3>
            <p class="text-gray-600">Save your photo strip to your device</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact -->
    <section class="glass-card p-8 mb-8">
      <h2 class="text-2xl font-semibold text-gray-800 mb-4">Contact</h2>
      <p class="text-gray-600 mb-4">Have questions or feedback? Reach out!</p>
      <a 
        href="mailto:anandajein12@gmail.com" 
        class="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors"
      >
        <Mail class="w-5 h-5" />
        anandajein12@gmail.com
        <ExternalLink class="w-4 h-4" />
      </a>
    </section>

    <!-- FAQ -->
    <section class="glass-card p-8">
      <h2 class="text-2xl font-semibold text-gray-800 mb-6">FAQ</h2>
      <div class="space-y-3">
        <div
          v-for="(faq, index) in faqs"
          :key="index"
          class="border border-gray-200 rounded-xl overflow-hidden"
        >
          <button
            @click="toggleFaq(index)"
            class="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
          >
            <span class="font-medium text-gray-800">{{ faq.question }}</span>
            <ChevronDown 
              class="w-5 h-5 text-gray-500 transition-transform"
              :class="{ 'rotate-180': openFaq === index }"
            />
          </button>
          <div
            v-if="openFaq === index"
            class="px-4 pb-4 text-gray-600"
          >
            {{ faq.answer }}
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
