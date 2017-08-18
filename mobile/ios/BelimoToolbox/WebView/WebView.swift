//
//  WebView.swift
//  BelimoToolbox
//
//  Created by Viktor Baranov on 25/03/16.
//  Copyright © 2016 Viktor Baranov. All rights reserved.
//

import UIKit
import WebKit
import Font_Awesome_Swift

import MessageUI
import SafariServices


class WebViewController : UIViewController, MFMailComposeViewControllerDelegate {
    @IBOutlet weak var webView : WebView!
    @IBOutlet weak var errorView : ErrorView!
    @IBOutlet weak var topbarView : UIView!
    @IBOutlet weak var toolbarView : UIView!
    @IBOutlet weak var homeButton : UIButton!
    @IBOutlet weak var reloadButton : UIButton!
    @IBOutlet weak var stopButton : UIButton!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        if self.errorView.superview == nil {
            self.webView.addSubview(self.errorView)
        }
        errorView?.hide(animated: false)
        errorView?.reloadHandler = { [weak self] in
            self?.reloadPage()
        }
        
        setupWebView()
        useFontAwesomeToolbar()
        let topInset = topbarView.bounds.size.height
        let bottomInset = toolbarView.bounds.size.height
        webView.setInsets(UIEdgeInsetsMake(topInset, 0.0, bottomInset, 0.0))
    }
    
    func useFontAwesomeToolbar() {
        homeButton?.setFAIcon(icon: FAType.FAHome, iconSize: 25, forState: .normal)
        reloadButton?.setFAIcon(icon: FAType.FARefresh, iconSize: 25, forState: .normal)
        stopButton?.setFAIcon(icon: FAType.FARemove, iconSize: 25, forState: .normal)
    }
    
    // MARK: reload page
    
    func reloadPage() {
        self.webView.reload()
    }
    
    // MARK: toolbar
    
    func updateToolbar() {
        if webView.isLoading() {
            reloadButton.isHidden = true
            stopButton.isHidden = false
        } else {
            reloadButton.isHidden = false
            stopButton.isHidden = true
        }
    }
    
    // MARK: - WebView
    
    func setupWebView() {
        webView.parentViewController = self
        webView.homeURL = URL(string: UrlManager.homeUrlString())!
        
        webView.onPageStartLoad = { [weak self] webView in
            self?.errorView?.hide()
        }
        webView.onPageFinishLoad = { [weak self] (webView, error) in
            if let error = error {
                if error.domain == NSURLErrorDomain {
                    switch error.code {
                    case NSURLErrorNetworkConnectionLost,
                         NSURLErrorNotConnectedToInternet:
                        self?.displayErrorView(error)
                        break;
                    default:
                        self?.displayErrorAlert(title: nil, message: error.localizedDescription)
                        break
                    }
                }
                else {
                    self?.displayErrorAlert(title: nil, message: error.localizedDescription)
                }
            }
        }
        webView.onPagePrint = { [weak self] (webView, printFormatter) in
            self?.displayPrintDialog(printFormatter: printFormatter)
        }
        webView.onSendMail = { [weak self] (webView, url) in
            if UIApplication.shared.canOpenURL(url) {
                UIApplication.shared.openURL(url)
            } else {
                self?.displayErrorAlert(title: NSLocalizedString("Cannot use your E-Mail account",
                        tableName: "WebView",
                        comment: "Email account not found: Error alert's title"),
                    message: NSLocalizedString("Please configure an E-Mail account at your device",
                        tableName: "WebView",
                        comment: "Email account not found: Error alert's message")
                )
            }
        }
        if #available(iOS 9.0, *) {
            webView.onShowPDF = { [weak self] (webView, url) in
                let vc = SFSafariViewController(url: url)
                self?.present(vc, animated: true, completion: nil)
            }
        } else {
            webView.onShowPDF = { (webView, url) in
                if UIApplication.shared.canOpenURL(url) {
                    UIApplication.shared.openURL(url)
                }
            }
        }
    }
    
    // MARK: handle errors
    
    func displayErrorView(_ error: NSError?) {
        self.errorView?.show(text: error?.localizedDescription)
    }
    
    func displayErrorAlert(title: String?, message: String) {
        guard let title = title else {
            self.displayErrorAlert(title: NSLocalizedString("Error", tableName: "WebView", comment: "Unknow error - alert message"), message: message)
            return
        }
        
        let alert = UIAlertController(title: title, message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: NSLocalizedString("OK", tableName: "WebView", comment: "Alert button - OK"), style: .default, handler: nil))
        present(alert, animated: true, completion: nil)
    }
    
    // MARK: print dialog
    
    func displayPrintDialog(printFormatter : UIViewPrintFormatter) {
        let printController = UIPrintInteractionController.shared
        
        let renderer: UIPrintPageRenderer = UIPrintPageRenderer()
        renderer.addPrintFormatter(printFormatter, startingAtPageAt: 0)
        printController.printPageRenderer = renderer
        
        if (UIDevice.current.userInterfaceIdiom == .pad) {
            printController.present(from: self.view.bounds, in: self.view, animated: false, completionHandler: nil)
        } else {
            printController.present(animated: true, completionHandler: nil)
        }
    }
    
    // MARK: mail composer
    
    func mailComposeController(_ controller: MFMailComposeViewController, didFinishWith result: MFMailComposeResult, error: Error?) {
        controller.dismiss(animated: true, completion: nil)
    }
}

class WebView: UIView, WKNavigationDelegate, WKScriptMessageHandler {
    var parentViewController : WebViewController?
    
    var onPageStartLoad : ((WebView) -> Void)?
    var onPageFinishLoad : ((WebView, NSError?) -> Void)?
    var onPagePrint : ((WebView, UIViewPrintFormatter) -> Void)?
    var onSendMail : ((WebView, URL) -> Void)?
    var onShowPDF : ((WebView, URL) -> Void)?
    
    @IBOutlet weak var progressView : UIProgressView!
    
    var webView = WKWebView()
    var homeURL : URL? {
        didSet {
            goHome()
        }
    }
    var connectionWasLost : Bool = true
    
    // MARK: setup, deinit
    
    deinit {
        webView.removeObserver(self, forKeyPath: "estimatedProgress")
        webView.removeObserver(self, forKeyPath: "loading")
    }
    
    func setInsets(_ insets: UIEdgeInsets) {
        webView.scrollView.contentInset = insets
        webView.scrollView.scrollIndicatorInsets = insets
    }
    
    override func awakeFromNib() {
        super.awakeFromNib()
        setupWebView()
    }
    
    func setupWebView() {
        let theConfiguration = WKWebViewConfiguration()
        theConfiguration.userContentController.add(self, name: "ios")
        
        webView = WKWebView(frame: self.bounds, configuration: theConfiguration)
        webView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        webView.translatesAutoresizingMaskIntoConstraints = true
        webView.addObserver(self, forKeyPath: "estimatedProgress", options: .new, context: nil)
        webView.addObserver(self, forKeyPath: "loading", options: .new, context: nil)
        webView.navigationDelegate = self

        self.addSubview(webView)
        self.sendSubview(toBack: webView)
    }
    
    // MARK: track loading progress
    
    override func observeValue(forKeyPath keyPath: String?,
                                         of object: Any?,
                                                  change: [NSKeyValueChangeKey : Any]?,
                                                  context: UnsafeMutableRawPointer?) {
        if let keyPath = keyPath {
            switch keyPath {
            case "estimatedProgress":
                updateProgressView()
                break
            case "loading":
                parentViewController?.updateToolbar()
                break
            default:
                break
            }
        }
    }
    
    func updateProgressView() {
        var animated = true
        let hidden = !self.isLoading()
        if hidden != progressView.isHidden {
            progressView.isHidden = hidden
            animated = false
        }
        progressView.setProgress(Float(webView.estimatedProgress), animated: animated)
    }
    
    // MARK: javascript messages
    
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage){
        if let messageString = (message.body as? String) {
            switch messageString {
            case "print":
                self.onPagePrint?(self, webView.viewPrintFormatter())
                break
            default:
                break
            }
        }
    }
    
    func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        if navigationAction.request.url?.scheme == "mailto" {
            onSendMail?(self, navigationAction.request.url!)
            decisionHandler(WKNavigationActionPolicy.cancel)
        } else if onShowPDF != nil && navigationAction.request.url?.pathExtension == "pdf" {
            onShowPDF?(self, navigationAction.request.url!)
            decisionHandler(WKNavigationActionPolicy.cancel)
        }
        decisionHandler(WKNavigationActionPolicy.allow)
    }
    
    func webView(_ webView: WKWebView, didCommit navigation: WKNavigation!) {
        updateProgressView()
        onPageStartLoad?(self)
    }
    
    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        updateProgressView()
        if error._domain == NSURLErrorDomain && error._code == NSURLErrorCancelled {
            onPageFinishLoad?(self, nil)
        } else {
            onPageFinishLoad?(self, error as NSError?)
        }
    }
    
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        updateProgressView()
        onPageFinishLoad?(self, nil)
    }
    
    
    
    // MARK: main actions
    
    @IBAction func goHome() {
        openURL(homeURL!)
    }
    
    @IBAction func openBelimoInSafari() {
        UIApplication.shared.openURL(
            URL(string:
                NSLocalizedString("http://belimo.eu",
                    tableName: "WebView",
                    comment: "Belimo Website URL")
                )!
        )
    }
    
    func openURL(_ url: URL) {
        webView.load(URLRequest(url:url))
    }
    
    @IBAction func reload() {
        if webView.url != nil {
            webView.reload()
        } else {
            goHome()
        }
    }
    
    @IBAction func stopLoading() {
        webView.stopLoading()
    }
    
    func isLoading() -> Bool {
        return webView.isLoading && webView.estimatedProgress < 1.0
    }
}
