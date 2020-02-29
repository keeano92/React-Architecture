import React, { Component } from 'react'
import propTypes from 'prop-types'
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import SearchIcon from '@material-ui/icons/Search';
import { grey } from '@material-ui/core/colors';


const styles = theme => ({
    paper: {
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#BCE0FD',
        textAlign: "left",
        width: "365px"
    }
})



class Farms extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    handleClick = (farm) => {
        // console.log(farm)
        const isFarmer = this.props.auth.user.isFarmer
        const farm_data = {
            ...farm,
            isFarmer: isFarmer
        }
        // eslint-disable-next-line react/prop-types
        this.props.selectedFarm(farm_data, this.props.history)

    }

    render() {
        const { classes } = this.props
        const listFarms = this.props.auth.farms.map((farm) =>
                <Grid item xs={10} key={farm._id} data={farm._id} onClick={() => this.handleClick(farm)}>
                    <Paper className={classes.paper}>
                        <div className="farm-header">
                            {farm.farmName}
                        </div>
                        <div className="farm-subheader">
                            {farm.address}
                        </div>
                        {/* <div className="to-detail-button">
        <ArrowForwardIcon />
    </div> */}
                    </Paper>
                </Grid>
        )

        return (
            <div>
                <div className="search-bar">
                    <TextField
                        variant="outlined"
                        fullWidth={true}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </div>
                <div className="farm-results-container">
                    <div className={classes.root}>
                        <Grid container spacing={2}>
                            {listFarms}
                        </Grid>
                    </div>
                </div>
            </div>
        )
    }
}

Farms.propTypes = {
    classes: propTypes.object.isRequired,
    auth: propTypes.object.isRequired,
    selectedFarm: propTypes.func.isRequired
}

export default withStyles(styles)(Farms)