import { defineStore } from 'pinia'

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
        ]
    }),
    getters: {
        zoneTreeNodes: (state) => {
            return state.zones.map((zone, index) => ({
                key: index,
                label: zone.name,
                color: zone.color,
                id: zone.id
            }))
        },

        hasZones: (state) => state.zones.length > 0,
        zoneCount: (state) => state.zones.length,
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
        }
    },
    persist: true
})