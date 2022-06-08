import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
// import { jwt } from "../../utils";



export async function middleware(req: NextRequest, evt: NextFetchEvent) {

    // const { token = '' } = req.cookies;

    // try {
    //     await jwt.isValidToken(token);
    //     return NextResponse.next();
    // } catch (error) {
    //     const url = new URL(`/auth/login?p=${req.page.name}`, req.url);
    //     return NextResponse.redirect(url);
    // }

    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    console.log({session});

    if (!session) {
        const url = new URL(`/auth/login?p=${req.page.name}`, req.url);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();    
}