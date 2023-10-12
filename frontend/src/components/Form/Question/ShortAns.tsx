import { IQuestion } from "../../../types/types";

export function ShortAns({ changeRes, queKey }: {
  queKey: number,
  changeRes: (queKey: number, response: string[], ques_type: IQuestion['ques_type']) => void
}) {
  return (
    <div
      className="outline-none w-full h-fit  p-1 "
      placeholder={'Your Answer'}
    >
      <input
        className='border-b-2 border-b-black w-80 outline-none'
        type={'text'}
        maxLength={70}
        onChange={(event) => {
          if(event.target.value.length >= 300) return;
          changeRes(queKey, [event.target.value], 'short')
        }}>
      </input>
    </div>
  )
}