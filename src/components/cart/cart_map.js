/* eslint-disable react/prop-types */
import React, { Component } from 'react'
import GoogleMapReact from 'google-map-react'

const Marker = ({ text }) => <div>{text}</div>

class CartMap extends Component {
    constructor(props){
        super(props)
        this.state = {
            displayMap: (this.props.auth.cart.length > 0) ? true : false,
            center: {
                lat: 59.95,
                lng: 30.33
            },
            zoom: 11
        }
    }

    componentDidMount = () => {
        if (this.state.displayMap && this.props.auth.cart[0].farm_details) {
            this.setState({
                center:{
                    lat: this.props.auth.cart[0].farm_details.location.coordinates[0],
                    lng: this.props.auth.cart[0].farm_details.location.coordinates[1]
                } 
            })
        }
    }

    render() {  
        return (
            <div style={{height: '178px', width: '100%' }}>
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
        )
    }
}

export default CartMap

