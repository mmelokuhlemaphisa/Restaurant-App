import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "../src/store";
import {PaystackProvider} from 'react-native-paystack-webview';

const PUBLIC_PAYSTACK_KEY = "pk_test_b5f1d203fd28f9e460852c6b5c9ac0ee17917348";
export default function RootLayout() {
  return (
    <Provider store={store}>
      <PaystackProvider publicKey={PUBLIC_PAYSTACK_KEY}>
        <Stack screenOptions={{ headerShown: false }} />
      </PaystackProvider>
    </Provider>
  );
}
