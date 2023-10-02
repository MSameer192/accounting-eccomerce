import { startOfDay, endOfDay, startOfToday, endOfToday, format, startOfYesterday, endOfYesterday, startOfWeek, endOfWeek, startOfMonth, subMonths, endOfMonth } from 'date-fns';

const currentDate = new Date()

const startOfTheDay = (() => format(startOfDay(currentDate), 'yyyy-MM-dd'))()
const endOfTheDay = (() => format(endOfDay(currentDate), 'yyyy-MM-dd'))()


const startOfTheLastMonth = (() => format(startOfMonth(subMonths(currentDate, 1)), 'yyyy-MM-dd'))()
const endOfTheLastMonth = (() => format(endOfMonth(subMonths(currentDate, 1)), 'yyyy-MM-dd'))()


const startOfTheMonth = (() => format(startOfMonth(currentDate), 'yyyy-MM-dd'))()

const startOfTheWeek = (() => format(startOfWeek(currentDate), 'yyyy-MM-dd'))()
const endOfTheWeek = (() => format(endOfWeek(currentDate), 'yyyy-MM-dd'))()

const startOfTheYesterday = (() => format(startOfYesterday(currentDate), 'yyyy-MM-dd'))()
const endOfTheYesterday = (() => format(endOfYesterday(currentDate), 'yyyy-MM-dd'))()



export {
    startOfTheDay,
    endOfTheDay,
    startOfTheYesterday, 
    endOfTheYesterday,
    startOfTheWeek,
    endOfTheWeek,
    startOfTheMonth,
    startOfTheLastMonth,
    endOfTheLastMonth
}
