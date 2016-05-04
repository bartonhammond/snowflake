package com.burnweb.rnsimplealertdialog;

import android.util.Log;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;

import java.util.Map;
import java.util.HashMap;

public class RNSimpleAlertDialogModule extends ReactContextBaseJavaModule {

    private static final String TAG = RNSimpleAlertDialogModule.class.getSimpleName();
    private static final String POSITIVE_BUTTON_KEY = "POSITIVE_BUTTON";
    private static final String NEGATIVE_BUTTON_KEY = "NEGATIVE_BUTTON";
    private static final String NEUTRAL_BUTTON_KEY = "NEUTRAL_BUTTON";

    private Activity mActivity = null;

    public RNSimpleAlertDialogModule(ReactApplicationContext reactContext, Activity mActivity) {
      super(reactContext);

      this.mActivity = mActivity;
    }

    @Override
    public String getName() {
      return "SimpleAlertAndroid";
    }

    @Override
    public Map<String, Object> getConstants() {
      final Map<String, Object> constants = new HashMap<>();
      constants.put(POSITIVE_BUTTON_KEY, POSITIVE_BUTTON_KEY);
      constants.put(NEGATIVE_BUTTON_KEY, NEGATIVE_BUTTON_KEY);
      constants.put(NEUTRAL_BUTTON_KEY, NEUTRAL_BUTTON_KEY);
      return constants;
    }

    @ReactMethod
    public void alert(final String title, final String message, final ReadableArray buttonConfig, final Callback buttonsCallback) {
      AlertDialog.Builder builder = new AlertDialog.Builder(this.mActivity);

      if(title != null) builder.setTitle(title);
      if(message != null) builder.setMessage(message);

      if(buttonConfig != null && buttonConfig.size() > 0) {
        for (int i = 0; i<buttonConfig.size(); i++) {
          ReadableMap button = buttonConfig.getMap(i);
          if(button != null && button.hasKey("type") && button.hasKey("text")) {
            switch(button.getString("type")) {
              case NEGATIVE_BUTTON_KEY:
                builder.setNegativeButton(button.getString("text"), new DialogInterface.OnClickListener() {
                   public void onClick(DialogInterface dialog, int id) {
                       if(buttonsCallback != null) buttonsCallback.invoke(NEGATIVE_BUTTON_KEY);
                   }
                });
                break;
              case NEUTRAL_BUTTON_KEY:
                builder.setNeutralButton(button.getString("text"), new DialogInterface.OnClickListener() {
                   public void onClick(DialogInterface dialog, int id) {
                       if(buttonsCallback != null) buttonsCallback.invoke(NEUTRAL_BUTTON_KEY);
                   }
                });
                break;
              default:
                builder.setPositiveButton(button.getString("text"), new DialogInterface.OnClickListener() {
                   public void onClick(DialogInterface dialog, int id) {
                       if(buttonsCallback != null) buttonsCallback.invoke(POSITIVE_BUTTON_KEY);
                   }
                });
                break;
            }
          }
        }
      }

      AlertDialog ad = builder.create();
      ad.show();
    }

}
