import { getField } from "./getField";

export function GetFieldsItemTypes(schema) {
  const parameters = schema?.dashboardFormSchemaParameters ?? [];

  const fieldsType = {
    imageView: getField(parameters, "companyItemImage"),
    companyName: getField(parameters, "companyName"),
    propertyType: getField(parameters, "propertyType"),
    attributes: getField(parameters, "attributes"),
    price: getField(parameters, "price"),
    rate: getField(parameters, "rate"),
    verified: getField(parameters, "verified"),
    bathrooms: getField(parameters, "bathrooms"),
    orders: getField(parameters, "orders"),
    reviews: getField(parameters, "reviews"),
    isAvailable: getField(parameters, "isAvailable"),
    location: getField(parameters, "location"),
    discount: getField(parameters, "discount"),
    priceAfterDiscount: getField(parameters, "priceAfterDiscount"),
    rewardPoints: getField(parameters, "rewardPoints"),
    indexOfInteraction: getField(parameters, "indexOfInteraction"),
    idField: schema.idField,
    dataSourceName: schema.dataSourceName,
    cardAction: getField(parameters, "cardAction"),
    isFav: getField(parameters, "isFav"),
  };
  return fieldsType;
}
