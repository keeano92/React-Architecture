import React from 'react'
import { Link } from "react-router-dom";

function LoginFooter() {
    return (
        <div className="footer-container">
            <div className="footer_about_text">
                Still need an account?
            </div>
            <div className="footer_action">
                <div className="footer_action_text">
                    <Link to="/register">SIGN UP</Link>
                </div>
            </div>
        </div>
    )
}

export { LoginFooter }
