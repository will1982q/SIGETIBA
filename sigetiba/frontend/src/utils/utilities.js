export const generateDatetime = () => {
    let dateTime = new Date() 
    let year = dateTime.getFullYear()
    let month = dateTime.getMonth() + 1
    let day = dateTime.getDate()
    let hours = dateTime.getHours()
    let minutes = dateTime.getMinutes()
    let seconds = dateTime.getSeconds()
    let datetimeFull = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    return datetimeFull
}

export const generateNumberInvoice = () => {
    let datetime = new Date() 
    let year = datetime.getFullYear()
    let month = datetime.getMonth() + 1
    let day = datetime.getDate()
    let hours = datetime.getHours()
    let minutes = datetime.getMinutes()
    let seconds = datetime.getSeconds()
    let numberInvoice = `${year}${month}${day}-${hours}${minutes}${seconds}`
    return numberInvoice
}

export const validateEmptyFields = (arrFields) => {
    let message = ""
    arrFields.map((item) => {
        if(item.value === ""){
            message = "Todos los campos deben ser llenados"            
        }        
    })
    return message
}