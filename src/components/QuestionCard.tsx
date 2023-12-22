'use client';

import { CheckedState } from '@radix-ui/react-checkbox';
import { PaperPlaneIcon } from '@radix-ui/react-icons';
import {
  Badge,
  Box,
  Button,
  Card,
  Checkbox,
  Strong,
  Text,
} from '@radix-ui/themes';
import React, { useEffect, useState } from 'react';

import { IResult } from '../interfaces/questions/Answers.interface';
import { IUserQuizAnswers } from '../interfaces/user/UserAnswer.interface';

type IQnCardProps = {
  quizId: string;
  qnData: IResult;
  newQnToggle: boolean;
  computePassRate: () => void;
};
export default function QuestionCard(props: IQnCardProps) {
  const qnData = props.qnData;
  const newQnToggle = props.newQnToggle;

  const [userAns, setUserAns] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [qnUniqueKey, SetQnUniqueKey] = useState<number | null>(null);

  // reset all states when new question is loaded
  useEffect(() => {
    setUserAns([]);
    setSubmitted(false);
    SetQnUniqueKey(new Date().getTime()); // hack: force component to re-render to reset checkboxes
  }, [newQnToggle]);

  function renderMultipleChoice(choices: string[]) {
    return choices.map((answer, index) => {
      // Create a dangerously set inner HTML object
      const dangerouslySetInnerHTMLObject = { __html: answer };

      return (
        <div key={index} className='flex border-2'>
          <Checkbox
            defaultChecked={false}
            onCheckedChange={(checked) => {
              const mappedChoice = String.fromCharCode(97 + index);
              updateUserAns(checked, mappedChoice);
            }}
          />
          <Text size='2'>
            <div dangerouslySetInnerHTML={dangerouslySetInnerHTMLObject} />
          </Text>
        </div>
      );
    });
  }

  function updateUserAns(qnIndexChecked: CheckedState, qnChoice: string) {
    if (qnIndexChecked) {
      setUserAns((prev) => {
        return [...prev, qnChoice];
      });
    } else {
      // copy array to enable re-render
      const newUserAns = [...userAns];
      const index = newUserAns.indexOf(qnChoice);
      newUserAns.splice(index, 1);
      setUserAns(newUserAns);
    }
  }

  function submitAns() {
    console.log(
      `🚀 submitted: user_ans:${userAns.sort()}, correct_ans: ${qnData.correct_response.sort()}`
    );
    setSubmitted(true);

    // persist results in local storage
    const quizResult: IUserQuizAnswers = JSON.parse(
      localStorage.getItem(`quiz_${props.quizId}`) || '{}'
    );
    quizResult[qnData.id] =
      JSON.stringify(userAns.sort()) ===
      JSON.stringify(qnData.correct_response.sort());
    localStorage.setItem(`quiz_${props.quizId}`, JSON.stringify(quizResult));

    props.computePassRate();
  }

  function renderHTML(html: string) {
    const dangerouslySetInnerHTMLObject = { __html: html };
    return dangerouslySetInnerHTMLObject;
  }

  return (
    <div key={qnUniqueKey}>
      <Card className='max-w-5xl'>
        <div className='flex flex-col space-y-4 p-2'>
          {/* category */}
          <Text className='font-semibold underline' size='3'>
            {qnData.section}:
          </Text>

          {/* question */}
          <div
            className='font-semibold'
            dangerouslySetInnerHTML={renderHTML(qnData.prompt.question)}
          />

          {/* options */}
          <div>{renderMultipleChoice(qnData.prompt.answers)}</div>

          {/* submit button */}
          <Button className='w-fit self-end' onClick={submitAns}>
            <PaperPlaneIcon width='16' height='16' /> Submit
          </Button>
        </div>
      </Card>

      {submitted && (
        <div className='mt-8 max-w-4xl space-y-4'>
          {JSON.stringify(userAns.sort()) ===
          JSON.stringify(qnData.correct_response.sort()) ? (
            <Badge color='green' size='2'>
              Correct
            </Badge>
          ) : (
            <Badge color='red' size='2'>
              Incorrect
            </Badge>
          )}

          <Box className='flex w-fit flex-row'>
            <Strong> Correct Ans:</Strong>
            {qnData.correct_response.map((item) => (
              <div key={item} className='pl-1'>
                {item},
              </div>
            ))}
          </Box>
          <div
            className='mt-3'
            dangerouslySetInnerHTML={renderHTML(qnData.prompt.explanation)}
          />
        </div>
      )}
    </div>
  );
}
