import React, { useEffect } from "react"
import { IQuestion } from "../../../types/types"
import { useDispatch } from "react-redux"
import { updateRes } from "../../../features/queState"
import Checkbox from "./Checkbox"
import { MCQ } from "./MCQ"
import { ShortAns } from "./ShortAns"
import { LongAns } from "./LongAns"
import DropDown from "./Dropdown"

const QuestionElement = (
  { question, queKey, queRes }: {
    queKey: number,
    queRes: string[] | undefined,
    question: IQuestion,
  }
) => {

  const dispatch = useDispatch()

  useEffect(() => {
    if (!queRes) {
      dispatch(updateRes({ id: queKey, res: [] }))
    }
  }, [])

  
  const changeRes = (queKey: number, response: string[]) => {
    dispatch(updateRes({ id: queKey, res: response }))
  }
  if (question) {
    return (
      <div
        className={`w-full pt-2 pb-4 px-3 bg-white rounded-lg `}
      >
        <h3
          className=''
        >
          {question.title}
          {question.is_required && <span className='font-medium text-red-500'>*</span>}
        </h3>
        <div className='py-2 px-2'>
          {
            question.ques_type === 'dropdown' && queRes &&
            <DropDown queKey={queKey}
              question={question} queRes={queRes} changeRes={changeRes} />
          }
          {
            question.ques_type === 'checkbox' && queRes &&
            <Checkbox queKey={queKey}
              question={question} queRes={queRes} changeRes={changeRes} />
          }
          {
            question.ques_type === 'mcq' && queRes &&
            <MCQ queKey={queKey}
              question={question} queRes={queRes} changeRes={changeRes} />
          }
          {
            (question.ques_type === 'long')  &&
            <LongAns queKey={queKey}
               changeRes={changeRes} />
          }
          {
            (question.ques_type === 'short')  &&
            <ShortAns queKey={queKey}
               changeRes={changeRes} />
          }
        </div>
      </div>
    )
  } else {
    return (
      <div></div>
    )
  }
}

export default React.memo(QuestionElement)
