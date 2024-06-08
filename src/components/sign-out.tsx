import { signOut } from "@/auth"

export function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <button className="bg-error h-auto px-4 rounded-md py-1">Sign Out</button>
    </form>
  );
}