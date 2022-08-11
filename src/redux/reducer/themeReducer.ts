import { THEME, ITheme } from "../types/themeType";


const themeReducer = (state: boolean = false, action :ITheme) :boolean => {
   switch(action.type) {
      case THEME:
         return action.payload;
      default:
         return state;
   }
}

export default themeReducer;
