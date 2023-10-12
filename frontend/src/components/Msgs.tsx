import { useEffect } from 'react';
import { RootState } from '../app/store';
import { removeMsg } from '../features/appState';
import { useDispatch, useSelector } from 'react-redux';

export const Msgs = () => {

  const dispatch = useDispatch()
  const msgs = useSelector((state: RootState) => state.app.msgs)

  useEffect(()=>{
    if(msgs.sucessMsg !== ''){
      setTimeout(()=>{
        dispatch(removeMsg('sucess'))
      }, 3000)
    }
    if(msgs.warnMsg !== ''){
      setTimeout(()=>{
        dispatch(removeMsg('warn'))
      }, 5000)
    }
    if(msgs.errMsg !== ''){
      setTimeout(()=>{
        dispatch(removeMsg('err'))
      }, 10000)
    }
  },[msgs])

  return (
    <div className='absolute z-50 w-full h-fit top-5'>
      <div className='mx-auto max-w-xl'>
        {
          msgs.warnMsg !== '' &&
          <div className="flex justify-between p-4 mb-4 shadow-lg font-semibold text-sm border border-yellow-200 text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300" role="alert">
            <span>{msgs.warnMsg}</span>
            <button onClick={(event) => { event.preventDefault(); dispatch(removeMsg('warn')) }} className="px-2 ">X</button>
          </div>
        }
        {
          msgs.errMsg !== '' &&
          <div className="flex justify-between p-4 mb-4 shadow-lg font-semibold text-sm border border-red-200 text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-300" role="alert">
            <span>{msgs.errMsg}</span>
            <button onClick={(event) => { event.preventDefault(); dispatch(removeMsg('err')) }} className="px-2 ">X</button>
          </div>
        }
        {
          msgs.sucessMsg !== '' &&
          <div className="flex justify-between p-4 mb-4 shadow-lg font-semibold text-sm border border-green-200 text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-300" role="alert">
            <span>{msgs.sucessMsg}</span>
            <button onClick={(event) => { event.preventDefault(); dispatch(removeMsg('sucess')) }} className="px-2 ">X</button>
          </div>
        }
      </div>
    </div>
  )
}
