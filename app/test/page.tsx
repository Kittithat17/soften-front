import { HeroHeader2 } from "@/components/hero8-head2"
import { LoginForm } from "@/components/login-form"
import {Card} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import Link from "next/link";

export default function LoginPage() {
  return (
    <>
    <Card className="bg-blue-500 bg-gradient-to-bl from-blue-500 to-blue-700 text-white p-10 rounded-lg shadow-lg">
        <div>
            <h1 className="bg-gray-600 bg-gradient-to-t text-9xl font-bold tracking-tight">
                <center>
                    This is header of topic 
                </center>
                </h1>
        </div>
        <Button><div className="bg-black-500 bg-gradient-to-l">This is Button</div></Button>
    </Card>
    </>
  )
}
