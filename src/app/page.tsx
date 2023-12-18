'use client';
import '@radix-ui/themes/styles.css';

import { ArrowLeftIcon, ArrowRightIcon } from '@radix-ui/react-icons';
import {
  Avatar,
  Box,
  Button,
  Card,
  Container,
  Em,
  Flex,
  Heading,
  IconButton,
  Strong,
  Text,
  Theme,
  ThemePanel,
} from '@radix-ui/themes';
import dotenv from 'dotenv';
import { useEffect, useState } from 'react';

import Header from '@/components/Header';
import QuestionCard from '@/components/QuestionCard';

import { IAnswers, IResult } from './interfaces/questions/Answers.interface';

dotenv.config();
import * as data from '../data/test_2/answers.json';
// let data: IAnswers;
// if (process.env.FILEPATH) {
//   console.log('🚀  process.env.FILEPATH:', process.env.FILEPATH);
//   fetch(process.env.FILEPATH)
//     .then((response) => response.json())
//     .then((json) => console.log(json));
// }

export default function Home() {
  const [qnIndex, setQnIndex] = useState<number>(0);
  const [qnData, setQnData] = useState<IResult | null>(null);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    console.log('🚀 qnIndex:', qnIndex);
    if (data) {
      setQnData(data.results[qnIndex]);
    }
  }, [qnIndex]);

  return (
    <Theme>
      <main>
        {/* <Container className='border-1 min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-rose-100 to-teal-100'> */}
        <Container className='min-h-screen'>
          <Flex className='flex-col items-center space-y-4 p-10'>
            {/* Header */}
            <Flex className='flex-col items-center'>
              <Text size='8'>
                <Strong>AWS Quiz </Strong>
              </Text>
              Select your test and start answering questions!
            </Flex>

            {/* Navigation */}
            <Flex className='space-x-2'>
              <IconButton>
                <ArrowLeftIcon
                  onClick={() => {
                    setQnIndex(Math.max(0, qnIndex - 1));
                  }}
                />
              </IconButton>
              <IconButton>
                <ArrowRightIcon
                  onClick={() => {
                    setQnIndex(Math.min(data.results.length - 1, qnIndex + 1));
                  }}
                />
              </IconButton>
            </Flex>

            {/* Card */}
            {qnData && <QuestionCard {...qnData} />}

            {/* theme panel */}
            <ThemePanel />
          </Flex>
        </Container>
      </main>
    </Theme>
  );
}
