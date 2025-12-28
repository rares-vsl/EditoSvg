export function deleteZoneDialog(acceptCallback){
    return {
        message: 'Are you sure you want to delete this zone?',
        header: 'Delete Zone',
        icon: 'pi pi-info-circle',
        rejectLabel: 'Cancel',
        rejectProps: {
            label: 'Cancel',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Delete',
            severity: 'danger'
        },
        accept: acceptCallback
    }
}