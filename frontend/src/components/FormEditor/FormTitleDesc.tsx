import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../app/store'
import {  setMsg } from '../../features/appState'
import { editAboutForm } from '../../features/formState'

export function FormTitleDesc ({readOnly}:{readOnly?: boolean}) {

  const form = useSelector((state : RootState)=> state.form.form)
  const dispatch = useDispatch()

  
  return (
    <div className='flex flex-col space-y-3 w-full  pt-2 pb-4 px-3 bg-white border-t-8 border-t-purple-800 rounded-lg '>
      <input
        className='text-2xl border-b-2 border-gray-200  outline-none focus:outline-none focus:ease-in focus:duration-300 focus:border-purple-900 py-1 '
        style={{ fontWeight: '500px' }}
        value={form.title || ''}
        placeholder='Untitle Form'
        disabled={(readOnly)?true:false}
        onChange={(event) => {
          event.preventDefault();
          // console.log(event.target.value.length,event.target.value.length > 3 || event.target.value.length <10)
          if(event.target.value.trim().length >= 5 && event.target.value.length <100){
            dispatch(editAboutForm({title: event.target.value}))
          }else{
            dispatch(setMsg({msgType : "err", msg : "title length can not be less than 5 and more than 100"}))
          }
          // else setTitleErr(true)
          // dispatch(setAboutForm({title : event.target.value}))
        }}
      />
      <input
        onFocus={(event) => { event.target.select() }}
        value={form?.description || ''}
        disabled={(readOnly)?true:false}
        placeholder='Form Description'
        className='text-xs border-b-2 border-gray-200  outline-none focus:outline-none focus:ease-in focus:duration-300 focus:border-purple-900 py-1 '
        onChange={(event) => { 
          event.preventDefault(); 
          if(event.target.value.length <= 300) {
            dispatch(editAboutForm({description: event.target.value}))
          }else{
            dispatch(setMsg({msgType : "err", msg : "description length can not be more than 300"}))
          }
          // dispatch(setAboutForm({desc : event.target.value}))
        }}
      />
    </div>
  )
}