import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center justify-center gap-2">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <>
      <form className="flex-1 flex flex-col w-full">
        <h1 className="text-3xl font-serif mb-4 text-red-50 red-glow">Регистрация</h1>
        <p className="text-sm text-red-200/80 mb-8">
          Уже есть аккаунт?{" "}
          <Link className="text-red-400 hover:text-red-300 underline" href="/sign-in">
            Войти
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
            <Label htmlFor="password" className="text-red-200">Пароль</Label>
            <Input
              type="password"
              name="password"
              placeholder="Ваш пароль"
              minLength={6}
              required
              className="bg-black/30 border-red-900/30 text-red-100 placeholder:text-red-200/50"
            />
          </div>
          <SubmitButton 
            formAction={signUpAction} 
            pendingText="Регистрация..."
            className="bg-red-950/80 hover:bg-red-900/80 border border-red-800/50 red-border-glow mt-4"
          >
            Зарегистрироваться
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>
      </form>
      <SmtpMessage />
    </>
  );
}
