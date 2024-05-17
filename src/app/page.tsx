"use client";
import React from "react";
import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Editor from "@monaco-editor/react";
import { useState } from "react";

export default function Home() {
  const [lang, setLang] = useState("python");
  const [code, setCode] = useState('print("Hello world!")');
  return (
    <main className="flex flex-col px-10 bg-slate-950">
      <Menubar className="flex justify-center items-center">
        <MenubarMenu>
          <MenubarTrigger className="text-white text-xl">
            CodeGrader
          </MenubarTrigger>
        </MenubarMenu>
      </Menubar>
      <div className="flex flex-row">
        <Editor
          theme="vs-dark"
          height="60vh"
          width="60vw"
          language={lang}
          value={code}
        />
        <div className="flex flex-col justify-center px-28 gap-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="text-white" variant="outline">
                Select language
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem onClick={() => setLang("cpp")}>
                C++
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLang("java")}>
                Java
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLang("python")}>
                Python
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLang("javascript")}>
                Javascript
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Textarea className="text-white" placeholder="Paste your code here."/>
          <Button
          variant="default"
          className="text-white"
          onClick={() => {}}
          >
            Submit
          </Button>
        </div>
      </div>
    </main>
  );
}
