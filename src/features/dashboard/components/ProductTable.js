import { useEffect, useState } from "react";
import TitleCard from "../../../components/Cards/TitleCard"
import BasicTable from "../../../components/Table/BasicTable"
import instance from "../../../utils/axios-config";


function ProductTable({dateRange}){

    const [getProductWiseReport, setGetProductWiseReport] = useState([])

    // Get purchaseOrder
    async function purchaseOrder(fromDate, toDate) {
        // const response = await instance.get(process.env.REACT_APP_BASE_URL + `/getProductWiseReportSalesOrdersWithinDateRange?fromDate=2023-09-16&toDate=2023-09-29`)
        const response = await instance.get(process.env.REACT_APP_BASE_URL + `/getProductWiseReportSalesOrdersWithinDateRange?fromDate=${fromDate}&toDate=${toDate}`)
        setGetProductWiseReport(response.data?.data);
    }

    useEffect(() => {
        purchaseOrder("2023-09-16", "2023-09-29")
        // purchaseOrder(dateRange.fromDate, dateRange.toDate)
    },[])


    const purchaseOrderColum = [
        {
            header: 'Product Name',
            accessorKey: 'productDetails.name',
          },
          {
            header: 'Total COGs',
            accessorKey: 'totalCostOfGoods',
          },
          {
            header: 'Total Sales',
            accessorKey: 'totalSales',
          },
          {
            header: 'Quantity Sold',
            accessorKey: 'quantitySold',
          },
          {
            header: 'Profit',
            accessorKey: 'profit',
          },
          {
            header: 'Total Tax',
            accessorKey: 'totalTaxes',
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
        <TitleCard title="Products" topMargin="mt-2" >

                <BasicTable data={getProductWiseReport} columns={purchaseOrderColum} />

            </TitleCard>
    )
}

export default ProductTable
