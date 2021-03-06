import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

export default class PersonalPanel extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { name, phoneNumber, avaterUrl, onPress } = this.props;
    const avater = avaterUrl
      ? { uri: avaterUrl }
      : require("../../res/img/icon_default_avater.png");
    return (
      <TouchableOpacity
        style={[styles.container, this.props.style]}
        onPress={onPress}
        activeOpacity={1}
      >
        <View style={styles.leftContainer}>
          <Image style={styles.avaterStyle} source={avater} />

          <View style={styles.messagePanelStyle}>
            <Text style={[styles.messageTextStyle, { marginTop: 5 }]}>
              {name ? name : "请登录"}
            </Text>
            <Text style={[styles.messageTextStyle, { marginBottom: 5 }]}>
              {phoneNumber}
            </Text>
          </View>
        </View>

        <Image
          style={styles.rightArrowStyle}
          source={require("../../res/img/icon_left_arrow.png")}
        />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignContent: "flex-start",
    justifyContent: "space-between"
  },
  leftContainer: {
    marginLeft: 24,
    flexDirection: "row"
  },
  avaterStyle: { height: 57, width: 57, marginRight: 21 },
  messagePanelStyle: {
    width: "60%",
    flexDirection: "column",
    justifyContent: "space-between"
  },
  messageTextStyle: { color: "white", fontSize: 15 },
  rightArrowStyle: { width: 10, marginRight: 21, marginTop: 16 }
});
