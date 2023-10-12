import { IQuestion } from "../../../types/types"

export function MCQ(
  { question, changeRes, queKey, queRes }: {
    queKey: number,
    queRes:string[] ,
    question: IQuestion,
    changeRes: (queKey: number, response: string[], ques_type: IQuestion['ques_type']) => void
  }
) {
  return (
    <div className='flex flex-col space-y-4 text-sm '>
      {
        question.options &&
        question.options.map((str, index) => {
          return (
            <div className="flex items-center space-x-2" key={index}>
              {/* {
                JSON.stringify(queRes)
              } */}
              <input
                name={queKey.toString()}
                value={str}
                id={queKey + str}
                type={'radio'}
                checked={(queRes?.length > 0 && queRes[0]===str)}
                onClick={()=>{
                  if(queRes[0]===str)changeRes(queKey, [], 'mcq')
                  else changeRes(queKey, [str], 'mcq')
                }}
                
                className="w-4 h-4 text-blue-600 shadow-none bg-gray-100 border-gray-300 rounded  dark:bg-gray-600 dark:border-gray-500" />
              <label htmlFor={queKey + index.toString()} className="ml-2 text-sm font-medium text-gray-900 ">{str}</label>
            </div>
          )
        })
      }
    </div>
  )
}