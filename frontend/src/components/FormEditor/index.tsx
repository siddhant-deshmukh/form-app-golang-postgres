import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../app/store'
import { addQue, queSeqSaved, saveQue } from '../../features/queState'
import { FormTitleDesc } from './FormTitleDesc'
import SortableQueList from './SortableQueList'
import { createNewQuestion, updateFormTitleDesc, updateQueSeq, updateQuestionChanges } from '../../utils/questionController'
import { setMsg } from '../../features/appState'
import { IQuestion } from '../../types/types'

// formId, selectQuestionRef
export const FormEditor = (
  { selectQuestionRef }: {
    formId: string | undefined,
    selectQuestionRef: React.MutableRefObject<HTMLDivElement | null>
  }
) => {
  // const [savingChanges, setSaving] = useState<boolean>(false)
  const [copyPaperLink, setCopyLink] = useState<boolean>(false)

  const formData = useSelector((state: RootState) => state.form.form)
  const formId = formData.id
  const que_seq = useSelector((state: RootState) => state.questions.que_seq)
  const questions = useSelector((state: RootState) => state.questions.questions)
  const selected_que = useSelector((state: RootState) => state.questions.selected_que)
  // const allQuestions = useSelector((state: RootState) => state.questions.questions)


  const dispatch = useDispatch()

  const addQuestion = async (indexAt: number) => {
    const { status, que } = await createNewQuestion({ title: "Untitled Question", form_id: formId }, indexAt)
    if (status === 201 && que) {
      dispatch(addQue({ index: indexAt, question: que }));
    } else {
      dispatch(setMsg({ msgType: "err", msg: `Something went wrong while creating question (${status})` }))
    }
  }
  const saveForm = async (que_seq: number[], questions: { [key: string]: IQuestion }) => {
    if(!formId){
      return
    }
    let status
    status = await updateFormTitleDesc(formId, formData.title, formData.description)
    if (status !== 200) {
      dispatch(setMsg({msgType : 'err', msg : 'while updating questions'}))
      return
    }

    const promiseArr = Object.keys(questions).map(async (queKey) : Promise<number> => {
      const question = questions[queKey]
      if(question && question.isSaved === false){
        const status = await updateQuestionChanges(question)
        if (status === 200) {
          dispatch(saveQue(question.id))
        } else {
          return -2
        }
        return (status)?status:-1
      }
      return -1
    })
    
    const statusArr = await Promise.all(promiseArr)
    let bool = false
    statusArr.forEach((status)=>{
      if(status === -2){
        setMsg({msgType : 'err', msg : 'while saving the unsaved questions'})
        bool = true
      }
    })
    if(bool) return 

    if(formId){
      const status = await updateQueSeq(que_seq, formId)
      if (status === 200) {
        dispatch(queSeqSaved())
        dispatch(setMsg({msgType : 'sucess', msg : 'questions saved'}))
      } else {
        dispatch(setMsg({msgType : 'err', msg : 'while updating questions'}))
      }
    }
  }
  return (
    <div className='relative  my-2 flex px-0.5 space-x-2 pb-10  w-full  max-w-[600px]  slg:max-w-[700px]  mx-auto '>
      <div className='w-full h-full  '>
        < FormTitleDesc />
        <SortableQueList selectQuestionRef={selectQuestionRef} />

        <button
          className='px-3 py-1 bg-purple-200 '
          // disabled={form_saved}
          onClick={(event) => {
            event.preventDefault();
            // setSaving(true)
            console.log(que_seq)
            saveForm(que_seq, questions) 
          }}>
          Submit
        </button>
      </div>

      {/* //* Side Button to add new question */}
      <div className='side-button absolute  hidden sm:flex flex-col space-y-2  w-fit py-2 px-1 rounded-lg h-20 bg-white  border border-gray-200'>
        <button
          className='w-fit mx-auto rounded-full p-0.5  hover:bg-gray-100'
          onClick={(event) => {
            event.preventDefault();
            let ind = (selected_que) ? que_seq.indexOf(selected_que) : que_seq.length
            ind = (ind < 0) ? que_seq.length : ind
            addQuestion(ind + 1)
          }}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 rounded-full border-2 border-gray-500 ">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
          </svg>
        </button>
        <button
          className='relative w-fit mx-auto rounded-full p-0.5  hover:bg-gray-100'
          onClick={(event) => {
            event.preventDefault();
            navigator.clipboard.writeText(window.location.href)
            setCopyLink(true)
            setTimeout(() => {
              setCopyLink(false)
            }, 1000)
          }}>
          {
            !copyPaperLink &&
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 p-0.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
            </svg>
          }
          {
            copyPaperLink &&
            <svg xmlns="http://www.w3.org/2000/svg" fill="#30912f" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          {
            copyPaperLink &&
            <div className='absolute w-fit inline-flex -bottom-10 -left-5 p-1 bg-gray-600 text-white text-xs'>
              Link&nbsp;Copied!
            </div>
          }
        </button>
      </div>
      {/* //* Side Button to add new question in sm mode*/}
      <button
        className='w-fit sm:hidden fixed bottom-5 right-4 mx-auto rounded-full p-2 bg-purple-600 text-white hover:bg-purple-500'
        onClick={(event) => {
          event.preventDefault();
          let ind = (selected_que) ? que_seq.indexOf(selected_que) : que_seq.length
          ind = (ind < 0) ? que_seq.length : ind
          addQuestion(ind)
        }}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
        </svg>
        <div className='opacity-40 '></div>
      </button>

      <button
        className='w-fit sm:hidden fixed bottom-20 right-4 mx-auto rounded-full p-2 bg-purple-600 text-white hover:bg-purple-500'
        onClick={(event) => {
          event.preventDefault();
          navigator.clipboard.writeText(window.location.href)
        }}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
        </svg>
        <div className='opacity-40 '></div>
      </button>

    </div>
  )
}
