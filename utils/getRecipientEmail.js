import React from 'react'

const getRecipientEmail = (users, userLoggedIn) => {
     const recipientEmail = users?.filter(userToFilter => userToFilter !== userLoggedIn?.email)[0]
     console.log(recipientEmail)
     return recipientEmail
}

export default getRecipientEmail