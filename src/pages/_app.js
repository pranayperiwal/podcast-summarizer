import "../styles/global.css";
import { SessionProvider } from "next-auth/react";
import { ProtectedLayout } from "@/components/layout/protectedLayout";
import PostAuthLayout from "@/components/layout/postAuthLayout";
import PreAuthLayout from "@/components/layout/preAuthLayout";

const App = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <>
      <SessionProvider session={session}>
        {Component.requireAuth ? (
          <ProtectedLayout>
            <PostAuthLayout>
              <Component {...pageProps} />
            </PostAuthLayout>
          </ProtectedLayout>
        ) : (
          <PreAuthLayout>
            <Component {...pageProps} />
          </PreAuthLayout>
        )}
      </SessionProvider>
    </>
  );
};

export default App;
