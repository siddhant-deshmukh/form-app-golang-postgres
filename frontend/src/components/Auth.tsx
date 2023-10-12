import axios, { AxiosError } from "axios"
import { useCallback, useState } from "react"
import { setUserInfo } from "../features/appState"
import { IUser } from "../types/types"
import { useDispatch } from "react-redux"

export const Auth = () => {

  const [errMsg, setErrMsg] = useState<string>('')
  const [formType, setFormType] = useState<'login' | 'register'>('login')
  const [formState, setFormState] = useState<{ name?: string, email: string, password: string }>({
    name: '', email: '', password: ''
  })

  const dispatch = useDispatch()

  const submitForm = useCallback(() => {
    //@ts-ignore
    axios.post(`${import.meta.env.VITE_API_URL}/${(formType === 'login') ? 'login' : ''}`, {
      ...formState,
    }, {
      withCredentials: true,

    }).then((res) => {
      if (res.status === 200) {
        if (res.data.user && res.data.user.id) {
          console.log(res.data.user, res.data)
          dispatch(setUserInfo(res.data.user as IUser))
        } else {
          setErrMsg("Some error occured (Incorrect format)")
        }
      }
    }).catch((err: AxiosError) => {
      let res = err.response
      switch (res?.status) {
        case (404):
          setErrMsg("Incorrect email")
          break
        case (400):
          setErrMsg("Incorrect format of input")
          break
        case (406):
          setErrMsg("Incorrect password")
          break
        default:
          setErrMsg("Some error occured")
          console.error("While authenticating", res?.status, res?.data)
      }
    })
  }, [formType, formState])

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col  justify-center px-6 py-12 lg:px-8">
        <div className="border-2 sm:mx-auto sm:w-full sm:max-w-md mx-auto p-10 rounded-xl">
          <div className="">
            <img
              className="mx-auto h-10 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              alt="Your Company"
            />
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              {formType === 'login' && <span>Sign in to your account </span>}
              {formType === 'register' && <span>Create new account </span>}
            </h2>
          </div>

          {
            errMsg !== '' && <div className="mt-10 text-sm justify-between flex text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
              <span className="p-3 "> {errMsg} </span>
              <button 
                onClick={() => { setErrMsg('') }}
                className="rounded-full hover:bg-red-100 p-2 my-1 mx-2" >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          }

          <div className="mt-10">
            <form
              className="space-y-6"
              onSubmit={(event) => {
                event.preventDefault()
                submitForm()
              }}>
              {
                formType === 'register' && <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                      Full Name
                    </label>
                  </div>
                  <div className="mt-2">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formState.name}
                      required
                      className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      onChange={(event) => {
                        setFormState((prev) => {
                          return {
                            ...prev,
                            name: event.target.value
                          }
                        })
                      }}
                    />
                  </div>
                </div>
              }
              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formState.email}
                    required
                    className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    onChange={(event) => {
                      setFormState((prev) => {
                        return {
                          ...prev,
                          email: event.target.value
                        }
                      })
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                    Password
                  </label>
                  {/* <div className="text-sm">
                    <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                      Forgot password?
                    </a>
                  </div> */}
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formState.password}
                    required
                    className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    onChange={(event) => {
                      setFormState((prev) => {
                        return {
                          ...prev,
                          password: event.target.value
                        }
                      })
                    }}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  {formType === 'login' && <span>Sign in</span>}
                  {formType === 'register' && <span>Register</span>}
                </button>
              </div>
            </form>

            {
              formType === 'register' &&
              <p className="mt-10 text-center text-sm text-gray-500">
                Already have an account?{' '}
                <button
                  className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                  onClick={() => { setFormType('login') }}>
                  Login
                </button>
              </p>
            }
            {
              formType === 'login' &&
              <p className="mt-10 text-center text-sm text-gray-500">
                Don't have an account?{' '}
                <button
                  className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                  onClick={() => { setFormType('register') }}>
                  Create new account
                </button>
              </p>
            }
          </div>
        </div>
      </div>
    </>

  )
}
