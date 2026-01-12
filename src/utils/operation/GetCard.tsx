import { setCartFromStorage } from "../../reducers/CartReducer";
import { setFields } from "../../reducers/MenuItemReducer";
import { getField } from "./getField";
import { GetFieldsItemTypes } from "./GetFieldsItemTypes";

// Keep GetCard as pure function
export function GetCard(
  schema,
  GetCustomerCart = false,
  dispatch,
  cart,
  total,
) {
  const fieldsType = GetFieldsItemTypes(schema);
  dispatch(setFields(fieldsType));
  // if (cart.length === 0) {
  if (GetCustomerCart) {
    dispatch(
      setCartFromStorage({
        cart: [...GetCustomerCart.dataSource],
        totalAmount: total,
      }),
    );
  }
  // }
}
