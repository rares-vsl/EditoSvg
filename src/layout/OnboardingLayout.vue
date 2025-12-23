<script setup>
import {useOnboardingStore} from '@/stores/onboarding'
import {computed, ref} from "vue";
import {useRoute} from 'vue-router'
import router from "@/router/index.js";

const route = useRoute()

const loading = ref(false)

const onboardingStore = useOnboardingStore()

const step = computed(() => {
  return route.meta.step ?? 1
})

const canProceed = computed(() => {
  return onboardingStore.isStepCompleted(step.value)
})

function goToPreviousStep() {
  loading.value = true
  const previousPath = onboardingStore.previousStepPath(step.value)
  if (previousPath) {
    router.push(`/onboarding/${previousPath}`).finally(() => {
      loading.value = false
    })
  } else loading.value = false
}

function goToNextStep() {
  loading.value = true

  if (canProceed.value) {
    const nextPath = onboardingStore.nextStepPath(step.value)

    if (nextPath) {
      router.push(`/onboarding/${nextPath}`).finally(() => {
        loading.value = false
      })
    } else loading.value = false
  }
}

</script>

<template>
  <div class="layout-topbar">
    <div class="layout-topbar-logo-container flex items-center gap-3">

      <div
          class="layout-topbar-logo flex items-center gap-2 no-underline"
      >
        <span class="text-xl font-semibold whitespace-nowrap">WELCOME TO E.C.O.</span>
      </div>
    </div>

    <div class="layout-topbar-actions">
      <div class="layout-topbar-menu hidden lg:block">
        <div class="layout-topbar-menu-content">
          <button
              type="button"
              class="layout-topbar-action"
              @click=""
          >
            <i class="pi pi-sign-out"></i>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="layout-main-container content-center ">
    <div class="layout-main space-y-6">
      <div class="flex justify-center w-full">
        <Card class="w-2/3">
          <template #content>
            <Stepper :value="step" class="basis-[50rem]" linear>
              <StepList>
                <Step
                    v-for="step in onboardingStore.steps"
                    :key="step.index"
                    :value="step.index"
                >
                  {{ step.label }}
                </Step>
              </StepList>
            </Stepper>
          </template>
        </Card>
      </div>
      <Card>
        <template #content>
          <router-view/>
        </template>
      </Card>
    </div>
    <div class="pt-4 pb-4 p w-full bg-whitse border-t border-gray-200 flex justify-between ">
      <div>
        <Button :loading="loading" v-if="onboardingStore.hasPreviousStep(step)" label="Back" @click="goToPreviousStep"
                severity="secondary"  icon="pi pi-arrow-left"/>
      </div>
      <div>
        <Button :loading="loading" v-if="onboardingStore.hasNextStep(step)" label="Next" @click="goToNextStep" :disabled="!canProceed" icon="pi pi-arrow-right"
                iconPos="right"/>
        <Button :loading="loading" v-else label="Complete" icon="pi pi-arrow-right" iconPos="right"/>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>