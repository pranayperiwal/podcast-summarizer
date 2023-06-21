import "../styles/global.css";
import { SessionProvider as AuthProvider } from "next-auth/react";

function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <>
      <AuthProvider session={session}>
        <Component {...pageProps} />
      </AuthProvider>

      {/* <Toaster /> */}
    </>
  );
}

export default App;
