
export interface IQuestions {
  id: number,
  question: string,
  options: optionsType,
  answer: string
}

export type optionsType = string[]

export type currentQuestionType = {
  correctOption: string
  isCorrect: boolean,
  question: string,
  selectedOption: string
}


