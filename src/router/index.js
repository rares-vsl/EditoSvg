import { createRouter, createWebHistory } from "vue-router";
import {createAuthGuard, createOnboardingGuard} from "./guards";
import { routes } from "./routes";

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    return { top: 0 };
  },
});

router.beforeEach(createAuthGuard);
router.beforeEach(createOnboardingGuard);



export default router;
