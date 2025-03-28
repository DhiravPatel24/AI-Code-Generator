import Image from 'next/image'
import React, { useContext } from 'react'
import { Button } from '../ui/button'
import Colors from '@/data/Colors'
import { UserDetailContext } from '@/context/UserDetailContext'
import { useGoogleLogin } from '@react-oauth/google'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import axios from 'axios'
import uuid4 from 'uuid4'

const Header = () => {
  const{userDetail, setUserDetail} = useContext(UserDetailContext);
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
      window.location.reload(); 
    },
    onError: (errorResponse) => console.log(errorResponse),
  });

  return (
    <div className='p-4 flex justify-between items-center'>
     <Image src={'/logo1.png'} alt="logo" width={100} height={100} />
     {!userDetail?.name &&
     <div className='flex gap-5'>
      <div onClick={googleLogin}>
        <Button variant='ghost'>Sign In</Button>
      </div>
        <Button className='text-white'
        style={{backgroundColor:Colors.BLUE}}
        >Get Started</Button>
     </div>
     }
    </div>
  )
}

export default Header
