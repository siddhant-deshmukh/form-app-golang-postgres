import axios, { AxiosError } from "axios";
import { IForm, IQuestion, IQuestions } from "../types/types";

export async function createNewQuestion(question: any, indexAt: number) : Promise<{que? : IQuestion, status? : number}> {
  if (indexAt < 0) {
    indexAt = 0
  }

  //@ts-ignore
  return await axios.post(`${import.meta.env.VITE_API_URL}/q/`, {
    ...question,
    index_at: indexAt,
  }, { withCredentials: true }).then((res)=>{
    if(res.status === 201 && res.data && res.data.question){
      // console.info(res.status, res.data)
      return { status : res.status, que : res.data.question  }
    }
    console.error("While creating question", res)
    return { status : res.status }
  }).catch((err : AxiosError)=>{
    let res = err.response
    console.error("While creating question", res)
    return { status : res?.status }
  })
}

export async function updateQuestionChanges(question : IQuestion) : Promise<number | undefined> {

  //@ts-ignore
  return await axios.put(`${import.meta.env.VITE_API_URL}/q/${question.id}`, {
    ...question
  }, { withCredentials: true }).then((res)=>{
    if(res.status === 200){
      return res.status
    } else {
      console.error("While creating question", res)
    }
    return res.status
  }).catch((err : AxiosError)=>{
    let res = err.response
    console.error("While creating question", res)
    return res?.status
  })
}

export async function deleteQuestion(qId : number) : Promise<number | undefined> {
  //@ts-ignore
  return await axios.delete(`${import.meta.env.VITE_API_URL}/q/${qId}`
    ,{ withCredentials: true }).then((res)=>{
    if(res.status === 200){
      return res.status
    } else {
      console.error("While deleting question", res)
    }
    return res.status
  }).catch((err : AxiosError)=>{
    let res = err.response
    console.error("While deleting question", res)
    return res?.status
  })
}

export async function updateQueSeq(que_seq : number[], formId : number) : Promise<number | undefined>{
  //@ts-ignore
  return await axios.post(`${import.meta.env.VITE_API_URL}/f/q/${formId}`, que_seq
    ,{ withCredentials: true }).then((res)=>{
    if(res.status === 200){
      return res.status
    } else {
      console.error("While deleting question", res)
    }
    return res.status
  }).catch((err : AxiosError)=>{
    let res = err.response
    console.error("While deleting question", res)
    return res?.status
  })
}

export async function GetFormQuestions(formId: string): Promise<IQuestions | undefined> {
  //@ts-ignore
  return await axios.get(`${import.meta.env.VITE_API_URL}/f/q/${formId}`, {
    withCredentials: true,
  }).then((res) => {
    if (res.status === 200) {
      return res.data as IQuestions
    } else {
      console.error("While loading questions")
    }
  }).catch((err: AxiosError) => {
    console.error("While getting the user data", err.response?.status, err.response?.data)
  })
}

export async function GetForm(formId: string): Promise<{ form: IForm } | undefined> {
  //@ts-ignore
  return await axios.get(`${import.meta.env.VITE_API_URL}/f/${formId} `, {
    withCredentials: true,
  }).then((res) => {
    if (res.status === 200) {
      return res.data as { form: IForm }
    } else {
      console.error("While loading questions")
    }
  }).catch((err: AxiosError) => {
    console.error("While getting the user data", err.response?.status, err.response?.data)
  })
}

export async function updateFormTitleDesc(formId : number, title? : string, description? : string) : Promise<number | undefined>{
  //@ts-ignore
  return await axios.put(`${import.meta.env.VITE_API_URL}/f/${formId}`, {
    title,
    description
  },{ withCredentials: true }).then((res)=>{
    if(res.status === 200){
      return res.status
    } else {
      console.error("While deleting question", res)
    }
    return res.status
  }).catch((err : AxiosError)=>{
    let res = err.response
    console.error("While deleting question", res)
    return res?.status
  })
}