import APIHandling from "../../../components/hooks/APIsFunctions/APIHandling";
import { GetProjectUrl } from "../../../request";

export default async function FieldAction(
  id,
  // modalIsOpen,
  // setModalIsOpen,
  value,
  action,
) {
  console.log("action", action);
  if (action) {
    const actionRequest = await APIHandling(
      `${GetProjectUrl(action.projectProxyRoute)}/${action.routeAdderss}/${id}`,
      action.dashboardFormActionMethodType.split(":")[1],
      value,
    );
    return actionRequest;
  }
  return true;
}
