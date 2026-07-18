            import dbConnect from "@/lib/dbConnect";
            import userModel from "@/model/User-model";
            import bcrypt from "bcryptjs";
            import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
            

            export async function POST(request: Request) {
                await dbConnect();
                try {
                    const { name,username, email, password } = await request.json()
                    const existingUserVerifiedByUsername = await userModel.findOne({
                        username,
                        isVerified: true
                    })



                    if (existingUserVerifiedByUsername) {
                        return Response.json( 
                        { success: false, message: "user Already exist",},
                        { status: 400 }
                    )
                    }

                    const exisitngUserByEmail = await userModel.findOne({ email })
                    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()


                    if (exisitngUserByEmail) {
                        if (exisitngUserByEmail.isVerified) {
                            return Response.json( 
                        { success: false, message: "User already exist with this email ",},
                        { status: 500})
                            
                        } else {
                            const hashedPasswoord = await bcrypt.hash(password, 10);
                            const expiryDate = new Date();
                        expiryDate.setHours(expiryDate.getHours() + 3)
                            exisitngUserByEmail.password = hashedPasswoord;
                            exisitngUserByEmail.verifyCode = verifyCode;
                            exisitngUserByEmail.verifyCodeExpiry = expiryDate;
                            await exisitngUserByEmail.save()
                        }




                    } else {
                        const hashedPasswoord = await bcrypt.hash(password, 10)
                        const expiryDate = new Date();
                        expiryDate.setHours(expiryDate.getHours() + 3)

                        const newUser = new userModel({
                            name,
                            username,
                                email,
                            password: hashedPasswoord,
                            verifyCode: verifyCode,
                            isVerified: false,
                            verifyCodeExpiry: expiryDate,
                            isAcceptingMessages: true,
                            message: []


                        })
                        await newUser.save()
                    }

                    // send verification email

                    const emailResponse = await sendVerificationEmail(
                        email,
                        username,
                        verifyCode,
                    )
                    if (!emailResponse.success) {
                         return Response.json( 
                        { success: false, message: emailResponse.message,},
                        { status: 500})
                    
                    }

                       return Response.json( 
                        { success: true, message: "User registering Sucessfully Or please verify email"},
                        { status: 200})

                    
                } catch (error) {
                    console.error("Error regesetring User",error)
                     return Response.json( 
                        { success: false, message: "Error registering User ",},
                        { status: 500})
                    
                    
                }
            }