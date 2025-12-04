import { withAuth } from "next-auth/middleware";

export default withAuth({
    pages: {
        signIn: '/',
        error: '/auth/error'
    }
})

export const config = {
    matcher: ['/manager/:path*', '/cashier/:path*', '/customer/:path*']
}