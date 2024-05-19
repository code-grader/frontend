"use client";
import React from "react";
import { useState, useEffect } from "react";
import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import Editor from "@monaco-editor/react";
import { Progress } from "@/components/ui/progress";

export default function Home() {
  const [lang, setLang] = useState("cpp");
  const [code, setCode] = useState("// Optimised code will be displayed here.");
  const [load, setLoad] = useState(false);
  const [error, setError] = useState(false);
  const [progress, setProgress] = useState(5);
  const [score, setScore] = useState({
    complexity: 0,
    readability: 0,
    optimisation: 0,
  });
  const [ws, setWs] = useState<WebSocket>();

  useEffect(() => {
    const websocket = new WebSocket("http://localhost:8000/ws/code");
    setWs(websocket);

    websocket.onopen = () => {
      console.log("WebSocket connection opened");
    };

    websocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "error") {
        setError(true); setLoad(false);
        setTimeout(() => {
          setError(false);
        }, 2000);
      } else if (message.type === "code_suggestion") {
        const suggestion = JSON.parse(message.data);
        setCode((prev) => prev + suggestion.code);
      } else if (message.type === "analysis_result") {
        const result = JSON.parse(message.data);
        setScore({
          complexity: result.complexity,
          readability: result.readability,
          optimisation: result.optimisation,
        });
      }
    };

    websocket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    // websocket.onerror = (error) => {
    //   console.error("WebSocket error:", error);
    //   setError(true);
    // };

    return () => {
      websocket.close();
    };
  }, []);

  const sendCodeSnippet = (codeText: any) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      setLoad(true);
      ws.send(JSON.stringify({ type: "code_submit", code: codeText }));
    } else {
      console.error("WebSocket is not open");
      setError(true); setLoad(false);
      setTimeout(() => {
        setError(false);
      }, 2000);
    }
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const codeText = event.target.querySelector(
      ".monaco-scrollable-element"
    ).textContent;
    setCode("");
    setScore({ complexity: 0, readability: 0, optimisation: 0 });
    sendCodeSnippet(codeText);
    processing();
  };

  const processing = () => {
    let interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 100) {
          return prev + 5;
        }
        clearInterval(interval);
        setLoad(false);
        return 5;
      });
    }, 950);
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

      <div className="flex flex-row mb-5">
        <form action="#" onSubmit={handleSubmit}>
          <div className="flex flex-col items-start justify-start mt-24 w-[700px]">
            <div className="flex flex-row w-full gap-2">
              <Select onValueChange={(value) => setLang(value)}>
                <SelectTrigger className="text-white w-full">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="c">
                      C
                    </SelectItem>
                    <SelectItem value="cpp">
                      C++
                    </SelectItem>
                    <SelectItem value="java">
                      Java
                    </SelectItem>
                    <SelectItem value="python">
                      Python
                    </SelectItem>
                    <SelectItem value="javascript">
                      Javascript
                    </SelectItem>
                    <SelectItem value="text" >
                      Other
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Button type="submit" className="w-full">
                Submit
              </Button>
            </div>
            <Editor
              theme="vs-dark"
              height="600px"
              language={lang}
              value="// Paste your code here."
            />
          </div>
        </form>

        <div className="flex flex-col justify-center items-center mt-6 ml-6">
          {error ? (
            <Alert variant={'destructive'} className="bg-slate-900">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error!</AlertTitle>
              <AlertDescription>
                Oopps! Something went wrong. Please try again later.
              </AlertDescription>
            </Alert>
          ) : load ? (
            <div className="flex flex-row w-[550px]">
              <span className="text-white -mt-1">Processing-</span>
              <Progress value={progress} className="w-full" />
            </div>
          ) : null}
          <h1 className="py-5 text-white">Analytics:</h1>
          <div className="flex flex-row justify-center items-center gap-10 mb-9">
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
              <h1 className="text-white text-[33px]">
                {score.optimisation}/10
              </h1>
            </div>
          </div>
          <h1 className="pb-5 text-white">Optimised Code:</h1>
          <Editor
            theme="vs-dark"
            height="500px"
            width="700px"
            language={lang}
            value={code}
          />
        </div>
      </div>
    </main>
  );
}
