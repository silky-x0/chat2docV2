import Image from "next/image"

export default function Illustration() {
  return (
    <div className="relative">
      <div className="absolute top-0 right-1/4 w-4 h-4 rounded-full bg-red-500"></div>
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled-wEFw3jUFIJvPO3aU8qpko0E2RgZKOo.png"
        alt="Document chat illustration"
        width={400}
        height={250}
        className="max-w-full h-auto"
        priority
      />
    </div>
  )
}
