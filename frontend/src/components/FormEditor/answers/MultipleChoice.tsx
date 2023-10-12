import { useEffect, useMemo, useState } from 'react'
import { IQuestion } from '../../../types/types';
import { useDispatch } from 'react-redux';
import { editQue, functionForSorting } from '../../../features/queState';
import { DndItem, DndList, DndTrigger } from '../../../types/sortable-hoc';

export const MultipleChoice = (
  { queKey, question, isSelected }:
    {
      queKey: number,
      question: IQuestion,
      isSelected: boolean,
    }) => {

  // const [optionState, setOptionsState] = useState<string[]>([]);
  const [correctOptions, setCorrectOptions] = useState<boolean[]>([])

  const dispatch = useDispatch()

  useMemo(() => {
    let oldCorrectOption = Array(question.options?.length).fill(false)
    let correct_ans = question.correct_ans
    if (correct_ans) {
      correct_ans.forEach((correctAns) => {
        let a = question.options?.findIndex((op) => op === correctAns)
        console.log("FOr ,", correctAns, a, correct_ans)
        if (a !== undefined && a !== -1) {
          oldCorrectOption[a] = true
        }
      })
    }

    setCorrectOptions(oldCorrectOption)

  }, [question.correct_ans, question.options])

  useEffect(() => {
    // let new_way = (question?.options || []).map((option) => {
    //   return option
    // })
    // setOptionsState(new_way)
  }, [])


  const onSortEnd = ({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }): void => {
    // setOptionsState((prev) => {
    //   let value = prev[oldIndex]
    //   let arr_ = prev.slice(0, oldIndex).concat(prev.slice(oldIndex + 1))
    //   return arr_.slice(0, newIndex).concat([value, ...arr_.slice(newIndex)])
    // })
    dispatch(functionForSorting({ oldIndex, newIndex, questionId: queKey.toString() }))
  }
  function handleInputChange(index: number, text: string) {
    // setOptionsState((prev) => {
    //   let arr_ = prev.slice()
    //   arr_[index] = text
    //   let newQ : IQuestion = {
    //     ...question,
    //   }
    //   if(newQ.options && Array.isArray(newQ.options)){
    //     dispatch(editQue({id : queKey, question: newQ}))
    //   }
    //   return arr_
    // })
    let newQ: IQuestion = {
      ...question,
    }
    if (newQ.options && Array.isArray(newQ.options)) {
      let arr = newQ.options.slice()
      arr[index] = text
      newQ.options = arr
      dispatch(editQue({ id: queKey, question: newQ }))
    }
  }

  return (
    <div>
      <DndList
        lockAxis="y"
        lockToContainerEdges={true}
        useDragHandle
        onSortEnd={onSortEnd}
        className="itemsContainer"
      >
        {
          question.options?.map((option, index) => {
            return (
              <DndItem index={index} >
                {/* //!Not recomended */}
                <div key={index} className='flex w-full py-2 items-center space-x-2'>

                  <DndTrigger className='w-fit'>
                    {question.ques_type === 'mcq' && <div className='w-4  h-4 hover:cursor-grabbing icon-move mr-1 rounded-full border-2 border-gray-300'></div>}
                    {question.ques_type === 'checkbox' && <div className='w-4 hover:cursor-grabbing icon-move mr-1 h-4  border-2 border-gray-300'></div>}
                    {question.ques_type === 'dropdown' && <div className='w-5 hover:cursor-grabbing icon-move text-sm h-fit'>{index + 1}.</div>}
                  </DndTrigger>

                  <input
                    // onFocus={(event) => { event.target.select() }}
                    value={option}
                    className={`w-full outline-none border-b-2 bg-transparent ${(option.length > 50 || option.length === 0) ? 'border-b-red-700' : 'border-b-white hover:border-b-gray-300 focus:border-b-gray-300 '} `}
                    type="text"
                    onChange={(event) => {
                      event.preventDefault()

                      handleInputChange(index, event.target.value)
                    }}
                  />

                  {
                    question.correct_ans &&
                    <button
                      className={`w-fit  ${(correctOptions[index]) ? 'hover:bg-red-100' : 'hover:bg-green-100'}  rounded-full`}
                      onClick={(event) => {
                        event.preventDefault();
                        // console.log("Old correct ans :",question.correct_ans?.slice(),correctOptions[index])
                        let new_correct_ans = question.correct_ans?.slice() as string[]

                        if (question.ques_type === 'dropdown' || question.ques_type === 'mcq') {
                          if (!correctOptions[index]) {
                            new_correct_ans = [option];
                          } else {
                            new_correct_ans = [];
                          }
                        } else {
                          if (!correctOptions[index]) {
                            new_correct_ans.push(option)
                          } else {
                            const index = new_correct_ans.indexOf(option);
                            new_correct_ans = new_correct_ans.slice(0, index).concat(new_correct_ans.slice(index + 1));
                          }
                        }
                        dispatch(editQue({
                          id: queKey,
                          question: {
                            ...question,
                            correct_ans: new_correct_ans
                          }
                        }))
                        // console.log("new_correct_ans :",new_correct_ans)
                      }}
                    >
                      {
                        correctOptions[index] &&
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-500">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      }
                      {
                        !correctOptions[index] &&
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-red-500">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      }
                    </button>
                  }
                  <button
                    className='w-fit text-sm  px-0.5 py-0.5 rounded-full hover:bg-gray-100'
                    onClick={(event) => {
                      event.preventDefault();
                      // const arr_ = optionState?.slice() || []
                      // if (arr_.length <= 1) return;
                      // const newarr_ = arr_.slice(0, index).concat(arr_.slice(index + 1, arr_.length + 1))
                      // setOptionsState(newarr_)

                      let newQue = { ...question }
                      if (index === 0) {
                        newQue.options = newQue.options?.slice(1)
                      } else {
                        newQue.options = newQue.options?.slice(0, index).concat(newQue.options.slice(index + 1))
                      }
                      dispatch(editQue({ id: queKey, question: newQue }))
                    }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </DndItem>
            )
          })
        }
      </DndList>

      {
        isSelected && question && question.options && question.options.length < 50 && <button
          className='flex items-center space-x-4 text-gray-400'
          disabled={question.options.length >= 50}
          onClick={(event) => {
            event.preventDefault();

            let newQue = { ...question }
            if (newQue.options && Array.isArray(newQue.options)) {
              newQue.options = [ ...newQue.options, 'Option ' + ( newQue.options.length + 1 ).toString()]

              // newQue.options.push('Option ' + newQue.options.length.toString())
            } else {
              newQue.options = ['Option 1']
            }
            dispatch(editQue({ id: queKey, question: newQue }))
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>

          <span>Add option</span>
        </button>
      }
    </div>
  )
}
