import { useSelector } from "react-redux";

export function selectedRoutes(userGust) {
  const localization = useSelector((state) => state.localization.localization);

  const routes = [
    { routePath: "Home" },
    { routePath: "Search" },
    { routePath: "Requests" },
    { routePath: "Profile" },
  ];

  // Create new mapped tabs with routePath added
  const tabs =
    localization.tabs?.map((tab) => {
      if (tab.icon === "home") {
        return { ...tab, routePath: "Home" };
      } else if (tab.icon === "menu") {
        return { ...tab, routePath: "Search" };
      } else if (tab.icon === "receipt") {
        return { ...tab, routePath: "Requests" };
      } else if (tab.icon === "person") {
        return { ...tab, routePath: "Profile" };
      }
      return tab; // keep unchanged if no match
    }) ?? [];

  const routesForGuests = routes.filter(
    (item) => item.routePath !== "Profile" && item.routePath !== "Orders"
  );

  const tabsForGuests = tabs.filter(
    (item) => item.routePath !== "Profile" && item.routePath !== "Orders"
  );

  return userGust
    ? { routes: routesForGuests, tabs: tabsForGuests }
    : { routes, tabs };
}
