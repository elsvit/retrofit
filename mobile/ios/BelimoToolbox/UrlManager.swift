//
//  UrlManager.swift
//  Belimo Toolbox
//
//  Created by Alexander Songolov on 25.04.16.
//  Copyright © 2016 Viktor Baranov. All rights reserved.
//

import Foundation

class UrlManager {
    fileprivate static let defaultUrlString = "http://toolbox.belimo.xiag.ch/"
    
    fileprivate static func definedUrlString() -> String? {
        return Bundle.main.infoDictionary?["HomePageURL"] as? String
    }
    
    fileprivate static func urlString() -> String {
        if let urlString = definedUrlString() {
            return urlString
        } else {
            return defaultUrlString
        }
    }
    
    static func homeUrlString() -> String {
        return urlString() + "?lang=" + preferredLanguage()
    }
    
    static func preferredLanguage() -> String { // e.g. 'de-CH', 'en-RU', ...
        return Locale.preferredLanguages.first!
    }
}
