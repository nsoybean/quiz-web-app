'use client';
import { Box, Card, Flex, RadioGroup, Text } from '@radix-ui/themes';
import React, { useEffect, useState } from 'react';

import { IResult } from '@/app/interfaces/questions/Answers.interface';

function renderMultipleChoice(choices: string[]) {
  return choices.map((answer, index) => {
    // Create a dangerously set inner HTML object
    const dangerouslySetInnerHTMLObject = { __html: answer };

    return (
      <Text as='label' size='2' key={index}>
        <Flex gap='2'>
          <RadioGroup.Item value={index.toString()} />
          <div dangerouslySetInnerHTML={dangerouslySetInnerHTMLObject} />
        </Flex>
      </Text>
    );
  });
}

export default function QuestionCard({ question_plain, prompt }: IResult) {
  const [userAns, setUserAns] = useState<string[] | null>(null);

  useEffect(() => {
    console.log('🚀  userAns:', userAns);
  }, [userAns]);

  return (
    <Box>
      <Card className='max-w-lg'>
        <Flex className='flex-col space-y-4'>
          {/* question */}
          <Text size='3'>{question_plain}</Text>

          {/* options */}
          <Flex className='pl-2'>
            <RadioGroup.Root
              defaultValue='0'
              onValueChange={(e) => {
                setUserAns([e]);
              }}
            >
              <Flex gap='2' direction='column'>
                {renderMultipleChoice(prompt.answers)}
              </Flex>
            </RadioGroup.Root>
          </Flex>
        </Flex>
      </Card>
    </Box>
  );
}
