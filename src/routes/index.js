import { createBrowserRouter } from "react-router-dom";
import Home from "../application/Home";
import Recommend from "../application/Recommend";
import Singers from "../application/Singers";
import Rank from "../application/Rank";
import Album from "../application/Album";
import Singer from "../application/Singer";
import Search from "../application/Search";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      {
        path: "/recommend",
        element: <Recommend />,
        children: [
          {
            path: "/recommend/:id",
            element: <Album />,
          },
        ],
      },
      {
        path: "/singers",
        element: <Singers />,
        children: [
          {
            path: "/singers/:id",
            element: <Singer />,
          },
        ],
      },
      {
        path: "/rank",
        element: <Rank />,
        children: [
          {
            path: "/rank/:id",
            element: <Album />,
          },
        ],
      },
      {
        path: "/album/:id",
        element: <Album />,
      },
      {
        path: "/search",
        element: <Search />,
      },
    ],
  },
]);
export default router;
