import { useEffect, useState } from "react";
import TitleCard from "../../../components/Cards/TitleCard";
import BasicTable from "../../../components/Table/BasicTable";
import instance from "../../../utils/axios-config";


function OrderTable({}){
    const [getProductWiseReport, setGetProductWiseReport] = useState([])

    // Get purchaseOrder
    async function purchaseOrder(fromDate, toDate) {
        // const response = await instance.get(process.env.REACT_APP_BASE_URL + `/getProductWiseReportSalesOrdersWithinDateRange?fromDate=2023-09-16&toDate=2023-09-29`)
        const response = await instance.get(process.env.REACT_APP_BASE_URL + `/getSalesOrdersWithinDateRange?fromDate=${fromDate}&toDate=${toDate}`)
        setGetProductWiseReport(response.data?.data);
    }

    useEffect(() => {
        purchaseOrder("2023-09-16", "2023-09-29")
    },[])


    const purchaseOrderColum = [
        {
            header: 'Order Id',
            accessorKey: 'id',
          },
          {
            header: 'Total Price',
            accessorKey: 'totalPrice',
          },
          {
            header: 'Date',
            accessorKey: 'date',
          },
          {
            header: 'Status',
            accessorKey: 'Completed',
          },
          {
            header: 'Tax Fee',
            accessorKey: 'taxFee',
          },
          {
            header: 'Unit Sold',
            accessorKey: 'unitSold',
          },
          {
            header: 'COGs',
            accessorKey: 'costOfGoods',
          },
          {
            header: 'Profit',
            accessorKey: 'profit',
          },
        // {
        // header: '', 
        // accessorKey: '',
        // id: 'actions',
        // cell: ({row}) => (<>
        //         <button className="btn btn-square btn-ghost" onClick={() => editCurrentPurchaseOrder(row.index, row.original)}><PencilSquareIcon className="w-5"/></button>
        //         <button className="btn btn-square btn-ghost" onClick={() => deleteCurrentPurchaseOrder(row.index, row.original.id)}><TrashIcon className="w-5"/></button>
        // </>)
        // },
    ]

    return(
        <TitleCard title="Orders" topMargin="mt-2" >

                <BasicTable data={getProductWiseReport} columns={purchaseOrderColum} />

            </TitleCard>
    )
}

export default OrderTable
