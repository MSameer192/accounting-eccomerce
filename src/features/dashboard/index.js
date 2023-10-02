import DashboardStats from "./components/DashboardStats";
import AmountStats from "./components/AmountStats";
import PageStats from "./components/PageStats";

import UserGroupIcon from "@heroicons/react/24/outline/UserGroupIcon";
import UsersIcon from "@heroicons/react/24/outline/UsersIcon";
import CircleStackIcon from "@heroicons/react/24/outline/CircleStackIcon";
import CreditCardIcon from "@heroicons/react/24/outline/CreditCardIcon";
import UserChannels from "./components/UserChannels";
import LineChart from "./components/LineChart";
import BarChart from "./components/BarChart";
import DashboardTopBar from "./components/DashboardTopBar";
import { useDispatch } from "react-redux";
import { showNotification } from "../common/headerSlice";
import DoughnutChart from "./components/DoughnutChart";
import { useEffect, useState } from "react";
import instance from "../../utils/axios-config";
import CalendarIcon from "../../images/icons/CalendarIcon";
import SaleReportCard from "./components/SaleReportCard";
import Tabs from "./components/Tabs";
import ProductTable from "./components/ProductTable";
import OrderTable from "./components/OrderTable";
import { startOfDay, endOfDay, startOfToday, endOfToday, format } from 'date-fns';
import { endOfTheDay, endOfTheLastMonth, endOfTheWeek, endOfTheYesterday, startOfTheDay, startOfTheLastMonth, startOfTheMonth, startOfTheWeek, startOfTheYesterday } from "./services/date";

const statsData = [
  {
    title: "New Users",
    value: "34.7k",
    icon: <UserGroupIcon className="w-8 h-8" />,
    description: "↗︎ 2300 (22%)",
  },
  {
    title: "Total Sales",
    value: "$34,545",
    icon: <CreditCardIcon className="w-8 h-8" />,
    description: "Current month",
  },
  {
    title: "Pending Leads",
    value: "450",
    icon: <CircleStackIcon className="w-8 h-8" />,
    description: "50 in hot leads",
  },
  {
    title: "Active Users",
    value: "5.6k",
    icon: <UsersIcon className="w-8 h-8" />,
    description: "↙ 300 (18%)",
  },
];

function Dashboard() {
  const dispatch = useDispatch();
  const [getSaleReportToday, setGetSaleReportToday] = useState([]);
  const [getSaleReportYesterday, setGetSaleReportYesterday] = useState([]);
  const [getSaleReportThisMonth, setGetSaleReportThisMonth] = useState([]);
  const [getSaleReportLastMonth, setGetSaleReportLastMonth] = useState([]);

  const fetchSaleReport = async (fromDate, toDate, set) => {
    // const response = await instance.get(process.env.REACT_APP_BASE_URL + `/getSalesReportWithinDateRange?fromDate=2023-09-28&toDate=2023-09-29`)
    const response = await instance.get(
      process.env.REACT_APP_BASE_URL +
        `/getSalesReportWithinDateRange?fromDate=${fromDate}&toDate=${toDate}`
    );
    return set(response.data?.data);
  };

  useEffect(() => {
    fetchSaleReport(startOfTheDay, endOfTheDay, setGetSaleReportToday);
    fetchSaleReport(startOfTheYesterday, endOfTheYesterday, setGetSaleReportYesterday);
    fetchSaleReport(startOfTheMonth, endOfTheDay, setGetSaleReportThisMonth);
    fetchSaleReport(startOfTheLastMonth, endOfTheLastMonth, setGetSaleReportLastMonth);
  }, []);

  const updateDashboardPeriod = (newRange) => {
    // Dashboard range changed, write code to refresh your values
    dispatch(
      showNotification({
        message: `Period updated to ${newRange.startDate} to ${newRange.endDate}`,
        status: 1,
      })
    );
  };

  const [productTableDateRange, setProductTableDateRange] = useState('')

    const testing = ProductTable
  const updateProductAndOrder = (dateRange) => {
    // Dashboard range changed, write code to refresh your values
    // setProductTableDateRange(dateRange)
    testing(dateRange)
    // dateRange()
    // const productTesting = ProductTable(dateRange)
  };

  return (
    <>
      {/** ---------------------- Select Period Content ------------------------- */}
      <DashboardTopBar updateDashboardPeriod={updateDashboardPeriod} updateProductAndOrder={updateProductAndOrder} />

      {/** ---------------------- Different stats content 1 ------------------------- */}
      {/* <div className="grid lg:grid-cols-4 mt-2 md:grid-cols-2 grid-cols-1 gap-6">
        {statsData.map((d, k) => {
          return <DashboardStats key={k} {...d} colorIndex={k} />;
        })}
      </div> */}

      {/* <div className="grid lg:grid-cols-4 mt-2 md:grid-cols-2 grid-cols-1 gap-6"> */}
      <div className="flex justify-start gap-6 flex-wrap mt-6">
        <SaleReportCard saleReport={getSaleReportToday} saleReportDay="Today"/>
        <SaleReportCard saleReport={getSaleReportYesterday} saleReportDay="Yesterday"/>
        <SaleReportCard saleReport={getSaleReportThisMonth} saleReportDay="Month to Date"/>
        <SaleReportCard saleReport={getSaleReportLastMonth} saleReportDay="Last Month"/>
      </div>

      <div>
        <Tabs ProductTable={ProductTable} OrderTable={OrderTable}/>
      </div>

      {/** ---------------------- Different charts ------------------------- */}
      <div className="grid lg:grid-cols-2 mt-4 grid-cols-1 gap-6">
        <LineChart />
        <BarChart />
      </div>

      {/** ---------------------- Different stats content 2 ------------------------- */}

      <div className="grid lg:grid-cols-2 mt-10 grid-cols-1 gap-6">
        <AmountStats />
        <PageStats />
      </div>

      {/** ---------------------- User source channels table  ------------------------- */}

      <div className="grid lg:grid-cols-2 mt-4 grid-cols-1 gap-6">
        <UserChannels />
        <DoughnutChart />
      </div>
    </>
  );
}

export default Dashboard;
