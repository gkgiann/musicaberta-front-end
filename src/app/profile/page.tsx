import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { api } from "@/lib/axios";
import ProfileForm from "@/components/ProfileForm";

export default async function Profile() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const res = await api.get(`/users/${session.user?.id}`);
  const { bio, roles, instruments } = res.data.user;

  return (
    <div className="max-w-screen-xl p-3 mx-auto">
      <h1 className="text-2xl font-bold mb-5">Meu perfil</h1>
      <ProfileForm
        initialData={{ bio, roles, instruments }}
        userId={session.user?.id}
      />
    </div>
  );
}
