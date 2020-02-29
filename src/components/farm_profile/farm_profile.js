/* eslint-disable react/prop-types */
import React, { Component } from 'react'
import propTypes from 'prop-types'
import { connect } from 'react-redux'
import './farm_profile.css'
import { convertToBoolean } from '../../utils/setAuthToken'
import Button from '@material-ui/core/Button'
import GoogleMapReact from 'google-map-react'
import classnames from 'classnames'
import Modal from 'react-responsive-modal'
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import LibraryAddIcon from '@material-ui/icons/LibraryAdd'
import AccessTimeIcon from '@material-ui/icons/AccessTime'

//Import Actions
import { toProduce, toListProduce } from '../../actions/authActions'

//Map Configure
const Marker = ({ text }) => <div>{text}</div>

const theme = createMuiTheme({
    palette: {
        common: {
            black: 'rgba(38, 153, 251, 1)',
            white: '#fff',
            grey: 'rgb(128,128,128)'
        },
        background: {
            paper: 'rgba(38, 153, 251, 0)',
            default: 'rgba(38, 153, 251, 0)'
        },
        primary: {
            light: 'rgba(38, 153, 251, 1)',
            main: 'rgba(38, 153, 251, 1)',
            dark: 'rgba(38, 153, 251, 1)',
            contrastText: '#fff'
        },
        secondary: {
            light: '#ff4081',
            main: '#f50057',
            dark: '#c51162',
            contrastText: '#fff'
        },
        error: {
            light: '#e57373',
            main: '#f44336',
            dark: '#d32f2f',
            contrastText: '#fff'
        },
        text: {
            primary: 'rgba(38, 153, 251, 1)',
            secondary: 'rgba(38, 153, 251, 1)',
            disabled: 'rgba(0, 0, 0, 0.38)',
            hint: 'rgba(0, 0, 0, 0.38)'
        }
    },
    overrides: {
        MuiInput: {
            underline: {
                borderBottom: 'rgba(38, 153, 251, 1)',
                '&:before': {
                    borderBottomColor: 'rgba(38, 153, 251, 1)',
                }
            }
        },
        MuiButtonLabel: {
            color: 'grey'
        }
    }
})



//Import components
import FarmProfileHeader from './farm_profile_header'

class FarmProfile extends Component {
    constructor(props) {
        super(props)
        const date = new Date()
        this.state = {
            center: {
                lat: this.props.location.state.farm.location.coordinates[0],
                lng: this.props.location.state.farm.location.coordinates[1]
            },
            zoom: 11,
            isFarmer: props.auth.user.isFarmer,
            myFarm: false,
            showHoursModal: false,
            currentDay: date.getDay(),
            mon: {
                open: this.props.location.state.hours.monOpen,
                close: this.props.location.state.hours.monClose
            },
            tues: {
                open: this.props.location.state.hours.tuesOpen,
                close: this.props.location.state.hours.tuesClose
            },
            wed: {
                open: this.props.location.state.hours.wedOpen,
                close: this.props.location.state.hours.wedClose
            },
            thur: {
                open: this.props.location.state.hours.thurOpen,
                close: this.props.location.state.hours.thurClose
            },
            fri: {
                open: this.props.location.state.hours.friOpen,
                close: this.props.location.state.hours.friClose
            },
            sat: {
                open: this.props.location.state.hours.satOpen,
                close: this.props.location.state.hours.satClose
            },
            sun: {
                open: this.props.location.state.hours.sunOpen,
                close: this.props.location.state.hours.sunClose
            },
            todayOpen: "",
            todayClose: ""
        }
    }

    componentDidMount = () => {
        //Check if Is current users farm
        const farmerId = this.props.auth.user.id
        const farmsFarmer = this.props.location.state.farm.farmer

        if (farmerId === farmsFarmer) {
            this.setState({
                myFarm: true
            })
        }

        // this.mapDayToSchedule
    }

    updateFarmerState = () => {
        if (this.props.auth) {
            let farmerStatus = this.props.auth.user.isFarmer
            this.setState({
                isFarmer: farmerStatus
            })
        }
    }

    addProduct = () => {
        const farm_data = { ...this.props.location.state }
        this.props.toProduce(farm_data, this.props.history)
    }

    viewMenu = () => {
        const farm_data = {
            ...this.props.location.state,
            myFarm: this.state.myFarm
        }
        this.props.toListProduce(farm_data, this.props.history)
    }

    viewSchedule = () => {
        this.setState({
            showHoursModal: true
        })
    }

    onCloseModal = () => {
        this.setState({
            showHoursModal: false
        })
    }

    getCurrentDay = () => {
        const date = new Date().getDay()
        console.log("Date Number: " + date)
        switch (date) {
            case 0:
                return "Sunday"
            case 1:
                return "Monday"
            case 2:
                return "Tuesday"
            case 3:
                return "Wednesday"
            case 4:
                return "Thursday"
            case 5:
                return "Friday"
            case 6:
                return "Saturday"
            default:
                return "Error"
        }
    }

    mapDayToSchedule = () => {
        const day = this.getCurrentDay()
        console.log("Day of the week: " + day)
        let body

        switch (day) {
            case "Sunday":
                if (this.state.sun.open === "00:00" & this.state.sun.close === "00:00" || this.state.sun.open === "" & this.state.sun.close === "") {
                    body = "We are Closed today, please try again during our normal business hours."
                } else {
                    body = `Sunday ${this.state.sun.open}AM - ${this.state.sun.close}PM`
                }
                return body
            case "Monday":
                if (this.state.mon.open === "00:00" & this.state.mon.close === "00:00" || this.state.mon.open === "" & this.state.mon.close === "") {
                    body = "We are Closed today, please try again during our normal business hours."
                } else {
                    body = `Monday ${this.state.mon.open}AM - ${this.state.mon.close}PM`
                }
                return body
            case "Tuesday":
                if (this.state.tues.open === "00:00" & this.state.tues.close === "00:00" || this.state.tues.open === "" & this.state.tues.close === "") {
                    body = "We are Closed today, please try again during our normal business hours."
                } else {
                    body = `Tuesday ${this.state.tues.open}AM - ${this.state.tues.close}PM`
                }
                return body
            case "Wednesday":
                if (this.state.wed.open === "00:00" & this.state.wed.close === "00:00" || this.state.wed.open === "" & this.state.wed.close === "") {
                    body = "We are Closed today, please try again during our normal business hours."
                } else {
                    body = `Wednesday ${this.state.wed.open}AM - ${this.state.wed.close}PM`
                }
                return body
            case "Thursday":
                if (this.state.thur.open === "00:00" & this.state.thur.close === "00:00" || this.state.thur.open === "" & this.state.thur.close === "") {
                    body = "We are Closed today, please try again during our normal business hours."
                } else {
                    body = `Thursday ${this.state.thur.open}AM - ${this.state.thur.close}PM`
                }
                return body
            case "Friday":
                if (this.state.fri.open === "00:00" & this.state.fri.close === "00:00" || this.state.fri.open === "" & this.state.fri.close === "") {
                    body = "We are Closed today, please try again during our normal business hours."
                } else {
                    body = `Friday ${this.state.fri.open}AM - ${this.state.fri.close}PM`
                }
                return body
            case "Saturday":
                if (this.state.sat.open === "00:00" & this.state.sat.close === "00:00" || this.state.sat.open === "" & this.state.sat.close === "") {
                    body = "We are Closed today, please try again during our normal business hours."
                } else {
                    body = `Saturday ${this.state.sat.open}AM - ${this.state.sat.close}PM`
                }
                return body
            default:
                body = "We are Closed today, please try again during our normal business hours."
                return body
        }

    }


    getHours = (day) => {
        let body
        switch (day) {
            case "Sunday":
                if (this.state.sun.open === "00:00" & this.state.sun.close === "00:00" || this.state.sun.open === "" & this.state.sun.close === "") {
                    body = "CLOSED"
                } else {
                    if (this.state.sun.open === "00:00" || this.state.sun.open === "") {
                        body = `Open - `
                    } else {
                        body = `${this.state.sun.open}AM - `
                    }

                    if (this.state.sun.close === "00:00" || this.state.sun.close === "") {
                        body = body + `Close`
                    } else {
                        body = body + `${this.state.sun.close}PM`
                    }
                }
                return body
            case "Monday":
                if (this.state.mon.open === "00:00" & this.state.mon.close === "00:00" || this.state.mon.open === "" & this.state.mon.close === "") {
                    body = "CLOSED"
                } else {
                    if (this.state.mon.open === "00:00" || this.state.mon.open === "") {
                        body = `Open - `
                    } else {
                        body = `${this.state.mon.open}AM - `
                    }

                    if (this.state.mon.close === "00:00" || this.state.mon.close === "") {
                        body = body + `Close`
                    } else {
                        body = body + `${this.state.mon.close}PM`
                    }
                }
                return body
            case "Tuesday":
                if (this.state.tues.open === "00:00" & this.state.tues.close === "00:00" || this.state.tues.open === "" & this.state.tues.close === "") {
                    body = "CLOSED"
                } else {
                    if (this.state.tues.open === "00:00" || this.state.tues.open === "") {
                        body = `Open - `
                    } else {
                        body = `${this.state.tues.open}AM - `
                    }

                    if (this.state.tues.close === "00:00" || this.state.tues.close === "") {
                        body = body + `Close`
                    } else {
                        body = body + `${this.state.tues.close}PM`
                    }
                }
                return body
            case "Wednesday":
                if (this.state.wed.open === "00:00" & this.state.wed.close === "00:00" || this.state.wed.open === "" & this.state.wed.close === "") {
                    body = "CLOSED"
                } else {
                    if (this.state.wed.open === "00:00" || this.state.wed.open === "") {
                        body = `Open - `
                    } else {
                        body = `${this.state.wed.open}AM - `
                    }

                    if (this.state.wed.close === "00:00" || this.state.wed.close === "") {
                        body = body + `Close`
                    } else {
                        body = body + `${this.state.wed.close}PM`
                    }
                }
                return body
            case "Thursday":
                if (this.state.thur.open === "00:00" & this.state.thur.close === "00:00" || this.state.thur.open === "" & this.state.thur.close === "") {
                    body = "CLOSED"
                } else {
                    if (this.state.thur.open === "00:00" || this.state.thur.open === "") {
                        body = `Open - `
                    } else {
                        body = `${this.state.thur.open}AM - `
                    }

                    if (this.state.thur.close === "00:00" || this.state.thur.close === "") {
                        body = body + `Close`
                    } else {
                        body = body + `${this.state.thur.close}PM`
                    }
                }
                return body
            case "Friday":
                if (this.state.fri.open === "00:00" & this.state.fri.close === "00:00" || this.state.fri.open === "" & this.state.fri.close === "") {
                    body = "CLOSED"
                } else {
                    if (this.state.fri.open === "00:00" || this.state.fri.open === "") {
                        body = `Open - `
                    } else {
                        body = `${this.state.fri.open}AM - `
                    }

                    if (this.state.fri.close === "00:00" || this.state.fri.close === "") {
                        body = body + `Close`
                    } else {
                        body = body + `${this.state.fri.close}PM`
                    }
                }
                return body
            case "Saturday":
                if (this.state.sat.open === "00:00" & this.state.sat.close === "00:00" || this.state.sat.open === "" & this.state.sat.close === "") {
                    body = "CLOSED"
                } else {
                    if (this.state.sat.open === "00:00" || this.state.sat.open === "") {
                        body = `Open - `
                    } else {
                        body = `${this.state.sat.open}AM - `
                    }

                    if (this.state.sat.close === "00:00" || this.state.sat.close === "") {
                        body = body + `Close`
                    } else {
                        body = body + `${this.state.sat.close}PM`
                    }
                }
                return body
            default:
                body = "Error"
                return body
        }
    }

    // setScheduleLabel = () => {
    //     this.mapDayToSchedule

    //     return <div>{this.getCurrentDay(this.state.currentDay)} {this.state.todayOpen} - {this.state.todayClose}</div>
    // }

    render() {
        let produceButton

        //Filter Product Button to only Current Farmer
        if (convertToBoolean(this.state.isFarmer) && this.state.myFarm) {
            produceButton = <Button
                style={{
                    width: "30%",
                    height: "48pt",
                    borderRadius: "3px",
                    letterSpacing: "1.5px",
                    marginTop: "1rem",
                    marginLeft: "13px"
                }}
                type="submit"
                variant="contained"
                color="primary"
                onClick={this.addProduct}
            ><LibraryAddIcon /></Button>
        } else {
            produceButton = <Button
                style={{
                    width: "30%",
                    height: "48pt",
                    borderRadius: "3px",
                    letterSpacing: "1.5px",
                    marginTop: "1rem",
                    marginLeft: "13px"
                }}
                type="submit"
                variant="contained"
                color="primary"
                onClick={this.viewSchedule}
            >View Hours <AccessTimeIcon /></Button>
        }

        return (
            <ThemeProvider theme={theme}>
                {/* Layout of the farm profile */}
                <FarmProfileHeader profilePic={this.props.location.state.imageUrl} />
                {/* FarmProfile Body incl. Name, Menu  button and Description & map */}
                <div className="farm-profile-body">
                    <div className="farm-profile-name">
                        {this.props.location.state.displayName}
                    </div>
                    <div className="farm-profile-description">
                        {this.props.location.state.description}
                    </div>
                    <div className="farm-hours-container">
                        {this.mapDayToSchedule()}
                    </div>
                    <div className="farm-profile-menu-button">
                        <Button
                            style={{
                                width: "30%",
                                height: "48pt",
                                borderRadius: "3px",
                                letterSpacing: "1.5px",
                                marginTop: "1rem"
                            }}
                            type="submit"
                            variant="contained"
                            color="primary"
                            onClick={this.viewMenu}
                        >Menu</Button>
                        {produceButton}
                    </div>
                </div>
                <div className="farm-profile-map">
                    <GoogleMapReact
                        bootstrapURLKeys={{ key: "AIzaSyDkgBDOK8UL6a5nDIJMv8rX51n2OncYNe0" }}
                        defaultCenter={this.state.center}
                        defaultZoom={this.state.zoom}
                    >
                        <Marker
                            lat={this.state.center.lat}
                            lng={this.state.center.lng}
                            text="Farm Marker"
                        />
                    </GoogleMapReact>
                </div>
                <Modal open={this.state.showHoursModal} onClose={this.onCloseModal} center>
                    <div className="hours-modal-title">Hours</div>
                    <table>
                        <tr><th>Sunday</th><td>{this.getHours("Sunday")}</td></tr>
                        <tr><th>Monday</th><td>{this.getHours("Monday")}</td></tr>
                        <tr><th>Tuesday</th><td>{this.getHours("Tuesday")}</td></tr>
                        <tr><th>Wednesday</th><td>{this.getHours("Wednesday")}</td></tr>
                        <tr><th>Thursday</th><td>{this.getHours("Thursday")}</td></tr>
                    </table>
                </Modal>
            </ThemeProvider>
        )
    }
}

FarmProfile.propTypes = {
    toProduce: propTypes.func.isRequired,
    toListProduce: propTypes.func.isRequired,
    auth: propTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth
})


export default connect(mapStateToProps, { toProduce, toListProduce })(FarmProfile)
