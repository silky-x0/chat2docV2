"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { FileUp, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FileUploaderProps {
  onFileUpload: (file: File) => void
  isLoading: boolean
}

export function FileUploader({ onFileUpload, isLoading }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      if (file.type === "application/pdf") {
        onFileUpload(file)
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileUpload(e.target.files[0])
    }
  }

  return (
    <motion.div
      className={`border-2 border-dashed rounded-lg p-8 text-center ${
        isDragging ? "border-[#00adb5] bg-[#00adb5]/10" : "border-gray-300"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="application/pdf" className="hidden" />

      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="p-4 bg-[#00adb5]/10 rounded-full">
          <FileUp className="h-8 w-8 text-[#00adb5]" />
        </div>

        <div>
          <h3 className="text-lg font-medium">Upload your PDF</h3>
          <p className="text-sm text-gray-500 mt-1">Drag and drop your file here or click to browse</p>
        </div>

        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="bg-[#00adb5] hover:bg-[#00adb5]/90"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Select PDF"
          )}
        </Button>
      </div>
    </motion.div>
  )
}
