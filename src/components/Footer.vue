<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="mt-auto py-6 text-center">
    <div class="glass-card max-w-6xl mx-auto px-4 py-4">
      <p class="text-gray-600 text-sm">
        Follow me on 
        <a 
          href="https://www.instagram.com/helvetica12_/" 
          target="_blank" 
          class="text-purple-600 hover:text-purple-700 transition-colors font-medium"
        >
          Instagram @helvetica12_
        </a>
      </p>
      <p class="text-gray-400 text-xs mt-2">© {{ currentYear }} Serenity Booth. Made with 💜</p>
    </div>
  </footer>
</template>
