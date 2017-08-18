/**
 * Print from web, Android and iOS
 */
function printFn() {
    window.print();
    if (typeof Android !== 'undefined') {
        Android.print();
    }
    if (typeof window.webkit !== 'undefined' && typeof window.webkit.messageHandlers.ios !== 'undefined') {
        window.webkit.messageHandlers.ios.postMessage('print');
    }
}

export default printFn;
