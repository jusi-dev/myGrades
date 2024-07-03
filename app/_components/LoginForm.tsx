"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import Image from "next/image";

import { signIn } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { getServerSession } from "next-auth";

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isClient, setIsClient] = useState(false);

  const [loginExpanded, setLoginExpanded] = useState(false)

    useEffect(() => {
      setIsClient(true);
    }, []);

  const router = useRouter()

  if (!isClient) return null;

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    console.log(email)
    console.log(password)

    if (!email || !password) {
      setError('Bitte füllen Sie alle Felder aus')
      return
    }

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false
      })

      if (res!.error) {
        setError('An error occured')
      }

      router.replace("/dashboard")
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      {!loginExpanded &&
        <div onClick={() => setLoginExpanded(!loginExpanded)} className="flex items-center justify-center h-16 cursor-pointer absolute bottom-20 w-screen left-50">
          <button className="text-pink-600 px-24 py-3 rounded-full bg-white uppercase">Login</button>
        </div>
      }
      <div className="flex flex-col w-screen h-screen overflow-y-hidden lg:px-[40%]">
        <div className="flex flex-col h-[45vh] items-center justify-center">
          <div className="w-[55%]">
            <h1 className="text-pink-600 text-2xl lg:text-4xl font-normal uppercase text-left">Welcome to</h1>
            <p className="text-white text-4xl lg:text-5xl font-semibold text-right">myGrades</p>
          </div>
        </div>

        <div className={`flex flex-col bg-white w-full px-8 lg:px-12 pt-5 pb-20 mt-auto rounded-t-[17%] transition-all ${loginExpanded ? "translate-y-0" : "translate-y-full"}`}>
          <h1 className="text-pink-600 text-xl text-center uppercase mb-16">Login</h1>
          <form onSubmit={handleSubmit} className="flex flex-col">
            <p className="text-pink-600">Email</p>
            <Input onChange={(e) => setEmail(e.target.value)} type="email" placeholder="vorname.nachname@t-systems.com" className="w-auto py-2 focus:border-pink-600 focus:ring-0 mb-4" />
            <p className="text-pink-600">Passwort</p>
            <Input onChange={(e) => setPassword(e.target.value)} type="password" autoComplete="off" placeholder="*****" className="w-auto py-2 focus:border-pink-600 mb-4" />
            <div className="flex justify-between mt-4">
              <Input type="submit" value="Anmelden" className="w-auto py-2 px-8 bg-pink-600 text-white text-center" />
              <button onClick={() => router.push("/forgotPassword")} className="text-pink-600 text-xs underline">Passwort vergessen?</button>
            </div>
            {error && 
              <p className="text-red-600">{error}</p>
            }
          </form>

        </div>
      </div>
    </>
  );
}
