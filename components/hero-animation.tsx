"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { motion, useAnimation, useInView } from "framer-motion"

export function HeroAnimation() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const mainControls = useAnimation()
  const cloudControls = useAnimation()
  const dotControls = useAnimation()

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible")
      cloudControls.start("float")
      dotControls.start("pulse")
    }
  }, [isInView, mainControls, cloudControls, dotControls])

  return (
    <div ref={ref} className="relative w-full max-w-md mx-auto">
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 75 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate={mainControls}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <Image
          src="/placeholder.svg?height=300&width=400"
          alt="Person holding document"
          width={400}
          height={300}
          className="max-w-full h-auto"
          priority
        />
      </motion.div>

      <motion.div
        className="absolute top-0 right-1/4"
        variants={{
          hidden: { opacity: 0 },
          pulse: {
            opacity: [0, 1, 0],
            scale: [0.8, 1.2, 0.8],
            transition: {
              repeat: Number.POSITIVE_INFINITY,
              duration: 2,
            },
          },
        }}
        initial="hidden"
        animate={dotControls}
      >
        <div className="w-4 h-4 rounded-full bg-red-500"></div>
      </motion.div>

      <motion.div
        className="absolute top-10 right-10"
        variants={{
          hidden: { y: 0 },
          float: {
            y: [0, -10, 0],
            transition: {
              repeat: Number.POSITIVE_INFINITY,
              duration: 3,
              ease: "easeInOut",
            },
          },
        }}
        initial="hidden"
        animate={cloudControls}
      >
        <div className="w-16 h-16 bg-blue-400 rounded-full flex items-center justify-center">
          <div className="w-6 h-6 bg-red-500 rounded-full transform rotate-45"></div>
        </div>
      </motion.div>
    </div>
  )
}
