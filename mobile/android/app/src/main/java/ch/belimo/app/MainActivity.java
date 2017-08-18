package ch.belimo.app;

import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.ActivityInfo;
import android.content.res.Configuration;
import android.net.Uri;
import android.os.Bundle;
import android.print.PrintAttributes;
import android.print.PrintDocumentAdapter;
import android.print.PrintManager;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import android.widget.ImageButton;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import com.crashlytics.android.Crashlytics;

import ch.belimo.retrofit.R;
import io.fabric.sdk.android.Fabric;

public class MainActivity extends AppCompatActivity implements MyWebView.WebViewListener, NetworkStateReceiver.NetworkStateReceiverListener{

    private MyWebView webView;
    private RelativeLayout errorView;
    private NetworkStateReceiver networkStateReceiver;
    private Boolean connectionWasLost;
    private ProgressBar progressBar;
    private ImageButton reloadStopButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        overridePendingTransition(R.anim.fade_in, R.anim.fade_out);
        super.onCreate(savedInstanceState);
        Fabric.with(this, new Crashlytics());
        setContentView(R.layout.activity_main);

        if (!isTablet(this)) {
            setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
        }

        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        progressBar = (ProgressBar) findViewById(R.id.pb_horizontal);
        reloadStopButton = (ImageButton) findViewById(R.id.reloadStopButton);

        webView = (MyWebView) findViewById(R.id.myWebView);
        if (webView != null) {
            webView.init();
            webView.addListener(this);
            webView.addJavascriptInterface(new WebAppInterface(), "Android");
            webView.homeURL = getString(R.string.home_url);
            webView.goHome();
        }

        connectionWasLost = false;
        networkStateReceiver = new NetworkStateReceiver();
        networkStateReceiver.addListener(this);
        this.registerReceiver(networkStateReceiver, new IntentFilter(android.net.ConnectivityManager.CONNECTIVITY_ACTION));

        errorView = (RelativeLayout) findViewById(R.id.errorView);
        if (errorView != null) {
            webView.bringToFront();
        }

    }

    private class WebAppInterface {
        @JavascriptInterface
        public void print() {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    createWebPrintJob(webView);
                }
            });
        }
    }

    @SuppressWarnings("deprecation")
    private void createWebPrintJob(WebView webView) {
        PrintManager printManager = (PrintManager) this.getSystemService(Context.PRINT_SERVICE);
        PrintDocumentAdapter printAdapter = webView.createPrintDocumentAdapter();
        String jobName = getString(R.string.app_name) + " Print Test";
        printManager.print(jobName, printAdapter,new PrintAttributes.Builder().build());
    }

    private static boolean isTablet(Context context) {
        return (context.getResources().getConfiguration().screenLayout
                & Configuration.SCREENLAYOUT_SIZE_MASK)
                >= Configuration.SCREENLAYOUT_SIZE_LARGE;
    }

    @Override
    public void progressChanged(int progress) {
        progressBar.setProgress(progress);
        if (progress == 100) {
            progressBar.setProgress(0);
        }
    }

    @Override
    public void pageStarted() {
        setWebAndErrorViewAlpha(0);
        progressBar.setAlpha(1);
        reloadStopButton.setImageResource(R.mipmap.stop);
        reloadStopButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                webView.stopLoading();
            }
        });
    }

    @Override
    public void pageFinished() {
        setWebAndErrorViewAlpha(1);
        progressBar.setAlpha(0);
        reloadStopButton.setImageResource(R.mipmap.reload);
        reloadStopButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                reload(webView);
            }
        });
    }

    @Override
    public void loadWithError(int errorCode, String description, String failingUrl) {
        if (webView.isOnline()) {
            webView.showError(this, errorCode);
        } else {
            if (!connectionWasLost) {
                connectionWasLost = true;
                errorView.bringToFront();
            }
        }
    }

    private void setWebAndErrorViewAlpha(float alpha) {
        webView.setAlpha(alpha);
        errorView.setAlpha(alpha);
    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    public void home(View v) {
        webView.goHome();
    }

    public void reload(View v) {
        webView.reload();
    }

    public void openBelimoWebsite(View v) {
        Intent browserIntent = new Intent(Intent.ACTION_VIEW, Uri.parse("http://belimo.eu"));
        startActivity(browserIntent);
    }

    @Override
    public void networkAvailable() {
        if (connectionWasLost) {
            webView.bringToFront();
            webView.reload();
            connectionWasLost = false;
        }
    }

    @Override
    protected void onDestroy() {
        this.unregisterReceiver(networkStateReceiver);
        super.onDestroy();
    }
}
