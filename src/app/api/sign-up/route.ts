            import dbConnect from "@/lib/dbConnect";
            import userModel from "@/model/User-model";
            import bcrypt from "bcryptjs";
            import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
            import { ApiResponse } from "@/types/apiResponse";

            export async function POST(request: Request): Promise<ApiResponse> {
                await dbConnect();
                try {
                    const { username, email, password } = await request.json()
                    const existingUserVerifiedByUsername = await userModel.findOne({
                        username,
                        isVerified: true
                    })


                    
                    if (existingUserVerifiedByUsername) {
                        return { success: true, message: "user Already exist", status: 200 }
                    }

                    const exisitngUserByEmail = await userModel.findOne({ email })
                    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()


                    if (exisitngUserByEmail) {
                        if (exisitngUserByEmail.isVerified) {
                            return { success: false, message: " User already exist with this email ", status: 500 }
                        } else {
                            const hashedPasswoord = await bcrypt.hash(password, 10);
                            exisitngUserByEmail.password = hashedPasswoord;
                            exisitngUserByEmail.verifyCode = verifyCode;
                            exisitngUserByEmail.verifyCodeExpiry = new Date(Date.now() * (3 * 3600000));
                            await exisitngUserByEmail.save()
                        }




                    } else {
                        const hashedPasswoord = await bcrypt.hash(password, 10)
                        const expiryDate = new Date();
                        expiryDate.setHours(expiryDate.getHours() + 3)

                        const newUser = new userModel({
                            name: String,
                            username:
                                email,
                            password: hashedPasswoord,
                            verifyCode: verifyCode,
                            isVerified: false,
                            verifyCodeExpiry: expiryDate,
                            isAcceptingMessages: true,
                            message: [],
                            createdAt: Date.now(),
                            updatedAt: Date.now(),


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
                        return { success: false, message: emailResponse.message, status: 500 }
                    }



                    return { success: true, message: "User regestering Sucessfully Or please verify email", status: 200 }
                } catch (error) {
                    console.error("Error regesetring User")
                    return { success: false, message: "Error regestering User", status: 500 }
                }
            }