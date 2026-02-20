"use client"
import CherryBlossomPreview from "./cherry-blossom-preview"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Eye } from 'lucide-react'
import Image from "next/image"

interface CherryBlossomPreviewProps {
  prompt: string
  name: string
}

export default function CherryBlossomPreview({ prompt, name }: CherryBlossomPreviewProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)} 
        className="bg-[#E26C73] hover:bg-[#d15964] text-white"
      >
        <Eye className="mr-2 h-5 w-5" />
        Preview
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <Image 
                src="/images/logo.png" 
                alt="Cherry Blossom" 
                width={30} 
                height={30} 
                className="rounded-full"
              />
              <DialogTitle className="text-[#E26C73]">Cherry Blossom Preview</DialogTitle>
            </div>
            <p className="text-sm text-gray-500">
              This is how your results will appear in Cherry Blossom
            </p>
          </DialogHeader>

          <div className="bg-[#f9f5f6] p-4 rounded-lg border border-pink-200 space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-pink-100 rounded-full p-2 mt-1">
                <Image 
                  src="/images/logo.png" 
                  alt="Cherry Blossom" 
                  width={24} 
                  height={24} 
                  className="rounded-full"
                />
              </div>
              <div className="flex-1 bg-white p-3 rounded-lg shadow-sm border border-pink-100">
                <p className="text-sm font-medium text-[#E26C73] mb-1">Cherry Blossom</p>
                <p className="text-sm">
                  Hello! I'm Cherry Blossom, your Work-Life Balance Guide. How can I assist you today?
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-blue-100 rounded-full p-2 mt-1 flex items-center justify-center">
                <span className="text-blue-500 font-medium text-sm">
                  {name ? name.charAt(0).toUpperCase() : "Y"}
                </span>
              </div>
              <div className="flex-1 bg-blue-50 p-3 rounded-lg shadow-sm border border-blue-100">
                <p className="text-sm font-medium text-blue-600 mb-1">
                  {name || "You"}
                </p>
                <p className="text-sm whitespace-pre-wrap">{prompt}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-pink-100 rounded-full p-2 mt-1">
                <Image 
                  src="/images/logo.png" 
                  alt="Cherry Blossom" 
                  width={24} 
                  height={24} 
                  className="rounded-full"
                />
              </div>
              <div className="flex-1 bg-white p-3 rounded-lg shadow-sm border border-pink-100">
                <p className="text-sm font-medium text-[#E26C73] mb-1">Cherry Blossom</p>
                <p className="text-sm">
                  Thank you for sharing your Work-Lifestyle Balance Audit results with me! I'm analyzing your scores now and will provide personalized guidance to help you {name ? name : ""}...
                </p>
                <div className="flex gap-1 mt-2">
                  <span className="animate-pulse">●</span>
                  <span className="animate-pulse animation-delay-200">●</span>
                  <span className="animate-pulse animation-delay-400">●</span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setIsOpen(false)} className="w-full">
              Close Preview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
