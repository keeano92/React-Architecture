/* eslint-disable react/prop-types */
import React from 'react'
import { Link } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import blue from '@material-ui/core/colors/blue'
import profile_pic from '../../assets/images/profile_image_placeholder.jpg'

const theme = createMuiTheme({
    palette: {
        primary: blue
    }
})

function FarmProfileHeader(props) {
    return (
        <ThemeProvider theme={theme}>
            <div className="backbutton">
                <Button
                    component={Link}
                    to="/"
                    style={{
                        width: "150px",
                        borderRadius: "3px",
                        letterSpacing: "1.5px",
                        marginTop: "1rem"
                    }}
                >
                    <ArrowBackIcon color="primary" fontSize="large" />
                </Button>
            </div>
            <div className="container market-header">
                Farm Profile
        </div>
            <div className="profile_pic_container">
                <img height="232px" width="375" src={props.profilePic}></img>
            </div>
        </ThemeProvider>
    )
}

export default FarmProfileHeader
