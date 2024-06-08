// import type { NextApiRequest, NextApiResponse } from 'next'
import { auth } from "@/auth";
import { getAccountFromEmail } from "@/lib/mongo";
import { getEmails } from "@/lib/google";



export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const count = searchParams.get("count")
  const session = await auth()
  const account = await getAccountFromEmail(session?.user?.email)
  const emails = await getEmails(session?.user?.email,account?.access_token, count)
  if (emails=="Invalid token"){
    return Response.json({ message: "Invalid token" })

  }
  else{
    return Response.json({ message: "get email", emails: emails})
  }
}