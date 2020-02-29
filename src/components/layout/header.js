import React, { Component } from "react";
import { Link } from "react-router-dom";
import logo from '../../assets/images/Toplogo.png'

export default class header extends Component {
    render() {
        return (
            <div className="">
                <nav className="">
                    <Link to="/"><img style={{ "height": "100%", "width": "100%" }} src={logo}></img></Link>
                </nav>
            </div>
        )
    }
}

export { header }
