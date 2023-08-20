import { configureStore } from "@reduxjs/toolkit";
import accountSliceReducer from "./slices/accountSlice";
import createDAOModadlSliceReducer from "./slices/createDAOSlice";

export const store = configureStore({
  reducer: {
    account: accountSliceReducer,
    createDAOModalManage: createDAOModadlSliceReducer,
  },
});
