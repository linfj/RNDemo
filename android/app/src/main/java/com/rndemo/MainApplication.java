package com.rndemo;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.sz.rn.network.RNNetworkPackage;
import com.hzl.pulltorefresh.RefreshReactPackage;
import fr.greweb.reactnativeviewshot.RNViewShotPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.rnfs.RNFSPackage;
import com.horcrux.svg.SvgPackage;
import com.hzl.pulltorefresh.RefreshReactPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(new MainReactPackage(), new RNNetworkPackage(), new RefreshReactPackage(),
          new RNViewShotPackage(), new RNFetchBlobPackage(), new RNFSPackage(), new SvgPackage(),
          new RefreshReactPackage(), new RNGestureHandlerPackage());
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
