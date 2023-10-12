import { Link } from 'react-router-dom'
import { IFormSnippet } from '../types/types'

export const FormCard = ({ form }:{ form: IFormSnippet }) => {
  var dateObject
  if(form.updated_at){
    dateObject = new Date(form.updated_at);
    dateObject = dateObject.toLocaleDateString("en-US", {month: 'short', day: 'numeric', year: 'numeric'});
  }
  return (
    <div className="w-auto sm:w-52  h-56 bg-white border border-gray-300 shadow-md  rounded-lg  dark:bg-gray-800 dark:border-gray-700">
      <Link to={`/form/${form.id}/edit`} className="w-full flex h-40 items-center border-b border-b-gray-300">
        <img  className="rounded-t-lg opacity-50 w-full h-full object-fill" src="/google-form.svg" alt="" />
      </Link>
      <div  className="h-16 flex flex-col ">
        <Link to={`/form/${form.id}/edit`} className="">
          <h5 className="overflow-hidden font-medium tracking-tight  w-full px-2 py-1  text-gray-900 dark:text-white">{form.title}</h5>
        </Link>
        {
          dateObject &&
          <p className="overflow-hidden font-normal text-sm tracking-tight  w-full px-2 py-1  text-gray-900 dark:text-white">Updated At: {dateObject}</p>
        }
      </div>
    </div>
  )
}
