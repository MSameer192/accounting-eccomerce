import CreditCardIcon from "@heroicons/react/24/outline/CreditCardIcon";
import CalendarIcon from "../../../images/icons/CalendarIcon";

function SaleReportCard({ saleReport, saleReportDay }) {
  const {
    totalSales,
    totalOrders,
    soldUnits,
    grossProfit,
    totalTaxes,
    refundedOrders,
  } = saleReport;

  return (
    <div className="card shadow-lg flex flex-col bg-base-100">
    
            <div className="flex justify-center items-center mt-5 px-4">
                <div className="font-bold text-2xl">
                {saleReportDay}</div> 
                <div>
                <CalendarIcon className={"w-6 h-6 ml-3"} />
                </div>
                </div>
    <table className="table ">
      <tbody>
        {/* <tr className="font-bold text-2xl">
          <td className="font-mono">{saleReportDay}</td>
          <td>
            <CalendarIcon className={"w-6 h-6"} />
          </td>
        </tr> */}
        <tr>
          <td>
            <div className="font-semibold">Sales</div>
            <div className="text-3xl font-semibold">
              $
              <span className="text-5xl font-extrabold tracking-tight">
                {totalSales}
              </span>
            </div>
          </td>
          {/* <th><CreditCardIcon className="w-8 h-8" /></th> */}
          <th></th>
        </tr>
        <tr className="font-semibold">
          <td>Orders / Units</td>
          <td>Refunds</td>
        </tr>
        <tr>
          <td>
            {totalOrders} / {soldUnits}
          </td>
          <td>{refundedOrders}</td>
        </tr>
        <tr className="font-semibold">
          <td>Gross Profit</td>
          <td>Tax Fee</td>
        </tr>
        <tr>
          <td>${grossProfit}</td>
          <td>${totalTaxes}</td>
        </tr>
      </tbody>
    </table>
    </div>
  );
}

export default SaleReportCard;
