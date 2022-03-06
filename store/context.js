import {createContext,useReducer,useContext, useMemo } from "react"
const Context = createContext()
Context.displayName = 'Context'

export const useTranslationContext = () => useContext(Context)

export const ContextProvider = ({children}) => {
    const testData = 'testMessage'

       const initialState = {
           userLanguage: "DE",
           recipientLanguage: "ES",
           modeOne: 0,
           modeTwo: 0
        }

       const reducer = (state, action) => {
        switch(action.type) {
            case 'setUserLanguage' : {
                return {
                    ... state,
                    userLanguage: action.payload.userLanguage,
                    modeOne: action.payload.mode                    
                }
            }
            case 'setRecipientLanguage' : {
                return {
                    ... state,
                    recipientLanguage: action.payload.recipientLanguage,
                    modeTwo: action.payload.mode                    
                }
            }
            default: return state
        }
    }

    const [state, dispatch] = useReducer(reducer, initialState)

    const contextValue = useMemo(() => {
        return { state, dispatch };
      }, [state, dispatch])

    return (
        <Context.Provider value={contextValue}>{children}</Context.Provider>
    )    
}


//const contextProvider = ({children}) => {

    // const reducer = (state, action) => {
    //     switch(action.type) {
    //         case 'setUserLanguage' : {
    //             return {
    //                 ... state,
    //                 userLanguage: action.payload.userLanguage,
    //                 modeOne: action.payload.mode                    
    //             }
    //         }
    //         case 'setRecipientLanguage' : {
    //             return {
    //                 ... state,
    //                 recipientLanguage: action.payload.recipientLanguage,
    //                 modeTwo: action.payload.mode                    
    //             }
    //         }
    //     }
    // }
    // const initialState = {
    //     userLanguage: "DE",
    //     recipientLanguage: "ES",
    //     modeOne: 0,
    //     modeTwo: 0
    // }

//     const [state, dispatch] = useReducer(reducer, initialState)


//   return (
//     <Context.Provider value={{state,dispatch}}>{children}</Context.Provider>
//   )
// }
// console.log(Context)
// export {contextProvider,Context}