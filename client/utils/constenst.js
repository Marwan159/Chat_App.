export const HOST = "http://localhost:2000";
//========================================================================================//
//========================================================================================//
export const API_ROUTES_AUTH = "/api/auth";
export const SIGNUP_ROUTE = `${API_ROUTES_AUTH}/signup`;
export const LOGGIN_ROUTE = `${API_ROUTES_AUTH}/loggin`;
export const GET_USERDATA_ROUTE = `${API_ROUTES_AUTH}/user-info`;
export const UPDATE_USERDATE_ROUTE = `${API_ROUTES_AUTH}/user-update`;
export const UPDATE_IMAGEUSER_ROUTE = `${API_ROUTES_AUTH}/image-update`;
export const DELETE_IMAGEUSER_ROUTE = `${API_ROUTES_AUTH}/image-delete`;
export const LOGGOUT_ROUTE = `${API_ROUTES_AUTH}/loggout`;
// ========================================================================================//
// ========================================================================================//
export const API_ROUTES_CONTACTS = "/api/contacts";
export const SEARCH_CONTACTS_ROUTES = `${API_ROUTES_CONTACTS}/search`;
export const GET_ALL_CONTACTS_FOR_DM = `${API_ROUTES_CONTACTS}/get-all-contacts`;
export const GET_ALL_CONTACTS_FOR_CHANNEL = `${API_ROUTES_CONTACTS}/get-all-contacts-for-channel`;
// export const GET_ALL_CONTACTS_FOR_CHANNEL = `${API_ROUTES_CONTACTS}/get-all-contacts-for-channel`;
// ========================================================================================//
// ========================================================================================//
export const API_ROUTES_MESSAGES = "/api/messages";
export const GET_ALL_MESSAGES = `${API_ROUTES_MESSAGES}/get-all-messages`;
export const UPLOAD_FILE = `${API_ROUTES_MESSAGES}/upload-files`;
// ========================================================================================//
// ========================================================================================//
export const API_ROUTES_CHANNEL = "/api/channel";
export const CREATE_CHANNEL = `${API_ROUTES_CHANNEL}/create-channel`;
export const GET_USER_CHANNELS = `${API_ROUTES_CHANNEL}/get-user-channels`;
export const GET_CHANNEL_MESSAGES = `${API_ROUTES_CHANNEL}/get-channel-messages`;
