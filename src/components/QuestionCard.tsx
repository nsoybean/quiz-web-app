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

export default function QuestionCard({
  question_plain,
  prompt,
  correct_response,
}: IResult) {
  const [userAns, setUserAns] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState<boolean>(false);
  useEffect(() => {
    console.log('🚀  userAns:', userAns);
  }, [userAns]);

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
    console.log('🚀 userAns sort:', userAns.sort());
    console.log('🚀 correctAns sort:', correct_response.sort());
    setSubmitted(true);
  }

  function renderHTML(html: string) {
    const dangerouslySetInnerHTMLObject = { __html: html };
    return dangerouslySetInnerHTMLObject;
  }

  return (
    <div>
      <Card className='max-w-2xl'>
        <div className='flex flex-col space-y-4 p-2'>
          {/* question */}
          <Text className='font-semibold' size='3'>
            {question_plain}
          </Text>

          {/* options */}
          <div className='p1-2'>
            <div className='flex flex-col gap-2'>
              {renderMultipleChoice(prompt.answers)}
            </div>
          </div>

          {/* submit button */}
          <Button className='flex w-fit self-end' onClick={submitAns}>
            <PaperPlaneIcon width='16' height='16' /> Submit
          </Button>
        </div>
      </Card>

      {submitted && (
        <div className='mt-8 max-w-2xl space-y-4'>
          {JSON.stringify(userAns.sort()) ===
          JSON.stringify(correct_response.sort()) ? (
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
            {correct_response.map((item) => (
              <div key={item} className='pl-1'>
                {item},
              </div>
            ))}
          </Box>
          <div
            className='mt-3'
            dangerouslySetInnerHTML={renderHTML(prompt.explanation)}
          />
        </div>
      )}
    </div>
  );
}
