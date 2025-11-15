import { Entypo } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Platform, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  updateSelectedLocation,
  updateSelectedNode,
} from "../../reducers/LocationReducer";
import PopupModal from "../../utils/component/PopupModal";
import SelectComponent from "../../utils/component/SelectComponent";
import { handleSubmitWithCallback } from "../../utils/operation/handleSubmitWithCallback";
import { getField } from "../../utils/operation/getField";
import { useSchemas } from "../../../context/SchemaProvider";
import { onApply } from "../form-container/OnApply";

export default function AddLocation({
  rows,
  onScroll,
  AddAddressLocation,
  loading,
}) {
  const { addressLocationState } = useSchemas();

  const idField = addressLocationState.schema.idField;
  const displayLookupParam =
    addressLocationState.schema.dashboardFormSchemaParameters.find(
      (pram) => pram.parameterType == "displayLookup"
    );
  const tag = getField(
    addressLocationState.schema.dashboardFormSchemaParameters,
    "addressLocationTag"
  );
  const [location, setLocation] = useState(null);
  const [reqError, setReqError] = useState(null);
  const [disable, setDisable] = useState(false);
  const selectedLocation = useSelector(
    (state) => state.location.selectedLocation
  );
  const localization = useSelector((state) => state.localization.localization);
  const locations = useSelector((state) => state.location.locations);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const postAction =
    addressLocationState.actions &&
    addressLocationState.actions.find(
      (action) => action.dashboardFormActionMethodType === "Post"
    );
  const onSubmit = async (data: any) => {
    await handleSubmitWithCallback({
      data,
      setDisable,
      action: postAction,
      proxyRoute: addressLocationState.schema.projectProxyRoute,
      setReq: setReqError,
      onSuccess: (resultData) => {
        AddAddressLocation(resultData);
        setIsModalVisible(false);
        dispatch(updateSelectedLocation(resultData));
      },
    });
  };
  useEffect(() => {
    if (!loading && rows.length > 0 && !rows.includes(selectedLocation)) {
      //!send here the req
      if (Object.keys(selectedLocation).length > 0) {
        const selectedRow = rows.find(
          (row) => row[idField] === selectedLocation[idField]
        );
        dispatch(updateSelectedLocation(selectedRow));
      } else {
        dispatch(updateSelectedLocation(rows[0]));
      }
    }
  }, [loading]);

  return (
    <View>
      <PopupModal
        isOpen={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          Platform.OS !== "web" && reset();
        }}
        // onSubmit={async () => {
        //   handleSubmit(onSubmit);
        // }}
        onSubmit={handleSubmit(onSubmit)}
        control={control}
        headerTitle={
          addressLocationState.schema.dashboardFormSchemaInfoDTOView
            .addingHeader
        }
        row={{}}
        schema={addressLocationState.schema}
        errors={reqError || errors}
        disable={disable}
      />
      <View className="flex flex-row items-center">
        <TouchableOpacity
          className="p-2 w-fit rounded-lg bg-accent items-center justify-center me-2"
          onPress={() => setIsModalVisible(true)}
        >
          <Entypo name="plus" size={20} className="!text-body" />
        </TouchableOpacity>
        <SelectComponent
          idField={idField}
          labelField={displayLookupParam.lookupDisplayField}
          mapData={rows}
          onValueChange={async (selectedID) => {
            const selectedValue = rows.find(
              (row) => row[idField] === selectedID
            );
            // const theNearestBranch = await onApply(
            //   { ...selectedValue },
            //   null,
            //   true,
            //   postAction
            // );
            // if(theNearestBranch.success){
            //   setSelectedNode(theNearestBranch);
            //             dispatch(updateSelectedNode(theNearestBranch));
            // }
            //!send here the req
            dispatch(updateSelectedLocation(selectedValue)); // store full object
          }}
          subtitle={selectedLocation[tag]}
          selectedValue={
            selectedLocation[displayLookupParam.lookupDisplayField]
          }
          valueField={idField}
          loading={loading}
        />
      </View>
    </View>
  );
}
