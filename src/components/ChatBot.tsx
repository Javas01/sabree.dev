import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import { Spinner } from "./Spinner";

type Result = {
  response: string;
};

export const ChatBot = () => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([
    {
      from: "bot",
      message: "Hello! I'm JawwaadBot. What would you like to know about me?"
    }
  ]);
  const [loading, setLoading] = useState(false);
  const send = async () => {
    setLoading(true);
    setMessages((prev) => [
      ...prev,
      {
        from: "user",
        message: query
      }
    ]);
    try {
      const res = await fetch(
        "https://jawwaadsabree-jawwaadbot.hf.space/query",
        {
          method: "POST",
          body: JSON.stringify({ query }),
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      const { response }: Result = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          message: response
        }
      ]);
      setQuery("");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="fixed bottom-5 right-5 z-5 rounded-full bg-[#1F2937]">
          JawwaadBot
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-62 h-62 max-h-[80vh] max-w-[100vw] lg:max-w-[30vw] text-white overflow-y-scroll text-wrap bg-[#1F2937]">
        {messages.map(({ from, message }, i) => (
          <p
            key={i}
            className={`mb-3 ${from === "bot" ? "text-left" : "text-right"}`}
          >
            <span className="font-bold">
              {from === "bot" ? "JawwaadBot" : "You"}:
            </span>{" "}
            {message}
          </p>
        ))}
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What would you like to know about me?"
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <Button disabled={loading || !query} onClick={send} type="submit">
            Send
          </Button>
        </div>
        {loading && <Spinner className="mx-auto mt-3" />}
      </PopoverContent>
    </Popover>
  );
};
