const ROUTES = {
  HOME: "/",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  QUESTION: (id: string) => `/questions/${id}`,
  TAGS: (id: string) => `/tags/${id}`,
  PROFILE: (id: string) => `/profile/${id}`,
  ASK_QUESTION: "/ask-question",
  SIGN_IN_WITH_OAUTH: "sign-in-with-oauth",
};

export default ROUTES;
