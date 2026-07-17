import {z} from "zod"


export  const messagesSchemas=z.object({
    content:z
        .string()
        .min(10,{error:"Message must be contain atleast 10 chracter"})
        .min(300,{error:"Message must be contain less than 300 chracter"})
})