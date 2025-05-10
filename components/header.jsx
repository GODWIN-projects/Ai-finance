import React from 'react'
import {
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
  } from '@clerk/nextjs'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from './ui/button'
import { LayoutDashboard, PenBox } from 'lucide-react'
import { checkuser } from '@/lib/checkUser'

const Header = async () => {

  await checkuser()

  return (
    <div className='fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b-2'>
      
      <nav className='container mx-auto px-4 py-4 flex items-center justify-between'>
        <Link href={""}>
          <Image
            src = {"/balance_logo.png"}
            alt = {"balance logo"}
            height= {60}
            width = {200}
            className= "h-12 w-auto object-contain"/>
        </Link>
        
        <SignedOut>
          <div className='flex gap-3'>
              <SignInButton >
                <Button variant={"outline"}>Login</Button>
              </SignInButton>
              <SignUpButton >
                <Button variant={"outline"}>Sign up</Button>
              </SignUpButton>
          </div>
        </SignedOut>

          <SignedIn>
            <div className='flex gap-4 px-4 items-center'>
            <Link href={"/dashboard"}>
              <Button variant={"outline"}>
                <LayoutDashboard size={18}/>
                <span className='hidden md:inline'>Dashoard</span>
              </Button>
            </Link>
            <Link href={"/transaction/create"}>
              <Button variant={"outline"}>
                <PenBox size={18}/>
                <span className='hidden md:inline'>Add Transaction</span>
              </Button>
            </Link>
            <UserButton appearance={{
              elements: {
                avatarBox: "w-10 h-10"
              }
            }}/>
            </div>
          </SignedIn>
      </nav>
    </div>
  )
}

export default Header