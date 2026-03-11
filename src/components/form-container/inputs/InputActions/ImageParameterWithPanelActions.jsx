import React, { Component } from "react";
import { View } from "react-native";

import defaultImage from "../../../../../assets/display/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg";
import BaseInput from "../BaseInput";
import ImageParameter from "../ImageParameter";
import BrowserUrlAction from "./BrowserUrlAction";
import UploadAction from "./UploadAction";

import { publicImageURL } from "../../../../../request";

class ImageParameterWithPanelActions extends BaseInput {
  constructor(props) {
    super(props);

    this.state = {
      FileData:
        props.type === "publicImage" && props.value
          ? publicImageURL + props.value
          : props.value,
    };
  }

  handleImageUpload = (path, type) => {
    this.setState({
      FileData: this.props.addFile ? defaultImage : path,
    });

    if (this.props.addFile) {
      this.props.addFile(path, type);
    }
  };

  render() {
    const { FileData } = this.state;
    const { isFileContainer = false } = this.props;

    const actions = [
      <UploadAction
        key="upload"
        fieldName={this.props.fieldName}
        isFileContainer={isFileContainer}
        onImageUpload={this.handleImageUpload}
      />,
      <BrowserUrlAction
        key="browser"
        {...this.props}
        onImageUpload={this.handleImageUpload}
      />,
    ];

    return (
      <View>
        <ImageParameter
          {...this.props}
          value={FileData}
          defaultValue={
            this.props.type === "publicImage"
              ? publicImageURL + this.props.value
              : this.props.value
          }
          actions={actions}
        />
        <UploadAction
          key="upload"
          fieldName={this.props.fieldName}
          isFileContainer={isFileContainer}
          onImageUpload={this.handleImageUpload}
        />
        <BrowserUrlAction
          key="browser"
          {...this.props}
          onImageUpload={this.handleImageUpload}
        />
      </View>
    );
  }
}

export default ImageParameterWithPanelActions;
