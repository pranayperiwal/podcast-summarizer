import "../styles/global.css";
import { SessionProvider } from "next-auth/react";
import { ProtectedLayout } from "@/components/layout/protectedLayout";

function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <>
      <SessionProvider session={session}>
        {Component.requireAuth ? (
          <ProtectedLayout>
            <Component {...pageProps} />
          </ProtectedLayout>
        ) : (
          <Component {...pageProps} />
        )}
      </SessionProvider>
    </>
  );
}

export default App;
