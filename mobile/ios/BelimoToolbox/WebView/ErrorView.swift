//
//  ErrorView.swift
//  Belimo Toolbox
//
//  Created by Alexander Songolov on 22.04.16.
//  Copyright © 2016 Viktor Baranov. All rights reserved.
//

import UIKit

class ErrorView: UIView {
    @IBOutlet weak var boxView : UIView!
    @IBOutlet weak var textLabel : UILabel!
    
    var reloadHandler : ((Void) -> Void)?

    override func awakeFromNib() {
        super.awakeFromNib()

        self.boxView.layer.cornerRadius = 20.0
        self.boxView.layer.borderWidth = 2.0
        self.boxView.layer.borderColor = UIColor.lightGray.cgColor
    }

    @IBAction func reloadButtonPressed() {
        self.reloadHandler?()
    }

    @IBAction func ignoreButtonPressed() {
        self.hide()
    }

    // MARK: show/hide
    
    let animationDuration : TimeInterval = 0.2
    
    func isVisible() -> Bool {
        return self.alpha > 0.05
    }

    func show(text: String?, animated: Bool = true) {
        let changes = {
            self.alpha = 1.0
        }
        if text != nil && text!.characters.count > 0 {
            self.textLabel.text = text!
        }
        if animated {
            UIView.animate(withDuration: animationDuration, animations: changes)
        } else {
            changes()
        }
    }

    func hide(animated: Bool = true) {
        let changes = {
            self.alpha = 0.0
        }
        if animated {
            UIView.animate(withDuration: animationDuration, animations:changes)
        } else {
            changes()
        }
    }
}
