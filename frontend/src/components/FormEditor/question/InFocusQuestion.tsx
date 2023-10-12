import {  useState } from "react";
import { useDispatch } from "react-redux";
import { IQuestion } from "../../../types/types";
import { editQue } from "../../../features/queState";
import SelectQueTypeList, { ansTypesStates } from "./QueUtil";
import { MultipleChoice } from "../answers/MultipleChoice";
import QuestionFooter from "./QuestionFooter";

export const InFocusQuestion = ({ queKey, question, isSelected, setErrors }: {
  queKey: number,
  question: IQuestion,
  isSelected: string,
  setErrors: React.Dispatch<React.SetStateAction<{
    titleLen: boolean;
    optionsLen: boolean;
    optionsNum: boolean;
    numUploads: boolean;
  }>>
}) => {

  const dispatch = useDispatch()
  const [chooseAnsTypeToggle, setChooseAnsTypeToggle] = useState<boolean>(false)

  const changeAnsType = (prevType: IQuestion['ques_type'], selectedType: IQuestion['ques_type']) => {
    setChooseAnsTypeToggle(false)
    if (prevType === selectedType) return;
    if (selectedType === 'checkbox' || selectedType === 'mcq' || selectedType === 'dropdown') {
      if (!(prevType === 'checkbox' || prevType === 'mcq' || prevType === 'dropdown') || !question.options) {
        // editQuestion(queKey, { ...question, ans_type: selectedType, optionsArray: ['Option 1'], correct_ans: undefined })
        dispatch(editQue({
          id: queKey,
          question: {
            ...question,
            ques_type: selectedType,
            options: ['Option 1'],
            correct_ans: undefined
          }
        }))
      } else {
        dispatch(editQue({
          id: queKey,
          question: {
            ...question,
            ques_type: selectedType,
          }
        }))
      }
    } else if (selectedType === 'short' || selectedType === 'long') {
      dispatch(editQue({
        id: queKey,
        question: {
          ...question,
          ques_type: selectedType,
          options: undefined,
          correct_ans: undefined
        }
      }))
    } else {

    }
  }

  // useEffect(()=>{
  //   if(!question.options){
  //     dispatch(editQue({
  //       id: queKey,
  //       question: {
  //         ...question,
  //         options: ['Option 1'],
  //         correct_ans: undefined
  //       }
  //     })) 
  //   }
  // },[])
  return (
    <>
      <div className='flex flex-col space-y-3 w-full ' >

        <div className='flex w-full  items-center justify-between space-x-4'>
          <input
            onFocus={(event) => { event.target.select() }}
            className='py-3 pl-3 font-normal text-sm w-full bg-gray-100 border-b-2 border-gray-200  outline-none focus:outline-none focus:ease-in focus:duration-300 focus:border-purple-900 '
            placeholder={'Question'}
            value={question.title}
            onChange={(event) => {
              event.preventDefault();

              dispatch(editQue({
                id: queKey,
                question: {
                  ...question,
                  title: event.target.value
                }
              }))
              if (event.target.value.length > 50 || event.target.value.length < 3) {
                setErrors((prev) => {
                  return { ...prev, titleLen: true }
                })
              } else {
                setErrors((prev) => {
                  return { ...prev, titleLen: false }
                })
              }
            }}
          />
          {/* after sm mode this will be visible */}
          {/* Select ans type */}
          <div className='relative w-48 hidden sm:block'>
            {
              !chooseAnsTypeToggle &&
              <button
                onClick={(event) => { event.preventDefault(); setChooseAnsTypeToggle(true) }}
                className='w-full items-center flex border border-gray-300 p-2  justify-between'>

                { ansTypesStates[question.ques_type].svg }

                <span className='w-full text-xs text-left pl-2'>{ansTypesStates[question.ques_type].text}</span>

                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
            }
            {
              chooseAnsTypeToggle &&
              <SelectQueTypeList ansType={question.ques_type} changeAnsType={changeAnsType} />
            }
          </div>
        </div>
        {/* in sm mode this will be visible */}
        {/* Select ans type */}
        <div className='relative w-40 text-xs block sm:hidden'>
          {
            !chooseAnsTypeToggle &&
            <button
              onClick={(event) => { event.preventDefault(); setChooseAnsTypeToggle(true) }}
              className='w-full items-center flex border border-gray-300 p-2  justify-between'>

              {ansTypesStates[question.ques_type].svg}

              <span className='w-full text-xs text-left pl-2'>{ansTypesStates[question.ques_type].text}</span>

              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
          }
          {
            chooseAnsTypeToggle &&
            <SelectQueTypeList ansType={question.ques_type} changeAnsType={changeAnsType} />
          }
        </div>

        {
          question.description &&
          <input
            onFocus={(event) => { event.target.select() }}
            className='text-xs border-b-2 border-gray-200  outline-none focus:outline-none focus:ease-in focus:duration-300 focus:border-purple-900 py-1 '
            placeholder={'Description'}
            value={question.description}
            onChange={(event) => {
              event.preventDefault();
              dispatch(editQue({
                id: queKey,
                question: {
                  ...question,
                  description: event.target.value
                }
              }))
            }} />
        }
      </div>



      {/*------------------------------------ Ans as per type -------------------------------------------------------- */}
      <div className='w-full flex flex-col space-y-2'>
        {
          (question.ques_type === 'mcq' || question.ques_type === 'checkbox' || question.ques_type === 'dropdown') &&
          <MultipleChoice queKey={queKey} question={question} isSelected={(isSelected === 'true')} />
        }
        {
          (question.ques_type === 'short' || question.ques_type === 'long') &&
          <div className=' w-80 mt-2 mb-3  px-4'>
            <input
              disabled
              onFocus={(event) => { event.target.select() }}
              className='text-xs bg-white  w-full border-b-2  border-b-gray-200 text-gray-700  outline-none focus:outline-none focus:ease-in focus:duration-300 focus:border-purple-900 py-1 '
              defaultValue={(question.ques_type === 'short') ? '  Short Answer' : '  Long Answer'} />
          </div>
        }
      </div>
      
      <QuestionFooter
        queKey={queKey}
        question={question}
      />
    </>
  )
}