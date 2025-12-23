import { defineStore } from 'pinia'

export const InteractiveMapState ={
    VIEW: "view",
    DRAW: "draw",
    EDIT: "edit"
}

export const useInteractiveMap = defineStore('interactiveMap', {
    state: () => ({
        svgDataUrl: null,
        svgFileName: null,
        state: InteractiveMapState.VIEW,
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
        getZoneNodes: (state) => {
            return state.zones.map((zone, index) => {
                return {
                    key: index,
                    label: zone.name,
                    color: zone.color,
                    id: zone.id
                }
            })
        },
        getZone: (state) => (id) =>{
            return state.zones.find(zone => zone.id === id)
        },
        getInteractiveMapState: (state) => {
            return state.state
        },
        hasZones: (state) => {
            return state.zones.length > 0
        },
        getNumberOfZones: (state) => {
            return state.zones.length
        }
    },
    actions: {
        uploadSvg(file, filename) {
            this.svgDataUrl = file
            this.svgFileName = filename
        },
        startDrawing() {
            this.state = InteractiveMapState.DRAW
        },
        startEditing() {
            this.state = InteractiveMapState.EDIT
        },
        viewMap() {
            this.state = InteractiveMapState.VIEW
        },
        addZone(zone){
            this.zones.push(zone)
        },
        editZone(zone){
            const currentZone = this.zones.find(z => z.id === zone.id)

            if (!currentZone) {return}

            currentZone.name = zone.name
            currentZone.color = zone.color

        },
        deleteZone(id) {
            this.zones = this.zones.filter(zone => zone.id !== id)
        }
    },
    persist: true
})