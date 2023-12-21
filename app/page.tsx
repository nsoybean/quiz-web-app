'use client';
import { Cross1Icon, FileIcon } from '@radix-ui/react-icons';
import {
  AlertDialog,
  Button,
  Card,
  Flex,
  Strong,
  Text,
} from '@radix-ui/themes';
import dotenv from 'dotenv';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FileUploader } from 'react-drag-drop-files';

dotenv.config();

const fileTypes = ['JSON'];

export default function Home() {
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [LSDataChangeToggle, setLSDataChangeToggle] = useState<boolean>(false);

  useEffect(() => {
    let tmpUploadedFiles: string[] = [];

    const LSKeys: { [key: string]: string } = { ...localStorage };
    Object.keys(LSKeys).forEach((key) => {
      if (key.includes('quiz_render_quiz')) {
        tmpUploadedFiles.push(key.replace('quiz_render_quiz_', ''));
      }
    });

    setUploadedFiles(tmpUploadedFiles);
  }, [LSDataChangeToggle]);

  const handleFileUpload = (file: any) => {
    const fileReader = new FileReader();
    fileReader.readAsText(file, 'UTF-8');
    fileReader.onload = (e) => {
      if (e.target?.result) {
        localStorage.setItem(
          `quiz_render_quiz_${file.name}`,
          e.target.result as string
        );
      }
      setLSDataChangeToggle(!LSDataChangeToggle);
    };
  };

  const deleteQuiz = (file: string) => {
    console.log('🚀 deleting file:', file);
  };

  return (
    <div className='center flex min-h-screen  flex-col items-center justify-center space-y-6 border-2'>
      {/* hero section */}
      <div className='flex w-2/3 flex-col items-center text-center'>
        <div className='text-2xl'>
          <Strong> Render Quiz </Strong>
        </div>
        <div className='text-lg'>
          Easily transform your JSON data into stunning and interactive quizzes
          with our powerful rendering engine.
        </div>
      </div>
      {/* upload section */}
      <FileUploader
        handleChange={handleFileUpload}
        name='file'
        types={fileTypes}
      />

      {/* uploaded file section */}
      <div className='flex flex-col items-center'>
        {/* title */}
        <div className='font-medium'> Uploaded Files: </div>
        {/* list files section */}
        <div>
          {uploadedFiles.map((file: string) => {
            return (
              // instance of quiz list
              <div
                className='flex flex-row items-center justify-between space-x-2 p-2'
                key={file}
              >
                <Link href={`/${file}`}>
                  <Card className='hover:bg-sky-100'>
                    <div className='flex w-full space-x-2'>
                      <FileIcon width='18' height='18' />
                      <Text as='div' size='2' weight='bold'>
                        {file}
                      </Text>
                    </div>
                  </Card>
                </Link>
                <AlertDialog.Root>
                  <AlertDialog.Trigger>
                    <Button color='crimson' variant='soft'>
                      <Cross1Icon color='red' width='18' height='18' />
                    </Button>
                  </AlertDialog.Trigger>
                  <AlertDialog.Content style={{ maxWidth: 450 }}>
                    <AlertDialog.Title>Delete</AlertDialog.Title>
                    <AlertDialog.Description size='2'>
                      Are you sure? This quiz {file} will no longer be
                      accessible.
                    </AlertDialog.Description>

                    <Flex gap='3' mt='4' justify='end'>
                      <AlertDialog.Cancel>
                        <Button variant='soft' color='gray'>
                          Cancel
                        </Button>
                      </AlertDialog.Cancel>
                      <AlertDialog.Action>
                        <Button
                          variant='solid'
                          color='red'
                          onClick={() => {
                            deleteQuiz(file);
                          }}
                        >
                          Delete
                        </Button>
                      </AlertDialog.Action>
                    </Flex>
                  </AlertDialog.Content>
                </AlertDialog.Root>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
