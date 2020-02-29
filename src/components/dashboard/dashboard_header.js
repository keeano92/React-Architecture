import React from "react";
import { Link } from "react-router-dom";
import logo from '../../assets/images/Toplogo.png'

function DashboardHeader() {
        return (
            <div className="">
                <nav className="container">
                    <Link to="/"><img style={{ "height": "50%", "width": "50%" }} src={logo}></img></Link>
                </nav>
            </div>
        )
}

export default DashboardHeader