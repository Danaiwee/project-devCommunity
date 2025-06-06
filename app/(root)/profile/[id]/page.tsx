import dayjs from "dayjs";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import AnswerCard from "@/components/cards/AnswerCard";
import QuestionCard from "@/components/cards/QuestionCard";
import TagCard from "@/components/cards/TagCard";
import DataRenderer from "@/components/DataRenderer";
import Pagination from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserAvatar from "@/components/UserAvatar";
import ProfileLink from "@/components/users/ProfileLink";
import Stats from "@/components/users/Stats";
import { EMPTY_ANSWERS, EMPTY_QUESTION, EMPTY_TAGS } from "@/constants/states";
import {
  getUser,
  getUserAnswers,
  getUserQuestion,
  getUserStats,
  getUserTags,
} from "@/lib/actions/user.action";

export async function generateMetadata({
  params,
}: RouteParams): Promise<Metadata> {
  const { id } = await params;

  const { success, data } = await getUser({ userId: id });

  if (!success || !data) {
    return {
      title: "Dev Community | Developer profile",
      description:
        "View a developer's profile on Dev Community. See their questions, answers, and their special techs",
    };
  }

  const { user } = data!;
  const { name } = user!;
  return {
    title: `Dev Community | ${name}`,
    description:
      "View a developer's profile on Dev Community. See their questions, answers, and their special techs",
  };
}

const Profile = async ({ params, searchParams }: RouteParams) => {
  const { id } = await params;
  const { page, pageSize } = await searchParams;

  if (!id) redirect("/404");

  const session = await auth();

  const { success, data, errors } = await getUser({ userId: id });

  if (!success) {
    return (
      <div>
        <div className="h1-bold text-dark100_light900">{errors?.message}</div>
      </div>
    );
  }

  const { user } = data!;
  const { _id, name, image, portfolio, location, createdAt, username, bio } =
    user!;

  const {
    success: userQuestionsSuccess,
    data: userQuestions,
    errors: userQuestionError,
  } = await getUserQuestion({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    userId: id,
  });

  const { questions, isNext: hasMoreQuestions } = userQuestions!;

  const {
    success: userAnswersSuccess,
    data: userAnswers,
    errors: userAnswersError,
  } = await getUserAnswers({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    userId: id,
  });

  const { answers, isNext: hasMoreAnswers } = userAnswers!;

  const {
    success: userTagsSuccess,
    data: userTags,
    errors: userTagsError,
  } = await getUserTags({ userId: id });

  const { tags } = userTags!;

  const { data: userStats } = await getUserStats({ userId: id });

  return (
    <>
      <section className="flex flex-col-reverse items-start justify-between sm:flex-row">
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          <UserAvatar
            id={_id}
            name={name}
            imageUrl={image}
            className="size-[140px] rounded-full object-cover"
            fallbackClassName="text-6xl font-bold"
          />

          <div className="mt-3">
            <h2 className="h2-bold text-dark100_light900">{name}</h2>
            <p className="paragraph-regular text-dark200_light800">
              @{username}
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-start gap-5">
              {portfolio && (
                <ProfileLink
                  imageUrl="/icons/link.svg"
                  href={portfolio}
                  title={portfolio}
                />
              )}

              {location && (
                <ProfileLink imageUrl="/icons/location.svg" title={location} />
              )}

              <ProfileLink
                imageUrl="/icons/calendar.svg"
                title={dayjs(createdAt).format("MMMM YYYY")}
              />
            </div>

            {bio && (
              <p className="paragraph-regular text-dark400_light800 mt-8">
                {bio}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end max-sm:mb-5 max-sm:w-full am:mt-3">
          {session?.user?.id === id && (
            <Link href={`/profile/${id}/edit`}>
              <Button className="paragraph-medium btn-secondary text-dark300_light900 min-h-12 min-w-30 px-4 py-3 cursoir-pointer">
                Edit Profile
              </Button>
            </Link>
          )}
        </div>
      </section>

      <Stats
        totalQuestions={userStats?.totalQuestions || 0}
        totalAnswers={userStats?.totalAnswers || 0}
        badges={
          userStats?.badges || {
            GOLD: 0,
            SILVER: 0,
            BRONZE: 0,
          }
        }
      />

      <section className="mt-10 flex gap-10">
        <Tabs defaultValue="top-posts" className="flex-[2]">
          <TabsList className="background-light800_dark400 min-h-[42px] p-1">
            <TabsTrigger value="top-posts" className="tab">
              Top Posts
            </TabsTrigger>
            <TabsTrigger value="answers" className="tab">
              Answers
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="top-posts"
            className="mt-5 flex w-full flex-col gap-6"
          >
            <DataRenderer
              success={userQuestionsSuccess}
              data={questions}
              errors={userQuestionError}
              empty={EMPTY_QUESTION}
              render={(questions) => (
                <div className="w-full flex flex-col gap-6">
                  {questions.map((question) => (
                    <QuestionCard
                      key={question._id}
                      question={question}
                      showActionBtns={session?.user?.id === question.author._id}
                    />
                  ))}
                </div>
              )}
            />
            <Pagination page={page} isNext={hasMoreQuestions || false} />
          </TabsContent>
          <TabsContent
            value="answers"
            className="mt-5 flex w-full flex-col gap-6"
          >
            <DataRenderer
              success={userAnswersSuccess}
              data={answers}
              errors={userAnswersError}
              empty={EMPTY_ANSWERS}
              render={(answers) => (
                <div className="w-full flex flex-col gap-6">
                  {answers.map((answer) => (
                    <AnswerCard
                      key={answer._id}
                      {...answer}
                      content={answer.content.slice(0, 27)}
                      containerClasses="card-wrapper rounded-[10px] px-7 py-9 sm:px-11"
                      showReadmore
                      showActionBtns={answer.author._id === session?.user?.id}
                    />
                  ))}
                </div>
              )}
            />

            <Pagination page={page} isNext={hasMoreAnswers || false} />
          </TabsContent>
        </Tabs>

        <div className="flex w-full min-w-[250px] flex-1 flex-col max-lg:hidden">
          <h3 className="h3-bold text-dark200_light900">Top Tech</h3>
          <div className="mt-7 flex flex-col gap-4">
            <DataRenderer
              success={userTagsSuccess}
              data={tags}
              errors={userTagsError}
              empty={EMPTY_TAGS}
              render={(tags) => (
                <div className="mt-3 flex w-full flex-col gap-4">
                  {tags.map((tag) => (
                    <TagCard
                      key={tag._id}
                      _id={tag._id}
                      name={tag.name}
                      questions={tag.count}
                      showCount
                      compact
                    />
                  ))}
                </div>
              )}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Profile;
