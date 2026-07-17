import {z} from "zod"


export  const signInSchemas=z.object({
    identifire:z.string(),
    password:z.string(),
})