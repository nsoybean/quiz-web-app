'use client';

import { ArrowLeftIcon, ArrowRightIcon } from '@radix-ui/react-icons';
import { Badge, IconButton, Strong, Text } from '@radix-ui/themes';
import dotenv from 'dotenv';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import QuestionCard from '@/src/components/QuestionCard';
import {
  IAnswers,
  IResult,
} from '@/src/interfaces/questions/Answers.interface';
import { IUserQuizAnswers } from '@/src/interfaces/user/UserAnswer.interface';

dotenv.config();

export default function Page({
  params,
}: {
  params: { quizId: string; qnId: string };
}) {
  const [qnData, setQnData] = useState<IResult | null>(null);
  const [qnTotalCount, setQnTotalCount] = useState<number>(0);
  const [resetQnToggle, setresetQnToggle] = useState<boolean>(false);
  const [passRate, setPassRate] = useState<number>(0);
  const [qnNumber, setQnNumber] = useState<number>(Number(params.qnId));

  useEffect(() => {
    // get qn data
    const quizStr = localStorage.getItem(`quiz_render_quiz_${params.quizId}`);
    if (quizStr) {
      const quizObj: IAnswers = JSON.parse(quizStr);
      setQnTotalCount(quizObj.count);
      setQnData(quizObj.results[qnNumber - 1]);
    }
  }, []);

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
    <div className='mx-auto min-h-screen w-2/3 justify-center'>
      <div className='flex flex-col space-y-2 p-10'>
        {/* Header */}
        <Link href='/'>
          <div className='flex flex-col items-center'>
            <Text size='8'>
              <Strong> Quiz </Strong>
            </Text>
            <Text>Start answering questions!</Text>
          </div>
        </Link>

        <div className='space-y-2'>
          {/* Navigation */}
          <div className='flex flex-row items-center justify-between space-x-3'>
            <Text className='px-3'>
              {qnNumber} / {qnTotalCount}
            </Text>
            <div className='space-x-1 px-3'>
              <Link href={`/${params.quizId}/${Math.max(1, qnNumber - 1)}`}>
                <IconButton>
                  <ArrowLeftIcon />
                </IconButton>
              </Link>
              <Link
                href={`/${params.quizId}/${Math.min(
                  qnTotalCount,
                  qnNumber + 1
                )}`}
              >
                <IconButton>
                  <ArrowRightIcon />
                </IconButton>
              </Link>
            </div>
          </div>

          {/* Card */}
          {qnData && (
            <QuestionCard
              quizId={params.quizId}
              qnData={qnData}
              newQnToggle={resetQnToggle}
              computePassRate={calculatePassRate}
            />
          )}

          <div className='self-start'>
            <Text>
              <Strong>Results: </Strong>
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
        </div>
      </div>
    </div>
  );
}
