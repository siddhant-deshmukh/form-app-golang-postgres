import { useDispatch, useSelector } from "react-redux"
import { RootState } from "./app/store"
import { Auth } from "./components/Auth"
import { IFormSnippet, IUser } from "./types/types"
import axios, { AxiosError } from "axios"
import { useEffect, useState } from "react"
import { editFormIdList, setUserInfo } from "./features/appState"
import { Route, Routes } from "react-router-dom"
import Home from "./routes/Home"
import { EditForm } from "./routes/EditForm"
import SubmitForm from "./routes/SubmitForm"

function App() {

  const dispatch = useDispatch()
  const [loading, setLoading] = useState<boolean>(true)
  const appState = useSelector((state: RootState) => state.app)

  useEffect(() => {
    GetUserData().then((res) => {
      console.log(res, res?.user)
      if (res) {
        dispatch(setUserInfo(res.user))
        dispatch(editFormIdList(res.forms))
      }
    }).finally(() => {
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className='fixed w-screen h-screen left-0 top-0 flex items-center'>
        <div className='mx-auto flex flex-col'>
          <img src={'/google-form.svg'} className='w-32 h-40 mx-auto' />
          <h1 className='mx-auto w-fit font-bold text-2xl text-purple-400'>GoogleFormClone</h1>
          <h3 className='mx-auto w-fit text-gray-500 mt-10 text-sm'>Loading</h3>
        </div>
      </div>
    )
  }
  if (appState.user.id) {
    return (
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/form/:formId/edit" element={<EditForm />} />
          {/* <Route path="/demo" element={<EditForm />} />
        <Route path="/form/:formId/preview" element={<EditForm />} />
        */}
          <Route path="/form/:formId" element={<SubmitForm />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </>
    )
  } else {
    return (
      <>
        <div>
          {
            JSON.stringify(appState.user)
          }
        </div>
        <Auth />
      </>
    )
  }
}

async function GetUserData(): Promise<undefined | { user: IUser, forms: IFormSnippet[] }> {
  //@ts-ignore
  return await axios.get(`${import.meta.env.VITE_API_URL}/u/`, {
    withCredentials: true,

  }).then((res) => {
    if (res.status === 200) {
      // console.log(res.status, res.data)
      return res.data as {
        user: IUser,
        forms: IFormSnippet[]
      }
    }
  }).catch((err: AxiosError) => {
    console.error("While getting the user data", err.response?.status, err.response?.data)
  })
}


export default App
