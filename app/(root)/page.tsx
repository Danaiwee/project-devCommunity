import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";


export default async function Home() {
  const session = await auth();

  console.log("Session: ", session)

  return (
    <div className='pt-[100px]'>
       <form action={async() => {
        "use server"
        await signOut();

       }}>
        <Button type='submit'>
          Log out
        </Button>
       </form>
    </div>
  );
}
