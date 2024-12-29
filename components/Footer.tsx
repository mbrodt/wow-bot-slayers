"use client";

import { useState } from "react";
import { Youtube, Coffee, Copy } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

export default function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const cryptoAddresses = {
    bitcoin: "bc1pkj0jxh37uk8uyyjzles5fh2rz7sq5d2q5853gedtctderk0q8cyq4dwfcf",
    ethereum: "0x15c8F5DF839B83151BA4A4a5c81DE2aC5be0181d",
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast({
          title: "Copied!",
          description: "Address copied to clipboard",
        });
      },
      (err) => {
        console.error("Could not copy text: ", err);
        toast({
          title: "Error",
          description: "Failed to copy address",
          variant: "destructive",
        });
      }
    );
  };

  return (
    <footer className="bg-gray-800 bg-opacity-80 py-6 px-4 mt-12">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center">
        <Link
          href="/submit"
          className="text-yellow-400 font-wow text-lg mb-4 sm:mb-0"
        >
          Submit your own kill
        </Link>
        <div className="flex space-x-6">
          <Link
            href="https://www.youtube.com/@Madskillzzhc"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-yellow-400 transition-colors duration-300 flex items-center"
          >
            <Youtube className="w-6 h-6 mr-2" />
            <span className="font-wow">Watch Our Adventures</span>
          </Link>
          <Button
            className="text-white hover:text-yellow-400 transition-colors duration-300 flex items-center p-0 text-base"
            onClick={() => setIsModalOpen(true)}
          >
            <Coffee className="w-6 h-6" />
            <span className="font-wow">Support Our Cause</span>
          </Button>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Support Our Cause</DialogTitle>
            <DialogDescription className="mt-4">
              All crypto donations will go towards maintenance of the website
              and future prizes for the community
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-4">
                <span className="font-medium w-1/4">Bitcoin:</span>
                <div className="flex items-center flex-grow w-3/4">
                  <code className="bg-gray-100 text-black p-1 rounded mr-2 w-full flex-grow">
                    {cryptoAddresses.bitcoin.slice(0, 15)}...
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(cryptoAddresses.bitcoin)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="font-medium w-1/4">Ethereum:</span>
                <div className="flex items-center flex-grow w-3/4">
                  <code className="bg-gray-100 text-black p-1 rounded mr-2 w-full flex-grow">
                    {cryptoAddresses.ethereum.slice(0, 15)}...
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(cryptoAddresses.ethereum)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <Link
                href="https://buymeacoffee.com/tzubaki"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-400 hover:text-yellow-500 transition-colors duration-300 underline"
              >
                Or buy a coffee for Madskillzzhc
              </Link>
            </div>
          </div>
          <DialogFooter>
            <Button className="underline" onClick={() => setIsModalOpen(false)}>
              no ty
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </footer>
  );
}
