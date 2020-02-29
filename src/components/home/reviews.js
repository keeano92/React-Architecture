import React from 'react'
import propTypes from 'prop-types'
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";

const styles = theme => ({
    container: {
        display: "grid",
        gridTemplateColumns: "repeat(12, 1fr)",
        gridGap: `22px`
    },
    paper: {
        padding: theme.spacing.unit,
        textAlign: "center",
        color: theme.palette.text.secondary,
        whiteSpace: "nowrap",
        marginBottom: theme.spacing.unit
    },
    divider: {
        margin: `22px 0`
    }
})

function Reviews(props) {
    const { classes } = props
    const reviewCount = 0

    //Set Review Count from Props in next version

    let reviewsDom

    if (reviewCount <= 0) {
        reviewsDom =
            <div>
                <div className="section-title">
                    <h1>Reviews</h1>
                </div>
                <div className="container no-reviews">
                    <p>No Reviews at this time, please check back</p>
                </div>
            </div>

    } else {
        reviewsDom = <div className="container">
            <Grid container spacing={2}>
                <Grid item xs={8}>
                    <Paper className={classes.paper}>Review One</Paper>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={8}>
                    <Paper className={classes.paper}>Review Two</Paper>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={8}>
                    <Paper className={classes.paper}>Review Three</Paper>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={8}>
                    <Paper className={classes.paper}>Review Four</Paper>
                </Grid>
            </Grid>
        </div>
    }

    return (reviewsDom)
}

Reviews.propTypes = {
    classes: propTypes.object.isRequired
}

export default withStyles(styles)(Reviews)
