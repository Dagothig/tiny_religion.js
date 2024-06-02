package com.dagothig.tinyreligion

import android.annotation.SuppressLint
import android.app.Activity
import android.os.Bundle
import android.view.ViewGroup
import android.webkit.ConsoleMessage
import android.webkit.WebView
import android.webkit.WebViewClient
import android.webkit.JavascriptInterface
import android.webkit.WebChromeClient
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import androidx.webkit.WebViewAssetLoader
import java.util.Locale
import android.graphics.Rect
import android.view.WindowManager
import androidx.core.content.ContextCompat
import androidx.core.splashscreen.SplashScreen
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import kotlin.math.ceil

class GameActivity : Activity() {

    private var webView: WebView? = null
    private val safe: Rect = Rect()

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        installSplashScreen()

        super.onCreate(savedInstanceState)

        val webView = WebView(this)
        this.webView = webView

        webView.setBackgroundColor(ContextCompat.getColor(this, R.color.god))
        webView.layoutParams = ViewGroup.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.MATCH_PARENT
        )

        webView.settings.javaScriptEnabled = true
        webView.settings.domStorageEnabled = true
        webView.settings.allowContentAccess = true
        webView.settings.mediaPlaybackRequiresUserGesture = false
        val assetLoader = WebViewAssetLoader.Builder()
            .setDomain("localhost")
            .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(this))
            .addPathHandler("/", WebViewAssetLoader.AssetsPathHandler(this))
            .build()

        webView.webViewClient = object : WebViewClient() {
            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                updSafe()
            }

            override fun shouldInterceptRequest(view: WebView, request: WebResourceRequest): WebResourceResponse {
                try {
                    return assetLoader.shouldInterceptRequest(request.url)!!
                } catch (err: Exception) {
                    android.util.Log.d("Game", request.url.toString())
                    throw err
                }
            }

            override fun onReceivedError(view: WebView?, request: WebResourceRequest?, error: WebResourceError?) {
                android.util.Log.d("Game", error?.toString() ?: "")
                super.onReceivedError(view, request, error)
            }
        }
        webView.webChromeClient = object : WebChromeClient() {
            override fun onConsoleMessage(consoleMessage: ConsoleMessage?): Boolean {
                android.util.Log.d("Game", consoleMessage?.message() ?: "")
                return true
            }
        }

        webView.addJavascriptInterface(object {
            @JavascriptInterface
            fun updateStatusTint(tint: Int) {
                runOnUiThread {
                    window?.statusBarColor = 0xFF000000.toInt() or tint
                    window?.navigationBarColor = 0xFF000000.toInt() or tint
                }
            }

            @JavascriptInterface
            fun getLanguage(): String {
                return Locale.getDefault().language.substring(0, 2)
            }

            @JavascriptInterface
            fun shouldSplash(): Boolean {
                return false
            }
        }, "app")

        webView.loadUrl("https://localhost/assets/index.html")

        ViewCompat.setOnApplyWindowInsetsListener(window.decorView.rootView) { v, insets ->
            val safeInsets = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            val density = resources.displayMetrics.density.toDouble()
            safe.top = ceil(safeInsets.top / density).toInt()
            safe.left = ceil(safeInsets.left / density).toInt()
            safe.right = ceil(safeInsets.right / density).toInt()
            safe.bottom = ceil(safeInsets.bottom / density).toInt()
            updSafe()
            ViewCompat.onApplyWindowInsets(v, insets)
        }

        window.setFlags(
            WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
            WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS)

        setContentView(webView)
    }

    private fun updSafe() {
        webView?.evaluateJavascript("""
            document.body.style.setProperty("--safe_margin_left", "${ safe.left }px")
            document.body.style.setProperty("--safe_margin_top", "${ safe.top }px")
            document.body.style.setProperty("--safe_margin_right", "${ safe.right }px")
            document.body.style.setProperty("--safe_margin_bottom", "${ safe.bottom }px")
        """.trimIndent()) {}
    }

    override fun onPause() {
        webView?.evaluateJavascript("pause(focusPause);") {}
        webView?.pauseTimers()
        webView?.onPause()
        super.onPause()
    }

    override fun onResume() {
        super.onResume()
        webView?.onResume()
        webView?.resumeTimers()
        webView?.evaluateJavascript("resume(focusPause);") {}
        webView?.evaluateJavascript("saveStorage.removeItem('saveTemp');") {}
    }

    override fun onSaveInstanceState(outState: Bundle) {
        webView?.evaluateJavascript("saveTemp();") {}
        super.onSaveInstanceState(outState)
    }

    override fun onRestoreInstanceState(savedInstanceState: Bundle) {
        super.onRestoreInstanceState(savedInstanceState)
        webView?.evaluateJavascript("restoreTemp();") {}
    }
}
