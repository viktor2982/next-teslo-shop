import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
// import { jwt } from "../../utils";



export async function middleware(req: NextRequest, evt: NextFetchEvent) {

    const session: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!session) {
        const url = new URL(`/auth/login?p=${req.page.name}`, req.url);
        return NextResponse.redirect(url);
    }

    const validRoles = ['admin', 'super-user', 'SEO'];

    if (!validRoles.includes(session.user.role)) {
        const url = new URL('/', req.url);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();    
}