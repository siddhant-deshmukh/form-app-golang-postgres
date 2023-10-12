import { FormTitleDesc } from '../FormEditor/FormTitleDesc'
import { useSelector } from 'react-redux'
import { RootState } from '../../app/store'
import QuestionElement from './Question'
import { IResponse } from '../../types/types'


export const Form = ({ submitForm }: {
  submitForm?: (responses: IResponse) => void
}) => {

  const que = useSelector((state: RootState) => state.questions)
  const que_seq = que.que_seq
  const questions = que.questions

  const responses = useSelector((state: RootState) => state.questions.responses)


  return (
    <div className="flex flex-col w-screen h-screen bg-purple-100" style={{ minWidth: '352px' }}>
      <div className='relative px-2 my-2 flex  space-x-2 pr-3 w-full max-w-3xl  mx-auto  '>
        <div className='w-full h-full '>
          <FormTitleDesc readOnly={true} />
          <div
            id='sortable'
            className='flex flex-col  my-3 space-y-2 w-full '
          >
            {questions !== null && que_seq !== null && responses &&
              que_seq.map((queKey) => {
                let question = questions[queKey.toString()]
                let queRes = responses[queKey.toString()]
                if (!queKey) return;
                return (
                  <QuestionElement key={queKey.toString()} queKey={queKey}
                    question={question} queRes={queRes} />
                )
              })
            }

            {
              submitForm &&
              <button
                type={'submit'}
                className='px-3 py-1 bg-purple-200'
                onClick={(event) => {
                  event.preventDefault();
                  submitForm(responses)
                  // console.log({ res }); submitForm(quesReses, questions) 
                }}
              >
                Submit
              </button>}
          </div>

          {/* <div>
            {
              JSON.stringify({ aboutForm, que_seq })
            }
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default Form 