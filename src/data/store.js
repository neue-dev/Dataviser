import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { dfReducer } from './df.slice'

// Combine all the reducers of the different slices
const rootReducer = combineReducers({
  df: dfReducer
})

// Configure the store with the combined reducers
export const store = configureStore({
  reducer: rootReducer,
})

export default {
  store
}