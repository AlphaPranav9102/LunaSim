import NextAuth from "next-auth";
import Providers from "next-auth/providers";

const options = {
  providers: [
    Providers.Google({
        clientId: "122073889595-gc6e4ck89n0nfdhccho51j2gfbcohaab.apps.googleusercontent.com",
        clientSecret: "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",
    }),
  ],
  // Add any additional NextAuth.js configuration options here
};

export default (req, res) => NextAuth(req, res, options);