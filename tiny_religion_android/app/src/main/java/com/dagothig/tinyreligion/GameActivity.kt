package com.dagothig.tinyreligion

import android.annotation.SuppressLint
import android.app.Activity
import android.os.Bundle
import android.view.ViewGroup
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.viewinterop.AndroidView
import com.dagothig.tinyreligion.ui.theme.TinyReligionTheme
import android.webkit.JavascriptInterface
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalContext
import androidx.core.view.WindowCompat

class GameActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            TinyReligionTheme {
                Greeting("Android")
            }
        }
    }
}

@SuppressLint("SetJavaScriptEnabled")
@Composable
fun Greeting(name: String, modifier: Modifier = Modifier) {
    val activity = LocalContext.current as? Activity
    AndroidView(
        {
            WebView(it).apply {
                val view = this;
                layoutParams = ViewGroup.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.MATCH_PARENT
                )
                settings.javaScriptEnabled = true
                settings.domStorageEnabled = true
                settings.allowContentAccess = true
                settings.allowUniversalAccessFromFileURLs = true
                settings.allowFileAccessFromFileURLs = true
                webViewClient = WebViewClient()
                addJavascriptInterface(object {
                    @JavascriptInterface
                    fun updateStatusTint(tint: Int) {
                        val window = activity?.window
                        if (window != null) {
                            window.statusBarColor = 0xFF000000.toInt() or tint
                            window.navigationBarColor = 0xFF000000.toInt() or tint
                        }
                    }
                }, "android")
            }
        },
        Modifier.fillMaxSize(),
        {
            it.loadUrl("file:///android_asset/index.html")
        }
    )
}

@Preview(showBackground = true)
@Composable
fun GreetingPreview() {
    TinyReligionTheme {
        Greeting("Android")
    }
}