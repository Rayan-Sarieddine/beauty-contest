import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: "",
  user_id: "",
  fullName: "",
  userType: "",
  image: "",
  token: "",
};

export const userSliceName = "User";

export const userSlice = createSlice({
  name: userSliceName,
  initialState,
  reducers: {
    loggedIn: (state, { payload }) => {
      const { email, user_id, fullName, userType, image, token } = payload;

      return {
        email,
        user_id,
        fullName,
        userType,
        image,
        token,
      };
    },
    cleanData: () => {
      return { ...initialState };
    },
    updateImage: (state, { payload }) => {
      const { image } = payload;
      return { ...state, image };
    },
  },
});

export const { loggedIn, cleanData, updateImage } = userSlice.actions;

export default userSlice.reducer;
