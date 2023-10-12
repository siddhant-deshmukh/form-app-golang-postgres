import { IAppState, IFormSnippet, IUser } from "../types/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const appSlice = createSlice({
  name: 'app',

  initialState: {
    forms: [],
    user: {
      id: undefined,
      email: '',
      name: '',
    },
    msgs: {
      errMsg: '',
      warnMsg: '',
      sucessMsg: ''
    }
  } as IAppState,

  reducers: {
    setUserInfo: (state, action: PayloadAction<IUser>) => {
      if (action.payload.id) {
        state.user = action.payload
      }
    },
    removeUser: (state) => {
      state.user = {
        id: undefined,
        email: '',
        name: '',
      }
    },
    addFormId: (state, action: PayloadAction<IFormSnippet>) => {
      if (Number.isInteger(action.payload)) {
        state.forms.push(action.payload)
      }
    },

    editFormIdList: (state, action: PayloadAction<IFormSnippet[]>) => {
      state.forms = action.payload
    },
    deleteFormId: (state, action: PayloadAction<IFormSnippet>) => {
      if (Number.isInteger(action.payload)) {
        let index = state.forms.indexOf(action.payload)
        if (index > 0) {
          state.forms = state.forms.slice(0, index).concat(state.forms.slice(index + 1))
        } else if (index == 0) {
          state.forms = state.forms.slice(1)
        }
        state.forms.push(action.payload)
      }
    },

    setMsg: (state, action: PayloadAction<{ msg: string, msgType: 'err' | 'warn' | 'sucess' }>) => {
      switch (action.payload.msgType) {
        case 'err':
          state.msgs.errMsg = action.payload.msg
          break
        case 'sucess':
          state.msgs.sucessMsg = action.payload.msg
          break
        case 'warn':
          state.msgs.warnMsg = action.payload.msg
      }
    },
    removeMsg: (state, action: PayloadAction<'err' | 'warn' | 'sucess'>) => {
      switch (action.payload) {
        case 'err':
          state.msgs.errMsg = ''
          break
        case 'sucess':
          state.msgs.sucessMsg = ''
          break
        case 'warn':
          state.msgs.warnMsg = ''
      }
    }
  }
})

export const {
  removeMsg, setMsg,
  setUserInfo, removeUser,
  addFormId, deleteFormId, editFormIdList } = appSlice.actions

export default appSlice.reducer