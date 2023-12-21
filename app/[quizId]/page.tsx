'use client';

import {
  ArrowLeftIcon,
  CircleBackslashIcon,
  EnterIcon,
} from '@radix-ui/react-icons';
import { Button, Strong } from '@radix-ui/themes';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const Page = ({ params }: { params: { quizId: string } }) => {
  const [isQuizFound, setIsQuizFound] = useState<boolean>(false);
  const [totalQnNumber, setTotalQnNumber] = useState<number>(0);
  // get quiz data
  useEffect(() => {
    const qnDataStr = localStorage.getItem(`quiz_render_quiz_${params.quizId}`);
    if (qnDataStr) {
      const qnDataObj = JSON.parse(qnDataStr);
      setTotalQnNumber(qnDataObj.count);
      setIsQuizFound(true);
    }
  }, [params.quizId]);

  return isQuizFound ? (
    <div className='flex min-h-screen flex-col items-center justify-center space-y-4 border-2 '>
      {/* meta data */}
      <div>
        <div>
          <Strong> Name:</Strong> {params.quizId}
        </div>
        <div>
          <Strong> Number of questions:</Strong> {totalQnNumber}
        </div>
      </div>

      {/* action */}
      <div className='space-x-4'>
        <Link href={`/`}>
          <Button variant='outline'>
            <ArrowLeftIcon width='16' height='16' /> Back
          </Button>
        </Link>

        <Link href={`/${params.quizId}/1`}>
          <Button variant='solid'>
            <EnterIcon width='16' height='16' /> Start Quiz
          </Button>
        </Link>
      </div>
    </div>
  ) : (
    <div className='flex min-h-screen flex-col items-center justify-center space-y-4 border-2 '>
      {/* meta data */}
      <div>
        <Strong> Quiz not found!</Strong> {params.quizId}
      </div>

      {/* action */}
      <Link href={`/`}>
        <Button variant='outline'>
          <CircleBackslashIcon width='16' height='16' /> Back
        </Button>
      </Link>
    </div>
  );
};

export default Page;
