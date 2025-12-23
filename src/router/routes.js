import AppLayout from "@/layout/AppLayout.vue";
import EditorLayout from "@/layout/EditorLayout.vue";
import OnboardingLayoutLayout from "@/layout/OnboardingLayout.vue";
import {ONBOARDING_STEPS} from "@/router/onboardingRoutes.js";
import {useOnboardingStore} from "@/stores/onboarding.js";

function generateOnboardingRoutes() {
    return ONBOARDING_STEPS.map(step => ({
        path: step.path,
        name: step.name,
        component: () => import(`@/views/onboarding/${step.component}.vue`),
        meta: {
            step: step.index,
            requiresOnboarding: true
        }
    }))
}

export const routes = [
    {
        path: "/",
        component: AppLayout,
        meta: {requiresAuth: false},
        children: [
            {
                path: "",
                name: "dashboard",
                component: () => import("@/views/Dashboard.vue"),
            },
            {
                path: "consumptions",
                name: "consumptions",
                component: () => import("@/views/pages/Empty.vue"),
            },
            {
                path: "forecasts",
                name: "forecasts",
                component: () => import("@/views/pages/Empty.vue"),
            },
            {
                path: "users",
                name: "users",
                component: () => import("@/views/pages/Empty.vue"),
                meta: {roles: ["admin"]},
            },
            {
                path: "thresholds",
                name: "thresholds",
                component: () => import("@/views/pages/Empty.vue"),
                meta: {roles: ["admin"]},
            },
            {
                path: "mapeditor",
                name: "mapeditor",
                component: () => import("@/views/pages/Empty.vue"),
                meta: {roles: ["admin"]},
            },
            {
                path: "access-denied",
                name: "accessDenied",
                component: () => import("@/views/pages/Empty.vue"),
            },
        ],
    },
    {
        path: "/onboarding",
        component: OnboardingLayoutLayout,
        meta: {onboardingPhase: true},
        children: [
            {
                path: '',
                redirect: () => {
                    const store = useOnboardingStore()
                    const currentPath = store.getPathByStep(store.getCurrentStepIndex)
                    console.log("current path", currentPath)
                    return currentPath ? `/onboarding/${currentPath}` : "/onboarding/upload-floor-plan"
                }
            },
            ...generateOnboardingRoutes()
        ]
    },
    {
        path: "/editor",
        component: EditorLayout,
        children: [
            {
                path: "",
                name: "upload floor plan",
                component: () => import("@/views/UploadFloorPlanView.vue"),
            },
            {
                path: "edit-floorplan",
                name: "edit floor plan",
                component: () => import("@/views/SVGEditorView.vue"),
            },
            {
                path: "edit-floorplan-old",
                name: "edit floor plan-old",
                component: () => import("@/views/SVGEditorView_old.vue"),
            },
        ],
    },
    {
        path: "/auth/login",
        name: "login",
        component: () => import("@/views/pages/auth/Login.vue"),
        meta: {guestOnly: true},
    },
    {
        path: "/:pathMatch(.*)*",
        redirect: {name: "dashboard"},
    },
];
