
//onKeyDown
export const saveContentAfterPressEnter = (e) => {
    if (e.key === 'Enter') {
        e.preventDefault()
        e.target.blur()
    }
}

//Select all input when click
export const selectAllinLineText = (e) => {
    // e.target.focus()
    e.target.select()
}