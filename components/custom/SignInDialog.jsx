import React, { useContext } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Lookup from "@/data/Lookup";
import { useGoogleLogin } from "@react-oauth/google";
import { UserDetailContext } from "@/context/UserDetailContext";
import { Button } from "../ui/button";
import axios from "axios";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import uuid4 from "uuid4";

const SignInDialog = ({ openDialog, closeDialog }) => {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const CreateUser = useMutation(api.users.CreateUser);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log(tokenResponse);
      const userInfo = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        { headers: { Authorization: "Bearer " + tokenResponse?.access_token } }
      );
      console.log(userInfo);
      const user = userInfo.data;
      await CreateUser({
        name: user?.name,
        email: user?.email,
        picture: user?.picture,
        uid:uuid4()
      })
      if(typeof window !== 'undefined'){
        localStorage.setItem('user',JSON.stringify(userInfo?.data))
      }
      setUserDetail(userInfo?.data);
      closeDialog(false);
      window.location.reload(); 
    },
    onError: (errorResponse) => console.log(errorResponse),
  });

  return (
    <Dialog open={openDialog} onOpenChange={closeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription>
            <span>{Lookup.SIGNIN_SUBHEADING}</span>
          </DialogDescription>
          <div className="flex flex-col justify-center items-center gap-3">
            <h2 className="font-bold text-2xl text-center text-white">
              {Lookup.SIGNIN_HEADING}
            </h2>
            <Button
              onClick={googleLogin}
              className="bg-blue-500 text-white hover:bg-blue-400"
            >
              Sign In with Google
            </Button>
            <p>{Lookup?.SIGNIn_AGREEMENT_TEXT}</p>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default SignInDialog;
