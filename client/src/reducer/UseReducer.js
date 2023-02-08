export const initialState = false;
export const reducer = (state, action) => {
    if (action.type === "USER")
        return action.payload;
    return state;
}

export const initialToken = '';
export const tokenReducer = (state, action) => {
    if (action.type === 'CHANGE')
        return action.payload;
    return state;
} 