import { GlobalStyle } from "./style";
import { IconStyle } from "./assets/iconfont/iconfont";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import store from "./store";
import { Provider } from "react-redux";

function App() {
  return (
    <Provider store={store}>
      <GlobalStyle></GlobalStyle>
      <IconStyle></IconStyle>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
