export const validateForm = (data, setFormErrors)=>{

    let testForDisabledChar = {
        firstName:data?.firstName,
        lastName:data?.lastName,
    }

    const errors = {};

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const canadianPostalCode = /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/;
    const usaZipCode = /^\d{5}(?:-\d{4})?$/;
    const usPhoneNumber = /^\d{10}$/;
    const canadaPhoneNumber = /^[2-9]\d{9}$/;
    const disallowedChars = /^[^;:!@#$%^*+?\\/<>1234567890]+$/;
    const mobileNumber = /^\+?[0-9()-.\s]+$/;


    if(data){
        Object.keys(data)?.map((formD)=>{
            let key = formD
            let val = data[formD]
            if(val!==undefined ){
                if( val=="" ){
                    errors[key] = `${formD} is required`
                }
            }else{
                errors[key] = `${formD} is required`
            }
        })

    
    Object.keys(testForDisabledChar)?.map((formD)=>{
        let key = formD
        let val =  data[formD]

        if(val!==undefined){
            if(!disallowedChars.test(val)){
                errors[key] = `${formD} is invalid.`
            }
        }
    })

     if(!emailPattern.test(data?.email)){
        errors.email="Invalid email"
     }

    if(data?.country==="CA"){
        if(!canadianPostalCode.test(data?.postalCode)){
            errors.postalCode="Invalid Postal Code"
        }
        if(!canadaPhoneNumber.test(data?.mobile)){
            errors.mobile = "Invalid Mobile Number"
        }
    }else if(data?.country==="US"){
        if(!usaZipCode.test(data?.postalCode)){
            errors.postalCode="Invalid Postal Code"
        }
        if(!usPhoneNumber.test(data?.mobile)){
            errors.mobile = "Invalid Mobile Number"
        }
    }else{
        if(!mobileNumber.test(data?.mobile)){
            errors.mobile = "Invalid Mobile Number"
        }
    }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
}

export const generalForm = (data, setFormErrors)=>{
    const errors = {};
    if(data){
        Object.keys(data)?.map((formD)=>{
            let key = formD
            let val = data[formD]

            if(val!==undefined ){
                if( val=="" ){
                    errors[key] = `${formD} is required`
                }
            }else{
                errors[key] = `${formD} is required`
            }
        })
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
}