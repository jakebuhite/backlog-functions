/* eslint-disable */
// Map an array to an object with <IDs, true>
function mapIdArray(arr) {
    const result = {};
    arr.forEach((e) => { result[e] = true; });
    return result;
}

module.exports = { mapIdArray };