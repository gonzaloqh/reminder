package com.reminder.app;

import com.getcapacitor.BridgeActivity;
import android.os.Bundle;
import com.getcapacitor.community.speechrecognition.SpeechRecognition;

public class MainActivity extends BridgeActivity {
    public void oncreate(Bundle savedInstanceState) {
        registerPlugin(SpeechRecognition.class);
    }
}