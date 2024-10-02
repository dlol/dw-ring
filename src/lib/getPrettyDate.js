function getPrettyDate(date) {
    let year = date.getFullYear()
    let month = String(date.getMonth() + 1).padStart(2, '0')
    let day = String(date.getDate()).padStart(2, '0')
    let hours = String(date.getHours()).padStart(2, '0')
    let minutes = String(date.getMinutes()).padStart(2, '0')
    let seconds = String(date.getSeconds()).padStart(2, '0')
    let milliseconds = String(date.getMilliseconds()).padStart(3, '0')
    let timezone = new Intl.DateTimeFormat('en-US', { timeZoneName: 'short' }).formatToParts(new Date(Date.now())).find(part => part.type === 'timeZoneName').value.trim()

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds} ${timezone}`;
}

module.exports = getPrettyDate
