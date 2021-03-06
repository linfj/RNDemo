import React, { Component } from "react";
import {
  TouchableOpacity,
  View,
  Image,
  StatusBar,
  Text,
  StyleSheet
} from "react-native";
import SettingsList from "../../component/SettingsList";
import { titleOptions } from "../../component/Titie";
import AccountHelper from "../../login/AccountHelper";
import { NavigationActions } from "react-navigation";

export default class SettingsScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return titleOptions({ navigation, title: "设置" });
  };

  constructor(props) {
    super(props);
    this.state = {
      data: [
        {
          key: "1",
          name: "修改密码",
          showArrow: "1",
          type: "item",
          leftIcon: require("../../../res/img/icon_setting_password.png"),
          onPress: () => {
            this.props.navigation.navigate("ModifyPwd");
          }
        },
        {
          key: "10",
          type: "divider"
        },
        {
          key: "2",
          name: "密保手机号",
          value: "立即设置",
          showArrow: "1",
          leftIcon: require("../../../res/img/icon_setting_phone.png"),
          type: "item",
          onPress: () => {
            this.state.accountInfo.securityTelephone;
            // this.props.navigation.navigate("InitSecurityPhoneStep1");
            this.props.navigation.navigate("ChangeSecurityPhoneStep1");
          }
        },
        {
          key: "0",
          type: "margin",
          margin: 9.7
        },
        {
          key: "3",
          name: "消息通知",
          showArrow: "1",
          leftIcon: require("../../../res/img/icon_setting_notification.png"),
          type: "item",
          onPress: () => {
            this.props.navigation.navigate("NotificationManager");
          }
        },
        {
          key: "0",
          type: "margin",
          margin: 9.7
        },
        {
          key: "4",
          name: "清空缓存",
          showArrow: "1",
          leftIcon: require("../../../res/img/icon_setting_clear_cache.png"),
          type: "item"
        },
        {
          key: "12",
          type: "divider"
        },
        {
          key: "5",
          name: "检测新版本",
          showArrow: "1",
          leftIcon: require("../../../res/img/icon_setting_update.png"),
          type: "item"
        },
        {
          key: "13",
          type: "divider"
        },
        {
          key: "6",
          name: "版本说明",
          showArrow: "1",
          leftIcon: require("../../../res/img/icon_setting_version_info.png"),
          type: "item"
        }
      ]
    };
  }

  componentDidMount() {
    this._navListener = this.props.navigation.addListener("didFocus", () => {
      StatusBar.setBarStyle("dark-content");
      StatusBar.setBackgroundColor("#FFFFFF");
    });
    AccountHelper.accountInfo
      ? (this.state.accountInfo = AccountHelper.accountInfo)
      : AccountHelper.getAccountInfo().then(data => {
          this.state.accountInfo = data;
        });
  }

  componentWillUnmount = () => {
    this._navListener.remove();
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="white" />

        <SettingsList data={this.state.data} />

        <TouchableOpacity
          style={styles.loginOutStyle}
          onPress={this._loginOut.bind(this)}
        >
          <Text style={styles.loginOutTextStyle}>退出登录</Text>
        </TouchableOpacity>
      </View>
    );
  }

  _loginOut() {
    AccountHelper.loginOut(result => {
      if (result) {
        this._loginOutSuccessful();
      }
    });
  }

  _loginOutSuccessful() {
    this.props.navigation.reset(
      [NavigationActions.navigate({ routeName: "DistributePage" })],
      0
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    justifyContent: "space-between",
    flexDirection: "column"
  },
  loginOutStyle: {
    height: 39,
    marginLeft: 14,
    marginRight: 14,
    marginBottom: 21,
    borderRadius: 3,
    backgroundColor: "#F12E49",
    alignItems: "center",
    justifyContent: "center"
  },
  loginOutTextStyle: {
    color: "white",
    textAlign: "center"
  },
  backButtonStyle: {
    marginLeft: 20,
    width: 50,
    height: 50,
    flex: 1,
    justifyContent: "center"
  }
});
