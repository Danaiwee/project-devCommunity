const ROUTES = {
    HOME: "/",
    SIGN_IN: "/sign-in",
    SIGN_UP: "/sign-up",
    QUESTION: (id: string) => `/question/${id}`,
    TAGS: (id: string) => `/tags/${id}`,
    PROFILE: (id: string) => `/profile/${id}`,
    ASK_QUESTION: "/ask-question"
};

export default ROUTES;