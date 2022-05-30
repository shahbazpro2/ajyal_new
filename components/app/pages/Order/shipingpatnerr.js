export const initialState = 1
   

export const reducer = (state, action) => {
    switch (action.type) {
    
        case "CHANGE":
           return  action.payload
           
        default:
            return state
    }
}