import React, { Component } from "react";
import { TextInput, View } from "react-native";

class BaseInput extends Component {
  handleChange = (text) => {
    const { row, fieldName, onChange } = this.props;

    const updatedRow = {
      ...row,
      [fieldName]: text,
    };

    if (onChange) {
      onChange(updatedRow);
    }
  };

  render() {
    const { value, enable = true } = this.props;

    return (
      <View>
        <TextInput
          value={value}
          onChangeText={this.handleChange}
          editable={enable}
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            padding: 8,
            borderRadius: 6,
          }}
        />
      </View>
    );
  }
}

export default BaseInput;
