/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-28 21:01:26
 * @ Modified time: 2024-06-29 23:19:50
 * @ Description:
 * 
 * This is the actual store where all the data of our app is kept.
 * Our centralized state.
 */

import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { dfReducer } from './df.slice'
import { fsReducer } from './fs.slice'

// Combine all the reducers of the different slices
const rootReducer = combineReducers({
  df: dfReducer,
  fs: fsReducer
})

// Configure the store with the combined reducers
export const store = configureStore({
  reducer: rootReducer,
})

export default {
  store
}