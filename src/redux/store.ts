import { configureStore } from '@reduxjs/toolkit';

import reducer from './bookSlice';

export default configureStore({
  reducer: {
    book: reducer,
  },
});
