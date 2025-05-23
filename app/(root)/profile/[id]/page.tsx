import dayjs from "dayjs";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/UserAvatar";
import ProfileLink from "@/components/users/ProfileLink";
import { getUser } from "@/lib/actions/user.action";

const Profile = async ({ params }: RouteParams) => {
  const { id } = await params;

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

  const { user, totalQuestions, totalAnswers } = data!;
  const { _id, name, image, portfolio, location, createdAt, username, bio } =
    user!;
  return (
    <section className="flex flex-col-reverse items-start jusity-between sm:flex-row">
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
          <p className="paragraph-regular text-dark200_light800">@{username}</p>

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
          <Link href={`/portfolio/${id}/edit`}>
            <Button className="paragraph-medium btn-secondary text-dark300_light900 min-h-12 min-w-44 px-4 py-3 cursoir-pointer">
              Edit Profile
            </Button>
          </Link>
        )}
      </div>
    </section>
  );
};

export default Profile;
