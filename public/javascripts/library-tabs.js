const libraryTabs = document.querySelector("[data-library-tabs]");
const tabLinks = libraryTabs.querySelectorAll("[data-library-tab]");
const ownedOnly = document.querySelectorAll("[data-owned-only]");
const wishlistOnly = document.querySelectorAll("[data-wishlist-only]");
const listLinks = document.querySelectorAll(".library-sort-options a, .library-game-row");

function showLibraryTab() {
  const isWishlist = new URLSearchParams(location.search).get("tab") === "wishlist";
  for (const link of tabLinks) {
    const active = link.dataset.libraryTab === (isWishlist ? "wishlist" : "owned");
    link.classList.toggle("library-segment-current", active);
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  }
  for (const element of ownedOnly) element.hidden = isWishlist;
  for (const element of wishlistOnly) element.hidden = !isWishlist;
  for (const link of listLinks) {
    const url = new URL(link.href);
    if (isWishlist) url.searchParams.set("tab", "wishlist");
    else url.searchParams.delete("tab");
    link.href = url.pathname + url.search;
  }
}

libraryTabs.addEventListener("click", (event) => {
  const link = event.target.closest("[data-library-tab]");
  if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

  event.preventDefault();
  if (link.getAttribute("aria-current") === "page") return;

  history.pushState(null, "", link.href);
  showLibraryTab();
});

window.addEventListener("popstate", showLibraryTab);
