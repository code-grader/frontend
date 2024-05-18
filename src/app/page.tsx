"use client";
import React from "react";
import { useState } from "react";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Editor from "@monaco-editor/react";
import { set, useForm } from "react-hook-form";


export default function Home() {
  const [lang, setLang] = useState("python");
  const [code, setCode] = useState('print("Hello world!")');
  const [score, setScore] = useState(0);
  const form = useForm();
  function onSubmit(data: any) {
    setCode(data.code);
    setScore(100);
  }

  return (
    <main className="flex flex-col px-10 bg-slate-950 min-h-screen">
      <Menubar className="flex justify-center items-center">
        <MenubarMenu>
          <MenubarTrigger className="text-white text-xl">
            CodeGrader
          </MenubarTrigger>
        </MenubarMenu>
      </Menubar>
      <div className="flex flex-row justify-center gap-32 py-9">
        <Editor
          theme="vs-dark"
          height="83vh"
          width="61vw"
          language={lang}
          value={code}
        />
        {score === 0 ? (
        <div className="flex flex-col justify-center w-80 gap-10">
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

          <Form {...form}>
            <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-16"
            >
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Your Code:</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste Your Code Here"
                        className="resize-none text-white h-36"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">Submit</Button>
            </form>
          </Form>
        </div> ) : (
        <div className="flex flex-col justify-center items-center mt-32 w-44 h-44 border-4 border-white rounded-full">
          <h1 className="text-white">Score:</h1>
          <h1 className="text-white text-4xl">{score}</h1>
        </div>
        )}
      </div>
    </main>
  );
}
