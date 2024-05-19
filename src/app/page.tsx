"use client";
import React from "react";
import { useState, useEffect } from "react";
import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Editor from "@monaco-editor/react";

export default function Home() {
  const [lang, setLang] = useState("cpp");
  const [code, setCode] = useState("// Your code will be displayed here.");
  const [output, setOutput] = useState("// Optimised code will be displayed here.");
  const [score, setScore] = useState({complexity: 0, readability: 0, optimisation: 0});
  const [ws, setWs] = useState<WebSocket>();

  useEffect(() => {
    const websocket = new WebSocket('http://localhost:8000/ws/code');
    setWs(websocket);

    websocket.onopen = () => {
      console.log('WebSocket connection opened');
    };

    websocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'code_suggestion') {
        const suggestion = JSON.parse(message.data);
        setOutput((prev) => prev + suggestion.code);
      } else if (message.type === 'analysis_result') {
        const result = JSON.parse(message.data);
        setScore({complexity: result.complexity, readability: result.readability, optimisation: result.optimisation});
      }
    };

    websocket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // Cleanup function
    return () => {
      websocket.close();
    };
  }, []);

  const sendCodeSnippet = (codeText: any) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'code_submit', code: codeText }));
    }
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const codeText = event.target.querySelector(".monaco-scrollable-element").textContent;
    setOutput("");
    setScore({complexity: 0, readability: 0, optimisation: 0});
    sendCodeSnippet(codeText);
  };

  return (
    <main className="flex flex-col px-10 bg-slate-950">
      <Menubar className="flex justify-center items-center">
        <MenubarMenu>
          <MenubarTrigger className="text-white text-xl">
            CodeGrader
          </MenubarTrigger>
        </MenubarMenu>
      </Menubar>

      <div className="flex flex-row mt-12 mb-5">
        <form action="#" onSubmit={handleSubmit}>
          <div className="flex flex-col items-start justify-start w-[700px]">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="text-white w-full" variant="outline">
                  Select language
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-44">
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

            <Editor
              theme="vs-dark"
              height="650px"
              language={lang}
              value={code}
            />
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </div>
        </form>

        <div className="flex flex-col justify-center items-center ml-6">
          <h1 className="pb-4 text-white">Analytics:</h1>
          <div className="flex flex-row justify-center items-center gap-10 mb-11">
            <div className="flex flex-col justify-center items-center w-[121px] h-[121px] border-[3px] border-white rounded-full">
              <h1 className="text-white text-base">Complexity:</h1>
              <h1 className="text-white text-[33px]">{score.complexity}/10</h1>
            </div>
            <div className="flex flex-col justify-center items-center w-[121px] h-[121px] border-[3px] border-white rounded-full">
              <h1 className="text-white text-base">Readability:</h1>
              <h1 className="text-white text-[33px]">{score.readability}/10</h1>
            </div>
            <div className="flex flex-col justify-center items-center w-[121px] h-[121px] border-[3px] border-white rounded-full">
              <h1 className="text-white text-base">Optimisation:</h1>
              <h1 className="text-white text-[33px]">{score.optimisation}/10</h1>
            </div>
          </div>
          <h1 className="pb-4 text-white">Optimised Code:</h1>
          <Editor
            theme="vs-dark"
            height="500px"
            width="700px"
            language={lang}
            value={output}
          />
        </div>
      </div>
    </main>
  );
}
