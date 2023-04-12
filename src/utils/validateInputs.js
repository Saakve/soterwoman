class FormatError extends Error {
    constructor(message, param) {
        super(message)
        this.name = "FormatError"
        this.param = param
    }
}

/**
 * 
 * @param {String} value 
 * @param {String} paramOfException 
 */
export function validateOnlyString(value, paramOfException) {
    if(!(/^[A-Za-z]{3,}(\s[A-Za-z]+)*$/.test(value))) throw new FormatError('Solo letras', paramOfException)    
}

/**
 * Inclusive bounds
 * @param {String} stringToValidate
 * @param {Number} min 
 * @param {Number} max 
 * @param {String} paramOfException 
 */
export function validateMaxMinLengthOfString(stringToValidate, min, max, paramOfException ) {
    if(stringToValidate.length < min) throw new FormatError(`Mínimo ${min} letras`, paramOfException)
    if(stringToValidate.length > max) throw new FormatError('Longitud máxima rebasada', paramOfException)
}

/**
 * 
 * @param {String} value 
 * @param {String} paramOfException 
 */
export function validateOnlyNumbers(value, paramOfException ) {
    if(!(/^[0-9]+$/.test(value))) throw new FormatError('Solo números', paramOfException)
}

export function validateName(name) {
    validateMaxMinLengthOfString(name, 3, 150, 'name')
    validateOnlyString(name, 'name')
}

export function validatePhone(phone, paramOfException = 'phone') {
    if(phone.length !== 10) throw new FormatError('Deben ser 10 números', paramOfException)
    validateOnlyNumbers(phone, paramOfException)
}

export function validateEmail(email) {
    validateMaxMinLengthOfString(email, 3, 255, 'email')
    if(!(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+$/.test(email))) throw new FormatError('Formato inválido','email')
}

export function validatePassword(password) {
    validateMaxMinLengthOfString(password, 6, 150, 'password')
}

//licenseplate
export function validateCity(city) {
    validateMaxMinLengthOfString(city, 3, 150, 'city')
    validateOnlyString(city, 'city')
}

export function validateModel(model) {
    validateMaxMinLengthOfString(model, 2, 50, 'model')
}

export function validateBrand(brand) {
    validateMaxMinLengthOfString(brand, 2, 50, 'brand')
}

export function validateYear(year) {
    validateOnlyNumbers(year, 'year')
    if(year >= 1900) throw new FormatError('Año inválido', 'year')
}

export function validateDrivinglicense(drivinglicense) {    
    if(drivinglicense.length !== 12) throw new FormatError('Deben ser 12 caracteres alfanuméricos', 'drivinglicense')
    if(!(/^[A-Za-z0-9]{12}$/.test(drivinglicense))) throw new FormatError('Solo caracteres alfanuméricos', 'drivinglicense')
}

export function validateEmailAndPassword(email, password) {
    validateEmail(email)
    validatePassword(password)
}

