import { configureStore } from '@reduxjs/toolkit'
import formReducer from '../features/formState'
import appReducer from '../features/appState'
import queReducer from '../features/queState'

const store =  configureStore({
  reducer: {
    app : appReducer,
    form : formReducer,
    questions : queReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store