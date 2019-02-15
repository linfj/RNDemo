/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React from "react";
import { Image } from "react-native";
import {
  createBottomTabNavigator,
  createAppContainer,
  createStackNavigator
} from "react-navigation";
import HomeStack from "./src/js/home/HomeStack";
import { MineScreen } from "./src/js/mine/MineScreen";
import SettingsScreen from "./src/js/mine/settings/SettingsScreen";
import FeedbackScreen from "./src/js/mine/FeedbackScreen";
import InitSecurityPhoneStep1 from "./src/js/mine/settings/initsecurityphone/InitSecurityPhoneStep1";
import InitSecurityPhoneStep2 from "./src/js/mine/settings/initsecurityphone/InitSecurityPhoneStep2";
import PersonalInfoScreen from "./src/js/mine/personal/PersonalInfo";
import ModifyPwdScreen from "./src/js/mine/settings/ModifyPwdScreen";
import QrCodeScreen from "./src/js/mine/personal/QrCodeScreen";
const TabNavigator = createBottomTabNavigator(
  {
    首页: HomeStack,
    我的: MineScreen
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === "首页") {
          iconName = focused
            ? require("./src/res/img/app_info_tab_pre.png")
            : require("./src/res/img/app_info_tab_nor.png");
        } else if (routeName === "我的") {
          iconName = focused
            ? require("./src/res/img/app_mine_tab_pre.png")
            : require("./src/res/img/app_mine_tab_nor.png");
        }

        return <Image style={{ width: 20, height: 18 }} source={iconName} />;
      }
    }),
    tabBarOptions: {
      activeTintColor: "tomato",
      inactiveTintColor: "gray"
    },
    initialRouteName: "我的"
  }
);

const StackContainer = createStackNavigator(
  {
    Feedback: FeedbackScreen,
    InitSecurityPhoneStep1: InitSecurityPhoneStep1,
    InitSecurityPhoneStep2: InitSecurityPhoneStep2,
    ModifyPwd: ModifyPwdScreen,
    Settings: SettingsScreen,
    PersonalInfo: PersonalInfoScreen,
    QrCode: QrCodeScreen,
    HomeTab: {
      screen: TabNavigator,
      navigationOptions: {
        header: null
      }
    }
  },
  {
    initialRouteName: "HomeTab",
    defaultNavigationOptions: {
      headerTitleStyle: { flex: 1, textAlign: "center" }
    }
  }
);

const AppContainer = createAppContainer(StackContainer);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
