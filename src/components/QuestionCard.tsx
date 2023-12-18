import { CheckedState } from '@radix-ui/react-checkbox';
import { BookmarkIcon, CheckIcon, PaperPlaneIcon } from '@radix-ui/react-icons';
import {
  Badge,
  Box,
  Button,
  Card,
  Checkbox,
  Flex,
  RadioGroup,
  Strong,
  Text,
} from '@radix-ui/themes';
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

import { IPrompt, IResult } from '@/app/interfaces/questions/Answers.interface';

type IQnCardProps = {
  qnData: IResult;
  newQnToggle: boolean;
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
        <Text
          key={index}
          as='label'
          size='2'
          className='rounded-md border-2 p-3'
        >
          <Flex>
            <Checkbox
              defaultChecked={false}
              onCheckedChange={(checked) => {
                const mappedChoice = String.fromCharCode(97 + index);
                updateUserAns(checked, mappedChoice);
              }}
            />
            <div
              className='pl-3'
              dangerouslySetInnerHTML={dangerouslySetInnerHTMLObject}
            />
          </Flex>
        </Text>
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
  }

  function renderHTML(html: string) {
    const dangerouslySetInnerHTMLObject = { __html: html };
    return dangerouslySetInnerHTMLObject;
  }

  return (
    <div key={qnUniqueKey}>
      <Card className='max-w-4xl'>
        <div className='flex flex-col space-y-4 p-2'>
          {/* question */}
          <Text className='font-semibold' size='3'>
            {qnData.question_plain}
          </Text>

          {/* options */}
          <div className='p1-2'>
            <Text className='flex flex-col gap-2 text-2xl font-medium'>
              {renderMultipleChoice(qnData.prompt.answers)}
            </Text>
          </div>

          {/* submit button */}
          <Button className='flex w-fit self-end' onClick={submitAns}>
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
