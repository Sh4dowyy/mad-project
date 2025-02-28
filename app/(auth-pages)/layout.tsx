import RainAnimation from "@/components/rain-animation"

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-black via-red-950/20 to-black text-red-50 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-black to-black" />
      <RainAnimation />
      <div className="container relative z-10 mx-auto px-4 py-16 flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md bg-black/40 backdrop-blur-sm p-8 rounded-lg border border-red-900/30 shadow-xl red-border-glow">
          {children}
        </div>
      </div>
    </div>
  );
}
