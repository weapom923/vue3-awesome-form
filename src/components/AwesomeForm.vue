<script setup lang="ts">
import { type ValidFormValue, useAwesomeFormValues } from '@/composables/useAwesomeFormValues';

const isValid = defineModel<boolean | null>('isValid', { required: true });
const validFormValue = defineModel<ValidFormValue>('validFormValue');

const {
  textFieldValue,
  textFieldProps,
  numberInputValue,
  numberInputProps,
  autocompleteValue,
  autocompleteProps,
  sliderValue,
  sliderProps,
  rangeSliderValue,
  rangeSliderProps,
  fileInputValue,
  fileInputProps,
  otpInputValue,
  otpInputProps,
  ratingValue,
  ratingProps,
} = useAwesomeFormValues(validFormValue);
</script>

<template>
  <VForm
    v-model:model-value="isValid"
    class="d-flex flex-column gr-4"
  >
    <VTextField
      v-model="textFieldValue"
      v-bind="textFieldProps"
      label="VTextField"
    />

    <VNumberInput
      v-model="numberInputValue"
      v-bind="numberInputProps"
      label="VNumberInput"
    />

    <VAutocomplete
      v-model="autocompleteValue"
      v-bind="autocompleteProps"
      label="VAutocomplete"
    />

    <VSlider
      v-model="sliderValue"
      v-bind="sliderProps"
      label="VSlider"
      thumb-label
    />

    <VRangeSlider
      v-model="rangeSliderValue"
      v-bind="rangeSliderProps"
      label="VRangeSlider"
      thumb-label
    />

    <VFileInput
      v-model="fileInputValue"
      v-bind="fileInputProps"
      label="VFileInput"
    />

    <VInput
      :validation-value="otpInputValue"
      v-bind="otpInputProps"
    >
      <VLabel>VOtpInput</VLabel>
      <VOtpInput v-model="otpInputValue" />
    </VInput>

    <VInput
      :validation-value="ratingValue"
      v-bind="ratingProps"
    >
      <VLabel>VRating</VLabel>
      <VRating v-model="ratingValue" />
    </VInput>
  </VForm>
</template>
