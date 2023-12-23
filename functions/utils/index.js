/* eslint-disable */
// Map an array to an object with <IDs, true>
function mapIdArray(arr) {
    const result = {};
    arr.forEach((e) => { result[e] = true; });
    return result;
}

function replaceSpaces(inputString) {
    return inputString.replace(/ /g, "%20");
}

module.exports = { mapIdArray, replaceSpaces };