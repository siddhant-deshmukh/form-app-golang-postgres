import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { DndItem, DndList } from '../../types/sortable-hoc';
import { RootState } from '../../app/store';
import { functionForSorting } from '../../features/queState';
import QuestionFormElement from './EditQuestion'

const SortableQueList = ({ selectQuestionRef }: {
  selectQuestionRef: React.MutableRefObject<HTMLDivElement | null>
}) => {

  const dispatch = useDispatch()
  const onSortEnd = ({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }): void => {
      dispatch(functionForSorting({ oldIndex, newIndex }))
  }

  const ques = useSelector((state : RootState)=> state.questions)
  const que_seq = useSelector((state : RootState)=> state.questions.que_seq)
  const questions = ques.questions
  const selected_que = ques.selected_que

  return (

      <DndList
          lockAxis="y"
          lockToContainerEdges={true}
          useDragHandle
          onSortEnd={onSortEnd}
          className="itemsContainer"
      >
          {questions && que_seq.map((id, index: number) => {
              let isSelected = (selected_que === id) ? 'true' : 'false'
              
              let question = questions[id]
              if (!question) return <></>
              else {
                return (
                    <DndItem key={id} index={index} className="item my-2">
                        <QuestionFormElement
                            queKey={id}
                            question={question}
                            isSelected={isSelected}
                            selectQuestionRef={selectQuestionRef}
                        />
                    </DndItem>
                )
              }
          })}
      </DndList>

  )
}

export default SortableQueList