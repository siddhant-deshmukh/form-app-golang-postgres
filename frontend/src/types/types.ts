export interface IFormSnippet {
  id? : number,
  title : string,
  description : string,
  quiz_setting : {
    is_quiz: boolean,
    default_points: number,
  },
  response_setting : {
    collect_email : boolean,
    allow_edit_res : boolean,
    send_res_copy : boolean
  },
  created_at? : string,
  updated_at? : string,
}
export interface IForm extends IFormSnippet {
  question_seq? : IQueSeq['question_seq']
}

export interface IQuestion {
  id : number,
  form_id : number,
  author_id : number,
  title : string,
  ques_type : 'mcq' | 'checkbox' | 'short' | 'long' | 'dropdown' // | 'date' | 'time' | 'eliminated'
  description : string,
  is_required : boolean,
  options? : string[],
  correct_ans? : string[],
  points : number,
  isSaved? : boolean,
}

export interface IQuestions {
  questions : {
    [key : string] : IQuestion
  },
  que_seq : number[],
  isSaved? : boolean,
  selected_que : null | number,
  responses : IResponse
}

export interface IQueSeq {
  id : number,
  author_id : number,
  form_id : number,
  question_seq : number[]
}

export interface IUser {
  id? : number,
  name : string,
  email : string,
  forms? : IFormSnippet[]
}

export interface IAppState {
  user : IUser,
  msgs : {
    errMsg :  string,
    warnMsg :  string,
    sucessMsg : string
  },
  forms : IFormSnippet[]
}

export interface IResponse {
  [ key : string ] : string[]
}