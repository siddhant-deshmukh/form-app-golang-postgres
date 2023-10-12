import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../app/store"
import axios, { AxiosError } from "axios"
import { setMsg } from "../features/appState"
import { IQuestion } from "../types/types"

export const Responses = ({ formId }: { formId?: string }) => {
  const dispatch = useDispatch()
  const que = useSelector((state: RootState) => state.questions)
  const que_seq = que.que_seq
  const questions = que.questions

  const importCSV = async (que_seq: number[], questions: { [key: string]: IQuestion }) => {
    if (!formId) return;

    //@ts-ignore
    await axios.get(`${import.meta.env.VITE_API_URL}/r/${formId}`, { withCredentials: true })
      .then((res) => {
        if (res.status === 202 && Array.isArray(res.data.responses)) {
          const responses: { user_email: string, answers: { [key: string]: string[] } }[] = res.data.responses

          const csvRows: string[] = []

          csvRows.push("sr. no,email," + que_seq.join(','))

          let titles = ''
          que_seq.forEach((id) => {
            titles += questions[id.toString()].title + ","
          })
          csvRows.push(",, " + titles.slice(0, -1))

          responses.forEach((r, index) => {
            let ss = ""
            que_seq.forEach((id) => {
              let ques_type = questions[id.toString()].ques_type
              let ans = r.answers[id.toString()]
              if (ques_type === 'checkbox') {
                ss += "[" + ans.join(" ") + "],"
              } else if (ans.length > 0) {
                ss += ans[0] + ","
              } else {
                ss += ","
              }
            })
            csvRows.push((index+1).toString() + "," + r.user_email + "," + ss.slice(0, -1))
          });

          // console.log(csvRows.join('\n'))

          const csvfile = csvRows.join('\n')

          var blob = new Blob([csvfile], { type: 'text/csv;charset=utf-8;' });
          var url = URL.createObjectURL(blob);

          // Create a link to download it
          var pom = document.createElement('a');
          pom.href = url;
          pom.setAttribute('download', 'responses_of_' + formId + ".csv");
          pom.click();
        } else {
          dispatch(setMsg({ msgType: "err", msg: "Error while getting responses" }))
        }
      })
      .catch((err: AxiosError) => {
        let res = err.response
        console.error("While getting responses", res?.status, res?.data)
      })
  }
  return (
    <div className="relative  my-2 flex px-0.5 space-x-2   w-full  max-w-[600px]  slg:max-w-[700px]  mx-auto ">
      <div className="flex w-full container draggable pb-4 px-3 bg-white rounded-lg duration-100 ease-linear">
        <button
          onClick={() => { importCSV(que_seq, questions) }}
          className="border-2 ml-auto mr-5 mt-3 text-sm border-green-500 p-2 rounded-md text-green-800 hover:text-blue-700 hover:border-blue-500"
        >
          Import CSV
        </button>
      </div>
    </div>
  )
}
