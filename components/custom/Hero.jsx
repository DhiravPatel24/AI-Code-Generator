"use client"
import { MessagesContext } from "@/context/MessagesContext";
import { UserDetailContext } from "@/context/UserDetailContext";
import Colors from "@/data/Colors";
import Lookup from "@/data/Lookup";
import { ArrowUpRight, Link } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import SignInDialog from "./SignInDialog";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";

const Hero = () => {
    const [userInput, setUserInput] = useState('')
    const {messages, setMessages} = useContext(MessagesContext)
    const {userDetail, setUserDetail} = useContext(UserDetailContext)
    const [isLoading, setIsLoading] = useState(false)
    const [openDialog, setOpenDialog] = useState(false)
    const CreateWorkSpace = useMutation(api.workspace.CreateWorkspace)
    const router = useRouter()

    const onGenerate = async (input) => {
      if (!userDetail?.email) {
        setOpenDialog(true);
        return;
      }
      setIsLoading(true);
      const msg = {
        role: "user",
        content: input,
      };
      setMessages(msg);
      try {
        const workspaceId = await CreateWorkSpace({
          user: userDetail._id,
          messages: [msg],
        });
        if (workspaceId) {
          await router.push("/workspace/" + workspaceId); 
        } else {
          alert("Failed to create workspace. Please try again.");
        }
      } catch (error) {
        console.error("Error creating workspace:", error);
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
      setIsLoading(false);
    };
    

  return (
    <div className="flex flex-col items-center  gap-2">
      {isLoading && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
)}


      <h2 className="font-bold text-4xl">{Lookup.HERO_HEADING}</h2>
      <p className="text-gray-400 font-medium">{Lookup.HERO_DESC}</p>
      <div className="p-5 border rounded-xl max-w-xl w-full mt-3"
      style={{backgroundColor:Colors.BACKGROUND}}
      >
        <div className="flex gap-2">
          <textarea 
          placeholder={Lookup.INPUT_PLACEHOLDER}
          onChange={(event) => setUserInput(event.target.value)}
            className="outline-none bg-transparent w-full h-32 max-h-56 resize-none"          
          />
          {userInput && <ArrowUpRight 
          onClick={()=>onGenerate(userInput)}
          className="bg-blue-500 p-2 h-10 w-10 rounded-md cursor-pointer" />}
        </div>
        <div>
            <Link className="h-5 w-5" />
        </div>
      </div>

      <div className="flex mt-8 flex-wrap max-w-2xl items-center justify-center gap-2">
        {Lookup?.SUGGSTIONS.map((suggestion,index)=>(
          
          <h2
          onClick={()=>onGenerate(suggestion)}
          className="p-1 px-2 border rounded-full text-sm text-gray-400 hover:text-white cursor-pointer"
          key={index}>{suggestion}
          </h2>
        ))

        }
      </div>
        <SignInDialog openDialog={openDialog} closeDialog={(v)=>setOpenDialog(v)} />
    </div>
  );
};

export default Hero;
