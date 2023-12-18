'use client';
import { CheckedState } from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';
import { Box, Card, Checkbox, Flex, RadioGroup, Text } from '@radix-ui/themes';
import React, { useEffect, useState } from 'react';

import { IResult } from '@/app/interfaces/questions/Answers.interface';

export default function QuestionCard({ question_plain, prompt }: IResult) {
  const [userAns, setUserAns] = useState<string[]>([]);

  useEffect(() => {
    console.log('🚀  userAns:', userAns);
  }, [userAns]);

  return (
    <Box>
      <Card className='max-w-2xl p-2'>
        <div className='flex flex-col space-y-4'>
          {/* question */}
          <Text className='font-semibold' size='3'>
            {question_plain}
          </Text>

          {/* options */}
          <div className='p1-2'>
            <div className='flex flex-col gap-2'>
              {renderMultipleChoice(prompt.answers, userAns, setUserAns)}
            </div>
          </div>
        </div>
      </Card>
    </Box>
  );
}

function renderMultipleChoice(
  choices: string[],
  userAns: string[],
  setUserAns: React.Dispatch<React.SetStateAction<string[]>>
) {
  return choices.map((answer, index) => {
    // Create a dangerously set inner HTML object
    const dangerouslySetInnerHTMLObject = { __html: answer };

    return (
      <Text key={index} as='label' size='2' className='rounded-md border-2 p-3'>
        <Flex>
          <Checkbox
            onCheckedChange={(checked) => {
              const mappedChoice = String.fromCharCode(97 + index);
              updateUserAns(checked, mappedChoice, userAns, setUserAns);
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

function updateUserAns(
  qnIndexChecked: CheckedState,
  qnChoice: string,
  userAns: string[],
  setUserAns: React.Dispatch<React.SetStateAction<string[]>>
) {
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
