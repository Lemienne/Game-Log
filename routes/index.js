const express = require("express");
const router = express.Router();

const libraryGames = [1, 2, 3, 4];
const librarySortOrders = [
  { label: "등록순", key: "added", ascending: [...libraryGames].reverse() },
  { label: "이름순", key: "name", ascending: libraryGames },
  { label: "발매순", key: "release", ascending: [4, 2, 1, 3] },
];
const librarySortOptions = librarySortOrders.flatMap(({ label, key, ascending }) => [
  { label, key: key + "-asc", arrow: "↑", games: ascending },
  { label, key: key + "-desc", arrow: "↓", games: [...ascending].reverse() },
]);

function getLibraryListOptions(query) {
  const tab = query.tab === "wishlist" ? "wishlist" : "owned";
  const selectedSort = librarySortOptions.find(({ key }) => key === query.sort);
  return { tab, sort: selectedSort || librarySortOptions[1], selectedSort };
}

function libraryListHref(path, tab, sort) {
  const params = new URLSearchParams();
  if (tab === "wishlist") params.set("tab", tab);
  if (sort) params.set("sort", sort.key);
  return params.size ? path + "?" + params : path;
}

router.get("/", function (req, res) {
  res.render("index", { title: "GameLog", showSearch: true });
});

router.get("/library", function (req, res) {
  res.render("library/page", {
    title: "라이브러리", screen: "overview", games: libraryGames,
    headerLabel: "라이브러리", headerHref: "/library", showSearch: true,
  });
});

router.get(["/library/games", "/library/favorites"], function (req, res) {
  const favorites = req.path.replace(/\/$/, "").toLowerCase() === "/library/favorites";
  const path = favorites ? "/library/favorites" : "/library/games";
  const { tab, sort, selectedSort } = getLibraryListOptions(req.query);
  const detailQuery = new URLSearchParams({ from: favorites ? "favorites" : "games" });
  if (tab === "wishlist") detailQuery.set("tab", tab);
  if (selectedSort) detailQuery.set("sort", selectedSort.key);

  res.render("library/page", {
    title: favorites ? "즐겨찾기" : "모든 게임",
    screen: "games", games: sort.games, tab, sort, selectedSort,
    showRevisit: !favorites,
    tabs: [
      { key: "owned", label: "보유 게임", href: libraryListHref(path, "owned", selectedSort) },
      { key: "wishlist", label: "위시리스트", href: libraryListHref(path, "wishlist", selectedSort) },
    ],
    sortOptions: librarySortOptions.map((option) => ({
      ...option, href: libraryListHref(path, tab, option),
    })),
    detailQuery: detailQuery.toString(),
    headerBack: "/library", showSearch: true, showHeaderMore: true,
  });
});

router.get("/library/games/:gameId", function (req, res, next) {
  const game = libraryGames.find((number) => String(number) === req.params.gameId);
  if (!game) return next();

  const { tab, selectedSort } = getLibraryListOptions(req.query);
  const listPath = req.query.from === "favorites" ? "/library/favorites" : "/library/games";
  res.render("library/page", {
    title: `게임 타이틀 ${game}`, screen: "detail", game,
    headerBack: req.query.from === "home" ? "/" : libraryListHref(listPath, tab, selectedSort),
    showSearch: true, showHeaderMore: true,
  });
});

const prototypeScreens = [
  { path: "/search", title: "탐색", screen: "search", headerBack: "/library", showSearch: true, showHeaderMore: true },
  { path: "/queue", title: "리스트업", screen: "queue", headerLabel: "리스트업", showSearch: true },
  { path: "/journal", title: "기록", screen: "journal", headerLabel: "기록" },
  { path: "/account/stats", title: "게임 통계", screen: "stats", headerBack: "/account", showSearch: true, showHeaderMore: true },
  { path: "/login", title: "로그인", screen: "login", headerLabel: "Game Log", headerHref: "/" },
];

for (const { path, ...view } of prototypeScreens) {
  router.get(path, function (req, res) {
    res.render("prototype/page", { headerHref: path, ...view });
  });
}

router.get("/account", function (req, res) {
  const steam = req.user?.steam;
  const steamState = !steam?.accountId
    ? "unregistered"
    : steam.connectionStatus === "connected" ? "connected" : "unavailable";

  res.render("prototype/page", {
    title: "계정", screen: "account", headerLabel: "계정",
    headerHref: "/account", steamState,
  });
});

module.exports = router;
