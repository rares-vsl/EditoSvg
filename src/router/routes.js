import AppLayout from "@/layout/AppLayout.vue";
import EditorLayout from "@/layout/EditorLayout.vue";

export const routes = [
  {
    path: "/",
    component: AppLayout,
    meta: { requiresAuth: false },
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
        meta: { roles: ["admin"] },
      },
      {
        path: "thresholds",
        name: "thresholds",
        component: () => import("@/views/pages/Empty.vue"),
        meta: { roles: ["admin"] },
      },
      {
        path: "mapeditor",
        name: "mapeditor",
        component: () => import("@/views/pages/Empty.vue"),
        meta: { roles: ["admin"] },
      },
      {
        path: "access-denied",
        name: "accessDenied",
        component: () => import("@/views/pages/Empty.vue"),
      },
    ],
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
    meta: { guestOnly: true },
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: { name: "dashboard" },
  },
];
