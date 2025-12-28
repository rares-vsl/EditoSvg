function createZoneNode(zone, index, smartFurnitureHookups) {
    return {
        key: index,
        label: zone?.name ?? "Floor plan",
        ...(zone?.color && {color: zone.color}),
        ...(zone?.id && {id: zone.id, type: "zone"}),
        children: smartFurnitureHookups
            .map((sfh, i) => ({
                key: `${index}-${i}`,
                id: sfh.id,
                label: sfh.name,
                isActive: sfh.isActive,
                type: "smart-furniture-hookup",
            }))
    };
}


export function useFloorPlanTree(zones, smartFurnitureHookups) {
    if (zones.length === 0 && smartFurnitureHookups.length === 0) {
        return [];
    }

    const floorPlanNode = createZoneNode(null, 0, smartFurnitureHookups
        .filter((sfh) => sfh.zone === null));

    const zoneNodes = zones.map((zone, index) => createZoneNode(zone, index + 1, smartFurnitureHookups
        .filter((sfh) => sfh.zone === zone.id)));

    return [floorPlanNode, ...zoneNodes];
}