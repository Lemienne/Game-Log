const autoRefresh = document.getElementById("steam-auto-refresh");
const autoRefreshPreferenceKey = "game-log:steam-auto-refresh";

try {
  const savedPreference = localStorage.getItem(autoRefreshPreferenceKey);
  if (savedPreference !== null) autoRefresh.checked = savedPreference === "true";
} catch {
  // The switch remains usable if browser storage is unavailable.
}

autoRefresh.addEventListener("change", () => {
  try {
    localStorage.setItem(autoRefreshPreferenceKey, String(autoRefresh.checked));
  } catch {
    // Keep the current setting for this page when it cannot be saved.
  }
});
