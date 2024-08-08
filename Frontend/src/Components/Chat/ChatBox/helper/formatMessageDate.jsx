import moment from 'moment';

export const formatMessageDate = (dateString) => {
    const messageDateString = moment(dateString)
    const messageDate = moment(dateString).startOf('day');
    const now = moment().startOf('day');;

    const isSameDay = now.isSame(messageDate, 'day');
    const isYesterday = now.diff(messageDate, 'day') === 1;

    if (isSameDay) {
        return messageDateString.format('hh:mm A');
    } else if (isYesterday) {
        return 'Yesterday';
    } else {
        return messageDate.format('DD-MM-YYYY');
    }
};


export const groupedMessageDate = (dateString) => {
    const messageDate = moment(dateString).startOf('day');
    const now = moment().startOf('day');;

    const isSameDay = now.isSame(messageDate, 'day');
    const isYesterday = now.diff(messageDate, 'day') === 1;

    if (isSameDay) {
        return ('Today');
    } else if (isYesterday) {
        return 'Yesterday';
    } else {
        return messageDate.format('DD-MM-YYYY');
    }
};


