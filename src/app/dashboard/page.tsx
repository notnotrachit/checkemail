// "use client";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import EmailGet from "@/components/getting_email";
import { SignOut } from "@/components/sign-out";
import EmailCard from "@/components/email";
import { signOut } from "@/auth";
import Image from "next/image";
import Settings from "@/components/settings";
export default async function Home() {
    async function sign_out() {
      "use server";
      await signOut();
    }

  const session = await auth();
  if (!session?.user) return redirect("/");
  return (
    <main className="min-h-screen justify-between p-24">
      <div>
        <div className="flex justify-end"><Settings/></div>
        <div className="flex">
          { /* eslint-disable-next-line @next/next/no-img-element*/}
          <img src={session.user.image!} alt="user image" className="rounded-full h-12 w-12 mr-4" />
          <div>
            <h1 className="text-2xl font-bold">{session.user.name}</h1>
            <p className="text-sm">{session.user.email}</p>
          </div>
          <div className="ml-auto flex items-center">
            <SignOut/>
          </div>
        </div>
        <div className="flex">
          <EmailGet sign_out={sign_out} email={session.user.email}/>
        </div>

      </div>
      <div className="w-full my-16">
        <EmailCard oemail={session.user.email}/>
      </div>
    </main>
  );
}

// export async function getServerSideProps(ctx:any) {
//   const session = await auth(ctx);

//   return {
//     props: {
//       session,
//     },
//   };
// }
