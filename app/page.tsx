'use client';
import { Cross1Icon, FileIcon } from '@radix-ui/react-icons';
import { AlertDialog, Button, Card, Flex, Text } from '@radix-ui/themes';
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
    localStorage.removeItem(`quiz_render_quiz_${file}`); // qn data
    localStorage.removeItem(`quiz_${file}`); // user submitted data
    setLSDataChangeToggle(!LSDataChangeToggle);
  };

  return (
    <div className='center flex min-h-screen  flex-col items-center justify-center space-y-6 border-2'>
      {/* hero section */}
      <div className='flex w-2/3 flex-col items-center text-center'>
        <div className='bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-3xl font-bold tracking-tighter text-transparent sm:text-5xl xl:text-6xl/none'>
          Welcome to the Interactive Quiz Maker
        </div>
        <div className='text-lg'>
          Upload a JSON file to create your own interactive quiz. Easy, quick
          and fun.
        </div>
      </div>
      {/* upload section */}
      <FileUploader
        handleChange={handleFileUpload}
        name='file'
        types={fileTypes}
      />

      {/* uploaded file section */}
      {uploadedFiles.length > 0 && (
        <div className='flex flex-col items-center space-y-2'>
          {/* title */}
          <div className='font-medium'> Uploaded Files: </div>
          {/* list files section */}
          <div className='max-h-40 overflow-y-auto'>
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
      )}
    </div>
  );
}
