import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <form className="flex-1 flex flex-col w-full">
      <h1 className="text-3xl font-serif mb-4 text-red-50 red-glow">Вход</h1>
      <p className="text-sm text-red-200/80 mb-8">
        Нет аккаунта?{" "}
        <Link className="text-red-400 hover:text-red-300 underline" href="/sign-up">
          Зарегистрироваться
        </Link>
      </p>
      <div className="flex flex-col gap-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-red-200">Email</Label>
          <Input 
            name="email" 
            placeholder="you@example.com" 
            required 
            className="bg-black/30 border-red-900/30 text-red-100 placeholder:text-red-200/50"
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="password" className="text-red-200">Пароль</Label>
            <Link
              className="text-xs text-red-400 hover:text-red-300 underline"
              href="/forgot-password"
            >
              Забыли пароль?
            </Link>
          </div>
          <Input
            type="password"
            name="password"
            placeholder="Ваш пароль"
            required
            className="bg-black/30 border-red-900/30 text-red-100 placeholder:text-red-200/50"
          />
        </div>
        <SubmitButton 
          pendingText="Вход..." 
          formAction={signInAction}
          className="bg-red-950/80 hover:bg-red-900/80 border border-red-800/50 red-border-glow mt-4"
        >
          Войти
        </SubmitButton>
        <FormMessage message={searchParams} />
      </div>
    </form>
  );
}
