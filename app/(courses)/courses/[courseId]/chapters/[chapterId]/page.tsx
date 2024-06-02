import getChapters from '@/actions/get-chapters'
import Banner from '@/components/banner'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import React from 'react'
import VideoPlayer from './_components/video-player'

export default async function ChapterIdPage({ params }: { params: { courseId: string, chapterId: string } }) {

  const { userId } = auth()
  if (!userId) return redirect('/')
  const { chapter, course, muxData, attachments, nextChapter, userProgress, purchase } = await getChapters({
    chapterId: params.chapterId,
    userId,
    courseId: params.courseId
  })

  if (!chapter || !course) return redirect('/')

  const isLocked = !chapter.isFree && !purchase;
  const completeOnEnd = !!purchase && !userProgress?.isCompleted;
  return (
    <div>
      {userProgress?.isCompleted && (
        <Banner
          variant='success'
          label='You have already completed this chapter'
        />
      )}
      {
        isLocked && (
          <Banner
            variant='warning'
            label='You need to purchase the course to access this chapter'

          />
        )
      }
      <div className='flex flex-col max-w-4xl mx-auto pb-20'>
        <div className='p-4'>
          <VideoPlayer
            chapterId={params.chapterId}
            title={chapter.title}
            courseId={params.courseId}
            nextChapterId={nextChapter?.id!}
            playbackId={muxData?.playbackId!}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
          />
        </div>
      </div>
    </div>
  )
}
