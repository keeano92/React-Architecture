import React from 'react'
import { Link } from "react-router-dom";
import tractor from '../../assets/images/tractor.gif'

const NotFound = () => {
    return (
        <div className="container">
            <h1>Well this is embarrasing, we cant seem to find the page your looking for.</h1>
            <h2>404 Not Found</h2>
            <div className="container">
                <img src={tractor}/>
            </div>
            <div className="container">
            <Link to="/">GO HOME</Link>
            </div>
        </div>
    )
}

export default NotFound
