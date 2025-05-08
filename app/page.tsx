import Link from "next/link"
import Image from "next/image"
import { FileText, MessageSquare, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="h-screen bg-[#eeeeee] flex flex-col">
      <header className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
        <div className="flex items-center gap-1">
          <div className="w-8 h-8 bg-[#393e46] rounded flex items-center justify-center">
            <FileText size={20} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#000000]">Chat2Doc</h1>
        </div>
        <div className="flex gap-4">
          <Link
            href="/api/auth/login"
            className="bg-[#00adb5] text-black font-normal font-['Inter'] px-6 py-2 rounded-full border border-black hover:bg-opacity-90 transition-all"
          >
            Sign in
          </Link>
          <Link
            href="/api/auth/login?screen_hint=signup"
            className="bg-white text-[#000000] px-6 py-2 rounded-full border border-[#000000] hover:bg-gray-50 transition-all"
          >
            Sign up
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 flex-1 flex items-center">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-normal font-['Playfair_Display'] mb-4">
            Chat With Your <span className="text-[#00adb5]">Docs!</span>
          </h2>

          <p className="text-2xl md:text-3xl font-light mb-8">
            Upload. Ask. <span className="text-red-500">Understand.</span>
          </p>

          <div className="flex justify-center mb-8">
            <Image
              src="/uploadDoc.png"
              alt="Upload Document Illustration"
              width={400}
              height={300}
              priority
              className="object-contain"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-8">
            <div className="flex flex-col items-center text-center">
              <div className="mb-2">
                <FileText size={36} className="text-[#000000]" />
              </div>
              <h3 className="text-lg font-bold mb-1">Upload Any Document</h3>
              <p className="text-[#393e46] text-sm">
                PDF, DOCX,
                <br />
                TXT and more
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-2">
                <MessageSquare size={36} className="text-[#000000]" />
              </div>
              <h3 className="text-lg font-bold mb-1">Ask Anything</h3>
              <p className="text-[#393e46] text-sm">
                Instantly Query
                <br />
                Your file
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-2">
                <Zap size={36} className="text-[#000000]" />
              </div>
              <h3 className="text-lg font-bold mb-1">Get Smart Answers</h3>
              <p className="text-[#393e46] text-sm">
                PDF, DOCX,
                <br />
                TXT and more
              </p>
            </div>
          </div>

          <div>
            <Link href="/chat">
              <Button className="bg-[#00adb5] hover:bg-[#00adb5]/90 text-white px-8 py-4 text-lg rounded-full">
                Try for Free
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
