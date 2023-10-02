import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useState } from 'react'

export default function BasicTable({ data, columns }) {
  /* 
{
    "id": 1,
    "first_name": "Isador",
    "last_name": "Kruger",
    "email": "ikruger0@huffingtonpost.com",
    "gender": "Male",
    "dob": "2023-04-28T11:19:35Z"
  }
*/

  const [sorting, setSorting] = useState([])
  const [filtering, setFiltering] = useState('')

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting: sorting,
      globalFilter: filtering,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
  })

  return (
    <>
      <div className='flex justify-end'>
        <input
          type='search'
          value={filtering}
          onChange={e => setFiltering(e.target.value)}
          placeholder='Search'
          className='input input-sm input-bordered w-full max-w-[13rem] mb-5 border'
        />
      </div>
      <div className='overflow-x-auto w-full'>
        <table className='table w-full'>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {header.isPlaceholder ? null : (
                      <div className='cursor-pointer'>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {
                          { asc: <><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="inline-block ml-2 w-3 h-3">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                        </svg>
                        </>, desc: <><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="inline-block ml-2 w-3 h-3">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                        </> }[
                            header.column.getIsSorted() ?? null
                          ]
                        }
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
  
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          {/* <tfoot>
            {table.getFooterGroups().map(footerGroup => (
              <tr key={footerGroup.id}>
                {footerGroup.headers.map(header => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </tfoot> */}
        </table>
        {
          table.getPageCount() > 1 && (
            <>
              <div className='join flex justify-end my-3'>
                <button className='join-item btn btn-sm btn-outline' onClick={() => table.setPageIndex(0)}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
                  </svg>
                </button>
                <button
                  disabled={!table.getCanPreviousPage()}
                  onClick={() => table.previousPage()}
                  className='join-item btn btn-sm btn-outline' 
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
                <button
                  disabled={!table.getCanNextPage()}
                  onClick={() => table.nextPage()}
                  className='join-item btn btn-sm btn-outline' 
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </button>
                <button className='join-item btn btn-sm btn-outline'  onClick={() => table.setPageIndex(table.getPageCount() - 1)}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>
              <div className='join flex justify-center my-5 flex-wrap'>
                <span className="flex items-center gap-1 join-item">
                  <div>Page</div>
                  <strong>
                    {table.getState().pagination.pageIndex + 1} of{' '}
                    {table.getPageCount()}
                  </strong>
                </span>
                <span className="flex items-center gap-1 join-item">
                  <span className='mx-2'>|</span>Go to page:
                  <input
                    type="number"
                    defaultValue={table.getState().pagination.pageIndex + 1}
                    onChange={e => {
                      const page = e.target.value ? Number(e.target.value) - 1 : 0
                      table.setPageIndex(page)
                    }}
                    className="input input-sm input-bordered max-w-[4rem]"
                  />
                </span>
                <select
                  className='select select-sm select-bordered join-item'
                  value={table.getState().pagination.pageSize}
                  onChange={e => {
                    table.setPageSize(Number(e.target.value))
                  }}
                >
                  {[10, 20, 30, 40, 50].map(pageSize => (
                    <option key={pageSize} value={pageSize}>
                      Show {pageSize}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )
        }
      </div>
    </>
  )
}
