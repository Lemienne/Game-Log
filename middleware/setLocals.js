const navigation = [
  { path: "/", label: "홈", icon: "home" },
  { path: "/library", label: "라이브러리", icon: "library" },
  { path: "/queue", label: "리스트업", icon: "queue" },
  { path: "/journal", label: "기록", icon: "journal" },
  { path: "/account", label: "계정", icon: "account" },
];

const sectionsWithoutNavigation = new Set(["/login", "/signup", "/register"]);

function setLocals(req, res, next) {
  const pathname = req.path.replace(/\/+$/, "").toLowerCase() || "/";
  const section = "/" + pathname.split("/")[1];

  res.locals.navigation = navigation;
  const navigationSection = section === "/search" ? "/library" : section;
  res.locals.currentSection = navigation.find(({ path }) => path === navigationSection);
  const avatarUrl = req.user?.profile?.avatarUrl;
  res.locals.accountAvatarUrl =
    typeof avatarUrl === "string" && /^(?:https?:\/\/|\/(?![/\\]))/i.test(avatarUrl)
      ? avatarUrl
      : null;
  // A route can also pass showNavigation: false when rendering its view.
  res.locals.showNavigation = !sectionsWithoutNavigation.has(section);
  res.locals.showSearch = false;
  res.locals.headerBack = null;
  res.locals.headerLabel = null;
  res.locals.headerHref = null;
  res.locals.showHeaderMore = false;
  next();
}

module.exports = setLocals;
