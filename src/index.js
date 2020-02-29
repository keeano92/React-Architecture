import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import './index.css';
import jwt_decode from 'jwt-decode'
import setAuthToken from './utils/setAuthToken'
import { setCurrentUser, logout } from './actions/authActions'
import { Provider } from 'react-redux'
import { store, persistor } from './config/store'
import { PersistGate } from 'redux-persist/lib/integration/react'
import { Elements, StripeProvider } from 'react-stripe-elements'
import {firebaseAPIKey, firebaseAuthdomain, firebaseDBUrl, firebaseProjectID,
firebaseStorageBucket,firebaseMessagingSenderId, firebaseAppID, firebaseMeasurementId} from './config/keys'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/analytics'
import 'firebase/storage'
// import { ThemeProvider } from '@material-ui/core/styles'
// import * as serviceWorker from './serviceWorker';

//Components
import App from './components/app/App';
import login from './components/login/login';
import register from './components/register/register';
import dashboard from './components/dashboard/dashboard'
import forgotPassword from './components/forgot_password/forgot_password'
import UpdatePassword from './components/update_password/update_password'
import CreateFarmer from './components/create_farmer/create_farmer'
import CreateFarmProfile from './components/create_farm_profile/create_farm_profile'
import AddFarm from './components/add_farm/add_farm'
import FeaturedFarms from './components/featured_farms/featured_farms'
import FarmProfile from './components/farm_profile/farm_profile'
import FarmHours from './components/farm_hours/farm_hours'
import AddProduce from './components/add_produce/add_produce'
import ProduceProfile from './components/produce_profile/produce_profile'
import ListProduce from './components/list_produce/list_produce'
import PreviousOrders from './components/previous_orders/previous_orders'
import PaymentSettings from './components/payment_settings/payment_settings'
import Account from './components/account/account'
import Support from './components/support/support'
import Checkout from './components/checkout/checkout'
import NotFound from './components/notfound/notfound';
import PrivateRoute from './components/private-route/private-route'
import Terms from './components/term_policies/terms';
import EditProduct from './components/edit_product/edit_product'
import PaymentSuccess from './components/payment_success/payment_success'
import EditAccount from './components/editAccount/editAccount'


//Firebase Configuration
var firebaseConfig = {
    apiKey: firebaseAPIKey,
    authDomain: firebaseAuthdomain,
    databaseURL: firebaseDBUrl,
    projectId: firebaseProjectID,
    storageBucket: firebaseStorageBucket,
    messagingSender: firebaseMessagingSenderId,
    appId: firebaseAppID,
    measurementId: firebaseMeasurementId
}

firebase.initializeApp(firebaseConfig)
firebase.analytics()


//Check to keep user logged in
if (localStorage.jwtToken) {
    //Set Auth Header
    const token = localStorage.jwtToken
    setAuthToken(token)
    //Decode token
    const decoded = jwt_decode(token)
    //Set User && isAuthenticated
    store.dispatch(setCurrentUser(decoded))

    //Check for expired token
    const currentTime = Date.now() / 1000
    if (decoded.exp < currentTime) {
        //logout user
        store.dispatch(logout())
        //redirect
        window.location.href = "./login"
    }
}


const routing = (
    <StripeProvider apiKey="pk_test_BpVAwptIyHFeh1ExoOLWW96f008hLkqWiK">
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Router>
                    <div>
                        <Switch>
                            <Route exact path="/" component={App} />
                            <Route exact path="/login" component={login} />
                            <Route exact path="/register" component={register} />
                            <Route exact path="/dashboard" component={dashboard} />
                            <Route exact path="/forgotPassword" component={forgotPassword} />
                            {/* UpdatePassword is browser only Page */}
                            <Route exact path="/updatePassword/:token" component={UpdatePassword} />
                            <Route exact path="/createFarmer" component={CreateFarmer} />
                            <Route exact path="/addFarm" component={AddFarm} />
                            <Route exact path="/addFarmProfile" component={CreateFarmProfile} />
                            <PrivateRoute exact path="/dashboard" component={dashboard} />
                            <Route exact path="/featuredFarms" component={FeaturedFarms} />
                            <Route exact path="/farmProfile" component={FarmProfile} />
                            <Route exact path="/farmHours" component={FarmHours} />
                            <Route exact path="/addProduce" component={AddProduce} />
                            <Route exact path="/produceProfile" component={ProduceProfile} />
                            <Route exact path="/listProduce" component={ListProduce} />
                            <Route exact path="/previousOrders" component={PreviousOrders} />
                            <Route exact path="/paymentSettings" component={PaymentSettings} />
                            <Route exact path="/account" component={Account} />
                            <Route exact path="/support" component={Support} />
                            <Route exact path="/terms" component={Terms} />
                            <Route exact path="/checkout">
                                <Elements>
                                    <Checkout />
                                </Elements>
                            </Route>
                            <Route exact path="/paymentSuccess" component={PaymentSuccess} />
                            <Route exact path="/editProduct" component={EditProduct} />
                            <Route exact path="/editAccount" component={EditAccount} />
                            <Route component={NotFound} />
                        </Switch>
                    </div>
                </Router>
            </PersistGate>
        </Provider>
    </StripeProvider>
)

ReactDOM.render(routing, document.getElementById('root'));

//Needed for Hot Module Replacment
if (typeof (module.hot) !== 'undefined') {
    module.hot.accept() // eslint-disable-line no-undef
}



// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').then(registration => {
            console.log('SW registered: ', registration);
        }).catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
        });
    });
}
