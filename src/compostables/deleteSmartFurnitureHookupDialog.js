export function deleteSmartFurnitureHookupDialog(acceptCallback){
    return {
        message: 'Are you sure you want to delete this smart furniture hookup?',
        header: 'Delete smart furniture hookup',
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

