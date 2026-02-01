import { withAuth } from "next-auth/middleware"

export default withAuth(
  function proxy(req) {
    // Can add custom logic here if needed
  },
  {
    callbacks: {
      authorized: () => true, // TEMP: Allow all access to debug auth flow
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
