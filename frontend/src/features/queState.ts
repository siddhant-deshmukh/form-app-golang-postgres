import { IQuestion, IQuestions } from "../types/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const queSlice = createSlice({
  name: 'que',

  initialState: {
    questions: {},
    que_seq: [],
    selected_que: null as null | number,
    responses: {}
  } as IQuestions,

  reducers: {
    initQue: (state, action: PayloadAction<IQuestions>) => {

      Object.keys(action.payload.questions).forEach((key) => {
        action.payload.questions[key].isSaved = true
      })

      if (Array.isArray(action.payload.que_seq) && action.payload.questions) {
        state.que_seq = action.payload.que_seq
        state.questions = action.payload.questions
      }
    },
    saveQue: (state, action: PayloadAction<number>) => {
      let index = action.payload.toString()
      if (index && state.questions[index].id) {
        state.questions[index].isSaved = true
      }
    },
    queSeqSaved: (state) => {
      state.isSaved = true
    },

    editQue: (state, action: PayloadAction<{ id: number, question: IQuestion }>) => {
      action.payload.question.isSaved = false
      let index = action.payload.id?.toString()
      if (index) {
        state.questions[index] = action.payload.question
      }
    },
    deleteQue: (state, action: PayloadAction<number>) => {
      let index = action.payload?.toString()
      if (index) {
        let arr = state.que_seq.slice()
        let ind = state.que_seq.indexOf(action.payload)
        if (ind > 0) {
          state.que_seq = arr.slice(0, ind).concat(arr.slice(ind + 1))
          delete state.questions[index]
        }
      }
    },
    addQue: (state, action: PayloadAction<{ index: number, question: IQuestion }>) => {
      let index = action.payload.index?.toString()
      let id = action.payload.question.id
      if (index && id) {
        state.questions[id] = { ...action.payload.question, isSaved: true }

        let ind = action.payload.index
        let arr = state.que_seq

        if (ind === 0) {
          let arr = [id]
          state.que_seq = arr.concat(state.que_seq)
        } else if (ind >= arr.length) {
          arr.push(id)
          state.que_seq = arr
        } else {
          let arr2 = arr.slice(0, ind)
          arr2.push(id)
          state.que_seq = arr2.concat(arr.slice(ind))
        }
        state.selected_que = id
      }
    },

    changeSelectedQue: (state, action: PayloadAction<number | null>) => {
      if (action.payload) {
        state.selected_que = action.payload
      } else {
        state.selected_que = null
      }
    },

    functionForSorting: (state, action: PayloadAction<{ oldIndex: number, newIndex: number, questionId?: string }>) => {
      if (action.payload.questionId) {

        let the_question = state.questions[action.payload.questionId]

        if (the_question && the_question.options) {
          let optionsArray = the_question.options

          if (optionsArray) {
            if (action.payload.oldIndex < 0 || action.payload.newIndex < 0 ||
              action.payload.newIndex > optionsArray.length - 1 || action.payload.oldIndex > optionsArray.length - 1) return;
            let value = optionsArray[action.payload.oldIndex]
            let arr_ = optionsArray.slice(0, action.payload.oldIndex).concat(optionsArray.slice(action.payload.oldIndex + 1))
            optionsArray = arr_.slice(0, action.payload.newIndex).concat([value, ...arr_.slice(action.payload.newIndex)])

            // the_question.options = optionsArray
            state.questions[action.payload.questionId].options = optionsArray
            state.questions[action.payload.questionId].isSaved = false
          }
        }
      } else {
        let the_queseq = state.que_seq
        let oldIndex = action.payload.oldIndex
        let newIndex = action.payload.newIndex

        if (oldIndex < 0 || newIndex < 0 ||
          newIndex > the_queseq.length - 1 || oldIndex > the_queseq.length - 1) return;

        let value = the_queseq[oldIndex]
        let arr_ = the_queseq.slice(0, oldIndex).concat(the_queseq.slice(oldIndex + 1))
        the_queseq = arr_.slice(0, newIndex).concat([value, ...arr_.slice(newIndex)])

        state.que_seq = the_queseq
        state.isSaved = false
      }
    },

    updateRes: (state, action: PayloadAction<{ id: number, res: string[] }>) => {
      let key = action.payload.id.toString()
      let res = action.payload.res

      if (key) {
        if (state.questions[key] && Array.isArray(res)) {
          let ques_type = state.questions[key].ques_type
          switch (ques_type) {
            case 'short':
              if (res.length !== 1 || res[0].length > 30) {
                return
              }
              break
            case 'long':
              if (res.length !== 1 || res[0].length > 100) {
                return
              }
              break
          }
          state.responses[key] = action.payload.res
        }
      }
    }
  }
})

export const {
  initQue, addQue,
  deleteQue, editQue, saveQue,
  changeSelectedQue,
  functionForSorting,
  queSeqSaved,
  updateRes
} = queSlice.actions

export default queSlice.reducer