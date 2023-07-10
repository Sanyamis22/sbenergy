import thunk from 'redux-thunk';
import {createStore, applyMiddleware, compose} from 'redux';
import RootReducer from './Reducers/index';

const middleware = [thunk];

export const store = createStore(
    RootReducer,
    compose(applyMiddleware(...middleware))    
)