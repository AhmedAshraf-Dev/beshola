import { fetchData } from "../../../components/hooks/APIsFunctions/useFetch";
import GetSchemaActionsUrl from "../../../components/hooks/DashboardAPIs/GetSchemaActionsUrl";
import { defaultCentralizationProxyRoute } from "../../../request";

export function mapItemsWithActions(items, conditionKey, casesWithActions) {
  // Pre-build a dictionary for O(1) lookups
  const actionMap = casesWithActions.reduce(
    (acc, { case: caseName, action }) => {
      acc[caseName] = action;
      return acc;
    },
    {},
  );

  // Loop through items once
  items.map(async (item) => {
    const action = actionMap[item[conditionKey]];
    const actions = await fetchData(
      GetSchemaActionsUrl(item.dashboardFormSchemaID),
      defaultCentralizationProxyRoute,
    );
    if (action) {
      action({ schema: item, actions: actions.data });
    }
  });
}
