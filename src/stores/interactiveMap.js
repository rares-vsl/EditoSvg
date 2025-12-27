import { defineStore } from 'pinia'
import {UtilityType} from "@/compostables/UtilityType.js";

export const MapMode ={
    VIEW: "view",
    DRAW: "draw",
    EDIT: "edit"
}

export const useInteractiveMap = defineStore('interactiveMap', {
    state: () => ({
        svgDataUrl: null,
        svgFileName: null,
        mode: MapMode.VIEW,
        zones: [
            {
                "id": 0,
                "name": "kitchen",
                "points": [
                    {
                        "x": 824.5523681640625,
                        "y": 290.3343505859375
                    },
                    {
                        "x": 1475.0836181640625,
                        "y": 287.8031005859375
                    },
                    {
                        "x": 1477.6148681640625,
                        "y": 687.7406005859375
                    },
                    {
                        "x": 824.5523681640625,
                        "y": 682.6781005859375
                    }
                ],
                "color": "#3b82f6"
            },
            {
                "id": 1,
                "name": "bathroom",
                "points": [
                    {
                        "x": 556.2398681640625,
                        "y": 290.3343811035156
                    },
                    {
                        "x": 806.8336181640625,
                        "y": 287.8031311035156
                    },
                    {
                        "x": 814.4273681640625,
                        "y": 675.0843505859375
                    },
                    {
                        "x": 551.1773681640625,
                        "y": 667.4906005859375
                    }
                ],
                "color": "#3b82f6"
            }
        ],
        smartFurnitureHookups: [
            {
                "id": 0,
                "name": "fridge",
                "position": {
                    "x": 830.5523681640625,
                    "y": 300.3343505859375
                },
                "utilityType": UtilityType.ELECTRICITY,
                "zone": 0,
                "isActive": false
            },

            {
                "id": 1,
                "name": "pc",
                "position": {
                    "x": 830.5523681640625,
                    "y": 600.3343505859375
                },
                "utilityType": UtilityType.ELECTRICITY,
                "zone": null,
                "isActive": false
            }

        ]
    }),
    getters: {
        hasZones: (state) => state.zones.length > 0,
        hasSmartFurnitureHookups: (state) => state.smartFurnitureHookups.length > 0,
        zoneCount: (state) => state.zones.length,
        smartFurnitureHookupsCount: (state) => state.smartFurnitureHookups.length,
        isViewMode: (state) => state.mode === MapMode.VIEW,
        isDrawMode: (state) => state.mode === MapMode.DRAW,
        isEditMode: (state) => state.mode === MapMode.EDIT
    },
    actions: {
        uploadSvg(file, filename) {
            this.svgDataUrl = file
            this.svgFileName = filename
        },
        startDrawing() {
            this.mode = MapMode.DRAW
        },
        startEditing() {
            this.mode = MapMode.EDIT
        },
        viewMap() {
            this.mode = MapMode.VIEW
        },
        findZone(id) {
            return this.zones.find(zone => zone.id === id)
        },
        addZone(zone){
            this.zones.push(zone)
        },
        updateZone(id, updates) {
            const index = this.zones.findIndex(zone => zone.id === id)

            if (index !== -1) {
                this.zones[index] = { ...this.zones[index], ...updates }
            }
        },
        deleteZone(id) {
            this.zones = this.zones.filter(zone => zone.id !== id)
        },
        addSmartFurnitureHookup(smartFurnitureHookup) {
            this.smartFurnitureHookups.push(smartFurnitureHookup)
        },
        findSmartFurnitureHookup(id) {
            return this.smartFurnitureHookups.find(sfh => sfh.id === id)
        },
        updateSmartFurnitureHookup(id, updates) {
            const index = this.smartFurnitureHookups.findIndex(sfh => sfh.id === id)

            if (index !== -1) {
                this.smartFurnitureHookups[index] = { ...this.smartFurnitureHookups[index], ...updates }
            }
        },
        deleteSmartFurnitureHookup(id) {
            this.smartFurnitureHookups = this.smartFurnitureHookups.filter(sfh => sfh.id !== id)
        },
    },
    persist: true
})