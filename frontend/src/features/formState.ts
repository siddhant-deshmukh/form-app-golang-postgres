import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IForm } from "../types/types";

export const formSlice = createSlice({
  name: 'form',
  initialState: {
    form: {
      id: undefined,
      title: '',
      description: '',
      quiz_setting: {
        is_quiz: false,
        default_points: 1,
      },
      response_setting: {
        allow_edit_res: false,
        collect_email: false,
        send_res_copy: false,
      },
      question_seq: []
    } as IForm
  } ,
  reducers: {
    editAboutForm: (state, action: PayloadAction<{ title?: string, description?: string }>) => {
      let form = state.form
      if (action.payload.title) {
        form.title = action.payload.title
      }
      if (action.payload.description !== undefined) {
        form.description = action.payload.description
      }
      state.form = form
    },

    selectForm: (state, action: PayloadAction<IForm>) => {
      // console.log("ac", action.payload)
      state.form = action.payload
    }
  }
})

export const {
  editAboutForm, selectForm
} = formSlice.actions

export default formSlice.reducer