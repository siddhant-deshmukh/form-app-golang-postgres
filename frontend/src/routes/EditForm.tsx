import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { RootState } from '../app/store'
import { useDispatch, useSelector } from 'react-redux'
import { Navbar } from '../components/Navbar'

import { FormEditor } from '../components/FormEditor/'
import { Form } from '../components/Form'
import { GetForm, GetFormQuestions } from '../utils/questionController'
import { selectForm } from '../features/formState'
import { setMsg } from '../features/appState'
import { initQue } from '../features/queState'
import { Msgs } from '../components/Msgs'
import { Responses } from '../components/Responses'

export const EditForm = () => {
  const { formId } = useParams()

  const dispatch = useDispatch()
  const que = useSelector((state: RootState) => state.questions)
  const que_seq = que.que_seq

  const [currentState, setCurrentState] = useState<'Edit' | 'Preview' | 'Res'>('Edit')
  const selectQuestionRef = useRef<HTMLDivElement | null>(null)

  // ------------------------------------------------------------------------------------------------------------------
  //* -------                           functions to add and edit questions     ----------------------------------------
  // ------------------------------------------------------------------------------------------------------------------

  useEffect(() => {
    //@ts-ignore
    let timeoutID: NodeJS.Timeout | null = null;
    function EventFun(event: Event) {
      // console.log("The div is scrolled",event.target.scrollTop);
      if (timeoutID) clearTimeout(timeoutID);
      timeoutID = setTimeout(() => {
        let curr_pos = selectQuestionRef.current?.offsetTop    // document.documentElement.style.getPropertyValue("--side-btn-height")
        //@ts-ignore
        let window_pos = event.target.scrollTop
        //@ts-ignore
        let view_window_height = event.target.offsetHeight

        if (curr_pos) {
          if (curr_pos < window_pos + 30) {
            document.documentElement.style.setProperty("--side-btn-height", (window_pos + 30).toString() + "px")
            // console.log('\nset 1',     (window_pos + 30).toString()+"px",'\n')
          } else if (curr_pos > window_pos + view_window_height - 200) {
            document.documentElement.style.setProperty("--side-btn-height", (window_pos + view_window_height - 200).toString() + "px")
            // console.log('\nset 2',    (window_pos + view_window_height - 200).toString()+"px" ,'\n')
          } else {
            document.documentElement.style.setProperty("--side-btn-height", (curr_pos).toString() + "px")
            // console.log('\nset 3',     (curr_pos).toString()+"px"  ,'\n')
          }
        } else {
          document.documentElement.style.setProperty("--side-btn-height", (window_pos + 30).toString() + "px")
        }
        // console.log('curr_pos',curr_pos, '\nwindow_pos' ,window_pos, '\nview_window_height : ',view_window_height,'\n',  document.documentElement.style.getPropertyValue("--side-btn-height"))

        // if(curr_pos)
      }, 100);
    }

    const scrollableDiv = document.querySelector("#scrolling-paper");
    scrollableDiv?.addEventListener("scroll", EventFun);

    return () => {
      scrollableDiv?.removeEventListener('scroll', EventFun)
    }
  }, [])

  useEffect(() => {
    if (formId) {
      GetForm(formId)
        .then((res) => {
          if (res) {
            console.log("FormId GetForm", res)
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
            console.log("Questions", res)
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

  return (
    <div className="flex  flex-col w-screen h-screen bg-purple-100 overflow-hidden" style={{ minWidth: '352px' }}>
      <div className='fixed top-0 left-0 z-20 w-full bg-white hidden sm:block'>
        <Navbar currentState={currentState} setCurrentState={setCurrentState} />
      </div>
      <Msgs />
      <div
        id="scrolling-paper"
        className='w-full relative pt-24 sm:pt-20 justify-center  h-full overflow-y-auto'
      >
        
        <div className='fixed top-0 left-0 z-20 w-full block bg-white sm:hidden'>
          <Navbar />
          <div className='flex space-x-3 mx-auto w-fit h-fit text-sm '>
            <button
              className={`font-medium rounded-full`}
              onClick={(event) => { event.preventDefault(); setCurrentState('Edit') }}
            >Questions
              <div className={`w-full h-1 bg-purple-800 rounded-t-md ${(currentState === 'Edit') ? 'block' : 'hidden'}`}></div>
            </button>
            <button
              className={`font-medium rounded-full`}
              onClick={(event) => { event.preventDefault(); setCurrentState('Res') }}
            >Responses
              <div className={`w-full h-1 bg-purple-800 rounded-t-md ${(currentState === 'Res') ? 'block' : 'hidden'}`}></div>
            </button>
            {/* <button className='font-medium pb-2' >Settings</button> */}
            <button
              className={`font-medium rounded-full`}
              onClick={(event) => { event.preventDefault(); setCurrentState('Preview') }}
            >
              Preview
              <div className={`w-full h-1 bg-purple-800 rounded-t-md ${(currentState === 'Preview') ? 'block' : 'hidden'}`}></div>
            </button>
          </div>
        </div>

        {
          !que_seq &&
          <div className="flex mx-auto w-full max-w-3xl items-center justify-center h-full border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
            <div role="status">
              <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" /><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" /></svg>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        }
        {
          que_seq &&
          <main
            className={` flex space-x-2  w-full  ${(currentState === 'Edit') ? 'block' : 'hidden'}`}
          >
            <FormEditor formId={formId} selectQuestionRef={selectQuestionRef} />
          </main>
        }


        {
          currentState === 'Preview' && <main className={` flex space-x-2 w-full ${(currentState === 'Preview') ? 'block' : 'hidden'}`}>
            <Form />
          </main>
        }

        {
          currentState === 'Res' && <main className={`flex space-x-2 w-full`}>
            <Responses formId={formId}/>
          </main>
        }
      </div>
    </div>
  )
}
