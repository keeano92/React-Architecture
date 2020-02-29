/* eslint-disable react/prop-types */
import React, { Component } from 'react'
import './farm_hours.css'
import TimePicker from 'react-time-picker'
import Button from '@material-ui/core/Button'
import propTypes from 'prop-types'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'

//Actions
import {setHours} from '../../actions/farmActions'

//Components
import FarmHoursHeader from './farm_hours_header'

//Theme
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
        },
        MuiPaper: {
            root: {
                backgroundColor: 'rgba(255, 255, 255, 1)'
            }
        }
    }
})



class FarmHours extends Component {
    constructor(props) {
        super(props)
        this.state = {
            mon:{
                open:"00:00",
                close: "00:00"
            },
            tues:{
                open:"00:00",
                close:"00:00"
            },
            wed:{
                open:"00:00",
                close:"00:00"
            },
            thur:{
                open:"00:00",
                close:"00:00"
            },
            fri:{
                open:"00:00",
                close:"00:00"
            },
            sat:{
                open:"00:00",
                close:"00:00"
            },
            sun:{
                open:"00:00",
                close:"00:00"
            },
            hoursSet: false,
            fromModal: props.location.state.fromModal
        }
    }

    setMonOpen = time => {
        this.setState({ mon:{
            open: time,
            close: this.state.mon.close
        }})
    }

    setMonClose = time => {
        this.setState({ mon:{
            open: this.state.mon.open,
            close: time
        }})
    }

    setTuesOpen = time => {
        this.setState({ tues:{
            open: time,
            close: this.state.tues.close
        }})
    }

    setTuesClose = time => {
        this.setState({ tues:{
            open: this.state.tues.open,
            close: time
        }})
    }

    setWedOpen = time => {
        this.setState({ wed:{
            open: time,
            close: this.state.wed.close
        }})
    }

    setWedClose = time => {
        this.setState({ wed:{
            open: this.state.wed.open,
            close: time
        }})
    }

    setThurOpen = time => {
        this.setState({ thur:{
            open: time,
            close: this.state.thur.close
        }})
    }

    setThurClose = time => {
        this.setState({ thur:{
            open: this.state.thur.open,
            close: time
        }})
    }

    setFriOpen = time => {
        this.setState({ fri:{
            open: time,
            close: this.state.fri.close
        }})
    }

    setFriClose = time => {
        this.setState({ fri:{
            open:this.state.fri.open,
            close: time
        }})
    }

    setSatOpen = time => {
        this.setState({ sat:{
            open: time,
            close: this.state.sat.close
        }})
    }

    setSatClose = time => {
        this.setState({ sat:{
            open: this.state.sat.open,
            close: time
        }})
    }

    setSunOpen = time => {
        this.setState({ sun:{
            open: time,
            close: this.state.sun.close
        }})
    }

    setSunClose = time => {
        this.setState({ 
            sun:{
                open: this.state.sun.open,
                close: time
            },
            hoursSet: true
         })
    }

    onContinue = () => {
        const payload = {
            // eslint-disable-next-line react/prop-types
            farmId: this.props.location.state.farmId,
            ...this.state
        }

        // eslint-disable-next-line react/prop-types
        this.props.setHours(payload, this.state.fromModal, this.props.history)
    }

    render() {
        return (
            <ThemeProvider theme={theme}>
                <FarmHoursHeader />
                <div className="day_header">Monday</div>
                <div className="time_container">
                    <TimePicker
                        className="picker"
                        format="HH:mm a"
                        onChange={this.setMonOpen}
                        value={this.state.mon.open}
                    />
                    <TimePicker
                        label="Close"
                        className="picker"
                        format="HH:mm a"
                        onChange={this.setMonClose}
                        value={this.state.mon.close}
                    />
                </div>
                <div className="day_header">Tuesday</div>
                <div className="time_container">
                    <TimePicker
                        className="picker"
                        format="HH:mm a"
                        onChange={this.setTuesOpen}
                        value={this.state.tues.open}
                    />
                    <TimePicker
                        label="Close"
                        className="picker"
                        format="HH:mm a"
                        onChange={this.setTuesClose}
                        value={this.state.tues.close}
                    />
                </div>
                <div className="day_header">Wednesday</div>
                <div className="time_container">
                    <TimePicker
                        className="picker"
                        format="HH:mm a"
                        onChange={this.setWedOpen}
                        value={this.state.wed.open}
                    />
                    <TimePicker
                        label="Close"
                        className="picker"
                        format="HH:mm a"
                        onChange={this.setWedClose}
                        value={this.state.wed.close}
                    />
                </div>
                <div className="day_header">Thursday</div>
                <div className="time_container">
                    <TimePicker
                        className="picker"
                        format="HH:mm a"
                        onChange={this.setThurOpen}
                        value={this.state.thur.open}
                    />
                    <TimePicker
                        label="Close"
                        className="picker"
                        format="HH:mm a"
                        onChange={this.setThurClose}
                        value={this.state.thur.close}
                    />
                </div>
                <div className="day_header">Friday</div>
                <div className="time_container">
                    <TimePicker
                        className="picker"
                        format="HH:mm a"
                        onChange={this.setFriOpen}
                        value={this.state.fri.open}
                    />
                    <TimePicker
                        label="Close"
                        className="picker"
                        format="HH:mm a"
                        onChange={this.setFriClose}
                        value={this.state.fri.close}
                    />
                </div>
                <div className="day_header">Saturday</div>
                <div className="time_container">
                    <TimePicker
                        className="picker"
                        format="HH:mm a"
                        onChange={this.setSatOpen}
                        value={this.state.sat.open}
                    />
                    <TimePicker
                        label="Close"
                        className="picker"
                        format="HH:mm a"
                        onChange={this.setSatClose}
                        value={this.state.sat.close}
                    />
                </div>
                <div className="day_header">Sunday</div>
                <div className="time_container">
                    <TimePicker
                        className="picker"
                        format="HH:mm a"
                        onChange={this.setSunOpen}
                        value={this.state.sun.open}
                    />
                    <TimePicker
                        label="Close"
                        className="picker"
                        format="HH:mm a"
                        onChange={this.setSunClose}
                        value={this.state.sun.close}
                    />
                </div>
                <div className="hours_button">
                    <Button
                    onClick={this.onContinue}
                    style={{
                        width: "90%",
                        height: "48pt",
                        borderRadius: "3px",
                        letterSpacing: "1.5px",
                        marginTop: "1rem"
                    }}
                    type="submit"
                    variant="contained"
                    color="primary"
                >CONTINUE</Button>
                {/* disabled={this.state.hoursSet === false} */}
                </div>
            </ThemeProvider>
        )
    }
}

FarmHours.propTypes = {
    setHours: propTypes.func.isRequired
}

const mapStateToProps = state => ({

})

export default connect(mapStateToProps, {setHours})(FarmHours)
