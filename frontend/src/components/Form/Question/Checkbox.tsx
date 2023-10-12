import { IQuestion } from '../../../types/types'

function Checkbox(
  { question, changeRes, queKey, queRes }: {
    queKey: number,
    queRes: string[],
    question: IQuestion,
    changeRes: (queKey: number, response: string[], ques_type: IQuestion['ques_type']) => void
  }
) {
  return (
    <ul className='flex flex-col space-y-2 text-sm '>
      {
        question.options &&
        question.options.map((str, index) => {
          return (
            <li>
              <div className="flex items-center space-x-2">
                {/* {
                  JSON.stringify(queRes)
                } */}
                <input
                  id={queKey + str}
                  type="checkbox"
                  value={`str`}
                  checked={queRes?.includes(str)}
                  onChange={() => {
                    if (queRes?.includes(str)) {
                      let x = queRes.indexOf(str)
                      changeRes(queKey, queRes.slice(0, x).concat(queRes.slice(x + 1)), 'checkbox')
                    } else {
                      changeRes(queKey, [...queRes, str], 'checkbox')
                    }
                  }}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded   dark:bg-gray-600 dark:border-gray-500" />
                <label htmlFor={queKey + index.toString()} className="ml-2 text-sm font-medium text-gray-900 ">{str}</label>
              </div>
            </li>
          )
        })
      }
    </ul>
  )
}

export default Checkbox