import { configureStore } from "@reduxjs/toolkit";
import { newsSlice } from "@/redux/news-slice";

export default configureStore({
  reducer: {
    news: newsSlice.reducer,
  },
});
