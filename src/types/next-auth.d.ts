import "next-auth";

declare module "next-auth" {
  interface User {
    isGuest: boolean;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    isGuest: boolean;
  }
}
