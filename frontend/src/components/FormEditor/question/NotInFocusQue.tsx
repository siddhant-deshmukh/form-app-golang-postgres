import { IQuestion } from "../../../types/types"
import { MultipleChoice } from "../answers/MultipleChoice"

const NotInFocusQue = ({ queKey, question, isSelected }: {
  queKey: number,
  question: IQuestion,
  isSelected: string,
  
}) => {


  return (
    <>
      <div className=''>
        {question.title}
        {
          !question.isSaved &&
          <span style={{ fontSize: '12px' }} className="bg-red-100 text-red-800 text-xs ml-2 font-medium  px-1  rounded dark:bg-blue-900 dark:text-blue-300">unsaved</span>
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
    </>
  )
}

export default NotInFocusQue