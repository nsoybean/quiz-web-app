'use client';
import '@radix-ui/themes/styles.css';

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  EraserIcon,
} from '@radix-ui/react-icons';
import {
  Avatar,
  Badge,
  IconButton,
  Strong,
  Text,
  Theme,
  ThemePanel,
} from '@radix-ui/themes';
import dotenv from 'dotenv';
import { useEffect, useState } from 'react';

import QuestionCard from '@/components/QuestionCard';

import { IResult } from './interfaces/questions/Answers.interface';

dotenv.config();
import data from '../data/test_2/answers.json';
import { IUserQuizAnswers } from './interfaces/user/UserAnswer.interface';
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
  const [resetQnToggle, setresetQnToggle] = useState<boolean>(false);
  const [passRate, setPassRate] = useState<number>(0);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (data) {
      setQnData(data.results[qnIndex]);
    }
  }, [qnIndex]);

  function calculatePassRate() {
    let passes = 0;
    const userAns = localStorage.getItem('quiz_assessment_2') || '{}';
    const userAnsObj: IUserQuizAnswers = JSON.parse(userAns);

    if (Object.keys(userAnsObj).length === 0) {
      setPassRate(0);
    }

    // iterate over over key value and count occurance of correct answers
    Object.keys(userAnsObj).forEach((key) => {
      if (userAnsObj[key] === true) {
        passes++;
      }
    });

    setPassRate(
      Number((passes / Object.keys(userAnsObj).length).toFixed(2)) * 100
    );
  }

  return (
    <Theme appearance='light'>
      <main>
        <div className='min-h-screen'>
          <div className='flex flex-col items-center space-y-2 p-10'>
            {/* Header */}
            <div className='flex flex-col items-center'>
              <Text size='8'>
                <Strong> AWS Quiz </Strong>
              </Text>
              <Text>Select your test and start answering questions!</Text>
            </div>

            {/* Navigation */}
            <div className='space-y-2  '>
              <div className='flex flex-row items-center justify-between space-x-3'>
                <Text className='px-3'>
                  {qnIndex + 1} / {data.count}
                </Text>
                <div className='space-x-1 px-3'>
                  <IconButton
                    onClick={() => {
                      setresetQnToggle(!resetQnToggle);
                      setQnIndex(Math.max(0, qnIndex - 1));
                    }}
                  >
                    <ArrowLeftIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      setresetQnToggle(!resetQnToggle);
                      setQnIndex(
                        Math.min(data.results.length - 1, qnIndex + 1)
                      );
                    }}
                  >
                    <ArrowRightIcon />
                  </IconButton>
                </div>
              </div>

              {/* Card */}
              {qnData && (
                <QuestionCard
                  qnData={qnData}
                  newQnToggle={resetQnToggle}
                  computePassRate={calculatePassRate}
                />
              )}

              <div className='self-start'>
                <Text>
                  {' '}
                  <Strong>Results: </Strong>{' '}
                </Text>
                {passRate >= 72 ? (
                  <Badge color='green' size='2'>
                    {passRate.toString()} %
                  </Badge>
                ) : (
                  <Badge color='red' size='2'>
                    {passRate.toString()} %
                  </Badge>
                )}
              </div>
              <div className='flex w-fit flex-row'>
                <IconButton
                  onClick={() => {
                    localStorage.removeItem('quiz_assessment_2');
                  }}
                  color='red'
                >
                  <EraserIcon />
                </IconButton>
              </div>
            </div>

            {/* theme panel */}
            <ThemePanel />
          </div>
        </div>
      </main>
    </Theme>
  );
}
