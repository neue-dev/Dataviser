/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-28 21:01:26
 * @ Modified time: 2024-07-01 17:45:56
 * @ Description:
 * 
 * This is the actual store where all the data of our app is kept.
 * Our centralized state.
 */

import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { dfReducer } from './df.slice'
import { fsReducer } from './fs.slice'
import { pyReducer } from './py.slice'

// Combine all the reducers of the different slices
const rootReducer = combineReducers({
  df: dfReducer,
  fs: fsReducer,
  py: pyReducer,
})

// Configure the store with the combined reducers
export const store = configureStore({
  reducer: rootReducer,
})

export default {
  store
}