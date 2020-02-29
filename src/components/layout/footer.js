import React from 'react'
import { Link } from "react-router-dom";

function footer() {
    return (
        <div className="footer-container">
            <div className="footer_about_text">
                Still need an account?
            </div>
            <div className="footer_action">
                <div className="footer_action_text">
                    <Link to="/createFarmer">Do you want to sell on Farm Estar?</Link>
                </div>
            </div>
        </div>
    )
}

export { footer }
