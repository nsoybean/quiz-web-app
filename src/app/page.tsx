'use client';
import '@radix-ui/themes/styles.css';

import { ArrowLeftIcon, ArrowRightIcon } from '@radix-ui/react-icons';
import {
  Avatar,
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
        <div className='min-h-screen'>
          <div className='flex flex-col items-center space-y-2 p-10'>
            {/* Header */}
            <div className='flex flex-col items-center'>
              <Text className='' size='8'>
                <Strong>AWS Quiz </Strong>
              </Text>
              <Text className=''>
                Select your test and start answering questions!
              </Text>
            </div>

            {/* Navigation */}
            <div className='space-y-2  '>
              <div className='flex flex-row items-center justify-between space-x-3'>
                <Text className='px-3'>
                  {qnIndex + 1} / {data.count}
                </Text>
                <div className='space-x-1 px-3'>
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
                        setQnIndex(
                          Math.min(data.results.length - 1, qnIndex + 1)
                        );
                      }}
                    />
                  </IconButton>
                </div>
              </div>

              {/* Card */}
              {qnData && <QuestionCard {...qnData} />}
            </div>

            {/* theme panel */}
            <ThemePanel />
          </div>
        </div>
      </main>
    </Theme>
  );
}
