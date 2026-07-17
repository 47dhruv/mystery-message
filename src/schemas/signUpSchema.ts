import {email, z} from "zod"

export const usernameValidation=z
     .string()
     .min(2,"Username must be atLeast 2 chracter")
     .max(20,"Username must be not more than 20 chracter")
     .regex(/^[a-zA-Z0-9_]{3,20}$/,"Enter valid username ")


     export const signUpSchema=z.object({
        username:usernameValidation,
        email:z.string().email({error:"Invalid email address"}),
        password:z.string().min(6,{error:"password be must altleast 6 chracter"})
     })