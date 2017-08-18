//
//  SplashViewController.swift
//  Belimo Toolbox
//
//  Created by Alexander Songolov on 15.06.16.
//  Copyright © 2016 XIAG AG. All rights reserved.
//

import Foundation
import UIKit


let splashDurationTime = 2.0
let splashHideTime = 0.25


class SplashView: UIView {
    @IBOutlet weak var activityIndicator: UIActivityIndicatorView!
    @IBOutlet weak var sloganTextLabel: UILabel!
    
    override func awakeFromNib() {
        super.awakeFromNib()
        self.sloganTextLabel.text = NSLocalizedString("SplashScreen.slogan_text", tableName: "TargetLocalizable", comment: "Slogan text for current app")
    }
}


class SplashViewController: UIViewController {
    @IBOutlet weak var splashContainer : UIView!

    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        guard splashContainer != nil else { return }

        UIView.animate(withDuration: splashHideTime, delay: splashDurationTime, options: UIViewAnimationOptions(), animations: {
            self.splashContainer.alpha = 0.0;
        }) { (Bool) in
            self.splashContainer.removeFromSuperview()
            self.splashContainer = nil;
        }
    }
}
