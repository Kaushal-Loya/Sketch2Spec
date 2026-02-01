import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Can add custom logic here if needed
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/history/:path*',
    '/profile/:path*',
    '/preview/:path*',
  ],
}
