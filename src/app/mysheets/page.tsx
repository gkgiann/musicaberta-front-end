import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function MySheets() {
  const session = await getServerSession(authOptions);

  if (session) {
    return <h1>Gerenciar minhas partituras</h1>;
  }

  redirect("/login");
}
