import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/auth/session";
import { isDbConfigured } from "@/lib/db/connect";
import { LoginForm } from "./LoginForm";

export default async function LoginPage() {
  if (await getAdmin()) redirect("/admin");
  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-12">
      <div className="w-full max-w-[400px]">
        <div className="relative mx-auto aspect-[900/564] w-[200px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo.png" alt="Handyman 4 Calgary" className="h-full w-full object-contain" />
        </div>
        <div className="mt-8 rounded-[4px] border border-line bg-white p-6 sm:p-8">
          <h1 className="text-2xl font-bold">Admin sign in</h1>
          <p className="mt-1 text-sm text-muted">Manage website content and enquiries.</p>
          {!isDbConfigured() && (
            <p role="alert" className="mt-4 rounded-[3px] border border-danger/30 bg-danger/5 p-3 text-sm text-danger">
              MONGODB_URI is not configured. Add it to your environment and restart the server.
            </p>
          )}
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
