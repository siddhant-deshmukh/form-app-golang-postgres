import axios from "axios"
import { useEffect } from "react"
import { useParams } from "react-router-dom"
import Form from "../components/Form"
import { useDispatch } from "react-redux"
import { IResponse } from "../types/types"
import { GetForm, GetFormQuestions } from "../utils/questionController"
import { selectForm } from "../features/formState"
import { setMsg } from "../features/appState"
import { initQue } from "../features/queState"
import { Msgs } from "../components/Msgs"


function SubmitForm() {
  const { formId } = useParams()
  const dispatch = useDispatch()
  
  const submitForm = (responses : IResponse) => {
    //@ts-ignore
    axios.post(`${import.meta.env.VITE_API_URL}/r/${formId}`, {
      answers : responses
    }, { withCredentials: true })
      .then(() => {
        dispatch(setMsg({msgType : "sucess", msg : "response sended!"}))
      })
      .catch(err => {
        dispatch(setMsg({msgType : "err", msg : "Failed to send response!"}))
        console.log("Failed", err)
      })
  }


  useEffect(() => {
    if (formId) {
      GetForm(formId)
        .then((res) => {
          if (res) {
            console.log( "FormId GetForm", res)
            dispatch(selectForm(res.form))
          } else {
            dispatch(setMsg({ msg: 'While getting form data', msgType: 'err' }))
          }
        })
        .catch((err) => {
          dispatch(setMsg({ msg: 'While getting questions', msgType: 'err' }))
          console.error("While getting form data from useefect", err)
        })
      GetFormQuestions(formId)
        .then((res) => {
          if (res) {
            console.log( "Questions", res)
            dispatch(initQue(res))
          } else {
            dispatch(setMsg({ msg: 'While getting questions', msgType: 'err' }))
          }
        })
        .catch((err) => {
          dispatch(setMsg({ msg: 'While getting questions', msgType: 'err' }))
          console.error("While getting questions from useeffect", err)
        })
    }
  }, [formId])

  // useEffect(() => {
  //   if (!formId) {
  //     return
  //   }
  //   axios.get(`${import.meta.env.VITE_API_URL}/f/${formId}?withQuestions=true`, { withCredentials: true })
  //     .then((res) => {
  //       const { data } = res
  //       if (data) {
  //         const formInfo: IForm = data.form
  //         const allQ: IAllFormQuestions = data.questions
  //         console.log("Form data", formId, data)
  //         setQueSeq(formInfo.questions)
  //         for (let ques in allQ) {
  //           allQ[ques].savedChanges = true
  //         }
  //         setAllQues(allQ)
  //         setAboutForm({ title: formInfo.title, desc: formInfo.desc })
  //       }
  //     })
  // }, [])

  return (
    <div className="flex flex-col w-screen h-screen bg-purple-100" style={{ minWidth: '352px' }}>
      <Msgs />
      <Form submitForm={submitForm}/>
    </div>
  )
}

export default SubmitForm 