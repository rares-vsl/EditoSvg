export function useZoneCollision() {
    /**
     * Check if a point is inside a polygon using ray casting algorithm
     */
    function isPointInPolygon(point, polygon) {
        if (!polygon || polygon.length < 3) return false

        let inside = false
        const x = point.x
        const y = point.y

        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            const xi = polygon[i].x
            const yi = polygon[i].y
            const xj = polygon[j].x
            const yj = polygon[j].y

            const intersect = ((yi > y) !== (yj > y)) &&
                (x < (xj - xi) * (y - yi) / (yj - yi) + xi)

            if (intersect) inside = !inside
        }

        return inside
    }

    /**
     * Check if two line segments intersect
     */
    function doSegmentsIntersect(p1, p2, p3, p4) {
        const ccw = (A, B, C) => {
            return (C.y - A.y) * (B.x - A.x) > (B.y - A.y) * (C.x - A.x)
        }

        return ccw(p1, p3, p4) !== ccw(p2, p3, p4) &&
            ccw(p1, p2, p3) !== ccw(p1, p2, p4)
    }

    /**
     * Check if two polygons intersect
     * Returns true if any edges intersect OR if any vertex of one is inside the other
     */
    function doPolygonsIntersect(poly1, poly2) {
        for (let i = 0; i < poly1.length; i++) {
            const p1 = poly1[i]
            const p2 = poly1[(i + 1) % poly1.length]

            for (let j = 0; j < poly2.length; j++) {
                const p3 = poly2[j]
                const p4 = poly2[(j + 1) % poly2.length]

                if (doSegmentsIntersect(p1, p2, p3, p4)) {
                    return true
                }
            }
        }

        for (const point of poly1) {
            if (isPointInPolygon(point, poly2)) {
                return true
            }
        }

        for (const point of poly2) {
            if (isPointInPolygon(point, poly1)) {
                return true
            }
        }

        return false
    }

    /**
     * Check if polygon1 completely contains polygon2
     */
    function doesPolygonContainPolygon(poly1, poly2) {
        for (const point of poly2) {
            if (!isPointInPolygon(point, poly1)) {
                return false
            }
        }
        return true
    }

    /**
     * Validate if a point can be added while drawing a zone
     * Returns { valid: boolean, reason: string }
     */
    function canAddPoint(point, existingZones, excludeZoneId = null) {
        for (const zone of existingZones) {
            if (zone.id === excludeZoneId) continue

            if (isPointInPolygon(point, zone.points)) {
                return {
                    valid: false,
                    reason: `Point is inside zone "${zone.name}"`
                }
            }
        }

        return { valid: true, reason: null }
    }

    /**
     * Validate if a new zone can be created
     * Checks for intersections and containment
     */
    function canCreateZone(newZonePoints, existingZones) {
        if (newZonePoints.length < 3) {
            return {
                valid: false,
                reason: 'Zone must have at least 3 points'
            }
        }

        for (const zone of existingZones) {
            // Check if new zone intersects with existing zone
            if (doPolygonsIntersect(newZonePoints, zone.points)) {
                return {
                    valid: false,
                    reason: `New zone intersects with zone "${zone.name}"`
                }
            }

            // Check if new zone contains existing zone
            if (doesPolygonContainPolygon(newZonePoints, zone.points)) {
                return {
                    valid: false,
                    reason: `New zone would contain zone "${zone.name}"`
                }
            }

            // Check if existing zone contains new zone
            if (doesPolygonContainPolygon(zone.points, newZonePoints)) {
                return {
                    valid: false,
                    reason: `New zone would be inside zone "${zone.name}"`
                }
            }
        }

        return { valid: true, reason: null }
    }

    /**
     * Internal helper to check a candidate point set against all other zones
     */
    function validatePolygonPlacement(movedPoints, currentZoneId, existingZones) {
        for (const otherZone of existingZones) {
            // Skip self
            if (otherZone.id === currentZoneId) continue

            // 1. Check intersection
            if (doPolygonsIntersect(movedPoints, otherZone.points)) {
                return {
                    valid: false,
                    reason: `Would intersect with zone "${otherZone.name}"`
                }
            }

            // 2. Check containment (moved zone contains other)
            if (doesPolygonContainPolygon(movedPoints, otherZone.points)) {
                return {
                    valid: false,
                    reason: `Would contain zone "${otherZone.name}"`
                }
            }

            // 3. Check containment (other zone contains moved)
            if (doesPolygonContainPolygon(otherZone.points, movedPoints)) {
                return {
                    valid: false,
                    reason: `Would be inside zone "${otherZone.name}"`
                }
            }
        }

        return { valid: true, reason: null }
    }

    /**
     * Validate if a zone can be moved to a new position
     */
    function canMoveZone(zone, dx, dy, existingZones) {
        const movedPoints = zone.points.map(p => ({
            x: p.x + dx,
            y: p.y + dy
        }))

        return validatePolygonPlacement(movedPoints, zone.id, existingZones)
    }

    /**
     * Validate if a single vertex can be moved
     */
    function canMoveVertex(zone, vertexIndex, newPosition, existingZones) {
        const movedPoints = zone.points.map((p, i) =>
            i === vertexIndex ? { ...newPosition } : { ...p }
        )

        return validatePolygonPlacement(movedPoints, zone.id, existingZones)
    }

    return {
        isPointInPolygon,
        doPolygonsIntersect,
        doesPolygonContainPolygon,

        canAddPoint,
        canCreateZone,
        canMoveZone,
        canMoveVertex
    }
}