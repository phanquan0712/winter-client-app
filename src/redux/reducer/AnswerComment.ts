import { ANSWER_COMMENT, IAnswerComment, IAnswerCommentType } from "../types/commentType"
import { IUser, IComment } from "../../utils/Typescript"


const initState: IAnswerComment = {
   isAnswer: false,
   comment: {} as IComment,
   replyComment: {} as IComment,
   isAnswerCommentAnswer: false
}

const answerComment = (state: IAnswerComment = initState, action: IAnswerCommentType) => {
   switch (action.type) {
      case ANSWER_COMMENT:
         return action.payload
      default:
         return state
   }
}

export default answerComment