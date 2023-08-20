import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  openModal: false,
};

export const CreateDAOSlice = createSlice({
  name: "createDAOModalState",
  initialState,
  reducers: {
    setModalFalse: (state) => {
      state.openModal = false;
    },
    setModalTrue: (state) => {
      state.openModal = true;
    },
  },
});

export const { setModalFalse, setModalTrue } = CreateDAOSlice.actions;

export default CreateDAOSlice.reducer;
