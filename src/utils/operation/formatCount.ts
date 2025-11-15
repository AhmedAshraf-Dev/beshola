import { store } from "../../store/reduxStore";

export function formatCount(value: number | string): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  const localization = store.getState().localization.localization;

  const formatCountLocalization = localization.formatCount;
  if (isNaN(num)) return "0";

  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1).replace(/\.0$/, "")}${formatCountLocalization.million}`;
  }

  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1).replace(/\.0$/, "")}${formatCountLocalization.thousand}`;
  }

  return `${num}`;
}
