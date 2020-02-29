/* eslint-disable react/prop-types */
import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
        overflow: 'scroll',
        height: '176px'
    },
}))

const roundTotal = (total) => {
    return (Math.round(total * 100) / 100).toFixed(2)
}

function CartProducts(props) {
    const classes = useStyles()

    let cart_products

    if (props.auth.cart <= 0) {
        cart_products =
            <div className="no-items-in-cart">
                There are no Items in your cart, please visit the market and then check back.
        </div>
    } else {
        cart_products = props.auth.cart.map((product) =>
            <List key={product.product_details._id}>
                <ListItem>
                    <div className="product-cart-detail-container">
                        <div className="product-name-container">
                            <ListItemText primary={product.product_details.title} secondary={"$" + roundTotal(product.product_details.price)}></ListItemText>
                        </div>
                        <div className="product-price-container">
                        <ListItemText primary={' '} secondary={"QTY: " + product.qty}></ListItemText>
                        </div>
                    </div>          
                </ListItem>
                <Divider />
            </List>
        )
    }

    return (
        <div className={classes.root}>
            <List>
                {cart_products}
            </List>
        </div>
    )
}

export default CartProducts
