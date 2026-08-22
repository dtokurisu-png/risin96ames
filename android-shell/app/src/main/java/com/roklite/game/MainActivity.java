package com.roklite.game;

import android.app.Activity;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.CookieManager;
import android.webkit.MimeTypeMap;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLConnection;
import java.util.Collections;
import java.util.Locale;

public class MainActivity extends Activity {
    private static final String LOCAL_HOST = "rok.local";
    private static final String ASSET_ROOT = "rock_html_base/";
    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        applyImmersiveMode();

        webView = new WebView(this);
        webView.setBackgroundColor(Color.rgb(5, 7, 11));
        setContentView(webView);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setUserAgentString(settings.getUserAgentString() + " ROKLiteAndroid/9.45");

        CookieManager.getInstance().setAcceptCookie(true);
        CookieManager.getInstance().setAcceptThirdPartyCookies(webView, true);

        webView.setWebChromeClient(new WebChromeClient());
        webView.setWebViewClient(new LocalAssetWebViewClient());
        WebView.setWebContentsDebuggingEnabled(false);

        if (savedInstanceState == null) {
            webView.loadUrl("https://" + LOCAL_HOST + "/index.html");
        } else {
            webView.restoreState(savedInstanceState);
        }
    }

    private void applyImmersiveMode() {
        getWindow().getDecorView().setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                        | View.SYSTEM_UI_FLAG_FULLSCREEN
                        | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                        | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
        );
    }

    @Override
    protected void onResume() {
        super.onResume();
        applyImmersiveMode();
        if (webView != null) webView.onResume();
    }

    @Override
    protected void onPause() {
        if (webView != null) webView.onPause();
        super.onPause();
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        if (webView != null) webView.saveState(outState);
        super.onSaveInstanceState(outState);
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) webView.goBack();
        else super.onBackPressed();
    }

    private final class LocalAssetWebViewClient extends WebViewClient {
        @Override
        public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
            Uri uri = request.getUrl();
            if (!LOCAL_HOST.equalsIgnoreCase(uri.getHost())) return null;
            return assetResponse(uri);
        }

        @Override
        @SuppressWarnings("deprecation")
        public WebResourceResponse shouldInterceptRequest(WebView view, String url) {
            Uri uri = Uri.parse(url);
            if (!LOCAL_HOST.equalsIgnoreCase(uri.getHost())) return null;
            return assetResponse(uri);
        }

        private WebResourceResponse assetResponse(Uri uri) {
            String path = uri.getPath();
            if (path == null || path.isEmpty() || "/".equals(path)) path = "/index.html";
            while (path.startsWith("/")) path = path.substring(1);
            if (path.contains("..")) return notFound();

            try {
                InputStream stream = getAssets().open(ASSET_ROOT + path);
                String mime = guessMime(path);
                String encoding = isTextMime(mime) ? "UTF-8" : null;
                return new WebResourceResponse(mime, encoding, stream);
            } catch (IOException ex) {
                return notFound();
            }
        }

        private WebResourceResponse notFound() {
            return new WebResourceResponse(
                    "text/plain",
                    "UTF-8",
                    404,
                    "Not Found",
                    Collections.singletonMap("Cache-Control", "no-store"),
                    new ByteArrayInputStream(new byte[0])
            );
        }

        private String guessMime(String path) {
            String lower = path.toLowerCase(Locale.US);
            if (lower.endsWith(".js") || lower.endsWith(".mjs")) return "application/javascript";
            if (lower.endsWith(".css")) return "text/css";
            if (lower.endsWith(".html") || lower.endsWith(".htm")) return "text/html";
            if (lower.endsWith(".json")) return "application/json";
            if (lower.endsWith(".webmanifest")) return "application/manifest+json";
            if (lower.endsWith(".svg")) return "image/svg+xml";
            if (lower.endsWith(".webp")) return "image/webp";
            if (lower.endsWith(".woff2")) return "font/woff2";
            if (lower.endsWith(".woff")) return "font/woff";
            if (lower.endsWith(".ttf")) return "font/ttf";
            if (lower.endsWith(".csv")) return "text/csv";
            if (lower.endsWith(".txt")) return "text/plain";
            String byName = URLConnection.guessContentTypeFromName(path);
            if (byName != null) return byName;
            String ext = MimeTypeMap.getFileExtensionFromUrl(path);
            String byExt = MimeTypeMap.getSingleton().getMimeTypeFromExtension(ext);
            return byExt != null ? byExt : "application/octet-stream";
        }

        private boolean isTextMime(String mime) {
            return mime.startsWith("text/")
                    || mime.contains("javascript")
                    || mime.contains("json")
                    || mime.contains("manifest")
                    || mime.contains("svg");
        }
    }
}
