import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  TouchableHighlight,
  Image,
  StatusBar
} from "react-native";
import CommonDialog from "../../component/CommonDialog";
import CheckViewWithText from "../../component/CheckViewWithText";
import TextInputWithClearButton from "../../component/TextInputWithClearButton";
import FeedbackHelper from "./FeedbackHelper";
import AccountHelper from "../../login/AccountHelper";

const feedbackContentMaxLength = 500;
let _navigation;
export default class FeedbackScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    _navigation = navigation;
    return {
      title: "意见反馈",
      headerRight: <View />,
      headerLeft: (
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={styles.backButtonStyle}
        >
          <Image
            source={require("../../../res/img/icon_back.png")}
            resizeMode={"contain"}
            style={{ height: 14.6, width: 8.3 }}
          />
        </TouchableOpacity>
      )
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      feedbackContentText: "",
      feedbackPhoneNum: "",
      checkBoxGroupStatus: [
        { isChecked: true, label: "服务体验", uploadType: 1 },
        { isChecked: false, label: "使用操作", uploadType: 2 },
        { isChecked: false, label: "其他", uploadType: 3 }
      ],
      currentFeedbackContentLength: 0
    };

    this._checkBoxOnPress.bind(this);
    this._onCommonDialogConfirm.bind(this);
    this._showConfirm.bind(this);
  }
  componentDidMount() {
    this._navListener = this.props.navigation.addListener("didFocus", () => {
      StatusBar.setTranslucent(false); //关闭沉浸式
      StatusBar.setBarStyle("dark-content");
      StatusBar.setBackgroundColor("#FFFFFF");
    });
    AccountHelper.accountInfo
      ? (this.state.accountInfo = AccountHelper.accountInfo)
      : AccountHelper.getAccountInfo().then(data => {
          console.log("lfj getAccountInfo", data);
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

        <Text style={styles.feedbackTypeStyle}>请选择意见反馈类型</Text>

        <View style={styles.divider} />
        {/* ============================= CheckBox Groups start ================================== */}
        <View style={styles.checkBoxGroup}>
          <CheckViewWithText
            text={"服务体验"}
            defaultState={this.state.checkBoxGroupStatus[0].isChecked}
            onValueChangeCallback={value => {
              this._checkBoxOnPress(0, value);
            }}
          />
          <CheckViewWithText
            text={"使用操作"}
            defaultState={this.state.checkBoxGroupStatus[1].isChecked}
            onValueChangeCallback={value => {
              this._checkBoxOnPress(1, value);
            }}
          />
          <CheckViewWithText
            text={"其他"}
            defaultState={this.state.checkBoxGroupStatus[2].isChecked}
            onValueChangeCallback={value => {
              this._checkBoxOnPress(2, value);
            }}
          />
        </View>
        {/* ============================= CheckBox Groups end ================================== */}

        {/* ============================= feedback content start ================================== */}
        <View style={styles.feedbackTextInputContainer}>
          <TextInput
            style={styles.feedbackTextInput}
            placeholder={"请输入您的意见反馈内容"}
            multiline={true}
            blurOnSubmit={false}
            maxLength={500}
            selectionColor={"#CCCCCC"}
            onChangeText={text => {
              this._onFeedbackTextContentChange(text);
            }}
            value={this.state.feedbackContentText}
          />
          <Text style={styles.feedbackTextInputTips}>
            {this.state.currentFeedbackContentLength}/{feedbackContentMaxLength}
          </Text>
        </View>
        {/* ============================= feedback content end ================================== */}
        {/* ============================= phone start ================================== */}
        <TextInputWithClearButton
          bodyStyle={{ marginLeft: 18, marginRight: 18 }}
          leftImg={require("../../../res/img/app_feedback_icon_phone.png")}
          multiline={true}
          blurOnSubmit={false}
          keyboardType={"number-pad"}
          selectionColor={"#CCCCCC"}
          maxLength={11}
          placeholder="非必填，请输入常用手机号"
          onChangeText={text => this.setState({ feedbackPhoneNum: text })}
        />
        <Text style={styles.feedbackPhoneTip}>
          留下手机号，便于我们及时与您取得联系
        </Text>
        {/* ============================= phone end ================================== */}
        {/* ============================= commit button start ================================== */}
        <TouchableHighlight
          style={
            this.state.commitEnable
              ? styles.feedbackCommitEnable
              : styles.feedbackCommitDisable
          }
          disabled={this.state.commitEnable ? false : true}
          underlayColor="white"
          onPress={() => {
            if (this._validateData()) {
              this._showConfirm();
            }
          }}
        >
          <Text
            style={
              this.state.commitEnable
                ? styles.feedbackCommitTextEnable
                : styles.feedbackCommitTextDisable
            }
          >
            提交
          </Text>
        </TouchableHighlight>
        {/* ============================= commit button end ================================== */}
        {/* 提交提示框 */}
        <CommonDialog ref="commonDialog" />
      </View>
    );
  }

  //========================= 自定义方法 =================================
  //校验请求数据合法性
  _validateData = () => {
    phoneLength = this.state.feedbackPhoneNum.length;
    if (phoneLength == 0 || phoneLength == 11) {
      return true;
    } else {
      ToastAndroid.show("手机格式不正确", ToastAndroid.SHORT);
      return false;
    }
  };
  //反馈内容文本框回调
  _onFeedbackTextContentChange = text => {
    //判断commit button是否高亮
    let enable =
      text.length > 0 && this.state.checkBoxGroupStatus.length > 0
        ? true
        : false;

    this.setState({
      feedbackContentText: text,
      currentFeedbackContentLength: text.length,
      commitEnable: enable
    });
  };

  //弹窗提示
  _showConfirm() {
    var options = {
      thide: true /*不显示头部标题*/,
      innersHeight: 163,
      messText: "感谢您的宝贵建议，我们将继续努力，为您提供更好服务！",
      messTextStyle: styles.commonDialogContentText,
      buttons: [
        {
          txt: "确定",
          txtStyle: styles.commonDialogBtnContentText,
          btnStyle: styles.commonDialogButton,
          onClick: () => this._onCommonDialogConfirm()
        }
      ]
    };
    this.refs.commonDialog.show(options);
  }
  // 反馈类型item点击事件
  _checkBoxOnPress = (index, value) => {
    let arr = this.state.checkBoxGroupStatus;
    arr[index].isChecked = value;

    let checkBoxEnable = arr[0].isChecked | arr[1].isChecked | arr[2].isChecked;
    let enable = this.state.feedbackContentText.length > 0 && checkBoxEnable;
    this.setState({
      checkBoxGroupStatus: arr,
      commitEnable: enable
    });
  };
  _onCommonDialogConfirm() {
    this.refs.commonDialog.hide();
    let accountInfo = this.state.accountInfo;
    FeedbackHelper.feedBackSubmit({
      accountId: accountInfo.accountId,
      accountName: accountInfo.accountName,
      accountType: accountInfo.accountType,
      contactPhone: this.state.feedbackPhoneNum,
      content: this.state.feedbackContentText,
      feedBackType: this._getFeedBackType(),
      onSuccess: this._onFeedbackCommitSuccess.bind(this),
      onError: this._onFeedbackCommitError.bind(this),
      onFinally: this._onFeedbackCommitFinally.bind(this)
    });
    _navigation.goBack();
  }

  _onFeedbackCommitSuccess = response => {};

  _onFeedbackCommitError = error => {};
  _onFeedbackCommitFinally = () => {};

  _getFeedBackType = () => {
    let array = this.state.checkBoxGroupStatus;
    let result = [];
    for (let i = 0; i < array.length; i++) {
      if (array[i].isChecked === true) {
        result.push(array[i].uploadType);
      }
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    justifyContent: "flex-start",
    flexDirection: "column"
  },
  commonDialogBtnContentText: {
    color: "#F12E49",
    fontSize: 16,
    textAlign: "center",
    textAlignVertical: "center"
  },
  commonDialogContentText: {
    fontSize: 14,
    paddingLeft: 20,
    paddingRight: 12,
    textAlignVertical: "center",
    color: "#666666"
  },
  commonDialogButton: {
    backgroundColor: "white",
    borderTopWidth: 1,
    height: 46,
    flex: 1,
    paddingLeft: 0,
    marginLeft: 0,
    marginRight: 0,
    paddingRight: 0,
    borderTopColor: "#F0F0F0"
  },
  feedbackPhoneContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  feedbackPhoneImg: { marginLeft: 15, height: 15, width: 15, marginRight: 11 },
  feedbackPhoneTip: {
    marginLeft: 15,
    marginTop: 7.5,
    color: "#CCCCCC",
    fontSize: 12
  },
  feedbackCommitDisable: {
    borderRadius: 6,
    height: 42,
    position: "absolute",
    bottom: 20,
    left: 30,
    right: 30,
    backgroundColor: "#DDDDDD",
    justifyContent: "center",
    alignItems: "center"
  },
  feedbackCommitEnable: {
    borderRadius: 6,
    height: 42,
    position: "absolute",
    bottom: 20,
    left: 30,
    right: 30,
    backgroundColor: "#F12E49",
    justifyContent: "center",
    alignItems: "center"
  },
  feedbackCommitTextDisable: {
    color: "#BBBBBB",
    fontSize: 16
  },
  feedbackCommitTextEnable: {
    color: "white",
    fontSize: 16
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
  backButtonStyle: { marginLeft: 20, width: 50 },
  divider: { height: 1, width: "100%", backgroundColor: "#E5E5E5" },
  feedbackPhoneDiver: {
    height: 1,
    marginLeft: 15,
    marginRight: 15,
    width: "100%",
    backgroundColor: "#E5E5E5"
  },
  feedbackTypeStyle: {
    marginLeft: 15,
    marginTop: 17,
    marginBottom: 11,
    color: "#333333",
    fontSize: 14
  },
  checkBoxGroup: {
    flexDirection: "row",
    marginLeft: 15,
    marginRight: 15,
    marginTop: 15,
    justifyContent: "space-between",
    alignItems: "flex-start"
  },
  checkBox: {},
  feedbackTextInputTips: { position: "absolute", bottom: 5, right: 5 },
  feedbackTextInputContainer: {
    borderRadius: 5,
    borderColor: "#E7E7E7",
    borderWidth: 1,
    margin: 15
  },
  feedbackTextInput: {
    height: 90,
    textAlignVertical: "top",
    color: "#666666",
    marginBottom: 10
  },
  button: {
    marginBottom: 30,
    width: 260,
    alignItems: "center",
    backgroundColor: "#2196F3"
  },
  buttonText: {
    padding: 20,
    color: "white"
  }
});
