export const HOME = '/';
export const AUTH = '/auth';
export const LOGIN = `${AUTH}/login`;
export const REGISTER = `${AUTH}/register`;
export const CATALOG = '/catalog';
export const CATALOG_SHOW_ITEM = `${CATALOG}/:id`;
const PROFILE = '/profile';
export const PROFILE_ITEMS = `${PROFILE}/items`;
export const PROFILE_ITEMS_CREATE = `${PROFILE}/items/create`;
export const PROFILE_ITEMS_SHOW = `${PROFILE}/items/:id`;
export const PROFILE_NFTS = `${PROFILE}/nfts`;
export const PROFILE_NFTS_SHOW = `${PROFILE}/nfts/:id`;

export default {
  HOME,
  AUTH,
  LOGIN,
  REGISTER,
  CATALOG,
  CATALOG_SHOW_ITEM,
  PROFILE_ITEMS,
  PROFILE_ITEMS_CREATE,
  PROFILE_ITEMS_SHOW,
  PROFILE_NFTS,
  PROFILE_NFTS_SHOW,
};
