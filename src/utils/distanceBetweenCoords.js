//Algorithm  from http://www.movable-type.co.uk/scripts/latlong.html
const R = 6371e3; // Earth’s radius 

function degreeToRadian(degree) {
    return degree * Math.PI/180
}

export function distanceBetweenCoords(coordOne, coordTwo) {
    const coordOneRadian = {latitude: degreeToRadian(coordOne.latitude), longitude: degreeToRadian(coordOne.longitude)}
    const coordTwoRadian = {latitude: degreeToRadian(coordTwo.latitude), longitude: degreeToRadian(coordTwo.longitude)} 
    const x = (coordTwoRadian.longitude - coordOneRadian.longitude) * Math.cos((coordOne.latitude + coordTwoRadian.latitude) / 2)
    const y = (coordTwoRadian.latitude - coordOneRadian.latitude)
    const distance = Math.sqrt(x * x + y * y) * R

    // return distance //in metres
    return 20
}