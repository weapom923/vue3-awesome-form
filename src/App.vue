<script setup>
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

function toggleLocale() {
  locale.value = locale.value === 'en' ? 'ja' : 'en'
}
</script>

<template>
  <v-app>
    <v-main>
      <v-container class="d-flex flex-column align-center justify-center" style="min-height: 100vh">
        <v-card width="480" elevation="4">
          <v-card-title class="text-h5 pa-6">{{ t('greeting') }}</v-card-title>
          <v-card-text>{{ t('description') }}</v-card-text>
          <v-card-actions class="pa-4">
            <v-btn color="primary" variant="elevated" @click="toggleLocale">
              {{ t('switchLang') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>
