import React, { Component, PureComponent } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import BannerView from "../component/BannerView";
import ListItem from "../component/ListItem";
import { RootView } from "../component/CommonView";
import { fetchRequest } from "../utils/FetchUtil";
import { PullFlatList } from "urn-pull-to-refresh";

let _navigation;
const screenWidth = Dimensions.get("window").width;

export default class StrategyPage extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    _navigation = navigation;
    return {
      title: "咨询攻略",
      headerTitleStyle: { flex: 1, textAlign: "center" }
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      status: "loading",
      showFoot: 0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
      isRefreshing: false, //下拉控制
      showType: 0, //页面展示类型。 0：默认加载中，1，加载完成，显示数据，2，加载失败显示失败页面
      dataSource: [], //
      refreshEnable: true, //是否支持下拉刷新，解决banner左右滑动时与 pullFlatList冲突
      bannerDisplayList: [
        {
          banner:
            "http://udfstest02.10101111.com/ucarudfs/resource/V2/201811/1/6-002dd72a8fa6479d8b5eb14c587d5ec1-g-sr-scale.jpg"
        },
        1,
        {
          banner:
            "http://udfstest.10101111.com/ucarudfs/resource/V2/201901/1/6-09311a61221a42c28c8352cbb5cb740b-g-sr-scale.png"
        },
        {
          banner:
            "http://udfstest02.10101111.com/ucarudfs/resource/V2/201812/1/6-7d6f024a3b7b466eaa0da9aa32ded971-g-sr-scale.jpg"
        }
      ], //头部banner数据源
      hotDisplayList: {}, //热门活动数据源
      latestPublishList: [
        {
          key: "1",
          banner:
            "http://udfstest02.10101111.com/ucarudfs/resource/V2/201811/1/6-002dd72a8fa6479d8b5eb14c587d5ec1-g-sr-scale.jpg",
          publishTimeStr: "2017/05/25",
          businessLine: "1;2;3",
          title: "神州买买车荣获“2017诚信"
        },
        {
          key: "1",
          banner:
            "http://udfstest.10101111.com/ucarudfs/resource/V2/201901/1/6-09311a61221a42c28c8352cbb5cb740b-g-sr-scale.png",
          publishTimeStr: "2017/05/25",
          businessLine: "1;2",
          title: "神州买买车荣获“2017诚信消费品牌”奖"
        },
        {
          key: "1",
          banner: "",
          publishTimeStr: "2017/05/25",
          businessLine: "1",
          title: "神州买买车荣获“2017诚信消费品牌”奖"
        },
        {
          key: "1",
          banner: "",
          publishTimeStr: "2017/05/25",
          businessLine: "1;2",
          title: "神州买买车荣获“2017诚信消费品牌”奖"
        },
        {
          key: "1",
          banner: "",
          publishTimeStr: "2017/05/25",
          businessLine: "1;2",
          title: "神州买买车荣获“2017诚信消费品牌”奖"
        },
        {
          key: "1",
          banner: "",
          publishTimeStr: "2017/05/25",
          businessLine: "1",
          title: "神州买买车荣获“2017诚信消费品牌”奖"
        },
        {
          key: "1",
          banner: "",
          publishTimeStr: "2017/05/25",
          businessLine: "1;2",
          title: "神州买买车荣获“2017诚信消费品牌”奖"
        },
        {
          key: "1",
          banner: "",
          publishTimeStr: "2017/05/25",
          businessLine: "1;2",
          title: "神州买买车荣获“2017诚信消费品牌”奖"
        }
      ], //最新发布数据源

      infos: [
        {
          key: "政策公告",
          icon: require("../../res/img/app_strategy_policy.png")
        },
        {
          key: "营销攻略",
          icon: require("../../res/img/app_strategy_marketing.png")
        },
        {
          key: "神州资讯",
          icon: require("../../res/img/app_strategy_ucar.png")
        },
        {
          key: "业务介绍",
          icon: require("../../res/img/app_strategy_business.png")
        },
        {
          key: "操作指南",
          icon: require("../../res/img/app_strategy_guide.png")
        },
        {
          key: "常见问题",
          icon: require("../../res/img/app_strategy_question.png")
        }
      ]
    };
  }

  componentDidMount() {
    this._navListener = this.props.navigation.addListener("didFocus", () => {
      StatusBar.setTranslucent(true); //开启沉浸式
      StatusBar.setBackgroundColor("transparent");
    });

    this._initData();
  }
  componentWillUnmount = () => {
    this._navListener.remove();
  };

  render() {
    return (
      <RootView
        style={{ flex: 1, backgroundColor: "#F8F8F8" }}
        status={this.state.status}
        failed={{
          tips: "加载失败",
          onPress: () => {
            this.setState({ status: "custom" });
          },
          btnText: "重新加载"
        }}
        custom={this._getCustomView()}
      />
    );
  }

  _getCustomView = () => {
    return (
      <PullFlatList
        ref={c => (this.pull = c)}
        isContentScroll={true}
        refreshable={this.state.refreshEnable}
        style={{ height: "100%", width: screenWidth }}
        onPullRelease={this._onPullRelease}
        data={this.state.dataSource}
        refreshing={this.state.isRefreshing}
        renderItem={({ item, index, separators }) => this._renderItem(item)}
        onTouchStart={e => {
          this.pageX = e.nativeEvent.pageX;
          this.pageY = e.nativeEvent.pageY;
        }}
        onTouchMove={e => {
          if (
            Math.abs(this.pageY - e.nativeEvent.pageY) >
            Math.abs(this.pageX - e.nativeEvent.pageX)
          ) {
            //下拉
            this.setState({ refreshEnable: true });
          } else {
            //左右
            this.setState({ refreshEnable: false });
          }
        }}
      />
    );
  };
  //返回footer
  _renderFooter = () => {};
  //滑动到底部
  _onEndReached = () => {};
  //下拉释放回调
  _onPullRelease = () => {
    this.setState({
      isRefreshing: true //tag,下拉刷新中，加载完全，就设置成flase
    });
    this._fetchData();
  };
  _initData = () => {
    setTimeout(() => {
      this.setState({ status: "custom" });
    }, 300);

    //初始化dataSource数据
    let tempData = this.state.dataSource;
    tempData.push({
      key: "banner",
      data: this.state.bannerDisplayList
    }); //banner图片
    tempData.push({ key: "strategy", data: this.state.infos }); //业务入口
    tempData.push({
      key: "hot",
      data: this.state.hotDisplayList
    }); //热门活动
    tempData.push({
      key: "publish",
      data: this.state.latestPublishList
    }); //热门活动
    this.setState({ dataSource: tempData });
    //TODO 请求网络
    // this._fetchData();
  };

  _fetchData = () => {
    url = "http://www.wanandroid.com/article/list/" + this.state.page + "/json";
    // url = "http://www.wanandroid.com/article/list/" + '/action/cmt/queryExhibitionList';
    fetchRequest(url, "GET")
      .then(responseData => {
        console.log("lfj responseData", responseData);

        // if (responseData.code == 1) {
        let content = responseData.content;
        let operationBannerDisplayList = content.operationBannerDisplayList; //banner list
        let operationHotDisplay = content.operationHotDisplayList[0]; //热门活动
        let operationInfoList = content.operationInfoList; //最新发布
        let tempData = this.state.dataSource;
        tempData.push({
          key: "banner",
          data: operationBannerDisplayList
            ? operationBannerDisplayList
            : this.state.bannerDisplayList
        }); //banner图片
        tempData.push({ key: "strategy", data: this.state.infos }); //业务入口
        tempData.push({
          key: "hot",
          data: operationHotDisplay
            ? operationHotDisplay
            : this.state.hotDisplayList
        }); //热门活动
        tempData.push({
          key: "publish",
          data: operationInfoList
            ? operationInfoList
            : this.state.latestPublishList
        }); //热门活动

        this.setState({
          dataSource: tempData,
          hotDisplayList: operationHotDisplay,
          latestPublishList: operationInfoList,
          bannerDisplayList: operationBannerDisplayList,
          isRefreshing: false
        });
        // } else {
        // }
      })
      .catch(error => {
        console.log(error);
        this.setState({
          status: "loadingFailed",
          isRefreshing: false
        });
      })
      .finally()
      .done();
  };

  _renderItem = item => {
    let data = item.data;
    switch (item.key) {
      case "banner":
        return (
          <BannerView
            style={{ flex: 1 }}
            data={data}
            onBannerItemPress={onBannerItemPress =>
              this._onBannerPress(onBannerItemPress)
            }
          />
        );
        break;
      case "strategy":
        return (
          <View style={styles.strategyList}>
            {this._renderStrategyList(data)}
          </View>
        );
        break;
      case "publish":
        return this._renderLatestPublishItem(data);
        break;
      case "hot":
        return (
          <TouchableOpacity
            onPress={() => {
              this._onHotDisplayPress();
            }}
          >
            <Image
              style={styles.topBusiness}
              resizeMode={"stretch"}
              source={
                data.banner
                  ? { uri: data.banner }
                  : require("../../res/img/app_strategy_banner.png")
              }
            />
          </TouchableOpacity>
        );
        break;

      default:
        break;
    }
  };
  _onBannerPress = item => {
    console.warn("banner item", item);
  };
  _onHotDisplayPress = () => {
    console.warn("hot display", this.state.hotDisplayList);
  };
  _keyExtractor = (item, index) => {
    return item.key;
  };

  _renderStrategyList = dataArray => {
    return dataArray.map((item, index) => {
      return this._renderStrategyListItem({ item });
    });
  };
  //分割线
  _renderLatestPublishItemSeparator = () => {
    return (
      <View
        style={{
          marginLeft: 17,
          alignItems: "center",
          justifyContent: "center",
          marginRight: 13,
          height: 0.5,
          backgroundColor: "#E3E3E3",
          width: "100%"
        }}
      />
    );
  };

  //最新发布头部控件
  _renderLatestPublishHeader = () => {
    return (
      <View>
        <Text style={styles.latestPublishTitle}>最新发布</Text>
        <View
          style={{ height: 1, backgroundColor: "#E5E5E5", width: screenWidth }}
        />
      </View>
    );
  };
  //最新发布flat item
  _renderLatestPublishItem = itemArray => {
    return itemArray.map(item => {
      return (
        <TouchableOpacity
          style={styles.latestPublishIemWithShadow}
          onPress={() => {
            _navigation.navigate("PolicyDetail", { data: item });
          }}
        >
          <Image
            style={{
              width: 100,
              height: 90,
              marginLeft: 15,
              marginTop: 16,
              marginBottom: 15.6
            }}
            resizeMode={"stretch"}
            source={
              item.banner.length > 0
                ? { uri: item.banner }
                : require("../../res/img/swiper_1.jpg")
            }
          />
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "space-between"
            }}
          >
            <Text style={styles.latestPublishIemTitle}>{item.title}</Text>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                marginLeft: 15,
                marginRight: 19
              }}
            >
              {this._getBusinessLineTag(item.businessLine)}
            </View>
            <Text
              style={{
                marginLeft: 15,
                marginBottom: 15.6
              }}
            >
              {item.publishTimeStr}
            </Text>
          </View>
        </TouchableOpacity>
      );
    });
  };

  _getBusinessLineTag = businessLine => {
    let array = businessLine.split(";");
    return array.map((item, index, array) => {
      let img;
      switch (item) {
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
          img = require("../../res/img/icon_app_strategy_4s_finance.png");
          break;

        default:
          break;
      }
      return (
        <Image
          style={{ height: 17, width: 50, marginRight: 5 }}
          resizeMode={"stretch"}
          source={img}
        />
      );
    });
  };

  _renderStrategyListItem = ({ item }) => {
    return (
      <TouchableOpacity
        key={item.key}
        style={styles.strategyListItem}
        onPress={() => this._onStrategyListItemPress(item)}
      >
        <Image
          key={item.key}
          resizeMode={"contain"}
          style={styles.strategyListItemImg}
          source={item.icon}
        />
        <Text style={styles.strategyListItemText}>{item.key}</Text>
      </TouchableOpacity>
    );
  };

  _onStrategyListItemPress = item => {
    _navigation.navigate("PolicyList");
    return;
    switch (item.key) {
      case "政策公告":
        _navigation.navigate("PolicyList");
        break;

      default:
        break;
    }
    console.warn("item press", item);
  };
}
const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: screenWidth,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#F8F8F8"
  },
  banner: {
    width: screenWidth,
    height: 172
  },
  latestPublishIemWithShadow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    backgroundColor: "white"
  },
  latestPublishIemTitle: {
    fontSize: 16,
    marginTop: 16,
    marginRight: 19,
    marginLeft: 15,
    color: "#333333"
  },
  latestPublishTitle: {
    width: screenWidth,
    height: 51.5,
    backgroundColor: "#FFFFFF",
    color: "#333333",
    fontSize: 16,
    marginLeft: 19,
    textAlignVertical: "center",
    textAlign: "left"
  },
  topBusiness: {
    height: 80,
    width: screenWidth,
    marginTop: 10
  },

  strategyList: {
    marginTop: 10,
    width: screenWidth,
    flexWrap: "wrap",
    flexDirection: "row"
  },
  latestPublishList: {
    width: screenWidth,
    marginTop: 10,
    backgroundColor: "#FFFFFF",
    marginBottom: 10
  },
  strategyListItem: {
    width: screenWidth / 3,
    height: 90,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF"
  },
  strategyListItemImg: {
    width: 30,
    height: 30
    // marginTop: 24
  },
  strategyListItemText: {
    color: "#333333",
    marginTop: 8,
    fontSize: 14
  },
  bannerItemShow: { fontSize: 30, color: "green" },
  bannerItemHide: { fontSize: 40, color: "grey" },
  circleWrapperStyle: {
    flexDirection: "row",
    padding: 0,
    backgroundColor: "transparent",
    bottom: 0,
    position: "absolute"
  }
});