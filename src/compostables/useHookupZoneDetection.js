import {useZoneCollision} from "@/compostables/useZoneCollision.js";

export function useHookupZoneDetection(existingZones) {
    const collision = useZoneCollision()

    function findZoneForHookup(hookup) {
        if (!hookup || !hookup.position.x || !hookup.position.y) {
            return null
        }

        for (const zone of existingZones.value) {
            if (collision.isPointInPolygon(hookup.position, zone.points)) {
                console.log(zone.id)
                return zone.id
            }
        }
        
        return null

    }

    return {
        findZoneForHookup
    }
}