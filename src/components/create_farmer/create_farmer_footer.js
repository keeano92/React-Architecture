import React from 'react'
import { Link } from "react-router-dom";

function CreateFarmerFooter() {
    return (
        <div className="footer-container">
            <div className="footer_about_text">
                Already have an account?
            </div>
            <div className="footer_action">
                <div className="footer_action_text">
                    <Link to="/login">Login</Link>
                </div>
            </div>
        </div>
    )
}

export default CreateFarmerFooter 