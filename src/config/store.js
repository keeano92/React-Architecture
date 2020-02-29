import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from '../reducers'
import { composeWithDevTools } from 'redux-devtools-extension'
import { persistStore, persistReducer, persistCombineReducers } from 'redux-persist'
import storage from 'redux-persist/es/storage'
import autoMergeLevel1 from 'redux-persist/lib/stateReconciler/autoMergeLevel1'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'

const initialState = {}
const middleware = [thunk]

const config = {
    key: 'root',
    storage: storage
}

const reducers = persistReducer(config, rootReducer)

export const store = createStore(
    reducers,
    composeWithDevTools(
        applyMiddleware(...middleware)
    )
)

export const persistor = persistStore(store)

// export default store;