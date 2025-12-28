export function CollisionZoneToast(message)  {
    return {
        severity: 'error',
        summary: 'Collision error',
        detail: message,
        life: 2000
    }
}