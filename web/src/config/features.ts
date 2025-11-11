export const features = {
  wearablesEnabled: (import.meta.env.VITE_WEARABLES_ENABLED ?? "false") === "true",
  wearablesMode: (import.meta.env.VITE_WEARABLES_MODE as "mock" | "ble" | "off" | undefined) ?? "off",
};

export const isWearableIntegrationActive =
  features.wearablesEnabled && features.wearablesMode !== "off";
