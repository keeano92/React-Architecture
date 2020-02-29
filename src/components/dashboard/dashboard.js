/* eslint-disable react/prop-types */
import React, { Component } from 'react'
import './dashboard.css'
import propTypes from 'prop-types'
import { connect } from 'react-redux'
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import SwipeableViews from 'react-swipeable-views'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import { logout } from '../../actions/authActions'
import MenuIcon from '@material-ui/icons/Menu'
import SearchIcon from '@material-ui/icons/Search'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import SettingsIcon from '@material-ui/icons/Settings'
import Modal from 'react-responsive-modal'
import Button from '@material-ui/core/Button'
import AddIcon from '@material-ui/icons/Add'


//Import Actions
import {addFarmModal} from '../../actions/farmActions'

//Import Components
import DashboardHeader from './dashboard_header'
import Home from '../home/home'
import Market from '../market/market'
import Cart from '../cart/cart'
import Settings from '../settings/settings'


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

class dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      needsFarm: (props.auth.user.needsFarm == "true") ? true : false
    }
  }

  logout = e => {
    e.preventDefault()
    this.props.logout()
    this.props.history.push("/")
  }

  handleChange = (e, value) => {
    this.setState({ value: value })
  }

  handleChangeIndex = index => {
    this.setState({ value: index })
  }

  addFarm = e => {
    e.preventDefault()
    //setup Payload to pass to addFarm Action
    this.props.addFarmModal(this.props.auth.user.id, this.props.history)
  }

  onCloseModal = () => {
    this.setState({ needsFarm: false })
}

  render() {
    const { user } = this.props.auth;

    return (
      <ThemeProvider theme={theme}>
        <div className="container">
          <SwipeableViews
            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            index={this.state.value}
            onChangeIndex={this.handleChangeIndex}
          >
            <TabPanel className="tabView" value={this.state.value} index={0} dir={theme.direction}>
              <Home data={this.props} history={this.props.history} />
            </TabPanel>
            <TabPanel className="tabView" value={this.state.value} index={1} dir={theme.direction}>
              <Market data={this.props} history={this.props.history} />
            </TabPanel>
            <TabPanel className="tabView" value={this.state.value} index={2} dir={theme.direction}>
              <Cart data={this.props} history={this.props.history} />
            </TabPanel>
            <TabPanel className="tabView" value={this.state.value} index={3} dir={theme.direction}>
              <Settings data={this.props} history={this.props.history} />
            </TabPanel>
          </SwipeableViews>
        </div>
        <div className="menubar">
          <AppBar position="static" color="default">
            <Tabs
              value={this.state.value}
              onChange={this.handleChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
              aria-label="Farm Estar Main Menu"
            >
              <Tab label="Home" icon={<MenuIcon />} {...a11yProps(0)} />
              <Tab label="Market" icon={<SearchIcon />} {...a11yProps(1)} />
              <Tab label="Cart" icon={<ShoppingCartIcon />} {...a11yProps(2)} />
              <Tab label="Settings" icon={<SettingsIcon />} {...a11yProps(3)} />
            </Tabs>
          </AppBar>
        </div>
        <Modal open={this.state.needsFarm} onClose={this.onCloseModal} center>
          <h2>Register Farm</h2>
          <p>It appears during signup a farm was not registered to your account, we recommend adding one to allow your customers to start making purchases. Add a Farm below.</p>
          <Button
            onClick={this.addFarm}
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
          ><AddIcon /> Add Farm</Button>
        </Modal>
      </ThemeProvider>
    )
  }
}

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

dashboard.propTypes = {
  logout: propTypes.func.isRequired,
  auth: propTypes.object.isRequired,
  addFarmModal: propTypes.func.isRequired
}

TabPanel.propTypes = {
  children: propTypes.node,
  index: propTypes.any.isRequired,
  value: propTypes.any.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps, { logout, addFarmModal })(dashboard)
