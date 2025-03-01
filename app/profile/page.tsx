import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfileAction } from "@/app/actions";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-black via-red-950/20 to-black text-red-50 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-black to-black" />
      <div className="container relative z-10 mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="bg-black/40 backdrop-blur-sm p-8 rounded-lg border border-red-900/30 shadow-xl red-border-glow">
            <div className="flex items-center mb-6">
              <Button asChild variant="ghost" className="text-red-200 hover:text-red-100">
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Вернуться на главную страницу
                </Link>
              </Button>
            </div>
            <h1 className="text-3xl font-serif mb-6 text-red-50 red-glow">Профиль</h1>
            
            <form action={updateProfileAction} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-red-200">Email</Label>
                <Input 
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={user.email}
                  disabled
                  className="bg-black/30 border-red-900/30 text-red-100 placeholder:text-red-200/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="text-red-200">Имя пользователя</Label>
                <Input 
                  id="username"
                  name="username"
                  defaultValue={user.user_metadata?.username || ""}
                  className="bg-black/30 border-red-900/30 text-red-100 placeholder:text-red-200/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-red-200">Полное имя</Label>
                <Input 
                  id="full_name"
                  name="full_name"
                  defaultValue={user.user_metadata?.full_name || ""}
                  className="bg-black/30 border-red-900/30 text-red-100 placeholder:text-red-200/50"
                />
              </div>

              <div className="pt-4">
                <Button 
                  type="submit"
                  className="w-full bg-red-950/80 hover:bg-red-900/80 border border-red-800/50 red-border-glow"
                >
                  Сохранить изменения
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 