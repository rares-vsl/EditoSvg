export function useFloorPlanTree(zones, smartFurnitureHookups) {
    const zoneNodes = zones.map((zone, index) => ({
        key: index + 1,
        label: zone.name,
        color: zone.color,
        id: zone.id,
        type: "zone",
        children: smartFurnitureHookups
            .filter((sfh) => sfh.zone === zone.id)
            .map((sfh, i) => ({
                key: `${index + 1}-${i}`,
                id: sfh.id,
                label: sfh.name,
                isActive: sfh.isActive,
                type: "smart-furniture-hookup",
            }))
    }));

    zoneNodes.unshift({
        key: 0,
        label: "Floor plan",
        children: smartFurnitureHookups
            .filter((sfh) => sfh.zone === null)
            .map((sfh, i) => ({
                key: `${0}-${i}`,
                id: sfh.id,
                label: sfh.name,
                isActive: sfh.isActive,
                type: "smart-furniture-hookup",
            })),
    })

    return zoneNodes
}