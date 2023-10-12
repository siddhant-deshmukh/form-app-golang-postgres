import axios, { AxiosError } from "axios";
import { Navbar } from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { addFormId, setMsg } from "../features/appState";
import { Msgs } from "../components/Msgs";
import { RootState } from "../app/store";
import { FormCard } from "../components/FormCard";

export default function Home() {

  const dispatch = useDispatch()
  const forms = useSelector((state : RootState)=>state.app.forms)

  function createNewForm(){
    //@ts-ignore
    axios.post(`${import.meta.env.VITE_API_URL}/f/`, {
      "title" : "Untitled Form",
    }, {withCredentials : true})
      .then((res)=>{
        if(res.status === 201 && res.data.form && res.data.form.id){
          dispatch(addFormId(res.data.form.id))
          dispatch(setMsg({msg : "Form created successfully!", msgType: "sucess"}))
        } else {
          dispatch(setMsg({msg : "Some error occured while creating form", msgType: "err"}))
        }
      }).catch((err : AxiosError)=>{
        dispatch(setMsg({msg : "Some error occured while creating form", msgType: "err"}))
        console.error("While creating new form", err.response?.status, err.response?.data)
      })
  }

  return (
    <div className='fixed w-screen h-screen left-0 top-0 overflow-y-auto'>

      <Msgs />
      <Navbar />
      <main className='w-full'>

        <div className='w-full bg-gray-100 py-2  px-5 flex'>
          <div className='mx-auto w-full xl:w-4/6'>
            <p className='mb-2 ml-1 font-sans'>Create new form</p>
            <button
              className='w-52 h-40 border border-gray-300 overflow-hidden'
              onClick={(event) => { event.preventDefault(); createNewForm() }}>
              <img className='w-full h-full' src="https://ssl.gstatic.com/docs/templates/thumbnails/forms-blank-googlecolors.png" alt="+" />
            </button>
            <p className='my-0.5 ml-1 text-sm'>Blank</p>
          </div>
        </div>

        <div className='mx-auto  py-3 bg-white w-full px-3 sm:w-fit'>
          <h3 className='font-medium'>Your Forms</h3>
          <div className='w-full mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-8'>
            { 
              forms.map((form) => {
                if (form) {
                  return (
                    <FormCard key={form.id} form={form}/>
                  );
                }
              })
            }
          </div>

        </div>
      </main>
    </div>
  )
}