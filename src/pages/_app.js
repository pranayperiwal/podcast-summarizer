import "../styles/global.css";
import { SessionProvider } from "next-auth/react";
import { ProtectedLayout } from "@/components/layout/protectedLayout";
import PostAuthLayout from "@/components/layout/postAuthLayout";
import PreAuthLayout from "@/components/layout/preAuthLayout";
import { Provider } from "jotai";
import Head from "next/head";

const App = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <>
      <Provider>
        <SessionProvider session={session}>
          <Head>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
          </Head>
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
      </Provider>
    </>
  );
};

export default App;
