const DateService = {
    formatLocalDateTime: (javaLocalDateTimeString) => {
        const date = new Date(javaLocalDateTimeString);
        const formattedDate = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear().toString()}`;
        const formattedTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
        return `${formattedDate} ${formattedTime}`;
    }
}

export default DateService;