import { ref } from "vue";

export function ZoneInformation() {
  const showZoneInfoPanel = ref(false);
  const zoneName = ref("");

  const showZoneInformation = () => {
    showZoneInfoPanel.value = true;
  };

  const saveZoneInformation = () => {
    if (!zoneName.value.trim()) {
      alert("Please enter a zone name");
      return;
    }

    showZoneInfoPanel.value = false;
  };

  return {
    showZoneInfoPanel,
    zoneName,
    showZoneInformation,
    saveZoneInformation,
  };
}
