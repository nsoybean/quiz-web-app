export interface IAnswers {
  count: number;
  next: string | null;
  previous: string | null;
  results: IResult[];
}
export interface IResult {
  _class: string;
  id: number;
  assessment_type: string;
  question_plain: string;
  section: string;
  correct_response: string[];
  prompt: IPrompt;
  related_lectures: string[];
}

interface IPrompt {
  question: string;
  relatedLectureIds: string;
  feedbacks: string[];
  explanation: string;
  answers: string[];
}
