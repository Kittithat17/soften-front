import { HeroHeader2 } from "@/components/hero8-head2";
import { RegisterForm } from "@/components/register-form";


export default function LoginPage() {
  return (
    <>
    <HeroHeader2 />
    
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <RegisterForm   />
      </div>
    </div>
    </>
  )
}
