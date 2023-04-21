import { AuthError } from "@supabase/supabase-js"
import { supabase } from "../services/supabase"

class FormatError extends Error {
    constructor(message, param) {
        super(message)
        this.name = "FormatError"
        this.param = param
        this.__isFormatError = true
    }
}

export function isFormatError(error){
    return typeof error === 'object' && error !== null && '__isFormatError' in error
}

/**
 * 
 * @param {String} value 
 * @param {String} paramOfException 
 */
export function validateOnlyString(value, paramOfException) {
    if (!(/^[A-Za-z]{3,}(\s[A-Za-z]+)*$/.test(value))) throw new FormatError('Solo letras', paramOfException)
}

/**
 * Inclusive bounds
 * @param {String} stringToValidate
 * @param {Number} min 
 * @param {Number} max 
 * @param {String} paramOfException 
 */
export function validateMaxMinLengthOfString(stringToValidate, min, max, paramOfException) {
    if (stringToValidate.length < min) throw new FormatError(`Mínimo ${min} letras`, paramOfException)
    if (stringToValidate.length > max) throw new FormatError('Longitud máxima rebasada', paramOfException)
}

/**
 * 
 * @param {String} value 
 * @param {String} paramOfException 
 */
export function validateOnlyNumbers(value, paramOfException) {
    if (!(/^[0-9]+$/.test(value))) throw new FormatError('Solo números', paramOfException)
}

export function validateName(name) {
    validateMaxMinLengthOfString(name, 3, 150, 'name')
    validateOnlyString(name, 'name')
}

export async function validatePhone(phone) {
    if (phone.length !== 10) throw new FormatError('Deben ser 10 números', 'phone')
    validateOnlyNumbers(phone, 'phone')
    const { data } = await supabase.rpc("phoneExists", { phonetoevaluate: phone })
    if(data) throw Object.defineProperty(new AuthError('Teléfono ya en uso'), 'param', {value: 'phone'})
}

export function validateEmergencyPhone(phone) {
    if (phone.length !== 10) throw new FormatError('Deben ser 10 números', 'emergencyPhone')
    validateOnlyNumbers(phone, 'emergencyPhone')
}

export function validateFormatEmail(email) {
    validateMaxMinLengthOfString(email, 3, 255, 'email')
    if (!(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+$/.test(email))) throw new FormatError('Formato inválido', 'email')    
}

export async function validateEmail(email) {
    validateFormatEmail(email)
    const { data } = await supabase.rpc("emailExists", { emailtoevaluate: email })
    if(data) throw Object.defineProperty(new AuthError('Email ya en uso'), 'param', {value: 'email'})
}

export function validatePassword(password) {
    validateMaxMinLengthOfString(password, 6, 150, 'password')
}

export function validateNewPassword(newPassword, newPasswordValidation) {
  validateMaxMinLengthOfString(newPassword, 6, 125, "newpassword");
  validateMaxMinLengthOfString(newPasswordValidation, 6, 125, "newpasswordvalidation");
}

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
    if (year < 1900) throw new FormatError('Año inválido', 'year')
}

export async function validateLicensePlate(licensePlate) {
    validateMaxMinLengthOfString(licensePlate, 3, 11, 'licensePlate')
    if (!(/^[A-Z0-9]{1,4}(-[A-Z0-9]{1,4}){1,2}$/.test(licensePlate))) throw new FormatError('Placa inválida', 'licensePlate')
    const { data } = await supabase.rpc("licensePlateExists", { licenseplatetoevaluate: licensePlate })
    if(data) throw Object.defineProperty(new AuthError('Placa ya en uso'), 'param', {value: 'licensePlate'})
}

export async function validateDrivingLicense(drivingLicense) {
    if (drivingLicense.length !== 12) throw new FormatError('Deben ser 12 caracteres alfanuméricos', 'drivingLicense')
    if (!(/^[A-Za-z0-9]{12}$/.test(drivingLicense))) throw new FormatError('Solo caracteres alfanuméricos', 'drivingLicense')
    const { data } = await supabase.rpc("drivingLicenseExists", { drivinglicensetoevaluate: drivingLicense })
    if(data) throw Object.defineProperty(new AuthError('Licensia ya en uso'), 'param', {value: 'drivingLicense'})
}

export function validateFormatEmailAndPassword(email, password) {
    validateFormatEmail(email)
    validatePassword(password)
}

export async function validateEmailAndPassword(email, password) {
    await validateEmail(email)
    validatePassword(password)
}

export async function validateProfileInputs(email, password, name, phone) {
    await validateEmailAndPassword(email, password)
    validateName(name)
    await validatePhone(phone)
}

export async function validatePassengerInputs(name, email, phone, emergencyPhone, password) {
    validateName(name)
    await validateEmail(email)
    await validatePhone(phone)
    validateEmergencyPhone(emergencyPhone)
    validatePassword(password)
}

export async function validateDriverInputs(name, email, phone, drivingLicense, city, password) {
    validateName(name)
    await validateEmail(email)
    await validatePhone(phone)
    await validateDrivingLicense(drivingLicense)
    validateCity(city)
    validatePassword(password)
}

export async function validateDrivingLicenseAndCity (drivingLicense, city) {
    await validateDrivingLicense(drivingLicense)
    validateCity(city)
}

export async function validateVehicleInputs(brand, model, year, licensePlate) {
    validateBrand(brand)
    validateModel(model)
    validateYear(year)
    await validateLicensePlate(licensePlate)
}

export async function validateDriverAndVehicleInputs(name, email, phone, drivingLicense, city, password, brand, model, year, licensePlate) {
    await validateDriverInputs(name, email, phone, drivingLicense, city, password, drivingLicense, city)
    validateBrand(brand)
    validateModel(model)
    validateYear(year)
    await validateLicensePlate(licensePlate)
}